/**
 * TU ELEMENTO — Generador de tarjeta compartible
 * ------------------------------------------------------------------
 * Devuelve un SVG de 1080×1350 (4:5, formato de feed) listo para
 * descargar como PNG.
 *
 * La acuarela se hace con filtros SVG nativos, sin imágenes:
 *   feTurbulence  → ruido orgánico
 *   feDisplacementMap → deforma los bordes duros en bordes de pincel
 *   feGaussianBlur → el sangrado del pigmento en el papel
 * Encima, una capa de grano al 7% que simula la textura del papel.
 *
 * Cero dependencias. Funciona en navegador y en Node.
 */

const ANCHO = 1080;
const ALTO = 1350;

// rng, manchaPath, filtrosAcuarela y capasAcuarela viven en acuarela.js.
// En el navegador, cargar acuarela.js ANTES que este archivo.
if (typeof require !== 'undefined' && typeof capasAcuarela === 'undefined') {
  var _ac = require('./acuarela');
  var capasAcuarela = _ac.capasAcuarela, filtrosAcuarela = _ac.filtrosAcuarela;
}

/**
 * @param {object} t     salida de traducir()
 * @param {object} [op]
 * @param {object} [op.lectura]  salida de lecturaCompleta(): añade los
 *        cuatro pilares y el balance. Sin ella, la tarjeta sale mínima.
 */
