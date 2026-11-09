import { Router } from "express";
import * as torneoController from '../controllers/torneo.controller';

const router = Router();

router.get('/sedes', torneoController.getLocations);
router.get('/filtrar', torneoController.filter);
router.get('/', torneoController.getAll);
router.get('/jugadores/:id', torneoController.getPlayers);
router.get('/partidos/:id', torneoController.getMatches);
router.get('/:id', torneoController.getById);
router.post('/', torneoController.create);
router.put('/:id', torneoController.update);
router.delete('/:id', torneoController.remove);

export default router;