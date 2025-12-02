import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAreasTable1762444620821 implements MigrationInterface {
    name = 'CreateAreasTable1762444620821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla areas
        await queryRunner.query(`
            CREATE TABLE "areas" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "cod_proyecto" uuid NOT NULL,
                "cod_sucursal" uuid NOT NULL,
                "cod_area" character varying(50) NOT NULL,
                "area" character varying(255) NOT NULL,
                "cod_responsable" character varying(50) NOT NULL,
                "telefono" character varying(20),
                "anexo" character varying(20),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_areas_cod_area" UNIQUE ("cod_area"),
                CONSTRAINT "UQ_areas_cod_responsable" UNIQUE ("cod_responsable"),
                CONSTRAINT "PK_areas" PRIMARY KEY ("id")
            )
        `);

        // Crear índices
        await queryRunner.query(`CREATE INDEX "IDX_areas_cod_proyecto" ON "areas" ("cod_proyecto")`);
        await queryRunner.query(`CREATE INDEX "IDX_areas_cod_sucursal" ON "areas" ("cod_sucursal")`);
        await queryRunner.query(`CREATE INDEX "IDX_areas_cod_area" ON "areas" ("cod_area")`);

        // Agregar foreign keys
        await queryRunner.query(`
            ALTER TABLE "areas"
            ADD CONSTRAINT "FK_areas_cod_proyecto"
            FOREIGN KEY ("cod_proyecto")
            REFERENCES "proyectos"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "areas"
            ADD CONSTRAINT "FK_areas_cod_sucursal"
            FOREIGN KEY ("cod_sucursal")
            REFERENCES "sucursales"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar foreign keys
        await queryRunner.query(`ALTER TABLE "areas" DROP CONSTRAINT "FK_areas_cod_sucursal"`);
        await queryRunner.query(`ALTER TABLE "areas" DROP CONSTRAINT "FK_areas_cod_proyecto"`);

        // Eliminar índices
        await queryRunner.query(`DROP INDEX "public"."IDX_areas_cod_area"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_areas_cod_sucursal"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_areas_cod_proyecto"`);

        // Eliminar tabla
        await queryRunner.query(`DROP TABLE "areas"`);
    }
}
