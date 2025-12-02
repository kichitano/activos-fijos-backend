import {
  IsString,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * DTO para actualizar un área existente
 */
export class UpdateAreaDto {
  @IsString({ message: 'El nombre del área debe ser un texto' })
  @IsOptional()
  @MinLength(3, { message: 'El nombre del área debe tener al menos 3 caracteres' })
  area?: string;

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
