import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches, IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '../../entities/User';

/**
 * DTO para crear un nuevo usuario
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El DNI es requerido' })
  @Length(8, 8, { message: 'El DNI debe tener 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe contener solo números' })
  dni!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(1, 200, { message: 'El nombre debe tener entre 1 y 200 caracteres' })
  nombre!: string;

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
  @IsNotEmpty({ message: 'El rol es requerido' })
  rol!: UserRole;

  @IsString()
  @IsNotEmpty({ message: 'El username es requerido' })
  @Length(3, 100, { message: 'El username debe tener entre 3 y 100 caracteres' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El username solo puede contener letras, números, guiones y guiones bajos',
  })
  username!: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  proyecto_id?: string;
}
