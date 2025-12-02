import { AppDataSource } from '../config/data-source';
import { Responsable } from '../entities/Responsable';
import { Area } from '../entities/Area';
import { CreateResponsableDto, UpdateResponsableDto } from '../dtos/responsable';
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
interface ResponsableFilters {
  search?: string;
  area_uuid?: string;
}

/**
 * Servicio de gestión de Responsables
 */
export class ResponsableService {
  private responsableRepository = AppDataSource.getRepository(Responsable);
  private areaRepository = AppDataSource.getRepository(Area);

  /**
   * Crear nuevo responsable
   * Auto-genera cod_responsable con formato: {cod_area}-{numero}
   */
  async create(data: CreateResponsableDto): Promise<Responsable> {
    // 1. Validar que el área existe
    const area = await this.areaRepository.findOne({
      where: { id: data.area_uuid },
    });

    if (!area) {
      throw new Error('El área especificada no existe');
    }

    // 2. Contar responsables existentes en esta área específica
    const countForArea = await this.responsableRepository.count({
      where: { area_uuid: data.area_uuid },
    });

    // 3. Generar cod_responsable con formato: {cod_area}-{numero}
    const codResponsable = `${area.cod_area}-${countForArea + 1}`;

    // 4. Crear entidad con código autogenerado
    const responsable = this.responsableRepository.create({
      ...data,
      cod_responsable: codResponsable,
    });

    const savedResponsable = await this.responsableRepository.save(responsable);

    Logger.info('Responsable creado exitosamente', {
      responsableId: savedResponsable.id,
      codResponsable: savedResponsable.cod_responsable,
      area: area.cod_area,
      dni: data.dni,
      nombre: data.nombre,
    });

    // Recargar con relaciones para retornar objeto completo
    return await this.findById(savedResponsable.id);
  }

  /**
   * Obtener todos los responsables con paginación y filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: ResponsableFilters
  ): Promise<PaginatedResponse<Responsable>> {
    const skip = (page - 1) * limit;

    let queryBuilder = this.responsableRepository
      .createQueryBuilder('responsable')
      .leftJoinAndSelect('responsable.area', 'area')
      .leftJoinAndSelect('area.sucursal', 'sucursal')
      .leftJoinAndSelect('sucursal.proyecto', 'proyecto');

    // Aplicar filtros
    if (filters?.search) {
      queryBuilder = queryBuilder.where(
        '(responsable.cod_responsable ILIKE :search OR ' +
        'responsable.nombre ILIKE :search OR ' +
        'responsable.cargo ILIKE :search OR ' +
        'responsable.dni ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.area_uuid) {
      queryBuilder = queryBuilder.andWhere(
        'responsable.area_uuid = :areaUuid',
        { areaUuid: filters.area_uuid }
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('responsable.createdAt', 'DESC')
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
   * Obtener responsable por ID
   */
  async findById(id: string): Promise<Responsable> {
    const responsable = await this.responsableRepository.findOne({
      where: { id },
      relations: ['area', 'area.sucursal', 'area.sucursal.proyecto'],
    });

    if (!responsable) {
      throw new Error(`Responsable con ID ${id} no encontrado`);
    }

    return responsable;
  }

  /**
   * Buscar responsable por código
   */
  async findByCodResponsable(codResponsable: string): Promise<Responsable | null> {
    return await this.responsableRepository.findOne({
      where: { cod_responsable: codResponsable },
      relations: ['area', 'area.sucursal', 'area.sucursal.proyecto'],
    });
  }

  /**
   * Actualizar responsable
   */
  async update(id: string, data: UpdateResponsableDto): Promise<Responsable> {
    const responsable = await this.findById(id);

    // Actualizar solo campos editables (cargo, nombre, correo, telefono)
    Object.assign(responsable, data);

    await this.responsableRepository.save(responsable);

    Logger.info('Responsable actualizado exitosamente', {
      responsableId: responsable.id,
      codResponsable: responsable.cod_responsable,
    });

    // Recargar con relaciones para retornar objeto completo
    return await this.findById(responsable.id);
  }

  /**
   * Eliminar responsable
   */
  async delete(id: string): Promise<void> {
    const responsable = await this.findById(id);

    // TODO: Validar si tiene dependencias (ej. inventario_nuevo)
    // Aquí puedes agregar lógica para verificar si el responsable
    // está siendo usado en otras tablas antes de eliminarlo

    await this.responsableRepository.remove(responsable);

    Logger.info('Responsable eliminado exitosamente', {
      responsableId: id,
      codResponsable: responsable.cod_responsable,
    });
  }
}
