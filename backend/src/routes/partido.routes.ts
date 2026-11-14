import { Router } from "express";
import * as partidoController from '../controllers/partido.controller';

import verificarToken from "../middlewares/verificarToken.middleware";
import autorizarRoles from "../middlewares/autorizarRoles.middleware";

const router = Router();

router.get('/',             verificarToken, autorizarRoles('organizador','jugador','espectador'),   partidoController.getAll);
router.get('/sets/:id',     verificarToken, autorizarRoles('organizador','jugador','espectador'),   partidoController.getSetsByMatch);
router.get('/:id',          verificarToken, autorizarRoles('organizador','jugador','espectador'),   partidoController.getById);
router.post('/',            verificarToken, autorizarRoles('organizador'),                          partidoController.create);
router.post('/sets/:id',    verificarToken, autorizarRoles('organizador'),                          partidoController.createSet);
router.put('/:id',          verificarToken, autorizarRoles('organizador'),                          partidoController.update);
router.put('/sets/:id',     verificarToken, autorizarRoles('organizador'),                          partidoController.updateSets);
router.delete('/sets/:id',  verificarToken, autorizarRoles('organizador'),                          partidoController.removeSet);
router.delete('/:id',       verificarToken, autorizarRoles('organizador'),                          partidoController.remove);

export default router;