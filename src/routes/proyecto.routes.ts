import { Router } from 'express';
import { ProyectoController } from '../controllers/ProyectoController';
import { authMiddleware, permissionsMiddleware, validateBody } from '../middlewares';
import { CreateProyectoDto, UpdateProyectoDto } from '../dtos/proyecto';
import { UserRole } from '../entities/User';

const router = Router();
const proyectoController = new ProyectoController();

/**
 * Rutas de Proyectos
 * Creación, actualización y eliminación: solo ADMINISTRADOR
 * Consulta: ADMINISTRADOR y COORDINADOR
 */

/**
 * @route POST /api/proyectos
 * @desc Crear nuevo proyecto
 * @access ADMINISTRADOR
 * @body CreateProyectoDto
 */
router.post(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(CreateProyectoDto),
  proyectoController.create
);

/**
 * @route GET /api/proyectos
 * @desc Listar proyectos con paginación y filtros
 * @access ADMINISTRADOR, COORDINADOR
 * @query page, limit, search, situacion
 */
router.get(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  proyectoController.findAll
);

/**
 * @route GET /api/proyectos/:id
 * @desc Obtener proyecto por ID
 * @access ADMINISTRADOR, COORDINADOR
 */
router.get(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  proyectoController.findById
);

/**
 * @route PUT /api/proyectos/:id
 * @desc Actualizar proyecto
 * @access ADMINISTRADOR
 * @body UpdateProyectoDto
 */
router.put(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(UpdateProyectoDto),
  proyectoController.update
);

/**
 * @route DELETE /api/proyectos/:id
 * @desc Eliminar proyecto
 * @access ADMINISTRADOR
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  proyectoController.delete
);

export default router;
