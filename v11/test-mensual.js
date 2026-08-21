/** Verificación del motor mensual contra tablas y carta de referencia. */
const M=require('./motor');
const L=require('./lectura-mensual');
let ok=0,mal=0;
function c(n,a,b){const g=String(a)===String(b);console.log(`${g?'  ok  ':' FALLA'} │ ${n.padEnd(34)} │ ${a}`);if(!g)console.log(`       │ ${''.padEnd(34)} │ esperado: ${b}`);g?ok++:mal++;}

console.log('\n═══ PERFILES PARA DÍA MAESTRO JIA ═══');
const perfiles=[['Jia','RD'],['Yi','RI'],['Bing','CD'],['Ding','CI'],['Wu','PD'],['Ji','PI'],['Geng','ED'],['Xin','EI'],['Ren','ID'],['Gui','II']];
perfiles.forEach(([t,p])=>c('Jia + '+t,L.perfilMensualDeTallo('Jia',t).codigo,p));

console.log('\n═══ TALLOS OCULTOS ═══');
c('Mono / Shen',L.tallosOcultosMes('Shen').map(x=>x.pinyin).join(','),'Geng,Ren,Wu');
c('Buey / Chou',L.tallosOcultosMes('Chou').map(x=>x.pinyin).join(','),'Ji,Gui,Xin');
c('Cerdo / Hai',L.tallosOcultosMes('Hai').map(x=>x.pinyin).join(','),'Ren,Jia');

console.log('\n═══ 12 ETAPAS PARA JIA ═══');
const etapas=[
  ['Yin','Florecer'],['Mao','Prosperar'],['Chen','Descansar'],['Si','Enfermar'],
  ['Wu','Morir'],['Wei','Enterrar'],['Shen','Extinguir'],['You','Concebir'],
  ['Xu','Nutrir'],['Hai','Crecer'],['Zi','Renovar'],['Chou','Coronar']
];
etapas.forEach(([r,e])=>c('Jia + '+r,L.etapaCrecimientoMes('Jia',r).clasico,e));

console.log('\n═══ PILARES MENSUALES 2024 / 2025 ═══');
const meses=[
  [2024,2,'Bing-Yin'],[2024,3,'Ding-Mao'],[2024,4,'Wu-Chen'],[2024,5,'Ji-Si'],
  [2024,6,'Geng-Wu'],[2024,7,'Xin-Wei'],[2024,8,'Ren-Shen'],[2024,9,'Gui-You'],
  [2024,10,'Jia-Xu'],[2024,11,'Yi-Hai'],[2024,12,'Bing-Zi'],[2025,1,'Ding-Chou']
];
meses.forEach(([a,m,p])=>c(`${a}-${String(m).padStart(2,'0')}`,L.pilarMensualPara(a,m).pilares.mes.nombre,p));

console.log('\n═══ INTERACCIONES ═══');
const carta=M.cuatroPilares({anio:1978,mes:5,dia:22,hora:12,offsetTZ:0});
const ramaDia=carta.pilares.dia.rama;
const op=M.RAMAS[M.choque(M.RAMAS.indexOf(ramaDia))];
const ints=L.interaccionesMensuales(carta,op,false);
c('detecta choque con centro',ints.some(x=>x.pilar==='dia'&&x.tipo==='choque'),true);

console.log(`\n${'─'.repeat(62)}\n${ok} correctas, ${mal} fallidas\n`);
process.exit(mal?1:0);
