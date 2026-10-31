import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Torneo {
    id_torneo: number;
    nombre: string;
    ubicacion: string;
    jugadores: number;
    premio: boolean;
    montoPremio: number;
    fechaInicio: Date;
    fechaFin: Date;
}

export type TorneoInput = Omit<Torneo, 'id_torneo'>;

interface TorneoRow extends RowDataPacket, Torneo {};

export const torneoModel = {
    async findAll(): Promise<Torneo[]> {
        const [rows] = await pool.query<TorneoRow[]>(
            'SELECT * FROM torneos'
        );
        return rows;
    },

    async findById(id: number): Promise<Torneo | null> {
        const [rows] = await pool.query<TorneoRow[]>(
            'SELECT * FROM torneos WHERE id_torneo = ?', [id]
        );
        return rows[0] ?? null;
    },

    async create(data: TorneoInput): Promise<Torneo> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO torneos(nombre, ubicacion, jugadores, premio, montoPremio, fechaInicio, fechaFin) VALUES(?, ?, ?, ?, ?, ?, ?)', 
            [
                data.nombre,
                data.ubicacion,
                data.jugadores, 
                data.premio, 
                data.montoPremio, 
                data.fechaInicio, 
                data.fechaFin
            ]
        );
        return {
            id_torneo: result.insertId,
            ...data
        }
    },

    async update(id: number, data: TorneoInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE torneos SET nombre = ?, ubicacion = ?, jugadores = ?, premio = ?, montoPremio = ?, fechaInicio = ?, fechaFin = ? WHERE id_torneo = ?', 
            [
                data.nombre,
                data.ubicacion,
                data.jugadores, 
                data.premio, 
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
            'DELETE FROM torneos WHERE id_torneo = ?', [id]
        );
        return result.affectedRows > 0;
    }
}
