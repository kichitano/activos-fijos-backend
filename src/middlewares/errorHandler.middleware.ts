import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';
import { Logger } from '../utils/logger';

/**
 * Middleware global de manejo de errores
 * Debe ser el último middleware registrado en Express
 *
 * Captura y formatea errores de:
 * - TypeORM (QueryFailedError)
 * - Validación
 * - Errores personalizados
 * - Errores genéricos
 *
 * @example
 * // En index.ts, después de todas las rutas:
 * app.use(errorHandlerMiddleware);
 */
export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log del error
  Logger.error('Error capturado por errorHandlerMiddleware', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    userId: req.user?.userId,
    username: req.user?.username,
  });

  // Error de TypeORM (QueryFailedError)
  if (error instanceof QueryFailedError) {
    const dbError = error as any;

    // Violación de constraint única
    if (dbError.code === '23505') {
      res.status(409).json({
        message: 'El registro ya existe',
        error: 'DUPLICATE_ENTRY',
        detail: dbError.detail,
      });
      return;
    }

    // Violación de foreign key
    if (dbError.code === '23503') {
      res.status(400).json({
        message: 'Referencia inválida',
        error: 'FOREIGN_KEY_VIOLATION',
        detail: dbError.detail,
      });
      return;
    }

    // Violación de not null
    if (dbError.code === '23502') {
      res.status(400).json({
        message: 'Campo requerido faltante',
        error: 'NOT_NULL_VIOLATION',
        detail: dbError.detail,
      });
      return;
    }

    // Error genérico de BD
    res.status(500).json({
      message: 'Error en base de datos',
      error: process.env.NODE_ENV === 'development' ? dbError.message : 'DATABASE_ERROR',
    });
    return;
  }

  // Error de validación (class-validator)
  if (error.name === 'ValidationError') {
    res.status(400).json({
      message: 'Error de validación',
      error: error.message,
    });
    return;
  }

  // Error genérico
  const statusCode = (error as any).statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : error.message;

  res.status(statusCode).json({
    message,
    error: error.name,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
