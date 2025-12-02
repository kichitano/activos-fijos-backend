import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

/**
 * Middleware para loguear todas las peticiones HTTP
 */
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Capturar información de la petición
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.socket.remoteAddress;
  const userAgent = req.get('user-agent');

  // Log de petición entrante
  Logger.debug(`Incoming ${method} ${url}`, {
    ip,
    userAgent,
    userId: req.user?.userId,
    username: req.user?.username,
  });

  // Interceptar el método res.json para loguear la respuesta
  const originalJson = res.json.bind(res);
  res.json = function (body: any): Response {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log de respuesta según status code
    if (statusCode >= 500) {
      Logger.error(`${method} ${url} - ${statusCode} (${duration}ms)`, {
        ip,
        userId: req.user?.userId,
        statusCode,
        duration,
        responseBody: body,
      });
    } else if (statusCode >= 400) {
      Logger.warn(`${method} ${url} - ${statusCode} (${duration}ms)`, {
        ip,
        userId: req.user?.userId,
        statusCode,
        duration,
        responseBody: body,
      });
    } else {
      Logger.info(`${method} ${url} - ${statusCode} (${duration}ms)`, {
        ip,
        userId: req.user?.userId,
        statusCode,
        duration,
      });
    }

    return originalJson(body);
  };

  next();
};