function tarjetaSVG(t, op) {
  op = op || {};
  var mostrarPilares = op.mostrarPilares !== false;
  var semilla = op.semilla || 42;
  var pie = op.pie || 'tuelemento.github.io';
  var lec = op.lectura || null;

  var nombre = t.tarjeta.nombre, elemento = t.tarjeta.elemento;
  var frase = t.tarjeta.frase, paleta = t.tarjeta.paleta;
  var oscuro = paleta[2];

  var lineas = partir(frase, 26);
  var bloqueFrase = lineas.map(function (l, i) {
    return '<tspan x="540" dy="' + (i === 0 ? 0 : 62) + '">' + escapar(l) + '</tspan>';
  }).join('');
  var yFrase = 820 - (lineas.length - 1) * 31;

  // ── Los cuatro pilares como CUATRO COLUMNAS ──
  // Se llaman pilares por algo: la carta clásica se dibuja así.
  var bloquePilares = '';
  if (mostrarPilares && lec) {
    var ps = lec.pilares;
    var ancho = 1080 / ps.length;
    bloquePilares = ps.map(function (p, i) {
      var x = ancho * i + ancho / 2;
      var corto = p.titulo.replace('De dónde vienes','Origen')
                          .replace('Cómo trabajas','Trabajo')
                          .replace('Quién eres','Tú')
                          .replace('Hacia dónde vas','Destino');
      var sep = (i === 0) ? '' :
        '<line x1="' + (ancho * i).toFixed(0) + '" y1="962" x2="' + (ancho * i).toFixed(0) + '" y2="1092" ' +
          'stroke="' + oscuro + '" stroke-width="1" opacity="0.18"/>';
      return sep +
             '<text x="' + x.toFixed(0) + '" y="952" text-anchor="middle" ' +
               'font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="19" ' +
               'letter-spacing="3.5" fill="' + oscuro + '" opacity="0.55">' + escapar(corto.toUpperCase()) + '</text>' +
             '<text x="' + x.toFixed(0) + '" y="1032" text-anchor="middle" ' +
               'font-family="Georgia,serif" font-size="40" fill="' + oscuro + '">' + escapar(p.animal) + '</text>' +
             '<text x="' + x.toFixed(0) + '" y="1075" text-anchor="middle" ' +
               'font-family="Georgia,serif" font-size="26" font-style="italic" ' +
               'fill="' + oscuro + '" opacity="0.6">' + escapar(p.elementoCrudo) + '</text>';
    }).join('\n  ');
  }

  // ── Balance de los cinco elementos, como barras ──
  var bloqueBalance = '';
  if (lec && lec.balance) {
    var orden = ['madera','fuego','tierra','metal','agua'];
    var maxN = 1;
    orden.forEach(function (e) { maxN = Math.max(maxN, lec.balance.conteo[e] || 0); });
    bloqueBalance = orden.map(function (e, i) {
      var n = lec.balance.conteo[e] || 0;
      var x = 168 + i * 186;
      var alto = Math.max(4, (n / maxN) * 52);
      return '<rect x="' + (x - 30) + '" y="' + (1218 - alto).toFixed(0) + '" width="60" ' +
               'height="' + alto.toFixed(0) + '" rx="3" fill="' + oscuro + '" ' +
               'opacity="' + (n === 0 ? 0.15 : 0.55) + '"/>' +
             '<text x="' + x + '" y="1252" text-anchor="middle" ' +
               'font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="17" ' +
               'letter-spacing="1.5" fill="' + oscuro + '" opacity="' + (n === 0 ? 0.32 : 0.62) + '">' +
               e.toUpperCase() + '</text>';
    }).join('\n  ');
  }

  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + ANCHO + '" height="' + ALTO + '" viewBox="0 0 ' + ANCHO + ' ' + ALTO + '">\n' +
'  <defs>' + filtrosAcuarela(semilla) + '\n' +
'    <clipPath id="marco"><rect width="' + ANCHO + '" height="' + ALTO + '"/></clipPath>\n' +
'  </defs>\n' +
'  <g clip-path="url(#marco)">\n' +
'    <rect width="' + ANCHO + '" height="' + ALTO + '" fill="#FBF7F0"/>\n' +
'    ' + capasAcuarela(paleta, ANCHO, ALTO, { semilla: semilla }) + '\n' +
'    <rect width="' + ANCHO + '" height="' + ALTO + '" filter="url(#grano)" opacity="0.07" style="mix-blend-mode:multiply"/>\n' +
'  </g>\n' +
'  <text x="540" y="126" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="23" font-weight="500" letter-spacing="7" fill="' + oscuro + '" opacity="0.6">TU ELEMENTO</text>\n' +
'  <text x="540" y="480" text-anchor="middle" font-family="Georgia,serif" font-size="168" fill="' + oscuro + '">' + escapar(nombre) + '</text>\n' +
'  <text x="540" y="546" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="26" letter-spacing="9" fill="' + oscuro + '" opacity="0.58">' + elemento.toUpperCase() + '</text>\n' +
'  <line x1="462" y1="614" x2="618" y2="614" stroke="' + oscuro + '" stroke-width="1.5" opacity="0.32"/>\n' +
'  <text x="540" y="' + yFrase + '" text-anchor="middle" font-family="Georgia,serif" font-size="50" font-style="italic" fill="' + oscuro + '" opacity="0.9">' + bloqueFrase + '</text>\n' +
'  <line x1="120" y1="892" x2="960" y2="892" stroke="' + oscuro + '" stroke-width="1" opacity="0.14"/>\n' +
'  ' + bloquePilares + '\n' +
'  ' + bloqueBalance + '\n' +
'  <text x="540" y="1308" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="19" letter-spacing="4" fill="' + oscuro + '" opacity="0.38">' + escapar(pie) + '</text>\n' +
'</svg>';
}

function partir(texto, max) {
  const palabras = texto.split(' ');
  const out = [];
  let linea = '';
  for (const p of palabras) {
    if ((linea + ' ' + p).trim().length > max && linea) { out.push(linea.trim()); linea = p; }
    else linea += ' ' + p;
  }
  if (linea.trim()) out.push(linea.trim());
  return out;
}

const escapar = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Exportación universal: CommonJS en Node, global explícito en el navegador.
   Se asigna a globalThis a propósito — los `const` de nivel superior NO se
   cuelgan de window, y depender de eso hace frágil la carga entre archivos. */
(function (raiz) {
  var api = { tarjetaSVG, ANCHO, ALTO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
