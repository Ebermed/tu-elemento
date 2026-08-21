/** Regresiones para la capa compartida del calendario solar chino. */
const M=require('./motor');
const Z=require('./zonas');
Object.assign(globalThis,M,Z);
const C=require('./calendario-solar');
let ok=0,mal=0;
function c(n,v){console.log(`${v?'  ok  ':' FALLA'} │ ${n}`);v?ok++:mal++;}

console.log('\n═══ MESES SOLARES CHINOS ═══');
const ene=C.resumenMesGregoriano(2026,1,'Asia/Shanghai');
const feb=C.resumenMesGregoriano(2026,2,'Asia/Shanghai');
const ago=C.resumenMesGregoriano(2026,8,'Asia/Shanghai');
c('enero cambia de Rata a Buey',ene.cambia&&ene.final.animal==='Buey');
c('febrero cambia de Buey a Tigre',feb.cambia&&feb.final.animal==='Tigre');
c('agosto cambia de Cabra a Mono',ago.cambia&&ago.primero.animal==='Cabra'&&ago.final.animal==='Mono');

console.log('\n═══ VENTANAS DEL ALMANAQUE ═══');
c('Li Chun cae alrededor del 4 de febrero',feb.cambio&&feb.cambio.mes===2&&feb.cambio.dia>=3&&feb.cambio.dia<=5);
c('Li Qiu cae alrededor del 7/8 de agosto',ago.cambio&&ago.cambio.mes===8&&ago.cambio.dia>=7&&ago.cambio.dia<=8);

console.log('\n═══ AÑO SOLAR EN LI CHUN ═══');
const antes=C.periodoSolarParaFechaCivil(2026,2,1,'Asia/Shanghai',12,0);
const despues=C.periodoSolarParaFechaCivil(2026,2,10,'Asia/Shanghai',12,0);
c('el año solar cambia entre 1 y 10 de febrero',antes.pilarAnio.nombre!==despues.pilarAnio.nombre);
c('después de Li Chun 2026 es año Caballo',String(despues.pilarAnio.rama.animal).toLowerCase()==='caballo');

console.log('\n═══ ZONA HORARIA ═══');
const china=C.resumenMesGregoriano(2026,12,'Asia/Shanghai');
const mexico=C.resumenMesGregoriano(2026,12,'America/Mexico_City');
c('China y México comparten el mismo cambio astronómico',Math.abs(china.final.inicio.jd-mexico.final.inicio.jd)<1e-9);
c('la fecha civil puede diferir por zona',Math.abs(china.cambio.dia-mexico.cambio.dia)<=1);

console.log(`\n${'─'.repeat(54)}\n${ok} correctas, ${mal} fallidas\n`);
process.exit(mal?1:0);
