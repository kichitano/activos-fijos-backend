import { AppDataSource } from '../config/data-source';
import { InventarioNuevo } from '../entities/InventarioNuevo';
import {
  Inventario,
  SucursalEnum,
  AreaEnum,
  ActivoEstado,
  TipoActivoFijo,
  RegistroInventario,
} from '../entities/Inventario';
import { Mobiliario } from '../entities/Mobiliario';
import { EquiposInformaticos } from '../entities/EquiposInformaticos';
import { Vehiculos } from '../entities/Vehiculos';
import { RegistroAuditoriaUbicacion } from '../entities/RegistroAuditoriaUbicacion';
import { CreateInventarioNuevoDto, RegisterFromExistingDto } from '../dtos/inventario-nuevo';
import { Logger } from '../utils/logger';

/**
 * Interface para respuesta paginada
 */
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface para filtros de búsqueda
 */
interface InventarioNuevoFilters {
  search?: string;
  cod_sucursal?: SucursalEnum;
  cod_area?: AreaEnum;
  estado?: ActivoEstado;
  created_by?: string;
  fecha_desde?: Date;
  fecha_hasta?: Date;
}

/**
 * Servicio de gestión de InventarioNuevo
 */
export class InventarioNuevoService {
  private inventarioNuevoRepository = AppDataSource.getRepository(InventarioNuevo);
  private inventarioRepository = AppDataSource.getRepository(Inventario);

