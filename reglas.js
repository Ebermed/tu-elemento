/**
 * TU ELEMENTO — Reglas de selección de fechas (Ze Ri Xue)
 * ------------------------------------------------------------------
 * Cada regla es un algoritmo de 1-3 líneas. Las tablas grandes que se
 * publican en los manuales son la SALIDA de estas reglas, no su fuente.
 * Aquí las generamos.
 */

/* Resolución de dependencias sin declarar nombres nuevos. Declarar
   `const RAMAS` aquí choca con el de motor.js cuando los dos archivos
   comparten el ámbito global del navegador. */
function _depR(nombre, ruta) {
  if (typeof globalThis !== 'undefined' && globalThis[nombre] !== undefined) return globalThis[nombre];
  if (typeof require !== 'undefined') { try { return require(ruta)[nombre]; } catch (e) {} }
  return undefined;
}

// ─────────────────────────────────────────────────────────────
// LOS 12 OFICIALES  (十二值神 Shi Er Zhi Shen)
// ─────────────────────────────────────────────────────────────
// Regla única: el oficial Jian ("instalar") cae en los días cuya rama
// coincide con la rama del mes. Los otros 11 siguen en orden fijo.
// Toda la tabla de 12×12 sale de esta línea.

// Cada oficial trae su carácter, lo que favorece y lo que estorba.
// Las asociaciones son las clásicas del Ze Ri Xue; la redacción es propia
// y en lenguaje de todos los días, sin tono de amenaza.

const OFICIALES = [
  { pinyin:'Jian', han:'建', nombre:'Abrir',
    caracter:'El día arranca cosas. Sirve para poner la primera piedra de algo que quieres que dure.',
    bueno:['proponer matrimonio','juntas donde buscas acuerdo','empezar a estudiar','viajes largos','empezar una construcción','empezar un tratamiento médico'],
    evitar:['funerales','divorcios'] },
  { pinyin:'Chu', han:'除', nombre:'Soltar',
    caracter:'El día limpia. Todo lo que sea quitarte algo de encima sale más fácil hoy.',
    bueno:['terminar una relación que ya no da','cerrar sociedades','tirar o rematar cosas','demoler','cirugías donde se quita algo'],
    evitar:['bodas','mudanzas','abrir un negocio','viajar','movimientos financieros'] },
  { pinyin:'Man', han:'滿', nombre:'Llenar',
    caracter:'El día multiplica lo que entra. Bueno para recibir; cuidado con lo que firmas, porque también se multiplica.',
    bueno:['cobrar deudas','inaugurar','comprar cosas para la casa','firmar algo que te conviene'],
    evitar:['bodas','firmar sentencias','demandas','aceptar un trabajo que no quieres','funerales'] },
  { pinyin:'Ping', han:'平', nombre:'Emparejar',
    caracter:'El día empata. Nadie saca ventaja, y por eso sirve cuando vas en desventaja.',
    bueno:['negociar de igual a igual','repartir bienes','bodas','cerrar acuerdos parejos'],
    evitar:['funerales'] },
  { pinyin:'Ding', han:'定', nombre:'Asentar',
    caracter:'El día fija. Lo que empieces hoy tiende a quedarse mucho tiempo, para bien y para mal.',
    bueno:['bodas','empezar un trabajo que quieres que dure','contratar gente clave','inaugurar','construir casa'],
    evitar:['mudanzas','viajar','demandas','funerales'] },
  { pinyin:'Zhi', han:'執', nombre:'Emprender',
    caracter:'El día empuja. Bueno para arrancar, flojo para sostener.',
    bueno:['arrancar proyectos','ponerte a hacer lo que llevas posponiendo'],
    evitar:['mudanzas','viajes largos'] },
  { pinyin:'Po', han:'破', nombre:'Romper',
    caracter:'El día tiene filo. Solo sirve si lo que quieres es terminar algo.',
    bueno:['demoler','separaciones que ya necesitan firmeza'],
    evitar:['empezar cualquier cosa','bodas','cerrar tratos'] },
  { pinyin:'Wei', han:'危', nombre:'Sacudir',
    caracter:'El día mueve el piso. Fuerte y poco estable: úsalo para romper una inercia.',
    bueno:['romper un ciclo','cambiar de lugar los muebles','sacudir una rutina'],
    evitar:['bodas','cualquier cosa que necesite calma o larga duración','deportes extremos','entierros'] },
  { pinyin:'Cheng', han:'成', nombre:'Lograr',
    caracter:'El mejor día del ciclo. Sirve casi para todo, tanto para empezar como para cosechar.',
    bueno:['bodas','proponer matrimonio','empezar un tratamiento','cerrar proyectos','casi cualquier cosa'],
    evitar:['demandas','peleas que quieras ganar'] },
  { pinyin:'Shou', han:'收', nombre:'Recibir',
    caracter:'El día acepta. Bueno para que te digan que sí.',
    bueno:['pedir un aumento','cerrar tratos','empezar a estudiar','proponer matrimonio','abrir un negocio'],
    evitar:['funerales','visitar hospitales','empezar un tratamiento médico'] },
  { pinyin:'Kai', han:'開', nombre:'Estrenar',
    caracter:'El día abre puertas. Bueno para lo que empieza con gente nueva.',
    bueno:['abrir negocio','bodas','estrenar puesto','empezar a estudiar','conocer gente'],
    evitar:['funerales','demoliciones','remodelaciones'] },
  { pinyin:'Bi', han:'閉', nombre:'Guardar',
    caracter:'El día se cierra. La energía anda baja: buen momento para descansar y no forzar nada.',
    bueno:['descansar','cerrar pendientes chiquitos','guardar y ordenar'],
    evitar:['cualquier cosa importante que quieras que prospere'] },
];

