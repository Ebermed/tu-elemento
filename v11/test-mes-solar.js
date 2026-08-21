const S=require('./mes-solar');
let ok=0,fail=0;
function check(n,a,b){const bien=String(a)===String(b);console.log(`${bien?'  ok  ':' FALLA'} │ ${n.padEnd(38)} │ ${a}`);if(!bien)console.log(`       │ ${''.padEnd(38)} │ esperado: ${b}`);bien?ok++:fail++;}
function md(d){return `${d.mes}/${d.dia}`;}

console.log('\n═══ CORTES SOLARES EN HORA DE CHINA ═══');
[
  [2022,2,'2/4','3/5'],
  [2022,3,'3/5','4/5'],
  [2022,8,'8/7','9/7'],
  [2022,9,'9/7','10/8'],
  [2022,12,'12/7','1/5'],
  [2023,1,'1/5','2/4']
].forEach(([a,m,ini,fin])=>{
  const p=S.periodoSolarParaMes(a,m,'Asia/Shanghai');
  check(`${a}-${String(m).padStart(2,'0')} inicio`,md(p.inicioLocal),ini);
  check(`${a}-${String(m).padStart(2,'0')} fin`,md(p.finLocal),fin);
});

console.log('\n═══ MISMO INSTANTE, FECHA LOCAL MÉXICO ═══');
const dic=S.periodoSolarParaMes(2022,12,'America/Mexico_City');
check('Da Xue 2022 en CDMX',md(dic.inicioLocal),'12/6');

console.log('\n═══ CORTE DE AÑO EN LI CHUN ═══');
const ene=S.periodoSolarParaMes(2022,1,'Asia/Shanghai');
const feb=S.periodoSolarParaMes(2022,2,'Asia/Shanghai');
check('enero conserva año anterior',ene.pilarAnio.nombre,'Xin-Chou');
check('febrero entra año nuevo solar',feb.pilarAnio.nombre,'Ren-Yin');
check('febrero = mes Tigre',feb.pilar.rama.animal,'tigre');
check('enero = mes Buey',ene.pilar.rama.animal,'buey');

console.log(`\n${'─'.repeat(66)}\n${ok} correctas, ${fail} fallidas\n`);
process.exit(fail?1:0);
