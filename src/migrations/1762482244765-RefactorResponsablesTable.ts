import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorResponsablesTable1762482244765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear el enum cargo_responsable si no existe
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE cargo_responsable AS ENUM (
          'Jefe Logistica',
          'Jefe Control Patrimonial',
          'Jefe Contabilidad',
          'Administrador de Agencia'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Eliminar la restricción de FK con users (id_persona)
    await queryRunner.query(`
      ALTER TABLE "responsables"
      DROP CONSTRAINT IF EXISTS "FK_responsable_persona";
    `);

    // 3. Eliminar la columna id_persona
    await queryRunner.query(`
      ALTER TABLE "responsables"
      DROP COLUMN IF EXISTS "id_persona";
    `);

    // 4. Modificar la columna dni para que sea VARCHAR(8)
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ALTER COLUMN "dni" TYPE VARCHAR(8);
    `);

    // 5. Cambiar la columna cargo de VARCHAR a ENUM
    // Primero crear una columna temporal con el enum
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ADD COLUMN "cargo_temp" cargo_responsable;
    `);

    // Migrar datos existentes (si los hay) - usar un valor por defecto
    await queryRunner.query(`
      UPDATE "responsables"
      SET "cargo_temp" = 'Jefe Logistica'
      WHERE "cargo_temp" IS NULL;
    `);

    // Eliminar la columna antigua
    await queryRunner.query(`
      ALTER TABLE "responsables"
      DROP COLUMN "cargo";
    `);

    // Renombrar la columna temporal
    await queryRunner.query(`
      ALTER TABLE "responsables"
      RENAME COLUMN "cargo_temp" TO "cargo";
    `);

    // Hacer la columna cargo NOT NULL
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ALTER COLUMN "cargo" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Revertir la columna cargo a VARCHAR
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ADD COLUMN "cargo_temp" VARCHAR(100);
    `);

    await queryRunner.query(`
      UPDATE "responsables"
      SET "cargo_temp" = "cargo"::text;
    `);

    await queryRunner.query(`
      ALTER TABLE "responsables"
      DROP COLUMN "cargo";
    `);

    await queryRunner.query(`
      ALTER TABLE "responsables"
      RENAME COLUMN "cargo_temp" TO "cargo";
    `);

    await queryRunner.query(`
      ALTER TABLE "responsables"
      ALTER COLUMN "cargo" SET NOT NULL;
    `);

    // 2. Revertir la columna dni a VARCHAR(20)
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ALTER COLUMN "dni" TYPE VARCHAR(20);
    `);

    // 3. Agregar la columna id_persona de vuelta
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ADD COLUMN "id_persona" UUID;
    `);

    // 4. Eliminar el enum cargo_responsable
    await queryRunner.query(`
      DROP TYPE IF EXISTS cargo_responsable;
    `);

    // Nota: No podemos restaurar la FK automáticamente ya que no tenemos los datos originales
    // El usuario deberá limpiar manualmente la tabla si hace rollback
  }
}
