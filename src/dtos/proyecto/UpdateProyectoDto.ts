import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { SituacionProyecto } from '../../entities/Proyecto';

/**
 * DTO para actualizar un proyecto existente
 * Todos los campos son opcionales
 */
export class UpdateProyectoDto {
  @IsString({ message: 'El código de proyecto debe ser un texto' })
  @IsOptional()
  cod_proyecto?: string;

  @IsString({ message: 'La empresa debe ser un texto' })
  @IsOptional()
  empresa?: string;

  @IsString({ message: 'La razón social debe ser un texto' })
  @IsOptional()
  razon_social?: string;

  @IsString({ message: 'El rubro debe ser un texto' })
  @IsOptional()
  rubro?: string;

  @IsString({ message: 'El logo debe ser un texto' })
  @IsOptional()
  logo?: string;

  @IsDateString({}, { message: 'La fecha de inicio de proyecto debe ser una fecha válida' })
  @IsOptional()
  inicio_proyecto?: Date;

  @IsDateString({}, { message: 'La fecha de firma de contrato debe ser una fecha válida' })
  @IsOptional()
  firma_contrato?: Date;

  @IsDateString({}, { message: 'La fecha de fin de contrato debe ser una fecha válida' })
  @IsOptional()
  fecha_fin_contrato?: Date;

  @IsDateString({}, { message: 'La fecha de fin proyectado debe ser una fecha válida' })
  @IsOptional()
  fin_proyectado?: Date;

  @IsDateString({}, { message: 'La fecha de fin real debe ser una fecha válida' })
  @IsOptional()
  fin_real?: Date;

  @IsEnum(SituacionProyecto, {
    message: 'La situación debe ser: En ejecución, Suspendido o Terminado'
  })
  @IsOptional()
  situacion?: SituacionProyecto;
}
