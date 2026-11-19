import type { Request, Response } from "express";
import { partidoModel, type SetPartido, type PartidoInput } from "../models/partido.model";
import { isValidDateOnly } from "../helpers/isValidDateOnly";
import { isValidTime } from "../helpers/isValidTime";

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
        typeof body?.hora === 'string' && body.hora.trim() !== ''
    );
}

function isSetPartidoArray(body: any): body is SetPartido[] {
    return (
        Array.isArray(body) &&
        body.every(set =>
            Number.isInteger(set?.id_set) && set.id_set > 0 &&
            Number.isInteger(set?.games_jugador1) && set.games_jugador1 >= 0 &&
            Number.isInteger(set?.games_jugador2) && set.games_jugador2 >= 0
        )
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
            error: 'Datos inválidos, el ID del torneo, ganador, fecha y hora son obligatorios'
        });

        return;
    }

    const nuevo = await partidoModel.create(req.body);

    res.status(201).json(nuevo);
};

export const updateSchedule = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const { fecha, hora } = req.body;

    if (!isValidDateOnly(fecha)) {
        res.status(400).json({ error: 'La fecha debe ser válida y tener formato YYYY-MM-DD' });
        return;
    }

    if (!isValidTime(hora)) {
        res.status(400).json({ error: 'La hora debe ser válida y tener formato HH:mm' });
        return;
    }

    const rango = await partidoModel.findTournamentDateRangeByMatch(id);

    if (!rango) {
        res.status(404).json({ error: 'Partido no encontrado' });
        return;
    }

    if (fecha < rango.fechaInicio || fecha > rango.fechaFin) {
        res.status(400).json({
            error: 'La fecha debe estar entre el inicio y el fin del torneo'
        });
        return;
    }

    await partidoModel.updateSchedule(id, fecha, hora);

    res.json({ id_partido: id, fecha, hora });
};

export const getSetsByMatch = async (req: Request<IdParams>,res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({
            error: 'ID inválido'
        });
        return;
    }
    const sets = await partidoModel.findSetsByMatch(id);

    res.json(sets);
};

export const updateSets = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    if (!isSetPartidoArray(req.body)) {
        res.status(400).json({ error: 'Se esperaba un array de sets válido' });
        return;
    }

    const resultado = await partidoModel.updateSets(id, req.body);

    if (resultado.estado === 'PARTIDO_NO_ENCONTRADO') {
        res.status(404).json({ error: 'Partido no encontrado' });
        return;
    }

    if (resultado.estado === 'RONDA_CERRADA') {
        res.status(409).json({
            error: 'No se puede modificar el resultado: ya se creó una ronda posterior'
        });
        return;
    }

    if (resultado.estado === 'CAMPEON_DETERMINADO') {
        res.json({
            mensaje: 'Resultado actualizado; se determinó el campeón',
            ganador: resultado.ganador,
            campeon: resultado.ganador
        });
        return;
    }

    if (resultado.estado === 'RONDA_CREADA') {
        res.json({
            mensaje: 'Resultado actualizado y siguiente ronda creada',
            ganador: resultado.ganador,
            numero_ronda: resultado.numero_ronda,
            partidos_creados: resultado.partidos_creados
        });
        return;
    }

    res.json({
        mensaje: 'Resultado actualizado',
        ganador: resultado.ganador
    });
};

export const createSet = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const resultado = await partidoModel.createSet(id);

    if (resultado === 'PARTIDO_NO_ENCONTRADO') {
        res.status(404).json({ error: 'Partido no encontrado' });
        return;
    }

    if (resultado === 'RONDA_CERRADA') {
        res.status(409).json({
            error: 'No se pueden modificar los sets: ya se avanzó a una ronda posterior'
        });
        return;
    }

    res.status(201).json({ ok: true });
};

export const removeSet = async (req: Request<IdParams>, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({
            error: 'ID inválido'
        });
        return;
    }

    const resultado = await partidoModel.removeSet(id);

    if (resultado === 'SET_NO_ENCONTRADO') {
        res.status(404).json({ error: 'Set no encontrado' });
        return;
    }

    if (resultado === 'RONDA_CERRADA') {
        res.status(409).json({ error: 'No se pueden modificar los sets: ya se avanzó a una ronda posterior' });
        return;
    }

    res.status(204).send();
};