function oficialDelDia(ramaMes, ramaDia) {
  return OFICIALES[((ramaDia - ramaMes) % 12 + 12) % 12];
}

// ─────────────────────────────────────────────────────────────
// DÍAS DE FRICCIÓN  (破日 — los "días rotos")
// ─────────────────────────────────────────────────────────────
// Regla: un día "choca" con un ciclo cuando su rama es la opuesta
// (6 posiciones) a la rama de ese ciclo.

const friccionAnio     = (ramaAnio, ramaDia) => ramaDia === _depR('choque','./motor')(ramaAnio);
const friccionMes      = (ramaMes,  ramaDia) => ramaDia === _depR('choque','./motor')(ramaMes);
const friccionPersonal = (ramaNat,  ramaDia) => ramaDia === _depR('choque','./motor')(ramaNat);

// ─────────────────────────────────────────────────────────────
// SAN SHA  (三煞 — "los tres asesinos")
// ─────────────────────────────────────────────────────────────
// Regla: cada rama pertenece a un trino elemental (índice mod 4).
// El San Sha ocupa el racimo direccional que CHOCA con ese elemento.
//   agua (Shen-Zi-Chen)  → sur  (Si-Wu-Wei)
//   metal (Si-You-Chou)  → este (Yin-Mao-Chen)
//   fuego (Yin-Wu-Xu)    → norte(Hai-Zi-Chou)
//   madera(Hai-Mao-Wei)  → oeste(Shen-You-Xu)
// El racimo son 3 ramas consecutivas empezando en:

const INICIO_SAN_SHA = { 0: 5, 1: 2, 2: 11, 3: 8 };

function sanSha(ramaAnioOMes) {
  const inicio = INICIO_SAN_SHA[ramaAnioOMes % 4];
  return {
    robo:      (inicio + 0) % 12,  // rama "estable": Yin/Si/Shen/Hai
    calamidad: (inicio + 1) % 12,  // rama cardinal: Zi/Wu/Mao/You
    retraso:   (inicio + 2) % 12,  // rama tierra: Chou/Chen/Wei/Xu
  };
}

function evaluarSanSha(sh, ramaDia) {
  if (ramaDia === sh.robo)      return { tipo: 'robo',      nota: 'evitar movimientos grandes de dinero o viajes' };
  if (ramaDia === sh.calamidad) return { tipo: 'calamidad', nota: 'evitar procedimientos delicados' };
  if (ramaDia === sh.retraso)   return { tipo: 'retraso',   nota: 'esperar lentitud y poca cooperación' };
  return null;
}

// ─────────────────────────────────────────────────────────────
// EVALUACIÓN COMPLETA DE UN DÍA
// ─────────────────────────────────────────────────────────────

