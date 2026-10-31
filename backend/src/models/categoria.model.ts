import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Categoria {
    id_categoria: number;
    nombre: string;
    id_torneo: number;
}

export type CategoriaInput = Omit<Categoria, 'id_categoria'>;

interface CategoriaRow extends RowDataPacket, Categoria {};

export const categoriaModel = {
    async findAll(): Promise<Categoria[]> {
        const [rows] = await pool.query<CategoriaRow[]>(
            'SELECT id_categoria, nombre, id_torneo FROM categorias'
        );
        return rows;
    },

    async findById(id: number): Promise<Categoria | null> {
        const [rows] = await pool.query<CategoriaRow[]>(
            'SELECT id_categoria, nombre, id_torneo FROM categorias WHERE id_categoria = ?', [id]
        );
        return rows[0] ?? null;
    },

    async create(data: CategoriaInput): Promise<Categoria> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO categorias(nombre, id_torneo) VALUES(?, ?)', [data.nombre, data.id_torneo]
        );
        return {
            id_categoria: result.insertId,
            ...data
        }
    },

    async update(id: number, data: CategoriaInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE categorias SET nombre = ?, id_torneo = ? WHERE id_categoria = ?', [data.nombre, data.id_torneo, id]
        );
        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM categorias WHERE id_categoria = ?', [id]
        );
        return result.affectedRows > 0;
    }
}