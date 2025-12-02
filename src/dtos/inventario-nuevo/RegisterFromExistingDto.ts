import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActivoEstado, TipoActivoFijo } from '../../entities/Inventario';

/**
 * DTO para datos de ubicación GPS
 */
export class LocationDataDto {
  @IsNumber()
  @IsNotEmpty({ message: 'La latitud es requerida' })
  lat!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'La longitud es requerida' })
  lng!: number;

  @IsString()
  @IsOptional()
  deviceInfo?: string;
}

/**
 * DTO para campos específicos de Mobiliario
 */
export class MobiliarioFieldsDto {
  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  largo?: number;

  @IsNumber()
  @IsOptional()
  ancho?: number;

  @IsNumber()
  @IsOptional()
  alto?: number;
}

/**
 * DTO para campos específicos de Equipos Informaticos
 */
export class EquiposInformaticosFieldsDto {
  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  serie?: string;
}

/**
 * DTO para campos específicos de Vehiculos
 */
export class VehiculosFieldsDto {
  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  numero_motor?: string;

  @IsString()
  @IsOptional()
  numero_chasis?: string;

  @IsString()
  @IsOptional()
  placa?: string;

  @IsNumber()
  @IsOptional()
  anio?: number;
}

/**
 * DTO para registrar activo desde uno existente en inventario
 * Incluye datos editables + datos específicos del tipo + datos de ubicación
 */
export class RegisterFromExistingDto {
  // Datos básicos requeridos
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
  cod_patrimonial?: string;

  // NOTA: cod_etiqueta NO se incluye aquí porque:
  // - En CREATE: Se genera automáticamente en el backend
  // - En UPDATE: NO debe cambiar nunca (es inmutable una vez asignado)

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  descripcion!: string;

  @IsEnum(TipoActivoFijo, {
    message: 'El tipo de activo fijo debe ser Mobiliario, Equipos Informaticos o Vehiculos'
  })
  @IsOptional()
  tipo_activo_fijo?: TipoActivoFijo;

  @IsEnum(ActivoEstado, {
    message: 'El estado debe ser BUENO, REGULAR_BUENO, REGULAR_MALO o MALO'
  })
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

  // Inventario origen (opcional - puede ser null para activos nuevos sin origen)
  @IsUUID('4', { message: 'El inventario origen debe ser un UUID válido' })
  @IsOptional()
  inventario_origen_id?: string;

  // Datos de ubicación GPS (requeridos)
  @ValidateNested()
  @Type(() => LocationDataDto)
  @IsNotEmpty({ message: 'Los datos de ubicación son requeridos' })
  location!: LocationDataDto;

  // Campos específicos del tipo de activo (opcionales según tipo)
  @ValidateNested()
  @Type(() => MobiliarioFieldsDto)
  @IsOptional()
  mobiliario_fields?: MobiliarioFieldsDto;

  @ValidateNested()
  @Type(() => EquiposInformaticosFieldsDto)
  @IsOptional()
  equipos_informaticos_fields?: EquiposInformaticosFieldsDto;

  @ValidateNested()
  @Type(() => VehiculosFieldsDto)
  @IsOptional()
  vehiculos_fields?: VehiculosFieldsDto;
}
