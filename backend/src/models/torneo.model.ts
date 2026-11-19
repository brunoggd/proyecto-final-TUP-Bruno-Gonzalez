import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";
import { createPairs, type JugadorInscripto } from "../helpers/createPairs";
import { shuffle } from "../helpers/shuffle";

export type EstadoTorneo = 'inscripcion_abierta' | 'en_curso' | 'finalizado';

export interface Torneo {
    id_torneo: number;
    id_creador: number;
    id_categoria: number;
    nombre: string;
    ubicacion: string;
    jugadores: number;
    estado: EstadoTorneo;
    montoPremio: number;
    fechaInicio: Date;
    fechaFin: Date;
}

export interface TorneoCreateInput {
    id_creador: number;
    id_categoria: number;
    nombre: string;
    ubicacion: string;
    jugadores: number;
    montoPremio: number;
    fechaInicio: string;
    fechaFin: string;
}

export interface TorneoInput {
    id_categoria: number;
    nombre: string;
    ubicacion: string;
    jugadores: number;
    montoPremio: number;
    fechaInicio: string;
    fechaFin: string;
}

interface TorneoSorteoRow extends RowDataPacket {
    jugadores: number;
    fechaInicio: string;
    estado: EstadoTorneo;
}

export interface SedeTorneo {
    ubicacion: string;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
}

interface TorneoRow extends RowDataPacket, Torneo {}
interface SedeTorneoRow extends RowDataPacket, SedeTorneo {}
interface JugadorInscriptoRow extends RowDataPacket, JugadorInscripto {}

