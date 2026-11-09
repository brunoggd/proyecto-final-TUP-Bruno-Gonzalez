import { Router } from "express";
import * as partidoController from '../controllers/partido.controller';

const router = Router();

router.get('/', partidoController.getAll);
router.get('/sets/:id', partidoController.getSetsByMatch);
router.get('/:id', partidoController.getById);
router.post('/', partidoController.create);
router.post('/sets/:id',partidoController.createSet);
router.put('/:id', partidoController.update);
router.put('/sets/:id',partidoController.updateSets);
router.delete('/sets/:id',partidoController.removeSet);
router.delete('/:id', partidoController.remove);

export default router;
