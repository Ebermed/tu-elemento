/**
 * TU ELEMENTO — Décadas  (大运 Da Yun)
 * ------------------------------------------------------------------
 * El eje del tiempo. La carta de los cuatro pilares es estática: dice
 * quién eres. Las décadas dicen POR DÓNDE VAS PASANDO.
 *
 * Cada diez años entras en un pilar nuevo que se suma a tu carta y le
 * cambia el clima. Es lo que hace que la misma persona no viva igual
 * a los 20 que a los 50.
 *
 * MÉTODO CLÁSICO
 * 1. Dirección: si el tallo del AÑO es yang y la persona es hombre, o
 *    el tallo es yin y la persona es mujer, las décadas avanzan hacia
 *    adelante en el ciclo de 60. En los otros dos casos, hacia atrás.
 * 2. Edad de arranque: se cuentan los días desde el nacimiento hasta el
 *    término solar siguiente (si avanza) o el anterior (si retrocede).
 *    Tres días equivalen a un año.
 * 3. Las décadas salen del PILAR DE MES, corriéndose una posición por
 *    década en la dirección que tocó.
 *
 * El paso 1 necesita el sexo registrado al nacer porque así está
 * definido el método clásico. Es un dato opcional en el producto: sin
 * él simplemente no se calculan las décadas.
 */

function _depD(nombre, ruta) {
  if (typeof globalThis !== 'undefined' && globalThis[nombre] !== undefined) return globalThis[nombre];
  if (typeof require !== 'undefined') { try { return require(ruta)[nombre]; } catch (e) {} }
  return undefined;
}

/**
 * @param {object} carta   salida de cuatroPilares()
 * @param {string} sexo    'h' o 'm' (registrado al nacer)
 * @param {number} [cuantas]  cuántas décadas devolver
 */
function decadas(carta, sexo, cuantas) {
  cuantas = cuantas || 8;
  var TL = _depD('TALLOS', './motor'), RM = _depD('RAMAS', './motor');
  var terminosDelAnio = _depD('terminosDelAnio', './motor');
  var jd = _depD('jd', './motor'), desdeJD = _depD('desdeJD', './motor');

  // ── 1. dirección ──
  var talloAnioYang = carta.pilares.anio.tallo.yang;
  var hacia = ((talloAnioYang && sexo === 'h') || (!talloAnioYang && sexo === 'm')) ? 1 : -1;

  // ── 2. edad de arranque ──
  // Los términos que rodean el nacimiento; el actual ya viene en la carta.
  var jdNac = carta.terminoActual.jd;   // término que abrió el mes de nacimiento
  var terms = terminosDelAnio(carta.anioSolar);
  var idx = -1;
  for (var i = 0; i < terms.length; i++) if (terms[i].jd === carta.terminoActual.jd) idx = i;

  // instante real del nacimiento en JD (reconstruido del pilar de mes)
  var jdReal = carta.jdUTC;

  var objetivo;
  if (hacia === 1) {
    objetivo = (idx + 1 < terms.length)
      ? terms[idx + 1].jd
      : terminosDelAnio(carta.anioSolar + 1)[0].jd;
  } else {
    objetivo = terms[idx].jd;
  }
  var dias = Math.abs(jdReal - objetivo);
  var edadInicio = Math.round(dias / 3 * 10) / 10;
  if (edadInicio < 0.5) edadInicio = 0.5;

  // ── 3. la secuencia desde el pilar de mes ──
  var indiceSexagenario = _depD('indiceSexagenario', './motor');
  var nMes = indiceSexagenario(TL.indexOf(carta.pilares.mes.tallo),
                               RM.indexOf(carta.pilares.mes.rama));
  var vacio = _depD('vacio', './motor');

  var out = [];
  for (var k = 1; k <= cuantas; k++) {
    var n = (((nMes + hacia * k) % 60) + 60) % 60;
    var t = TL[n % 10], r = RM[n % 12];
    var desde = Math.round(edadInicio) + (k - 1) * 10;
    out.push({
      desde: desde,
      hasta: desde + 9,
      tallo: t, rama: r,
      nombre: t.pinyin + '-' + r.pinyin,
      animal: r.animal,
      elemento: t.elemento,
      yang: t.yang,
      enVacio: carta.vacio.ramas.indexOf(RM.indexOf(r)) !== -1,
    });
  }

  return {
    direccion: hacia === 1 ? 'adelante' : 'atrás',
    edadInicio: Math.round(edadInicio),
    lista: out,
  };
}

/** ¿En qué década anda hoy? */
function decadaActual(dec, edad) {
  for (var i = 0; i < dec.lista.length; i++) {
    if (edad >= dec.lista[i].desde && edad <= dec.lista[i].hasta) return i;
  }
  return -1;
}

/** Edad cumplida a partir de la fecha de nacimiento. */
function edadHoy(anio, mes, dia, hoy) {
  hoy = hoy || new Date();
  var e = hoy.getFullYear() - anio;
  var m = (hoy.getMonth() + 1) - mes;
  if (m < 0 || (m === 0 && hoy.getDate() < dia)) e--;
  return e;
}

(function (raiz) {
  var api = { decadas, decadaActual, edadHoy };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
