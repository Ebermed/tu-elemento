const fs = require('fs');

const html = fs.readFileSync('app-v105.html','utf8');
const perf = fs.readFileSync('app-v106-performance.js','utf8');
const pilares = fs.readFileSync('app-v106-pilares.js','utf8');
const index = fs.readFileSync('index.html','utf8');

let fallos = [];
function has(txt, s, msg) { if (!txt.includes(s)) fallos.push(msg || ('Falta: ' + s)); }

try { new Function(perf); } catch (e) { fallos.push('app-v106-performance.js: ' + e.message); }
try { new Function(pilares); } catch (e) { fallos.push('app-v106-pilares.js: ' + e.message); }

has(html, 'app-v106-performance.js?v=10.6.0', 'La carta debe cargar la capa ligera antes del controlador principal');
has(html, 'app-v106-pilares.js?v=10.6.0', 'La carta debe cargar el controlador estable de pilares');
has(index, 'app-v105.html?v=10.6.0', 'La entrada pública debe pedir V10.6.0');
has(perf, "globalThis.activarApariciones = function", 'La capa ligera debe sustituir el revelado pesado');
has(perf, ".hoja, .inter, .vidrio, .revela", 'Los botones .col deben quedar fuera del revelado');
has(pilares, "document.addEventListener('click'", 'Los pilares necesitan captura global');
has(pilares, "}, true);", 'El click de pilares debe ejecutarse en fase de captura');
has(pilares, 'stopImmediatePropagation', 'El handler antiguo debe quedar fuera del toque');
has(pilares, "bloque.querySelectorAll('.col[data-p]')", 'El cierre debe limitarse al bloque de pilares');
has(pilares, "bloque.querySelectorAll('.panel')", 'El repintado debe limitarse a sus cuatro paneles');

if (fallos.length) {
  console.error('V10.6 pilares: ' + fallos.length + ' problema(s)');
  fallos.forEach(x => console.error(' - ' + x));
  process.exit(1);
}
console.log('V10.6 pilares: contrato de estabilidad OK');
