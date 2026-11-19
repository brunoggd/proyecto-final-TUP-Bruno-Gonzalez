import type { Request, Response } from "express";
import { inscripcionModel } from "../models/inscripcion.model";

type IdParams = { id: string };
type RequestConPersona = Request & {
    persona?: {
        id: number;
        rol: string;
    };
};

function parseId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
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

export const create = async (req: RequestConPersona, res: Response) => {
    if (!req.persona) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
    }

    const idTorneo = parseId(String(req.body?.id_torneo));

    if (!idTorneo) {
        res.status(400).json({ error: 'ID de torneo inválido' });
        return;
    }

    try {
        const nueva = await inscripcionModel.createIfAvailable(req.persona.id, idTorneo);
        res.status(201).json(nueva);

    } catch (error) {
        const code = error instanceof Error ? error.message : '';

        if (code === 'TORNEO_NO_EXISTE') {
            res.status(404).json({ error: 'Torneo no encontrado' });
            return;
        }

        if (code === 'TORNEO_COMPLETO') {
            res.status(409).json({ error: 'El torneo ya alcanzó el cupo de inscriptos' });
            return;
        }

        if (code === 'YA_INSCRIPTO') {
            res.status(409).json({ error: 'Ya estás inscripto en este torneo' });
            return;
        }

        if (code === 'INSCRIPCION_CERRADA') {
            res.status(409).json({ error: 'Las inscripciones de este torneo están cerradas' });
            return;
        }

        throw error;
    }
};

export const remove = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    const resultado = await inscripcionModel.removeIfRegistrationOpen(id);

    if (resultado === 'NO_ENCONTRADO') {
        res.status(404).json({ error: 'Inscripción no encontrada' });
        return;
    }

    if (resultado === 'INSCRIPCION_CERRADA') {
        res.status(409).json({ error: 'No se puede eliminar la inscripción porque las inscripciones están cerradas' });
        return;
    }

    res.status(204).send();
};