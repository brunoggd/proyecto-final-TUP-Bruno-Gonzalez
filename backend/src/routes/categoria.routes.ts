import { Router } from "express";
import * as categoriaController from '../controllers/categoria.controller';

import verificarToken from "../middlewares/verificarToken.middleware";
import autorizarRoles from "../middlewares/autorizarRoles.middleware";

const router = Router();

router.get('/nombres',  verificarToken, autorizarRoles('organizador'), categoriaController.getNames);
router.get('/',         verificarToken, autorizarRoles('organizador', 'jugador'), categoriaController.getAll);
router.get('/:id',      verificarToken, autorizarRoles('organizador'), categoriaController.getById);
router.post('/',        verificarToken, autorizarRoles('organizador'), categoriaController.create);
router.put('/:id',      verificarToken, autorizarRoles('organizador'), categoriaController.update);
router.delete('/:id',   verificarToken, autorizarRoles('organizador'), categoriaController.remove);

export default router;