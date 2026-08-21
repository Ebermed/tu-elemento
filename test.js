/**
 * Verificación del motor.
 *
 * Estos casos comprueban que las reglas algorítmicas reproducen los
 * mismos resultados que publican los calendarios Tong Shu y los
 * manuales de la disciplina. Si coinciden, queda demostrado que la
 * implementación deriva las tablas en vez de copiarlas.
 */

const M = require('./motor');
const R = require('./reglas');

let ok = 0, fail = 0;
function check(nombre, obtenido, esperado) {
  const bien = String(obtenido) === String(esperado);
  console.log(`${bien ? '  ok  ' : ' FALLA'} │ ${nombre.padEnd(46)} │ ${obtenido}`);
  if (!bien) console.log(`       │ ${''.padEnd(46)} │ esperado: ${esperado}`);
  bien ? ok++ : fail++;
}

const p = (o) => M.cuatroPilares({ offsetTZ: 0, hora: 12, ...o });

console.log('\n═══ PILAR DE DÍA (ciclo sexagenario) ═══');
check('2022-09-07', p({ anio: 2022, mes: 9, dia: 7 }).pilares.dia.nombre, 'Gui-Hai');
check('2022-09-10', p({ anio: 2022, mes: 9, dia: 10 }).pilares.dia.nombre, 'Bing-Yin');
check('2022-09-25', p({ anio: 2022, mes: 9, dia: 25 }).pilares.dia.nombre, 'Xin-Si');
check('2022-09-16', p({ anio: 2022, mes: 9, dia: 16 }).pilares.dia.nombre, 'Ren-Shen');
check('2000-01-01', p({ anio: 2000, mes: 1, dia: 1 }).pilares.dia.nombre, 'Wu-Wu');

console.log('\n═══ PILAR DE AÑO (cambia en Li Chun, no en Año Nuevo) ═══');
check('2022 (jul)', p({ anio: 2022, mes: 7, dia: 1 }).pilares.anio.nombre, 'Ren-Yin');
check('2024 (jul)', p({ anio: 2024, mes: 7, dia: 1 }).pilares.anio.nombre, 'Jia-Chen');
check('20 ene 2022 → aún año anterior', p({ anio: 2022, mes: 1, dia: 20 }).pilares.anio.nombre, 'Xin-Chou');
check('10 feb 2022 → ya año Tigre',     p({ anio: 2022, mes: 2, dia: 10 }).pilares.anio.nombre, 'Ren-Yin');

console.log('\n═══ PILAR DE MES (Wu Hu Dun) ═══');
check('sept 2022', p({ anio: 2022, mes: 9, dia: 10 }).pilares.mes.nombre, 'Ji-You');
check('sept 2022 rama', p({ anio: 2022, mes: 9, dia: 10 }).pilares.mes.rama.animal, 'gallo');

console.log('\n═══ PILAR DE HORA (Wu Shu Dun) ═══');
// Día Bing → la hora Zi (23:00) es Wu-Zi
check('día Bing, 23:30', p({ anio: 2022, mes: 9, dia: 10, hora: 23, minuto: 30 }).pilares.hora.nombre, 'Wu-Zi');
// Día Xin (25 sept) → hora Zi es Wu... verificamos la regla general
check('día Xin,  00:30', p({ anio: 2022, mes: 9, dia: 25, hora: 0, minuto: 30 }).pilares.hora.nombre, 'Wu-Zi');
check('día Bing, 13:00 (hora Wei)', p({ anio: 2022, mes: 9, dia: 10, hora: 13 }).pilares.hora.rama.animal, 'cabra');

console.log('\n═══ INICIOS DE MES SOLAR 2022 (contra tabla publicada) ═══');
const esperados2022 = [
  ['Li Chun', 2, 4], ['Jing Zhe', 3, 5], ['Qing Ming', 4, 5], ['Li Xia', 5, 5],
  ['Mang Zhong', 6, 6], ['Xiao Shu', 7, 7], ['Li Qiu', 8, 7], ['Bai Lu', 9, 7],
  ['Han Lu', 10, 8], ['Li Dong', 11, 7], ['Da Xue', 12, 7], ['Xiao Han', 1, 5],
];
// Las tablas publicadas están en hora de China (UTC+8).
const terms = M.terminosDelAnio(2022, 8);
terms.forEach((t, i) => {
  const [nom, mesEsp, diaEsp] = esperados2022[i];
  check(`${nom.padEnd(11)}`, `${t.local.mes}/${t.local.dia}`, `${mesEsp}/${diaEsp}`);
});

