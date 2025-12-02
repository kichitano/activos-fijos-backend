import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AuthService } from '../services/AuthService';
import { LoginDto, RefreshTokenDto, ChangePasswordDto } from '../dtos/auth';
import { Logger } from '../utils/logger';

/**
 * Controlador de Autenticación
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/login
   * Login de usuario con username y password
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validar DTO
      const loginDto = plainToClass(LoginDto, req.body);
      const errors = await validate(loginDto);

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Datos de entrada inválidos',
          errors: errors.map((e) => Object.values(e.constraints || {})).flat(),
        });
        return;
      }

      // Obtener info del dispositivo (opcional)
      const deviceInfo = {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      };

      // Llamar al servicio de autenticación
      const result = await this.authService.login(
        loginDto.username,
        loginDto.password,
        loginDto.keepSession || false,
        deviceInfo
      );

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Credenciales inválidas' || error.message === 'Usuario inactivo') {
          res.status(401).json({ message: error.message });
        } else {
          Logger.error('Error en AuthController.login', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * POST /api/auth/refresh
   * Renovar access token usando refresh token
   */
  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validar DTO
      const refreshDto = plainToClass(RefreshTokenDto, req.body);
      const errors = await validate(refreshDto);

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Datos de entrada inválidos',
          errors: errors.map((e) => Object.values(e.constraints || {})).flat(),
        });
        return;
      }

      // Renovar token
      const result = await this.authService.refreshAccessToken(refreshDto.refreshToken);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('inválido') ||
          error.message.includes('revocado') ||
          error.message.includes('expirado')
        ) {
          res.status(401).json({ message: error.message });
        } else {
          Logger.error('Error en AuthController.refresh', {
            error: error.message,
            stack: error.stack,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };

  /**
   * POST /api/auth/change-password
   * Cambiar contraseña del usuario autenticado
   * Requiere: Authorization header con Bearer token
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      // El userId viene del middleware de autenticación
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'No autenticado' });
        return;
      }

      // Validar DTO
      const changePasswordDto = plainToClass(ChangePasswordDto, req.body);
      const errors = await validate(changePasswordDto);

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Datos de entrada inválidos',
          errors: errors.map((e) => Object.values(e.constraints || {})).flat(),
        });
        return;
      }

      // Cambiar contraseña
      await this.authService.changePassword(
        userId,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword
      );

      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === 'Usuario no encontrado' ||
          error.message === 'Contraseña actual incorrecta'
        ) {
          res.status(400).json({ message: error.message });
        } else {
          Logger.error('Error en AuthController.changePassword', {
            error: error.message,
            stack: error.stack,
            userId: req.user?.userId,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };
}
