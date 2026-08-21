/**
 * Arnés de navegador.
 *
 * El arnés anterior solo hacía `new vm.Script(inline)`, que comprueba la
 * SINTAXIS y nada más. Dejó pasar un bloque huérfano que usaba una
 * variable inexistente: sintaxis válida, ReferenceError en ejecución, y
 * el fondo de acuarela dejó de cargar.
 *
 * Este ejecuta el script de verdad contra un DOM simulado.
 */
const fs = require('fs'), vm = require('vm');

function nodoFalso(id) {
  const n = {
    id, _html: '', style: { setProperty(){}, removeProperty(){} },
    classList: { _s:new Set(), add(c){this._s.add(c)}, remove(c){this._s.delete(c)},
                 toggle(c,v){v?this._s.add(c):this._s.delete(c)}, contains(c){return this._s.has(c)} },
    dataset: {}, value: '', textContent: '', hidden: false, options: [], selectedIndex: 0,
    offsetWidth: 100, children: [],
    addEventListener(){}, removeEventListener(){}, appendChild(c){ this.children.push(c); },
    insertAdjacentHTML(){}, setAttribute(k,v){ this[k]=v; }, getAttribute(k){ return this[k]; },
    querySelector(){ return nodoFalso('x'); }, querySelectorAll(){ return []; },
    focus(){}, click(){}, scrollTo(){},
  };
  Object.defineProperty(n, 'innerHTML', {
    get(){ return n._html; },
    set(v){ n._html = String(v); }
  });
  return n;
}

function domFalso() {
  const cache = {};
  const doc = {
    documentElement: nodoFalso('html'),
    querySelector(sel) {
      const k = String(sel);
      if (!cache[k]) cache[k] = nodoFalso(k.replace(/^#/, ''));
      return cache[k];
    },
    querySelectorAll() { return []; },
    createElement(t) { return nodoFalso(t); },
    addEventListener() {},
    _cache: cache,
  };
  return doc;
}

function probar(pagina, modulos) {
  const doc = domFalso();
  const ctx = {
    console: { log(){}, error(){}, warn(){} },
    Math, Date, Intl, JSON, parseInt, parseFloat, String, Number, Array, Object, Error,
    document: doc,
    window: null,
    localStorage: { _d:{}, getItem(k){return this._d[k]||null}, setItem(k,v){this._d[k]=v}, removeItem(k){delete this._d[k]} },
    XMLSerializer: class { serializeToString(){ return '<svg/>'; } },
    URL: { createObjectURL(){ return 'blob:x'; }, revokeObjectURL(){} },
    Blob: class {}, Image: class { set src(v){} },
    setTimeout(){}, navigator: { userAgent:'test' },
  };
  ctx.globalThis = ctx; ctx.window = ctx;
  vm.createContext(ctx);

  const fallos = [];
  for (const m of modulos) {
    try { vm.runInContext(fs.readFileSync(m, 'utf8'), ctx, { filename: m }); }
    catch (e) { fallos.push(`${m}: ${e.message}`); }
  }

  const html = fs.readFileSync(pagina, 'utf8');

  // los archivos que declara existen
  for (const m of html.matchAll(/(?:src|href)="([a-z-]+\.(?:js|css|html))"/g)) {
    if (!fs.existsSync(m[1])) fallos.push(`archivo declarado que no existe: ${m[1]}`);
  }

  // EJECUTAR el script en línea de verdad
  const inline = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
  try { vm.runInContext(inline, ctx, { filename: pagina + ' (script en línea)' }); }
  catch (e) { fallos.push(`al ejecutar: ${e.message}`); }

  // ¿pintó el fondo?
  const fondo = doc._cache['#fondo'];
  if (!fondo || !fondo._html || fondo._html.indexOf('<svg') !== 0) {
    fallos.push('el fondo de acuarela quedó vacío');
  }

  // ids referenciados que no existen en el marcado
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  const refs = new Set([...inline.matchAll(/\$\('#([a-zA-Z0-9]+)'\)/g)].map(m => m[1]));
  const rotas = [...refs].filter(r => !ids.has(r) && !/^pan\d*$/.test(r));
  if (rotas.length) fallos.push(`ids inexistentes: ${rotas.join(', ')}`);

  console.log(`  ${fallos.length ? 'FALLA' : ' ok  '}  ${pagina}`);
  fallos.forEach(f => console.log(`          → ${f}`));
  return fallos.length;
}

const comunes = ['acuarela.js','lugares.js','zonas.js','motor.js','traduccion.js','base.js'];
let total = 0;
total += probar('index.html', [...comunes, 'tarjeta.js', 'lectura.js', 'decadas.js']);
total += probar('calendario.html', [...comunes, 'reglas.js']);
console.log(total ? `\n${total} problema(s)\n` : '\nlas dos páginas ejecutan limpio\n');
process.exit(total ? 1 : 0);
