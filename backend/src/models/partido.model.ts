import type { RowDataPacket, ResultSetHeader, PoolConnection } from "mysql2/promise";
import { pool } from "../config/db";
import { determinarGanadorPartido } from "../helpers/determinarGanadorPartido";

export interface Partido {
    id_partido: number;
    id_torneo: number;
    ganador: number | null;
    fecha: Date;
    hora: string;
    numero_ronda: number;
    numero_partido: number;
}

export interface SetPartido {
    id_set: number;
    id_partido: number;
    numero_set: number;
    games_jugador1: number;
    games_jugador2: number;
}

export interface PartidoDetalle {
    id_partido: number;
    id_torneo: number;
    ganador: number | null;
    fecha: Date;
    hora: string;
    id_jugador1: number;
    nombre_jugador1: string;
    apellido_jugador1: string;
    id_jugador2: number;
    nombre_jugador2: string;
    apellido_jugador2: string;
}

export type PartidoInput = Omit<Partido, 'id_partido'>;

interface PartidoRow extends RowDataPacket, Partido {}
interface SetPartidoRow extends RowDataPacket, SetPartido {}
interface PartidoDetalleRow extends RowDataPacket, PartidoDetalle {}
interface ParticipantePartidoRow extends RowDataPacket {
    id_persona: number;
}

interface PartidoRondaRow extends RowDataPacket {
    id_partido: number;
    ganador: number | null;
    numero_ronda: number;
    numero_partido: number;
}

interface PartidoMetaRow extends RowDataPacket {
    id_torneo: number;
    numero_ronda: number;
}

interface TorneoRondaRow extends RowDataPacket {
    fechaInicio: string;
}

export type UpdateSetsResult =
    | { estado: 'PARTIDO_NO_ENCONTRADO' }
    | { estado: 'RONDA_CERRADA' }
    | { estado: 'RESULTADO_GUARDADO'; ganador: number | null }
    | { estado: 'RONDA_CREADA'; ganador: number; numero_ronda: number; partidos_creados: number }
    | { estado: 'CAMPEON_DETERMINADO'; ganador: number };

interface PartidoRondaMetaRow extends RowDataPacket {
    id_torneo: number;
    numero_ronda: number;
}

type ResultadoRondaEditable =
    | { estado: 'PARTIDO_NO_ENCONTRADO' }
    | { estado: 'RONDA_CERRADA' }
    | { estado: 'RONDA_ABIERTA'; id_torneo: number; numero_ronda: number };

async function comprobarRondaEditable(connection: PoolConnection, idPartido: number): Promise<ResultadoRondaEditable> {
    const [inicial] = await connection.query<PartidoRondaMetaRow[]>(
        `SELECT id_torneo, numero_ronda FROM partidos WHERE id_partido = ?`, [idPartido]
    );

    if (inicial.length === 0) {
        return { estado: 'PARTIDO_NO_ENCONTRADO' };
    }

    const idTorneo = inicial[0].id_torneo;

    // Serializa los cambios de sets y resultados dentro del torneo.
    const [torneos] = await connection.query<RowDataPacket[]>(
        `SELECT id_torneo FROM torneos WHERE id_torneo = ? FOR UPDATE`, [idTorneo]
    );

    if (torneos.length === 0) {
        return { estado: 'PARTIDO_NO_ENCONTRADO' };
    }

    const [partidos] = await connection.query<PartidoRondaMetaRow[]>(
        `SELECT id_torneo, numero_ronda FROM partidos WHERE id_partido = ? FOR UPDATE`, [idPartido]
    );

    if (partidos.length === 0) {
        return { estado: 'PARTIDO_NO_ENCONTRADO' };
    }

    const numeroRonda = partidos[0].numero_ronda;

    const [posteriores] = await connection.query<RowDataPacket[]>(
        `SELECT id_partido FROM partidos WHERE id_torneo = ? AND numero_ronda > ? LIMIT 1 FOR UPDATE`, [idTorneo, numeroRonda]
    );

    if (posteriores.length > 0) {
        return { estado: 'RONDA_CERRADA' };
    }

    return {
        estado: 'RONDA_ABIERTA',
        id_torneo: idTorneo,
        numero_ronda: numeroRonda
    };
}

