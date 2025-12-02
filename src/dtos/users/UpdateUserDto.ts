import { IsString, IsEmail, IsOptional, Length, Matches, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { UserRole } from '../../entities/User';

/**
 * DTO para actualizar un usuario existente
 * Todos los campos son opcionales
 */
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(8, 8, { message: 'El DNI debe tener 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe contener solo números' })
  dni?: string;

  @IsString()
  @IsOptional()
  @Length(1, 200, { message: 'El nombre debe tener entre 1 y 200 caracteres' })
  nombre?: string;

  @IsString()
  @IsOptional()
  @Length(0, 300)
  direccion?: string;

  @IsString()
  @IsOptional()
  @Length(9, 9, { message: 'El celular debe tener 9 dígitos' })
  @Matches(/^\d{9}$/, { message: 'El celular debe contener solo números' })
  celular?: string;

  @IsEmail({}, { message: 'El correo1 debe ser un email válido' })
  @IsOptional()
  correo1?: string;

  @IsEmail({}, { message: 'El correo2 debe ser un email válido' })
  @IsOptional()
  correo2?: string;

  @IsEnum(UserRole, { message: 'El rol debe ser ADMINISTRADOR, COORDINADOR o REGISTRADOR' })
  @IsOptional()
  rol?: UserRole;

  @IsString()
  @IsOptional()
  @Length(3, 100, { message: 'El username debe tener entre 3 y 100 caracteres' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El username solo puede contener letras, números, guiones y guiones bajos',
  })
  username?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsString()
  @IsOptional()
  @IsUUID()
  proyecto_id?: string;
}
