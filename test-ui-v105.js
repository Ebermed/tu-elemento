const fs = require('fs');

const appHtml = fs.readFileSync('app-v105.html','utf8');
const appJs = fs.readFileSync('app-v105.js','utf8');
const submitFix = fs.readFileSync('app-v105-submit-fix.js','utf8');
const calHtml = fs.readFileSync('calendario-v105.html','utf8');
const calJs = fs.readFileSync('calendario-v105.js','utf8');
const calCopy = fs.readFileSync('calendario-v105-copyfix.js','utf8');
const index = fs.readFileSync('index.html','utf8');
const calendarIndex = fs.readFileSync('calendario.html','utf8');

let fallos = [];
function ok(cond, msg) { if (!cond) fallos.push(msg); }
function has(txt, s, msg) { ok(txt.includes(s), msg || ('Falta: ' + s)); }

try { new Function(appJs); } catch (e) { fallos.push('app-v105.js tiene error de sintaxis: ' + e.message); }
try { new Function(submitFix); } catch (e) { fallos.push('app-v105-submit-fix.js tiene error de sintaxis: ' + e.message); }
try { new Function(calJs); } catch (e) { fallos.push('calendario-v105.js tiene error de sintaxis: ' + e.message); }
try { new Function(calCopy); } catch (e) { fallos.push('calendario-v105-copyfix.js tiene error de sintaxis: ' + e.message); }

function revisarAssets(nombre, html, version) {
  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))(?:\?([^\"]+))?"/g)];
  ok(assets.length >= 2, nombre + ': faltan assets');
  assets.forEach(m => ok(String(m[2]||'').includes('v=' + version), nombre + ': asset con versión distinta: ' + m[1]));
}
revisarAssets('app', appHtml, '10.5.2');
revisarAssets('calendario', calHtml, '10.5.3');

// Formulario desde cero: usa submit nativo y una ruta estable de perfil guardado.
has(appHtml, 'type="submit" class="btn" id="calcular"', 'Ver mi elemento debe ser submit nativo');
has(appHtml, 'app-v105-submit-fix.js?v=10.5.2', 'Falta el controlador robusto del formulario');
has(submitFix, "boton.addEventListener('click', enviar, true)", 'El toque de Ver mi elemento quedó sin captura');
has(submitFix, "forma.addEventListener('submit', enviar, true)", 'El submit del formulario quedó sin captura');
has(submitFix, 'guardarPerfil({', 'La carta nueva debe guardarse antes de abrir');
has(submitFix, "globalThis.location.href = 'index.html?perfil='", 'La carta nueva debe reutilizar la ruta de perfiles guardados');
has(submitFix, 'buscarLugares(texto, 8)', 'La ciudad escrita debe resolverse durante el submit');

// Primera visita y usuarios recurrentes.
has(appJs, "titulo.textContent = 'Bienvenido de nuevo'", 'Falta portada recurrente');
has(appJs, "titulo.textContent = '¿De qué estás hecho?'", 'Falta portada de primera visita');
has(appJs, "href=\"index.html?perfil=", 'Las cartas guardadas deben abrir por ruta real');
has(appJs, "href=\"calendario.html?perfil=", 'Cada carta debe enlazar a su calendario');
has(appJs, "if (mPerfil)", 'La app debe abrir ?perfil=');
has(appJs, "/[?&]nueva=1", 'La app debe abrir ?nueva=1');

// Pulido del mosaico y copy de guardado.
has(appHtml, '.perfilIcono .iconito svg', 'Falta el refuerzo visual del icono en el mosaico');
has(appHtml, 'stroke-width:2.15!important', 'El icono del mosaico debe tener mayor presencia');
has(appHtml, 'Todas tus cartas quedarán guardadas en este navegador para que puedas volver a ellas y usarlas en el calendario.', 'El formulario debe explicar el guardado de todas las cartas');

