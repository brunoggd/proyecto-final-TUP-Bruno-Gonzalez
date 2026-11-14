import { Router } from "express";
import * as personaController from '../controllers/persona.controller';

import verificarToken from "../middlewares/verificarToken.middleware";
import autorizarRoles from "../middlewares/autorizarRoles.middleware";

const router = Router();

router.get('/',         verificarToken, autorizarRoles('organizador'),                          personaController.getAll);
router.get('/:id',      verificarToken, autorizarRoles('organizador','jugador','espectador'),   personaController.getById);
router.post('/',        verificarToken, autorizarRoles('organizador'),                          personaController.create);
router.put('/:id',      verificarToken, autorizarRoles('organizador','jugador','espectador'),   personaController.update);
router.delete('/:id',   verificarToken, autorizarRoles('organizador'),                          personaController.remove);

export default router;