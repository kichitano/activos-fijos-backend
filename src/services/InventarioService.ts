import { AppDataSource } from '../config/data-source';
import { Inventario, EstadoReporte } from '../entities/Inventario';
import { InventarioNuevo } from '../entities/InventarioNuevo';
import { Mobiliario } from '../entities/Mobiliario';
import { EquiposInformaticos } from '../entities/EquiposInformaticos';
import { Vehiculos } from '../entities/Vehiculos';
import { Sucursal } from '../entities/Sucursal';
import { Area } from '../entities/Area';
import { Responsable } from '../entities/Responsable';
import { Proyecto } from '../entities/Proyecto';
// import { Like } from 'typeorm'; // TODO: Use for search functionality

/**
 * Servicio de consulta de Inventario histórico
 * Solo lectura - los datos se cargan vía script CSV
 */
export class InventarioService {
  private inventarioRepository = AppDataSource.getRepository(Inventario);
  private inventarioNuevoRepository = AppDataSource.getRepository(InventarioNuevo);
  private mobiliarioRepository = AppDataSource.getRepository(Mobiliario);
  private equiposInformaticosRepository = AppDataSource.getRepository(EquiposInformaticos);
  private vehiculosRepository = AppDataSource.getRepository(Vehiculos);
  private sucursalRepository = AppDataSource.getRepository(Sucursal);
  private areaRepository = AppDataSource.getRepository(Area);
  private responsableRepository = AppDataSource.getRepository(Responsable);
  private proyectoRepository = AppDataSource.getRepository(Proyecto);

  /**
   * Buscar por código patrimonial
   */
  async findByCodPatrimonial(codPatrimonial: string): Promise<Inventario | null> {
    const inventario = await this.inventarioRepository.findOne({
      where: { cod_patrimonial: codPatrimonial },
    });

    return inventario;
  }

  /**
   * Buscar por código de etiqueta
   */
  async findByCodEtiqueta(codEtiqueta: string): Promise<Inventario | null> {
    console.log('[InventarioService] Buscando por cod_etiqueta:', codEtiqueta);

    const inventario = await this.inventarioRepository.findOne({
      where: { cod_etiqueta: codEtiqueta },
    });

    console.log('[InventarioService] Resultado:', inventario ? 'ENCONTRADO' : 'NO ENCONTRADO');

    return inventario;
  }

  /**
   * Buscar por código AF
   */
  async findByCodAf(codAf: string): Promise<Inventario | null> {
    const inventario = await this.inventarioRepository.findOne({
      where: { cod_af: codAf },
    });

    return inventario;
  }

