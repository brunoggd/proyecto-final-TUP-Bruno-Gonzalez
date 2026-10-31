import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Rol {
    id_rol: number;
    nombre: 'jugador' | 'organizador' | 'espectador';
    id_persona: number;
}

export type RolInput = Omit<Rol, 'id_rol'>;

interface RolRow extends RowDataPacket, Rol {};

export const rolModel = {
    async findAll(): Promise<Rol[]> {
        const [rows] = await pool.query<RolRow[]>(
            'SELECT * FROM roles'
        );
        return rows;
    },

    async findById(id: number): Promise<Rol | null> {
        const [rows] = await pool.query<RolRow[]>(
            'SELECT * FROM roles WHERE id_rol = ?', [id]
        );
        return rows[0] ?? null;
    },

    async create(data: RolInput): Promise<Rol> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO roles(nombre, id_persona) VALUES(?, ?)', [data.nombre, data.id_persona]
        );
        return {
            id_rol: result.insertId,
            ...data
        }
    },

    async update(id: number, data: RolInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE roles SET nombre = ?, id_persona = ? WHERE id_rol = ?', [data.nombre, data.id_persona, id] 
        );
        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM roles WHERE id_rol = ?', [id]
        );
        return result.affectedRows > 0;
    }
}