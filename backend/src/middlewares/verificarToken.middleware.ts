import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

type RequestConPersona = Request & {
    persona?: {
        id: number;
        rol: string;
        tienePermisosDeOrganizador: boolean;
    };
};

function verificarToken(
    req: RequestConPersona,
    res: Response,
    next: NextFunction
) {
    const cabecera = req.headers['authorization'];
    if (!cabecera || !cabecera.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Falta el token'});
    }

    const token = cabecera.slice(7);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: number;
            rol: string;
            tienePermisosDeOrganizador: boolean;
        };
        
        req.persona = payload;
        next();
    } catch (error) {
        return res.status(401).json({error: 'Token inválido o vencido'});
    }
}

export default verificarToken;