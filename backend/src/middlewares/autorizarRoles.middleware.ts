import {Request, Response, NextFunction} from 'express';

type RequestConPersona = Request & {
    persona?: {
        id: number;
        rol: string;
    };
};

function autorizarRoles(...rolesPermitidos: string[]) {
    return (req: RequestConPersona, res: Response, next: NextFunction) => {
        if (!req.persona || !rolesPermitidos.includes(req.persona.rol)) {
            return res.status(403).json({error: `Acceso denegado`});
        }

        next();
    };
}

export default autorizarRoles;