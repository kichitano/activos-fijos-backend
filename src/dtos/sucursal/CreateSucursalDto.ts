import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * DTO para crear una nueva sucursal
 */
export class CreateSucursalDto {
  @IsUUID('4', { message: 'El código de proyecto debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El código de proyecto es requerido' })
  cod_proyecto!: string;

  @IsString({ message: 'El nombre de sucursal debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de sucursal es requerido' })
  @MinLength(3, { message: 'El nombre de sucursal debe tener al menos 3 caracteres' })
  nombre_sucursal!: string;

  @IsString({ message: 'El departamento debe ser un texto' })
  @IsNotEmpty({ message: 'El departamento es requerido' })
  departamento!: string;

  @IsString({ message: 'La provincia debe ser un texto' })
  @IsNotEmpty({ message: 'La provincia es requerida' })
  provincia!: string;

  @IsString({ message: 'El distrito debe ser un texto' })
  @IsNotEmpty({ message: 'El distrito es requerido' })
  distrito!: string;

  @IsString({ message: 'La dirección debe ser un texto' })
  @IsOptional()
  direccion?: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsOptional()
  @Matches(/^[0-9]{1,15}$/, {
    message: 'El teléfono debe contener entre 1 y 15 dígitos numéricos'
  })
  telefono?: string;
}
