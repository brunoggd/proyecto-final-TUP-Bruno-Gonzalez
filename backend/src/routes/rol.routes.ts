import { Router } from "express";
import * as rolController from '../controllers/rol.controller';

import verificarToken from "../middlewares/verificarToken.middleware";
import autorizarRoles from "../middlewares/autorizarRoles.middleware";

const router = Router();

router.get('/',         verificarToken, autorizarRoles('organizador'),                          rolController.getAll);
router.get('/:id',      verificarToken, autorizarRoles('organizador','jugador','espectador'),   rolController.getById);
router.post('/',        verificarToken, autorizarRoles('organizador'),                          rolController.create);
router.put('/:id',      verificarToken, autorizarRoles('organizador','jugador','espectador'),   rolController.update);
router.delete('/:id',   verificarToken, autorizarRoles('organizador'),                          rolController.remove);

export default router;
