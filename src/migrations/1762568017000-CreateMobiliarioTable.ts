import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMobiliarioTable1762568017000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "mobiliario" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "marca" VARCHAR(100) NULL,
                "modelo" VARCHAR(100) NULL,
                "tipo" VARCHAR(100) NULL,
                "material" VARCHAR(100) NULL,
                "color" VARCHAR(50) NULL,
                "largo" DECIMAL(10,2) NULL,
                "ancho" DECIMAL(10,2) NULL,
                "alto" DECIMAL(10,2) NULL,
                "inventario_nuevo_id" uuid NOT NULL,
                CONSTRAINT "PK_mobiliario" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_mobiliario_inventario_nuevo_id" UNIQUE ("inventario_nuevo_id"),
                CONSTRAINT "FK_mobiliario_inventario_nuevo" FOREIGN KEY ("inventario_nuevo_id") 
                    REFERENCES "inventario_nuevo"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // Crear índice en la FK
        await queryRunner.query(`
            CREATE INDEX "IDX_mobiliario_inventario_nuevo_id" ON "mobiliario" ("inventario_nuevo_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_mobiliario_inventario_nuevo_id"`);
        await queryRunner.query(`DROP TABLE "mobiliario"`);
    }

}

