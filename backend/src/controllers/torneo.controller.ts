import type { Request, Response } from "express";
import { torneoModel, type TorneoInput } from "../models/torneo.model";

type IdParams = { id: string };

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isTorneoInput(body: any): body is TorneoInput {
    return (
        typeof body?.nombre === 'string' && body.nombre.trim() !== '' &&
        typeof body?.ubicacion === 'string' && body.ubicacion.trim() !== '' &&
        Number.isInteger(body?.jugadores) && Number(body.jugadores) > 0 &&
        typeof body?.premio === 'boolean' &&
        Number.isInteger(body?.montoPremio) && Number(body.montoPremio) >= 0 &&
        typeof body?.fechaInicio === 'string' && body.fechaInicio.trim() !== '' &&
        typeof body?.fechaFin === 'string' && body.fechaFin.trim() !== ''
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await torneoModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const torneo = await torneoModel.findById(id);
    if (!torneo) {
        res.status(404).json({ error: 'Torneo no encontrado' });
        return;
    }

    res.json(torneo);
};

export const create = async (req: Request, res: Response) => {
    if (!isTorneoInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos: nombre, ubicación, jugadores, premio, monto del premio, fecha de inicio y fecha de fin son obligatorios'
        });
        return;
    }

    const nuevo = await torneoModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    if (!isTorneoInput(req.body)) {
        res.status(400).json({ error: 'Datos inválidos' });
        return;
    }

    const ok = await torneoModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({ error: 'Torneo no encontrado' });
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

    const ok = await torneoModel.remove(id);
    if (!ok) {
        res.status(404).json({ error: 'Torneo no encontrado' });
        return;
    }

    res.status(204).send();
};
