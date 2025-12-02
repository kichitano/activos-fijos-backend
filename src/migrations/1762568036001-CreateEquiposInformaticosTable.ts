import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEquiposInformaticosTable1762568036001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "equipos_informaticos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "marca" VARCHAR(100) NULL,
                "modelo" VARCHAR(100) NULL,
                "tipo" VARCHAR(100) NULL,
                "serie" VARCHAR(100) NULL,
                "inventario_nuevo_id" uuid NOT NULL,
                CONSTRAINT "PK_equipos_informaticos" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_equipos_informaticos_inventario_nuevo_id" UNIQUE ("inventario_nuevo_id"),
                CONSTRAINT "FK_equipos_informaticos_inventario_nuevo" FOREIGN KEY ("inventario_nuevo_id") 
                    REFERENCES "inventario_nuevo"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // Crear índice en la FK
        await queryRunner.query(`
            CREATE INDEX "IDX_equipos_informaticos_inventario_nuevo_id" ON "equipos_informaticos" ("inventario_nuevo_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_equipos_informaticos_inventario_nuevo_id"`);
        await queryRunner.query(`DROP TABLE "equipos_informaticos"`);
    }

}