export const partidoModel = {
    async findAll(): Promise<Partido[]> {
        const [rows] = await pool.query<PartidoRow[]>('SELECT * FROM partidos');
        return rows;
    },

    async findById(id: number): Promise<Partido | null> {
        const [rows] = await pool.query<PartidoRow[]>(
                'SELECT * FROM partidos WHERE id_partido = ?',
                [id]
            );

        return rows[0] ?? null;
    },

    async create(data: PartidoInput): Promise<Partido> {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO partidos (
                id_torneo,
                ganador,
                fecha,
                hora,
                numero_ronda,
                numero_partido
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.id_torneo,
                data.ganador,
                data.fecha,
                data.hora,
                data.numero_ronda,
                data.numero_partido
            ]
        );

        return {
            id_partido: result.insertId,
            ...data
        };
    },

    async updateSchedule(id: number, fecha: string, hora: string): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE partidos SET fecha = ?, hora = ? WHERE id_partido = ?`, [fecha, hora, id]
        );

        return result.affectedRows > 0;
    },

    async findTournamentDateRangeByMatch(idPartido: number): Promise<{ fechaInicio: string; fechaFin: string } | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT
                DATE_FORMAT(t.fechaInicio, '%Y-%m-%d') AS fechaInicio,
                DATE_FORMAT(t.fechaFin, '%Y-%m-%d') AS fechaFin
            FROM partidos p
            INNER JOIN torneos t
                ON t.id_torneo = p.id_torneo
            WHERE p.id_partido = ?`,
            [idPartido]
        );

        return (rows[0] as { fechaInicio: string; fechaFin: string }) ?? null;
    },

    async findSetsByMatch(id: number): Promise<SetPartido[]> {
        const [rows] = await pool.query<SetPartidoRow[]>(
            `SELECT
                id_set,
                numero_set,
                games_jugador1,
                games_jugador2
            FROM sets_partido
            WHERE id_partido = ?
            ORDER BY numero_set ASC`,
            [id]
        );

        return rows;
    },

    async findMatchWithPlayers(id: number): Promise<PartidoDetalle | null> {
        const [rows] = await pool.query<PartidoDetalleRow[]>(
            `SELECT
            pa.id_partido,
            pa.id_torneo,
            pa.ganador,
            pa.fecha,
            pa.hora,
            p1.id_persona AS id_jugador1,
            p1.nombre AS nombre_jugador1,
            p1.apellido AS apellido_jugador1,
            p2.id_persona AS id_jugador2,
            p2.nombre AS nombre_jugador2,
            p2.apellido AS apellido_jugador2
        FROM partidos pa
        INNER JOIN participaciones part1
            ON pa.id_partido = part1.id_partido
        INNER JOIN participaciones part2
            ON pa.id_partido = part2.id_partido
            AND part1.id_persona < part2.id_persona
        INNER JOIN personas p1
            ON part1.id_persona = p1.id_persona
        INNER JOIN personas p2
            ON part2.id_persona = p2.id_persona
        WHERE pa.id_partido = ?`, [id]
        );
        return rows[0] ?? null;
    },

    async updateSets(idPartido: number, sets: SetPartido[]): Promise<UpdateSetsResult> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Averiguar a qué torneo pertenece el partido.
            const [partidoInicial] = await connection.query<PartidoMetaRow[]>(
                `SELECT id_torneo, numero_ronda FROM partidos WHERE id_partido = ?`,
                [idPartido]
            );

            if (partidoInicial.length === 0) {
                await connection.rollback();
                return { estado: 'PARTIDO_NO_ENCONTRADO' };
            }

            const idTorneo = partidoInicial[0].id_torneo;
            const numeroRonda = partidoInicial[0].numero_ronda;

            // Serializa cambios del cuadro de este torneo.
            const [torneos] = await connection.query<TorneoRondaRow[]>(
                `SELECT DATE_FORMAT(fechaInicio, '%Y-%m-%d') AS fechaInicio FROM torneos WHERE id_torneo = ? FOR UPDATE`,
                [idTorneo]
            );

            if (torneos.length === 0) {
                await connection.rollback();
                return { estado: 'PARTIDO_NO_ENCONTRADO' };
            }

            // Volver a leer y bloquear el partido dentro de la transacción.
            const [partidos] = await connection.query<PartidoMetaRow[]>(
                `SELECT id_torneo, numero_ronda FROM partidos WHERE id_partido = ? FOR UPDATE`,
                [idPartido]
            );

            if (partidos.length === 0) {
                await connection.rollback();
                return { estado: 'PARTIDO_NO_ENCONTRADO' };
            }

            // No permitir editar resultados de rondas anteriores.
            const [rondasPosteriores] = await connection.query<RowDataPacket[]>(
                `SELECT id_partido FROM partidos WHERE id_torneo = ? AND numero_ronda > ? LIMIT 1 FOR UPDATE`,
                [idTorneo, numeroRonda]
            );

            if (rondasPosteriores.length > 0) {
                await connection.rollback();
                return { estado: 'RONDA_CERRADA' };
            }

            const [participantes] = await connection.query<ParticipantePartidoRow[]>(
                `SELECT id_persona FROM participaciones WHERE id_partido = ? ORDER BY id_persona`,
                [idPartido]
            );

            if (participantes.length !== 2) {
                throw new Error('PARTIDO_SIN_DOS_JUGADORES');
            }

            for (const set of sets) {
                await connection.query(
                    `UPDATE sets_partido SET games_jugador1 = ?, games_jugador2 = ? WHERE id_set = ? AND id_partido = ?`,
                    [
                        set.games_jugador1,
                        set.games_jugador2,
                        set.id_set,
                        idPartido
                    ]
                );
            }

            const [setsGuardados] = await connection.query<SetPartidoRow[]>(
                `SELECT id_set, id_partido, numero_set, games_jugador1, games_jugador2 FROM sets_partido WHERE id_partido = ? ORDER BY numero_set`,
                [idPartido]
            );

            const ganador = determinarGanadorPartido(
                setsGuardados,
                participantes[0].id_persona,
                participantes[1].id_persona
            );

            await connection.query(
                `UPDATE partidos SET ganador = ? WHERE id_partido = ?`,
                [ganador, idPartido]
            );

            // Si este partido todavía no tiene ganador, la ronda sigue abierta.
            if (ganador === null) {
                await connection.commit();
                return { estado: 'RESULTADO_GUARDADO', ganador: null };
            }

            // FOR UPDATE hace que leamos el estado más reciente de la ronda.
            const [partidosRonda] = await connection.query<PartidoRondaRow[]>(
                `SELECT id_partido, ganador, numero_ronda, numero_partido FROM partidos WHERE id_torneo = ? AND numero_ronda = ? ORDER BY numero_partido FOR UPDATE`,
                [idTorneo, numeroRonda]
            );

            if (partidosRonda.some(partido => partido.ganador === null)) {
                await connection.commit();
                return { estado: 'RESULTADO_GUARDADO', ganador };
            }

            // Una ronda que contiene un solo partido es la final.
            if (partidosRonda.length === 1) {
                await connection.query(`UPDATE torneos SET estado = 'finalizado' WHERE id_torneo = ?`, [idTorneo]);
                
                await connection.commit();
                return { estado: 'CAMPEON_DETERMINADO', ganador };
            }

            const ganadores = partidosRonda.map(partido => partido.ganador as number);

            if (ganadores.length % 2 !== 0) {
                throw new Error('CANTIDAD_IMPAR_DE_GANADORES');
            }

            const siguienteRonda = numeroRonda + 1;
            let partidosCreados = 0;

            for (let i = 0; i < ganadores.length; i += 2) {
                const numeroPartido = i / 2 + 1;

                const [partidoNuevo] = await connection.query<ResultSetHeader>(
                    `INSERT INTO partidos (id_torneo, ganador, fecha, hora, numero_ronda, numero_partido) VALUES (?, NULL, ?, '12:00:00', ?, ?)`,
                    [
                        idTorneo,
                        torneos[0].fechaInicio,
                        siguienteRonda,
                        numeroPartido
                    ]
                );

                await connection.query(
                    `INSERT INTO participaciones (id_partido, id_persona) VALUES (?, ?), (?, ?)`,
                    [
                        partidoNuevo.insertId,
                        ganadores[i],
                        partidoNuevo.insertId,
                        ganadores[i + 1]
                    ]
                );

                partidosCreados++;
            }

            await connection.commit();

            return {
                estado: 'RONDA_CREADA',
                ganador,
                numero_ronda: siguienteRonda,
                partidos_creados: partidosCreados
            };

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    },

    async createSet(idPartido: number): Promise<'PARTIDO_NO_ENCONTRADO' | 'RONDA_CERRADA' | 'SET_CREADO'> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const comprobacion = await comprobarRondaEditable(connection, idPartido);

            if (comprobacion.estado !== 'RONDA_ABIERTA') {
                await connection.rollback();
                return comprobacion.estado;
            }

            const [filas] = await connection.query<RowDataPacket[]>(
                `SELECT COALESCE(MAX(numero_set), 0) + 1 AS proximo_set FROM sets_partido WHERE id_partido = ?`,
                [idPartido]
            );

            const numeroSet = Number(filas[0].proximo_set);

            await connection.query(
                `INSERT INTO sets_partido (id_partido, numero_set, games_jugador1, games_jugador2) VALUES (?, ?, 0, 0)`,
                [idPartido, numeroSet]
            );

            await connection.query(
                `UPDATE partidos SET ganador = NULL WHERE id_partido = ?`,
                [idPartido]
            );

            await connection.commit();
            return 'SET_CREADO';

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    },

    async removeSet(idSet: number): Promise<'SET_NO_ENCONTRADO' | 'RONDA_CERRADA' | 'SET_ELIMINADO'> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [sets] = await connection.query<RowDataPacket[]>(
                `SELECT id_partido FROM sets_partido WHERE id_set = ?`,
                [idSet]
            );

            if (sets.length === 0) {
                await connection.rollback();
                return 'SET_NO_ENCONTRADO';
            }

            const idPartido = Number(sets[0].id_partido);
            const comprobacion = await comprobarRondaEditable(connection, idPartido);

            if (comprobacion.estado === 'PARTIDO_NO_ENCONTRADO') {
                await connection.rollback();
                return 'SET_NO_ENCONTRADO';
            }

            if (comprobacion.estado === 'RONDA_CERRADA') {
                await connection.rollback();
                return 'RONDA_CERRADA';
            }

            const [eliminacion] = await connection.query<ResultSetHeader>(
                `DELETE FROM sets_partido WHERE id_set = ? AND id_partido = ?`,
                [idSet, idPartido]
            );

            if (eliminacion.affectedRows === 0) {
                await connection.rollback();
                return 'SET_NO_ENCONTRADO';
            }

            await connection.query(
                `UPDATE partidos SET ganador = NULL WHERE id_partido = ?`,
                [idPartido]
            );

            await connection.commit();
            return 'SET_ELIMINADO';

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    },
};