/**
 * @param {object} fecha  {anio, mes, dia}
 * @param {object} [natal] {ramaAnio} rama del año de nacimiento (opcional)
 */
function evaluarDia(fecha, natal = null) {
  const RM = _depR('RAMAS','./motor');
  const p = _depR('cuatroPilares','./motor')({ ...fecha, hora: 12, offsetTZ: 0 });
  const ramaAnio = RM.indexOf(p.pilares.anio.rama);
  const ramaMes  = RM.indexOf(p.pilares.mes.rama);
  const ramaDia  = RM.indexOf(p.pilares.dia.rama);

  const shAnio = sanSha(ramaAnio);
  const shMes  = sanSha(ramaMes);

  const avisos = [];
  if (friccionMes(ramaMes, ramaDia))   avisos.push({ nivel: 'alto',  motivo: 'fricción con el mes' });
  if (friccionAnio(ramaAnio, ramaDia)) avisos.push({ nivel: 'medio', motivo: 'fricción con el año' });
  if (natal && friccionPersonal(natal.ramaAnio, ramaDia))
    avisos.push({ nivel: 'alto', motivo: 'fricción con tu signo' });

  const ssA = evaluarSanSha(shAnio, ramaDia);
  const ssM = evaluarSanSha(shMes, ramaDia);
  if (ssM) avisos.push({ nivel: 'medio', motivo: `San Sha del mes (${ssM.tipo})`, nota: ssM.nota });
  else if (ssA) avisos.push({ nivel: 'bajo', motivo: `San Sha del año (${ssA.tipo})`, nota: ssA.nota });

  const oficial = oficialDelDia(ramaMes, ramaDia);

  // Puntaje simple 0-100 para ordenar días. Reencuadre positivo:
  // no decimos "día roto", decimos qué tan a favor sopla el viento.
  let puntaje = 60;
  if (['Cheng', 'Kai', 'Ding', 'Man', 'Shou'].includes(oficial.pinyin)) puntaje += 25;
  if (['Po', 'Wei', 'Bi'].includes(oficial.pinyin)) puntaje -= 25;
  for (const a of avisos) {
    puntaje -= a.nivel === 'alto' ? 30 : a.nivel === 'medio' ? 15 : 7;
  }
  puntaje = Math.max(0, Math.min(100, puntaje));

  return {
    fecha,
    pilares: p.pilares,
    oficial,
    sanShaAnio: shAnio,
    sanShaMes: shMes,
    avisos,
    puntaje,
    recomendadoPara: oficial.bueno,
    evitarHoy: oficial.evitar,
  };
}

/**
 * El puntaje en palabras. "85 de 100" no dice de qué: un número suelto
 * no significa nada sin unidad. Lo que mide es cuánto empuja el día en
 * la dirección de lo que quieras empezar.
 */
function vientoDelDia(puntaje) {
  if (puntaje >= 80) return 'El día empuja muy a favor';
  if (puntaje >= 68) return 'El día empuja a favor';
  if (puntaje >= 55) return 'El día ni empuja ni estorba';
  if (puntaje >= 25) return 'El día opone algo de resistencia';
  return 'El día va en contra';
}

/** Los mejores días de un rango, ordenados. */
function mejoresDias(desde, hasta, natal = null, limite = 10) {
  const out = [];
  let J = _depR('jdn','./motor')(desde.anio, desde.mes, desde.dia);
  const fin = _depR('jdn','./motor')(hasta.anio, hasta.mes, hasta.dia);
  const desdeJD = _depR('desdeJD','./motor');
  for (; J <= fin; J++) {
    const f = desdeJD(J + 0.5);
    out.push(evaluarDia({ anio: f.anio, mes: f.mes, dia: f.dia }, natal));
  }
  return out.sort((a, b) => b.puntaje - a.puntaje).slice(0, limite);
}

/* Exportación universal: CommonJS en Node, global explícito en el navegador.
   Se asigna a globalThis a propósito — los `const` de nivel superior NO se
   cuelgan de window, y depender de eso hace frágil la carga entre archivos. */
(function (raiz) {
  var api = { OFICIALES, oficialDelDia, vientoDelDia, friccionAnio, friccionMes, friccionPersonal, sanSha, evaluarSanSha, evaluarDia, mejoresDias };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
