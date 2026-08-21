const fs = require('fs');
const { JSDOM } = require('jsdom');

function fail(msg, err) {
  console.error('\nRUNTIME FAIL:', msg);
  if (err) console.error(err.stack || err);
  process.exit(1);
}

const html = fs.readFileSync('app-v105.html', 'utf8');
const dom = new JSDOM(html, {
  url: 'https://ebermed.github.io/app-v105.html?nueva=1',
  runScripts: 'outside-only',
  pretendToBeVisual: true
});
const w = dom.window;

w.scrollTo = function(){};
w.confirm = function(){ return true; };
w.HTMLElement.prototype.scrollIntoView = function(){};
w.URL.createObjectURL = function(){ return 'blob:test'; };
w.URL.revokeObjectURL = function(){};
if (!w.HTMLCanvasElement.prototype.getContext) {
  w.HTMLCanvasElement.prototype.getContext = function(){ return null; };
}

const errores = [];
w.addEventListener('error', e => errores.push(e.error || e.message));

const archivos = [
  'acuarela.js','lugares.js','zonas.js','motor.js','traduccion.js',
  'tarjeta.js','lectura.js','decadas.js','base.js','app-v105.js'
];

for (const archivo of archivos) {
  try {
    w.eval(fs.readFileSync(archivo, 'utf8') + '\n//# sourceURL=' + archivo);
  } catch (e) {
    fail('cargando ' + archivo, e);
  }
}

const $ = id => w.document.getElementById(id);
function assert(cond, msg) { if (!cond) fail(msg); }

assert($('calcular'), 'falta #calcular');
assert($('p-form').classList.contains('viva'), '?nueva=1 debe abrir el formulario');

$('dia').value = '20';
$('mes').value = '7';
$('anio').value = '1996';
$('hora').value = '10';
$('minuto').value = '15';
$('sexo').value = 'h';
$('buscaLugar').value = 'León';

$('calcular').click();

if (errores.length) fail('error global durante el click', errores[0]);
if ($('err').textContent.trim()) fail('el formulario mostró error: ' + $('err').textContent.trim());
assert($('p-resultado').classList.contains('viva'), 'Ver mi elemento debe abrir #p-resultado');
assert($('resultadoHero').textContent.trim().length > 0, 'el resultado debe pintar el hero');
assert($('lectura').textContent.trim().length > 0, 'el resultado debe pintar la lectura');
assert(w.localStorage.getItem('tuelemento.perfiles.v2'), 'la carta debe quedar guardada');

// Segunda ruta: carta para alguien más.
w.location.search = '?nueva=1';
$('paraOtra').click();
$('nombreCarta').value = 'Prueba';
$('dia').value = '8';
$('mes').value = '4';
$('anio').value = '1999';
$('hora').value = '9';
$('minuto').value = '20';
$('sexo').value = 'm';
$('buscaLugar').value = 'León';
$('calcular').click();
if ($('err').textContent.trim()) fail('segunda carta mostró error: ' + $('err').textContent.trim());
assert($('p-resultado').classList.contains('viva'), 'Ver su elemento debe abrir resultado');

console.log('V10.5 runtime: generación desde cero OK');
