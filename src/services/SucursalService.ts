import { AppDataSource } from '../config/data-source';
import { Sucursal } from '../entities/Sucursal';
import { Proyecto } from '../entities/Proyecto';
import { CreateSucursalDto, UpdateSucursalDto } from '../dtos/sucursal';
import { Logger } from '../utils/logger';
import {
  isValidDepartamento,
  isValidProvincia,
  isValidDistrito,
} from '../utils/peru-ubigeo';

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
interface SucursalFilters {
  search?: string;
  cod_proyecto?: string;
  departamento?: string;
}

/**
 * Servicio de gestión de Sucursales
 */
export class SucursalService {
  private sucursalRepository = AppDataSource.getRepository(Sucursal);
  private proyectoRepository = AppDataSource.getRepository(Proyecto);

  /**
   * Crear nueva sucursal
   * Auto-genera cod_sucursal y cod_responsable
   */
  async create(data: CreateSucursalDto): Promise<Sucursal> {
    // 1. Validar que el proyecto existe
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: data.cod_proyecto },
    });

    if (!proyecto) {
      throw new Error('El proyecto especificado no existe');
    }

    // 2. Validar ubicación (departamento, provincia, distrito)
    if (!isValidDepartamento(data.departamento)) {
      throw new Error(`Departamento inválido: ${data.departamento}`);
    }

    if (!isValidProvincia(data.departamento, data.provincia)) {
      throw new Error(
        `Provincia inválida: ${data.provincia} para el departamento ${data.departamento}`
      );
    }

    if (!isValidDistrito(data.departamento, data.provincia, data.distrito)) {
      throw new Error(
        `Distrito inválido: ${data.distrito} para la provincia ${data.provincia}`
      );
    }

    // 3. Contar sucursales del proyecto para generar cod_sucursal
    const countSucursales = await this.sucursalRepository.count({
      where: { cod_proyecto: data.cod_proyecto },
    });

    const nextNumber = countSucursales + 1;
    const codSucursal = `${proyecto.cod_proyecto}-${nextNumber}`;

    // 4. Generar cod_responsable único basado en contador global
    const totalSucursales = await this.sucursalRepository.count();
    const codResponsable = `R${totalSucursales + 1}`;

    // 5. Crear entidad con códigos autogenerados
    const sucursal = this.sucursalRepository.create({
      ...data,
      cod_sucursal: codSucursal,
      cod_responsable: codResponsable,
    });

    const savedSucursal = await this.sucursalRepository.save(sucursal);

    Logger.info('Sucursal creada exitosamente', {
      sucursalId: savedSucursal.id,
      codSucursal: savedSucursal.cod_sucursal,
      codResponsable: savedSucursal.cod_responsable,
      proyecto: proyecto.cod_proyecto,
    });

    // Recargar con relaciones para retornar objeto completo
    return await this.findById(savedSucursal.id);
  }

  /**
   * Obtener todas las sucursales con paginación y filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: SucursalFilters
  ): Promise<PaginatedResponse<Sucursal>> {
    const skip = (page - 1) * limit;

    let queryBuilder = this.sucursalRepository
      .createQueryBuilder('sucursal')
      .leftJoinAndSelect('sucursal.proyecto', 'proyecto');

    // Aplicar filtros
    if (filters?.search) {
      queryBuilder = queryBuilder.where(
        '(sucursal.cod_sucursal ILIKE :search OR ' +
        'sucursal.nombre_sucursal ILIKE :search OR ' +
        'sucursal.direccion ILIKE :search OR ' +
        'sucursal.cod_responsable ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.cod_proyecto) {
      queryBuilder = queryBuilder.andWhere(
        'sucursal.cod_proyecto = :codProyecto',
        { codProyecto: filters.cod_proyecto }
      );
    }

    if (filters?.departamento) {
      queryBuilder = queryBuilder.andWhere(
        'sucursal.departamento = :departamento',
        { departamento: filters.departamento }
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('sucursal.created_at', 'DESC')
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
   * Obtener sucursal por ID
   */
  async findById(id: string): Promise<Sucursal> {
    const sucursal = await this.sucursalRepository.findOne({
      where: { id },
      relations: ['proyecto'],
    });

    if (!sucursal) {
      throw new Error(`Sucursal con ID ${id} no encontrada`);
    }

    return sucursal;
  }

  /**
   * Buscar sucursal por código
   */
  async findByCodSucursal(codSucursal: string): Promise<Sucursal | null> {
    return await this.sucursalRepository.findOne({
      where: { cod_sucursal: codSucursal },
      relations: ['proyecto'],
    });
  }

  /**
   * Actualizar sucursal
   */
  async update(id: string, data: UpdateSucursalDto): Promise<Sucursal> {
    const sucursal = await this.findById(id);

    // Validar ubicación si se está actualizando
    if (data.departamento || data.provincia || data.distrito) {
      const departamento = data.departamento || sucursal.departamento;
      const provincia = data.provincia || sucursal.provincia;
      const distrito = data.distrito || sucursal.distrito;

      if (!isValidDepartamento(departamento)) {
        throw new Error(`Departamento inválido: ${departamento}`);
      }

      if (!isValidProvincia(departamento, provincia)) {
        throw new Error(
          `Provincia inválida: ${provincia} para el departamento ${departamento}`
        );
      }

      if (!isValidDistrito(departamento, provincia, distrito)) {
        throw new Error(
          `Distrito inválido: ${distrito} para la provincia ${provincia}`
        );
      }
    }

    // Actualizar campos
    Object.assign(sucursal, data);

    await this.sucursalRepository.save(sucursal);

    Logger.info('Sucursal actualizada exitosamente', {
      sucursalId: sucursal.id,
      codSucursal: sucursal.cod_sucursal,
    });

    // Recargar con relaciones para retornar objeto completo
    return await this.findById(sucursal.id);
  }

  /**
   * Eliminar sucursal
   */
  async delete(id: string): Promise<void> {
    const sucursal = await this.findById(id);

    // TODO: Validar si tiene dependencias (ej. inventario)
    // Aquí puedes agregar lógica para verificar si la sucursal
    // está siendo usada en otras tablas antes de eliminarla

    await this.sucursalRepository.remove(sucursal);

    Logger.info('Sucursal eliminada exitosamente', {
      sucursalId: id,
      codSucursal: sucursal.cod_sucursal,
    });
  }
}
