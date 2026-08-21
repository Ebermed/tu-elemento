/**
 * TU ELEMENTO — Lugares
 * ------------------------------------------------------------------
 * Ciudades del mundo con su zona IANA (para el historial de horario de
 * verano) y su longitud real (para la hora solar verdadera).
 *
 * La zona la resuelve la base IANA del navegador. La longitud NO viene
 * en esa base, por eso hay que traerla aquí.
 *
 * Peso deliberado hacia el mundo hispanohablante, que es el público
 * principal, pero con cobertura global. Si falta una ciudad, el usuario
 * elige la zona horaria directamente y la longitud se estima desde el
 * meridiano de esa zona: el error máximo es de media hora de tiempo
 * solar, que rara vez cambia el pilar de hora.
 */

var LUGARES = [
  // ── México ──
  { c:'Ciudad de México',    p:'México',      z:'America/Mexico_City',    lon:-99.13 },
  { c:'Guadalajara',         p:'México',      z:'America/Mexico_City',    lon:-103.35 },
  { c:'Monterrey',           p:'México',      z:'America/Monterrey',      lon:-100.31 },
  { c:'Puebla',              p:'México',      z:'America/Mexico_City',    lon:-98.21 },
  { c:'León',                p:'México',      z:'America/Mexico_City',    lon:-101.68 },
  { c:'Querétaro',           p:'México',      z:'America/Mexico_City',    lon:-100.39 },
  { c:'Toluca',              p:'México',      z:'America/Mexico_City',    lon:-99.66 },
  { c:'Mérida',              p:'México',      z:'America/Merida',         lon:-89.62 },
  { c:'Cancún',              p:'México',      z:'America/Cancun',         lon:-86.85 },
  { c:'Tijuana',             p:'México',      z:'America/Tijuana',        lon:-117.04 },
  { c:'Ciudad Juárez',       p:'México',      z:'America/Ciudad_Juarez',  lon:-106.49 },
  { c:'Chihuahua',           p:'México',      z:'America/Chihuahua',      lon:-106.07 },
  { c:'Hermosillo',          p:'México',      z:'America/Hermosillo',     lon:-110.96 },
  { c:'Culiacán',            p:'México',      z:'America/Mazatlan',       lon:-107.39 },
  { c:'Mazatlán',            p:'México',      z:'America/Mazatlan',       lon:-106.41 },
  { c:'Aguascalientes',      p:'México',      z:'America/Mexico_City',    lon:-102.29 },
  { c:'San Luis Potosí',     p:'México',      z:'America/Mexico_City',    lon:-100.98 },
  { c:'Morelia',             p:'México',      z:'America/Mexico_City',    lon:-101.19 },
  { c:'Veracruz',            p:'México',      z:'America/Mexico_City',    lon:-96.13 },
  { c:'Oaxaca',              p:'México',      z:'America/Mexico_City',    lon:-96.73 },
  { c:'Tuxtla Gutiérrez',    p:'México',      z:'America/Mexico_City',    lon:-93.11 },
  { c:'Villahermosa',        p:'México',      z:'America/Mexico_City',    lon:-92.93 },
  { c:'Saltillo',            p:'México',      z:'America/Monterrey',      lon:-101.00 },
  { c:'Torreón',             p:'México',      z:'America/Monterrey',      lon:-103.41 },
  { c:'La Paz',              p:'México',      z:'America/Mazatlan',       lon:-110.31 },
  { c:'Mexicali',            p:'México',      z:'America/Tijuana',        lon:-115.47 },

  // ── México, cobertura estatal completa ──
  { c:'Acapulco',            p:'México',      z:'America/Mexico_City',    lon:-99.87 },
  { c:'Campeche',            p:'México',      z:'America/Merida',         lon:-90.53 },
  { c:'Celaya',              p:'México',      z:'America/Mexico_City',    lon:-100.82 },
  { c:'Chetumal',            p:'México',      z:'America/Cancun',         lon:-88.30 },
  { c:'Chilpancingo',        p:'México',      z:'America/Mexico_City',    lon:-99.50 },
  { c:'Coatzacoalcos',       p:'México',      z:'America/Mexico_City',    lon:-94.45 },
  { c:'Colima',              p:'México',      z:'America/Mexico_City',    lon:-103.72 },
  { c:'Cuernavaca',          p:'México',      z:'America/Mexico_City',    lon:-99.22 },
  { c:'Durango',             p:'México',      z:'America/Monterrey',      lon:-104.67 },
  { c:'Ensenada',            p:'México',      z:'America/Tijuana',        lon:-116.60 },
  { c:'Guanajuato',          p:'México',      z:'America/Mexico_City',    lon:-101.26 },
  { c:'Irapuato',            p:'México',      z:'America/Mexico_City',    lon:-101.35 },
  { c:'Ixtapaluca',          p:'México',      z:'America/Mexico_City',    lon:-98.88 },
  { c:'Jalapa',              p:'México',      z:'America/Mexico_City',    lon:-96.92 },
  { c:'Los Mochis',          p:'México',      z:'America/Mazatlan',       lon:-108.99 },
  { c:'Manzanillo',          p:'México',      z:'America/Mexico_City',    lon:-104.34 },
  { c:'Matamoros',           p:'México',      z:'America/Matamoros',      lon:-97.50 },
  { c:'Nuevo Laredo',        p:'México',      z:'America/Matamoros',      lon:-99.51 },
  { c:'Pachuca',             p:'México',      z:'America/Mexico_City',    lon:-98.74 },
  { c:'Puerto Vallarta',     p:'México',      z:'America/Mexico_City',    lon:-105.23 },
  { c:'Reynosa',             p:'México',      z:'America/Matamoros',      lon:-98.29 },
  { c:'Salamanca',           p:'México',      z:'America/Mexico_City',    lon:-101.20 },
  { c:'Tampico',             p:'México',      z:'America/Mexico_City',    lon:-97.86 },
  { c:'Tepic',               p:'México',      z:'America/Mazatlan',       lon:-104.89 },
  { c:'Tlaxcala',            p:'México',      z:'America/Mexico_City',    lon:-98.24 },
  { c:'Uruapan',             p:'México',      z:'America/Mexico_City',    lon:-102.06 },
  { c:'Zacatecas',           p:'México',      z:'America/Mexico_City',    lon:-102.58 },
  { c:'Ciudad Victoria',     p:'México',      z:'America/Monterrey',      lon:-99.14 },
  { c:'Ciudad Obregón',      p:'México',      z:'America/Hermosillo',     lon:-109.94 },
  { c:'Nogales',             p:'México',      z:'America/Hermosillo',     lon:-110.94 },
  { c:'Playa del Carmen',    p:'México',      z:'America/Cancun',         lon:-87.07 },
  { c:'San Cristóbal',       p:'México',      z:'America/Mexico_City',    lon:-92.64 },
  { c:'Ciudad del Carmen',   p:'México',      z:'America/Merida',         lon:-91.83 },
  // ── más cobertura hispanohablante ──
  { c:'Tucumán',             p:'Argentina',   z:'America/Argentina/Tucuman', lon:-65.22 },
  { c:'Salta',               p:'Argentina',   z:'America/Argentina/Salta', lon:-65.41 },
  { c:'Mar del Plata',       p:'Argentina',   z:'America/Argentina/Buenos_Aires', lon:-57.55 },
  { c:'Concepción',          p:'Chile',       z:'America/Santiago',       lon:-73.05 },
  { c:'Antofagasta',         p:'Chile',       z:'America/Santiago',       lon:-70.40 },
  { c:'Cartagena',           p:'Colombia',    z:'America/Bogota',         lon:-75.51 },
  { c:'Bucaramanga',         p:'Colombia',    z:'America/Bogota',         lon:-73.12 },
  { c:'Cúcuta',              p:'Colombia',    z:'America/Bogota',         lon:-72.51 },
  { c:'Pereira',             p:'Colombia',    z:'America/Bogota',         lon:-75.69 },
  { c:'Trujillo',            p:'Perú',        z:'America/Lima',           lon:-79.03 },
  { c:'Cusco',               p:'Perú',        z:'America/Lima',           lon:-71.97 },
  { c:'Cochabamba',          p:'Bolivia',     z:'America/La_Paz',         lon:-66.16 },
  { c:'Cuenca',              p:'Ecuador',     z:'America/Guayaquil',      lon:-79.00 },
  { c:'Valencia',            p:'Venezuela',   z:'America/Caracas',        lon:-68.01 },
  { c:'Barquisimeto',        p:'Venezuela',   z:'America/Caracas',        lon:-69.35 },
  { c:'San Pedro Sula',      p:'Honduras',    z:'America/Tegucigalpa',    lon:-88.03 },
  { c:'Quetzaltenango',      p:'Guatemala',   z:'America/Guatemala',      lon:-91.52 },
  { c:'Santiago de los Caballeros', p:'Rep. Dominicana', z:'America/Santo_Domingo', lon:-70.70 },
  { c:'Santiago de Cuba',    p:'Cuba',        z:'America/Havana',         lon:-75.82 },
  { c:'Málaga',              p:'España',      z:'Europe/Madrid',          lon:-4.42 },
  { c:'Zaragoza',            p:'España',      z:'Europe/Madrid',          lon:-0.88 },
  { c:'Murcia',              p:'España',      z:'Europe/Madrid',          lon:-1.13 },
  { c:'Vigo',                p:'España',      z:'Europe/Madrid',          lon:-8.72 },
  { c:'Santa Cruz de Tenerife', p:'España',   z:'Atlantic/Canary',        lon:-16.25 },
  { c:'Porto',               p:'Portugal',    z:'Europe/Lisbon',          lon:-8.61 },

  // ── Centroamérica y Caribe ──
  { c:'Guatemala',           p:'Guatemala',   z:'America/Guatemala',      lon:-90.51 },
  { c:'San Salvador',        p:'El Salvador', z:'America/El_Salvador',    lon:-89.19 },
  { c:'Tegucigalpa',         p:'Honduras',    z:'America/Tegucigalpa',    lon:-87.19 },
  { c:'Managua',             p:'Nicaragua',   z:'America/Managua',        lon:-86.25 },
  { c:'San José',            p:'Costa Rica',  z:'America/Costa_Rica',     lon:-84.09 },
  { c:'Ciudad de Panamá',    p:'Panamá',      z:'America/Panama',         lon:-79.52 },
  { c:'La Habana',           p:'Cuba',        z:'America/Havana',         lon:-82.38 },
  { c:'Santo Domingo',       p:'Rep. Dominicana', z:'America/Santo_Domingo', lon:-69.93 },
  { c:'San Juan',            p:'Puerto Rico', z:'America/Puerto_Rico',    lon:-66.11 },

  // ── Sudamérica ──
  { c:'Bogotá',              p:'Colombia',    z:'America/Bogota',         lon:-74.07 },
  { c:'Medellín',            p:'Colombia',    z:'America/Bogota',         lon:-75.56 },
  { c:'Cali',                p:'Colombia',    z:'America/Bogota',         lon:-76.52 },
  { c:'Barranquilla',        p:'Colombia',    z:'America/Bogota',         lon:-74.80 },
  { c:'Caracas',             p:'Venezuela',   z:'America/Caracas',        lon:-66.90 },
  { c:'Maracaibo',           p:'Venezuela',   z:'America/Caracas',        lon:-71.61 },
  { c:'Quito',               p:'Ecuador',     z:'America/Guayaquil',      lon:-78.47 },
  { c:'Guayaquil',           p:'Ecuador',     z:'America/Guayaquil',      lon:-79.90 },
  { c:'Lima',                p:'Perú',        z:'America/Lima',           lon:-77.04 },
  { c:'Arequipa',            p:'Perú',        z:'America/Lima',           lon:-71.54 },
  { c:'La Paz',              p:'Bolivia',     z:'America/La_Paz',         lon:-68.15 },
  { c:'Santa Cruz',          p:'Bolivia',     z:'America/La_Paz',         lon:-63.18 },
  { c:'Santiago',            p:'Chile',       z:'America/Santiago',       lon:-70.65 },
  { c:'Valparaíso',          p:'Chile',       z:'America/Santiago',       lon:-71.62 },
  { c:'Buenos Aires',        p:'Argentina',   z:'America/Argentina/Buenos_Aires', lon:-58.38 },
  { c:'Córdoba',             p:'Argentina',   z:'America/Argentina/Cordoba', lon:-64.18 },
  { c:'Mendoza',             p:'Argentina',   z:'America/Argentina/Mendoza', lon:-68.84 },
  { c:'Rosario',             p:'Argentina',   z:'America/Argentina/Buenos_Aires', lon:-60.70 },
  { c:'Montevideo',          p:'Uruguay',     z:'America/Montevideo',     lon:-56.16 },
  { c:'Asunción',            p:'Paraguay',    z:'America/Asuncion',       lon:-57.58 },
  { c:'São Paulo',           p:'Brasil',      z:'America/Sao_Paulo',      lon:-46.63 },
  { c:'Río de Janeiro',      p:'Brasil',      z:'America/Sao_Paulo',      lon:-43.17 },
  { c:'Brasilia',            p:'Brasil',      z:'America/Sao_Paulo',      lon:-47.88 },

  // ── Estados Unidos y Canadá ──
  { c:'Los Ángeles',         p:'Estados Unidos', z:'America/Los_Angeles', lon:-118.24 },
  { c:'San Francisco',       p:'Estados Unidos', z:'America/Los_Angeles', lon:-122.42 },
  { c:'San Diego',           p:'Estados Unidos', z:'America/Los_Angeles', lon:-117.16 },
  { c:'Las Vegas',           p:'Estados Unidos', z:'America/Los_Angeles', lon:-115.14 },
  { c:'Phoenix',             p:'Estados Unidos', z:'America/Phoenix',     lon:-112.07 },
  { c:'Denver',              p:'Estados Unidos', z:'America/Denver',      lon:-104.99 },
  { c:'Houston',             p:'Estados Unidos', z:'America/Chicago',     lon:-95.37 },
  { c:'Dallas',              p:'Estados Unidos', z:'America/Chicago',     lon:-96.80 },
  { c:'San Antonio',         p:'Estados Unidos', z:'America/Chicago',     lon:-98.49 },
  { c:'Chicago',             p:'Estados Unidos', z:'America/Chicago',     lon:-87.63 },
  { c:'Miami',               p:'Estados Unidos', z:'America/New_York',    lon:-80.19 },
  { c:'Nueva York',          p:'Estados Unidos', z:'America/New_York',    lon:-74.01 },
  { c:'Atlanta',             p:'Estados Unidos', z:'America/New_York',    lon:-84.39 },
  { c:'Toronto',             p:'Canadá',      z:'America/Toronto',        lon:-79.38 },
  { c:'Montreal',            p:'Canadá',      z:'America/Toronto',        lon:-73.57 },
  { c:'Vancouver',           p:'Canadá',      z:'America/Vancouver',      lon:-123.12 },

  // ── Europa ──
  { c:'Madrid',              p:'España',      z:'Europe/Madrid',          lon:-3.70 },
  { c:'Barcelona',           p:'España',      z:'Europe/Madrid',          lon:2.17 },
  { c:'Valencia',            p:'España',      z:'Europe/Madrid',          lon:-0.38 },
  { c:'Sevilla',             p:'España',      z:'Europe/Madrid',          lon:-5.98 },
  { c:'Bilbao',              p:'España',      z:'Europe/Madrid',          lon:-2.93 },
  { c:'Las Palmas',          p:'España',      z:'Atlantic/Canary',        lon:-15.43 },
  { c:'Lisboa',              p:'Portugal',    z:'Europe/Lisbon',          lon:-9.14 },
  { c:'París',               p:'Francia',     z:'Europe/Paris',           lon:2.35 },
  { c:'Londres',             p:'Reino Unido', z:'Europe/London',          lon:-0.13 },
  { c:'Roma',                p:'Italia',      z:'Europe/Rome',            lon:12.50 },
  { c:'Milán',               p:'Italia',      z:'Europe/Rome',            lon:9.19 },
  { c:'Berlín',              p:'Alemania',    z:'Europe/Berlin',          lon:13.40 },
  { c:'Ámsterdam',           p:'Países Bajos',z:'Europe/Amsterdam',       lon:4.90 },
  { c:'Bruselas',            p:'Bélgica',     z:'Europe/Brussels',        lon:4.35 },
  { c:'Zúrich',              p:'Suiza',       z:'Europe/Zurich',          lon:8.54 },
  { c:'Viena',               p:'Austria',     z:'Europe/Vienna',          lon:16.37 },
  { c:'Varsovia',            p:'Polonia',     z:'Europe/Warsaw',          lon:21.01 },
  { c:'Estocolmo',           p:'Suecia',      z:'Europe/Stockholm',       lon:18.07 },
  { c:'Atenas',              p:'Grecia',      z:'Europe/Athens',          lon:23.73 },
  { c:'Moscú',               p:'Rusia',       z:'Europe/Moscow',          lon:37.62 },
  { c:'Estambul',            p:'Turquía',     z:'Europe/Istanbul',        lon:28.98 },

  // ── África y Medio Oriente ──
  { c:'El Cairo',            p:'Egipto',      z:'Africa/Cairo',           lon:31.24 },
  { c:'Casablanca',          p:'Marruecos',   z:'Africa/Casablanca',      lon:-7.59 },
  { c:'Lagos',               p:'Nigeria',     z:'Africa/Lagos',           lon:3.38 },
  { c:'Nairobi',             p:'Kenia',       z:'Africa/Nairobi',         lon:36.82 },
  { c:'Johannesburgo',       p:'Sudáfrica',   z:'Africa/Johannesburg',    lon:28.05 },
  { c:'Dubái',               p:'E.A.U.',      z:'Asia/Dubai',             lon:55.27 },
  { c:'Tel Aviv',            p:'Israel',      z:'Asia/Jerusalem',         lon:34.78 },

  // ── Asia y Oceanía ──
  { c:'Nueva Delhi',         p:'India',       z:'Asia/Kolkata',           lon:77.21 },
  { c:'Bombay',              p:'India',       z:'Asia/Kolkata',           lon:72.88 },
  { c:'Bangkok',             p:'Tailandia',   z:'Asia/Bangkok',           lon:100.50 },
  { c:'Yakarta',             p:'Indonesia',   z:'Asia/Jakarta',           lon:106.85 },
  { c:'Singapur',            p:'Singapur',    z:'Asia/Singapore',         lon:103.82 },
  { c:'Manila',              p:'Filipinas',   z:'Asia/Manila',            lon:120.98 },
  { c:'Hong Kong',           p:'Hong Kong',   z:'Asia/Hong_Kong',         lon:114.17 },
  { c:'Pekín',               p:'China',       z:'Asia/Shanghai',          lon:116.41 },
  { c:'Shanghái',            p:'China',       z:'Asia/Shanghai',          lon:121.47 },
  { c:'Taipéi',              p:'Taiwán',      z:'Asia/Taipei',            lon:121.56 },
  { c:'Seúl',                p:'Corea del Sur', z:'Asia/Seoul',           lon:126.98 },
  { c:'Tokio',               p:'Japón',       z:'Asia/Tokyo',             lon:139.69 },
  { c:'Sídney',              p:'Australia',   z:'Australia/Sydney',       lon:151.21 },
  { c:'Melbourne',           p:'Australia',   z:'Australia/Melbourne',    lon:144.96 },
  { c:'Auckland',            p:'Nueva Zelanda', z:'Pacific/Auckland',     lon:174.76 },
];

