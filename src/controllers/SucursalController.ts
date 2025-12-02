import { Logger } from '../utils/logger';
import { Request, Response } from 'express';
import { SucursalService } from '../services/SucursalService';
import {
  getDepartamentos,
  getProvincias,
  getDistritos,
} from '../utils/peru-ubigeo';

/**
 * Controlador de Sucursales
 * Endpoints para gestión de sucursales
 */
export class SucursalController {
  private sucursalService: SucursalService;

  constructor() {
    this.sucursalService = new SucursalService();
  }

  /**
   * POST /api/sucursales
   * Crear nueva sucursal
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // El body ya viene validado por validateBody middleware
      const sucursal = await this.sucursalService.create(req.body);

      res.status(201).json({
        message: 'Sucursal creada correctamente',
        sucursal,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('no existe') ||
          error.message.includes('inválido') ||
          error.message.includes('inválida')
        ) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en SucursalController.create', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * GET /api/sucursales
   * Listar sucursales con paginación y filtros
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

      if (req.query.departamento) {
        filters.departamento = req.query.departamento as string;
      }

      const result = await this.sucursalService.findAll(page, limit, filters);

      res.status(200).json(result);
    } catch (error) {
      Logger.error('Error en SucursalController.findAll', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/sucursales/:id
   * Obtener sucursal por ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const sucursal = await this.sucursalService.findById(id || '');

      res.status(200).json(sucursal);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrada')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en SucursalController.findById', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * PUT /api/sucursales/:id
   * Actualizar sucursal
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const sucursal = await this.sucursalService.update(id || '', req.body);

      res.status(200).json({
        message: 'Sucursal actualizada correctamente',
        sucursal,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrada')) {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('inválido') || error.message.includes('inválida')) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en SucursalController.update', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * DELETE /api/sucursales/:id
   * Eliminar sucursal
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.sucursalService.delete(id || '');

      res.status(200).json({
        message: 'Sucursal eliminada correctamente',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('no encontrada')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en SucursalController.delete', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * GET /api/sucursales/ubicacion/departamentos
   * Obtener lista de departamentos de Perú
   */
  getDepartamentos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const departamentos = getDepartamentos();
      res.status(200).json({ departamentos });
    } catch (error) {
      Logger.error('Error en SucursalController.getDepartamentos', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/sucursales/ubicacion/provincias/:departamento
   * Obtener lista de provincias de un departamento
   */
  getProvincias = async (req: Request, res: Response): Promise<void> => {
    try {
      const { departamento } = req.params;
      const provincias = getProvincias(departamento || '');

      if (provincias.length === 0) {
        res.status(404).json({
          message: `No se encontraron provincias para el departamento: ${departamento}`,
        });
        return;
      }

      res.status(200).json({ provincias });
    } catch (error) {
      Logger.error('Error en SucursalController.getProvincias', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/sucursales/ubicacion/distritos/:departamento/:provincia
   * Obtener lista de distritos de una provincia
   */
  getDistritos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { departamento, provincia } = req.params;
      const distritos = getDistritos(departamento || '', provincia || '');

      if (distritos.length === 0) {
        res.status(404).json({
          message: `No se encontraron distritos para ${provincia}, ${departamento}`,
        });
        return;
      }

      res.status(200).json({ distritos });
    } catch (error) {
      Logger.error('Error en SucursalController.getDistritos', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}
