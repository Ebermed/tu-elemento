const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

function fail(msg, err) {
  console.error('\nRUNTIME FAIL:', msg);
  if (err) console.error(err.stack || err);
  process.exit(1);
}
function assert(cond, msg) { if (!cond) fail(msg); }

const html = fs.readFileSync('app-v105.html', 'utf8');
const archivos = [
  'acuarela.js','lugares.js','zonas.js','motor.js','traduccion.js',
  'tarjeta.js','lectura.js','decadas.js','base.js','app-v105.js','app-v105-submit-fix.js'
];

function crearDom(url, storage) {
  const vc = new VirtualConsole();
  // jsdom reporta la navegación como “not implemented”; aquí la ruta se
  // comprueba en una segunda carga real del DOM.
  vc.on('jsdomError', e => {
    if (!String(e.message || '').includes('navigation')) console.error('JSDOM:', e.message);
  });
  const dom = new JSDOM(html, {
    url,
    runScripts:'outside-only',
    pretendToBeVisual:true,
    virtualConsole:vc
  });
  const w = dom.window;
  w.scrollTo = function(){};
  w.confirm = function(){ return true; };
  w.HTMLElement.prototype.scrollIntoView = function(){};
  w.URL.createObjectURL = function(){ return 'blob:test'; };
  w.URL.revokeObjectURL = function(){};

  if (storage) {
    Object.keys(storage).forEach(k => w.localStorage.setItem(k, storage[k]));
  }

  const errores = [];
  w.addEventListener('error', e => errores.push(e.error || e.message));
  for (const archivo of archivos) {
    try {
      w.eval(fs.readFileSync(archivo, 'utf8') + '\n//# sourceURL=' + archivo);
    } catch (e) {
      fail('cargando ' + archivo, e);
    }
  }
  if (errores.length) fail('error global al iniciar la app', errores[0]);
  return { dom, w };
}

// 1) Alta desde cero.
const primera = crearDom('https://ebermed.github.io/app-v105.html?nueva=1');
const w = primera.w;
const $ = id => w.document.getElementById(id);
assert($('p-form').classList.contains('viva'), '?nueva=1 debe abrir el formulario');
assert($('calcular').type === 'submit', 'Ver mi elemento debe conservar semántica submit');

$('dia').value = '20';
$('mes').value = '7';
$('anio').value = '1996';
$('hora').value = '10';
$('minuto').value = '15';
$('sexo').value = 'h';
$('buscaLugar').value = 'León';
$('calcular').click();

if ($('err').textContent.trim()) fail('el alta mostró error: ' + $('err').textContent.trim());
const bruto = w.localStorage.getItem('tuelemento.perfiles.v2');
assert(bruto, 'el click debe guardar la carta antes de navegar');
const estado = JSON.parse(bruto);
assert(estado.perfiles && estado.perfiles.length === 1, 'debe existir una carta guardada');
const perfil = estado.perfiles[0];
assert(perfil.id, 'la carta guardada debe tener ID');
assert(perfil.nacimiento.ciudad === 'León', 'la ciudad debe resolverse al tocar el botón');

// 2) La ruta que recibe el botón debe reconstruir y mostrar esa carta.
const storage = { 'tuelemento.perfiles.v2': bruto };
const segunda = crearDom('https://ebermed.github.io/app-v105.html?perfil=' + encodeURIComponent(perfil.id), storage);
const w2 = segunda.w;
const $2 = id => w2.document.getElementById(id);
assert($2('p-resultado').classList.contains('viva'), '?perfil= debe abrir el resultado guardado');
assert($2('resultadoHero').textContent.trim().length > 0, 'el resultado debe pintar el hero');
assert($2('lectura').textContent.trim().length > 0, 'el resultado debe pintar la lectura completa');

console.log('V10.5.2 runtime: alta → guardado → reapertura de carta OK');
