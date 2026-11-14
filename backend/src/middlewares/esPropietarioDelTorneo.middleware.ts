import { Request, Response, NextFunction } from 'express';
import { torneoModel } from '../models/torneo.model';

type RequestConPersona = Request & {
    persona?: {
        id: number;
        rol: string;
    };
};

async function esPropietarioDelTorneo(req: RequestConPersona,res: Response,next: NextFunction) {
    if (!req.persona) {
        return res.status(401).json({error: 'No autenticado'});
    }

    const idTorneo = Number(req.params.id);
    const torneo = await torneoModel.findById(idTorneo);

    if (!torneo) {
        return res.status(404).json({error: 'Torneo no encontrado'});
    }

    if (torneo.id_creador !== req.persona.id) {
        return res.status(403).json({error: 'No puedes modificar torneos ajenos'});
    }

    next();
}

export default esPropietarioDelTorneo;