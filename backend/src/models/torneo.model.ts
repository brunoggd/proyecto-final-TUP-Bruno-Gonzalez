import type {RowDataPacket,ResultSetHeader} from "mysql2/promise";
import { pool } from "../config/db";

export interface Torneo {
    id_torneo: number;
    id_creador: number;
    id_categoria: number;
    nombre: string;
    ubicacion: string;
    jugadores: number;
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
    fechaInicio: Date;
    fechaFin: Date;
}

export interface SedeTorneo {
    ubicacion: string;
}

export type TorneoInput = Omit<Torneo, 'id_torneo' | 'id_creador'>;

interface TorneoRow extends RowDataPacket, Torneo {}

interface SedeTorneoRow extends RowDataPacket, SedeTorneo {}

export const torneoModel = {
    async findAll(): Promise<Torneo[]> {
        const [rows] = await pool.query<TorneoRow[]>('SELECT * FROM torneos');
        return rows;
    },

    async findById(id: number): Promise<Torneo | null> {
        const [rows] = await pool.query<TorneoRow[]>(
            `SELECT * FROM torneos WHERE id_torneo = ?`, [id]
        );
        return rows[0] ?? null;
    },

    async filter(nombre?: string, categoria?: string, sede?: string) {
        let sql = `
            SELECT
                t.*
            FROM torneos t
            LEFT JOIN categorias c
                ON c.id_categoria = t.id_categoria
            WHERE 1 = 1`;

        const params: string[] = [];

        if (nombre) {
            sql += ` AND t.nombre LIKE ?`;
            params.push(`%${nombre}%`);
        }

        if (categoria) {
            sql += ` AND c.nombre = ?`;

            params.push(categoria);
        }

        if (sede) {
            sql += ` AND t.ubicacion = ?`;

            params.push(sede);
        }

        const [rows] = await pool.query(sql, params);

        return rows;
    },

    async getLocations(): Promise<SedeTorneo[]> {
        const [rows] = await pool.query<SedeTorneoRow[]>(`SELECT DISTINCT ubicacion FROM torneos`);

        return rows;
    },

    async create(data: TorneoCreateInput): Promise<Torneo> {
        const [result] = await pool.query<ResultSetHeader>(
            `
                INSERT INTO torneos
                (
                    id_creador,
                    id_categoria,
                    nombre,
                    ubicacion,
                    jugadores,
                    montoPremio,
                    fechaInicio,
                    fechaFin
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
                `,
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

        return {
            id_torneo: result.insertId,
            ...data
        };
    },

    async update(id: number, data: TorneoInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            `
                UPDATE torneos
                SET
                    id_categoria = ?,
                    nombre = ?,
                    ubicacion = ?,
                    jugadores = ?,
                    montoPremio = ?,
                    fechaInicio = ?,
                    fechaFin = ?
                WHERE id_torneo = ?
                `,
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

        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            `DELETE FROM torneos WHERE id_torneo = ?`, [id]
        );

        return result.affectedRows > 0;

    },

    async findPlayersByTournament(id: number) {
        const [rows] = await pool.query(
            `
                SELECT
                    i.id_inscripcion,
                    p.id_persona,
                    p.nombre,
                    p.apellido,
                    p.email
                FROM inscripciones i
                INNER JOIN personas p
                    ON i.id_persona = p.id_persona
                WHERE i.id_torneo = ?
                `,
            [id]
        );

        return rows;

    },

    async findMatchesByTournament(id: number) {
        const [rows] = await pool.query(
            `
                SELECT
                    pa.id_partido,
                    pa.fecha,
                    pa.hora,

                    p1.id_persona AS id_jugador1,
                    p1.nombre AS nombre_jugador1,
                    p1.apellido AS apellido_jugador1,

                    p2.id_persona AS id_jugador2,
                    p2.nombre AS nombre_jugador2,
                    p2.apellido AS apellido_jugador2

                FROM partidos pa

                INNER JOIN participaciones part1 ON pa.id_partido = part1.id_partido

                INNER JOIN participaciones part2 ON pa.id_partido = part2.id_partido

                AND part1.id_persona < part2.id_persona

                INNER JOIN personas p1 ON part1.id_persona = p1.id_persona

                INNER JOIN personas p2 ON part2.id_persona = p2.id_persona

                WHERE pa.id_torneo = ?
                `,
            [id]
        );

        return rows;
    },

    async findByCreator(idCreador: number): Promise<Torneo[]> {
        const [rows] = await pool.query<TorneoRow[]>(`SELECT * FROM torneos WHERE id_creador = ?`, [idCreador]);
        return rows;
    },
};