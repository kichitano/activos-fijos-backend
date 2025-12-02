import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSucursalesTable1762397814152 implements MigrationInterface {
    name = 'AddSucursalesTable1762397814152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create sucursales table
        await queryRunner.query(`CREATE TABLE "sucursales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cod_proyecto" uuid NOT NULL, "cod_sucursal" character varying(100) NOT NULL, "nombre_sucursal" character varying(255) NOT NULL, "departamento" character varying(100) NOT NULL, "provincia" character varying(100) NOT NULL, "distrito" character varying(100) NOT NULL, "cod_responsable" character varying(50) NOT NULL, "direccion" text, "telefono" character varying(20), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_752829709ae402c6dc0b7ecccfe" UNIQUE ("cod_sucursal"), CONSTRAINT "UQ_990c8b1ba1cf85ad58fe2826edc" UNIQUE ("cod_responsable"), CONSTRAINT "PK_c2232960c9e458db5b18d35eeba" PRIMARY KEY ("id"))`);

        // Add foreign key constraint
        await queryRunner.query(`ALTER TABLE "sucursales" ADD CONSTRAINT "FK_0c20d8980133090f95b57b57fe3" FOREIGN KEY ("cod_proyecto") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.query(`ALTER TABLE "sucursales" DROP CONSTRAINT "FK_0c20d8980133090f95b57b57fe3"`);

        // Drop sucursales table
        await queryRunner.query(`DROP TABLE "sucursales"`);
    }

}
