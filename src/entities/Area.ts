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
import { Sucursal } from './Sucursal';

/**
 * Entidad Area - Areas de sucursales
 */
@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  cod_proyecto!: string;

  @Column({ type: 'uuid', nullable: false })
  cod_sucursal!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  cod_area!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  area!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  cod_responsable!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  anexo?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relación ManyToOne con Proyecto
  @ManyToOne(() => Proyecto, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cod_proyecto' })
  proyecto!: Proyecto;

  // Relación ManyToOne con Sucursal
  @ManyToOne(() => Sucursal, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cod_sucursal' })
  sucursal!: Sucursal;

  /**
   * Hook para validar que cod_area y cod_responsable estén asignados
   * (serán autogenerados en el servicio)
   */
  @BeforeInsert()
  validateRequiredFields() {
    if (!this.cod_area) {
      throw new Error('cod_area debe ser generado antes de insertar');
    }
    if (!this.cod_responsable) {
      throw new Error('cod_responsable debe ser generado antes de insertar');
    }
  }
}
