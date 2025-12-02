import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsToInventario1762564355068 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar columna detalle_compuesto
        await queryRunner.query(`
            ALTER TABLE "inventario"
            ADD COLUMN "detalle_compuesto" TEXT NULL
        `);

        // Agregar columna encontrado
        await queryRunner.query(`
            ALTER TABLE "inventario"
            ADD COLUMN "encontrado" BOOLEAN NOT NULL DEFAULT false
        `);

        // Agregar columna cod_af_inventario
        await queryRunner.query(`
            ALTER TABLE "inventario"
            ADD COLUMN "cod_af_inventario" VARCHAR(100) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columnas en orden inverso
        await queryRunner.query(`
            ALTER TABLE "inventario"
            DROP COLUMN "cod_af_inventario"
        `);

        await queryRunner.query(`
            ALTER TABLE "inventario"
            DROP COLUMN "encontrado"
        `);

        await queryRunner.query(`
            ALTER TABLE "inventario"
            DROP COLUMN "detalle_compuesto"
        `);
    }

}
