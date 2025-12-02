import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * DTO para crear una nueva área
 */
export class CreateAreaDto {
  @IsUUID('4', { message: 'El código de proyecto debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El código de proyecto es requerido' })
  cod_proyecto!: string;

  @IsUUID('4', { message: 'El código de sucursal debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El código de sucursal es requerido' })
  cod_sucursal!: string;

  @IsString({ message: 'El nombre del área debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del área es requerido' })
  @MinLength(3, { message: 'El nombre del área debe tener al menos 3 caracteres' })
  area!: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsOptional()
  @Matches(/^[0-9]{1,15}$/, {
    message: 'El teléfono debe contener entre 1 y 15 dígitos numéricos'
  })
  telefono?: string;

  @IsString({ message: 'El anexo debe ser un texto' })
  @IsOptional()
  anexo?: string;
}