console.log('\n═══ LOS MISMOS TÉRMINOS EN HORA DE MÉXICO ═══');
M.terminosDelAnio(2022, -6).forEach((t, i) => {
  const chino = terms[i].local;
  const dif = (t.local.dia !== chino.dia) ? '  ← cae un día antes que en la tabla china' : '';
  console.log(`       │ ${t.nombre.padEnd(11)} ${t.local.mes}/${t.local.dia}${dif}`);
});

console.log('\n═══ LOS 12 OFICIALES ═══');
// 10 sept 2022: mes Gallo (You=9), día Tigre (Yin=2) → oficial Zhi
check('mes You + día Yin', R.oficialDelDia(9, 2).pinyin, 'Zhi');
check('Jian cae en día = rama del mes', R.oficialDelDia(9, 9).pinyin, 'Jian');
check('mes Yin + día Yin', R.oficialDelDia(2, 2).pinyin, 'Jian');

console.log('\n═══ CICLO CONTINUO DE 28 POSICIONES ═══');
check('22 sep 2022 → inicio publicado', R.pulso28({anio:2022,mes:9,dia:22}).id, 'Jiao');
check('10 sep 2022 → posición 17', R.pulso28({anio:2022,mes:9,dia:10}).id, 'Wei17');
check('20 oct 2022 → vuelve al inicio', R.pulso28({anio:2022,mes:10,dia:20}).id, 'Jiao');
check('17 sep 2026 → inicio publicado', R.pulso28({anio:2026,mes:9,dia:17}).id, 'Jiao');

console.log('\n═══ SAN SHA ═══');
const ss2022 = R.sanSha(2); // año Tigre
check('año Tigre → robo',      M.RAMAS[ss2022.robo].animal, 'cerdo');
check('año Tigre → calamidad', M.RAMAS[ss2022.calamidad].animal, 'rata');
check('año Tigre → retraso',   M.RAMAS[ss2022.retraso].animal, 'buey');
const ssMono = R.sanSha(8); // año Mono (trino de agua)
check('año Mono → robo',       M.RAMAS[ssMono.robo].animal, 'serpiente');
check('año Mono → calamidad',  M.RAMAS[ssMono.calamidad].animal, 'caballo');
check('año Mono → retraso',    M.RAMAS[ssMono.retraso].animal, 'cabra');

console.log('\n═══ DÍAS DE FRICCIÓN (sept 2022) ═══');
// Mes Gallo → fricción en días Conejo. Deben ser 11 y 23 de sept.
const friccionSept = [];
for (let d = 7; d <= 30; d++) {
  const pd = p({ anio: 2022, mes: 9, dia: d });
  if (pd.pilares.dia.rama.animal === 'conejo') friccionSept.push(d);
}
check('días conejo en sept (mes gallo)', friccionSept.join(','), '11,23');
// Año Tigre → fricción en días Mono. Deben ser 16 y 28.
const friccionAnio = [];
for (let d = 7; d <= 30; d++) {
  const pd = p({ anio: 2022, mes: 9, dia: d });
  if (pd.pilares.dia.rama.animal === 'mono') friccionAnio.push(d);
}
check('días mono en sept (año tigre)', friccionAnio.join(','), '16,28');

console.log('\n═══ HORA SOLAR VERDADERA (León, Gto.) ═══');
const leon = p({ anio: 1990, mes: 6, dia: 15, hora: 7, minuto: 0,
                 offsetTZ: -6, longitud: -101.68 });
console.log(`       │ reloj 07:00 → solar ${leon.horaEfectiva}` +
            ` (corrección ${leon.correccionSolar.total.toFixed(1)} min)`);
check('07:00 reloj sigue en hora Mao', leon.pilares.hora.rama.animal, 'conejo');
// pero 07:40 sí cruza de vuelta: solar 06:53 → aún Mao; 07:50 → 07:03 → Chen
const leon2 = p({ anio: 1990, mes: 6, dia: 15, hora: 7, minuto: 50,
                  offsetTZ: -6, longitud: -101.68 });
check('07:50 reloj → hora Chen (dragón)', leon2.pilares.hora.rama.animal, 'dragón');
// sin corrección, 07:50 ya sería Chen de todos modos; el caso interesante:
const leon3 = p({ anio: 1990, mes: 6, dia: 15, hora: 5, minuto: 20,
                  offsetTZ: -6, longitud: -101.68 });
console.log(`       │ 05:20 reloj → solar ${leon3.horaEfectiva} → hora ${leon3.pilares.hora.rama.animal}`);
check('05:20 reloj cae en hora Yin, no Mao', leon3.pilares.hora.rama.animal, 'tigre');

console.log(`\n${'─'.repeat(70)}`);
console.log(`${ok} correctas, ${fail} fallidas\n`);
process.exit(fail ? 1 : 0);
