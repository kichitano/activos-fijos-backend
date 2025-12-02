/**
 * Datos de ubicación geográfica del Perú
 * Departamentos, provincias y distritos según INEI
 *
 * Nota: Este es un subconjunto simplificado.
 * Para producción se recomienda usar una API completa del INEI.
 */

export interface Provincia {
  nombre: string;
  distritos: string[];
}

export interface Departamento {
  nombre: string;
  provincias: Provincia[];
}

/**
 * Estructura completa de ubigeo de Perú
 */
export const PERU_UBIGEO: Record<string, Departamento> = {
  AMAZONAS: {
    nombre: 'Amazonas',
    provincias: [
      { nombre: 'Chachapoyas', distritos: ['Chachapoyas', 'Asunción', 'Balsas', 'Cheto', 'Chiliquin'] },
      { nombre: 'Bagua', distritos: ['Bagua', 'Aramango', 'Copallin', 'El Parco', 'Imaza'] },
      { nombre: 'Bongará', distritos: ['Jumbilla', 'Chisquilla', 'Churuja', 'Corosha', 'Cuispes'] },
    ],
  },
  ANCASH: {
    nombre: 'Áncash',
    provincias: [
      { nombre: 'Huaraz', distritos: ['Huaraz', 'Cochabamba', 'Colcabamba', 'Huanchay', 'Independencia'] },
      { nombre: 'Aija', distritos: ['Aija', 'Coris', 'Huacllan', 'La Merced', 'Succha'] },
      { nombre: 'Santa', distritos: ['Chimbote', 'Cáceres del Perú', 'Coishco', 'Macate', 'Moro'] },
    ],
  },
  APURIMAC: {
    nombre: 'Apurímac',
    provincias: [
      { nombre: 'Abancay', distritos: ['Abancay', 'Chacoche', 'Circa', 'Curahuasi', 'Huanipaca'] },
      { nombre: 'Andahuaylas', distritos: ['Andahuaylas', 'Andarapa', 'Chiara', 'Huancarama', 'Huancaray'] },
      { nombre: 'Antabamba', distritos: ['Antabamba', 'El Oro', 'Huaquirca', 'Juan Espinoza Medrano', 'Oropesa'] },
    ],
  },
  AREQUIPA: {
    nombre: 'Arequipa',
    provincias: [
      { nombre: 'Arequipa', distritos: ['Arequipa', 'Alto Selva Alegre', 'Cayma', 'Cerro Colorado', 'Characato', 'Chiguata', 'Jacobo Hunter', 'José Luis Bustamante y Rivero', 'La Joya', 'Mariano Melgar', 'Miraflores', 'Mollebaya', 'Paucarpata', 'Pocsi', 'Polobaya', 'Quequeña', 'Sabandia', 'Sachaca', 'San Juan de Siguas', 'San Juan de Tarucani', 'Santa Isabel de Siguas', 'Santa Rita de Siguas', 'Socabaya', 'Tiabaya', 'Uchumayo', 'Vítor', 'Yanahuara', 'Yarabamba', 'Yura'] },
      { nombre: 'Camaná', distritos: ['Camaná', 'José María Quimper', 'Mariano Nicolás Valcárcel', 'Mariscal Cáceres', 'Nicolás de Piérola', 'Ocoña', 'Quilca', 'Samuel Pastor'] },
      { nombre: 'Caylloma', distritos: ['Chivay', 'Achoma', 'Cabanaconde', 'Callalli', 'Caylloma', 'Coporaque', 'Huambo', 'Huanca', 'Ichupampa', 'Lari', 'Lluta', 'Maca', 'Madrigal', 'San Antonio de Chuca', 'Sibayo', 'Tapay', 'Tisco', 'Tuti', 'Yanque', 'Majes'] },
    ],
  },
  AYACUCHO: {
    nombre: 'Ayacucho',
    provincias: [
      { nombre: 'Huamanga', distritos: ['Ayacucho', 'Acocro', 'Acos Vinchos', 'Carmen Alto', 'Chiara', 'Ocros', 'Pacaycasa', 'Quinua', 'San José de Ticllas', 'San Juan Bautista', 'Santiago de Pischa', 'Socos', 'Tambillo', 'Vinchos', 'Jesús Nazareno'] },
      { nombre: 'Huanta', distritos: ['Huanta', 'Ayahuanco', 'Huamanguilla', 'Iguain', 'Luricocha', 'Santillana', 'Sivia', 'Llochegua'] },
    ],
  },
  CAJAMARCA: {
    nombre: 'Cajamarca',
    provincias: [
      { nombre: 'Cajamarca', distritos: ['Cajamarca', 'Asunción', 'Chetilla', 'Cospan', 'Encañada', 'Jesús', 'Llacanora', 'Los Baños del Inca', 'Magdalena', 'Matara', 'Namora', 'San Juan'] },
      { nombre: 'Celendín', distritos: ['Celendín', 'Chumuch', 'Cortegana', 'Huasmin', 'Jorge Chávez', 'José Gálvez', 'Miguel Iglesias', 'Oxamarca', 'Sorochuco', 'Sucre', 'Utco', 'La Libertad de Pallan'] },
    ],
  },
  CUSCO: {
    nombre: 'Cusco',
    provincias: [
      { nombre: 'Cusco', distritos: ['Cusco', 'Ccorca', 'Poroy', 'San Jerónimo', 'San Sebastián', 'Santiago', 'Saylla', 'Wanchaq'] },
      { nombre: 'Acomayo', distritos: ['Acomayo', 'Acopia', 'Acos', 'Mosoc Llacta', 'Pomacanchi', 'Rondocan', 'Sangarara'] },
    ],
  },
  HUANCAVELICA: {
    nombre: 'Huancavelica',
    provincias: [
      { nombre: 'Huancavelica', distritos: ['Huancavelica', 'Acobambilla', 'Acoria', 'Conayca', 'Cuenca', 'Huachocolpa', 'Huayllahuara', 'Izcuchaca', 'Laria', 'Manta', 'Mariscal Cáceres', 'Moya', 'Nuevo Occoro', 'Palca', 'Pilchaca', 'Vilca', 'Yauli', 'Ascensión', 'Huando'] },
    ],
  },
  HUANUCO: {
    nombre: 'Huánuco',
    provincias: [
      { nombre: 'Huánuco', distritos: ['Huánuco', 'Amarilis', 'Chinchao', 'Churubamba', 'Margos', 'Quisqui', 'San Francisco de Cayran', 'San Pedro de Chaulan', 'Santa María del Valle', 'Yarumayo', 'Pillco Marca', 'Yacus', 'San Pablo de Pillao'] },
    ],
  },
  ICA: {
    nombre: 'Ica',
    provincias: [
      { nombre: 'Ica', distritos: ['Ica', 'La Tinguiña', 'Los Aquijes', 'Ocucaje', 'Pachacutec', 'Parcona', 'Pueblo Nuevo', 'Salas', 'San José de Los Molinos', 'San Juan Bautista', 'Santiago', 'Subtanjalla', 'Tate', 'Yauca del Rosario'] },
      { nombre: 'Chincha', distritos: ['Chincha Alta', 'Alto Larán', 'Chavin', 'Chincha Baja', 'El Carmen', 'Grocio Prado', 'Pueblo Nuevo', 'San Juan de Yanac', 'San Pedro de Huacarpana', 'Sunampe', 'Tambo de Mora'] },
      { nombre: 'Pisco', distritos: ['Pisco', 'Huancano', 'Humay', 'Independencia', 'Paracas', 'San Andrés', 'San Clemente', 'Tupac Amaru Inca'] },
    ],
  },
  JUNIN: {
    nombre: 'Junín',
    provincias: [
      { nombre: 'Huancayo', distritos: ['Huancayo', 'Carhuacallanga', 'Chacapampa', 'Chicche', 'Chilca', 'Chongos Alto', 'Chupuro', 'Colca', 'Cullhuas', 'El Tambo', 'Huacrapuquio', 'Hualhuas', 'Huancan', 'Huasicancha', 'Huayucachi', 'Ingenio', 'Pariahuanca', 'Pilcomayo', 'Pucara', 'Quichuay', 'Quilcas', 'San Agustín', 'San Jerónimo de Tunan', 'Saño', 'Sapallanga', 'Sicaya', 'Santo Domingo de Acobamba', 'Viques'] },
    ],
  },
  LA_LIBERTAD: {
    nombre: 'La Libertad',
    provincias: [
      { nombre: 'Trujillo', distritos: ['Trujillo', 'El Porvenir', 'Florencia de Mora', 'Huanchaco', 'La Esperanza', 'Laredo', 'Moche', 'Poroto', 'Salaverry', 'Simbal', 'Victor Larco Herrera'] },
      { nombre: 'Ascope', distritos: ['Ascope', 'Casa Grande', 'Chicama', 'Chocope', 'Magdalena de Cao', 'Paijan', 'Rázuri', 'Santiago de Cao'] },
    ],
  },
  LAMBAYEQUE: {
    nombre: 'Lambayeque',
    provincias: [
      { nombre: 'Chiclayo', distritos: ['Chiclayo', 'Chongoyape', 'Eten', 'Eten Puerto', 'José Leonardo Ortiz', 'La Victoria', 'Lagunas', 'Monsefu', 'Nueva Arica', 'Oyotun', 'Picsi', 'Pimentel', 'Reque', 'Santa Rosa', 'Saña', 'Cayalti', 'Patapo', 'Pomalca', 'Pucala', 'Tuman'] },
      { nombre: 'Lambayeque', distritos: ['Lambayeque', 'Chochope', 'Illimo', 'Jayanca', 'Mochumi', 'Morrope', 'Motupe', 'Olmos', 'Pacora', 'Salas', 'San José', 'Tucume'] },
    ],
  },
  LIMA: {
    nombre: 'Lima',
    provincias: [
      { nombre: 'Lima', distritos: ['Lima', 'Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Pueblo Libre', 'Miraflores', 'Pachacámac', 'Pucusana', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'] },
      { nombre: 'Barranca', distritos: ['Barranca', 'Paramonga', 'Pativilca', 'Supe', 'Supe Puerto'] },
      { nombre: 'Cajatambo', distritos: ['Cajatambo', 'Copa', 'Gorgor', 'Huancapon', 'Manas'] },
      { nombre: 'Canta', distritos: ['Canta', 'Arahuay', 'Huamantanga', 'Huaros', 'Lachaqui', 'San Buenaventura', 'Santa Rosa de Quives'] },
      { nombre: 'Cañete', distritos: ['San Vicente de Cañete', 'Asia', 'Calango', 'Cerro Azul', 'Chilca', 'Coayllo', 'Imperial', 'Lunahuana', 'Mala', 'Nuevo Imperial', 'Pacaran', 'Quilmana', 'San Antonio', 'San Luis', 'Santa Cruz de Flores', 'Zuñiga'] },
      { nombre: 'Huaral', distritos: ['Huaral', 'Atavillos Alto', 'Atavillos Bajo', 'Aucallama', 'Chancay', 'Ihuari', 'Lampian', 'Pacaraos', 'San Miguel de Acos', 'Santa Cruz de Andamarca', 'Sumbilca', 'Veintisiete de Noviembre'] },
      { nombre: 'Huarochirí', distritos: ['Matucana', 'Antioquia', 'Callahuanca', 'Carampoma', 'Chicla', 'Cuenca', 'Huachupampa', 'Huanza', 'Huarochiri', 'Lahuaytambo', 'Langa', 'Laraos', 'Mariatana', 'Ricardo Palma', 'San Andrés de Tupicocha', 'San Antonio', 'San Bartolomé', 'San Damian', 'San Juan de Iris', 'San Juan de Tantaranche', 'San Lorenzo de Quinti', 'San Mateo', 'San Mateo de Otao', 'San Pedro de Casta', 'San Pedro de Huancayre', 'Sangallaya', 'Santa Cruz de Cocachacra', 'Santa Eulalia', 'Santiago de Anchucaya', 'Santiago de Tuna', 'Santo Domingo de Los Olleros', 'Surco'] },
      { nombre: 'Huaura', distritos: ['Huacho', 'Ambar', 'Caleta de Carquin', 'Checras', 'Hualmay', 'Huaura', 'Leoncio Prado', 'Paccho', 'Santa Leonor', 'Santa María', 'Sayan', 'Vegueta'] },
      { nombre: 'Oyón', distritos: ['Oyón', 'Andajes', 'Caujul', 'Cochamarca', 'Navan', 'Pachangara'] },
      { nombre: 'Yauyos', distritos: ['Yauyos', 'Alis', 'Allauca', 'Ayaviri', 'Azángaro', 'Cacra', 'Carania', 'Catahuasi', 'Chocos', 'Cochas', 'Colonia', 'Hongos', 'Huampara', 'Huancaya', 'Huangascar', 'Huantan', 'Huañec', 'Laraos', 'Lincha', 'Madean', 'Miraflores', 'Omas', 'Putinza', 'Quinches', 'Quinocay', 'San Joaquín', 'San Pedro de Pilas', 'Tanta', 'Tauripampa', 'Tomas', 'Tupe', 'Viñac', 'Vitis'] },
    ],
  },
  LORETO: {
    nombre: 'Loreto',
    provincias: [
      { nombre: 'Maynas', distritos: ['Iquitos', 'Alto Nanay', 'Fernando Lores', 'Indiana', 'Las Amazonas', 'Mazan', 'Napo', 'Punchana', 'Torres Causana', 'Belén', 'San Juan Bautista'] },
      { nombre: 'Alto Amazonas', distritos: ['Yurimaguas', 'Balsapuerto', 'Jeberos', 'Lagunas', 'Santa Cruz', 'Teniente Cesar López Rojas'] },
    ],
  },
  MADRE_DE_DIOS: {
    nombre: 'Madre de Dios',
    provincias: [
      { nombre: 'Tambopata', distritos: ['Tambopata', 'Inambari', 'Las Piedras', 'Laberinto'] },
      { nombre: 'Manu', distritos: ['Manu', 'Fitzcarrald', 'Madre de Dios', 'Huepetuhe'] },
    ],
  },
  MOQUEGUA: {
    nombre: 'Moquegua',
    provincias: [
      { nombre: 'Mariscal Nieto', distritos: ['Moquegua', 'Carumas', 'Cuchumbaya', 'Samegua', 'San Cristóbal', 'Torata'] },
      { nombre: 'General Sánchez Cerro', distritos: ['Omate', 'Chojata', 'Coalaque', 'Ichuña', 'La Capilla', 'Lloque', 'Matalaque', 'Puquina', 'Quinistaquillas', 'Ubinas', 'Yunga'] },
      { nombre: 'Ilo', distritos: ['Ilo', 'El Algarrobal', 'Pacocha'] },
    ],
  },
  PASCO: {
    nombre: 'Pasco',
    provincias: [
      { nombre: 'Pasco', distritos: ['Chaupimarca', 'Huachon', 'Huariaca', 'Huayllay', 'Ninacaca', 'Pallanchacra', 'Paucartambo', 'San Francisco de Asís de Yarusyacan', 'Simon Bolivar', 'Ticlacayan', 'Tinyahuarco', 'Vicco', 'Yanacancha'] },
    ],
  },
  PIURA: {
    nombre: 'Piura',
    provincias: [
      { nombre: 'Piura', distritos: ['Piura', 'Castilla', 'Catacaos', 'Cura Mori', 'El Tallan', 'La Arena', 'La Unión', 'Las Lomas', 'Tambo Grande', 'Veintiseis de Octubre'] },
      { nombre: 'Ayabaca', distritos: ['Ayabaca', 'Frias', 'Jilili', 'Lagunas', 'Montero', 'Pacaipampa', 'Paimas', 'Sapillica', 'Sicchez', 'Suyo'] },
      { nombre: 'Huancabamba', distritos: ['Huancabamba', 'Canchaque', 'El Carmen de la Frontera', 'Huarmaca', 'Lalaquiz', 'San Miguel de El Faique', 'Sondor', 'Sondorillo'] },
      { nombre: 'Morropón', distritos: ['Chulucanas', 'Buenos Aires', 'Chalaco', 'La Matanza', 'Morropon', 'Salitral', 'San Juan de Bigote', 'Santa Catalina de Mossa', 'Santo Domingo', 'Yamango'] },
      { nombre: 'Paita', distritos: ['Paita', 'Amotape', 'Arenal', 'Colan', 'La Huaca', 'Tamarindo', 'Vichayal'] },
      { nombre: 'Sullana', distritos: ['Sullana', 'Bellavista', 'Ignacio Escudero', 'Lancones', 'Marcavelica', 'Miguel Checa', 'Querecotillo', 'Salitral'] },
      { nombre: 'Talara', distritos: ['Pariñas', 'El Alto', 'La Brea', 'Lobitos', 'Los Órganos', 'Mancora'] },
      { nombre: 'Sechura', distritos: ['Sechura', 'Bellavista de la Unión', 'Bernal', 'Cristo Nos Valga', 'Rinconada Llicuar', 'Vice'] },
    ],
  },
  PUNO: {
    nombre: 'Puno',
    provincias: [
      { nombre: 'Puno', distritos: ['Puno', 'Acora', 'Amantani', 'Atuncolla', 'Capachica', 'Chucuito', 'Coata', 'Huata', 'Mañazo', 'Paucarcolla', 'Pichacani', 'Plateria', 'San Antonio', 'Tiquillaca', 'Vilque'] },
      { nombre: 'Azángaro', distritos: ['Azángaro', 'Achaya', 'Arapa', 'Asillo', 'Caminaca', 'Chupa', 'José Domingo Choquehuanca', 'Muñani', 'Potoni', 'Saman', 'San Anton', 'San José', 'San Juan de Salinas', 'Santiago de Pupuja', 'Tirapata'] },
    ],
  },
  SAN_MARTIN: {
    nombre: 'San Martín',
    provincias: [
      { nombre: 'Moyobamba', distritos: ['Moyobamba', 'Calzada', 'Habana', 'Jepelacio', 'Soritor', 'Yantalo'] },
      { nombre: 'Bellavista', distritos: ['Bellavista', 'Alto Biavo', 'Bajo Biavo', 'Huallaga', 'San Pablo', 'San Rafael'] },
      { nombre: 'El Dorado', distritos: ['San José de Sisa', 'Agua Blanca', 'San Martín', 'Santa Rosa', 'Shatoja'] },
      { nombre: 'Huallaga', distritos: ['Saposoa', 'Alto Saposoa', 'El Eslabón', 'Piscoyacu', 'Sacanche', 'Tingo de Saposoa'] },
      { nombre: 'Lamas', distritos: ['Lamas', 'Alonso de Alvarado', 'Barranquita', 'Caynarachi', 'Cuñumbuqui', 'Pinto Recodo', 'Rumisapa', 'San Roque de Cumbaza', 'Shanao', 'Tabalosos', 'Zapatero'] },
      { nombre: 'Mariscal Cáceres', distritos: ['Juanjuí', 'Campanilla', 'Huicungo', 'Pachiza', 'Pajarillo'] },
      { nombre: 'Picota', distritos: ['Picota', 'Buenos Aires', 'Caspisapa', 'Pilluana', 'Pucacaca', 'San Cristóbal', 'San Hilarión', 'Shamboyacu', 'Tingo de Ponasa', 'Tres Unidos'] },
      { nombre: 'Rioja', distritos: ['Rioja', 'Awajun', 'Elías Soplin Vargas', 'Nueva Cajamarca', 'Pardo Miguel', 'Posic', 'San Fernando', 'Yorongos', 'Yuracyacu'] },
      { nombre: 'San Martín', distritos: ['Tarapoto', 'Alberto Leveau', 'Cacatachi', 'Chazuta', 'Chipurana', 'El Porvenir', 'Huimbayoc', 'Juan Guerra', 'La Banda de Shilcayo', 'Morales', 'Papaplaya', 'San Antonio', 'Sauce', 'Shapaja'] },
      { nombre: 'Tocache', distritos: ['Tocache', 'Nuevo Progreso', 'Polvora', 'Shunte', 'Uchiza'] },
    ],
  },
  TACNA: {
    nombre: 'Tacna',
    provincias: [
      { nombre: 'Tacna', distritos: ['Tacna', 'Alto de la Alianza', 'Calana', 'Ciudad Nueva', 'Inclán', 'Pachia', 'Palca', 'Pocollay', 'Sama', 'Coronel Gregorio Albarracín Lanchipa'] },
      { nombre: 'Candarave', distritos: ['Candarave', 'Cairani', 'Camilaca', 'Curibaya', 'Huanuara', 'Quilahuani'] },
      { nombre: 'Jorge Basadre', distritos: ['Locumba', 'Ilabaya', 'Ite'] },
      { nombre: 'Tarata', distritos: ['Tarata', 'Héroes Albarracín', 'Estique', 'Estique-Pampa', 'Sitajara', 'Susapaya', 'Tarucachi', 'Ticaco'] },
    ],
  },
  TUMBES: {
    nombre: 'Tumbes',
    provincias: [
      { nombre: 'Tumbes', distritos: ['Tumbes', 'Corrales', 'La Cruz', 'Pampas de Hospital', 'San Jacinto', 'San Juan de la Virgen'] },
      { nombre: 'Contralmirante Villar', distritos: ['Zorritos', 'Casitas', 'Canoas de Punta Sal'] },
      { nombre: 'Zarumilla', distritos: ['Zarumilla', 'Aguas Verdes', 'Matapalo', 'Papayal'] },
    ],
  },
  UCAYALI: {
    nombre: 'Ucayali',
    provincias: [
      { nombre: 'Coronel Portillo', distritos: ['Calleria', 'Campoverde', 'Iparia', 'Masisea', 'Yarinacocha', 'Nueva Requena', 'Manantay'] },
      { nombre: 'Atalaya', distritos: ['Raymondi', 'Sepahua', 'Tahuania', 'Yurua'] },
      { nombre: 'Padre Abad', distritos: ['Padre Abad', 'Irazola', 'Curimana', 'Neshuya', 'Alexander Von Humboldt'] },
      { nombre: 'Purús', distritos: ['Purús'] },
    ],
  },
};

/**
 * Obtener lista de todos los departamentos
 */
export function getDepartamentos(): string[] {
  return Object.keys(PERU_UBIGEO).sort();
}

/**
 * Obtener lista de provincias de un departamento
 */
export function getProvincias(departamento: string): string[] {
  const dept = PERU_UBIGEO[departamento];
  if (!dept) {
    return [];
  }
  return dept.provincias.map(p => p.nombre).sort();
}

/**
 * Obtener lista de distritos de una provincia
 */
export function getDistritos(departamento: string, provincia: string): string[] {
  const dept = PERU_UBIGEO[departamento];
  if (!dept) {
    return [];
  }

  const prov = dept.provincias.find(p => p.nombre === provincia);
  if (!prov) {
    return [];
  }

  return prov.distritos.sort();
}

/**
 * Validar si un departamento existe
 */
export function isValidDepartamento(departamento: string): boolean {
  return departamento in PERU_UBIGEO;
}

/**
 * Validar si una provincia existe en un departamento
 */
export function isValidProvincia(departamento: string, provincia: string): boolean {
  const dept = PERU_UBIGEO[departamento];
  if (!dept) {
    return false;
  }
  return dept.provincias.some(p => p.nombre === provincia);
}

/**
 * Validar si un distrito existe en una provincia
 */
export function isValidDistrito(
  departamento: string,
  provincia: string,
  distrito: string
): boolean {
  const dept = PERU_UBIGEO[departamento];
  if (!dept) {
    return false;
  }

  const prov = dept.provincias.find(p => p.nombre === provincia);
  if (!prov) {
    return false;
  }

  return prov.distritos.includes(distrito);
}
