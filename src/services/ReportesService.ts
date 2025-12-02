import { AppDataSource } from '../config/data-source';
import { Inventario } from '../entities/Inventario';
import { InventarioNuevo } from '../entities/InventarioNuevo';

/**
 * Servicio de reportes y estadísticas
 * Calcula métricas de avance del inventario
 */
export class ReportesService {
  private inventarioRepository = AppDataSource.getRepository(Inventario);
  private inventarioNuevoRepository = AppDataSource.getRepository(InventarioNuevo);

  /**
   * Obtener estadísticas generales del inventario
   * Filtrable por proyecto, sucursal y área
   */
  async getEstadisticas(
    userRole: string,
    userProyectoId?: string,
    proyectoId?: string,
    sucursalId?: string,
    areaId?: string
  ) {
    // Aplicar filtro de proyecto según rol
    const filtroProyecto = userRole === 'REGISTRADOR' && userProyectoId
      ? userProyectoId
      : proyectoId;

    // 1. INVENTARIO ANTERIOR: Total de registros en inventario histórico
    let queryInventarioAnterior = this.inventarioRepository.createQueryBuilder('inventario');

    if (filtroProyecto) {
      queryInventarioAnterior = queryInventarioAnterior.where(
        'inventario.cod_proyecto = :proyectoId',
        { proyectoId: filtroProyecto }
      );
    }
    if (sucursalId) {
      queryInventarioAnterior = queryInventarioAnterior.andWhere(
        'inventario.cod_sucursal = :sucursalId',
        { sucursalId }
      );
    }
    if (areaId) {
      queryInventarioAnterior = queryInventarioAnterior.andWhere(
        'inventario.cod_area = :areaId',
        { areaId }
      );
    }

    const inventarioAnterior = await queryInventarioAnterior.getCount();

    // 2. INVENTARIO ACTUAL: Registros encontrados (tienen cod_af_inventario y encontrado=true)
    let queryInventarioActual = this.inventarioRepository.createQueryBuilder('inventario')
      .where('inventario.encontrado = :encontrado', { encontrado: true })
      .andWhere('inventario.cod_af_inventario IS NOT NULL');

    if (filtroProyecto) {
      queryInventarioActual = queryInventarioActual.andWhere(
        'inventario.cod_proyecto = :proyectoId',
        { proyectoId: filtroProyecto }
      );
    }
    if (sucursalId) {
      queryInventarioActual = queryInventarioActual.andWhere(
        'inventario.cod_sucursal = :sucursalId',
        { sucursalId }
      );
    }
    if (areaId) {
      queryInventarioActual = queryInventarioActual.andWhere(
        'inventario.cod_area = :areaId',
        { areaId }
      );
    }

    const inventarioActual = await queryInventarioActual.getCount();

    // 3. FALTANTES: Registros no encontrados
    const faltantes = inventarioAnterior - inventarioActual;

    // 4. AVANCE: Porcentaje de encontrados vs total
    const avance = inventarioAnterior > 0
      ? Math.round((inventarioActual / inventarioAnterior) * 100)
      : 0;

    // 5. SOBRANTES: Registros de inventario_nuevo sin origen (no enlazados a inventario)
    let querySobrantes = this.inventarioNuevoRepository.createQueryBuilder('inventario_nuevo')
      .where('inventario_nuevo.inventario_origen_id IS NULL');

    if (filtroProyecto) {
      querySobrantes = querySobrantes.andWhere(
        'inventario_nuevo.cod_proyecto = :proyectoId',
        { proyectoId: filtroProyecto }
      );
    }
    if (sucursalId) {
      querySobrantes = querySobrantes.andWhere(
        'inventario_nuevo.cod_sucursal = :sucursalId',
        { sucursalId }
      );
    }
    if (areaId) {
      querySobrantes = querySobrantes.andWhere(
        'inventario_nuevo.cod_area = :areaId',
        { areaId }
      );
    }

    const sobrantes = await querySobrantes.getCount();

    // 6. TOTAL: Inventario Actual + Sobrantes
    const total = inventarioActual + sobrantes;

    return {
      inventarioAnterior,
      inventarioActual,
      faltantes,
      avance,
      sobrantes,
      total,
    };
  }

  /**
   * Obtener estadísticas agrupadas por proyecto
   */
  async getEstadisticasPorProyecto(userRole: string, userProyectoId?: string) {
    // Si es REGISTRADOR, solo su proyecto
    if (userRole === 'REGISTRADOR' && userProyectoId) {
      const stats = await this.getEstadisticas(userRole, userProyectoId, userProyectoId);
      return [
        {
          proyecto: userProyectoId,
          ...stats,
        },
      ];
    }

    // Para ADMIN/COORDINADOR: obtener todos los proyectos únicos
    const proyectos = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .select('DISTINCT inventario.cod_proyecto', 'proyecto')
      .where('inventario.cod_proyecto IS NOT NULL')
      .getRawMany();

    const estadisticas = await Promise.all(
      proyectos.map(async ({ proyecto }) => {
        const stats = await this.getEstadisticas(userRole, userProyectoId, proyecto);
        return {
          proyecto,
          ...stats,
        };
      })
    );

    return estadisticas;
  }

  /**
   * Obtener estadísticas agrupadas por sucursal (opcionalmente filtrado por proyecto)
   */
  async getEstadisticasPorSucursal(
    userRole: string,
    userProyectoId?: string,
    proyectoId?: string
  ) {
    const filtroProyecto = userRole === 'REGISTRADOR' && userProyectoId
      ? userProyectoId
      : proyectoId;

    let query = this.inventarioRepository
      .createQueryBuilder('inventario')
      .select('DISTINCT inventario.cod_sucursal', 'sucursal')
      .where('inventario.cod_sucursal IS NOT NULL');

    if (filtroProyecto) {
      query = query.andWhere('inventario.cod_proyecto = :proyectoId', { proyectoId: filtroProyecto });
    }

    const sucursales = await query.getRawMany();

    const estadisticas = await Promise.all(
      sucursales.map(async ({ sucursal }) => {
        const stats = await this.getEstadisticas(
          userRole,
          userProyectoId,
          filtroProyecto,
          sucursal
        );
        return {
          sucursal,
          ...stats,
        };
      })
    );

    return estadisticas;
  }

  /**
   * Obtener estadísticas agrupadas por área (filtrado por proyecto y sucursal)
   */
  async getEstadisticasPorArea(
    userRole: string,
    userProyectoId?: string,
    proyectoId?: string,
    sucursalId?: string
  ) {
    const filtroProyecto = userRole === 'REGISTRADOR' && userProyectoId
      ? userProyectoId
      : proyectoId;

    let query = this.inventarioRepository
      .createQueryBuilder('inventario')
      .select('DISTINCT inventario.cod_area', 'area')
      .where('inventario.cod_area IS NOT NULL');

    if (filtroProyecto) {
      query = query.andWhere('inventario.cod_proyecto = :proyectoId', { proyectoId: filtroProyecto });
    }
    if (sucursalId) {
      query = query.andWhere('inventario.cod_sucursal = :sucursalId', { sucursalId });
    }

    const areas = await query.getRawMany();

    const estadisticas = await Promise.all(
      areas.map(async ({ area }) => {
        const stats = await this.getEstadisticas(
          userRole,
          userProyectoId,
          filtroProyecto,
          sucursalId,
          area
        );
        return {
          area,
          ...stats,
        };
      })
    );

    return estadisticas;
  }
}
