import { Router } from 'express';
import { AuditoriaController } from '../controllers/AuditoriaController';
import { authMiddleware, permissionsMiddleware, validateBody } from '../middlewares';
import { CreateAuditoriaDto } from '../dtos/auditoria';
import { UserRole } from '../entities/User';

const router = Router();
const auditoriaController = new AuditoriaController();

/**
 * Rutas de Auditoría de Ubicación
 */

/**
 * @route POST /api/auditoria/ubicacion
 * @desc Registrar ubicación GPS al crear un activo nuevo
 * @access REGISTRADOR, ADMINISTRADOR
 * @body CreateAuditoriaDto
 */
router.post(
  '/ubicacion',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.REGISTRADOR]),
  validateBody(CreateAuditoriaDto),
  auditoriaController.registrar
);

/**
 * @route GET /api/auditoria/ubicacion/user/:userId
 * @desc Obtener registros de auditoría por usuario
 * @access COORDINADOR, ADMINISTRADOR
 * @query fechaDesde, fechaHasta
 */
router.get(
  '/ubicacion/user/:userId',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  auditoriaController.findByUser
);

/**
 * @route GET /api/auditoria/ubicacion/:inventarioNuevoId
 * @desc Obtener historial de ubicaciones para un activo
 * @access COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/ubicacion/:inventarioNuevoId',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  auditoriaController.findByInventarioNuevo
);

export default router;
