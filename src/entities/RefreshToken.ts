import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

/**
 * Entidad RefreshToken - Tokens de refresco para autenticación
 */
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  user_id!: string;

  @Column({ type: 'varchar', length: 500, unique: true, nullable: false })
  token!: string;

  @Column({ type: 'jsonb', nullable: true })
  device_info?: object;

  @Column({ type: 'boolean', default: false })
  revoked!: boolean;

  @Column({ type: 'timestamp', nullable: false })
  expires_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  // Relación
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
