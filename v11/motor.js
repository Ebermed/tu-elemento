/**
 * TU ELEMENTO — Motor de cálculo
 * ------------------------------------------------------------------
 * Cuatro pilares (BaZi) + términos solares, derivado desde cero.
 *
 * Todo lo que hay aquí sale de reglas clásicas de dominio público
 * (ciclo sexagenario, Wu Hu Dun, Wu Shu Dun, longitud eclíptica solar).
 * Ninguna tabla fue copiada de ninguna fuente con copyright: las tablas
 * se GENERAN. Ver test.js para la verificación.
 *
 * Licencia sugerida: MIT
 */

// ─────────────────────────────────────────────────────────────
// 1. VOCABULARIO BASE
// ─────────────────────────────────────────────────────────────

const TALLOS = [
  { pinyin: 'Jia',  han: '甲', elemento: 'madera', yang: true  },
  { pinyin: 'Yi',   han: '乙', elemento: 'madera', yang: false },
  { pinyin: 'Bing', han: '丙', elemento: 'fuego',  yang: true  },
  { pinyin: 'Ding', han: '丁', elemento: 'fuego',  yang: false },
  { pinyin: 'Wu',   han: '戊', elemento: 'tierra', yang: true  },
  { pinyin: 'Ji',   han: '己', elemento: 'tierra', yang: false },
  { pinyin: 'Geng', han: '庚', elemento: 'metal',  yang: true  },
  { pinyin: 'Xin',  han: '辛', elemento: 'metal',  yang: false },
  { pinyin: 'Ren',  han: '壬', elemento: 'agua',   yang: true  },
  { pinyin: 'Gui',  han: '癸', elemento: 'agua',   yang: false },
];

const RAMAS = [
  { pinyin: 'Zi',   han: '子', animal: 'rata',      elemento: 'agua',   yang: true  },
  { pinyin: 'Chou', han: '丑', animal: 'buey',      elemento: 'tierra', yang: false },
  { pinyin: 'Yin',  han: '寅', animal: 'tigre',     elemento: 'madera', yang: true  },
  { pinyin: 'Mao',  han: '卯', animal: 'conejo',    elemento: 'madera', yang: false },
  { pinyin: 'Chen', han: '辰', animal: 'dragón',    elemento: 'tierra', yang: true  },
  { pinyin: 'Si',   han: '巳', animal: 'serpiente', elemento: 'fuego',  yang: false },
  { pinyin: 'Wu',   han: '午', animal: 'caballo',   elemento: 'fuego',  yang: true  },
  { pinyin: 'Wei',  han: '未', animal: 'cabra',     elemento: 'tierra', yang: false },
  { pinyin: 'Shen', han: '申', animal: 'mono',      elemento: 'metal',  yang: true  },
  { pinyin: 'You',  han: '酉', animal: 'gallo',     elemento: 'metal',  yang: false },
  { pinyin: 'Xu',   han: '戌', animal: 'perro',     elemento: 'tierra', yang: true  },
  { pinyin: 'Hai',  han: '亥', animal: 'cerdo',     elemento: 'agua',   yang: false },
];

/**
 * VACÍO (空亡 Kong Wang)
 * Hay 10 tallos y 12 ramas. Al emparejarlos, el ciclo de 60 se parte en
 * seis decenas, y en cada una sobran DOS ramas que se quedan sin tallo.
 * Esas dos son el vacío de esa decena.
 *
 * Decena k = floor(n/10) sobre el índice sexagenario n.
 * Las ramas cubiertas son (10k)..(10k+9) mod 12; sobran las dos siguientes.
 *
 *   decena Jia-Zi   → vacío en Xu y Hai
 *   decena Jia-Xu   → vacío en Shen y You
 *   decena Jia-Shen → vacío en Wu y Wei
 *   decena Jia-Wu   → vacío en Chen y Si
 *   decena Jia-Chen → vacío en Yin y Mao
 *   decena Jia-Yin  → vacío en Zi y Chou
 *
 * @param {number} n  índice sexagenario 0-59 del pilar de referencia
 *                    (tradicionalmente el de día)
 * @returns {number[]} los dos índices de rama vacíos
 */
function vacio(n) {
  const decena = Math.floor((((n % 60) + 60) % 60) / 10);
  return [(10 * decena + 10) % 12, (10 * decena + 11) % 12];
}

