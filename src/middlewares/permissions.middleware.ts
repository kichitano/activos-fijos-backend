import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../entities/User';
import { Logger } from '../utils/logger';

/**
 * Middleware de autorización por rol
 * Factory function que retorna middleware validando roles permitidos
 *
 * @param allowedRoles Array de roles permitidos para acceder al endpoint
 *
 * @example
 * router.post('/users',
 *   authMiddleware,
 *   permissionsMiddleware([UserRole.ADMINISTRADOR]),
 *   UserController.create
 * );
 */
export const permissionsMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        Logger.warn('Intento de acceso sin autenticación', {
          endpoint: req.path,
          method: req.method,
        });
        res.status(401).json({ message: 'No autenticado' });
        return;
      }

      // Verificar que el rol del usuario esté en la lista de roles permitidos
      if (!allowedRoles.includes(req.user.rol)) {
        Logger.event.accessDenied(req.user.userId, req.path, allowedRoles.join(', '));
        res.status(403).json({
          message: 'No tiene permisos para acceder a este recurso',
          requiredRoles: allowedRoles,
          userRole: req.user.rol,
        });
        return;
      }

      // Usuario tiene permisos, continuar
      next();
    } catch (error) {
      Logger.error('Error en permissionsMiddleware', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        endpoint: req.path,
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};
