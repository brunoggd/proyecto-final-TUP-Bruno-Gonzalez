import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import type { Request, Response } from "express";

import { personaModel } from "../models/persona.model";
import { pool } from '../config/db';

export async function register(req: Request, res: Response) {
    const { nombre, apellido, contrasena, email, fecha_nacimiento, rol } = req.body;

    const buscarExistente = await personaModel.findByEmail(email);
    if (buscarExistente) {
        return res.status(409).json({error: 'Usuario con este email ya registrado'});
    }

    const contrasena_hash = await bcrypt.hash(contrasena, 10);
    const rows = await personaModel.findAll();
    const esPrimero: boolean = rows.length === 0;

    const personaData = {
        nombre,
        apellido,
        contrasena: contrasena_hash,
        email,
        fecha_nacimiento,
        estaJugandoUnTorneo: false,
        torneosGanados: 0,
        tienePermisosDeOrganizador: esPrimero ? true : false,
        rol,
    };

    const persona = await personaModel.create(personaData);

    await pool.query(
        'INSERT INTO roles(nombre, id_persona) VALUES(?, ?)', [rol, persona.id_persona]
    );

    res.status(201).json({
        mensaje: 'Persona registrada correctamente'
    });
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

        const token = jwt.sign(
            {
                id: personaExiste.id_persona,
                rol: personaExiste.rol,
                tienePermisosDeOrganizador: personaExiste.tienePermisosDeOrganizador
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