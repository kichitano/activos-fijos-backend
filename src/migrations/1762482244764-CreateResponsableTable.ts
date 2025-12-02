import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateResponsableTable1762482244764 implements MigrationInterface {
    name = 'CreateResponsableTable1762482244764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla responsables
        await queryRunner.query(`
            CREATE TABLE "responsables" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "cod_empresa" uuid NOT NULL,
                "cod_responsable" character varying(50) NOT NULL,
                "id_persona" uuid NOT NULL,
                "dni" character varying(20) NOT NULL,
                "cargo" character varying(100) NOT NULL,
                "nombre" character varying(255) NOT NULL,
                "correo" character varying(255),
                "telefono" character varying(20),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_responsables_cod_responsable" UNIQUE ("cod_responsable"),
                CONSTRAINT "PK_responsables" PRIMARY KEY ("id")
            )
        `);

        // Agregar foreign key a proyectos (cod_empresa)
        await queryRunner.query(`
            ALTER TABLE "responsables"
            ADD CONSTRAINT "FK_responsables_cod_empresa"
            FOREIGN KEY ("cod_empresa")
            REFERENCES "proyectos"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        // Agregar foreign key a users (id_persona)
        await queryRunner.query(`
            ALTER TABLE "responsables"
            ADD CONSTRAINT "FK_responsables_id_persona"
            FOREIGN KEY ("id_persona")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        // Crear índice en cod_responsable para búsquedas rápidas
        await queryRunner.query(`
            CREATE INDEX "IDX_responsables_cod_responsable"
            ON "responsables" ("cod_responsable")
        `);

        // Crear índice en cod_empresa para filtros
        await queryRunner.query(`
            CREATE INDEX "IDX_responsables_cod_empresa"
            ON "responsables" ("cod_empresa")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar índices
        await queryRunner.query(`DROP INDEX "public"."IDX_responsables_cod_empresa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_responsables_cod_responsable"`);

        // Eliminar foreign keys
        await queryRunner.query(`ALTER TABLE "responsables" DROP CONSTRAINT "FK_responsables_id_persona"`);
        await queryRunner.query(`ALTER TABLE "responsables" DROP CONSTRAINT "FK_responsables_cod_empresa"`);

        // Eliminar tabla
        await queryRunner.query(`DROP TABLE "responsables"`);
    }
}
