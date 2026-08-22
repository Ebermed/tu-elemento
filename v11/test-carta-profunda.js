const M = require('./motor');
const L = require('./lectura');
const LM = require('./lectura-mensual');
const C = require('./carta-profunda');

let ok = 0, fail = 0;
function check(nombre, actual, esperado) {
  const a = typeof actual === 'object' ? JSON.stringify(actual) : String(actual);
  const e = typeof esperado === 'object' ? JSON.stringify(esperado) : String(esperado);
  if (a === e) { console.log('  ok   │ ' + nombre.padEnd(42) + ' │ ' + a); ok++; }
  else { console.error('  FAIL │ ' + nombre.padEnd(42) + ' │ ' + a + ' ≠ ' + e); fail++; }
}
function truth(nombre, valor) { check(nombre, !!valor, true); }

console.log('\n═══ CARTA PROFUNDA · CAPAS BASE ═══');
const carta = M.cuatroPilares({anio:1985,mes:10,dia:17,hora:14,minuto:0,offsetTZ:-6});
const analisis = C.analizarCartaProfunda(carta,{sinHora:false,nacimiento:{anio:1985,mes:10,dia:17,hora:14,minuto:0,sexo:'m'}});
check('mezcla conserva ocho caracteres', analisis.mezcla.total, 8);
truth('perfil principal calculado', analisis.perfiles.principal.dinamica && analisis.perfiles.principal.dinamica.nombre);
truth('lista de perfiles presentes', analisis.perfiles.apariciones.length > 0);
truth('recurso de equilibrio calculado', analisis.recurso && analisis.recurso.elemento);

console.log('\n═══ TU BRÚJULA · EJEMPLOS DEL MANUAL ═══');
// Ejemplo del manual: 17 oct 1985, 14:00 → mes Perro (11), hora Cabra (8) → Rata (1).
check('17 oct 1985 → rama Rata', analisis.extras.brujula.rama.pinyin, 'Zi');
const c2 = M.cuatroPilares({anio:1987,mes:12,dia:14,hora:15,minuto:0,offsetTZ:-6});
const a2 = C.analizarCartaProfunda(c2,{sinHora:false,nacimiento:{anio:1987,mes:12,dia:14,hora:15,minuto:0,sexo:'h'}});
// Ejemplo del manual: mes Rata (1), hora Mono (9) → Gallo (10).
check('14 dic 1987 → rama Gallo', a2.extras.brujula.rama.pinyin, 'You');
check('14 dic 1987 → tallo Ji', a2.extras.brujula.tallo.pinyin, 'Ji');

console.log('\n═══ TU PUNTO DE PARTIDA ═══');
const mesT = M.TALLOS.indexOf(carta.pilares.mes.tallo);
const mesR = M.RAMAS.indexOf(carta.pilares.mes.rama);
check('tallo = mes + 1', M.TALLOS.indexOf(analisis.extras.puntoPartida.tallo), (mesT + 1) % 10);
check('rama = mes + 3', M.RAMAS.indexOf(analisis.extras.puntoPartida.rama), (mesR + 3) % 12);

console.log('\n═══ VACÍOS Y NUDO DE FONDO ═══');
check('siempre hay dos ramas vacías', analisis.vacios.ramas.length, 2);
check('nudo coincide con vacíos presentes', analisis.nudo.items.length, analisis.vacios.presentes.length);

console.log('\n═══ VOCABULARIO EDITORIAL ═══');
const propios = ['Espejo','Contrapunto','Flujo','Impacto','Oportunidad','Concreción','Desafío','Estructura','Intuición','Aprendizaje'];
truth('perfil usa nombres propios', propios.includes(analisis.perfiles.principal.dinamica.nombre));
truth('recurso usa nombres propios', propios.includes(analisis.recurso.dinamica.nombre));

console.log('\n' + '─'.repeat(66));
console.log(`${ok} correctas, ${fail} fallidas`);
if (fail) process.exit(1);
