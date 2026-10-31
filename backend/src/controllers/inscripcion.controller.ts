import type { Request, Response } from "express";
import { inscripcionModel, type InscripcionInput } from "../models/inscripcion.model";

type IdParams = { id: string };

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isInscripcionInput(body: any): body is InscripcionInput {
    return (
        Number.isInteger(body?.id_persona) && Number(body.id_persona) > 0 &&
        Number.isInteger(body?.id_torneo) && Number(body.id_torneo) > 0
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await inscripcionModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    const inscripcion = await inscripcionModel.findById(id);
    if (!inscripcion) {
        res.status(404).json({error: 'Inscripción no encontrada'});
        return;
    }

    res.json(inscripcion);
};

export const create = async (req: Request, res: Response) => {
    if (!isInscripcionInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos, tanto el ID de la persona como el del torneo son obligatorios'
        });
        return;
    }

    const nuevo = await inscripcionModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    if (!isInscripcionInput(req.body)) {
        res.status(400).json({error: 'Datos inválidos'});
        return;
    }

    const ok = await inscripcionModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({error: 'Inscripción no encontrada'});
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

    const ok = await inscripcionModel.remove(id);
    if (!ok) {
        res.status(404).json({error: 'Inscripción no encontrada'});
        return;
    }

    res.status(204).send();
};