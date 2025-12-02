import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Proyecto } from './Proyecto';

/**
 * Entidad Sucursal - Sucursales de proyectos
 */
@Entity('sucursales')
export class Sucursal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  cod_proyecto!: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  cod_sucursal!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre_sucursal!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  departamento!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  provincia!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  distrito!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  cod_responsable!: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relación ManyToOne con Proyecto
  @ManyToOne(() => Proyecto, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cod_proyecto' })
  proyecto!: Proyecto;

  /**
   * Hook para validar que cod_sucursal y cod_responsable estén asignados
   * (serán autogenerados en el servicio)
   */
  @BeforeInsert()
  validateRequiredFields() {
    if (!this.cod_sucursal) {
      throw new Error('cod_sucursal debe ser generado antes de insertar');
    }
    if (!this.cod_responsable) {
      throw new Error('cod_responsable debe ser generado antes de insertar');
    }
  }
}
