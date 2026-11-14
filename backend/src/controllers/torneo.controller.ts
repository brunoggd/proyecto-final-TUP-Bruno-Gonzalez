import type { Request, Response } from "express";
import { torneoModel, type TorneoInput } from "../models/torneo.model";

type RequestConPersona = Request & {
    persona?: {
        id: number;
        rol: string;
    };
};

type IdParams = { id: string };

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isTorneoInput(body: any): body is TorneoInput {
    return (
        typeof body?.nombre === 'string' &&
        body.nombre.trim() !== '' &&

        typeof body?.ubicacion === 'string' &&
        body.ubicacion.trim() !== '' &&

        Number.isInteger(Number(body?.jugadores)) &&
        Number(body.jugadores) > 0 &&

        Number.isInteger(Number(body?.montoPremio)) &&
        Number(body.montoPremio) >= 0 &&

        typeof body?.fechaInicio === 'string' &&
        body.fechaInicio.trim() !== '' &&

        typeof body?.fechaFin === 'string' &&
        body.fechaFin.trim() !== ''
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await torneoModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({
            error: 'ID inválido'
        });
        return;
    }

    const torneo = await torneoModel.findById(id);

    if (!torneo) {
        res.status(404).json({
            error: 'Torneo no encontrado'
        });
        return;
    }

    res.json(torneo);
};

export const filter = async (req: Request, res: Response) => {
    const nombre = typeof req.query.nombre === 'string' ? req.query.nombre : undefined;

    const categoria = typeof req.query.categoria === 'string' ? req.query.categoria : undefined;

    const sede = typeof req.query.sede === 'string' ? req.query.sede : undefined;

    const torneos = await torneoModel.filter(nombre, categoria, sede);

    res.json(torneos);
};

export const getLocations = async (_req: Request, res: Response) => {
    res.json(await torneoModel.getLocations());
};

export const create = async (req: RequestConPersona, res: Response) => {
    if (!isTorneoInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos: nombre, ubicación, cantidad de jugadores, monto del premio, fecha de inicio y fecha de fin son obligatorios'
        });
        return;
    }

    if (!req.persona) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
    }

    const nuevo = await torneoModel.create({
        ...req.body,
        id_creador: req.persona.id
    });

    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({
            error: 'ID inválido'
        });
        return;
    }

    if (!isTorneoInput(req.body)) {
        res.status(400).json({
            error: 'Datos inválidos',
            body: req.body
        });
        return;
    }

    const ok = await torneoModel.update(
        id,
        req.body
    );

    if (!ok) {
        res.status(404).json({
            error: 'Torneo no encontrado'
        });
        return;
    }

    res.json({
        id,
        ...req.body
    });
};

export const remove = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({
            error: 'ID inválido'
        });
        return;
    }

    const ok = await torneoModel.remove(id);

    if (!ok) {
        res.status(404).json({
            error: 'Torneo no encontrado'
        });
        return;
    }

    res.status(204).send();
};

export const getPlayers = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({
            error: 'ID inválido'
        });
        return;
    }

    const players = await torneoModel.findPlayersByTournament(id);

    res.json(players);
};

export const getMatches = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({
            error: 'ID inválido'
        });

        return;
    }

    const matches = await torneoModel.findMatchesByTournament(id);

    res.json(matches);
};