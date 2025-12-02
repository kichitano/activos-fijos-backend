import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';

/**
 * Interface para payload de JWT
 */
interface JWTPayload {
  userId: string;
  username: string;
  rol: string;
}

/**
 * Interface para respuesta de login
 */
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    dni: string;
    nombre: string;
    direccion?: string;
    celular?: string;
    correo1?: string;
    correo2?: string;
    rol: string;
    username: string;
    activo: boolean;
    mustChangePassword: boolean;
    createdAt: string;
    updatedAt?: string;
    proyecto?: {
      id: string;
      cod_proyecto: string;
    } | null;
  };
}

/**
 * Servicio de Autenticación
 */
export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

  /**
   * Hash de contraseña con bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Comparar contraseña con hash
   */
  async comparePassword(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }

  /**
   * Generar access token y refresh token
   */
  generateTokens(
    user: User,
    keepSession: boolean = false
  ): { accessToken: string; refreshToken: string; expiresIn: number } {
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      rol: user.rol,
    };

    const secret = process.env.JWT_SECRET || 'default_secret_change_me';

    // Access token: 15 minutos
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as string | number,
    } as jwt.SignOptions);

    // Refresh token: 7 días o 30 días según keepSession
    const refreshExpiration = keepSession
      ? process.env.JWT_REFRESH_EXPIRATION_LONG || '30d'
      : process.env.JWT_REFRESH_EXPIRATION_SHORT || '7d';

    const refreshToken = jwt.sign(payload, secret, {
      expiresIn: refreshExpiration as string | number,
    } as jwt.SignOptions);

    // Calcular expiresIn en segundos (15 minutos = 900 segundos)
    const expiresIn = 900;

    return { accessToken, refreshToken, expiresIn };
  }

  /**
   * Validar y decodificar access token
   */
  validateAccessToken(token: string): JWTPayload | null {
    try {
      const secret = process.env.JWT_SECRET || 'default_secret_change_me';
      const decoded = jwt.verify(token, secret) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Login de usuario
   */
  async login(
    username: string,
    password: string,
    keepSession: boolean = false,
    deviceInfo?: object
  ): Promise<LoginResponse> {
    // Buscar usuario por username
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['proyecto'],
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!user.activo) {
      throw new Error('Usuario inactivo');
    }

    // Verificar que usuarios no administradores tengan un proyecto asignado
    if (user.rol !== UserRole.ADMINISTRADOR && !user.proyecto) {
      throw new Error('El usuario no está asignado a ningún proyecto.');
    }

    // Comparar contraseña
    const isPasswordValid = await this.comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = this.generateTokens(user, keepSession);

    // Guardar refresh token en BD
    const refreshTokenExpiration = keepSession ? 30 : 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshTokenExpiration);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      user_id: user.id,
      token: tokens.refreshToken,
      device_info: deviceInfo,
      expires_at: expiresAt,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: {
        id: user.id,
        dni: user.dni,
        nombre: user.nombre,
        direccion: user.direccion,
        celular: user.celular,
        correo1: user.correo1,
        correo2: user.correo2,
        rol: user.rol,
        username: user.username,
        activo: user.activo,
        mustChangePassword: user.must_change_password,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at?.toISOString(),
        proyecto: user.proyecto ? {
          id: user.proyecto.id,
          cod_proyecto: user.proyecto.cod_proyecto,
        } : null,
      },
    };
  }

  /**
   * Renovar access token usando refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    // Buscar refresh token en BD
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new Error('Refresh token inválido');
    }

    // Verificar si está revocado
    if (storedToken.revoked) {
      throw new Error('Refresh token revocado');
    }

    // Verificar si expiró
    if (new Date() > storedToken.expires_at) {
      throw new Error('Refresh token expirado');
    }

    // Validar JWT
    const payload = this.validateAccessToken(refreshToken);
    if (!payload) {
      throw new Error('Refresh token inválido');
    }

    // Generar nuevo access token
    const secret = process.env.JWT_SECRET || 'default_secret_change_me';
    const accessToken = jwt.sign(
      {
        userId: storedToken.user.id,
        username: storedToken.user.username,
        rol: storedToken.user.rol,
      },
      secret,
      {
        expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as string | number,
      } as jwt.SignOptions
    );

    return {
      accessToken,
      expiresIn: 900, // 15 minutos en segundos
    };
  }

  /**
   * Cambiar contraseña de usuario
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Buscar usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isOldPasswordValid = await this.comparePassword(oldPassword, user.password_hash);

    if (!isOldPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Hash de nueva contraseña
    const newPasswordHash = await this.hashPassword(newPassword);

    // Actualizar contraseña y flag must_change_password
    user.password_hash = newPasswordHash;
    user.must_change_password = false;

    await this.userRepository.save(user);

    // Revocar todos los refresh tokens del usuario
    await this.refreshTokenRepository.update(
      { user_id: userId, revoked: false },
      { revoked: true }
    );
  }
}
