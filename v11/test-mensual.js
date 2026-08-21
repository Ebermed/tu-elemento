/** Verificación del motor mensual con vocabulario propio de Tu Elemento. */
const M=require('./motor');
const L=require('./lectura-mensual');
let ok=0,mal=0;
function c(n,a,b){const g=String(a)===String(b);console.log(`${g?'  ok  ':' FALLA'} │ ${n.padEnd(34)} │ ${a}`);if(!g)console.log(`       │ ${''.padEnd(34)} │ esperado: ${b}`);g?ok++:mal++;}

console.log('\n═══ DINÁMICAS PARA DÍA MAESTRO JIA ═══');
const dinamicas=[
  ['Jia','Espejo'],['Yi','Contrapunto'],['Bing','Flujo'],['Ding','Impacto'],['Wu','Oportunidad'],
  ['Ji','Concreción'],['Geng','Desafío'],['Xin','Estructura'],['Ren','Intuición'],['Gui','Aprendizaje']
];
dinamicas.forEach(([t,d])=>c('Jia + '+t,L.dinamicaMensualDeTallo('Jia',t).nombre,d));

console.log('\n═══ TALLOS OCULTOS ═══');
c('Mono / Shen',L.tallosOcultosMes('Shen').map(x=>x.pinyin).join(','),'Geng,Ren,Wu');
c('Buey / Chou',L.tallosOcultosMes('Chou').map(x=>x.pinyin).join(','),'Ji,Gui,Xin');
c('Cerdo / Hai',L.tallosOcultosMes('Hai').map(x=>x.pinyin).join(','),'Ren,Jia');

console.log('\n═══ 12 RITMOS PARA JIA ═══');
const ritmos=[
  ['Yin','Despegue'],['Mao','Cumbre'],['Chen','Repliegue'],['Si','Ajuste'],
  ['Wu','Cierre'],['Wei','Resguardo'],['Shen','Desprendimiento'],['You','Semilla'],
  ['Xu','Incubación'],['Hai','Brote'],['Zi','Transición'],['Chou','Presencia']
];
ritmos.forEach(([r,e])=>c('Jia + '+r,L.ritmoCicloMes('Jia',r).nombre,e));

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
c('detecta fricción con centro',ints.some(x=>x.pilar==='dia'&&x.tipo==='friccion'),true);

console.log('\n═══ LECTURA COMPLETA ═══');
const lectura=L.lecturaMensual(carta,{anio:2026,mes:8,sinHora:false});
c('tiene dinámica propia',!!lectura.dinamicaPrincipal.nombre,true);
c('tiene ritmo propio',!!lectura.ritmo.nombre,true);
c('12 ritmos editoriales',L.TE_RITMOS_MES.length,12);
c('10 dinámicas editoriales',Object.keys(L.TE_DINAMICAS_MES).length,10);

console.log(`\n${'─'.repeat(62)}\n${ok} correctas, ${mal} fallidas\n`);
process.exit(mal?1:0);
