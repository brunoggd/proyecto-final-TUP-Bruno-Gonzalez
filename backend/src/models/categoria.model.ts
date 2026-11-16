import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Categoria {
    id_categoria: number;
    nombre: string;
}

export interface NombreCategoria {
    nombre: string;
}

export type CategoriaInput = Omit<Categoria, 'id_categoria'>;

interface CategoriaRow extends RowDataPacket, Categoria {};
interface NombreCategoriaRow extends RowDataPacket, NombreCategoria {};

export const categoriaModel = {
    async findAll(): Promise<Categoria[]> {
        const [rows] = await pool.query<CategoriaRow[]>(
            'SELECT id_categoria, nombre FROM categorias'
        );
        return rows;
    },

    async getNames(): Promise<NombreCategoria[]> {
        const [rows] = await pool.query<NombreCategoriaRow[]>('SELECT DISTINCT nombre FROM categorias');
        return rows;
    },

    async findById(id: number): Promise<Categoria | null> {
        const [rows] = await pool.query<CategoriaRow[]>(
            'SELECT id_categoria, nombre FROM categorias WHERE id_categoria = ?', [id]
        );
        return rows[0] ?? null;
    },

    async create(data: CategoriaInput): Promise<Categoria> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO categorias(nombre) VALUES(?)', [data.nombre]
        );
        return {
            id_categoria: result.insertId,
            ...data
        }
    },

    async update(id: number, data: CategoriaInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE categorias SET nombre = ? WHERE id_categoria = ?', [data.nombre, id]
        );
        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM categorias WHERE id_categoria = ?', [id]
        );
        return result.affectedRows > 0;
    },

    async findByTournament(idTorneo: number): Promise<Categoria | null> {
        const [rows] = await pool.query<CategoriaRow[]>(
                `SELECT
                    c.id_categoria,
                    c.nombre
                FROM categorias c
                INNER JOIN torneos t
                    ON t.id_categoria = c.id_categoria
                WHERE t.id_torneo = ?`,
                [idTorneo]
            );

        return rows[0] ?? null;
    }
}