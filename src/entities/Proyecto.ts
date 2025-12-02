import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';

/**
 * Enum para situación del proyecto
 */
export enum SituacionProyecto {
  EN_EJECUCION = 'En ejecución',
  SUSPENDIDO = 'Suspendido',
  TERMINADO = 'Terminado',
}

/**
 * Entidad Proyecto - Proyectos de la empresa
 */
@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  cod_proyecto!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  empresa!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  razon_social!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  rubro!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo?: string;

  @Column({ type: 'date', nullable: false })
  inicio_proyecto!: Date;

  @Column({ type: 'date', nullable: false })
  firma_contrato!: Date;

  @Column({ type: 'date', nullable: false })
  fecha_fin_contrato!: Date;

  @Column({ type: 'date', nullable: false })
  fin_proyectado!: Date;

  @Column({ type: 'date', nullable: true })
  fin_real?: Date;

  @Column({
    type: 'enum',
    enum: SituacionProyecto,
    nullable: false,
  })
  situacion!: SituacionProyecto;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => User, (user) => user.proyecto)
  users?: User[];
}