/** Etiqueta para mostrar: "León, México". */
function etiquetaLugar(l) { return l.c + ', ' + l.p; }

/**
 * Búsqueda por relevancia, no por subcadena cruda.
 * Antes "le" devolvía Valencia (va-LE-ncia), que es absurdo.
 * Orden: la ciudad empieza con lo escrito → una palabra de la ciudad
 * empieza con lo escrito → el país empieza con lo escrito.
 */
function buscarLugares(texto, limite) {
  limite = limite || 8;
  var q = normalizar(texto);
  if (!q) return LUGARES.slice(0, limite);

  var puntuados = [];
  for (var i = 0; i < LUGARES.length; i++) {
    var l = LUGARES[i];
    var c = normalizar(l.c), pa = normalizar(l.p);
    var r = -1;
    if (c.indexOf(q) === 0) r = 0;                        // León ← "le"
    else if (empiezaPalabra(c, q)) r = 1;                 // Buenos Aires ← "ai"
    else if (pa.indexOf(q) === 0) r = 2;                  // México ← "mex"
    else if (empiezaPalabra(pa, q)) r = 3;
    if (r >= 0) puntuados.push({ l: l, r: r, largo: c.length });
  }
  puntuados.sort(function (a, b) {
    return a.r - b.r || a.largo - b.largo || a.l.c.localeCompare(b.l.c);
  });
  return puntuados.slice(0, limite).map(function (x) { return x.l; });
}

