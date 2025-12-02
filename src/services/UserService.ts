import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { Proyecto } from '../entities/Proyecto';
import { CreateUserDto } from '../dtos/users/CreateUserDto';
import { UpdateUserDto } from '../dtos/users/UpdateUserDto';
import { AuthService } from './AuthService';
// import { Like } from 'typeorm'; // TODO: Use for search functionality
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
interface UserFilters {
  search?: string;
  rol?: UserRole;
  activo?: boolean;
}

/**
 * Servicio de gestión de usuarios
 */
export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private authService = new AuthService();

  /**
   * Listar usuarios con paginación y filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: UserFilters
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};

    if (filters?.rol) {
      where.rol = filters.rol;
    }

    if (filters?.activo !== undefined) {
      where.activo = filters.activo;
    }

    // Búsqueda por nombre, username o DNI
    let queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filters?.search) {
      queryBuilder = queryBuilder.where(
        '(user.nombre ILIKE :search OR user.username ILIKE :search OR user.dni ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.rol) {
      queryBuilder = queryBuilder.andWhere('user.rol = :rol', { rol: filters.rol });
    }

    if (filters?.activo !== undefined) {
      queryBuilder = queryBuilder.andWhere('user.activo = :activo', { activo: filters.activo });
    }

    const [data, total] = await queryBuilder
      .select([
        'user.id',
        'user.dni',
        'user.nombre',
        'user.direccion',
        'user.celular',
        'user.correo1',
        'user.correo2',
        'user.rol',
        'user.username',
        'user.activo',
        'user.must_change_password',
        'user.created_at',
        'user.updated_at',
        'proyecto.id',
        'proyecto.cod_proyecto',
        'proyecto.empresa',
      ])
      .leftJoin('user.proyecto', 'proyecto')
      .skip(skip)
      .take(limit)
      .orderBy('user.created_at', 'DESC')
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
   * Obtener usuario por ID (sin password_hash)
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'dni',
        'nombre',
        'direccion',
        'celular',
        'correo1',
        'correo2',
        'rol',
        'username',
        'activo',
        'must_change_password',
        'created_at',
        'updated_at',
      ],
      relations: ['proyecto'],
    });

    return user;
  }

  /**
   * Buscar usuario por username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  /**
   * Buscar usuario por DNI
   */
  async findByDni(dni: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { dni },
    });
  }

  /**
   * Crear nuevo usuario
   * Password default: DNI hasheado
   */
  async create(userData: CreateUserDto, adminId: string): Promise<User> {
    // Verificar que DNI y username sean únicos
    const existingUserByDni = await this.findByDni(userData.dni);
    if (existingUserByDni) {
      throw new Error('Ya existe un usuario con ese DNI');
    }

    const existingUserByUsername = await this.findByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error('Ya existe un usuario con ese username');
    }

    // Validar asignación de proyecto para no administradores
    if (userData.rol !== UserRole.ADMINISTRADOR) {
      if (!userData.proyecto_id) {
        throw new Error('El usuario debe estar asignado a un proyecto');
      }

      // Verificar que el proyecto exista
      const proyectoRepository = AppDataSource.getRepository(Proyecto);
      const proyecto = await proyectoRepository.findOne({ where: { id: userData.proyecto_id } });
      if (!proyecto) {
        throw new Error('El proyecto especificado no existe');
      }
    }

    // Hashear contraseña (DNI por defecto)
    const passwordHash = await this.authService.hashPassword(userData.dni);

    // Crear usuario
    const user = this.userRepository.create({
      ...userData,
      password_hash: passwordHash,
      must_change_password: true,
      activo: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Log de creación con evento específico
    Logger.event.userCreated(adminId, savedUser.id, savedUser.rol);

    // Retornar sin password_hash
    return this.findById(savedUser.id) as Promise<User>;
  }

  /**
   * Actualizar usuario
   */
  async update(id: string, userData: UpdateUserDto, adminId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar uniqueness si se actualizan DNI o username
    if (userData.dni && userData.dni !== user.dni) {
      const existingUserByDni = await this.findByDni(userData.dni);
      if (existingUserByDni) {
        throw new Error('Ya existe un usuario con ese DNI');
      }
    }

    if (userData.username && userData.username !== user.username) {
      const existingUserByUsername = await this.findByUsername(userData.username);
      if (existingUserByUsername) {
        throw new Error('Ya existe un usuario con ese username');
      }
    }

    // Validar proyecto si cambia el rol o el proyecto
    const newRole = userData.rol || user.rol;
    const newProyectoId = userData.proyecto_id;

    if (newRole !== UserRole.ADMINISTRADOR) {
      // Si ya tenía proyecto y no se cambia, está bien.
      // Si no tenía (era admin) o se cambia, validar.
      const targetProyectoId = newProyectoId || user.proyecto_id;

      if (!targetProyectoId) {
        throw new Error('El usuario debe estar asignado a un proyecto');
      }

      if (newProyectoId) {
        const proyectoRepository = AppDataSource.getRepository(Proyecto);
        const proyecto = await proyectoRepository.findOne({ where: { id: newProyectoId } });
        if (!proyecto) {
          throw new Error('El proyecto especificado no existe');
        }
      }
    }

    // Capturar campos actualizados
    const updatedFields = Object.keys(userData);

    // Actualizar campos
    Object.assign(user, userData);

    await this.userRepository.save(user);

    // Log de actualización con evento específico
    Logger.event.userUpdated(adminId, user.id, updatedFields);

    // Retornar sin password_hash
    return this.findById(user.id) as Promise<User>;
  }

  /**
   * Soft delete: marcar como inactivo
   */
  async delete(id: string, adminId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar que no sea el último administrador activo
    if (user.rol === UserRole.ADMINISTRADOR && user.activo) {
      const activeAdmins = await this.userRepository.count({
        where: { rol: UserRole.ADMINISTRADOR, activo: true },
      });

      if (activeAdmins <= 1) {
        throw new Error('No se puede desactivar el último administrador del sistema');
      }
    }

    user.activo = false;
    await this.userRepository.save(user);

    // Log de desactivación con evento específico
    Logger.event.userDeactivated(adminId, user.id);
  }
}
