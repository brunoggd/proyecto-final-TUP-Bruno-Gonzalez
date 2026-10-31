import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Inscripcion {
    id_inscripcion: number;
    id_persona: number;
    id_torneo: number;
}

export type InscripcionInput = Omit<Inscripcion, 'id_inscripcion'>;

interface InscripcionRow extends RowDataPacket, Inscripcion {}

export const inscripcionModel = {
    async findAll(): Promise<Inscripcion[]> {
        const [rows] = await pool.query<InscripcionRow[]>(
            'SELECT id_inscripcion, id_persona, id_torneo FROM inscripciones'
        );
        return rows;
    },

    async findById(id: number): Promise<Inscripcion | null> {
        const [rows] = await pool.query<InscripcionRow[]>(
            'SELECT id_inscripcion, id_persona, id_torneo FROM inscripciones WHERE id_inscripcion = ?', [id]
        );
        return rows[0] ?? null;
    },

    async create(data: InscripcionInput): Promise<Inscripcion> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO inscripciones(id_persona, id_torneo) VALUES(?, ?)', [data.id_persona, data.id_torneo]
        );
        return {
            id_inscripcion: result.insertId,
            ...data
        }
    },
    
    async update(id: number, data: InscripcionInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE inscripciones SET id_persona = ?, id_torneo = ? WHERE id_inscripcion = ?', [data.id_persona, data.id_torneo, id]
        );
        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM inscripciones WHERE id_inscripcion = ?', [id]
        );
        return result.affectedRows > 0;
    }
}