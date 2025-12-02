import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración previa: Creación de tipos ENUM necesarios
 *
 * Esta migración debe ejecutarse ANTES de InitialSchema
 */
export class CreateEnumTypes1730174300000 implements MigrationInterface {
  name = 'CreateEnumTypes1730174300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear extensión para UUID (si no existe)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Crear tipo ENUM para roles de usuario
    await queryRunner.query(`
      CREATE TYPE user_role AS ENUM (
        'ADMINISTRADOR',
        'COORDINADOR',
        'REGISTRADOR'
      )
    `);

    // Crear tipo ENUM para estado de activos
    await queryRunner.query(`
      CREATE TYPE activo_estado AS ENUM (
        'BUENO',
        'REGULAR_BUENO',
        'REGULAR_MALO',
        'MALO'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tipos ENUM en orden inverso
    await queryRunner.query(`DROP TYPE IF EXISTS activo_estado`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
  }
}
