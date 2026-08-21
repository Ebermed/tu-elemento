/**
 * TU ELEMENTO — Carta completa
 * ------------------------------------------------------------------
 * La lámina que la gente se descarga y guarda. Distinta de la tarjeta:
 * la tarjeta es para compartir (grande, simple, un mensaje); esta es
 * para conservar (densa, legible, toda la carta).
 *
 * Estructura visual: CUATRO COLUMNAS. La carta BaZi clásica se dibuja
 * en columnas verticales — de ahí el nombre "pilares". Respetar esa
 * forma es lo que la hace ver como una carta y no como un póster.
 */

if (typeof capasAcuarela === 'undefined' && typeof require !== 'undefined') {
  var _a = require('./acuarela');
  var capasAcuarela = _a.capasAcuarela, filtrosAcuarela = _a.filtrosAcuarela;
}

var C_ANCHO = 1080;

function cartaSVG(t, lec, op) {
  op = op || {};
  var semilla = op.semilla || 42;
  var pie = op.pie || 'tuelemento.github.io';
  var nacimiento = op.nacimiento || '';
  var paleta = t.tarjeta.paleta;
  var tinta = paleta[2];

  var ps = lec.pilares;
  var n = ps.length;
  var margen = 90;
  var util = C_ANCHO - margen * 2;
  var colAncho = util / n;

  var y = 0;
  var partes = [];
  var esc = escaparC;

  function txt(x, yy, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + yy + '" text-anchor="' + (o.anchor || 'middle') + '" ' +
      'font-family="' + (o.serif ? 'Georgia,serif' : 'ui-sans-serif,Helvetica,Arial,sans-serif') + '" ' +
      'font-size="' + (o.size || 24) + '" ' +
      (o.italic ? 'font-style="italic" ' : '') +
      (o.ls ? 'letter-spacing="' + o.ls + '" ' : '') +
      'fill="' + (o.fill || tinta) + '" opacity="' + (o.op == null ? 1 : o.op) + '">' + esc(s) + '</text>';
  }

  // ── encabezado ──
  y = 108;
  partes.push(txt(540, y, 'TU CARTA COMPLETA', { size: 22, ls: 7, op: 0.55 }));
  y += 96;
  partes.push(txt(540, y, t.tarjeta.nombre, { serif: true, size: 108 }));
  y += 48;
  partes.push(txt(540, y, t.tarjeta.elemento.toUpperCase(), { size: 23, ls: 8, op: 0.55 }));
  if (nacimiento) { y += 44; partes.push(txt(540, y, nacimiento, { size: 21, op: 0.45 })); }

  // ── las cuatro columnas ──
  y += 92;
  var yCols = y;
  var cortos = { 'Tu origen':'TU ORIGEN', 'Tu trayectoria':'TU TRAYECTORIA', 'Tú':'TÚ', 'Tu futuro':'TU FUTURO',
                 'Raíces':'TU ORIGEN', 'Trayectoria':'TU TRAYECTORIA', 'Centro':'TÚ', 'Proyección':'TU FUTURO',
                 'De dónde vienes':'TU ORIGEN', 'Cómo trabajas':'TU TRAYECTORIA', 'Quién eres':'TÚ', 'Hacia dónde vas':'TU FUTURO' };

  partes.push('<rect x="' + margen + '" y="' + (yCols - 34) + '" width="' + util +
              '" height="290" rx="14" fill="#FFFDF8" opacity="0.62"/>');

  for (var i = 0; i < n; i++) {
    var p = ps[i];
    var cx = margen + colAncho * i + colAncho / 2;
    if (i > 0) {
      partes.push('<line x1="' + (margen + colAncho * i).toFixed(0) + '" y1="' + (yCols - 10) +
                  '" x2="' + (margen + colAncho * i).toFixed(0) + '" y2="' + (yCols + 240) +
                  '" stroke="' + tinta + '" stroke-width="1" opacity="0.16"/>');
    }
    partes.push(txt(cx, yCols, cortos[p.titulo] || p.titulo.toUpperCase(), { size: 18, ls: 3, op: 0.5 }));
    partes.push(txt(cx, yCols + 62, p.animal, { serif: true, size: 42 }));
    partes.push(txt(cx, yCols + 104, p.elementoCrudo, { serif: true, italic: true, size: 25, op: 0.6 }));
    partes.push(txt(cx, yCols + 152, p.nombreTecnico, { size: 19, ls: 1.5, op: 0.4 }));
    if (p.vacio) {
      partes.push('<rect x="' + (cx - 44) + '" y="' + (yCols + 182) + '" width="88" height="30" rx="15" ' +
                  'fill="' + tinta + '" opacity="0.14"/>');
      partes.push(txt(cx, yCols + 202, 'VACÍO', { size: 15, ls: 2, op: 0.68 }));
    }
  }
  y = yCols + 300;

  // ── balance ──
  y += 34;
  partes.push(txt(margen, y, 'DISTRIBUCIÓN DE TUS 5 ELEMENTOS', { size: 18, ls: 4, op: 0.5, anchor: 'start' }));
  y += 26;
  var orden = ['madera', 'fuego', 'tierra', 'metal', 'agua'];
  var maxN = 1;
  orden.forEach(function (e) { maxN = Math.max(maxN, lec.balance.conteo[e] || 0); });
  for (var b = 0; b < 5; b++) {
    var el = orden[b], cnt = lec.balance.conteo[el] || 0;
    var bx = margen + (util / 5) * b + (util / 5) / 2;
    var alto = Math.max(6, (cnt / maxN) * 76);
    partes.push('<rect x="' + (bx - 42) + '" y="' + (y + 84 - alto).toFixed(0) + '" width="84" height="' +
                alto.toFixed(0) + '" rx="5" fill="' + tinta + '" opacity="' + (cnt === 0 ? 0.13 : 0.5) + '"/>');
    partes.push(txt(bx, y + 116, el.toUpperCase(), { size: 17, ls: 1.5, op: cnt === 0 ? 0.3 : 0.55 }));
  }
  y += 152;

  // ── bloques de texto ──
  function bloque(rotulo, lineas) {
    y += 40;
    partes.push(txt(margen, y, rotulo, { size: 18, ls: 4, op: 0.5, anchor: 'start' }));
    y += 12;
    lineas.forEach(function (ln) {
      var trozos = partirC(ln.txt, ln.serif ? 52 : 62);
      trozos.forEach(function (tr, k) {
        y += (k === 0 ? 34 : 32);
        partes.push(txt(margen, y, tr, {
          anchor: 'start', size: ln.serif ? 27 : 24,
          serif: !!ln.serif, italic: !!ln.serif, op: ln.op == null ? 0.86 : ln.op
        }));
      });
      y += 6;
    });
  }

  bloque('TU ELEMENTO BASE', [
    { txt: lec.elemento.movimiento },
    { txt: lec.elemento.tension, serif: true }
  ]);

  if (lec.tensiones.length) {
    var ls = [];
    lec.tensiones.forEach(function (x) {
      ls.push({ txt: x.detalle.toUpperCase(), op: 0.5 });
      ls.push({ txt: x.texto });
    });
    bloque('CUANDO TUS PILARES SE JALAN', ls);
  }

  if (lec.vacios.length) {
    var vs = [];
    lec.vacios.forEach(function (v) {
      vs.push({ txt: v.titulo.toUpperCase(), op: 0.5 });
      vs.push({ txt: v.texto });
      vs.push({ txt: v.filo, serif: true });
    });
    bloque('TUS VACÍOS', vs);
  }

  if (lec.balance.matices.length) {
    bloque('DISTRIBUCIÓN DE TUS 5 ELEMENTOS', lec.balance.matices.map(function (m) { return { txt: m }; }));
  }

  y += 66;
  partes.push(txt(540, y, esc(pie), { size: 20, ls: 4, op: 0.38 }));
  var alto = y + 70;

  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + C_ANCHO + '" height="' + alto +
    '" viewBox="0 0 ' + C_ANCHO + ' ' + alto + '">\n' +
    '  <defs>' + filtrosAcuarela(semilla) +
    '\n    <clipPath id="mc' + semilla + '"><rect width="' + C_ANCHO + '" height="' + alto + '"/></clipPath>\n  </defs>\n' +
    '  <g clip-path="url(#mc' + semilla + ')">\n' +
    '    <rect width="' + C_ANCHO + '" height="' + alto + '" fill="#FBF7F0"/>\n    ' +
    capasAcuarela(paleta, C_ANCHO, alto, { semilla: semilla, opacidad: 0.72 }) + '\n' +
    '    <rect width="' + C_ANCHO + '" height="' + alto + '" filter="url(#grano)" opacity="0.06" style="mix-blend-mode:multiply"/>\n' +
    '  </g>\n  ' + partes.join('\n  ') + '\n</svg>';
}

function partirC(texto, max) {
  var palabras = String(texto).split(' '), out = [], linea = '';
  for (var i = 0; i < palabras.length; i++) {
    if ((linea + ' ' + palabras[i]).trim().length > max && linea) { out.push(linea.trim()); linea = palabras[i]; }
    else linea += ' ' + palabras[i];
  }
  if (linea.trim()) out.push(linea.trim());
  return out;
}

function escaparC(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

(function (raiz) {
  var api = { cartaSVG, C_ANCHO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
