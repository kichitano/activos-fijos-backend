import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProyectosTable1762380800000 implements MigrationInterface {
  name = 'CreateProyectosTable1762380800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear enum para situación
    await queryRunner.query(`
      CREATE TYPE "public"."proyectos_situacion_enum" AS ENUM(
        'En ejecución',
        'Suspendido',
        'Terminado'
      )
    `);

    // Crear tabla proyectos
    await queryRunner.query(`
      CREATE TABLE "proyectos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "cod_proyecto" character varying(50) NOT NULL,
        "empresa" character varying(255) NOT NULL,
        "razon_social" character varying(255) NOT NULL,
        "rubro" character varying(255) NOT NULL,
        "logo" character varying(500),
        "inicio_proyecto" date NOT NULL,
        "firma_contrato" date NOT NULL,
        "fecha_fin_contrato" date NOT NULL,
        "fin_proyectado" date NOT NULL,
        "fin_real" date,
        "situacion" "public"."proyectos_situacion_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_proyectos_cod_proyecto" UNIQUE ("cod_proyecto"),
        CONSTRAINT "PK_proyectos" PRIMARY KEY ("id")
      )
    `);

    // Crear índice para búsqueda por código
    await queryRunner.query(`
      CREATE INDEX "IDX_proyectos_cod_proyecto" ON "proyectos" ("cod_proyecto")
    `);

    // Crear índice para búsqueda por situación
    await queryRunner.query(`
      CREATE INDEX "IDX_proyectos_situacion" ON "proyectos" ("situacion")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX "public"."IDX_proyectos_situacion"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_proyectos_cod_proyecto"`);

    // Eliminar tabla
    await queryRunner.query(`DROP TABLE "proyectos"`);

    // Eliminar enum
    await queryRunner.query(`DROP TYPE "public"."proyectos_situacion_enum"`);
  }
}
