import { IsUUID, IsNumber, IsNotEmpty, IsOptional, Min, Max, IsObject } from 'class-validator';

/**
 * DTO para crear registro de auditoría de ubicación
 */
export class CreateAuditoriaDto {
  @IsUUID('4', { message: 'El inventarioNuevoId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El inventarioNuevoId es requerido' })
  inventarioNuevoId!: string;

  @IsNumber({}, { message: 'La latitud debe ser un número' })
  @IsNotEmpty({ message: 'La latitud es requerida' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90' })
  lat!: number;

  @IsNumber({}, { message: 'La longitud debe ser un número' })
  @IsNotEmpty({ message: 'La longitud es requerida' })
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180' })
  lng!: number;

  @IsObject({ message: 'deviceInfo debe ser un objeto' })
  @IsOptional()
  deviceInfo?: {
    platform?: string;
    model?: string;
    osVersion?: string;
    appVersion?: string;
  };
}
