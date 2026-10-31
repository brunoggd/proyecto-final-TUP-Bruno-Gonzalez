import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";

export interface Persona {
    id_persona: number;
    nombre: string;
    apellido: string;
    contrasena: string;
    email: string;
    fecha_nacimiento: Date;
    estaJugandoUnTorneo: boolean;
    torneosGanados: number;
    rol: string;
}

export type PersonaInput = Omit<Persona, 'id_persona' | 'rol'>;

interface PersonaRow extends RowDataPacket, Persona {};

export const personaModel = {
    async findAll(): Promise<Persona[]> {
        const [rows] = await pool.query<PersonaRow[]>(
            'SELECT p.*, r.nombre AS rol FROM personas p LEFT JOIN roles r ON p.id_persona = r.id_persona'
        );
        return rows;
    },

    async findById(id: number): Promise<Persona | null> {
        const [rows] = await pool.query<PersonaRow[]>(
            'SELECT p.*, r.nombre AS rol FROM personas p LEFT JOIN roles r ON p.id_persona = r.id_persona WHERE p.id_persona = ?', 
            [id]
        );
        return rows[0] ?? null;
    },

    async findByEmail(email: string): Promise<Persona | null> {
        const [rows] = await pool.query<PersonaRow[]>(
            'SELECT p.*, r.nombre AS rol FROM personas p LEFT JOIN roles r ON p.id_persona = r.id_persona WHERE p.email = ?', 
            [email]
        );
        return rows[0] ?? null;
    },

    async create(data: PersonaInput): Promise<Persona> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO personas(nombre, apellido, contrasena, email, fecha_nacimiento, estaJugandoUnTorneo, torneosGanados) VALUES(?, ?, ?, ?, ?, ?, ?)', 
            [
                data.nombre, 
                data.apellido, 
                data.contrasena,
                data.email, 
                data.fecha_nacimiento, 
                Number(data.estaJugandoUnTorneo), 
                data.torneosGanados
            ]
        );
        return {
            id_persona: result.insertId,
            ...data,
            rol: ''
        }
    },

    async update(id: number, data: PersonaInput): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE personas SET nombre = ?, apellido = ?, contrasena = ?, email = ?, fecha_nacimiento = ?, estaJugandoUnTorneo = ?, torneosGanados = ? WHERE id_persona = ?', 
            [
                data.nombre, 
                data.apellido, 
                data.contrasena,
                data.email, 
                data.fecha_nacimiento, 
                Number(data.estaJugandoUnTorneo), 
                data.torneosGanados,
                id
            ]
        );
        return result.affectedRows > 0;
    },

    async remove(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM personas WHERE id_persona = ?', [id]
        );
        return result.affectedRows > 0;
    }
}
