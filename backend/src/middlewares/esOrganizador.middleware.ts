import { Request, Response, NextFunction } from "express";

type RequestConPersona = Request & {
    persona?: {
        id_persona: number;
        rol: string;
        tienePermisosDeOrganizador: number;
    };
};

function esOrganizador(req: RequestConPersona, res: Response, next: NextFunction) {
    if (!req.persona || req.persona.tienePermisosDeOrganizador === 0) {
        return res.status(403).json({error: 'No tienes permitido esto'});
    }
    next();
}

export default esOrganizador;