/** Índice sexagenario 0-59 a partir de tallo y rama. */
function indiceSexagenario(tallo, rama) {
  for (let n = 0; n < 60; n++) if (n % 10 === tallo && n % 12 === rama) return n;
  return -1;
}

/** Choque = rama opuesta en el círculo (6 posiciones). */
const choque = (i) => (i + 6) % 12;

/** Combinación (六合): pares que suman 1 mod 12. Yin+Hai, Mao+Xu, Chen+You... */
const combinacion = (i) => (13 - i) % 12;

// ─────────────────────────────────────────────────────────────
// 2. CALENDARIO JULIANO
// ─────────────────────────────────────────────────────────────

/** Día juliano (entero, mediodía) de una fecha gregoriana. */
function jdn(anio, mes, dia) {
  const a = Math.floor((14 - mes) / 12);
  const y = anio + 4800 - a;
  const m = mes + 12 * a - 3;
  return dia + Math.floor((153 * m + 2) / 5) + 365 * y
       + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/** Día juliano fraccionario a partir de una fecha UTC. */
function jd(anio, mes, dia, hora = 0, minuto = 0, segundo = 0) {
  return jdn(anio, mes, dia) - 0.5 + (hora + minuto / 60 + segundo / 3600) / 24;
}

/** Inverso: de día juliano fraccionario a fecha UTC. */
function desdeJD(J) {
  const z = Math.floor(J + 0.5);
  const f = J + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const diaFrac = b - d - Math.floor(30.6001 * e) + f;
  const dia = Math.floor(diaFrac);
  const mes = e < 14 ? e - 1 : e - 13;
  const anio = mes > 2 ? c - 4716 : c - 4715;
  const horas = (diaFrac - dia) * 24;
  return {
    anio, mes, dia,
    hora: Math.floor(horas),
    minuto: Math.floor((horas % 1) * 60),
  };
}

// ─────────────────────────────────────────────────────────────
// 3. POSICIÓN SOLAR  (Meeus, Astronomical Algorithms, cap. 25)
// ─────────────────────────────────────────────────────────────
// Precisión ≈ 0.01° de longitud ≈ ±15 min en el cruce de un término
// solar. Suficiente para asignar el mes correcto salvo en el ~1% de
// casos donde el término cae a minutos de la medianoche. Ver
// `avisoPrecision` en la salida.

const RAD = Math.PI / 180;

/** Longitud eclíptica aparente del Sol, en grados [0,360). */
function longitudSolar(J) {
  const T = (J - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M  = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * RAD)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * M * RAD)
           + 0.000289 * Math.sin(3 * M * RAD);
  const omega = 125.04 - 1934.136 * T;
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  return ((lambda % 360) + 360) % 360;
}

/**
 * Momento (JD) en que el Sol cruza `grados` de longitud, buscando
 * a partir de `desde`. Newton-Raphson sobre la longitud.
 */
function cruceSolar(grados, desde) {
  // Estimación inicial: el Sol avanza ~0.9856°/día
  let J = desde;
  let delta = ((grados - longitudSolar(J)) % 360 + 360) % 360;
  J += delta / 0.9856;
  for (let i = 0; i < 8; i++) {
    let d = ((longitudSolar(J) - grados + 180) % 360 + 360) % 360 - 180;
    J -= d / 0.9856;
    if (Math.abs(d) < 1e-7) break;
  }
  return J;
}

/**
 * Los 12 términos "jié" (節) que marcan el inicio de cada mes solar.
 * Li Chun (315°) abre el mes Yin/Tigre; cada 30° siguiente abre el
 * siguiente mes. Devuelve los términos que gobiernan el año dado.
 */
const NOMBRES_JIE = [
  'Li Chun', 'Jing Zhe', 'Qing Ming', 'Li Xia', 'Mang Zhong', 'Xiao Shu',
  'Li Qiu', 'Bai Lu', 'Han Lu', 'Li Dong', 'Da Xue', 'Xiao Han',
];

/**
 * Términos jié desde Li Chun del año `anio` hasta Li Chun del siguiente.
 *
 * OJO CON LA ZONA HORARIA. El instante del cruce es absoluto, pero el
 * DÍA de calendario en que cae depende de dónde lo mires. Las tablas
 * publicadas en manuales y Tong Shu vienen en hora de China (UTC+8).
 * En México varios términos caen un día antes. Ej. 2022:
 *   Da Xue → 7 dic en China, 6 dic en México.
 * La asignación del pilar NO se ve afectada (se compara el instante
 * absoluto); solo cambia lo que muestras en pantalla.
 *
 * @param {number} offsetVista  horas UTC para la fecha mostrada.
 *                              8 = convención china, -6 = México central.
 */
