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

    async exists(idPersona: number, idTorneo: number): Promise<boolean> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 1
            FROM inscripciones
            WHERE id_persona = ?
            AND id_torneo = ?
            LIMIT 1`,
            [
                idPersona,
                idTorneo
            ]
        );

        return rows.length > 0;
    },

    async createIfAvailable(idPersona: number, idTorneo: number): Promise<Inscripcion> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [torneos] = await connection.query<RowDataPacket[]>(
                `SELECT jugadores FROM torneos WHERE id_torneo = ? FOR UPDATE`,
                [idTorneo]
            );

            if (torneos.length === 0) {
                throw new Error('TORNEO_NO_EXISTE');
            }

            const [inscripciones] = await connection.query<RowDataPacket[]>(
                `SELECT COUNT(*) AS total FROM inscripciones WHERE id_torneo = ?`,
                [idTorneo]
            );

            if (Number(inscripciones[0].total) >= Number(torneos[0].jugadores)) {
                throw new Error('TORNEO_COMPLETO');
            }

            const [duplicada] = await connection.query<RowDataPacket[]>(
                `SELECT 1 FROM inscripciones WHERE id_persona = ? AND id_torneo = ? LIMIT 1`,
                [idPersona, idTorneo]
            );

            if (duplicada.length > 0) {
                throw new Error('YA_INSCRIPTO');
            }

            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO inscripciones (id_persona, id_torneo) VALUES (?, ?)`, [idPersona, idTorneo]
            );

            await connection.commit();

            return {
                id_inscripcion: result.insertId,
                id_persona: idPersona,
                id_torneo: idTorneo
            };

        } catch (error) {
            await connection.rollback();
            throw error;
            
        } finally {
            connection.release();
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