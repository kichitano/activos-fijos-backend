import { Router } from 'express';
import { InventarioNuevoController } from '../controllers/InventarioNuevoController';
import { authMiddleware, permissionsMiddleware, validateBody } from '../middlewares';
import { CreateInventarioNuevoDto, RegisterFromExistingDto } from '../dtos/inventario-nuevo';
import { UserRole } from '../entities/User';

const router = Router();
const inventarioNuevoController = new InventarioNuevoController();

/**
 * Rutas de InventarioNuevo
 * Creación: solo REGISTRADOR y ADMINISTRADOR
 * Consulta: todos los roles autenticados
 */

/**
 * @route POST /api/inventario-nuevo
 * @desc Crear nuevo registro de activo fijo
 * @access REGISTRADOR, ADMINISTRADOR
 * @body CreateInventarioNuevoDto
 */
router.post(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.REGISTRADOR]),
  validateBody(CreateInventarioNuevoDto),
  inventarioNuevoController.create
);

/**
 * @route POST /api/inventario-nuevo/register-from-existing
 * @desc Registrar activo desde uno existente en inventario (escaneo QR/barcode)
 * @access REGISTRADOR, ADMINISTRADOR
 * @body RegisterFromExistingDto
 */
router.post(
  '/register-from-existing',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.REGISTRADOR]),
  validateBody(RegisterFromExistingDto),
  inventarioNuevoController.registerFromExisting
);

/**
 * @route PUT /api/inventario-nuevo/:id/update-from-existing
 * @desc Actualizar registro existente de activo fijo
 * @access REGISTRADOR, ADMINISTRADOR
 * @body RegisterFromExistingDto
 */
router.put(
  '/:id/update-from-existing',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.REGISTRADOR]),
  validateBody(RegisterFromExistingDto),
  inventarioNuevoController.updateFromExisting
);

/**
 * @route GET /api/inventario-nuevo
 * @desc Listar activos con paginación y filtros
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 * @query page, limit, search, sucursal, area, estado, userId, fechaDesde, fechaHasta
 */
router.get(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioNuevoController.findAll
);

/**
 * @route GET /api/inventario-nuevo/:id
 * @desc Obtener detalle completo por ID
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioNuevoController.findById
);

export default router;
