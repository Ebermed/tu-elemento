/**
 * Verificación de las décadas contra una carta generada de forma
 * independiente por software profesional (19 enero 2010, 09:12, masculino).
 * Coincidir en los cuatro pilares Y en las nueve décadas demuestra que el
 * método está bien derivado, no copiado.
 */
const M=require('./motor'), D=require('./decadas');
let ok=0, mal=0;
const c=(n,a,b)=>{const g=String(a)===String(b);
  console.log(`${g?'  ok  ':' FALLA'} │ ${n.padEnd(34)} │ ${a}`);
  if(!g)console.log(`       │ ${''.padEnd(34)} │ esperado: ${b}`); g?ok++:mal++;};

const carta=M.cuatroPilares({anio:2010,mes:1,dia:19,hora:9,minuto:12,
                             zona:'America/Mexico_City',longitud:-101.68});

console.log('\n═══ LOS CUATRO PILARES ═══');
c('año  (antes de Li Chun)', carta.pilares.anio.nombre, 'Ji-Chou');
c('mes',  carta.pilares.mes.nombre,  'Ding-Chou');
c('día',  carta.pilares.dia.nombre,  'Ji-Si');
// DIFERENCIA DE ESCUELA DOCUMENTADA, no un fallo.
// La carta de referencia da hora Víbora (Ji-Si) usando la hora de reloj.
// Nosotros aplicamos hora solar verdadera: en León la corrección es de
// ~47 min, así que las 09:12 del reloj son las 08:25 solares, que caen en
// Dragón (7:00-8:59) y no en Víbora (9:00-10:59). Ambas posturas existen
// en la disciplina; la nuestra es astronómicamente más exacta y está
// declarada en el README.
c('hora (con hora solar verdadera)', carta.pilares.hora.nombre, 'Wu-Chen');
const sinCorreccion = M.cuatroPilares({anio:2010,mes:1,dia:19,hora:9,minuto:12,
                                       zona:'America/Mexico_City'});
c('hora sin corregir → coincide con la referencia', sinCorreccion.pilares.hora.nombre, 'Ji-Si');

console.log('\n═══ DÉCADAS (大运) ═══');
const d=D.decadas(carta,'h',9);
c('dirección', d.direccion, 'atrás');
c('edad de arranque', d.edadInicio, 5);
const esperadas=[[5,'Bing-Zi'],[15,'Yi-Hai'],[25,'Jia-Xu'],[35,'Gui-You'],
                 [45,'Ren-Shen'],[55,'Xin-Wei'],[65,'Geng-Wu'],[75,'Ji-Si'],[85,'Wu-Chen']];
esperadas.forEach(([edad,pil],i)=>{
  c(`a los ${edad}`, `${d.lista[i].desde} ${d.lista[i].nombre}`, `${edad} ${pil}`);
});

console.log('\n═══ DIRECCIÓN SEGÚN SEXO Y POLARIDAD ═══');
// mismo nacimiento, sexo distinto → dirección opuesta
c('mismo nacimiento, mujer', D.decadas(carta,'m',2).direccion, 'adelante');
// año yang
const yang=M.cuatroPilares({anio:2024,mes:6,dia:15,hora:12,zona:'America/Mexico_City',longitud:-99.13});
c('año yang + hombre', D.decadas(yang,'h',2).direccion, 'adelante');
c('año yang + mujer',  D.decadas(yang,'m',2).direccion, 'atrás');

console.log(`\n${'─'.repeat(60)}\n${ok} correctas, ${mal} fallidas\n`);
process.exit(mal?1:0);
