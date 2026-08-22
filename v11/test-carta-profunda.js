const M = require('./motor');
const L = require('./lectura');
const LM = require('./lectura-mensual');
const D = require('./carta-profunda');
const C = require('./carta-profunda-contexto');

let ok = 0, fail = 0;
function check(nombre, actual, esperado) {
  const a = typeof actual === 'object' ? JSON.stringify(actual) : String(actual);
  const e = typeof esperado === 'object' ? JSON.stringify(esperado) : String(esperado);
  if (a === e) { console.log('  ok   │ ' + nombre.padEnd(46) + ' │ ' + a); ok++; }
  else { console.error('  FAIL │ ' + nombre.padEnd(46) + ' │ ' + a + ' ≠ ' + e); fail++; }
}
function truth(nombre, valor) { check(nombre, !!valor, true); }
function totalEsperado(carta, claves) {
  return claves.reduce((n,k) => n + 2 + D.tallosOcultos(carta.pilares[k].rama).length, 0);
}

console.log('\n═══ CARTA PROFUNDA · CONTEO COMPLETO ═══');
const carta = M.cuatroPilares({anio:1985,mes:10,dia:17,hora:14,minuto:0,offsetTZ:-6});
const analisis = C.analizarCartaProfunda(carta,{sinHora:false,nacimiento:{anio:1985,mes:10,dia:17,hora:14,minuto:0,sexo:'m'}});
const esperadoCompleto = totalEsperado(carta,['anio','mes','dia','hora']);
check('conteo = visibles + ramas + ocultos', analisis.mezcla.total, esperadoCompleto);
check('detalle del conteo suma el total', analisis.mezcla.detalle.total, esperadoCompleto);
check('cuatro tallos visibles', analisis.mezcla.detalle.visibles, 4);
check('cuatro ramas visibles', analisis.mezcla.detalle.ramas, 4);
truth('conteo completo marcado como completo', analisis.mezcla.completa);
truth('perfil principal calculado', analisis.perfiles.principal.dinamica && analisis.perfiles.principal.dinamica.nombre);
truth('lista de perfiles presentes', analisis.perfiles.apariciones.length > 0);
truth('recurso de equilibrio calculado', analisis.recurso && analisis.recurso.elemento);

const sinHora = C.analizarCartaProfunda(carta,{sinHora:true,nacimiento:{anio:1985,mes:10,dia:17,sinHora:true,sexo:'m'}});
const esperadoSinHora = totalEsperado(carta,['anio','mes','dia']);
check('sin hora excluye todo el pilar provisional', sinHora.mezcla.total, esperadoSinHora);
check('sin hora tiene tres tallos visibles', sinHora.mezcla.detalle.visibles, 3);
check('sin hora tiene tres ramas visibles', sinHora.mezcla.detalle.ramas, 3);
check('sin hora marca conteo parcial', sinHora.mezcla.completa, false);
check('sin hora no calcula brújula', sinHora.extras.brujula, null);

console.log('\n═══ ESTADO DEL DÍA MAESTRO · TABLA DEL MANUAL ═══');
function primeraFecha(anio,mes,elemento) {
  for(let d=10;d<=20;d++) {
    const c=M.cuatroPilares({anio,mes,dia:d,hora:12,minuto:0,offsetTZ:0});
    if(c.diaMaestro.elemento===elemento) return {d,c};
  }
  throw new Error('No se encontró ejemplo para '+elemento+' en '+anio+'-'+mes);
}
[['madera',3,'prospero'],['fuego',3,'fuerte'],['tierra',3,'muerto'],['metal',3,'trampa'],['agua',3,'debil']].forEach(function(x){
  const e=primeraFecha(2026,x[1],x[0]);
  check('primavera · '+x[0],D.estadoDiaMaestro(e.c,D.mezclaDe(e.c,false)).estado,x[2]);
});
[['fuego',6,'prospero'],['tierra',6,'fuerte'],['metal',6,'muerto'],['agua',6,'trampa'],['madera',6,'debil']].forEach(function(x){
  const e=primeraFecha(2026,x[1],x[0]);
  check('verano · '+x[0],D.estadoDiaMaestro(e.c,D.mezclaDe(e.c,false)).estado,x[2]);
});
[['metal',9,'prospero'],['agua',9,'fuerte'],['madera',9,'muerto'],['fuego',9,'trampa'],['tierra',9,'debil']].forEach(function(x){
  const e=primeraFecha(2026,x[1],x[0]);
  check('otoño · '+x[0],D.estadoDiaMaestro(e.c,D.mezclaDe(e.c,false)).estado,x[2]);
});
[['agua',12,'prospero'],['madera',12,'fuerte'],['fuego',12,'muerto'],['tierra',12,'trampa'],['metal',12,'debil']].forEach(function(x){
  const e=primeraFecha(2026,x[1],x[0]);
  check('invierno · '+x[0],D.estadoDiaMaestro(e.c,D.mezclaDe(e.c,false)).estado,x[2]);
});

console.log('\n═══ RECURSO DE EQUILIBRIO · PAUTAS ESTACIONALES ═══');
function reglaBase(mes,elemento){
  const e=primeraFecha(2026,mes,elemento),mez=D.mezclaDe(e.c,false),est=D.estadoDiaMaestro(e.c,mez);
  const limpio={estado:est.estado,estacion:est.estacion,elementoEstacion:est.elementoEstacion,elementoDiaMaestro:est.elementoDiaMaestro,conteoPropio:est.conteoPropio,contradiccion:null};
  return D.candidatosRecurso(e.c,false,mez,limpio).candidatos;
}
check('Tierra en primavera → Fuego', reglaBase(3,'tierra')[0], 'fuego');
check('Fuego en verano → Agua', reglaBase(6,'fuego')[0], 'agua');
check('Metal en primavera → Metal', reglaBase(3,'metal')[0], 'metal');
check('Agua en invierno → Fuego y Tierra', reglaBase(12,'agua').slice(0,2), ['fuego','tierra']);

console.log('\n═══ TU BRÚJULA · EJEMPLOS DEL MANUAL ═══');
check('17 oct 1985 → rama Rata', analisis.extras.brujula.rama.pinyin, 'Zi');
const c2 = M.cuatroPilares({anio:1987,mes:12,dia:14,hora:15,minuto:0,offsetTZ:-6});
const a2 = C.analizarCartaProfunda(c2,{sinHora:false,nacimiento:{anio:1987,mes:12,dia:14,hora:15,minuto:0,sexo:'h'}});
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

console.log('\n' + '─'.repeat(72));
console.log(`${ok} correctas, ${fail} fallidas`);
if (fail) process.exit(1);
