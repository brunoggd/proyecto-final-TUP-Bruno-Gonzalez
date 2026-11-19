import { Router } from "express";
import * as inscripcionController from '../controllers/inscripcion.controller';

import verificarToken from "../middlewares/verificarToken.middleware";
import autorizarRoles from "../middlewares/autorizarRoles.middleware";

const router = Router();

router.get('/',         verificarToken, autorizarRoles('organizador'),              inscripcionController.getAll);
router.get('/:id',      verificarToken, autorizarRoles('organizador'),              inscripcionController.getById);
router.post('/',        verificarToken, autorizarRoles('jugador'),                  inscripcionController.create);
router.delete('/:id',   verificarToken, autorizarRoles('organizador', 'jugador'),   inscripcionController.remove);

export default router;