import { AppDataSource } from '../config/data-source';
import { Area } from '../entities/Area';
import { Proyecto } from '../entities/Proyecto';
import { Sucursal } from '../entities/Sucursal';
import { CreateAreaDto, UpdateAreaDto } from '../dtos/area';
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
interface AreaFilters {
  search?: string;
  cod_proyecto?: string;
  cod_sucursal?: string;
}

/**
 * Servicio de gestión de Areas
 */
export class AreaService {
  private areaRepository = AppDataSource.getRepository(Area);
  private proyectoRepository = AppDataSource.getRepository(Proyecto);
  private sucursalRepository = AppDataSource.getRepository(Sucursal);

  /**
   * Crear nueva área
   * Auto-genera cod_area y cod_responsable
   */
  async create(data: CreateAreaDto): Promise<Area> {
    // 1. Validar que el proyecto existe
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: data.cod_proyecto },
    });

    if (!proyecto) {
      throw new Error('El proyecto especificado no existe');
    }

    // 2. Validar que la sucursal existe
    const sucursal = await this.sucursalRepository.findOne({
      where: { id: data.cod_sucursal },
    });

    if (!sucursal) {
      throw new Error('La sucursal especificada no existe');
    }

    // 3. Validar que la sucursal pertenece al proyecto
    if (sucursal.cod_proyecto !== data.cod_proyecto) {
      throw new Error('La sucursal no pertenece al proyecto especificado');
    }

    // 4. Contar áreas de la sucursal para generar cod_area
    const countAreas = await this.areaRepository.count({
      where: { cod_sucursal: data.cod_sucursal },
    });

    const nextNumber = countAreas + 1;
    const codArea = `${sucursal.cod_sucursal}-${nextNumber}`;

    // 5. Generar cod_responsable único basado en contador global
    const totalAreas = await this.areaRepository.count();
    const codResponsable = `R${totalAreas + 1}`;

    // 6. Crear entidad con códigos autogenerados
    const area = this.areaRepository.create({
      ...data,
      cod_area: codArea,
      cod_responsable: codResponsable,
    });

    const savedArea = await this.areaRepository.save(area);

    Logger.info('Área creada exitosamente', {
      areaId: savedArea.id,
      codArea: savedArea.cod_area,
      codResponsable: savedArea.cod_responsable,
      proyecto: proyecto.cod_proyecto,
      sucursal: sucursal.cod_sucursal,
    });

    // Recargar con relaciones para retornar objeto completo
    return await this.findById(savedArea.id);
  }

  /**
   * Obtener todas las áreas con paginación y filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: AreaFilters
  ): Promise<PaginatedResponse<Area>> {
    const skip = (page - 1) * limit;

    let queryBuilder = this.areaRepository
      .createQueryBuilder('area')
      .leftJoinAndSelect('area.proyecto', 'proyecto')
      .leftJoinAndSelect('area.sucursal', 'sucursal');

    // Aplicar filtros
    if (filters?.search) {
      queryBuilder = queryBuilder.where(
        '(area.cod_area ILIKE :search OR ' +
        'area.area ILIKE :search OR ' +
        'area.cod_responsable ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.cod_proyecto) {
      queryBuilder = queryBuilder.andWhere(
        'area.cod_proyecto = :codProyecto',
        { codProyecto: filters.cod_proyecto }
      );
    }

    if (filters?.cod_sucursal) {
      queryBuilder = queryBuilder.andWhere(
        'area.cod_sucursal = :codSucursal',
        { codSucursal: filters.cod_sucursal }
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('area.created_at', 'DESC')
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
   * Obtener área por ID
   */
  async findById(id: string): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: ['proyecto', 'sucursal'],
    });

    if (!area) {
      throw new Error(`Área con ID ${id} no encontrada`);
    }

    return area;
  }

  /**
   * Buscar área por código
   */
  async findByCodArea(codArea: string): Promise<Area | null> {
    return await this.areaRepository.findOne({
      where: { cod_area: codArea },
      relations: ['proyecto', 'sucursal'],
    });
  }

  /**
   * Actualizar área
   */
  async update(id: string, data: UpdateAreaDto): Promise<Area> {
    const area = await this.findById(id);

    // Actualizar campos
    Object.assign(area, data);

    await this.areaRepository.save(area);

    Logger.info('Área actualizada exitosamente', {
      areaId: area.id,
      codArea: area.cod_area,
    });

    // Recargar con relaciones para retornar objeto completo
    return await this.findById(area.id);
  }

  /**
   * Eliminar área
   */
  async delete(id: string): Promise<void> {
    const area = await this.findById(id);

    // TODO: Validar si tiene dependencias (ej. inventario)
    // Aquí puedes agregar lógica para verificar si el área
    // está siendo usada en otras tablas antes de eliminarla

    await this.areaRepository.remove(area);

    Logger.info('Área eliminada exitosamente', {
      areaId: id,
      codArea: area.cod_area,
    });
  }
}
