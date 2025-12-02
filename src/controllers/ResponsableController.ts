import { Logger } from '../utils/logger';
import { Request, Response } from 'express';
import { ResponsableService } from '../services/ResponsableService';

/**
 * Controlador de Responsables
 * Endpoints para gestión de responsables
 */
export class ResponsableController {
  private responsableService: ResponsableService;

  constructor() {
    this.responsableService = new ResponsableService();
  }

  /**
   * POST /api/responsables
   * Crear nuevo responsable
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // El body ya viene validado por validateBody middleware
      const responsable = await this.responsableService.create(req.body);

      res.status(201).json({
        message: 'Responsable creado correctamente',
        responsable,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('no existe') ||
          error.message.includes('no tiene DNI')
        ) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en ResponsableController.create', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * GET /api/responsables
   * Listar responsables con paginación y filtros
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

      if (req.query.area_uuid) {
        filters.area_uuid = req.query.area_uuid as string;
      }

      const result = await this.responsableService.findAll(page, limit, filters);

      res.status(200).json(result);
    } catch (error) {
      Logger.error('Error en ResponsableController.findAll', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/responsables/:id
   * Obtener responsable por ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const responsable = await this.responsableService.findById(id || '');

      res.status(200).json(responsable);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrado')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en ResponsableController.findById', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * PUT /api/responsables/:id
   * Actualizar responsable
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const responsable = await this.responsableService.update(id || '', req.body);

      res.status(200).json({
        message: 'Responsable actualizado correctamente',
        responsable,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrado')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en ResponsableController.update', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * DELETE /api/responsables/:id
   * Eliminar responsable
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.responsableService.delete(id || '');

      res.status(200).json({
        message: 'Responsable eliminado correctamente',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrado')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en ResponsableController.delete', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };
}
