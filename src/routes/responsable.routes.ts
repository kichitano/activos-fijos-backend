import { Router } from 'express';
import { ResponsableController } from '../controllers/ResponsableController';
import { authMiddleware, permissionsMiddleware, validateBody } from '../middlewares';
import { CreateResponsableDto, UpdateResponsableDto } from '../dtos/responsable';
import { UserRole } from '../entities/User';

const router = Router();
const responsableController = new ResponsableController();

/**
 * Rutas de Responsables
 * Creación, actualización y eliminación: solo ADMINISTRADOR
 * Consulta: ADMINISTRADOR y COORDINADOR
 */

/**
 * @route POST /api/responsables
 * @desc Crear nuevo responsable
 * @access ADMINISTRADOR
 * @body CreateResponsableDto
 */
router.post(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(CreateResponsableDto),
  responsableController.create
);

/**
 * @route GET /api/responsables
 * @desc Listar responsables con paginación y filtros
 * @access ADMINISTRADOR, COORDINADOR
 * @query page, limit, search, area_uuid
 */
router.get(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  responsableController.findAll
);

/**
 * @route GET /api/responsables/:id
 * @desc Obtener responsable por ID
 * @access ADMINISTRADOR, COORDINADOR
 */
router.get(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  responsableController.findById
);

/**
 * @route PUT /api/responsables/:id
 * @desc Actualizar responsable
 * @access ADMINISTRADOR
 * @body UpdateResponsableDto
 */
router.put(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(UpdateResponsableDto),
  responsableController.update
);

/**
 * @route DELETE /api/responsables/:id
 * @desc Eliminar responsable
 * @access ADMINISTRADOR
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  responsableController.delete
);

export default router;
