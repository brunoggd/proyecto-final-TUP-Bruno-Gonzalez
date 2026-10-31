import { Router } from "express";
import * as rolController from '../controllers/rol.controller';

const router = Router();

router.get('/', rolController.getAll);
router.get('/:id', rolController.getById);
router.post('/', rolController.create);
router.put('/:id', rolController.update);
router.delete('/:id', rolController.remove);

export default router;