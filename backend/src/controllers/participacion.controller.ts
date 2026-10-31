import type { Request, Response } from "express";
import { participacionModel, type ParticipacionInput } from "../models/participacion.model";

type IdParams = { id: string };

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isParticipacionInput(body: any): body is ParticipacionInput {
    return (
        Number.isInteger(body?.id_partido) && Number(body.id_partido) > 0 &&
        Number.isInteger(body?.id_persona) && Number(body.id_persona) > 0
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await participacionModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    const participacion = await participacionModel.findById(id);
    if (!participacion) {
        res.status(404).json({error: 'Participación no encontrada'});
        return;
    }

    res.json(participacion);
};

export const create = async (req: Request, res: Response) => {
    if (!isParticipacionInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos, tanto el ID del partido como el de la persona son obligatorios'
        });
        return;
    }

    const nuevo = await participacionModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    if (!isParticipacionInput(req.body)) {
        res.status(400).json({error: 'Datos inválidos'});
        return;
    }

    const ok = await participacionModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({error: 'Participación no encontrada'});
        return;
    }

    res.json({
        id, ...req.body
    });
};

export const remove = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    const ok = await participacionModel.remove(id);
    if (!ok) {
        res.status(404).json({error: 'Participación no encontrada'});
        return;
    }

    res.status(204).send();
};