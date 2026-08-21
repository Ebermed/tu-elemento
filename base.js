/**
 * TU ELEMENTO — Base compartida
 * ------------------------------------------------------------------
 * Lo que usan las dos aplicaciones (la carta y el calendario) para no
 * mantener dos copias del mismo código.
 */

var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio',
             'agosto','septiembre','octubre','noviembre','diciembre'];
var DOW = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

var $ = function (s) { return document.querySelector(s); };


/** Revelado progresivo para bloques que entran al viewport. */
function activarApariciones(scope) {
  var raiz = scope && scope.querySelectorAll ? scope : document;
  var nodos = raiz.querySelectorAll('.hoja, .inter, .vidrio, .col, .revela');
  if (!nodos || !nodos.length) return;
  for (var i = 0; i < nodos.length; i++) {
    nodos[i].classList.add('revela-prep');
    if (nodos[i].style && nodos[i].style.setProperty) {
      nodos[i].style.setProperty('--reveal-delay', Math.min(i, 8) * 34 + 'ms');
    }
  }
  if (typeof globalThis.IntersectionObserver === 'undefined') {
    for (var j = 0; j < nodos.length; j++) nodos[j].classList.add('revela-viva');
    return;
  }
  var io = new globalThis.IntersectionObserver(function (entradas) {
    for (var k = 0; k < entradas.length; k++) {
      if (!entradas[k].isIntersecting) continue;
      entradas[k].target.classList.add('revela-viva');
      io.unobserve(entradas[k].target);
    }
  }, { threshold: 0.10, rootMargin: '0px 0px -5% 0px' });
  for (var n = 0; n < nodos.length; n++) io.observe(nodos[n]);
}

function aplicarPaletaUI(paleta) {
  if (!paleta || !paleta.length || !document.documentElement) return;
  var s = document.documentElement.style;
  s.setProperty('--acento', paleta[2] || paleta[0]);
  s.setProperty('--acento-2', paleta[1] || paleta[0]);
  s.setProperty('--acento-3', paleta[0]);
}

/**
 * Pinta el fondo de acuarela.
 *
 * RENDIMIENTO: si el SVG se mete como innerHTML, sus filtros quedan
 * VIVOS y el navegador recalcula el ruido Perlin en cada repintado. Con
 * el fondo fijo durante el scroll, eso se siente trabado.
 *
 * La solución no baja la calidad: el mismo SVG se pasa como imagen de
 * fondo en data-URI. El navegador lo rasteriza UNA vez y a partir de
 * ahí solo compone un bitmap, que es prácticamente gratis. Los filtros
 * se aplican igual, solo que una sola vez en lugar de sesenta por
 * segundo.
 */
function pintarFondo(paleta, semilla, opac) {
  var f = $('#fondo');
  if (!f) return;
  aplicarPaletaUI(paleta);
  var svg = fondoAcuarela(paleta, 1200, 1600, {
    semilla: semilla, opacidad: opac == null ? 1.35 : opac
  });
  try {
    f.style.backgroundImage = 'url("data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22') + '")';
    f.innerHTML = '';
  } catch (e) {
    f.innerHTML = svg;
  }
}

/** Cambia de pantalla dentro de la misma página. */
function ir(id) {
  var vivas = document.querySelectorAll('.pantalla.viva');
  for (var i = 0; i < vivas.length; i++) vivas[i].classList.remove('viva');
  var d = $('#' + id);
  if (d) d.classList.add('viva');
  window.scrollTo(0, 0);
}

/** Avisa qué archivo falta en vez de soltar un ReferenceError críptico. */
function faltantes(requiere) {
  var falta = [];
  for (var arch in requiere) {
    if (typeof globalThis[requiere[arch]] === 'undefined') falta.push(arch);
  }
  if (!falta.length) return false;
  document.querySelector('main').innerHTML =
    '<div style="max-width:520px;text-align:left">' +
    '<h1 style="font-size:28px">Faltan archivos</h1>' +
    '<p>Estos deben estar en la misma carpeta que esta página:</p><ul>' +
    falta.map(function (f) { return '<li><code>' + f + '</code></li>'; }).join('') +
    '</ul><p class="pista">Revisa que no falte ninguno y que los nombres estén ' +
    'idénticos, con las mismas mayúsculas.</p></div>';
  return true;
}

