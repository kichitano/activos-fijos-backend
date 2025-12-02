import { Logger } from "../utils/logger";
import { Request, Response } from 'express';
import { InventarioNuevoService } from '../services/InventarioNuevoService';
import { SucursalEnum, AreaEnum, ActivoEstado } from '../entities/Inventario';
import { RegisterFromExistingDto } from '../dtos/inventario-nuevo';

/**
 * Controlador de InventarioNuevo
 * Endpoints para gestión de nuevos activos fijos
 */
export class InventarioNuevoController {
  private inventarioNuevoService: InventarioNuevoService;

  constructor() {
    this.inventarioNuevoService = new InventarioNuevoService();
  }

  /**
   * POST /api/inventario-nuevo
   * Crear nuevo registro de activo fijo
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener userId del token JWT (ya validado por authMiddleware)
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'No autenticado' });
        return;
      }

      // El body ya viene validado por validateBody middleware
      const inventarioNuevo = await this.inventarioNuevoService.create(req.body, userId);

      res.status(201).json({
        message: 'Activo fijo registrado correctamente',
        inventario: inventarioNuevo,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('inventario origen')) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en InventarioNuevoController.create', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * GET /api/inventario-nuevo/:id
   * Obtener detalle completo por ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      const inventarioNuevo = await this.inventarioNuevoService.findById(id);

      if (!inventarioNuevo) {
        res.status(404).json({ message: 'Activo no encontrado' });
        return;
      }

      res.status(200).json(inventarioNuevo);
    } catch (error) {
      Logger.error('Error en InventarioNuevoController.findById', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario-nuevo?codPatrimonial=XXX
   * Buscar por código patrimonial
   */
  find = async (req: Request, res: Response): Promise<void> => {
    try {
      const { codPatrimonial } = req.query;

      if (!codPatrimonial) {
        res.status(400).json({
          message: 'Debe proporcionar el parámetro codPatrimonial',
        });
        return;
      }

      const inventarioNuevo = await this.inventarioNuevoService.findByCodPatrimonial(
        codPatrimonial as string
      );

      if (!inventarioNuevo) {
        res.status(404).json({ message: 'Activo no encontrado' });
        return;
      }

      res.status(200).json(inventarioNuevo);
    } catch (error) {
      Logger.error('Error en InventarioNuevoController.find', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario-nuevo
   * Listar con paginación y filtros
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      // Filtros opcionales
      const filters: any = {};

      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      if (req.query.sucursal) {
        filters.cod_sucursal = req.query.sucursal as SucursalEnum;
      }

      if (req.query.area) {
        filters.cod_area = req.query.area as AreaEnum;
      }

      if (req.query.estado) {
        filters.estado = req.query.estado as ActivoEstado;
      }

      if (req.query.userId) {
        filters.created_by = req.query.userId as string;
      }

      if (req.query.fechaDesde) {
        filters.fecha_desde = new Date(req.query.fechaDesde as string);
      }

      if (req.query.fechaHasta) {
        filters.fecha_hasta = new Date(req.query.fechaHasta as string);
      }

      const result = await this.inventarioNuevoService.findAll(page, limit, filters);

      res.status(200).json(result);
    } catch (error) {
      Logger.error('Error en InventarioNuevoController.findAll', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * POST /api/inventario-nuevo/register-from-existing
   * Registrar activo desde uno existente en inventario
   */
  registerFromExisting = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener userId del token JWT
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'No autenticado' });
        return;
      }

      // El body ya viene validado por validateBody middleware
      const inventarioNuevo = await this.inventarioNuevoService.registerFromExisting(
        req.body as RegisterFromExistingDto,
        userId
      );

      res.status(201).json({
        message: 'Activo fijo registrado correctamente desde inventario existente',
        inventario: inventarioNuevo,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('inventario origen') ||
          error.message.includes('no existe')
        ) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en InventarioNuevoController.registerFromExisting', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      } else {
        Logger.error('Error en InventarioNuevoController.registerFromExisting', {
          error: String(error),
        });
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  };

  /**
   * PUT /api/inventario-nuevo/:id/update-from-existing
   * Actualizar registro existente de activo fijo
   */
  updateFromExisting = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener userId del token JWT
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'No autenticado' });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      // El body ya viene validado por validateBody middleware
      const inventarioNuevo = await this.inventarioNuevoService.updateFromExisting(
        id,
        req.body as RegisterFromExistingDto,
        userId
      );

      res.status(200).json({
        message: 'Activo fijo actualizado correctamente',
        inventario: inventarioNuevo,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('inventario origen') ||
          error.message.includes('no existe')
        ) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en InventarioNuevoController.updateFromExisting', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      } else {
        Logger.error('Error en InventarioNuevoController.updateFromExisting', {
          error: String(error),
        });
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  };
}