const appClicks = {
  irForm:'nuevaCarta', paraMi:'ponerTipoCarta', paraOtra:'ponerTipoCarta',
  volverPortada:'pintarPerfilesGuardados', volverCartas:'pintarPerfilesGuardados', volverResultado:"ir('p-resultado')",
  bajarTop:'descargarTarjetaActual', bajarFinal:'descargarTarjetaActual', seguirCarta:'scrollIntoView'
};
for (const [id, fn] of Object.entries(appClicks)) {
  has(appHtml, 'id="'+id+'"', 'Falta control #'+id);
  has(appJs, "$('#"+id+"').addEventListener", '#'+id+' quedó sin manejador');
  has(appJs, fn, '#'+id+' quedó sin acción esperada');
}
has(appJs, 'data-olvidar-perfil', 'Olvidar carta quedó sin ruta');
has(appJs, 'olvidarPerfil(id)', 'Olvidar carta quedó sin acción');
has(appJs, 'btnCiclos.addEventListener', 'Ver ciclos quedó sin click');
has(appJs, "b.addEventListener('click'", 'Los pilares quedaron sin click');

const calClicks = ['olvidar','diaAnt','diaSig','diaHoy','vDia','vMes','mesAnt','mesSig'];
calClicks.forEach(id => {
  has(calHtml, 'id="'+id+'"', 'Calendario: falta #'+id);
  has(calJs, "$('#"+id+"').addEventListener", 'Calendario: #'+id+' quedó sin manejador');
});
has(calHtml, 'id="perfilCal"', 'Falta selector de perfiles');
has(calJs, "$('#perfilCal').addEventListener('change'", 'Selector de perfiles quedó sin cambio');
has(calJs, "b.addEventListener('click'", 'Días del mes quedaron sin click');
has(calJs, "$('#verCartaPerfil').href = 'index.html?perfil='", 'Ver esta carta debe conservar perfil');
has(calHtml, 'href="index.html?nueva=1"', 'Calcular otra carta debe abrir formulario nuevo');
has(calJs, "if(enMes) verDia(hoy,'zoom')", 'Hoy debe salir de mes y abrir el día de hoy');

// Copys editoriales del calendario general.
has(calHtml, 'calendario-v105-copyfix.js?v=10.5.3', 'Falta el ajuste editorial del calendario');
has(calCopy, '<span>Lectura general</span>', 'La lectura general debe sustituir al animal del día cuando faltan cartas');
has(calCopy, '¿Qué es una lectura general?', 'La lectura general debe explicar su significado');
has(calCopy, 'href="index.html?nueva=1">Crear mi carta</a>', 'El tooltip debe enlazar a crear una carta');
has(calCopy, "si.textContent = 'Te recomendamos'", 'Falta el encabezado Te recomendamos');
has(calCopy, "evitar.textContent = 'Es mejor no hacer'", 'Falta el encabezado Es mejor no hacer');

const h1Pos = calHtml.indexOf('¿Cómo viene el día?');
const selectorPos = calHtml.indexOf('id="calPerfilBox"');
const introPos = calHtml.indexOf('Cada fecha mezcla dos ritmos');
ok(h1Pos >= 0 && selectorPos > h1Pos && introPos > selectorPos, 'El texto explicativo volvió al hero del calendario');

has(index, 'app-v105.html?v=10.5.4', 'index.html debe pedir V10.5.4');
has(index, 'location.search', 'index.html pierde ?perfil o ?nueva');
has(calendarIndex, 'calendario-v105.html?v=10.5.3', 'calendario.html debe pedir V10.5.3');
has(calendarIndex, 'location.search', 'calendario.html pierde ?perfil');

if (fallos.length) {
  console.error('\nV10.5 UI: ' + fallos.length + ' problema(s)');
  fallos.forEach(x => console.error('  - ' + x));
  process.exit(1);
}
console.log('V10.5.4 UI: contrato de botones, navegación, copys y mosaico OK');