function terminosDelAnio(anio, offsetVista = 8) {
  const out = [];
  // Li Chun cae ~4 feb; empezamos a buscar desde el 20 de enero.
  let cursor = jd(anio, 1, 20);
  for (let k = 0; k < 12; k++) {
    const grados = (315 + 30 * k) % 360;
    const J = cruceSolar(grados, cursor);
    out.push({
      nombre: NOMBRES_JIE[k],
      grados,
      ramaMes: (2 + k) % 12,   // Li Chun → Yin (índice 2)
      jd: J,
      utc: desdeJD(J),
      local: desdeJD(J + offsetVista / 24),
    });
    cursor = J + 25;           // saltar al siguiente tramo
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// 4. LOS CUATRO PILARES
// ─────────────────────────────────────────────────────────────

/**
 * Corrección a hora solar verdadera.
 * @param {number} longitud  grados, negativo al oeste (León ≈ -101.68)
 * @param {number} offsetTZ  horas respecto a UTC (León = -6)
 */
function correccionSolar(longitud, offsetTZ, J) {
  // Diferencia con el meridiano oficial: 4 min por grado
  const meridiano = offsetTZ * 15;
  const minutosLongitud = (longitud - meridiano) * 4;
  // Ecuación del tiempo (aproximación estándar, ±20 s)
  const n = J - 2451545.0;
  const g = (357.528 + 0.9856003 * n) * RAD;
  const lam = (280.46 + 0.9856474 * n) * RAD;
  const minutosEcuacion =
    -7.655 * Math.sin(g) + 9.873 * Math.sin(2 * lam + 3.588);
  return { minutosLongitud, minutosEcuacion,
           total: minutosLongitud + minutosEcuacion };
}

/**
 * Calcula los cuatro pilares.
 *
 * @param {object} o
 * @param {number} o.anio,mes,dia,hora,minuto  hora LOCAL de nacimiento
 * @param {number} o.offsetTZ    horas respecto a UTC (ej. -6)
 * @param {number} [o.longitud]  grados; si se da, aplica hora solar verdadera
 * @param {string} [o.zona]      zona IANA (ej. 'America/Mexico_City'). Si se
 *        da, el offset se resuelve con el historial real de horario de verano
 *        y `offsetTZ` se ignora. Requiere zonas.js.
 * @param {boolean} [o.diaCambiaEn23]  escuela: el pilar de día cambia a las
 *        23:00 (hora Zi temprana) en vez de a medianoche. Default: false.
 */
function cuatroPilares(o) {
  const {
    anio, mes, dia, hora = 12, minuto = 0,
    longitud = null, diaCambiaEn23 = false, zona = null,
  } = o;

  // --- offset: del historial IANA si hay zona, si no el fijo que pasen ---
  let offsetTZ = o.offsetTZ || 0;
  let avisoZona = null;
  if (zona) {
    let fn = (typeof globalThis !== 'undefined') ? globalThis.utcDesdeLocal : undefined;
    if (!fn && typeof require !== 'undefined') {
      try { fn = require('./zonas').utcDesdeLocal; } catch (e) {}
    }
    if (!fn) throw new Error('Falta zonas.js: no se puede resolver la zona horaria.');
    const r = fn(anio, mes, dia, hora, minuto, zona);
    offsetTZ = r.offset;
    avisoZona = r.aviso;
  }

  // --- momento en UTC y en JD ---
  const jdLocal = jd(anio, mes, dia, hora, minuto);
  const jdUTC = jdLocal - offsetTZ / 24;

  // --- hora efectiva (solar verdadera si hay longitud) ---
  let correccion = null;
  let minutosEfectivos = hora * 60 + minuto;
  if (longitud !== null) {
    correccion = correccionSolar(longitud, offsetTZ, jdUTC);
    minutosEfectivos += correccion.total;
  }
  // normalizar y saber si cruzamos de día
  let desplazamientoDia = Math.floor(minutosEfectivos / 1440);
  minutosEfectivos = ((minutosEfectivos % 1440) + 1440) % 1440;
  const horaEf = Math.floor(minutosEfectivos / 60);
  const minEf = Math.round(minutosEfectivos % 60);

  // --- PILAR DE AÑO: cambia en Li Chun, no en Año Nuevo chino ---
  let anioSolar = anio;
  const liChunEsteAnio = cruceSolar(315, jd(anio, 1, 20));
  if (jdUTC < liChunEsteAnio) anioSolar = anio - 1;

  const tallosAnio = ((anioSolar - 4) % 10 + 10) % 10;
  const ramasAnio = ((anioSolar - 4) % 12 + 12) % 12;

  // --- PILAR DE MES: determinado por término solar ---
  const terminos = terminosDelAnio(anioSolar);
  let idxMes = 11;
  for (let k = 11; k >= 0; k--) {
    if (jdUTC >= terminos[k].jd) { idxMes = k; break; }
  }
  const ramaMes = terminos[idxMes].ramaMes;
  // Wu Hu Dun (五虎遁): stem del mes Yin = f(stem del año)
  const talloMes = (tallosAnio * 2 + 2 + idxMes) % 10;

  // ¿Estamos peligrosamente cerca de un cambio de mes?
  const distancia = Math.min(
    ...terminos.map((t) => Math.abs(jdUTC - t.jd) * 1440)
  );
  const avisoPrecision = distancia < 30
    ? `A ${distancia.toFixed(0)} min de un término solar — verificar con efeméride precisa.`
    : null;

  // --- PILAR DE DÍA: ciclo sexagenario continuo ---
  let jdnDia = jdn(anio, mes, dia) + desplazamientoDia;
  if (diaCambiaEn23 && horaEf >= 23) jdnDia += 1;
  const idxDia = ((jdnDia + 49) % 60 + 60) % 60;
  const talloDia = idxDia % 10;
  const ramaDia = idxDia % 12;

  // --- PILAR DE HORA ---
  // La hora Zi abre a las 23:00; cada rama dura 2 horas.
  const ramaHora = Math.floor(((horaEf + 1) % 24) / 2);
  // Wu Shu Dun (五鼠遁): stem de la hora Zi = f(stem del día)
  const talloHora = (talloDia * 2 + ramaHora) % 10;

  const pilar = (t, r) => ({
    tallo: TALLOS[t], rama: RAMAS[r],
    nombre: `${TALLOS[t].pinyin}-${RAMAS[r].pinyin}`,
    etiqueta: `${RAMAS[r].animal} de ${TALLOS[t].elemento} ${TALLOS[t].yang ? 'yang' : 'yin'}`,
  });

  const idxSex = idxDia;   // el pilar de día define el vacío
  const ramasVacias = vacio(idxSex);

  const pilares = {
    anio: pilar(tallosAnio, ramasAnio),
    mes: pilar(talloMes, ramaMes),
    dia: pilar(talloDia, ramaDia),
    hora: pilar(talloHora, ramaHora),
  };

  return {
    pilares,
    // El Día Maestro: el tallo del día. Esto es "tu elemento".
    diaMaestro: {
      ...TALLOS[talloDia],
      etiqueta: `${TALLOS[talloDia].elemento} ${TALLOS[talloDia].yang ? 'yang' : 'yin'}`,
    },
    balanceElementos: contarElementos(pilares),
    horaEfectiva: `${String(horaEf).padStart(2, '0')}:${String(minEf).padStart(2, '0')}`,
    correccionSolar: correccion,
    anioSolar,
    terminoActual: terminos[idxMes],
    jdUTC,
    vacio: { ramas: ramasVacias, decena: Math.floor(idxSex / 10) },
    offsetTZ,
    avisoZona,
    avisoPrecision,
  };
}

/** Conteo simple de los 5 elementos en los 8 caracteres. */
function contarElementos(p) {
  const c = { madera: 0, fuego: 0, tierra: 0, metal: 0, agua: 0 };
  for (const k of ['anio', 'mes', 'dia', 'hora']) {
    c[p[k].tallo.elemento]++;
    c[p[k].rama.elemento]++;
  }
  return c;
}

/* Exportación universal: CommonJS en Node, global explícito en el navegador.
   Se asigna a globalThis a propósito — los `const` de nivel superior NO se
   cuelgan de window, y depender de eso hace frágil la carga entre archivos. */
(function (raiz) {
  var api = { TALLOS, RAMAS, choque, combinacion, vacio, indiceSexagenario, jdn, jd, desdeJD, longitudSolar, cruceSolar, terminosDelAnio, cuatroPilares, contarElementos, correccionSolar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
