import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './User';
import { Inventario, ActivoEstado, TipoActivoFijo, RegistroInventario } from './Inventario';
import { RegistroAuditoriaUbicacion } from './RegistroAuditoriaUbicacion';
import { Mobiliario } from './Mobiliario';
import { EquiposInformaticos } from './EquiposInformaticos';
import { Vehiculos } from './Vehiculos';

/**
 * Entidad InventarioNuevo - Nuevos registros de activos creados desde la app
 */
@Entity('inventario_nuevo')
export class InventarioNuevo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  cod_proyecto!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  cod_sucursal!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  cod_area!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_af_inventario?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_patrimonial?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_etiqueta?: string;

  @Column({ type: 'text', nullable: false })
  descripcion!: string;

  @Column({
    type: 'enum',
    enum: TipoActivoFijo,
    nullable: true,
  })
  tipo_activo_fijo?: TipoActivoFijo;

  @Column({
    type: 'enum',
    enum: ActivoEstado,
    nullable: true,
  })
  estado?: ActivoEstado;

  @Column({ type: 'varchar', length: 100, nullable: false })
  cod_responsable!: string;

  @Column({ type: 'boolean', nullable: true })
  compuesto?: boolean;

  @Column({ type: 'text', nullable: true })
  detalle_compuesto?: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  // Foreign Keys
  @Column({ type: 'uuid', nullable: false })
  created_by!: string;

  @Column({ type: 'uuid', nullable: true })
  inventario_origen_id?: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({
    type: 'enum',
    enum: RegistroInventario,
    nullable: true,
  })
  registro_inventario?: RegistroInventario;

  // Relaciones
  @ManyToOne(() => Inventario, (inventario) => inventario.inventarios_derivados)
  @JoinColumn({ name: 'inventario_origen_id' })
  inventario_origen?: Inventario;

  @ManyToOne(() => User, (user) => user.inventarios_creados)
  @JoinColumn({ name: 'created_by' })
  created_by_user!: User;

  @OneToMany(() => RegistroAuditoriaUbicacion, (registro) => registro.inventario_nuevo)
  auditorias?: RegistroAuditoriaUbicacion[];

  @OneToOne(() => Mobiliario, (mobiliario) => mobiliario.inventario_nuevo)
  mobiliario?: Mobiliario;

  @OneToOne(() => EquiposInformaticos, (equipos) => equipos.inventario_nuevo)
  equipos_informaticos?: EquiposInformaticos;

  @OneToOne(() => Vehiculos, (vehiculo) => vehiculo.inventario_nuevo)
  vehiculo?: Vehiculos;
}
