import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipoActivoFijoToInventario1762567020000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear enum para tipo_activo_fijo
        await queryRunner.query(`
            CREATE TYPE "tipo_activo_fijo" AS ENUM ('Mobiliario', 'Equipos Informaticos', 'Vehiculos')
        `);

        // Agregar columna tipo_activo_fijo a inventario
        await queryRunner.query(`
            ALTER TABLE "inventario"
            ADD COLUMN "tipo_activo_fijo" "tipo_activo_fijo" NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columna tipo_activo_fijo de inventario
        await queryRunner.query(`
            ALTER TABLE "inventario"
            DROP COLUMN "tipo_activo_fijo"
        `);

        // Eliminar tipo enum
        await queryRunner.query(`
            DROP TYPE "tipo_activo_fijo"
        `);
    }

}