  /**
   * Obtener por ID
   */
  async findById(id: string): Promise<Inventario | null> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['inventarios_derivados'],
    });

    return inventario;
  }

  /**
   * Obtener detalle completo de un inventario por ID
   * Incluye el inventario base y su inventario_nuevo relacionado (si existe)
   */
  async getInventarioDetail(id: string) {
    // Buscar el inventario base
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
    });

    if (!inventario) {
      return null;
    }

    // Si el inventario fue encontrado y tiene cod_af_inventario, buscar el inventario_nuevo
    let inventarioNuevo = null;
    if (inventario.encontrado && inventario.cod_af_inventario) {
      inventarioNuevo = await this.inventarioNuevoRepository.findOne({
        where: { cod_af_inventario: inventario.cod_af_inventario },
        relations: ['created_by_user'],
      });
    }

    return {
      inventario,
      inventarioNuevo,
      encontrado: inventario.encontrado,
    };
  }

  /**
   * Búsqueda general por descripción, marca, modelo, etc.
   */
  async search(query: string, limit: number = 50): Promise<Inventario[]> {
    const inventarios = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .where(
        '(inventario.descripcion ILIKE :query OR ' +
        'inventario.marca ILIKE :query OR ' +
        'inventario.modelo ILIKE :query OR ' +
        'inventario.serie ILIKE :query OR ' +
        'inventario.cod_patrimonial ILIKE :query OR ' +
        'inventario.cod_etiqueta ILIKE :query)',
        { query: `%${query}%` }
      )
      .limit(limit)
      .orderBy('inventario.descripcion', 'ASC')
      .getMany();

    return inventarios;
  }

  /**
   * Obtener detalles completos del activo con datos para formulario
   * Incluye activo + listas de sucursales, areas y responsables
   * Si el activo ya fue encontrado, también incluye datos de inventario_nuevo
   * Busca por código de etiqueta (usado en escaneo QR/barcode)
   */
  async getFullDetails(codEtiqueta: string) {
    // Buscar activo en inventario por código de etiqueta
    const inventario = await this.findByCodEtiqueta(codEtiqueta);

    if (!inventario) {
      return null;
    }

    return this._buildFullDetailsResponse(inventario);
  }

  /**
   * Obtener detalles completos del activo con datos para formulario
   * Incluye activo + listas de sucursales, areas y responsables
   * Si el activo ya fue encontrado, también incluye datos de inventario_nuevo
   * Busca por código patrimonial (usado en búsqueda manual)
   */
  async getFullDetailsByPatrimonial(codPatrimonial: string) {
    // Buscar activo en inventario por código patrimonial
    const inventario = await this.findByCodPatrimonial(codPatrimonial);

    if (!inventario) {
      return null;
    }

    return this._buildFullDetailsResponse(inventario);
  }

  /**
   * Construir respuesta de detalles completos del activo
   * Método privado para evitar duplicación de código
   */
  private async _buildFullDetailsResponse(inventario: Inventario) {

    // Obtener listas para dropdowns
    const [proyectos, sucursales, areas, responsables] = await Promise.all([
      this.proyectoRepository.find({ order: { cod_proyecto: 'ASC' } }),
      this.sucursalRepository.find({ order: { nombre_sucursal: 'ASC' } }),
      this.areaRepository.find({ order: { area: 'ASC' } }),
      this.responsableRepository.find({ order: { nombre: 'ASC' } }),
    ]);

    // Si el activo ya fue encontrado y tiene cod_af_inventario, buscar en inventario_nuevo
    let inventarioNuevo = null;
    let typeSpecificData = null;

    if (inventario.encontrado && inventario.cod_af_inventario) {
      // Buscar en inventario_nuevo por cod_af_inventario
      inventarioNuevo = await this.inventarioNuevoRepository.findOne({
        where: { cod_af_inventario: inventario.cod_af_inventario },
        relations: ['created_by_user'],
      });

      // Si existe, buscar en tabla específica según tipo
      if (inventarioNuevo) {
        const tipoActivo = inventarioNuevo.tipo_activo_fijo;

        if (tipoActivo === 'Mobiliario') {
          typeSpecificData = await this.mobiliarioRepository.findOne({
            where: { inventario_nuevo_id: inventarioNuevo.id },
          });
        } else if (tipoActivo === 'Equipos Informaticos') {
          typeSpecificData = await this.equiposInformaticosRepository.findOne({
            where: { inventario_nuevo_id: inventarioNuevo.id },
          });
        } else if (tipoActivo === 'Vehiculos') {
          typeSpecificData = await this.vehiculosRepository.findOne({
            where: { inventario_nuevo_id: inventarioNuevo.id },
          });
        }
      }
    }

    // Determinar estado actual y futuro
    let estadoActual: EstadoReporte;
    let estadoFuturo: EstadoReporte;

    if (inventarioNuevo) {
      // Ya tiene registro en inventario_nuevo → ENCONTRADO
      estadoActual = EstadoReporte.ENCONTRADO;
      estadoFuturo = EstadoReporte.ENCONTRADO; // Se mantiene encontrado
    } else {
      // No tiene registro en inventario_nuevo → FALTANTE
      estadoActual = EstadoReporte.FALTANTE;
      estadoFuturo = EstadoReporte.ENCONTRADO; // Al registrar, será encontrado
    }

    return {
      inventario,
      inventarioNuevo,
      typeSpecificData,
      estadoActual,
      estadoFuturo,
      dropdowns: {
        proyectos,
        sucursales,
        areas,
        responsables,
      },
    };
  }

  /**
   * Obtener solo dropdowns (para registro sin origen)
   * Para registros nuevos: estadoActual = NUEVO, estadoFuturo = SOBRANTE
   */
  async getDropdowns() {
    const [proyectos, sucursales, areas, responsables] = await Promise.all([
      this.proyectoRepository.find({ order: { cod_proyecto: 'ASC' } }),
      this.sucursalRepository.find({ order: { nombre_sucursal: 'ASC' } }),
      this.areaRepository.find({ order: { area: 'ASC' } }),
      this.responsableRepository.find({ order: { nombre: 'ASC' } }),
    ]);

    return {
      proyectos,
      sucursales,
      areas,
      responsables,
      estadoActual: EstadoReporte.NUEVO,
      estadoFuturo: EstadoReporte.SOBRANTE,
    };
  }

  /**
   * Obtener registros del usuario actual
   * Incluye:
   * - Registros de inventario que el usuario encontró (encontrado=true y cod_af_inventario coincide con inventario_nuevo del usuario)
   * - Registros de inventario_nuevo del usuario que NO están enlazados a ningún inventario
   * Si el usuario es REGISTRADOR, filtra por su proyecto
   */
  async getMisRegistros(userId: string, userRole: string, userProyectoId?: string) {
    // 1. Obtener todos los inventario_nuevo del usuario
    let inventariosNuevosQuery = this.inventarioNuevoRepository
      .createQueryBuilder('inventario_nuevo')
      .where('inventario_nuevo.created_by = :userId', { userId })
      .leftJoinAndSelect('inventario_nuevo.inventario_origen', 'inventario_origen')
      .orderBy('inventario_nuevo.created_at', 'DESC');

    // Filtrar por proyecto si es REGISTRADOR
    if (userRole === 'REGISTRADOR' && userProyectoId) {
      inventariosNuevosQuery = inventariosNuevosQuery.andWhere(
        'inventario_nuevo.cod_proyecto = :proyectoId',
        { proyectoId: userProyectoId }
      );
    }

    const inventariosNuevos = await inventariosNuevosQuery.getMany();

    // 2. Obtener cod_af_inventario de los inventarios_nuevo que tienen origen
    const codsAfInventario = inventariosNuevos
      .filter((inv) => inv.cod_af_inventario)
      .map((inv) => inv.cod_af_inventario as string);

    // 3. Buscar en inventario histórico los que están encontrados y coinciden con cod_af_inventario
    let inventariosEncontrados: Inventario[] = [];
    if (codsAfInventario.length > 0) {
      let inventariosEncontradosQuery = this.inventarioRepository
        .createQueryBuilder('inventario')
        .where('inventario.encontrado = :encontrado', { encontrado: true })
        .andWhere('inventario.cod_af_inventario IN (:...codsAfInventario)', { codsAfInventario })
        .orderBy('inventario.created_at', 'DESC');

      // Filtrar por proyecto si es REGISTRADOR
      if (userRole === 'REGISTRADOR' && userProyectoId) {
        inventariosEncontradosQuery = inventariosEncontradosQuery.andWhere(
          'inventario.cod_proyecto = :proyectoId',
          { proyectoId: userProyectoId }
        );
      }

      inventariosEncontrados = await inventariosEncontradosQuery.getMany();
    }

    // 4. Obtener inventario_nuevo sin origen (no enlazados a inventario)
    const inventariosNuevosSinOrigen = inventariosNuevos.filter(
      (inv) => !inv.inventario_origen_id
    );

    return {
      inventariosEncontrados,
      inventariosNuevosSinOrigen,
      total: inventariosEncontrados.length + inventariosNuevosSinOrigen.length,
    };
  }

  /**
   * Buscar todos los registros (inventario base + inventario_nuevo sin origen)
   * Para el módulo de búsqueda general
   * Si el usuario es REGISTRADOR, filtra por su proyecto
   *
   * @param proyectoId - Filtro opcional de proyecto (para todos los usuarios)
   */
  async buscarTodos(
    _userId: string,
    userRole: string,
    userProyectoId?: string,
    query?: string,
    limit: number = 50,
    offset: number = 0,
    proyectoId?: string
  ) {
    // 1. Buscar en inventario base
    let inventariosBaseQuery = this.inventarioRepository
      .createQueryBuilder('inventario')
      .orderBy('inventario.created_at', 'DESC');

    // Filtrar por proyecto:
    // - Si es REGISTRADOR, usar su proyecto asignado
    // - Si es ADMIN/COORDINADOR y seleccionó un proyecto, usar ese
    const proyectoFiltro = userRole === 'REGISTRADOR' ? userProyectoId : proyectoId;

    if (proyectoFiltro) {
      inventariosBaseQuery = inventariosBaseQuery.where(
        'inventario.cod_proyecto = :proyectoId',
        { proyectoId: proyectoFiltro }
      );
    }

    // Búsqueda solo por: cod_patrimonial, cod_etiqueta, descripción
    if (query && query.trim().length >= 3) {
      const searchCondition = '(inventario.descripcion ILIKE :query OR ' +
        'inventario.cod_patrimonial ILIKE :query OR ' +
        'inventario.cod_etiqueta ILIKE :query)';

      if (proyectoFiltro) {
        inventariosBaseQuery = inventariosBaseQuery.andWhere(searchCondition, { query: `%${query}%` });
      } else {
        inventariosBaseQuery = inventariosBaseQuery.where(searchCondition, { query: `%${query}%` });
      }
    }

    const inventariosBase = await inventariosBaseQuery
      .take(limit)
      .skip(offset)
      .getMany();

    // 2. Buscar en inventario_nuevo sin origen
    let inventariosNuevosQuery = this.inventarioNuevoRepository
      .createQueryBuilder('inventario_nuevo')
      .where('inventario_nuevo.inventario_origen_id IS NULL')
      .orderBy('inventario_nuevo.created_at', 'DESC');

    // Filtrar por proyecto (mismo criterio que arriba)
    if (proyectoFiltro) {
      inventariosNuevosQuery = inventariosNuevosQuery.andWhere(
        'inventario_nuevo.cod_proyecto = :proyectoId',
        { proyectoId: proyectoFiltro }
      );
    }

    // Búsqueda solo por: cod_patrimonial, cod_etiqueta, descripción
    if (query && query.trim().length >= 3) {
      inventariosNuevosQuery = inventariosNuevosQuery.andWhere(
        '(inventario_nuevo.descripcion ILIKE :query OR ' +
        'inventario_nuevo.cod_patrimonial ILIKE :query OR ' +
        'inventario_nuevo.cod_etiqueta ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    const inventariosNuevosSinOrigen = await inventariosNuevosQuery
      .take(limit)
      .skip(offset)
      .getMany();

    return {
      inventariosBase,
      inventariosNuevosSinOrigen,
      total: inventariosBase.length + inventariosNuevosSinOrigen.length,
    };
  }
}
