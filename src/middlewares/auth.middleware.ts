import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { Logger } from '../utils/logger';

/**
 * Middleware de autenticación JWT
 * Valida el token de acceso y verifica que el usuario exista y esté activo
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token de autenticación no proporcionado' });
      return;
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Validar token
    const authService = new AuthService();
    const payload = authService.validateAccessToken(token);

    if (!payload) {
      res.status(401).json({ message: 'Token inválido o expirado' });
      return;
    }

    // Verificar que el usuario existe y está activo
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: payload.userId },
      relations: ['proyecto'],
    });

    if (!user) {
      Logger.event.invalidToken(req.path, `Usuario inexistente: ${payload.userId}`);
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (!user.activo) {
      Logger.warn(`Usuario inactivo intentó acceder: ${user.username}`, {
        userId: user.id,
        username: user.username,
        endpoint: req.path,
      });
      res.status(403).json({ message: 'Usuario inactivo' });
      return;
    }

    // Agregar info del usuario al request (con tipos)
    req.user = {
      id: payload.userId,
      userId: payload.userId,
      username: payload.username,
      rol: payload.rol as UserRole,
      proyecto_id: user.proyecto_id,
    };

    next();
  } catch (error) {
    Logger.error('Error en authMiddleware', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      endpoint: req.path,
    });
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
