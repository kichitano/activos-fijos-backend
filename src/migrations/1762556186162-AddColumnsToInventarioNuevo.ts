import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsToInventarioNuevo1762556186162 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar columna detalle_compuesto
        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            ADD COLUMN "detalle_compuesto" TEXT NULL
        `);

        // Agregar columna encontrado
        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            ADD COLUMN "encontrado" BOOLEAN NOT NULL DEFAULT false
        `);

        // Agregar columna cod_af_inventario
        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            ADD COLUMN "cod_af_inventario" VARCHAR(100) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columnas en orden inverso
        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            DROP COLUMN "cod_af_inventario"
        `);

        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            DROP COLUMN "encontrado"
        `);

        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            DROP COLUMN "detalle_compuesto"
        `);
    }

}
