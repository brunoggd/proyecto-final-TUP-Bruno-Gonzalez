import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import type { Request, Response } from "express";

import { personaModel } from "../models/persona.model";
import { pool } from '../config/db';

export async function register(req: Request, res: Response) {
    const {nombre, apellido, contrasena, email, fecha_nacimiento, rol} = req.body;

    const buscarExistente = await personaModel.findByEmail(email);

    if (buscarExistente) {
        return res.status(409).json({error: 'Usuario con este email ya registrado'});
    }
    const contrasena_hash = await bcrypt.hash(contrasena, 10);

    const personaData = {
        nombre,
        apellido,
        contrasena: contrasena_hash,
        email,
        fecha_nacimiento,
        estaJugandoUnTorneo: false,
        torneosGanados: 0,
        rol
    };

    const persona = await personaModel.create(personaData);

    await pool.query(
        `INSERT INTO roles(nombre, id_persona) VALUES(?, ?)`, [rol, persona.id_persona]
    );

    const token = jwt.sign(
        {
            id: persona.id_persona,
            nombre: persona.nombre,
            rol
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '2h' }
    );

    res.status(201).json({token});

}

export async function login(req: Request, res: Response) {
    try {
        const { email, contrasena } = req.body;
        const personaExiste = await personaModel.findByEmail(email);

        if (!personaExiste) {
            return res.status(401).json('Credenciales inválidas');
        }

        const coincide = await bcrypt.compare(contrasena, personaExiste.contrasena);

        if (!coincide) {
            return res.status(401).json('Credenciales inválidas');
        }

        console.log(personaExiste);

        const token = jwt.sign(
            {
                id: personaExiste.id_persona,
                nombre: personaExiste.nombre,
                rol: personaExiste.rol
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '2h' },
        );

        console.log(token);
        res.status(200).json({token});

    } catch (error) {
        console.log(error);
    }
}