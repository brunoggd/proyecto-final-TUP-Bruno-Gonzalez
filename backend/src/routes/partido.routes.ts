import { Router } from "express";
import * as partidoController from '../controllers/partido.controller';

const router = Router();

router.get('/', partidoController.getAll);
router.get('/:id', partidoController.getById);
router.post('/', partidoController.create);
router.put('/:id', partidoController.update);
router.delete('/:id', partidoController.remove);

export default router;