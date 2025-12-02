import { UserRole } from '../entities/User';

/**
 * Extensión de tipos para Express Request
 * Agrega propiedad user al objeto Request
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        username: string;
        rol: UserRole;
        proyecto_id?: string;
      };
    }
  }
}

export {};
