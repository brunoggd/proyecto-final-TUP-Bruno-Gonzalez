import {Request,Response,NextFunction} from 'express';

type RequestConPersona = Request & {
    persona?: {
        id: number;
        rol: string;
    };
};

function esPropietarioOOrganizador(req: RequestConPersona, res: Response, next: NextFunction) {
    const idSolicitado = Number(req.params.id);
    if ( !req.persona ) {
        return res.status(401).json({error: 'Persona no autenticada'});
    }

    if ( req.persona.rol === 'organizador' ) {
        return next();
    }

    if ( req.persona.id !== idSolicitado ) {
        return res.status(403).json({error: 'No puedes modificar recursos ajenos'});
    }

    next();
}

export default esPropietarioOOrganizador;

// METER ESTO EN LAS ROUTES A FUTURO