import type { Request, Response } from "express";
import { rolModel, RolInput } from "../models/rol.model";

type IdParams = { id: string };

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isRolInput(body: any): body is RolInput {
    return (
        ['jugador', 'organizador', 'espectador'].includes(body?.nombre) &&
        Number.isInteger(body?.id_persona) && Number(body.id_persona) > 0 
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await rolModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    const rol = await rolModel.findById(id);
    if (!rol) {
        res.status(404).json({error: 'Rol no encontrado'});
        return;
    }

    res.json(rol);
};

export const create = async (req: Request, res: Response) => {
    if (!isRolInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos, el nombre del rol y el ID de la persona son obligatorios'
        });
        return;
    }

    const nuevo = await rolModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    if (!isRolInput(req.body)) {
        res.status(400).json({error: 'Datos inválidos'});
        return;
    }

    const ok = await rolModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({error: 'Rol no encontrado'});
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

    const ok = await rolModel.remove(id);
    if (!ok) {
        res.status(404).json({error: 'Rol no encontrado'});
        return;
    }

    res.status(204).send();
};