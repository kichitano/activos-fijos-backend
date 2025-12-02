import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración inicial: Creación de todas las tablas del sistema
 */
export class InitialSchema1730174400000 implements MigrationInterface {
  name = 'InitialSchema1730174400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========================================
    // Tabla: users
    // ========================================
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "dni" varchar(20) NOT NULL,
        "nombre" varchar(255) NOT NULL,
        "direccion" varchar(500),
        "celular" varchar(20),
        "correo1" varchar(255),
        "correo2" varchar(255),
        "rol" user_role NOT NULL,
        "username" varchar(100) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "activo" boolean NOT NULL DEFAULT true,
        "must_change_password" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_dni" UNIQUE ("dni"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username")
      )
    `);

    // Índices para users
    await queryRunner.query(`
      CREATE INDEX "IDX_users_dni" ON "users" ("dni")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_users_username" ON "users" ("username")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_users_rol" ON "users" ("rol")
    `);

    // ========================================
    // Tabla: inventario (histórico)
    // ========================================
    await queryRunner.query(`
      CREATE TABLE "inventario" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "cod_proyecto" varchar(50),
        "cod_sucursal" varchar(50),
        "cod_area" varchar(50),
        "cod_af" varchar(50),
        "cod_patrimonial" varchar(100),
        "cod_etiqueta" varchar(100),
        "descripcion" text,
        "material" varchar(100),
        "marca" varchar(100),
        "modelo" varchar(100),
        "serie" varchar(100),
        "color" varchar(50),
        "largo" numeric(10,2),
        "ancho" numeric(10,2),
        "profundo" numeric(10,2),
        "pulgadas" numeric(10,2),
        "estado" activo_estado,
        "cod_responsable" varchar(100),
        "ubicacion" varchar(200),
        "compuesto" boolean,
        "cta_contable" varchar(100),
        "guia_remision" varchar(100),
        "cod_factura" varchar(100),
        "fecha_compra" date,
        "valor_activo" numeric(15,2),
        "observaciones1" text,
        "observaciones2" text,
        "observaciones3" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventario" PRIMARY KEY ("id")
      )
    `);

    // Índices para inventario (búsqueda frecuente)
    await queryRunner.query(`
      CREATE INDEX "IDX_inventario_cod_patrimonial" ON "inventario" ("cod_patrimonial")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_inventario_cod_etiqueta" ON "inventario" ("cod_etiqueta")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_inventario_cod_af" ON "inventario" ("cod_af")
    `);

    // ========================================
    // Tabla: inventario_nuevo
    // ========================================
    await queryRunner.query(`
      CREATE TABLE "inventario_nuevo" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "cod_proyecto" varchar(50) NOT NULL,
        "cod_sucursal" varchar(50) NOT NULL,
        "cod_area" varchar(50) NOT NULL,
        "cod_patrimonial" varchar(100),
        "cod_etiqueta" varchar(100),
        "descripcion" text NOT NULL,
        "material" varchar(100),
        "marca" varchar(100),
        "modelo" varchar(100),
        "serie" varchar(100),
        "color" varchar(50),
        "largo" numeric(10,2),
        "ancho" numeric(10,2),
        "profundo" numeric(10,2),
        "pulgadas" numeric(10,2),
        "estado" activo_estado,
        "cod_responsable" varchar(100) NOT NULL,
        "ubicacion" varchar(200),
        "compuesto" boolean,
        "cta_contable" varchar(100),
        "guia_remision" varchar(100),
        "cod_factura" varchar(100),
        "fecha_compra" date,
        "valor_activo" numeric(15,2),
        "observaciones1" text NOT NULL,
        "observaciones2" text,
        "observaciones3" text,
        "inventario_origen_id" uuid,
        "created_by" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventario_nuevo" PRIMARY KEY ("id")
      )
    `);

    // Índices para inventario_nuevo
    await queryRunner.query(`
      CREATE INDEX "IDX_inventario_nuevo_cod_patrimonial" ON "inventario_nuevo" ("cod_patrimonial")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_inventario_nuevo_cod_etiqueta" ON "inventario_nuevo" ("cod_etiqueta")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_inventario_nuevo_created_by" ON "inventario_nuevo" ("created_by")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_inventario_nuevo_created_at" ON "inventario_nuevo" ("created_at")
    `);

    // Foreign Keys para inventario_nuevo
    await queryRunner.query(`
      ALTER TABLE "inventario_nuevo"
      ADD CONSTRAINT "FK_inventario_nuevo_inventario_origen"
      FOREIGN KEY ("inventario_origen_id") REFERENCES "inventario"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "inventario_nuevo"
      ADD CONSTRAINT "FK_inventario_nuevo_created_by"
      FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT
    `);

    // ========================================
    // Tabla: registro_auditoria_ubicacion
    // ========================================
    await queryRunner.query(`
      CREATE TABLE "registro_auditoria_ubicacion" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "inventario_nuevo_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "lat" numeric(10,7) NOT NULL,
        "lng" numeric(10,7) NOT NULL,
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        "device_info" jsonb,
        CONSTRAINT "PK_registro_auditoria_ubicacion" PRIMARY KEY ("id")
      )
    `);

    // Índices para registro_auditoria_ubicacion
    await queryRunner.query(`
      CREATE INDEX "IDX_registro_auditoria_inventario_nuevo_id" ON "registro_auditoria_ubicacion" ("inventario_nuevo_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_registro_auditoria_user_id" ON "registro_auditoria_ubicacion" ("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_registro_auditoria_timestamp" ON "registro_auditoria_ubicacion" ("timestamp")
    `);

    // Foreign Keys para registro_auditoria_ubicacion
    await queryRunner.query(`
      ALTER TABLE "registro_auditoria_ubicacion"
      ADD CONSTRAINT "FK_registro_auditoria_inventario_nuevo"
      FOREIGN KEY ("inventario_nuevo_id") REFERENCES "inventario_nuevo"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "registro_auditoria_ubicacion"
      ADD CONSTRAINT "FK_registro_auditoria_user"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys
    await queryRunner.query(`ALTER TABLE "registro_auditoria_ubicacion" DROP CONSTRAINT "FK_registro_auditoria_user"`);
    await queryRunner.query(`ALTER TABLE "registro_auditoria_ubicacion" DROP CONSTRAINT "FK_registro_auditoria_inventario_nuevo"`);
    await queryRunner.query(`ALTER TABLE "inventario_nuevo" DROP CONSTRAINT "FK_inventario_nuevo_created_by"`);
    await queryRunner.query(`ALTER TABLE "inventario_nuevo" DROP CONSTRAINT "FK_inventario_nuevo_inventario_origen"`);

    // Eliminar índices registro_auditoria_ubicacion
    await queryRunner.query(`DROP INDEX "IDX_registro_auditoria_timestamp"`);
    await queryRunner.query(`DROP INDEX "IDX_registro_auditoria_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_registro_auditoria_inventario_nuevo_id"`);

    // Eliminar tabla registro_auditoria_ubicacion
    await queryRunner.query(`DROP TABLE "registro_auditoria_ubicacion"`);

    // Eliminar índices inventario_nuevo
    await queryRunner.query(`DROP INDEX "IDX_inventario_nuevo_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_inventario_nuevo_created_by"`);
    await queryRunner.query(`DROP INDEX "IDX_inventario_nuevo_cod_etiqueta"`);
    await queryRunner.query(`DROP INDEX "IDX_inventario_nuevo_cod_patrimonial"`);

    // Eliminar tabla inventario_nuevo
    await queryRunner.query(`DROP TABLE "inventario_nuevo"`);

    // Eliminar índices inventario
    await queryRunner.query(`DROP INDEX "IDX_inventario_cod_af"`);
    await queryRunner.query(`DROP INDEX "IDX_inventario_cod_etiqueta"`);
    await queryRunner.query(`DROP INDEX "IDX_inventario_cod_patrimonial"`);

    // Eliminar tabla inventario
    await queryRunner.query(`DROP TABLE "inventario"`);

    // Eliminar índices users
    await queryRunner.query(`DROP INDEX "IDX_users_rol"`);
    await queryRunner.query(`DROP INDEX "IDX_users_username"`);
    await queryRunner.query(`DROP INDEX "IDX_users_dni"`);

    // Eliminar tabla users
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
