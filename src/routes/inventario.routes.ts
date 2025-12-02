import { Router } from 'express';
import { InventarioController } from '../controllers/InventarioController';
import { authMiddleware, permissionsMiddleware } from '../middlewares';
import { UserRole } from '../entities/User';

const router = Router();
const inventarioController = new InventarioController();

/**
 * Rutas de Inventario histórico (solo lectura)
 * Accesible para REGISTRADOR, COORDINADOR y ADMINISTRADOR
 */

/**
 * @route GET /api/inventario/buscar-todos?q=query&limit=50&offset=0
 * @desc Buscar en todos los registros (inventario base + inventario_nuevo sin origen)
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/buscar-todos',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.buscarTodos
);

/**
 * @route GET /api/inventario/mis-registros
 * @desc Obtener registros del usuario actual (inventarios encontrados + inventarios nuevos sin origen)
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/mis-registros',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.getMisRegistros
);

/**
 * @route GET /api/inventario/dropdowns
 * @desc Obtener listas para dropdowns (proyectos, sucursales, areas, responsables)
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/dropdowns',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.getDropdowns
);

/**
 * @route GET /api/inventario/search?q=texto
 * @desc Búsqueda general por descripción, marca, modelo, serie
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/search',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.search
);

/**
 * @route GET /api/inventario/:id/detail
 * @desc Obtener detalle completo de un inventario con su inventario_nuevo relacionado
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/:id/detail',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.getDetail
);

/**
 * @route GET /api/inventario/patrimonial/:codigoPatrimonial/full-details
 * @desc Obtener detalles completos del activo con datos para formulario de registro
 * @desc Busca por código patrimonial (usado en búsqueda manual)
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/patrimonial/:codigoPatrimonial/full-details',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.getFullDetailsByPatrimonial
);

/**
 * @route GET /api/inventario/:codigoEtiqueta/full-details
 * @desc Obtener detalles completos del activo con datos para formulario de registro
 * @desc Busca por código de etiqueta (usado en escaneo QR/barcode)
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/:codigoEtiqueta/full-details',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.getFullDetails
);

/**
 * @route GET /api/inventario?codPatrimonial=XXX&codEtiqueta=YYY&codAf=ZZZ
 * @desc Buscar por código patrimonial, etiqueta o AF
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.find
);

/**
 * @route GET /api/inventario/:id
 * @desc Obtener detalle completo por ID
 * @access REGISTRADOR, COORDINADOR, ADMINISTRADOR
 */
router.get(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR, UserRole.REGISTRADOR]),
  inventarioController.findById
);

export default router;
