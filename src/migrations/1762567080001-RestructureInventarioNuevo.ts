import { MigrationInterface, QueryRunner } from "typeorm";

export class RestructureInventarioNuevo1762567080001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear enum para registro_inventario
        await queryRunner.query(`
            CREATE TYPE "registro_inventario" AS ENUM (
                'AF Conciliado',
                'Nuevo AF',
                'AF con código patrimonial no encontrado en la data',
                'AF con código patrimonial en mal estado'
            )
        `);

        // Agregar nuevas columnas
        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            ADD COLUMN "tipo_activo_fijo" "tipo_activo_fijo" NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            ADD COLUMN "registro_inventario" "registro_inventario" NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            ADD COLUMN "observaciones" TEXT NULL
        `);

        // Eliminar columnas obsoletas
        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            DROP COLUMN IF EXISTS "material",
            DROP COLUMN IF EXISTS "marca",
            DROP COLUMN IF EXISTS "modelo",
            DROP COLUMN IF EXISTS "serie",
            DROP COLUMN IF EXISTS "color",
            DROP COLUMN IF EXISTS "largo",
            DROP COLUMN IF EXISTS "ancho",
            DROP COLUMN IF EXISTS "profundo",
            DROP COLUMN IF EXISTS "pulgadas",
            DROP COLUMN IF EXISTS "ubicacion",
            DROP COLUMN IF EXISTS "encontrado",
            DROP COLUMN IF EXISTS "cta_contable",
            DROP COLUMN IF EXISTS "guia_remision",
            DROP COLUMN IF EXISTS "cod_factura",
            DROP COLUMN IF EXISTS "fecha_compra",
            DROP COLUMN IF EXISTS "valor_activo",
            DROP COLUMN IF EXISTS "observaciones1",
            DROP COLUMN IF EXISTS "observaciones2",
            DROP COLUMN IF EXISTS "observaciones3"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir: agregar columnas eliminadas
        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            ADD COLUMN "material" VARCHAR(100) NULL,
            ADD COLUMN "marca" VARCHAR(100) NULL,
            ADD COLUMN "modelo" VARCHAR(100) NULL,
            ADD COLUMN "serie" VARCHAR(100) NULL,
            ADD COLUMN "color" VARCHAR(50) NULL,
            ADD COLUMN "largo" DECIMAL(10,2) NULL,
            ADD COLUMN "ancho" DECIMAL(10,2) NULL,
            ADD COLUMN "profundo" DECIMAL(10,2) NULL,
            ADD COLUMN "pulgadas" DECIMAL(10,2) NULL,
            ADD COLUMN "ubicacion" VARCHAR(200) NULL,
            ADD COLUMN "encontrado" BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN "cta_contable" VARCHAR(100) NULL,
            ADD COLUMN "guia_remision" VARCHAR(100) NULL,
            ADD COLUMN "cod_factura" VARCHAR(100) NULL,
            ADD COLUMN "fecha_compra" DATE NULL,
            ADD COLUMN "valor_activo" DECIMAL(15,2) NULL,
            ADD COLUMN "observaciones1" TEXT NOT NULL,
            ADD COLUMN "observaciones2" TEXT NULL,
            ADD COLUMN "observaciones3" TEXT NULL
        `);

        // Eliminar nuevas columnas
        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            DROP COLUMN "observaciones"
        `);

        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            DROP COLUMN "registro_inventario"
        `);

        await queryRunner.query(`
            ALTER TABLE "inventario_nuevo"
            DROP COLUMN "tipo_activo_fijo"
        `);

        // Eliminar enum registro_inventario
        await queryRunner.query(`
            DROP TYPE "registro_inventario"
        `);
    }

}

