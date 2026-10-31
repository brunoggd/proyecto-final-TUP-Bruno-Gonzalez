import type { Request, Response } from "express";
import { partidoModel, type PartidoInput } from "../models/partido.model";

type IdParams = { id: string };

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isPartidoInput(body: any): body is PartidoInput {
    return (
        Number.isInteger(body?.id_torneo) && Number(body.id_torneo) > 0 &&
        Number.isInteger(body?.ganador) && Number(body.ganador) > 0 &&
        typeof body?.fecha === 'string' && body.fecha.trim() !== '' &&
        typeof body?.hora === 'string' && body.hora.trim() !== '' &&
        typeof body?.resultado === 'string' && body.resultado.trim() !== '' &&
        Number.isInteger(body?.games) && Number(body.games) > 0 &&
        Number.isInteger(body?.sets) && Number(body.sets) > 0 
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await partidoModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    const partido = await partidoModel.findById(id);
    if (!partido) {
        res.status(404).json({error: 'Partido no encontrado'});
        return;
    }

    res.json(partido);
};

export const create = async (req: Request, res: Response) => {
    if (!isPartidoInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos, el ID del torneo, ganador, fecha, hora, resultado, games y sets son obligatorios'
        });
        return;
    }

    const nuevo = await partidoModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    if (!isPartidoInput(req.body)) {
        res.status(400).json({error: 'Datos inválidos'});
        return;
    }

    const ok = await partidoModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({error: 'Partido no encontrado'});
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

    const ok = await partidoModel.remove(id);
    if (!ok) {
        res.status(404).json({error: 'Partido no encontrado'});
        return;
    }

    res.status(204).send();
};