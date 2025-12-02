import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InventarioNuevo } from './InventarioNuevo';

/**
 * Entidad Mobiliario - Detalles adicionales para activos tipo Mobiliario
 */
@Entity('mobiliario')
export class Mobiliario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  material?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  largo?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ancho?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  alto?: number;

  // Foreign Key
  @Column({ type: 'uuid', nullable: false, unique: true })
  inventario_nuevo_id!: string;

  // Relación
  @OneToOne(() => InventarioNuevo, (inventarioNuevo) => inventarioNuevo.mobiliario)
  @JoinColumn({ name: 'inventario_nuevo_id' })
  inventario_nuevo!: InventarioNuevo;
}
