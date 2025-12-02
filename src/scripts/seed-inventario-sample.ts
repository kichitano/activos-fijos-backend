import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { Inventario, TipoActivoFijo, ActivoEstado } from '../entities/Inventario';

/**
 * Script para insertar 50 items de ejemplo en la tabla inventario
 * Ejecutar: pnpm seed:inventario
 */

const inventarioSamples = [
  // Mobiliario (20 items)
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-001', codEtiqueta: 'ETQ-2024-001', descripcion: 'Escritorio ejecutivo de madera', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Madera', marca: 'Muebles SA', modelo: 'Exec-2000', color: 'Caoba', largo: 1.80, ancho: 0.90, profundo: 0.75, estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Oficina Principal', compuesto: false, observaciones1: 'En buen estado' },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-002', codEtiqueta: 'ETQ-2024-002', descripcion: 'Silla ergonómica con respaldo alto', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Malla/Metal', marca: 'ErgoChair', modelo: 'EC-500', color: 'Negro', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Área de Operaciones', compuesto: false },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-003', codEtiqueta: 'ETQ-2024-003', descripcion: 'Archivador metálico 4 cajones', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Metal', marca: 'Metalflex', modelo: 'ARC-400', color: 'Gris', largo: 0.45, ancho: 0.60, profundo: 1.30, estado: ActivoEstado.REGULAR_BUENO, codResponsable: 'R1-2', ubicacion: 'Archivo Central', compuesto: false, observaciones1: 'Pequeña aboladura lateral' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-004', codEtiqueta: 'ETQ-2024-004', descripcion: 'Mesa de reuniones rectangular', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Melamina', marca: 'OfficeMax', modelo: 'MR-800', color: 'Blanco', largo: 2.40, ancho: 1.20, profundo: 0.75, estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Sala de Juntas', compuesto: false },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-005', codEtiqueta: 'ETQ-2024-005', descripcion: 'Estante biblioteca 5 niveles', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Madera', marca: 'Muebles Perú', modelo: 'EST-500', color: 'Caoba', largo: 0.80, ancho: 0.40, profundo: 2.00, estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Biblioteca', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-006', codEtiqueta: 'ETQ-2024-006', descripcion: 'Escritorio modular en L', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Melamina', marca: 'ModularWork', modelo: 'ML-300', color: 'Gris', largo: 1.60, ancho: 1.60, profundo: 0.75, estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Oficina Compartida', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-007', codEtiqueta: 'ETQ-2024-007', descripcion: 'Silla visitante sin brazos', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Metal/Tela', marca: 'SitWell', modelo: 'VS-100', color: 'Azul', estado: ActivoEstado.REGULAR_BUENO, codResponsable: 'R1-2', ubicacion: 'Sala de Espera', compuesto: false, observaciones1: 'Tela con ligero desgaste' },
  { codProyecto: 'P02', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-008', codEtiqueta: 'ETQ-2024-008', descripcion: 'Locker metálico 3 puertas', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Metal', marca: 'Securit', modelo: 'LK-300', color: 'Azul', largo: 0.40, ancho: 0.50, profundo: 1.80, estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Vestuario', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-009', codEtiqueta: 'ETQ-2024-009', descripcion: 'Pizarra acrílica blanca', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Acrílico/Metal', marca: 'TeachBoard', modelo: 'PB-120', color: 'Blanco', largo: 1.20, ancho: 0.90, estado: ActivoEstado.BUENO, codResponsable: 'R3-1', ubicacion: 'Aula 101', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-010', codEtiqueta: 'ETQ-2024-010', descripcion: 'Pupitre universitario con paleta', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Metal/Madera', marca: 'SchoolFurn', modelo: 'PU-200', color: 'Gris', largo: 0.60, ancho: 0.50, profundo: 0.80, estado: ActivoEstado.REGULAR_BUENO, codResponsable: 'R3-1', ubicacion: 'Aula 102', compuesto: false },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-011', codEtiqueta: 'ETQ-2024-011', descripcion: 'Vitrina exhibidora con vidrio', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Madera/Vidrio', marca: 'DisplayPro', modelo: 'VT-150', color: 'Café', largo: 1.00, ancho: 0.40, profundo: 1.80, estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Hall Principal', compuesto: false },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-012', codEtiqueta: 'ETQ-2024-012', descripcion: 'Caja fuerte pequeña', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Acero', marca: 'SafeGuard', modelo: 'CF-50', color: 'Negro', largo: 0.40, ancho: 0.35, profundo: 0.30, estado: ActivoEstado.BUENO, codResponsable: 'R1-2', ubicacion: 'Tesorería', compuesto: false, observaciones1: 'Con combinación digital' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-013', codEtiqueta: 'ETQ-2024-013', descripcion: 'Perchero de pie metálico', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Metal', marca: 'HomeOffice', modelo: 'PR-80', color: 'Plateado', profundo: 1.75, estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Recepción', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-014', codEtiqueta: 'ETQ-2024-014', descripcion: 'Mesa auxiliar con ruedas', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Metal', marca: 'MobileFurn', modelo: 'MA-60', color: 'Blanco', largo: 0.60, ancho: 0.40, profundo: 0.70, estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Sala Multiusos', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'SAN_MARTIN', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-015', codEtiqueta: 'ETQ-2024-015', descripcion: 'Credenza con puertas corredizas', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Madera', marca: 'OfficeLine', modelo: 'CR-180', color: 'Nogal', largo: 1.80, ancho: 0.45, profundo: 0.80, estado: ActivoEstado.BUENO, codResponsable: 'R2-2', ubicacion: 'Gerencia', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-016', codEtiqueta: 'ETQ-2024-016', descripcion: 'Atril para conferencias', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Madera', marca: 'SpeakEasy', modelo: 'AT-100', color: 'Caoba', largo: 0.50, ancho: 0.40, profundo: 1.20, estado: ActivoEstado.BUENO, codResponsable: 'R3-1', ubicacion: 'Auditorio', compuesto: false },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-017', codEtiqueta: 'ETQ-2024-017', descripcion: 'Banco alto para laboratorio', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Metal/Plástico', marca: 'LabEquip', modelo: 'BL-45', color: 'Negro', profundo: 0.75, estado: ActivoEstado.REGULAR_BUENO, codResponsable: 'R1-1', ubicacion: 'Laboratorio', compuesto: false, observaciones1: 'Regulador de altura defectuoso' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-018', codEtiqueta: 'ETQ-2024-018', descripcion: 'Armario ropero 2 puertas', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Madera', marca: 'Muebles SA', modelo: 'AR-200', color: 'Blanco', largo: 1.20, ancho: 0.60, profundo: 2.00, estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Dirección', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-019', codEtiqueta: 'ETQ-2024-019', descripcion: 'Mueble organizador modular', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Plástico', marca: 'Organizer', modelo: 'MO-90', color: 'Gris', largo: 0.90, ancho: 0.40, profundo: 1.50, estado: ActivoEstado.BUENO, codResponsable: 'R1-2', ubicacion: 'Almacén', compuesto: false },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-020', codEtiqueta: 'ETQ-2024-020', descripcion: 'Mesa plegable rectangular', tipoActivoFijo: TipoActivoFijo.MOBILIARIO, material: 'Metal/Melamina', marca: 'FlexTable', modelo: 'MP-150', color: 'Blanco', largo: 1.50, ancho: 0.75, profundo: 0.75, estado: ActivoEstado.BUENO, codResponsable: 'R3-1', ubicacion: 'Sala Polivalente', compuesto: false },

  // Equipos Informaticos (20 items)
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-021', codEtiqueta: 'ETQ-2024-021', descripcion: 'Laptop Dell Latitude 5420', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Dell', modelo: 'Latitude 5420', serie: 'DL5420-2024-001', pulgadas: 14, estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Oficina Principal', compuesto: false, observaciones1: 'Intel i5, 8GB RAM, 256GB SSD' },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-022', codEtiqueta: 'ETQ-2024-022', descripcion: 'PC Desktop HP EliteDesk 800', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'HP', modelo: 'EliteDesk 800 G6', serie: 'HP800-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Área de Operaciones', compuesto: false, observaciones1: 'Intel i7, 16GB RAM, 512GB SSD' },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-023', codEtiqueta: 'ETQ-2024-023', descripcion: 'Monitor LG 24 pulgadas Full HD', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'LG', modelo: '24MK430H', serie: 'LG24-2024-001', pulgadas: 24, estado: ActivoEstado.BUENO, codResponsable: 'R1-2', ubicacion: 'Contabilidad', compuesto: false, observaciones1: '1920x1080, HDMI' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-024', codEtiqueta: 'ETQ-2024-024', descripcion: 'Impresora láser HP LaserJet Pro', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'HP', modelo: 'LaserJet Pro M404dn', serie: 'HPM404-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Sala de Impresión', compuesto: false, observaciones1: 'Impresión blanco y negro' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-025', codEtiqueta: 'ETQ-2024-025', descripcion: 'Laptop Lenovo ThinkPad E14', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Lenovo', modelo: 'ThinkPad E14', serie: 'LNV-E14-2024-001', pulgadas: 14, estado: ActivoEstado.REGULAR_BUENO, codResponsable: 'R2-1', ubicacion: 'Oficina', compuesto: false, observaciones1: 'Batería con 80% capacidad' },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-026', codEtiqueta: 'ETQ-2024-026', descripcion: 'Router TP-Link AC1750', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'TP-Link', modelo: 'Archer C7', serie: 'TPL-AC7-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Sala de Servidores', compuesto: false, observaciones1: 'Dual band 2.4/5GHz' },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-027', codEtiqueta: 'ETQ-2024-027', descripcion: 'Escáner Epson WorkForce DS-530', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Epson', modelo: 'WorkForce DS-530', serie: 'EPS-DS530-001', estado: ActivoEstado.BUENO, codResponsable: 'R1-2', ubicacion: 'Archivo Digital', compuesto: false, observaciones1: 'Alimentación automática' },
  { codProyecto: 'P02', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-028', codEtiqueta: 'ETQ-2024-028', descripcion: 'Tablet Samsung Galaxy Tab A8', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Samsung', modelo: 'Galaxy Tab A8', serie: 'SAM-TA8-2024-001', pulgadas: 10.5, estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Inventario Móvil', compuesto: false, observaciones1: 'Con funda protectora' },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-029', codEtiqueta: 'ETQ-2024-029', descripcion: 'Proyector Epson PowerLite X49', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Epson', modelo: 'PowerLite X49', serie: 'EPS-X49-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R3-1', ubicacion: 'Aula 101', compuesto: false, observaciones1: '3600 lúmenes, XGA' },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-030', codEtiqueta: 'ETQ-2024-030', descripcion: 'Disco duro externo Seagate 2TB', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Seagate', modelo: 'Backup Plus', serie: 'SEA-BP2-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R3-1', ubicacion: 'Respaldos', compuesto: false, observaciones1: 'USB 3.0' },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-031', codEtiqueta: 'ETQ-2024-031', descripcion: 'Switch Cisco 24 puertos Gigabit', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Cisco', modelo: 'SG250-26', serie: 'CSC-SG250-001', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Rack de Red', compuesto: false, observaciones1: 'Gestionable' },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-032', codEtiqueta: 'ETQ-2024-032', descripcion: 'UPS APC Smart-UPS 1500VA', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'APC', modelo: 'SMT1500I', serie: 'APC-SMT1500-001', estado: ActivoEstado.BUENO, codResponsable: 'R1-2', ubicacion: 'Sala de Servidores', compuesto: false, observaciones1: '1500VA/1000W' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-033', codEtiqueta: 'ETQ-2024-033', descripcion: 'Webcam Logitech C920 HD Pro', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Logitech', modelo: 'C920', serie: 'LOG-C920-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Sala de Videoconferencias', compuesto: false, observaciones1: '1080p, micrófono incorporado' },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-034', codEtiqueta: 'ETQ-2024-034', descripcion: 'Teclado mecánico Logitech K835', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Logitech', modelo: 'K835', serie: 'LOG-K835-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Estación de Trabajo', compuesto: false, observaciones1: 'Switch TKL, USB' },
  { codProyecto: 'P02', codSucursal: 'SAN_MARTIN', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-035', codEtiqueta: 'ETQ-2024-035', descripcion: 'Mouse inalámbrico Logitech MX Master 3', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Logitech', modelo: 'MX Master 3', serie: 'LOG-MXM3-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R2-2', ubicacion: 'Diseño', compuesto: false, observaciones1: 'Batería recargable' },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-036', codEtiqueta: 'ETQ-2024-036', descripcion: 'Cámara de seguridad IP Hikvision', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Hikvision', modelo: 'DS-2CD2143G0-I', serie: 'HIK-2143-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R3-1', ubicacion: 'Entrada Principal', compuesto: false, observaciones1: '4MP, visión nocturna' },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-037', codEtiqueta: 'ETQ-2024-037', descripcion: 'Servidor Dell PowerEdge T40', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Dell', modelo: 'PowerEdge T40', serie: 'DL-T40-2024-001', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Sala de Servidores', compuesto: false, observaciones1: 'Xeon E-2224G, 16GB, 1TB' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-038', codEtiqueta: 'ETQ-2024-038', descripcion: 'Impresora multifuncional Canon PIXMA', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Canon', modelo: 'PIXMA G3110', serie: 'CAN-G3110-001', estado: ActivoEstado.REGULAR_BUENO, codResponsable: 'R2-1', ubicacion: 'Oficina Compartida', compuesto: false, observaciones1: 'Sistema continuo de tinta' },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-039', codEtiqueta: 'ETQ-2024-039', descripcion: 'NAS Synology 2 bahías', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'Synology', modelo: 'DS220+', serie: 'SYN-DS220-001', estado: ActivoEstado.BUENO, codResponsable: 'R1-2', ubicacion: 'Almacenamiento', compuesto: false, observaciones1: '2GB RAM, RAID' },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-040', codEtiqueta: 'ETQ-2024-040', descripcion: 'All-in-One HP 24-df1023la', tipoActivoFijo: TipoActivoFijo.EQUIPOS_INFORMATICOS, marca: 'HP', modelo: '24-df1023la', serie: 'HP-DF1023-001', pulgadas: 24, estado: ActivoEstado.BUENO, codResponsable: 'R3-1', ubicacion: 'Recepción', compuesto: false, observaciones1: 'Intel i3, 8GB, 1TB' },

  // Vehiculos (10 items)
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-041', codEtiqueta: 'ETQ-2024-041', descripcion: 'Camioneta Toyota Hilux 4x4', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Toyota', modelo: 'Hilux SR', serie: 'ABC-123', color: 'Blanco', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Estacionamiento A', compuesto: false, observaciones1: 'Diesel, 2022' },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-042', codEtiqueta: 'ETQ-2024-042', descripcion: 'Automóvil Nissan Versa', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Nissan', modelo: 'Versa Advance', serie: 'DEF-456', color: 'Gris', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Estacionamiento A', compuesto: false, observaciones1: 'Gasolina, 2021' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-043', codEtiqueta: 'ETQ-2024-043', descripcion: 'Furgoneta Ford Transit', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Ford', modelo: 'Transit 350', serie: 'GHI-789', color: 'Blanco', estado: ActivoEstado.REGULAR_BUENO, codResponsable: 'R2-1', ubicacion: 'Estacionamiento B', compuesto: false, observaciones1: 'Diesel, 2019, requiere mantenimiento' },
  { codProyecto: 'P01', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-044', codEtiqueta: 'ETQ-2024-044', descripcion: 'Motocicleta Honda XR 190', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Honda', modelo: 'XR 190L', serie: 'JKL-012', color: 'Rojo', estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Estacionamiento Motos', compuesto: false, observaciones1: 'Gasolina, 2023' },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-045', codEtiqueta: 'ETQ-2024-045', descripcion: 'Camión Hino FC 1026', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Hino', modelo: 'FC 1026', serie: 'MNO-345', color: 'Azul', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Patio de Carga', compuesto: false, observaciones1: 'Diesel, capacidad 5 ton' },
  { codProyecto: 'P02', codSucursal: 'CAPANIQUE', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-046', codEtiqueta: 'ETQ-2024-046', descripcion: 'Automóvil Kia Rio Sedán', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Kia', modelo: 'Rio EX', serie: 'PQR-678', color: 'Negro', estado: ActivoEstado.BUENO, codResponsable: 'R1-2', ubicacion: 'Estacionamiento A', compuesto: false, observaciones1: 'Gasolina, 2022, automático' },
  { codProyecto: 'P02', codSucursal: 'SAN_MARTIN', codArea: 'OPERACIONES', codPatrimonial: 'PAT-2024-047', codEtiqueta: 'ETQ-2024-047', descripcion: 'Minibus Hyundai H350', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Hyundai', modelo: 'H350', serie: 'STU-901', color: 'Blanco', estado: ActivoEstado.BUENO, codResponsable: 'R2-1', ubicacion: 'Estacionamiento B', compuesto: false, observaciones1: 'Diesel, 15 pasajeros' },
  { codProyecto: 'P02', codSucursal: 'POSTGRADO', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-048', codEtiqueta: 'ETQ-2024-048', descripcion: 'Camioneta Mitsubishi L200', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Mitsubishi', modelo: 'L200 Sportero', serie: 'VWX-234', color: 'Plata', estado: ActivoEstado.REGULAR_BUENO, codResponsable: 'R3-1', ubicacion: 'Estacionamiento C', compuesto: false, observaciones1: 'Diesel, 2020, leve oxidación' },
  { codProyecto: 'P01', codSucursal: 'CAPANIQUE', codArea: 'LOGISTICA', codPatrimonial: 'PAT-2024-049', codEtiqueta: 'ETQ-2024-049', descripcion: 'Automóvil Chevrolet Sail', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Chevrolet', modelo: 'Sail LS', serie: 'YZA-567', color: 'Blanco', estado: ActivoEstado.BUENO, codResponsable: 'R1-1', ubicacion: 'Estacionamiento A', compuesto: false, observaciones1: 'Gasolina, 2021' },
  { codProyecto: 'P02', codSucursal: 'SAN_MARTIN', codArea: 'CONTABILIDAD', codPatrimonial: 'PAT-2024-050', codEtiqueta: 'ETQ-2024-050', descripcion: 'SUV Great Wall Haval H6', tipoActivoFijo: TipoActivoFijo.VEHICULOS, marca: 'Great Wall', modelo: 'Haval H6', serie: 'BCD-890', color: 'Negro', estado: ActivoEstado.BUENO, codResponsable: 'R2-2', ubicacion: 'Estacionamiento A', compuesto: false, observaciones1: 'Gasolina, 2023, 4x2' },
];

async function seed() {
  try {
    console.log('🔄 Inicializando conexión a base de datos...');
    await AppDataSource.initialize();
    console.log('✅ Conexión establecida');

    const inventarioRepo = AppDataSource.getRepository(Inventario);

    // Verificar si ya existen registros
    const count = await inventarioRepo.count();
    if (count > 0) {
      console.log(`⚠️  Ya existen ${count} registros en la tabla inventario`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('¿Desea continuar y agregar más registros? (s/n): ', resolve);
      });
      readline.close();

      if ((answer as string).toLowerCase() !== 's') {
        console.log('❌ Operación cancelada');
        await AppDataSource.destroy();
        return;
      }
    }

    console.log('🔄 Insertando 50 registros de ejemplo...');

    for (const sample of inventarioSamples) {
      const inventario = inventarioRepo.create({
        cod_proyecto: sample.codProyecto,
        cod_sucursal: sample.codSucursal,
        cod_area: sample.codArea,
        cod_patrimonial: sample.codPatrimonial,
        cod_etiqueta: sample.codEtiqueta,
        descripcion: sample.descripcion,
        tipo_activo_fijo: sample.tipoActivoFijo,
        material: sample.material,
        marca: sample.marca,
        modelo: sample.modelo,
        serie: sample.serie,
        color: sample.color,
        largo: sample.largo,
        ancho: sample.ancho,
        profundo: sample.profundo,
        pulgadas: sample.pulgadas,
        estado: sample.estado,
        cod_responsable: sample.codResponsable,
        ubicacion: sample.ubicacion,
        compuesto: sample.compuesto,
        encontrado: false,
        observaciones1: sample.observaciones1,
      });

      await inventarioRepo.save(inventario);
    }

    console.log('✅ 50 registros insertados exitosamente');

    // Mostrar estadísticas
    const stats = await inventarioRepo
      .createQueryBuilder('inventario')
      .select('inventario.tipo_activo_fijo', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('inventario.tipo_activo_fijo')
      .getRawMany();

    console.log('\n📊 Estadísticas por tipo:');
    stats.forEach(stat => {
      console.log(`  - ${stat.tipo}: ${stat.cantidad} items`);
    });

    await AppDataSource.destroy();
    console.log('\n✅ Proceso completado');
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seed();
