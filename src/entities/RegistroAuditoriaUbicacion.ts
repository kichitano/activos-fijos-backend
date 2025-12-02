import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { InventarioNuevo } from './InventarioNuevo';

/**
 * Entidad RegistroAuditoriaUbicacion - Auditoría de ubicación GPS para cada registro
 */
@Entity('registro_auditoria_ubicacion')
export class RegistroAuditoriaUbicacion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  inventario_nuevo_id!: string;

  @Column({ type: 'uuid', nullable: false })
  user_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
  lat!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
  lng!: number;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ type: 'jsonb', nullable: true })
  device_info?: object;

  // Relaciones
  @ManyToOne(() => InventarioNuevo, (inventario) => inventario.auditorias)
  @JoinColumn({ name: 'inventario_nuevo_id' })
  inventario_nuevo!: InventarioNuevo;

  @ManyToOne(() => User, (user) => user.auditorias)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
