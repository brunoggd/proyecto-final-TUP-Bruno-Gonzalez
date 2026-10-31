import { Router } from "express";
import categoriaRoutes from './categoria.routes';
import inscripcionRoutes from './inscripcion.routes';
import participacionRoutes from './participacion.routes';
import partidoRoutes from './partido.routes';
import personaRoutes from './persona.routes';
import rolRoutes from './rol.routes';
import torneoRoutes from './torneo.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/categorias', categoriaRoutes);
router.use('/inscripciones', inscripcionRoutes);
router.use('/participaciones', participacionRoutes);
router.use('/partidos', partidoRoutes);
router.use('/personas', personaRoutes);
router.use('/auth', authRoutes);
router.use('/roles', rolRoutes);
router.use('/torneos', torneoRoutes);

export default router;