  /**
   * Validar que inventario origen existe
   */
  async validateInventarioOrigen(id: string): Promise<boolean> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
    });

    return !!inventario;
  }

  /**
   * Crear nuevo registro de activo fijo
   */
  async create(data: CreateInventarioNuevoDto, userId: string): Promise<InventarioNuevo> {
    // Si tiene inventario_origen_id, validar que existe
    if (data.inventario_origen_id) {
      const existe = await this.validateInventarioOrigen(data.inventario_origen_id);
      if (!existe) {
        throw new Error('El inventario origen especificado no existe');
      }
    }

    // Crear entidad
    const inventarioNuevo = this.inventarioNuevoRepository.create({
      ...data,
      created_by: userId,
    });

    const savedInventario = await this.inventarioNuevoRepository.save(inventarioNuevo);

    // Log de creación con evento específico
    Logger.event.assetCreated(userId, savedInventario.id, !!data.inventario_origen_id);

    return savedInventario;
  }

  /**
   * Obtener por ID con relaciones y datos específicos del tipo
   */
  async findById(id: string): Promise<any> {
    const inventarioNuevo = await this.inventarioNuevoRepository.findOne({
      where: { id },
      relations: ['inventario_origen', 'created_by_user'],
    });

    if (!inventarioNuevo) {
      return null;
    }

    // Cargar datos específicos según el tipo de activo
    let typeSpecificData = null;
    const tipoActivo = inventarioNuevo.tipo_activo_fijo;

    if (tipoActivo === TipoActivoFijo.MOBILIARIO) {
      typeSpecificData = await this.mobiliarioRepository.findOne({
        where: { inventario_nuevo_id: inventarioNuevo.id },
      });
    } else if (tipoActivo === TipoActivoFijo.EQUIPOS_INFORMATICOS) {
      typeSpecificData = await this.equiposInformaticosRepository.findOne({
        where: { inventario_nuevo_id: inventarioNuevo.id },
      });
    } else if (tipoActivo === TipoActivoFijo.VEHICULOS) {
      typeSpecificData = await this.vehiculosRepository.findOne({
        where: { inventario_nuevo_id: inventarioNuevo.id },
      });
    }

    return {
      ...inventarioNuevo,
      typeSpecificData,
    };
  }

  /**
   * Buscar por código patrimonial
   */
  async findByCodPatrimonial(codPatrimonial: string): Promise<InventarioNuevo | null> {
    const inventarioNuevo = await this.inventarioNuevoRepository.findOne({
      where: { cod_patrimonial: codPatrimonial },
      relations: ['inventario_origen', 'user'],
    });

    return inventarioNuevo;
  }

  /**
   * Listar con paginación y filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: InventarioNuevoFilters
  ): Promise<PaginatedResponse<InventarioNuevo>> {
    const skip = (page - 1) * limit;

    let queryBuilder = this.inventarioNuevoRepository
      .createQueryBuilder('inventario_nuevo')
      .leftJoinAndSelect('inventario_nuevo.inventario_origen', 'inventario_origen')
      .leftJoinAndSelect('inventario_nuevo.user', 'user');

    // Aplicar filtros
    if (filters?.search) {
      queryBuilder = queryBuilder.where(
        '(inventario_nuevo.descripcion ILIKE :search OR ' +
        'inventario_nuevo.cod_patrimonial ILIKE :search OR ' +
        'inventario_nuevo.cod_etiqueta ILIKE :search OR ' +
        'inventario_nuevo.marca ILIKE :search OR ' +
        'inventario_nuevo.modelo ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.cod_sucursal) {
      queryBuilder = queryBuilder.andWhere(
        'inventario_nuevo.cod_sucursal = :sucursal',
        { sucursal: filters.cod_sucursal }
      );
    }

    if (filters?.cod_area) {
      queryBuilder = queryBuilder.andWhere(
        'inventario_nuevo.cod_area = :area',
        { area: filters.cod_area }
      );
    }

    if (filters?.estado) {
      queryBuilder = queryBuilder.andWhere(
        'inventario_nuevo.estado = :estado',
        { estado: filters.estado }
      );
    }

    if (filters?.created_by) {
      queryBuilder = queryBuilder.andWhere(
        'inventario_nuevo.created_by = :userId',
        { userId: filters.created_by }
      );
    }

    if (filters?.fecha_desde) {
      queryBuilder = queryBuilder.andWhere(
        'inventario_nuevo.created_at >= :fechaDesde',
        { fechaDesde: filters.fecha_desde }
      );
    }

    if (filters?.fecha_hasta) {
      queryBuilder = queryBuilder.andWhere(
        'inventario_nuevo.created_at <= :fechaHasta',
        { fechaHasta: filters.fecha_hasta }
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('inventario_nuevo.created_at', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Generar código de AF inventario único
   * Formato: AF-YYYYMMDD-NNNN
   */
  private async generateCodAfInventario(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `AF-${year}${month}${day}`;

    // Buscar el último código generado hoy
    const lastCode = await this.inventarioNuevoRepository
      .createQueryBuilder('inventario_nuevo')
      .where('inventario_nuevo.cod_af_inventario LIKE :prefix', {
        prefix: `${datePrefix}-%`,
      })
      .orderBy('inventario_nuevo.cod_af_inventario', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastCode?.cod_af_inventario) {
      const parts = lastCode.cod_af_inventario.split('-');
      if (parts.length === 3 && parts[2]) {
        const parsedSequence = parseInt(parts[2], 10);
        if (!isNaN(parsedSequence)) {
          sequence = parsedSequence + 1;
        }
      }
    }

    return `${datePrefix}-${String(sequence).padStart(4, '0')}`;
  }

  /**
   * Generar código de etiqueta único
   * Formato: AAMMDDNNNN (año 2 dígitos, mes, día, número secuencial de 4 dígitos)
   * Ejemplo: 2511160001 (año 2025, mes 11, día 16, secuencia 0001)
   * Máximo 9999 items por día
   */
  private async generateCodEtiqueta(): Promise<string> {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2); // Últimos 2 dígitos del año
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    // Buscar el último código generado hoy
    const lastCode = await this.inventarioNuevoRepository
      .createQueryBuilder('inventario_nuevo')
      .where('inventario_nuevo.cod_etiqueta LIKE :prefix', {
        prefix: `${datePrefix}%`,
      })
      .orderBy('inventario_nuevo.cod_etiqueta', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastCode?.cod_etiqueta) {
      // Extraer los últimos 4 dígitos
      const sequencePart = lastCode.cod_etiqueta.substring(6);
      const parsedSequence = parseInt(sequencePart, 10);
      if (!isNaN(parsedSequence)) {
        sequence = parsedSequence + 1;
      }
    }

    // Validar que no exceda 9999
    if (sequence > 9999) {
      throw new Error('Se ha alcanzado el límite de 9999 activos por día');
    }

    return `${datePrefix}${String(sequence).padStart(4, '0')}`;
  }

  /**
   * Registrar activo desde uno existente en inventario
   * Este método maneja todo el flujo:
   * 1. Crear registro en inventario_nuevo
   * 2. Crear registro en tabla específica según tipo
   * 3. Actualizar inventario original
   * 4. Registrar auditoría de ubicación
   */
  async registerFromExisting(
    data: RegisterFromExistingDto,
    userId: string
  ): Promise<InventarioNuevo> {
    // Usar transacción para asegurar consistencia
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar que inventario origen existe (solo si se proporciona)
      let inventarioOrigen: Inventario | null = null;
      if (data.inventario_origen_id) {
        inventarioOrigen = await queryRunner.manager.findOne(Inventario, {
          where: { id: data.inventario_origen_id },
        });

        if (!inventarioOrigen) {
          throw new Error('El inventario origen especificado no existe');
        }
      }

      // Para activos nuevos sin origen, tipo_activo_fijo es requerido
      if (!data.inventario_origen_id && !data.tipo_activo_fijo) {
        throw new Error('El tipo de activo fijo es requerido para activos nuevos');
      }

      // 2. Generar códigos automáticos
      const codAfInventario = await this.generateCodAfInventario();
      const codEtiqueta = await this.generateCodEtiqueta();

      // 3. Crear registro en inventario_nuevo
      const tipoActivoFijo = data.tipo_activo_fijo || inventarioOrigen?.tipo_activo_fijo;
      const inventarioNuevo = queryRunner.manager.create(InventarioNuevo, {
        cod_proyecto: data.cod_proyecto,
        cod_sucursal: data.cod_sucursal,
        cod_area: data.cod_area,
        cod_af_inventario: codAfInventario,
        cod_patrimonial: data.cod_patrimonial,
        cod_etiqueta: codEtiqueta, // Generado automáticamente
        descripcion: data.descripcion,
        tipo_activo_fijo: tipoActivoFijo,
        estado: data.estado,
        cod_responsable: data.cod_responsable,
        compuesto: data.compuesto,
        detalle_compuesto: data.detalle_compuesto,
        observaciones: data.observaciones,
        inventario_origen_id: data.inventario_origen_id,
        created_by: userId,
        registro_inventario: RegistroInventario.AF_CONCILIADO,
      });

      const savedInventarioNuevo = await queryRunner.manager.save(inventarioNuevo);

      // 4. Crear registro en tabla específica según tipo de activo
      const tipoActivo = tipoActivoFijo;

      if (tipoActivo === TipoActivoFijo.MOBILIARIO && data.mobiliario_fields) {
        const mobiliario = queryRunner.manager.create(Mobiliario, {
          inventario_nuevo_id: savedInventarioNuevo.id,
          ...data.mobiliario_fields,
        });
        await queryRunner.manager.save(mobiliario);
      } else if (
        tipoActivo === TipoActivoFijo.EQUIPOS_INFORMATICOS &&
        data.equipos_informaticos_fields
      ) {
        const equipos = queryRunner.manager.create(EquiposInformaticos, {
          inventario_nuevo_id: savedInventarioNuevo.id,
          ...data.equipos_informaticos_fields,
        });
        await queryRunner.manager.save(equipos);
      } else if (tipoActivo === TipoActivoFijo.VEHICULOS && data.vehiculos_fields) {
        const vehiculo = queryRunner.manager.create(Vehiculos, {
          inventario_nuevo_id: savedInventarioNuevo.id,
          ...data.vehiculos_fields,
        });
        await queryRunner.manager.save(vehiculo);
      }

      // 5. Actualizar inventario original solo si existe (no es null para activos nuevos)
      if (data.inventario_origen_id) {
        await queryRunner.manager.update(Inventario, data.inventario_origen_id, {
          encontrado: true,
          cod_af_inventario: codAfInventario,
        });
      }

      // 6. Crear registro de auditoría de ubicación
      const auditoria = queryRunner.manager.create(RegistroAuditoriaUbicacion, {
        inventario_nuevo_id: savedInventarioNuevo.id,
        user_id: userId,
        lat: data.location.lat,
        lng: data.location.lng,
        device_info: data.location.deviceInfo
          ? { info: data.location.deviceInfo }
          : undefined,
      });
      await queryRunner.manager.save(auditoria);

      // Commit de la transacción
      await queryRunner.commitTransaction();

      // Log de creación
      Logger.event.assetCreated(userId, savedInventarioNuevo.id, true);
      Logger.event.locationRecorded(
        userId,
        savedInventarioNuevo.id,
        data.location.lat,
        data.location.lng
      );

      return savedInventarioNuevo;
    } catch (error) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar conexión
      await queryRunner.release();
    }
  }

  /**
   * Actualizar registro existente de inventario_nuevo
   * Actualiza el inventario_nuevo y las tablas específicas según tipo
   */
  async updateFromExisting(
    inventarioNuevoId: string,
    data: RegisterFromExistingDto,
    userId: string
  ): Promise<InventarioNuevo> {
    // Usar transacción para asegurar consistencia
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verificar que el inventario_nuevo existe
      const existingInventarioNuevo = await queryRunner.manager.findOne(InventarioNuevo, {
        where: { id: inventarioNuevoId },
      });

      if (!existingInventarioNuevo) {
        throw new Error('El registro de inventario_nuevo no existe');
      }

      // 2. Validar que inventario origen existe (solo si se proporciona)
      if (data.inventario_origen_id) {
        const inventarioOrigen = await queryRunner.manager.findOne(Inventario, {
          where: { id: data.inventario_origen_id },
        });

        if (!inventarioOrigen) {
          throw new Error('El inventario origen especificado no existe');
        }
      }

      // 3. Actualizar registro en inventario_nuevo (mantener códigos generados)
      await queryRunner.manager.update(InventarioNuevo, inventarioNuevoId, {
        cod_proyecto: data.cod_proyecto,
        cod_sucursal: data.cod_sucursal,
        cod_area: data.cod_area,
        cod_patrimonial: data.cod_patrimonial,
        descripcion: data.descripcion,
        tipo_activo_fijo: data.tipo_activo_fijo,
        estado: data.estado,
        cod_responsable: data.cod_responsable,
        compuesto: data.compuesto,
        detalle_compuesto: data.detalle_compuesto,
        observaciones: data.observaciones,
      });

      // 4. Actualizar o crear registro en tabla específica según tipo de activo
      const tipoActivo = data.tipo_activo_fijo || existingInventarioNuevo.tipo_activo_fijo;

      if (tipoActivo === TipoActivoFijo.MOBILIARIO && data.mobiliario_fields) {
        // Buscar si existe
        const existing = await queryRunner.manager.findOne(Mobiliario, {
          where: { inventario_nuevo_id: inventarioNuevoId },
        });

        if (existing) {
          // Actualizar
          await queryRunner.manager.update(Mobiliario, existing.id, data.mobiliario_fields);
        } else {
          // Crear
          const mobiliario = queryRunner.manager.create(Mobiliario, {
            inventario_nuevo_id: inventarioNuevoId,
            ...data.mobiliario_fields,
          });
          await queryRunner.manager.save(mobiliario);
        }
      } else if (
        tipoActivo === TipoActivoFijo.EQUIPOS_INFORMATICOS &&
        data.equipos_informaticos_fields
      ) {
        const existing = await queryRunner.manager.findOne(EquiposInformaticos, {
          where: { inventario_nuevo_id: inventarioNuevoId },
        });

        if (existing) {
          await queryRunner.manager.update(
            EquiposInformaticos,
            existing.id,
            data.equipos_informaticos_fields
          );
        } else {
          const equipos = queryRunner.manager.create(EquiposInformaticos, {
            inventario_nuevo_id: inventarioNuevoId,
            ...data.equipos_informaticos_fields,
          });
          await queryRunner.manager.save(equipos);
        }
      } else if (tipoActivo === TipoActivoFijo.VEHICULOS && data.vehiculos_fields) {
        const existing = await queryRunner.manager.findOne(Vehiculos, {
          where: { inventario_nuevo_id: inventarioNuevoId },
        });

        if (existing) {
          await queryRunner.manager.update(Vehiculos, existing.id, data.vehiculos_fields);
        } else {
          const vehiculo = queryRunner.manager.create(Vehiculos, {
            inventario_nuevo_id: inventarioNuevoId,
            ...data.vehiculos_fields,
          });
          await queryRunner.manager.save(vehiculo);
        }
      }

      // 5. Crear registro de auditoría de ubicación (nuevo registro cada vez que se actualiza)
      const auditoria = queryRunner.manager.create(RegistroAuditoriaUbicacion, {
        inventario_nuevo_id: inventarioNuevoId,
        user_id: userId,
        lat: data.location.lat,
        lng: data.location.lng,
        device_info: data.location.deviceInfo
          ? { info: data.location.deviceInfo }
          : undefined,
      });
      await queryRunner.manager.save(auditoria);

      // Commit de la transacción
      await queryRunner.commitTransaction();

      // Obtener el registro actualizado
      const updatedInventarioNuevo = await this.inventarioNuevoRepository.findOne({
        where: { id: inventarioNuevoId },
        relations: ['inventario_origen', 'user'],
      });

      // Log de actualización
      Logger.event.locationRecorded(
        userId,
        inventarioNuevoId,
        data.location.lat,
        data.location.lng
      );

      return updatedInventarioNuevo!;
    } catch (error) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar conexión
      await queryRunner.release();
    }
  }
}
