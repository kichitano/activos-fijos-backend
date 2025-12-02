import {
  IsString,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * DTO para actualizar una sucursal existente
 */
export class UpdateSucursalDto {
  @IsString({ message: 'El nombre de sucursal debe ser un texto' })
  @IsOptional()
  @MinLength(3, { message: 'El nombre de sucursal debe tener al menos 3 caracteres' })
  nombre_sucursal?: string;

  @IsString({ message: 'El departamento debe ser un texto' })
  @IsOptional()
  departamento?: string;

  @IsString({ message: 'La provincia debe ser un texto' })
  @IsOptional()
  provincia?: string;

  @IsString({ message: 'El distrito debe ser un texto' })
  @IsOptional()
  distrito?: string;

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
