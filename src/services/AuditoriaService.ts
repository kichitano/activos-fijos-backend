import { AppDataSource } from '../config/data-source';
import { RegistroAuditoriaUbicacion } from '../entities/RegistroAuditoriaUbicacion';
import { InventarioNuevo } from '../entities/InventarioNuevo';
import { CreateAuditoriaDto } from '../dtos/auditoria';
import { Logger } from '../utils/logger';

/**
 * Servicio de Auditoría de Ubicación
 */
export class AuditoriaService {
  private auditoriaRepository = AppDataSource.getRepository(RegistroAuditoriaUbicacion);
  private inventarioNuevoRepository = AppDataSource.getRepository(InventarioNuevo);

  /**
   * Registrar ubicación GPS al crear un activo nuevo
   */
  async registrarUbicacion(
    data: CreateAuditoriaDto,
    userId: string
  ): Promise<RegistroAuditoriaUbicacion> {
    // Validar que inventarioNuevoId existe
    const inventarioNuevo = await this.inventarioNuevoRepository.findOne({
      where: { id: data.inventarioNuevoId },
    });

    if (!inventarioNuevo) {
      throw new Error('El inventario nuevo especificado no existe');
    }

    // Crear registro de auditoría
    const auditoria = this.auditoriaRepository.create({
      inventario_nuevo_id: data.inventarioNuevoId,
      user_id: userId,
      lat: data.lat,
      lng: data.lng,
      device_info: data.deviceInfo,
    });

    const savedAuditoria = await this.auditoriaRepository.save(auditoria);

    // Log de registro con evento específico
    Logger.event.locationRecorded(userId, data.inventarioNuevoId, data.lat, data.lng);

    return savedAuditoria;
  }

  /**
   * Obtener historial de ubicaciones para un activo
   */
  async findByInventarioNuevo(inventarioNuevoId: string): Promise<RegistroAuditoriaUbicacion[]> {
    const registros = await this.auditoriaRepository.find({
      where: { inventario_nuevo_id: inventarioNuevoId },
      relations: ['user', 'inventario_nuevo'],
      order: { timestamp: 'DESC' },
    });

    return registros;
  }

  /**
   * Obtener registros de auditoría por usuario
   */
  async findByUser(
    userId: string,
    fechaDesde?: Date,
    fechaHasta?: Date
  ): Promise<RegistroAuditoriaUbicacion[]> {
    let queryBuilder = this.auditoriaRepository
      .createQueryBuilder('auditoria')
      .leftJoinAndSelect('auditoria.user', 'user')
      .leftJoinAndSelect('auditoria.inventario_nuevo', 'inventario_nuevo')
      .where('auditoria.user_id = :userId', { userId });

    if (fechaDesde) {
      queryBuilder = queryBuilder.andWhere('auditoria.timestamp >= :fechaDesde', { fechaDesde });
    }

    if (fechaHasta) {
      queryBuilder = queryBuilder.andWhere('auditoria.timestamp <= :fechaHasta', { fechaHasta });
    }

    const registros = await queryBuilder.orderBy('auditoria.timestamp', 'DESC').getMany();

    return registros;
  }
}
