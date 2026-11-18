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
        Number.isInteger(Number(body?.id_categoria)) &&
        Number(body.id_categoria) > 0 &&
        
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

// --- NUEVO - COSAS PARA LA PAGINACION ---

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parseQueryInt(value: unknown): number | null {
    if (typeof value !== 'string' || !/^\d+$/.test(value)) {
        return null;
    }

    const number = Number(value);
    return Number.isSafeInteger(number) ? number : null;
}

function getPagination(query: Request['query']) {
    const limit = query.limit === undefined ? DEFAULT_LIMIT : parseQueryInt(query.limit);

    const offset = query.offset === undefined ? 0 : parseQueryInt(query.offset);

    if (limit === null || limit < 1 || offset === null) {
        return null;
    }

    return {
        limit: Math.min(limit, MAX_LIMIT),
        offset
    };
}

export const getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req.query);

    if (!pagination) {
        res.status(400).json({ error: 'Parámetros de paginación inválidos' });
        return;
    }

    const resultado = await torneoModel.findAll(
        pagination.limit,
        pagination.offset
    );

    res.json(resultado);
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

async function ejecutarFiltro(req: RequestConPersona, res: Response, idCreador?: number): Promise<void> {
    const pagination = getPagination(req.query);

    if (!pagination) {
        res.status(400).json({error: 'Parámetros de paginación inválidos'});
        return;
    }

    const nombre = typeof req.query.nombre === 'string' ? req.query.nombre : undefined;

    const categoria = typeof req.query.categoria === 'string' ? req.query.categoria : undefined;

    const sede = typeof req.query.sede === 'string' ? req.query.sede : undefined;

    const resultado = await torneoModel.filter(
        nombre,
        categoria,
        sede,
        pagination.limit,
        pagination.offset,
        idCreador
    );

    res.json(resultado);
}

export const filter = async (req: Request, res: Response) => {
    await ejecutarFiltro(req, res);
};

export const filterMine = async (req: RequestConPersona, res: Response) => {
    if (!req.persona) {
        res.status(401).json({ error: 'No autenticado' });
        return;
    }

    await ejecutarFiltro(req, res, req.persona.id);
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
        id_torneo: id,
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

export const getMine = async (req: RequestConPersona, res: Response) => {
    if (!req.persona) {
        res.status(401).json({ error: 'No autenticado' });
        return;
    }

    const pagination = getPagination(req.query);

    if (!pagination) {
        res.status(400).json({ error: 'Parámetros de paginación inválidos' });
        return;
    }

    const resultado = await torneoModel.findByCreator(
        req.persona.id,
        pagination.limit,
        pagination.offset
    );

    res.json(resultado);
};