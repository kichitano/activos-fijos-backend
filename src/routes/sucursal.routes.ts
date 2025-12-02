import { Router } from 'express';
import { SucursalController } from '../controllers/SucursalController';
import { authMiddleware, permissionsMiddleware, validateBody } from '../middlewares';
import { CreateSucursalDto, UpdateSucursalDto } from '../dtos/sucursal';
import { UserRole } from '../entities/User';

const router = Router();
const sucursalController = new SucursalController();

/**
 * Rutas de Sucursales
 * Creación, actualización y eliminación: solo ADMINISTRADOR
 * Consulta: ADMINISTRADOR y COORDINADOR
 */

/**
 * @route POST /api/sucursales
 * @desc Crear nueva sucursal
 * @access ADMINISTRADOR
 * @body CreateSucursalDto
 */
router.post(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(CreateSucursalDto),
  sucursalController.create
);

/**
 * @route GET /api/sucursales
 * @desc Listar sucursales con paginación y filtros
 * @access ADMINISTRADOR, COORDINADOR
 * @query page, limit, search, cod_proyecto, departamento
 */
router.get(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  sucursalController.findAll
);

/**
 * @route GET /api/sucursales/ubicacion/departamentos
 * @desc Obtener lista de departamentos de Perú
 * @access ADMINISTRADOR, COORDINADOR
 */
router.get(
  '/ubicacion/departamentos',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  sucursalController.getDepartamentos
);

/**
 * @route GET /api/sucursales/ubicacion/provincias/:departamento
 * @desc Obtener lista de provincias de un departamento
 * @access ADMINISTRADOR, COORDINADOR
 */
router.get(
  '/ubicacion/provincias/:departamento',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  sucursalController.getProvincias
);

/**
 * @route GET /api/sucursales/ubicacion/distritos/:departamento/:provincia
 * @desc Obtener lista de distritos de una provincia
 * @access ADMINISTRADOR, COORDINADOR
 */
router.get(
  '/ubicacion/distritos/:departamento/:provincia',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  sucursalController.getDistritos
);

/**
 * @route GET /api/sucursales/:id
 * @desc Obtener sucursal por ID
 * @access ADMINISTRADOR, COORDINADOR
 */
router.get(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  sucursalController.findById
);

/**
 * @route PUT /api/sucursales/:id
 * @desc Actualizar sucursal
 * @access ADMINISTRADOR
 * @body UpdateSucursalDto
 */
router.put(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(UpdateSucursalDto),
  sucursalController.update
);

/**
 * @route DELETE /api/sucursales/:id
 * @desc Eliminar sucursal
 * @access ADMINISTRADOR
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  sucursalController.delete
);

export default router;
