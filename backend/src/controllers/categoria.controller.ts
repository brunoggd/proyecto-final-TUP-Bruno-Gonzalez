import type { Request, Response } from "express";
import { categoriaModel, type CategoriaInput } from "../models/categoria.model";

type IdParams = { id: string };

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isCategoriaInput(body: any): body is CategoriaInput {
    return (
        typeof body?.nombre === 'string' && body.nombre.trim() !== '' && body.nombre.length <= 25 &&
        Number.isInteger(body?.id_torneo) && Number(body.id_torneo) > 0
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await categoriaModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    const categoria = await categoriaModel.findById(id);
    if (!categoria) {
        res.status(404).json({error: 'Categoria no encontrada'});
        return;
    }

    res.json(categoria);
};

export const create = async (req: Request, res: Response) => {
    if (!isCategoriaInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos, nombre e ID del torneo son obligatorios'
        });
        return;
    }

    const nuevo = await categoriaModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    if (!isCategoriaInput(req.body)) {
        res.status(400).json({error: 'Datos inválidos'});
        return;
    }

    const ok = await categoriaModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({error: 'Categoría no encontrada'});
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

    const ok = await categoriaModel.remove(id);
    if (!ok) {
        res.status(404).json({error: 'Categoría no encontrada'});
        return;
    }

    res.status(204).send();
};