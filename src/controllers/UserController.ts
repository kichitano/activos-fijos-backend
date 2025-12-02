import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { UserRole } from '../entities/User';
import { Logger } from '../utils/logger';

/**
 * Controlador de Gestión de Usuarios
 * Todos los endpoints requieren rol ADMINISTRADOR
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * GET /api/users
   * Listar usuarios con paginación y filtros
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Filtros opcionales
      const filters: any = {};

      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      if (req.query.rol) {
        filters.rol = req.query.rol as UserRole;
      }

      if (req.query.activo !== undefined) {
        filters.activo = req.query.activo === 'true';
      }

      const result = await this.userService.findAll(page, limit, filters);

      res.status(200).json(result);
    } catch (error) {
      Logger.error('Error en UserController.findAll', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/users/:id
   * Obtener usuario por ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      const user = await this.userService.findById(id);

      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      Logger.error('Error en UserController.findById', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * POST /api/users
   * Crear nuevo usuario
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // El body ya viene validado por validateBody middleware
      const user = await this.userService.create(req.body, req.user!.userId);

      res.status(201).json({
        message: 'Usuario creado correctamente',
        user,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('Ya existe un usuario') ||
          error.message.includes('DNI') ||
          error.message.includes('username')
        ) {
          res.status(409).json({ message: error.message });
        } else {
          Logger.error('Error en UserController.create', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * PUT /api/users/:id
   * Actualizar usuario
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      // El body ya viene validado por validateBody middleware
      const user = await this.userService.update(id, req.body, req.user!.userId);

      res.status(200).json({
        message: 'Usuario actualizado correctamente',
        user,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuario no encontrado') {
          res.status(404).json({ message: error.message });
        } else if (
          error.message.includes('Ya existe un usuario') ||
          error.message.includes('DNI') ||
          error.message.includes('username')
        ) {
          res.status(409).json({ message: error.message });
        } else {
          Logger.error('Error en UserController.update', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * DELETE /api/users/:id
   * Soft delete: marcar usuario como inactivo
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      await this.userService.delete(id, req.user!.userId);

      res.status(200).json({ message: 'Usuario desactivado correctamente' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuario no encontrado') {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('último administrador')) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en UserController.delete', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };
}
