import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InventarioNuevo } from './InventarioNuevo';

/**
 * Entidad Vehiculos - Detalles adicionales para activos tipo Vehiculos
 */
@Entity('vehiculos')
export class Vehiculos {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  numero_motor?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  numero_chasis?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  placa?: string;

  @Column({ type: 'int', nullable: true })
  anio?: number;

  // Foreign Key
  @Column({ type: 'uuid', nullable: false, unique: true })
  inventario_nuevo_id!: string;

  // Relación
  @OneToOne(() => InventarioNuevo, (inventarioNuevo) => inventarioNuevo.vehiculo)
  @JoinColumn({ name: 'inventario_nuevo_id' })
  inventario_nuevo!: InventarioNuevo;
}
