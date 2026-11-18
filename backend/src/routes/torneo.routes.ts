import { Router } from "express";
import * as torneoController from '../controllers/torneo.controller';

import verificarToken from "../middlewares/verificarToken.middleware";
import autorizarRoles from "../middlewares/autorizarRoles.middleware";
import esPropietarioDelTorneo from "../middlewares/esPropietarioDelTorneo.middleware";

const router = Router();

router.get('/mis-torneos/filtrar', verificarToken, autorizarRoles('organizador'),                          torneoController.filterMine);
router.get('/mis-torneos',         verificarToken, autorizarRoles('organizador'),                          torneoController.getMine);
router.get('/sedes',               verificarToken, autorizarRoles('organizador', 'jugador'),                          torneoController.getLocations);
router.get('/filtrar',             verificarToken, autorizarRoles('organizador', 'jugador'),                          torneoController.filter);
router.get('/',                    verificarToken, autorizarRoles('organizador', 'jugador'),                          torneoController.getAll);
router.get('/jugadores/:id',       verificarToken, autorizarRoles('organizador'),                          torneoController.getPlayers);
router.get('/partidos/:id',        verificarToken, autorizarRoles('organizador'),                          torneoController.getMatches);
router.get('/:id',                 verificarToken, autorizarRoles('organizador'),                          torneoController.getById);
router.post('/',                   verificarToken, autorizarRoles('organizador'),                          torneoController.create);
router.put('/:id',                 verificarToken, autorizarRoles('organizador'), esPropietarioDelTorneo,  torneoController.update);
router.delete('/:id',              verificarToken, autorizarRoles('organizador'), esPropietarioDelTorneo,  torneoController.remove);

export default router;