/** ¿Alguna palabra del texto empieza con q? */
function empiezaPalabra(texto, q) {
  var partes = texto.split(' ');
  for (var i = 1; i < partes.length; i++) if (partes[i].indexOf(q) === 0) return true;
  return false;
}

function normalizar(s) {
  return String(s).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Para quien no encuentre su ciudad: elige zona horaria y estimamos la
 * longitud desde el meridiano de esa zona. Error máximo ~30 min solares.
 */
function lugarDesdeZona(zona) {
  var off;
  try {
    var dtf = new Intl.DateTimeFormat('en-US', { timeZone: zona, hourCycle: 'h23',
      year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit' });
    var p = {}, ahora = Date.UTC(2024, 0, 15, 12);
    for (var x of dtf.formatToParts(new Date(ahora))) p[x.type] = x.value;
    off = (Date.UTC(+p.year, +p.month-1, +p.day, +p.hour, +p.minute, +p.second) - ahora) / 3600000;
  } catch (e) { off = 0; }
  return { c: zona.split('/').pop().replace(/_/g, ' '), p: '', z: zona, lon: off * 15, estimado: true };
}

/** Todas las zonas IANA que conozca el navegador. */
function todasLasZonas() {
  try { return Intl.supportedValuesOf('timeZone'); } catch (e) { return []; }
}

(function (raiz) {
  var api = { LUGARES, etiquetaLugar, buscarLugares, empiezaPalabra, lugarDesdeZona, todasLasZonas, normalizar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
