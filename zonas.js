/**
 * TU ELEMENTO — Zonas horarias históricas
 * ------------------------------------------------------------------
 * El pilar de hora depende del instante UTC real del nacimiento. Con
 * un offset fijo se calcula mal a cualquiera que haya nacido en verano
 * antes de 2022, cuando México todavía tenía horario de verano.
 *
 * NO hay tabla escrita a mano aquí. Las reglas mexicanas tienen
 * demasiadas excepciones para eso:
 *   · el horario de verano nacional arranca en 1996
 *   · 2001 tuvo un periodo recortado
 *   · Sonora dejó de aplicarlo a finales de los noventa
 *   · Quintana Roo pasó a UTC-5 fijo en 2015
 *   · los municipios de la frontera norte siguen el calendario de EE.UU.
 *     y CONSERVAN el verano después de la supresión de 2022
 *   · México suprimió el horario de verano al terminar octubre de 2022
 *
 * Todo eso ya vive, correcto y mantenido, en la base de datos IANA que
 * traen el navegador y Node. Este módulo solo la consulta.
 */

/** Offset de la zona en HORAS en un instante dado (ms epoch). */
function offsetEnZona(ts, zona) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: zona, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = {};
  for (const x of dtf.formatToParts(new Date(ts))) p[x.type] = x.value;
  const comoUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return (comoUTC - ts) / 3600000;
}

/**
 * Problema inverso: de hora de reloj local a instante UTC.
 *
 * Tiene dos casos raros que hay que detectar, no ignorar:
 *   · HUECO: en el salto de primavera, las 2:30 no existieron.
 *   · REPETIDA: en el regreso de otoño, la 1:30 ocurrió dos veces.
 *
 * @returns {{ts:number, offset:number, aviso:string|null}}
 */
function utcDesdeLocal(anio, mes, dia, hora, minuto, zona) {
  const local = Date.UTC(anio, mes - 1, dia, hora, minuto);

  // Iterar: adivinar offset, corregir, reconfirmar.
  let off = offsetEnZona(local, zona);
  let ts = local - off * 3600000;
  const off2 = offsetEnZona(ts, zona);
  if (off2 !== off) { off = off2; ts = local - off * 3600000; }

  let aviso = null;

  // ¿La hora que pidieron es la que realmente sale al volver a formatear?
  const vuelta = offsetEnZona(ts, zona);
  if (vuelta !== off) {
    aviso = 'hueco';   // esa hora local no existió: cambio de horario
    off = vuelta;
    ts = local - off * 3600000;
  } else {
    // ¿Hay OTRO offset que también produzca esta misma hora local? Entonces
    // la hora ocurrió dos veces. Se prueban ambos lados: con offsets
    // negativos la candidata alterna es off-1, con positivos off+1.
    for (const cand of [off - 1, off + 1]) {
      const alterno = local - cand * 3600000;
      if (offsetEnZona(alterno, zona) === cand) { aviso = 'repetida'; break; }
    }
  }

  return { ts, offset: off, aviso };
}

/** ¿El navegador trae los datos históricos? Si no, hay que degradar. */
function soportaZonasHistoricas() {
  try {
    // Julio de 2010 en CDMX tenía horario de verano: debe dar -5, no -6.
    return offsetEnZona(Date.UTC(2010, 6, 15, 18), 'America/Mexico_City') === -5;
  } catch (e) { return false; }
}

/* Exportación universal: CommonJS en Node, global explícito en el navegador.
   Se asigna a globalThis a propósito — los `const` de nivel superior NO se
   cuelgan de window, y depender de eso hace frágil la carga entre archivos. */
(function (raiz) {
  var api = { offsetEnZona, utcDesdeLocal, soportaZonasHistoricas };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