/**
 * Descarga un <svg> del DOM como PNG. El tamaño sale del propio SVG
 * porque las láminas crecen según cuánto contenido tengan.
 */
function descargarSVG(svg, nombre) {
  if (!svg) return;
  var w = parseInt(svg.getAttribute('width'), 10) || 1080;
  var h = parseInt(svg.getAttribute('height'), 10) || 1350;
  var s = new XMLSerializer().serializeToString(svg);
  var url = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml;charset=utf-8' }));
  var img = new Image();
  img.onload = function () {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#FBF7F0'; ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    c.toBlob(function (b) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = nombre + '.png';
      a.click();
    });
  };
  img.onerror = function () { URL.revokeObjectURL(url); };
  img.src = url;
}

// ─────────────────────────────────────────────────────────────
// CARTAS GUARDADAS EN ESTE NAVEGADOR
// ─────────────────────────────────────────────────────────────
// V10 guarda varias cartas. Cada perfil conserva únicamente los datos
// necesarios para reconstruir el cálculo cuando la persona vuelve.

var LLAVE_PERFILES = 'tuelemento.perfiles.v2';
var LLAVE_ANTERIOR = 'tuelemento.nacimiento.v1';

function _estadoVacio() {
  return { version:2, perfiles:[], principalId:null, calendarioId:null };
}

function _idPerfil() {
  return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
}

function _nacimientoValido(d) {
  return !!(d && d.anio && d.mes && d.dia && d.zona && isFinite(Number(d.lon)));
}

function _limpiarNacimiento(d) {
  return {
    anio:Number(d.anio), mes:Number(d.mes), dia:Number(d.dia),
    hora:Number(d.hora == null ? 12 : d.hora), minuto:Number(d.minuto || 0),
    sinHora:!!d.sinHora, zona:String(d.zona || ''), lon:Number(d.lon),
    ciudad:String(d.ciudad || ''), sexo:String(d.sexo || '')
  };
}

function _guardarEstado(estado) {
  try { localStorage.setItem(LLAVE_PERFILES, JSON.stringify(estado)); return true; }
  catch (e) { return false; }
}

function _migrarNacimientoAnterior() {
  try {
    var bruto = localStorage.getItem(LLAVE_ANTERIOR);
    if (!bruto) return null;
    var d = JSON.parse(bruto);
    if (!_nacimientoValido(d)) return null;
    var id = _idPerfil();
    var ahora = Date.now();
    var perfil = {
      id:id, tipo:'yo', nombre:'Tu carta',
      nacimiento:_limpiarNacimiento(d), creado:ahora, actualizado:ahora
    };
    var estado = { version:2, perfiles:[perfil], principalId:id, calendarioId:id };
    if (_guardarEstado(estado)) localStorage.removeItem(LLAVE_ANTERIOR);
    return estado;
  } catch (e) { return null; }
}

function estadoPerfiles() {
  try {
    var bruto = localStorage.getItem(LLAVE_PERFILES);
    if (!bruto) return _migrarNacimientoAnterior() || _estadoVacio();
    var e = JSON.parse(bruto);
    if (!e || !Array.isArray(e.perfiles)) return _estadoVacio();
    e.version = 2;
    e.principalId = e.principalId || null;
    e.calendarioId = e.calendarioId || null;
    e.perfiles = e.perfiles.filter(function (p) {
      return p && p.id && _nacimientoValido(p.nacimiento);
    });
    return e;
  } catch (e) { return _estadoVacio(); }
}

function listarPerfiles() {
  return estadoPerfiles().perfiles.slice();
}

function leerPerfil(id) {
  var ps = listarPerfiles();
  for (var i=0; i<ps.length; i++) if (ps[i].id === id) return ps[i];
  return null;
}

function etiquetaPerfil(perfil) {
  if (!perfil) return 'Carta';
  return perfil.tipo === 'yo' ? 'Tu carta' : (perfil.nombre || 'Otra carta');
}

