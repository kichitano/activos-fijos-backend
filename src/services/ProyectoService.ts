import { AppDataSource } from '../config/data-source';
import { Proyecto, SituacionProyecto } from '../entities/Proyecto';
import { CreateProyectoDto, UpdateProyectoDto } from '../dtos/proyecto';
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
interface ProyectoFilters {
  search?: string;
  situacion?: SituacionProyecto;
}

/**
 * Servicio de gestión de Proyectos
 */
export class ProyectoService {
  private proyectoRepository = AppDataSource.getRepository(Proyecto);

  /**
   * Crear nuevo proyecto
   */
  async create(data: CreateProyectoDto): Promise<Proyecto> {
    // Verificar si ya existe un proyecto con el mismo código
    const existingProyecto = await this.proyectoRepository.findOne({
      where: { cod_proyecto: data.cod_proyecto },
    });

    if (existingProyecto) {
      throw new Error(`Ya existe un proyecto con el código: ${data.cod_proyecto}`);
    }

    // Crear entidad
    const proyecto = this.proyectoRepository.create(data);

    const savedProyecto = await this.proyectoRepository.save(proyecto);

    Logger.info('Proyecto creado exitosamente', {
      proyectoId: savedProyecto.id,
      codProyecto: savedProyecto.cod_proyecto,
    });

    return savedProyecto;
  }

  /**
   * Obtener todos los proyectos con paginación y filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: ProyectoFilters
  ): Promise<PaginatedResponse<Proyecto>> {
    const skip = (page - 1) * limit;

    let queryBuilder = this.proyectoRepository.createQueryBuilder('proyecto');

    // Aplicar filtros
    if (filters?.search) {
      queryBuilder = queryBuilder.where(
        '(proyecto.cod_proyecto ILIKE :search OR ' +
        'proyecto.empresa ILIKE :search OR ' +
        'proyecto.razon_social ILIKE :search OR ' +
        'proyecto.rubro ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.situacion) {
      queryBuilder = queryBuilder.andWhere(
        'proyecto.situacion = :situacion',
        { situacion: filters.situacion }
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('proyecto.created_at', 'DESC')
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
   * Obtener proyecto por ID
   */
  async findById(id: string): Promise<Proyecto | null> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
    });

    return proyecto;
  }

  /**
   * Buscar proyecto por código
   */
  async findByCodProyecto(codProyecto: string): Promise<Proyecto | null> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { cod_proyecto: codProyecto },
    });

    return proyecto;
  }

  /**
   * Actualizar proyecto
   */
  async update(id: string, data: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.findById(id);

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    // Si se está actualizando el código, verificar que no exista otro proyecto con ese código
    if (data.cod_proyecto && data.cod_proyecto !== proyecto.cod_proyecto) {
      const existingProyecto = await this.proyectoRepository.findOne({
        where: { cod_proyecto: data.cod_proyecto },
      });

      if (existingProyecto) {
        throw new Error(`Ya existe otro proyecto con el código: ${data.cod_proyecto}`);
      }
    }

    // Actualizar campos
    Object.assign(proyecto, data);

    const updatedProyecto = await this.proyectoRepository.save(proyecto);

    Logger.info('Proyecto actualizado exitosamente', {
      proyectoId: updatedProyecto.id,
      codProyecto: updatedProyecto.cod_proyecto,
    });

    return updatedProyecto;
  }

  /**
   * Eliminar proyecto
   */
  async delete(id: string): Promise<void> {
    const proyecto = await this.findById(id);

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    await this.proyectoRepository.remove(proyecto);

    Logger.info('Proyecto eliminado exitosamente', {
      proyectoId: id,
      codProyecto: proyecto.cod_proyecto,
    });
  }
}
