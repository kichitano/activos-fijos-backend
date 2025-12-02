import { Logger } from "../utils/logger";
import { Request, Response } from 'express';
import { AuditoriaService } from '../services/AuditoriaService';

/**
 * Controlador de Auditoría de Ubicación
 */
export class AuditoriaController {
  private auditoriaService: AuditoriaService;

  constructor() {
    this.auditoriaService = new AuditoriaService();
  }

  /**
   * POST /api/auditoria/ubicacion
   * Registrar ubicación GPS al crear un activo nuevo
   */
  registrar = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener userId del token JWT
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'No autenticado' });
        return;
      }

      // El body ya viene validado por validateBody middleware
      const auditoria = await this.auditoriaService.registrarUbicacion(req.body, userId);

      res.status(201).json({
        message: 'Ubicación registrada correctamente',
        auditoria,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('inventario nuevo')) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en AuditoriaController.registrar', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * GET /api/auditoria/ubicacion/:inventarioNuevoId
   * Obtener historial de ubicaciones para un activo
   */
  findByInventarioNuevo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { inventarioNuevoId } = req.params;

      if (!inventarioNuevoId) {
        res.status(400).json({ message: 'Falta el parámetro inventarioNuevoId' });
        return;
      }

      const registros = await this.auditoriaService.findByInventarioNuevo(inventarioNuevoId);

      res.status(200).json({
        total: registros.length,
        registros,
      });
    } catch (error) {
      Logger.error('Error en AuditoriaController.findByInventarioNuevo', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/auditoria/ubicacion/user/:userId
   * Obtener registros de auditoría por usuario
   */
  findByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ message: 'Falta el parámetro userId' });
        return;
      }

      // Filtros opcionales de fechas
      const fechaDesde = req.query.fechaDesde
        ? new Date(req.query.fechaDesde as string)
        : undefined;
      const fechaHasta = req.query.fechaHasta
        ? new Date(req.query.fechaHasta as string)
        : undefined;

      const registros = await this.auditoriaService.findByUser(userId, fechaDesde, fechaHasta);

      res.status(200).json({
        total: registros.length,
        registros,
      });
    } catch (error) {
      Logger.error('Error en AuditoriaController.findByUser', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}
