import { Router } from "express";
import * as participacionController from '../controllers/participacion.controller';

import verificarToken from "../middlewares/verificarToken.middleware";
import autorizarRoles from "../middlewares/autorizarRoles.middleware";

const router = Router();

router.get('/',         verificarToken, autorizarRoles('organizador'), participacionController.getAll);
router.get('/:id',      verificarToken, autorizarRoles('organizador'), participacionController.getById);
router.post('/',        verificarToken, autorizarRoles('organizador'), participacionController.create);
router.put('/:id',      verificarToken, autorizarRoles('organizador'), participacionController.update);
router.delete('/:id',   verificarToken, autorizarRoles('organizador'), participacionController.remove);

export default router;
