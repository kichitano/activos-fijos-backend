import { Router } from 'express';
import { ReportesController } from '../controllers/ReportesController';
import { authMiddleware, permissionsMiddleware } from '../middlewares';
import { UserRole } from '../entities/User';

const router = Router();
const reportesController = new ReportesController();

/**
 * Rutas de Reportes y Estadísticas
 * Accesible solo para COORDINADOR y ADMINISTRADOR
 */

/**
 * @route GET /api/reportes/estadisticas?proyectoId=X&sucursalId=Y&areaId=Z&agruparPor=proyecto
 * @desc Obtener estadísticas de avance del inventario
 * @access COORDINADOR, ADMINISTRADOR
 *
 * Query params:
 * - proyectoId (opcional): Filtrar por proyecto
 * - sucursalId (opcional): Filtrar por sucursal
 * - areaId (opcional): Filtrar por área
 * - agruparPor (opcional): 'proyecto' | 'sucursal' | 'area' - Agrupar resultados
 *
 * Respuesta:
 * {
 *   inventarioAnterior: number,  // Total de registros históricos
 *   inventarioActual: number,    // Registros encontrados
 *   faltantes: number,           // No encontrados
 *   avance: number,              // Porcentaje (0-100)
 *   sobrantes: number,           // Nuevos sin origen
 *   total: number                // Actual + Sobrantes
 * }
 *
 * O si agruparPor está presente:
 * {
 *   estadisticas: [
 *     {
 *       proyecto/sucursal/area: string,
 *       inventarioAnterior: number,
 *       ...
 *     }
 *   ]
 * }
 */
router.get(
  '/estadisticas',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.COORDINADOR]),
  reportesController.getEstadisticas
);

export default router;
