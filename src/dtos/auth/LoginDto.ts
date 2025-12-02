import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO para login de usuario
 */
export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'El username es requerido' })
  username!: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password!: string;

  @IsBoolean()
  @IsOptional()
  keepSession?: boolean;
}
