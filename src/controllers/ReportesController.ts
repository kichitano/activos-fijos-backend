import { Request, Response } from 'express';
import { ReportesService } from '../services/ReportesService';
import { Logger } from '../utils/logger';

/**
 * Controlador de Reportes y Estadísticas
 * Accesible solo para COORDINADOR y ADMINISTRADOR
 */
export class ReportesController {
  private reportesService: ReportesService;

  constructor() {
    this.reportesService = new ReportesService();
  }

  /**
   * GET /api/reportes/estadisticas?proyectoId=X&sucursalId=Y&areaId=Z&agruparPor=proyecto
   * Obtener estadísticas generales o agrupadas
   */
  getEstadisticas = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.rol;
      const userProyectoId = req.user?.proyecto_id;

      if (!userId || !userRole) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      const { proyectoId, sucursalId, areaId, agruparPor } = req.query;

      // Si se especifica agrupación
      if (agruparPor === 'proyecto') {
        const estadisticas = await this.reportesService.getEstadisticasPorProyecto(
          userRole,
          userProyectoId
        );
        res.status(200).json({ estadisticas });
        return;
      }

      if (agruparPor === 'sucursal') {
        const estadisticas = await this.reportesService.getEstadisticasPorSucursal(
          userRole,
          userProyectoId,
          proyectoId as string | undefined
        );
        res.status(200).json({ estadisticas });
        return;
      }

      if (agruparPor === 'area') {
        const estadisticas = await this.reportesService.getEstadisticasPorArea(
          userRole,
          userProyectoId,
          proyectoId as string | undefined,
          sucursalId as string | undefined
        );
        res.status(200).json({ estadisticas });
        return;
      }

      // Estadísticas generales (sin agrupación)
      const estadisticas = await this.reportesService.getEstadisticas(
        userRole,
        userProyectoId,
        proyectoId as string | undefined,
        sucursalId as string | undefined,
        areaId as string | undefined
      );

      res.status(200).json(estadisticas);
    } catch (error) {
      Logger.error('Error en ReportesController.getEstadisticas', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}
