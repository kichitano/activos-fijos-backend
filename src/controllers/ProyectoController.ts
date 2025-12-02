import { Logger } from '../utils/logger';
import { Request, Response } from 'express';
import { ProyectoService } from '../services/ProyectoService';
import { SituacionProyecto } from '../entities/Proyecto';

/**
 * Controlador de Proyectos
 * Endpoints para gestión de proyectos
 */
export class ProyectoController {
  private proyectoService: ProyectoService;

  constructor() {
    this.proyectoService = new ProyectoService();
  }

  /**
   * POST /api/proyectos
   * Crear nuevo proyecto
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // El body ya viene validado por validateBody middleware
      const proyecto = await this.proyectoService.create(req.body);

      res.status(201).json({
        message: 'Proyecto creado correctamente',
        proyecto,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Ya existe un proyecto')) {
          res.status(409).json({ message: error.message });
        } else {
          Logger.error('Error en ProyectoController.create', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * GET /api/proyectos
   * Listar proyectos con paginación y filtros
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

      if (req.query.situacion) {
        filters.situacion = req.query.situacion as SituacionProyecto;
      }

      const result = await this.proyectoService.findAll(page, limit, filters);

      res.status(200).json(result);
    } catch (error) {
      Logger.error('Error en ProyectoController.findAll', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/proyectos/:id
   * Obtener proyecto por ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      const proyecto = await this.proyectoService.findById(id);

      if (!proyecto) {
        res.status(404).json({ message: 'Proyecto no encontrado' });
        return;
      }

      res.status(200).json(proyecto);
    } catch (error) {
      Logger.error('Error en ProyectoController.findById', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * PUT /api/proyectos/:id
   * Actualizar proyecto
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      const proyecto = await this.proyectoService.update(id, req.body);

      res.status(200).json({
        message: 'Proyecto actualizado correctamente',
        proyecto,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrado')) {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('Ya existe otro proyecto')) {
          res.status(409).json({ message: error.message });
        } else {
          Logger.error('Error en ProyectoController.update', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * DELETE /api/proyectos/:id
   * Eliminar proyecto
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      await this.proyectoService.delete(id);

      res.status(200).json({
        message: 'Proyecto eliminado correctamente',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrado')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en ProyectoController.delete', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };
}
