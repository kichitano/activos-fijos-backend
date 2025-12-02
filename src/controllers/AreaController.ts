import { Logger } from '../utils/logger';
import { Request, Response } from 'express';
import { AreaService } from '../services/AreaService';

/**
 * Controlador de Areas
 * Endpoints para gestión de áreas
 */
export class AreaController {
  private areaService: AreaService;

  constructor() {
    this.areaService = new AreaService();
  }

  /**
   * POST /api/areas
   * Crear nueva área
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // El body ya viene validado por validateBody middleware
      const area = await this.areaService.create(req.body);

      res.status(201).json({
        message: 'Área creada correctamente',
        area,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('no existe') ||
          error.message.includes('no pertenece')
        ) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en AreaController.create', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * GET /api/areas
   * Listar áreas con paginación y filtros
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

      if (req.query.cod_proyecto) {
        filters.cod_proyecto = req.query.cod_proyecto as string;
      }

      if (req.query.cod_sucursal) {
        filters.cod_sucursal = req.query.cod_sucursal as string;
      }

      const result = await this.areaService.findAll(page, limit, filters);

      res.status(200).json(result);
    } catch (error) {
      Logger.error('Error en AreaController.findAll', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/areas/:id
   * Obtener área por ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const area = await this.areaService.findById(id || '');

      res.status(200).json(area);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrada')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en AreaController.findById', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * PUT /api/areas/:id
   * Actualizar área
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const area = await this.areaService.update(id || '', req.body);

      res.status(200).json({
        message: 'Área actualizada correctamente',
        area,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrada')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en AreaController.update', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * DELETE /api/areas/:id
   * Eliminar área
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.areaService.delete(id || '');

      res.status(200).json({
        message: 'Área eliminada correctamente',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrada')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en AreaController.delete', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };
}
