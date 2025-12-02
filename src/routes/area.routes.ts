import { Router } from 'express';
import { AreaController } from '../controllers/AreaController';
import { authMiddleware, permissionsMiddleware, validateBody } from '../middlewares';
import { CreateAreaDto, UpdateAreaDto } from '../dtos/area';
import { UserRole } from '../entities/User';

const router = Router();
const areaController = new AreaController();

/**
 * Rutas de Areas
 * Creación, actualización y eliminación: solo ADMINISTRADOR
 * Consulta: ADMINISTRADOR y COORDINADOR
 */

/**
 * @route POST /api/areas
 * @desc Crear nueva área
 * @access ADMINISTRADOR
 * @body CreateAreaDto
 */
router.post(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(CreateAreaDto),
  areaController.create
);

/**
 * @route GET /api/areas
 * @desc Listar áreas con paginación y filtros
 * @access ADMINISTRADOR, COORDINADOR
 * @query page, limit, search, cod_proyecto, cod_sucursal
 */
router.get(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  areaController.findAll
);

/**
 * @route GET /api/areas/:id
 * @desc Obtener área por ID
 * @access ADMINISTRADOR, COORDINADOR
 */
router.get(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  areaController.findById
);

/**
 * @route PUT /api/areas/:id
 * @desc Actualizar área
 * @access ADMINISTRADOR
 * @body UpdateAreaDto
 */
router.put(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(UpdateAreaDto),
  areaController.update
);

/**
 * @route DELETE /api/areas/:id
 * @desc Eliminar área
 * @access ADMINISTRADOR
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  areaController.delete
);

export default router;
