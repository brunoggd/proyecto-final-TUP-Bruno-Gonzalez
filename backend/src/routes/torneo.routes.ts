import { Router } from "express";
import * as torneoController from '../controllers/torneo.controller';

const router = Router();

router.get('/', torneoController.getAll);
router.get('/:id', torneoController.getById);
router.post('/', torneoController.create);
router.put('/:id', torneoController.update);
router.delete('/:id', torneoController.remove);

export default router;