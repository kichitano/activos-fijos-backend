import { IsUUID, IsString, IsNotEmpty, IsEmail, IsOptional, MinLength, IsEnum, Matches, Length } from 'class-validator';
import { CargoResponsable } from '../../entities/Responsable';

/**
 * DTO para crear un nuevo responsable
 */
export class CreateResponsableDto {
  @IsUUID('4', { message: 'El ID de área debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de área es requerido' })
  area_uuid!: string;

  @IsString({ message: 'El DNI debe ser un texto' })
  @IsNotEmpty({ message: 'El DNI es requerido' })
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe contener solo dígitos numéricos' })
  dni!: string;

  @IsEnum(CargoResponsable, { message: 'El cargo debe ser uno de los valores permitidos' })
  @IsNotEmpty({ message: 'El cargo es requerido' })
  cargo!: CargoResponsable;

  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsEmail({}, { message: 'El correo debe ser válido' })
  @IsOptional()
  correo?: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsOptional()
  @Matches(/^[0-9]{1,15}$/, {
    message: 'El teléfono debe contener entre 1 y 15 dígitos numéricos'
  })
  telefono?: string;
}
