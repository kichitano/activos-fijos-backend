import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Area } from './Area';

/**
 * Enum para cargo de responsable
 */
export enum CargoResponsable {
  JEFE_LOGISTICA = 'Jefe Logistica',
  JEFE_CONTROL_PATRIMONIAL = 'Jefe Control Patrimonial',
  JEFE_CONTABILIDAD = 'Jefe Contabilidad',
  ADMINISTRADOR_AGENCIA = 'Administrador de Agencia',
}

/**
 * Entidad Responsable
 * Representa un responsable de área/activos con sus datos de contacto
 */
@Entity('responsables')
export class Responsable {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  area_uuid!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  cod_responsable!: string;

  @Column({ type: 'varchar', length: 8, nullable: false })
  dni!: string;

  @Column({
    type: 'enum',
    enum: CargoResponsable,
    nullable: false,
  })
  cargo!: CargoResponsable;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correo?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => Area, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'area_uuid' })
  area!: Area;

  @BeforeInsert()
  validateRequiredFields() {
    if (!this.cod_responsable) {
      throw new Error('cod_responsable debe ser generado antes de insertar');
    }
    // Validar DNI: debe ser exactamente 8 dígitos numéricos
    if (!/^\d{8}$/.test(this.dni)) {
      throw new Error('DNI debe contener exactamente 8 dígitos numéricos');
    }
  }
}
