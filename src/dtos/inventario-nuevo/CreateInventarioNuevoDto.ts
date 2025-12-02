import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ActivoEstado, TipoActivoFijo, RegistroInventario } from '../../entities/Inventario';

/**
 * DTO para crear un nuevo registro de activo fijo
 */
export class CreateInventarioNuevoDto {
  @IsString()
  @IsNotEmpty({ message: 'El código de proyecto es requerido' })
  cod_proyecto!: string;

  @IsString()
  @IsNotEmpty({ message: 'La sucursal es requerida' })
  cod_sucursal!: string;

  @IsString()
  @IsNotEmpty({ message: 'El área es requerida' })
  cod_area!: string;

  @IsString()
  @IsOptional()
  cod_af_inventario?: string;

  @IsString()
  @IsOptional()
  cod_patrimonial?: string;

  @IsString()
  @IsOptional()
  cod_etiqueta?: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  descripcion!: string;

  @IsEnum(TipoActivoFijo, { message: 'El tipo de activo fijo debe ser Mobiliario, Equipos Informaticos o Vehiculos' })
  @IsOptional()
  tipo_activo_fijo?: TipoActivoFijo;

  @IsEnum(ActivoEstado, { message: 'El estado debe ser BUENO, REGULAR_BUENO, REGULAR_MALO o MALO' })
  @IsOptional()
  estado?: ActivoEstado;

  @IsString()
  @IsNotEmpty({ message: 'El código de responsable es requerido' })
  cod_responsable!: string;

  @IsBoolean()
  @IsOptional()
  compuesto?: boolean;

  @IsString()
  @IsOptional()
  detalle_compuesto?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsUUID('4', { message: 'El inventario origen debe ser un UUID válido' })
  @IsOptional()
  inventario_origen_id?: string;

  @IsEnum(RegistroInventario, { message: 'El registro de inventario debe ser un valor válido' })
  @IsOptional()
  registro_inventario?: RegistroInventario;
}
