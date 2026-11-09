import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Partido {
    id_partido: number;
    id_torneo: number;
    ganador: number;
    fecha: Date;
    hora: string;
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
    ganador: number;
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
            `INSERT INTO partidos
            (
                id_torneo,
                ganador,
                fecha,
                hora
            )
            VALUES (?, ?, ?, ?)`,
            [
                data.id_torneo,
                data.ganador,
                data.fecha,
                data.hora
            ]
        );

        return {
            id_partido: result.insertId,
            ...data
        };
    },

    async update(id: number, data: PartidoInput): Promise<boolean> {
        const [result] =
            await pool.query<ResultSetHeader>(
                `UPDATE partidos
                SET
                    id_torneo = ?,
                    ganador = ?,
                    fecha = ?,
                    hora = ?
                WHERE id_partido = ?`,
                [
                    data.id_torneo,
                    data.ganador,
                    data.fecha,
                    data.hora,
                    id
                ]
            );

        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM partidos WHERE id_partido = ?',
            [id]
        );

        return result.affectedRows > 0;
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

    async updateSets(idPartido: number, sets: SetPartido[]): Promise<boolean> {
        for (const set of sets) {
            await pool.query(
                `UPDATE sets_partido
                SET
                    games_jugador1 = ?,
                    games_jugador2 = ?
                WHERE id_set = ?
                AND id_partido = ?`,
                [
                    set.games_jugador1,
                    set.games_jugador2,
                    set.id_set,
                    idPartido
                ]
            );
        }
        return true;
    },

    async createSet(idPartido: number): Promise<boolean> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT
                COALESCE(
                    MAX(numero_set),
                    0
                ) + 1 AS proximo_set
            FROM sets_partido
            WHERE id_partido = ?`,
            [idPartido]
        );

        const numeroSet = rows[0].proximo_set;

        const [result] =
            await pool.query<ResultSetHeader>(
                `INSERT INTO sets_partido
                (
                    id_partido,
                    numero_set,
                    games_jugador1,
                    games_jugador2
                )
                VALUES (?, ?, 0, 0)`,
                [
                    idPartido,
                    numeroSet
                ]
            );
        return result.affectedRows > 0;
    },

    async removeSet(idSet: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            `DELETE
            FROM sets_partido
            WHERE id_set = ?`,
            [idSet]
            );
        return result.affectedRows > 0;
    }
};