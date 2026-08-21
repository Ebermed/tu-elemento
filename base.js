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
// MEMORIA LOCAL
// ─────────────────────────────────────────────────────────────
// Guarda los datos de nacimiento EN EL NAVEGADOR, nunca en un servidor:
// no hay servidor. Sirve para que el calendario sepa tu signo sin que
// tengas que capturar tu fecha otra vez, y para que al volver mañana
// siga sabiéndolo. Se borra con el botón de olvidar.

var LLAVE = 'tuelemento.nacimiento.v1';

function guardarNacimiento(datos) {
  try { localStorage.setItem(LLAVE, JSON.stringify(datos)); return true; }
  catch (e) { return false; }   // modo privado, cuota llena, etc.
}

function leerNacimiento() {
  try {
    var s = localStorage.getItem(LLAVE);
    if (!s) return null;
    var d = JSON.parse(s);
    return (d && d.anio && d.mes && d.dia) ? d : null;
  } catch (e) { return null; }
}

function olvidarNacimiento() {
  try { localStorage.removeItem(LLAVE); } catch (e) {}
}

/** Reconstruye la carta a partir de lo guardado. */
function cartaGuardada() {
  var d = leerNacimiento();
  if (!d) return null;
  try {
    return cuatroPilares({
      anio: d.anio, mes: d.mes, dia: d.dia,
      hora: d.sinHora ? 12 : d.hora, minuto: d.sinHora ? 0 : d.minuto,
      zona: d.zona, longitud: d.lon
    });
  } catch (e) { return null; }
}

(function (raiz) {
  var api = { MESES, DOW, $, activarApariciones, aplicarPaletaUI, pintarFondo, ir, faltantes, descargarSVG,
              guardarNacimiento, leerNacimiento, olvidarNacimiento, cartaGuardada };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