function guardarPerfil(datos) {
  datos = datos || {};
  if (!_nacimientoValido(datos.nacimiento)) return null;
  var e = estadoPerfiles();
  var ahora = Date.now();
  var principalAnterior = e.principalId;
  var tipo = datos.tipo === 'otra' ? 'otra' : 'yo';
  var nombre = tipo === 'yo' ? 'Tu carta' : String(datos.nombre || 'Otra carta').trim();
  var existente = null;

  if (datos.id) {
    for (var i=0; i<e.perfiles.length; i++) {
      if (e.perfiles[i].id === datos.id) { existente = e.perfiles[i]; break; }
    }
  }
  if (!existente && tipo === 'yo') {
    for (var j=0; j<e.perfiles.length; j++) {
      if (e.perfiles[j].tipo === 'yo') { existente = e.perfiles[j]; break; }
    }
  }

  var perfil = existente || { id:_idPerfil(), creado:ahora };
  perfil.tipo = tipo;
  perfil.nombre = nombre;
  perfil.nacimiento = _limpiarNacimiento(datos.nacimiento);
  perfil.actualizado = ahora;

  if (!existente) e.perfiles.push(perfil);
  if (tipo === 'yo') {
    e.principalId = perfil.id;
    if (!principalAnterior) e.calendarioId = perfil.id;
  }
  if (!e.calendarioId || !leerPerfilEnEstado(e, e.calendarioId)) {
    e.calendarioId = e.principalId || perfil.id;
  }
  return _guardarEstado(e) ? perfil : null;
}

function leerPerfilEnEstado(e, id) {
  for (var i=0; i<e.perfiles.length; i++) if (e.perfiles[i].id === id) return e.perfiles[i];
  return null;
}

function perfilPrincipal() {
  var e = estadoPerfiles();
  var p = leerPerfilEnEstado(e, e.principalId);
  if (p) return p;
  for (var i=0; i<e.perfiles.length; i++) if (e.perfiles[i].tipo === 'yo') return e.perfiles[i];
  return null;
}

function perfilCalendario() {
  var e = estadoPerfiles();
  return leerPerfilEnEstado(e, e.calendarioId) || perfilPrincipal() || e.perfiles[0] || null;
}

function seleccionarPerfilCalendario(id) {
  var e = estadoPerfiles();
  var p = leerPerfilEnEstado(e, id);
  e.calendarioId = p ? p.id : null;
  _guardarEstado(e);
  return p;
}

function olvidarPerfil(id) {
  var e = estadoPerfiles();
  var restantes = [];
  for (var i=0; i<e.perfiles.length; i++) if (e.perfiles[i].id !== id) restantes.push(e.perfiles[i]);
  e.perfiles = restantes;
  if (e.principalId === id) {
    e.principalId = null;
    for (var j=0; j<restantes.length; j++) {
      if (restantes[j].tipo === 'yo') { e.principalId = restantes[j].id; break; }
    }
  }
  if (e.calendarioId === id || !leerPerfilEnEstado(e, e.calendarioId)) {
    e.calendarioId = e.principalId || (restantes[0] ? restantes[0].id : null);
  }
  _guardarEstado(e);
  return restantes.length;
}

function cartaDesdePerfil(perfil) {
  if (!perfil || !_nacimientoValido(perfil.nacimiento)) return null;
  var d = perfil.nacimiento;
  try {
    return cuatroPilares({
      anio:d.anio, mes:d.mes, dia:d.dia,
      hora:d.sinHora ? 12 : d.hora, minuto:d.sinHora ? 0 : d.minuto,
      zona:d.zona, longitud:d.lon
    });
  } catch (e) { return null; }
}

// Compatibilidad con V9 y enlaces internos que todavía usan la API anterior.
function guardarNacimiento(datos) {
  var p = guardarPerfil({ tipo:'yo', nombre:'Tu carta', nacimiento:datos });
  return !!p;
}

function leerNacimiento() {
  var p = perfilPrincipal();
  return p ? p.nacimiento : null;
}

function olvidarNacimiento() {
  var p = perfilPrincipal();
  if (p) olvidarPerfil(p.id);
}

function cartaGuardada() {
  return cartaDesdePerfil(perfilCalendario());
}

(function (raiz) {
  var api = { MESES, DOW, $, activarApariciones, aplicarPaletaUI, pintarFondo, ir, faltantes, descargarSVG,
              estadoPerfiles, listarPerfiles, leerPerfil, etiquetaPerfil, guardarPerfil, perfilPrincipal,
              perfilCalendario, seleccionarPerfilCalendario, olvidarPerfil, cartaDesdePerfil,
              guardarNacimiento, leerNacimiento, olvidarNacimiento, cartaGuardada };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