export const torneoModel = {
    async findAll(limit: number, offset: number): Promise<PaginatedResult<Torneo>> {
        const [rows] = await pool.query<TorneoRow[]>(
            `SELECT * FROM torneos ORDER BY id_torneo LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        const [countRows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) AS total FROM torneos`
        );

        return {
            data: rows,
            total: Number(countRows[0].total)
        };
    },

    async findById(id: number): Promise<Torneo | null> {
        const [rows] = await pool.query<TorneoRow[]>(
            `SELECT * FROM torneos WHERE id_torneo = ?`,
            [id]
        );

        return rows[0] ?? null;
    },

    async filter(nombre?: string, categoria?: string, sede?: string, limit = 10, offset = 0, idCreador?: number): Promise<PaginatedResult<Torneo>> {
        let consulta = `FROM torneos t LEFT JOIN categorias c ON c.id_categoria = t.id_categoria WHERE 1 = 1`;

        const params: (string | number)[] = [];

        if (nombre) {
            consulta += ` AND t.nombre LIKE ?`;
            params.push(`%${nombre}%`);
        }

        if (categoria) {
            consulta += ` AND c.nombre = ?`;
            params.push(categoria);
        }

        if (sede) {
            consulta += ` AND t.ubicacion = ?`;
            params.push(sede);
        }

        if (idCreador !== undefined) {
            consulta += ` AND t.id_creador = ?`;
            params.push(idCreador);
        }

        const [rows] = await pool.query<TorneoRow[]>(
            `SELECT t.* ${consulta} ORDER BY t.id_torneo LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countRows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) AS total ${consulta}`,
            params
        );

        return {
            data: rows,
            total: Number(countRows[0].total)
        };
    },

    async getLocations(): Promise<SedeTorneo[]> {
        const [rows] = await pool.query<SedeTorneoRow[]>(
            `SELECT DISTINCT ubicacion FROM torneos`
        );

        return rows;
    },

    async create(data: TorneoCreateInput): Promise<Torneo> {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO torneos (id_creador, id_categoria, nombre, ubicacion, jugadores, montoPremio, fechaInicio, fechaFin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id_creador,
                data.id_categoria,
                data.nombre,
                data.ubicacion,
                data.jugadores,
                data.montoPremio,
                data.fechaInicio,
                data.fechaFin
            ]
        );

        const [rows] = await pool.query<TorneoRow[]>(
            `SELECT * FROM torneos WHERE id_torneo = ?`,
            [result.insertId]
        );

        if (!rows[0]) {
            throw new Error('TORNEO_NO_ENCONTRADO_DESPUES_DE_CREAR');
        }

        return rows[0];
    },

    async generarSorteo(idTorneo: number
    ): Promise<| { estado: 'TORNEO_NO_ENCONTRADO' } | { estado: 'SORTEO_YA_GENERADO' } | { estado: 'INSCRIPTOS_INSUFICIENTES'; inscriptos: number; capacidad: number } | { estado: 'SORTEO_GENERADO'; partidos: number }> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [torneos] = await connection.query<TorneoSorteoRow[]>(
                `SELECT jugadores, estado, DATE_FORMAT(fechaInicio, '%Y-%m-%d') AS fechaInicio FROM torneos WHERE id_torneo = ? FOR UPDATE`, [idTorneo]
            );

            if (torneos.length === 0) {
                await connection.rollback();
                return { estado: 'TORNEO_NO_ENCONTRADO' };
            }

            const torneo = torneos[0];

            if (torneo.estado !== 'inscripcion_abierta') {
                await connection.rollback();
                return { estado: 'SORTEO_YA_GENERADO' };
            }

            const capacidad = Number(torneo.jugadores);

            const [conteo] = await connection.query<RowDataPacket[]>(
                `SELECT COUNT(*) AS total FROM inscripciones WHERE id_torneo = ?`,
                [idTorneo]
            );

            const totalInscriptos = Number(conteo[0].total);

            if (totalInscriptos < capacidad) {
                await connection.rollback();
                return {
                    estado: 'INSCRIPTOS_INSUFICIENTES',
                    inscriptos: totalInscriptos,
                    capacidad
                };
            }

            const [jugadores] = await connection.query<JugadorInscriptoRow[]>(
                `SELECT i.id_inscripcion, p.id_persona, p.nombre, p.apellido, p.email
                FROM inscripciones i
                INNER JOIN personas p ON p.id_persona = i.id_persona
                WHERE i.id_torneo = ?
                ORDER BY i.id_persona`,
                [idTorneo]
            );

            if (jugadores.length !== capacidad) {
                throw new Error('CANTIDAD_INSCRIPTOS_INESPERADA');
            }

            const partidos = createPairs(shuffle(jugadores));

            for (const [index, pareja] of partidos.entries()) {
                const [resultado] = await connection.query<ResultSetHeader>(
                    `INSERT INTO partidos
                    (id_torneo, ganador, fecha, hora, numero_ronda, numero_partido)
                    VALUES (?, NULL, ?, '12:00:00', 1, ?)`,
                    [idTorneo, torneo.fechaInicio, index + 1]
                );

                await connection.query(
                    `INSERT INTO participaciones (id_partido, id_persona)
                    VALUES (?, ?), (?, ?)`,
                    [
                        resultado.insertId,
                        pareja.player1.id_persona,
                        resultado.insertId,
                        pareja.player2.id_persona
                    ]
                );
            }

            await connection.query(
                `UPDATE torneos SET estado = 'en_curso' WHERE id_torneo = ?`,
                [idTorneo]
            );

            await connection.commit();

            return {
                estado: 'SORTEO_GENERADO',
                partidos: partidos.length
            };

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    },

    async update(id: number, data: TorneoInput): Promise<'TORNEO_NO_ENCONTRADO' | 'CAPACIDAD_BLOQUEADA' | 'TORNEO_ACTUALIZADO'> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [torneos] = await connection.query<RowDataPacket[]>(
                `SELECT jugadores FROM torneos WHERE id_torneo = ? FOR UPDATE`,
                [id]
            );

            if (torneos.length === 0) {
                await connection.rollback();
                return 'TORNEO_NO_ENCONTRADO';
            }

            const [inscripciones] = await connection.query<RowDataPacket[]>(
                `SELECT COUNT(*) AS total FROM inscripciones WHERE id_torneo = ?`,
                [id]
            );

            const yaHayInscriptos = Number(inscripciones[0].total) > 0;
            const cambioElCupo = Number(data.jugadores) !== Number(torneos[0].jugadores);

            if (yaHayInscriptos && cambioElCupo) {
                await connection.rollback();
                return 'CAPACIDAD_BLOQUEADA';
            }

            await connection.query<ResultSetHeader>(
                `UPDATE torneos
                    SET id_categoria = ?, nombre = ?, ubicacion = ?, jugadores = ?,
                        montoPremio = ?, fechaInicio = ?, fechaFin = ?
                    WHERE id_torneo = ?`,
                [
                    data.id_categoria,
                    data.nombre,
                    data.ubicacion,
                    data.jugadores,
                    data.montoPremio,
                    data.fechaInicio,
                    data.fechaFin,
                    id
                ]
            );

            await connection.commit();
            return 'TORNEO_ACTUALIZADO';
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            `DELETE FROM torneos WHERE id_torneo = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    async findPlayersByTournament(id: number) {
        const [rows] = await pool.query(
            `SELECT
                i.id_inscripcion,
                p.id_persona,
                p.nombre,
                p.apellido,
                p.email
            FROM inscripciones i
            INNER JOIN personas p ON i.id_persona = p.id_persona
            WHERE i.id_torneo = ?`,
            [id]
        );

        return rows;
    },

    async findMatchesByTournament(id: number) {
        const [rows] = await pool.query(
            `SELECT
                pa.id_partido,
                pa.fecha,
                pa.hora,
                pa.ganador,
                pa.numero_ronda,
                pa.numero_partido,

                p1.id_persona AS id_jugador1,
                p1.nombre AS nombre_jugador1,

                p1.apellido AS apellido_jugador1,
                p2.id_persona AS id_jugador2,

                p2.nombre AS nombre_jugador2,
                p2.apellido AS apellido_jugador2

            FROM partidos pa

            INNER JOIN participaciones part1 ON pa.id_partido = part1.id_partido
            INNER JOIN participaciones part2
                ON pa.id_partido = part2.id_partido
                AND part1.id_persona < part2.id_persona

            INNER JOIN personas p1 ON part1.id_persona = p1.id_persona
            INNER JOIN personas p2 ON part2.id_persona = p2.id_persona
            WHERE pa.id_torneo = ?`,
            [id]
        );

        return rows;
    },

    async findByCreator(idCreador: number, limit = 10, offset = 0): Promise<PaginatedResult<Torneo>> {
        const [rows] = await pool.query<TorneoRow[]>(
            `SELECT * FROM torneos WHERE id_creador = ? ORDER BY id_torneo LIMIT ? OFFSET ?`, [idCreador, limit, offset]
        );

        const [countRows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) AS total FROM torneos WHERE id_creador = ?`, [idCreador]
        );

        return {
            data: rows,
            total: Number(countRows[0].total)
        };
    }
};
