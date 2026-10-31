import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Partido {
    id_partido: number;
    id_torneo: number;
    ganador: number;
    fecha: Date;
    hora: Date;
    resultado: string;
    games: number;
    sets: number;
}

export type PartidoInput = Omit<Partido, 'id_partido'>;

interface PartidoRow extends RowDataPacket, Partido {};

export const partidoModel = {
    async findAll(): Promise<Partido[]> {
        const [rows] = await pool.query<PartidoRow[]>(
            'SELECT * FROM partidos'
        );
        return rows;
    },

    async findById(id: number): Promise<Partido | null> {
        const [rows] = await pool.query<PartidoRow[]>(
            'SELECT * FROM partidos WHERE id_partido = ?', [id]
        );
        return rows[0] ?? null;
    },

    async create(data: PartidoInput): Promise<Partido> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO partidos(id_torneo, ganador, fecha, hora, resultado, games, sets)VALUES(?, ?, ?, ?, ?, ?, ?)', [data.id_torneo, data.ganador, data.fecha, data.resultado, data.games, data.sets]
        );
        return {
            id_partido: result.insertId,
            ...data
        }
    },

    async update(id: number, data: PartidoInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE partidos SET id_torneo = ?, ganador = ?, fecha = ?, hora = ?, resultado = ?, games = ?, sets = ?', [data.id_torneo, data.ganador, data.fecha, data.resultado, data.games, data.sets, id]
        );
        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM partidos WHERE id_partido = ?', [id]
        );
        return result.affectedRows > 0;
    }
}