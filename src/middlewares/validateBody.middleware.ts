import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Logger } from '../utils/logger';

/**
 * Middleware genérico para validar body de request con DTOs
 * Usa class-validator para validar automáticamente
 *
 * @param dtoClass Clase DTO a usar para validación
 *
 * @example
 * router.post('/auth/login',
 *   validateBody(LoginDto),
 *   AuthController.login
 * );
 */
export const validateBody = <T extends object>(dtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transformar body a instancia de DTO
      const dtoInstance = plainToClass(dtoClass, req.body);

      // Ejecutar validaciones
      const errors: ValidationError[] = await validate(dtoInstance);

      if (errors.length > 0) {
        // Formatear errores de validación
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
          messages: Object.values(error.constraints || {}),
        }));

        res.status(400).json({
          message: 'Errores de validación',
          errors: formattedErrors,
        });
        return;
      }

      // Reemplazar req.body con instancia validada y transformada
      req.body = dtoInstance;

      next();
    } catch (error) {
      Logger.error('Error en validateBody middleware', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        endpoint: req.path,
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};
