import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehiculosTable1762568060002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "vehiculos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "marca" VARCHAR(100) NULL,
                "modelo" VARCHAR(100) NULL,
                "tipo" VARCHAR(100) NULL,
                "numero_motor" VARCHAR(100) NULL,
                "numero_chasis" VARCHAR(100) NULL,
                "placa" VARCHAR(20) NULL,
                "anio" INTEGER NULL,
                "inventario_nuevo_id" uuid NOT NULL,
                CONSTRAINT "PK_vehiculos" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_vehiculos_inventario_nuevo_id" UNIQUE ("inventario_nuevo_id"),
                CONSTRAINT "FK_vehiculos_inventario_nuevo" FOREIGN KEY ("inventario_nuevo_id") 
                    REFERENCES "inventario_nuevo"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // Crear índice en la FK
        await queryRunner.query(`
            CREATE INDEX "IDX_vehiculos_inventario_nuevo_id" ON "vehiculos" ("inventario_nuevo_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_vehiculos_inventario_nuevo_id"`);
        await queryRunner.query(`DROP TABLE "vehiculos"`);
    }

}

