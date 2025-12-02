import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssociateResponsablesWithAreas1762482244766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar la nueva columna area_uuid
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ADD COLUMN "area_uuid" UUID;
    `);

    // 2. Copiar datos: migrar cod_empresa (proyecto_id) → area_uuid
    // Usamos la primera área de cada proyecto como destino
    await queryRunner.query(`
      UPDATE "responsables" r
      SET "area_uuid" = (
        SELECT a.id
        FROM "areas" a
        WHERE a.cod_proyecto = r.cod_empresa
        ORDER BY a.created_at ASC
        LIMIT 1
      )
      WHERE r.cod_empresa IS NOT NULL;
    `);

    // 3. Hacer area_uuid NOT NULL después de migrar datos
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ALTER COLUMN "area_uuid" SET NOT NULL;
    `);

    // 4. Agregar FK constraint hacia areas
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ADD CONSTRAINT "FK_responsables_area"
      FOREIGN KEY ("area_uuid") REFERENCES "areas"("id")
      ON DELETE CASCADE;
    `);

    // 5. Actualizar los cod_responsable con el nuevo formato {cod_area}-{numero}
    // Esto se hará en el backend al crear nuevos responsables
    // Los responsables existentes mantendrán su código actual para evitar romper referencias

    // 6. Eliminar la columna cod_empresa
    await queryRunner.query(`
      ALTER TABLE "responsables"
      DROP COLUMN "cod_empresa";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Restaurar la columna cod_empresa
    await queryRunner.query(`
      ALTER TABLE "responsables"
      ADD COLUMN "cod_empresa" UUID;
    `);

    // 2. Restaurar datos: migrar area_uuid → cod_empresa (proyecto de la área)
    await queryRunner.query(`
      UPDATE "responsables" r
      SET "cod_empresa" = (
        SELECT a.cod_proyecto
        FROM "areas" a
        WHERE a.id = r.area_uuid
      )
      WHERE r.area_uuid IS NOT NULL;
    `);

    // 3. Eliminar la FK constraint
    await queryRunner.query(`
      ALTER TABLE "responsables"
      DROP CONSTRAINT IF EXISTS "FK_responsables_area";
    `);

    // 4. Eliminar la columna area_uuid
    await queryRunner.query(`
      ALTER TABLE "responsables"
      DROP COLUMN "area_uuid";
    `);
  }
}
