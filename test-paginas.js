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
  const eventos = {};
  const n = {
    id, _html: '', style: { setProperty(k,v){this[k]=v}, removeProperty(k){delete this[k]} },
    classList: { _s:new Set(), add(c){this._s.add(c)}, remove(c){this._s.delete(c)}, toggle(c,v){v?this._s.add(c):this._s.delete(c)}, contains(c){return this._s.has(c)} },
    dataset: {}, value: '', textContent: '', hidden: false, options: [], selectedIndex: 0, offsetWidth: 100, children: [],
    addEventListener(t,fn){ (eventos[t]||(eventos[t]=[])).push(fn); }, removeEventListener(){}, appendChild(c){this.children.push(c)}, insertAdjacentHTML(){}, setAttribute(k,v){this[k]=v}, getAttribute(k){return this[k]},
    querySelector(){return nodoFalso('x')}, querySelectorAll(){return []}, focus(){}, scrollTo(){}, scrollIntoView(){},
    requestSubmit(){ (eventos.submit||[]).forEach(fn=>fn.call(n,{target:n,preventDefault(){}})); },
    click(){ (eventos.click||[]).forEach(fn=>fn.call(n,{target:n,preventDefault(){}})); }, _eventos:eventos,
  };
  Object.defineProperty(n,'innerHTML',{get(){return n._html},set(v){n._html=String(v)}});
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
    setTimeout(){}, scrollTo(){}, navigator: { userAgent:'test' },
  };
  ctx.localStorage._d['tuelemento.nacimiento.v1'] = JSON.stringify({
    anio:1996, mes:7, dia:20, hora:10, minuto:15, sinHora:false,
    zona:'America/Mexico_City', lon:-101.68, ciudad:'León'
  });
  ctx.globalThis = ctx; ctx.window = ctx;
  vm.createContext(ctx);

  const fallos = [];
  for (const m of modulos) {
    try { vm.runInContext(fs.readFileSync(m, 'utf8'), ctx, { filename: m }); }
    catch (e) { fallos.push(`${m}: ${e.message}`); }
  }

  // V10 · varias cartas y migración desde la memoria anterior.
  let perfilPruebaId = null;
  if (typeof ctx.listarPerfiles !== 'function' || typeof ctx.guardarPerfil !== 'function' ||
      typeof ctx.perfilCalendario !== 'function' || typeof ctx.olvidarPerfil !== 'function') {
    fallos.push('base.js dejó incompleta la API de perfiles');
  } else {
    const migradas = ctx.listarPerfiles();
    if (migradas.length !== 1 || migradas[0].tipo !== 'yo') fallos.push('la carta anterior no migró como perfil propio');
    const anju = ctx.guardarPerfil({ tipo:'otra', nombre:'Anju', nacimiento:{
      anio:1999, mes:4, dia:8, hora:9, minuto:20, sinHora:false,
      zona:'America/Mexico_City', lon:-101.68, ciudad:'León', sexo:'m'
    }});
    if (!anju || ctx.listarPerfiles().length !== 2) fallos.push('guardar una segunda carta falló');
    const yoActualizado = ctx.guardarPerfil({ tipo:'yo', nacimiento:{
      anio:1996, mes:7, dia:20, hora:11, minuto:5, sinHora:false,
      zona:'America/Mexico_City', lon:-101.68, ciudad:'León', sexo:'h'
    }});
    if (!yoActualizado || yoActualizado.id !== migradas[0].id || ctx.listarPerfiles().length !== 2) {
      fallos.push('actualizar la carta propia creó un duplicado');
    }
    if (anju) {
      perfilPruebaId = anju.id;
      ctx.seleccionarPerfilCalendario(anju.id);
      const activa = ctx.perfilCalendario();
      if (!activa || activa.id !== anju.id) fallos.push('el calendario no conserva la carta elegida');
      if (!ctx.cartaDesdePerfil(anju)) fallos.push('una carta guardada no se puede reconstruir');
    }
    const temporal = ctx.guardarPerfil({ tipo:'otra', nombre:'Temporal', nacimiento:{
      anio:2001, mes:1, dia:2, hora:12, minuto:0, sinHora:true,
      zona:'America/Mexico_City', lon:-99.13, ciudad:'CDMX'
    }});
    if (!temporal) fallos.push('crear una carta temporal falló');
    else {
      ctx.olvidarPerfil(temporal.id);
      if (ctx.leerPerfil(temporal.id) || ctx.listarPerfiles().length !== 2) fallos.push('olvidar una carta dejó datos guardados');
    }
  }

  const html = fs.readFileSync(pagina, 'utf8');

  // los archivos que declara existen
  for (const m of html.matchAll(/(?:src|href)="([a-z-]+\.(?:js|css|html))"/g)) {
    if (!fs.existsSync(m[1])) fallos.push(`archivo declarado que no existe: ${m[1]}`);
  }

  // EJECUTAR el script en línea de verdad
  if (perfilPruebaId) ctx.location = { search: pagina === 'index.html' ? '?perfil=' + perfilPruebaId : '' };
  const inline = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
  try { vm.runInContext(inline, ctx, { filename: pagina + ' (script en línea)' }); }
  catch (e) { fallos.push(`al ejecutar: ${e.message}`); }

  if (pagina === 'index.html') {
    const biblio = doc._cache['#bibliotecaCartas'];
    const listaP = doc._cache['#listaPerfiles'];
    if (!biblio || biblio.hidden) fallos.push('la biblioteca de cartas guardadas quedó oculta');
    if (!listaP || !String(listaP.innerHTML).includes('Anju')) fallos.push('la biblioteca no muestra la segunda carta');
    const resultado = doc._cache['#p-resultado'];
    if (!resultado || !resultado.classList.contains('viva')) fallos.push('abrir una carta guardada no lleva al resultado');
  }
  if (pagina === 'calendario.html') {
    const boxP = doc._cache['#calPerfilBox'];
    const selP = doc._cache['#perfilCal'];
    if (!boxP || boxP.hidden) fallos.push('el selector de carta del calendario quedó oculto');
    if (!selP || !String(selP.innerHTML).includes('Anju')) fallos.push('el calendario no lista las cartas guardadas');
  }

  // ¿pintó el fondo? Acepta SVG en DOM o el data-URI rasterizado.
  const fondo = doc._cache['#fondo'];
  const fondoSvg = !!(fondo && fondo._html && fondo._html.indexOf('<svg') === 0);
  const fondoBg = !!(fondo && fondo.style && String(fondo.style.backgroundImage || '').includes('data:image/svg+xml'));
  if (!fondoSvg && !fondoBg) fallos.push('el fondo de acuarela quedó vacío');

  if (typeof ctx.activarApariciones !== 'function') fallos.push('base.js no exporta activarApariciones');

  // Terminología editorial visible: las claves tradicionales quedan en JS,
  // mientras las páginas usan nombres propios de producto.
  const terminosLegado = ['Día Maestro','Da Yun','Kong Wang','San Sha','Ze Ri Xue','oficial del día'];
  for (const t of terminosLegado) {
    if (html.includes(t)) fallos.push(`término técnico expuesto en HTML: ${t}`);
  }
  if (pagina === 'calendario.html') {
    if (!html.includes('Pulso de 28 días')) fallos.push('el calendario dejó de mostrar la capa de 28 días');
    if (!html.includes('Ritmo de 12 pasos')) fallos.push('el calendario dejó de mostrar la capa de 12 ritmos');
    const reglasTxt = fs.readFileSync('reglas.js','utf8').toLowerCase();
    const actividadesFueraDeProducto = ['feng shui','muebles','colocar puerta','colocar agua','funeral','hospital','tratamiento médico','cirugía','remodelación'];
    for (const t of actividadesFueraDeProducto) {
      if (reglasTxt.includes(t)) fallos.push(`actividad ajena al calendario cotidiano: ${t}`);
    }
    const traducciones12 = new Set(['instalar','eliminar','completo','balance','estable','iniciado','destrucción','peligro','éxito','recibir','abierto','cerrado']);
    const traducciones28 = new Set(['bienes','pérdida','externo','legado','disputas','ayuda','materia','materialismo','desastre','academia','daños','enfermedad','expansión','prosperidad','retos','bienestar','público','maldad','armonía','juez','renovación','construcción','fantasma','sauce','estrella','empate','ala','carruaje']);
    const solapadas12 = (ctx.OFICIALES || []).map(x=>x.nombre.toLowerCase()).filter(x=>traducciones12.has(x));
    const solapadas28 = (ctx.PULSOS_28 || []).map(x=>x.nombre.toLowerCase()).filter(x=>traducciones28.has(x));
    if (solapadas12.length) fallos.push(`etiquetas de 12 ritmos solapadas: ${solapadas12.join(', ')}`);
    if (solapadas28.length) fallos.push(`etiquetas de 28 pulsos solapadas: ${solapadas28.join(', ')}`);
  }

  if (pagina === 'index.html') {
    const btn = doc._cache['#irForm'];
    if (!btn || !(btn._eventos.click || []).length) fallos.push('Descubre tu elemento quedó sin manejador de click');
    else {
      btn.click();
      const form = doc._cache['#p-form'];
      if (!form || !form.classList.contains('viva')) fallos.push('Descubre tu elemento no abre el formulario');
    }
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
