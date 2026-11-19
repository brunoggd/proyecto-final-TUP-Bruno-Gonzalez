import { Router } from "express";
import * as partidoController from '../controllers/partido.controller';

import verificarToken from "../middlewares/verificarToken.middleware";
import autorizarRoles from "../middlewares/autorizarRoles.middleware";

const router = Router();

router.get('/',             verificarToken, autorizarRoles('organizador','jugador','espectador'),   partidoController.getAll);
router.get('/sets/:id',     verificarToken, autorizarRoles('organizador','jugador','espectador'),   partidoController.getSetsByMatch);
router.get('/:id',          verificarToken, autorizarRoles('organizador','jugador','espectador'),   partidoController.getById);
router.post('/sets/:id',    verificarToken, autorizarRoles('organizador'),                          partidoController.createSet);
router.put('/horario/:id',  verificarToken, autorizarRoles('organizador'),                          partidoController.updateSchedule);
router.put('/sets/:id',     verificarToken, autorizarRoles('organizador'),                          partidoController.updateSets);
router.delete('/sets/:id',  verificarToken, autorizarRoles('organizador'),                          partidoController.removeSet);

export default router;