import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { SituacionProyecto } from '../../entities/Proyecto';

/**
 * DTO para crear un nuevo proyecto
 */
export class CreateProyectoDto {
  @IsString({ message: 'El código de proyecto debe ser un texto' })
  @IsNotEmpty({ message: 'El código de proyecto es requerido' })
  cod_proyecto!: string;

  @IsString({ message: 'La empresa debe ser un texto' })
  @IsNotEmpty({ message: 'La empresa es requerida' })
  empresa!: string;

  @IsString({ message: 'La razón social debe ser un texto' })
  @IsNotEmpty({ message: 'La razón social es requerida' })
  razon_social!: string;

  @IsString({ message: 'El rubro debe ser un texto' })
  @IsNotEmpty({ message: 'El rubro es requerido' })
  rubro!: string;

  @IsString({ message: 'El logo debe ser un texto' })
  @IsOptional()
  logo?: string;

  @IsDateString({}, { message: 'La fecha de inicio de proyecto debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de inicio de proyecto es requerida' })
  inicio_proyecto!: Date;

  @IsDateString({}, { message: 'La fecha de firma de contrato debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de firma de contrato es requerida' })
  firma_contrato!: Date;

  @IsDateString({}, { message: 'La fecha de fin de contrato debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de fin de contrato es requerida' })
  fecha_fin_contrato!: Date;

  @IsDateString({}, { message: 'La fecha de fin proyectado debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de fin proyectado es requerida' })
  fin_proyectado!: Date;

  @IsDateString({}, { message: 'La fecha de fin real debe ser una fecha válida' })
  @IsOptional()
  fin_real?: Date;

  @IsEnum(SituacionProyecto, {
    message: 'La situación debe ser: En ejecución, Suspendido o Terminado'
  })
  @IsNotEmpty({ message: 'La situación es requerida' })
  situacion!: SituacionProyecto;
}
