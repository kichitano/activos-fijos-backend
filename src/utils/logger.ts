import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
// import path from 'path'; // TODO: Use if needed for log file paths

/**
 * Niveles de log personalizados
 */
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/**
 * Colores para console transport
 */
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
});

/**
 * Formato para desarrollo (pretty print)
 */
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
  })
);

/**
 * Formato para producción (JSON)
 */
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Sanitizar datos sensibles antes de loguear
 */
const sanitizeMetadata = (metadata: any): any => {
  if (!metadata || typeof metadata !== 'object') {
    return metadata;
  }

  const sanitized = { ...metadata };
  const sensitiveKeys = ['password', 'token', 'refreshToken', 'accessToken', 'password_hash'];

  for (const key of sensitiveKeys) {
    if (sanitized[key]) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
};

/**
 * Crear transports según entorno
 */
const createTransports = () => {
  const transports: winston.transport[] = [];

  // Console transport (siempre habilitado)
  transports.push(
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
    })
  );

  // File transports (solo en producción o si LOG_DIR está definido)
  if (process.env.NODE_ENV === 'production' || process.env.LOG_DIR) {
    const logDir = process.env.LOG_DIR || './logs';

    // Logs de errores
    transports.push(
      new DailyRotateFile({
        dirname: logDir,
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
        maxSize: process.env.LOG_MAX_SIZE || '10m',
        format: prodFormat,
      })
    );

    // Logs combinados (todos los niveles)
    transports.push(
      new DailyRotateFile({
        dirname: logDir,
        filename: 'combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
        maxSize: process.env.LOG_MAX_SIZE || '10m',
        format: prodFormat,
      })
    );
  }

  return transports;
};

/**
 * Crear instancia de Winston logger
 */
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  transports: createTransports(),
  exitOnError: false,
});

/**
 * Logger wrapper con métodos de conveniencia
 */
export const Logger = {
  /**
   * Log de error
   */
  error(message: string, metadata?: any) {
    logger.error(message, sanitizeMetadata(metadata));
  },

  /**
   * Log de warning
   */
  warn(message: string, metadata?: any) {
    logger.warn(message, sanitizeMetadata(metadata));
  },

  /**
   * Log de info
   */
  info(message: string, metadata?: any) {
    logger.info(message, sanitizeMetadata(metadata));
  },

  /**
   * Log de debug
   */
  debug(message: string, metadata?: any) {
    logger.debug(message, sanitizeMetadata(metadata));
  },

  /**
   * Eventos específicos del sistema
   */
  event: {
    /**
     * Autenticación
     */
    loginSuccess(userId: string, ip?: string) {
      logger.info('USER_LOGIN_SUCCESS', {
        event: 'USER_LOGIN_SUCCESS',
        userId,
        ip,
      });
    },

    loginFailed(username: string, reason: string, ip?: string) {
      logger.warn('USER_LOGIN_FAILED', {
        event: 'USER_LOGIN_FAILED',
        username,
        reason,
        ip,
      });
    },

    tokenRefreshed(userId: string) {
      logger.info('TOKEN_REFRESHED', {
        event: 'TOKEN_REFRESHED',
        userId,
      });
    },

    passwordChanged(userId: string) {
      logger.info('PASSWORD_CHANGED', {
        event: 'PASSWORD_CHANGED',
        userId,
      });
    },

    /**
     * Usuarios
     */
    userCreated(adminId: string, newUserId: string, rol: string) {
      logger.info('USER_CREATED', {
        event: 'USER_CREATED',
        adminId,
        newUserId,
        rol,
      });
    },

    userUpdated(adminId: string, userId: string, fields: string[]) {
      logger.info('USER_UPDATED', {
        event: 'USER_UPDATED',
        adminId,
        userId,
        fields,
      });
    },

    userDeactivated(adminId: string, userId: string) {
      logger.info('USER_DEACTIVATED', {
        event: 'USER_DEACTIVATED',
        adminId,
        userId,
      });
    },

    /**
     * Inventario
     */
    assetCreated(userId: string, inventarioNuevoId: string, hasOrigin: boolean) {
      logger.info('ASSET_CREATED', {
        event: 'ASSET_CREATED',
        userId,
        inventarioNuevoId,
        hasOrigin,
      });
    },

    locationRecorded(userId: string, inventarioNuevoId: string, lat: number, lng: number) {
      logger.info('LOCATION_RECORDED', {
        event: 'LOCATION_RECORDED',
        userId,
        inventarioNuevoId,
        lat,
        lng,
      });
    },

    inventorySearched(userId: string, code: string, found: boolean) {
      logger.info('INVENTORY_SEARCHED', {
        event: 'INVENTORY_SEARCHED',
        userId,
        code,
        found,
      });
    },

    printAttempted(userId: string, inventarioNuevoId: string) {
      logger.info('PRINT_ATTEMPTED', {
        event: 'PRINT_ATTEMPTED',
        userId,
        inventarioNuevoId,
      });
    },

    /**
     * Seguridad
     */
    accessDenied(userId: string, endpoint: string, requiredRole: string) {
      logger.warn('ACCESS_DENIED', {
        event: 'ACCESS_DENIED',
        userId,
        endpoint,
        requiredRole,
      });
    },

    invalidToken(endpoint: string, reason: string) {
      logger.warn('INVALID_TOKEN', {
        event: 'INVALID_TOKEN',
        endpoint,
        reason,
      });
    },

    /**
     * Errores
     */
    databaseError(error: Error, query?: string) {
      logger.error('DATABASE_ERROR', {
        event: 'DATABASE_ERROR',
        message: error.message,
        stack: error.stack,
        query,
      });
    },

    validationError(errors: any[]) {
      logger.warn('VALIDATION_ERROR', {
        event: 'VALIDATION_ERROR',
        errors,
      });
    },

    unhandledError(error: Error, context?: string) {
      logger.error('UNHANDLED_ERROR', {
        event: 'UNHANDLED_ERROR',
        message: error.message,
        stack: error.stack,
        context,
      });
    },
  },
};

export default Logger;
