import { Router } from "express";
import * as personaController from '../controllers/persona.controller';

const router = Router();

router.get('/', personaController.getAll);
router.get('/:id', personaController.getById);
router.post('/', personaController.create);
router.put('/:id', personaController.update);
router.delete('/:id', personaController.remove);

export default router;