import { Router } from "express";
import * as inscripcionController from '../controllers/inscripcion.controller';

const router = Router();

router.get('/', inscripcionController.getAll);
router.get('/:id', inscripcionController.getById);
router.post('/', inscripcionController.create);
router.put('/:id', inscripcionController.update);
router.delete('/:id', inscripcionController.remove);

export default router;