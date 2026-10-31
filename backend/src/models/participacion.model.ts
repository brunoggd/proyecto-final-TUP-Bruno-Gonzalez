import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Participacion {
    id_participacion: number;
    id_partido: number;
    id_persona: number;
}

export type ParticipacionInput = Omit<Participacion, 'id_participacion'>;

interface ParticipacionRow extends RowDataPacket, Participacion {};

export const participacionModel = {
    async findAll(): Promise<Participacion[]> {
        const [rows] = await pool.query<ParticipacionRow[]>(
            'SELECT id_participacion, id_partido, id_persona FROM participaciones'
        );
        return rows;
    },

    async findById(id: number): Promise<Participacion | null> {
        const [rows] = await pool.query<ParticipacionRow[]>(
            'SELECT id_participacion, id_partido, id_persona FROM participaciones WHERE id_participacion = ?', [id]
        );
        return rows[0] ?? null;
    },

    async create(data: ParticipacionInput): Promise<Participacion> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO participaciones(id_partido, id_persona) VALUES(?, ?)', [data.id_partido, data.id_persona]
        );
        return {
            id_participacion: result.insertId,
            ...data
        }
    },

    async update(id: number, data: ParticipacionInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE participaciones SET id_partido = ?, id_persona = ? WHERE id_participacion = ?', [data.id_partido, data.id_persona, id]
        );
        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM participaciones WHERE id_participacion = ?', [id]
        );
        return result.affectedRows > 0;
    }
}