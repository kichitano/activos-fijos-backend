import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InventarioNuevo } from './InventarioNuevo';
import { RegistroAuditoriaUbicacion } from './RegistroAuditoriaUbicacion';
import { Proyecto } from './Proyecto';
import { JoinColumn, ManyToOne } from 'typeorm';

/**
 * Enum para roles de usuario
 */
export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  COORDINADOR = 'COORDINADOR',
  REGISTRADOR = 'REGISTRADOR',
}

/**
 * Entidad User - Usuarios del sistema
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  dni!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correo1?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correo2?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  rol!: UserRole;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  username!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password_hash!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @Column({ type: 'boolean', default: true })
  must_change_password!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relaciones
  @OneToMany(() => InventarioNuevo, (inventario) => inventario.created_by_user)
  inventarios_creados?: InventarioNuevo[];

  @OneToMany(() => RegistroAuditoriaUbicacion, (registro) => registro.user)
  auditorias?: RegistroAuditoriaUbicacion[];

  @Column({ type: 'uuid', nullable: true })
  proyecto_id?: string;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.users, { nullable: true })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto?: Proyecto;
}
