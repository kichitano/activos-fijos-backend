import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, permissionsMiddleware, validateBody } from '../middlewares';
import { CreateUserDto, UpdateUserDto } from '../dtos/users';
import { UserRole } from '../entities/User';

const router = Router();
const userController = new UserController();

/**
 * Todas las rutas de usuarios requieren autenticación y rol ADMINISTRADOR
 */

/**
 * @route GET /api/users
 * @desc Listar usuarios con paginación y filtros
 * @access ADMINISTRADOR
 * @query page, limit, search, rol, activo
 */
router.get(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  userController.findAll
);

/**
 * @route GET /api/users/:id
 * @desc Obtener usuario por ID
 * @access ADMINISTRADOR
 */
router.get(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  userController.findById
);

/**
 * @route POST /api/users
 * @desc Crear nuevo usuario
 * @access ADMINISTRADOR
 * @body CreateUserDto
 */
router.post(
  '/',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(CreateUserDto),
  userController.create
);

/**
 * @route PUT /api/users/:id
 * @desc Actualizar usuario
 * @access ADMINISTRADOR
 * @body UpdateUserDto
 */
router.put(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  validateBody(UpdateUserDto),
  userController.update
);

/**
 * @route DELETE /api/users/:id
 * @desc Desactivar usuario (soft delete)
 * @access ADMINISTRADOR
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR]),
  userController.delete
);

export default router;
