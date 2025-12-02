import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { InventarioNuevo } from './InventarioNuevo';

/**
 * Enum para estado del activo
 */
export enum ActivoEstado {
  BUENO = 'BUENO',
  REGULAR_BUENO = 'REGULAR_BUENO',
  REGULAR_MALO = 'REGULAR_MALO',
  MALO = 'MALO',
}

/**
 * Enum para estado de reporte del activo
 */
export enum EstadoReporte {
  FALTANTE = 'FALTANTE',       // No tiene registro en inventario_nuevo
  ENCONTRADO = 'ENCONTRADO',   // Ya tiene registro en inventario_nuevo
  NUEVO = 'NUEVO',             // Registro manual sin origen
  SOBRANTE = 'SOBRANTE',       // Activo sin origen (estado futuro de NUEVO)
}

/**
 * Enum para sucursales
 */
export enum SucursalEnum {
  CAPANIQUE = 'CAPANIQUE',
  SAN_MARTIN = 'SAN_MARTIN',
  POSTGRADO = 'POSTGRADO',
}

/**
 * Enum para áreas
 */
export enum AreaEnum {
  LOGISTICA = 'LOGISTICA',
  OPERACIONES = 'OPERACIONES',
  CONTABILIDAD = 'CONTABILIDAD',
}

/**
 * Enum para tipo de activo fijo
 */
export enum TipoActivoFijo {
  MOBILIARIO = 'Mobiliario',
  EQUIPOS_INFORMATICOS = 'Equipos Informaticos',
  VEHICULOS = 'Vehiculos',
}

/**
 * Enum para registro de inventario
 */
export enum RegistroInventario {
  AF_CONCILIADO = 'AF Conciliado',
  NUEVO_AF = 'Nuevo AF',
  AF_COD_PATRIMONIAL_NO_ENCONTRADO = 'AF con código patrimonial no encontrado en la data',
  AF_COD_PATRIMONIAL_MAL_ESTADO = 'AF con código patrimonial en mal estado',
}

/**
 * Entidad Inventario - Inventario histórico (read-only desde app)
 * Esta tabla se poblará mediante importación CSV
 */
@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cod_proyecto?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cod_sucursal?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cod_area?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cod_af?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_patrimonial?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_etiqueta?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({
    type: 'enum',
    enum: TipoActivoFijo,
    nullable: true,
  })
  tipo_activo_fijo?: TipoActivoFijo;

  @Column({ type: 'varchar', length: 100, nullable: true })
  material?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  serie?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  largo?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ancho?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  profundo?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pulgadas?: number;

  @Column({
    type: 'enum',
    enum: ActivoEstado,
    nullable: true,
  })
  estado?: ActivoEstado;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_responsable?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  ubicacion?: string;

  @Column({ type: 'boolean', nullable: true })
  compuesto?: boolean;

  @Column({ type: 'text', nullable: true })
  detalle_compuesto?: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  encontrado!: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_af_inventario?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cta_contable?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  guia_remision?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_factura?: string;

  @Column({ type: 'date', nullable: true })
  fecha_compra?: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  valor_activo?: number;

  @Column({ type: 'text', nullable: true })
  observaciones1?: string;

  @Column({ type: 'text', nullable: true })
  observaciones2?: string;

  @Column({ type: 'text', nullable: true })
  observaciones3?: string;

  @CreateDateColumn()
  created_at!: Date;

  // Relación: Un inventario puede tener muchos registros nuevos basados en él
  @OneToMany(() => InventarioNuevo, (inventarioNuevo) => inventarioNuevo.inventario_origen)
  inventarios_derivados?: InventarioNuevo[];
}
