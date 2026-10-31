import type { Request, Response } from "express";
import { personaModel, type PersonaInput } from "../models/persona.model";

type IdParams = { id: string };

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isPersonaInput(body: any): body is PersonaInput {
    return (
        typeof body?.nombre === 'string' && body.nombre.trim() !== '' &&
        typeof body?.apellido === 'string' && body.apellido.trim() !== '' &&
        typeof body?.contrasena === 'string' && body.contrasena.trim() !== '' &&
        typeof body?.fecha_nacimiento === 'string' && body.fecha_nacimiento.trim() !== '' &&
        typeof body?.estaJugandoUnTorneo === 'boolean' &&
        Number.isInteger(body?.torneosGanados) && Number(body.torneosGanados) >= 0
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await personaModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const persona = await personaModel.findById(id);
    if (!persona) {
        res.status(404).json({ error: 'Persona no encontrada' });
        return;
    }

    res.json(persona);
};

export const create = async (req: Request, res: Response) => {
    if (!isPersonaInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos: nombre, apellido, contraseña, fecha de nacimiento, estado de torneo y torneos ganados son obligatorios'
        });
        return;
    }

    const nuevo = await personaModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    if (!isPersonaInput(req.body)) {
        res.status(400).json({ error: 'Datos inválidos' });
        return;
    }

    const ok = await personaModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({ error: 'Persona no encontrada' });
        return;
    }

    res.json({
        id, ...req.body
    });
};

export const remove = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const ok = await personaModel.remove(id);
    if (!ok) {
        res.status(404).json({ error: 'Persona no encontrada' });
        return;
    }

    res.status(204).send();
};
