import { Router } from "express";
import * as participacionController from '../controllers/participacion.controller';

const router = Router();

router.get('/', participacionController.getAll);
router.get('/:id', participacionController.getById);
router.post('/', participacionController.create);
router.put('/:id', participacionController.update);
router.delete('/:id', participacionController.remove);

export default router;