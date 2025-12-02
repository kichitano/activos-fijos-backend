import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InventarioNuevo } from './InventarioNuevo';

/**
 * Entidad EquiposInformaticos - Detalles adicionales para activos tipo Equipos Informaticos
 */
@Entity('equipos_informaticos')
export class EquiposInformaticos {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  serie?: string;

  // Foreign Key
  @Column({ type: 'uuid', nullable: false, unique: true })
  inventario_nuevo_id!: string;

  // Relación
  @OneToOne(() => InventarioNuevo, (inventarioNuevo) => inventarioNuevo.equipos_informaticos)
  @JoinColumn({ name: 'inventario_nuevo_id' })
  inventario_nuevo!: InventarioNuevo;
}
