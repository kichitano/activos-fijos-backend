import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { Proyecto, SituacionProyecto } from '../entities/Proyecto';
import { Sucursal } from '../entities/Sucursal';
import { Area } from '../entities/Area';
import { Inventario, ActivoEstado } from '../entities/Inventario';
import { AuthService } from '../services/AuthService';
import { Logger } from '../utils/logger';

/**
 * Script de seed para producción
 *
 * Llena las tablas:
 * - usuarios (admin con password 12345678)
 * - proyectos
 * - sucursales
 * - areas
 * - inventario
 *
 * Ejecutar con: pnpm seed:production
 */

async function seedProduction() {
  try {
    await AppDataSource.initialize();
    Logger.info('✅ Conexión a base de datos establecida');

    const authService = new AuthService();
    const userRepository = AppDataSource.getRepository(User);
    const proyectoRepository = AppDataSource.getRepository(Proyecto);
    const sucursalRepository = AppDataSource.getRepository(Sucursal);
    const areaRepository = AppDataSource.getRepository(Area);
    const inventarioRepository = AppDataSource.getRepository(Inventario);

    // ==================== USUARIOS ====================
    Logger.info('📦 Creando usuario administrador...');

    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      Logger.warn(`Ya existen ${existingUsers} usuarios. Omitiendo creación de usuarios.`);
    } else {
      const passwordHash = await authService.hashPassword('12345678');
      const admin = userRepository.create({
        dni: '12345678',
        nombre: 'Administrador del Sistema',
        direccion: 'Av. Principal 123',
        celular: '987654321',
        correo1: 'admin@sistema.com',
        rol: UserRole.ADMINISTRADOR,
        username: 'admin',
        password_hash: passwordHash,
        activo: true,
        must_change_password: false,
      });
      await userRepository.save(admin);
      Logger.info(`  ✓ Usuario admin creado (password: 12345678)`);
    }

    // ==================== PROYECTOS ====================
    Logger.info('📦 Creando proyectos...');

    const existingProyectos = await proyectoRepository.count();
    if (existingProyectos > 0) {
      Logger.warn(`Ya existen ${existingProyectos} proyectos. Omitiendo creación de datos.`);
      await AppDataSource.destroy();
      process.exit(0);
    }

    const proyectosData = [
        {
          cod_proyecto: 'PROY-001',
          empresa: 'Empresa ABC S.A.C.',
          razon_social: 'ABC Servicios y Comercialización S.A.C.',
          rubro: 'Servicios Generales',
          inicio_proyecto: new Date('2024-01-01'),
          firma_contrato: new Date('2023-12-15'),
          fecha_fin_contrato: new Date('2025-12-31'),
          fin_proyectado: new Date('2025-12-31'),
          situacion: SituacionProyecto.EN_EJECUCION,
        },
        {
          cod_proyecto: 'PROY-002',
          empresa: 'Constructora XYZ E.I.R.L.',
          razon_social: 'XYZ Construcciones y Servicios E.I.R.L.',
          rubro: 'Construcción',
          inicio_proyecto: new Date('2024-03-01'),
          firma_contrato: new Date('2024-02-15'),
          fecha_fin_contrato: new Date('2026-02-28'),
          fin_proyectado: new Date('2026-02-28'),
          situacion: SituacionProyecto.EN_EJECUCION,
        },
      ];

    const proyectos: Proyecto[] = [];
    for (const data of proyectosData) {
      const proyecto = proyectoRepository.create(data);
      await proyectoRepository.save(proyecto);
      proyectos.push(proyecto);
      Logger.info(`  ✓ Proyecto creado: ${proyecto.cod_proyecto} - ${proyecto.empresa}`);
    }

    // ==================== SUCURSALES ====================
    Logger.info('📦 Creando sucursales...');

    const sucursalesData = [
        {
          cod_proyecto: proyectos[0]!.id,
          cod_sucursal: 'SUC-001',
          nombre_sucursal: 'Sucursal Lima Centro',
          departamento: 'Lima',
          provincia: 'Lima',
          distrito: 'Cercado de Lima',
          cod_responsable: 'RESP-SUC-001',
          direccion: 'Jr. de la Unión 123',
          telefono: '01-4567890',
        },
        {
          cod_proyecto: proyectos[0]!.id,
          cod_sucursal: 'SUC-002',
          nombre_sucursal: 'Sucursal Miraflores',
          departamento: 'Lima',
          provincia: 'Lima',
          distrito: 'Miraflores',
          cod_responsable: 'RESP-SUC-002',
          direccion: 'Av. Larco 456',
          telefono: '01-7654321',
        },
        {
          cod_proyecto: proyectos[1]!.id,
          cod_sucursal: 'SUC-003',
          nombre_sucursal: 'Sucursal San Isidro',
          departamento: 'Lima',
          provincia: 'Lima',
          distrito: 'San Isidro',
          cod_responsable: 'RESP-SUC-003',
          direccion: 'Av. Javier Prado 789',
          telefono: '01-2345678',
        },
      ];

    const sucursales: Sucursal[] = [];
    for (const data of sucursalesData) {
      const sucursal = sucursalRepository.create(data);
      await sucursalRepository.save(sucursal);
      sucursales.push(sucursal);
      Logger.info(`  ✓ Sucursal creada: ${sucursal.cod_sucursal} - ${sucursal.nombre_sucursal}`);
    }

    // ==================== AREAS ====================
    Logger.info('📦 Creando áreas...');

    const areasData = [
        {
          cod_proyecto: proyectos[0]!.id,
          cod_sucursal: sucursales[0]!.id,
          cod_area: 'AREA-001',
          area: 'Administración',
          cod_responsable: 'RESP-AREA-001',
          telefono: '01-4567891',
          anexo: '101',
        },
        {
          cod_proyecto: proyectos[0]!.id,
          cod_sucursal: sucursales[0]!.id,
          cod_area: 'AREA-002',
          area: 'Contabilidad',
          cod_responsable: 'RESP-AREA-002',
          telefono: '01-4567892',
          anexo: '102',
        },
        {
          cod_proyecto: proyectos[0]!.id,
          cod_sucursal: sucursales[0]!.id,
          cod_area: 'AREA-003',
          area: 'Logística',
          cod_responsable: 'RESP-AREA-003',
          telefono: '01-4567893',
          anexo: '103',
        },
        {
          cod_proyecto: proyectos[0]!.id,
          cod_sucursal: sucursales[1]!.id,
          cod_area: 'AREA-004',
          area: 'Operaciones',
          cod_responsable: 'RESP-AREA-004',
          telefono: '01-7654322',
          anexo: '201',
        },
        {
          cod_proyecto: proyectos[1]!.id,
          cod_sucursal: sucursales[2]!.id,
          cod_area: 'AREA-005',
          area: 'Recursos Humanos',
          cod_responsable: 'RESP-AREA-005',
          telefono: '01-2345679',
          anexo: '301',
        },
      ];

    for (const data of areasData) {
      const area = areaRepository.create(data);
      await areaRepository.save(area);
      Logger.info(`  ✓ Área creada: ${area.cod_area} - ${area.area}`);
    }

    // ==================== INVENTARIO ====================
    Logger.info('📦 Creando registros de inventario...');

    const inventarioData = [
        {
          cod_patrimonial: 'AF-2024-001',
          cod_etiqueta: 'ETQ-001',
          cod_af: 'AF001',
          descripcion: 'Laptop HP ProBook 450 G8',
          marca: 'HP',
          modelo: 'ProBook 450 G8',
          tipo_equipo: 'Laptop',
          serie: 'HPK8X123456',
          color: 'Gris',
          dimension: '35.6 x 23.4 x 1.9 cm',
          estado: ActivoEstado.BUENO,
          cod_sucursal: 'SUC-001',
          cod_area: 'AREA-001',
          ubicacion: 'Oficina 201',
          fecha_adquisicion: new Date('2024-01-15'),
          monto_adquisicion: 3500.00,
          cod_responsable: 'RESP-AREA-001',
          nombre_responsable: 'Pedro Martínez',
          observaciones1: 'Equipo asignado al área de administración',
        },
        {
          cod_patrimonial: 'AF-2024-002',
          cod_etiqueta: 'ETQ-002',
          cod_af: 'AF002',
          descripcion: 'Impresora Multifuncional Canon',
          marca: 'Canon',
          modelo: 'PIXMA G6020',
          tipo_equipo: 'Impresora',
          serie: 'CNG6020789',
          color: 'Negro',
          dimension: '44.5 x 36.8 x 16.8 cm',
          estado: ActivoEstado.BUENO,
          cod_sucursal: 'SUC-001',
          cod_area: 'AREA-003',
          ubicacion: 'Sala de impresión',
          fecha_adquisicion: new Date('2024-02-10'),
          monto_adquisicion: 1200.00,
          cod_responsable: 'RESP-AREA-003',
          nombre_responsable: 'Laura Sánchez',
          observaciones1: 'Impresora compartida del área',
        },
        {
          cod_patrimonial: 'AF-2024-003',
          cod_etiqueta: 'ETQ-003',
          cod_af: 'AF003',
          descripcion: 'Monitor Dell 24 pulgadas',
          marca: 'Dell',
          modelo: 'P2422H',
          tipo_equipo: 'Monitor',
          serie: 'DELL24P2422',
          color: 'Negro',
          dimension: '53.7 x 40.6 x 17.5 cm',
          estado: ActivoEstado.BUENO,
          cod_sucursal: 'SUC-001',
          cod_area: 'AREA-002',
          ubicacion: 'Oficina 105',
          fecha_adquisicion: new Date('2024-03-05'),
          monto_adquisicion: 850.00,
          cod_responsable: 'RESP-AREA-002',
          nombre_responsable: 'Roberto Flores',
          observaciones1: 'Monitor para estación de trabajo',
        },
        {
          cod_patrimonial: 'AF-2024-004',
          cod_etiqueta: 'ETQ-004',
          cod_af: 'AF004',
          descripcion: 'Escritorio de Oficina',
          marca: 'Oficentro',
          modelo: 'ESC-150',
          tipo_equipo: 'Mobiliario',
          serie: 'ESC150-2024',
          color: 'Marrón',
          dimension: '150 x 75 x 75 cm',
          estado: ActivoEstado.BUENO,
          cod_sucursal: 'SUC-002',
          cod_area: 'AREA-004',
          ubicacion: 'Oficina gerencia',
          fecha_adquisicion: new Date('2024-04-10'),
          monto_adquisicion: 450.00,
          cod_responsable: 'RESP-AREA-004',
          nombre_responsable: 'Carmen Rojas',
          observaciones1: 'Mobiliario de oficina ejecutiva',
        },
        {
          cod_patrimonial: 'AF-2024-005',
          cod_etiqueta: 'ETQ-005',
          cod_af: 'AF005',
          descripcion: 'Silla ergonómica ejecutiva',
          marca: 'Herman Miller',
          modelo: 'Aeron Size B',
          tipo_equipo: 'Mobiliario',
          serie: 'HM-AERON-B-2024',
          color: 'Negro',
          dimension: '66 x 66 x 100 cm',
          estado: ActivoEstado.BUENO,
          cod_sucursal: 'SUC-003',
          cod_area: 'AREA-005',
          ubicacion: 'Oficina RR.HH.',
          fecha_adquisicion: new Date('2024-05-15'),
          monto_adquisicion: 1800.00,
          cod_responsable: 'RESP-AREA-005',
          nombre_responsable: 'Miguel Vega',
          observaciones1: 'Silla ergonómica para recursos humanos',
        },
      ];

    for (const data of inventarioData) {
      const inventario = inventarioRepository.create(data);
      await inventarioRepository.save(inventario);
      Logger.info(`  ✓ Inventario creado: ${inventario.cod_patrimonial} - ${inventario.descripcion}`);
    }

    Logger.info('\n✅ Seed de producción completado exitosamente');
    Logger.info('\n📋 Credenciales de acceso:');
    Logger.info('  👤 Administrador:');
    Logger.info('     Username: admin');
    Logger.info('     Password: 12345678\n');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    Logger.error('❌ Error en seed de producción', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

seedProduction();
