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

/* ═══════════════════════════════════════════════════════════════
 * V10.3 · parche editorial de interfaz
 * Se ejecuta únicamente en navegador y deja intactos los cálculos.
 * ═══════════════════════════════════════════════════════════════ */
(function (raiz) {
  if (typeof document === 'undefined') return;

  var VACIO_PILAR = {
    anio: {
      nombre:'Tu origen',
      lugar:'familia, pertenencia, amistades tempranas y la sensación de encajar en un grupo',
      sentir:'Puede sentirse como tardar un poco más en decidir quién es “tu gente”, qué tradiciones sí te representan o en qué lugares te sientes realmente en casa.'
    },
    mes: {
      nombre:'Tu trayectoria',
      lugar:'estudios, trabajo, carrera, responsabilidades y logros',
      sentir:'Puede sentirse como tener que descubrir tu manera de trabajar sobre la marcha: probar caminos, cambiar de criterio y construir una definición propia de éxito.'
    },
    hora: {
      nombre:'Tu futuro',
      lugar:'proyectos, hijos, vida interior, planes de largo plazo y legado',
      sentir:'Puede sentirse como un futuro que tarda en tomar forma. La claridad suele aparecer mientras haces, pruebas y eliges qué proyecto merece seguir creciendo contigo.'
    }
  };

  var VACIO_ELEMENTO = {
    madera: {
      explicar:'Como en ese pilar aparece Madera, el aprendizaje pasa por crecer con recursos propios: aprender, desarrollar habilidades y empezar aunque todavía falte apoyo externo.',
      trabajar:'Trabájalo así: elige una cosa que quieras hacer crecer y dale un primer paso que dependa de ti.'
    },
    fuego: {
      explicar:'Como en ese pilar aparece Fuego, el aprendizaje pasa por claridad y dirección: reconocer qué quieres, hacerlo visible y confiar más en tu propia lectura de la situación.',
      trabajar:'Trabájalo así: ponle nombre a lo que quieres antes de buscar aprobación afuera.'
    },
    tierra: {
      explicar:'Como en ese pilar aparece Tierra, el aprendizaje pasa por pertenencia y estabilidad: reconocer qué te sostiene, qué ya pesa de más y qué merece quedarse.',
      trabajar:'Trabájalo así: distingue entre lo que todavía te sostiene y lo que sigues cargando por costumbre.'
    },
    metal: {
      explicar:'Como en ese pilar aparece Metal, el aprendizaje pasa por criterio y voz propia: decir lo que piensas con claridad, poner límites y confiar en tu juicio.',
      trabajar:'Trabájalo así: expresa de forma concreta algo que llevas tiempo sabiendo por dentro.'
    },
    agua: {
      explicar:'Como en ese pilar aparece Agua, el aprendizaje pasa por decisiones: ordenar lo que piensas, elegir una dirección y convertir esa elección en movimiento.',
      trabajar:'Trabájalo así: toma una decisión concreta y conviértela en un primer paso visible.'
    }
  };

  function capital(s) {
    s = String(s || '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function instalarLectura() {
    var original = raiz.lecturaCompleta;
    if (typeof original !== 'function' || original.__v103) return;

    function mejorada(carta, sinHora) {
      var lec = original(carta, sinHora);
      if (!lec) return lec;

      (lec.pilares || []).forEach(function (p) {
        if (p.clave === 'dia') {
          p.titulo = 'Tu centro';
          p.intro = 'Tu centro reúne la parte más personal de la carta. Aquí aparece el tallo que define tu elemento base, junto con una capa ligada a pareja, intimidad y vida emocional.';
        }
      });

      (lec.tensiones || []).forEach(function (x) {
        if (!x.texto) return;
        x.texto = x.texto
          .replace(/Tu origen y tú/g, 'Tu origen y tu centro')
          .replace(/Tu trayectoria y tú/g, 'Tu trayectoria y tu centro')
          .replace(/Tú y tu futuro/g, 'Tu centro y tu futuro');
      });

      var RM = raiz.RAMAS || [];
      var claves = sinHora ? ['anio','mes'] : ['anio','mes','hora'];
      var vacios = [];
      claves.forEach(function (k) {
        var p = carta && carta.pilares && carta.pilares[k];
        var base = VACIO_PILAR[k];
        if (!p || !base || !carta.vacio) return;
        var rama = RM.indexOf(p.rama);
        if (carta.vacio.ramas.indexOf(rama) === -1) return;
        var elemento = p.tallo.elemento;
        var matiz = VACIO_ELEMENTO[elemento] || { explicar:'', trabajar:'' };
        var etiqueta = capital(elemento);
        vacios.push({
          pilar:k,
          titulo:'Vacío de ' + etiqueta + ' en ' + base.nombre,
          texto:'Este vacío aparece en ' + base.nombre + ', la parte de tu carta relacionada con ' + base.lugar + '. ' + base.sentir + ' ' + matiz.explicar,
          filo:matiz.trabajar,
          rama:p.rama.animal,
          elemento:elemento,
          elementoEtiqueta:etiqueta
        });
      });
      lec.vacios = vacios;
      (lec.pilares || []).forEach(function (p) {
        p.vacio = vacios.some(function (v) { return v.pilar === p.clave; });
      });
      return lec;
    }
    mejorada.__v103 = true;
    raiz.lecturaCompleta = mejorada;
  }

  function pulirCalendario() {
    var pantalla = document.getElementById('p-dias');
    if (!pantalla) return;

    var bajadas = pantalla.querySelectorAll('.bajada');
    Array.prototype.forEach.call(bajadas, function (p) {
      if (p.textContent.indexOf('Cada fecha mezcla dos ritmos') !== -1) {
        var detalles = pantalla.querySelector('details');
        if (detalles) {
          var resumen = detalles.querySelector('summary');
          var ya = detalles.querySelector('[data-explicacion-calendario]');
          if (!ya && resumen) {
            var copia = document.createElement('p');
            copia.setAttribute('data-explicacion-calendario','');
            copia.textContent = p.textContent;
            resumen.insertAdjacentElement('afterend', copia);
          }
        }
        p.remove();
      }
    });

    var h1 = pantalla.querySelector('h1');
    if (h1) h1.style.marginBottom = '18px';

    var box = document.getElementById('calPerfilBox');
    if (box) {
      box.style.width = 'min(88%, 360px)';
      box.style.margin = '0 auto 14px';
      box.style.padding = '9px 11px';
      box.style.borderRadius = '18px';
      var label = box.querySelector('label');
      if (label) { label.style.fontSize = '9px'; label.style.letterSpacing = '1.55px'; label.style.marginBottom = '4px'; }
      var select = box.querySelector('select');
      if (select) { select.style.minHeight = '40px'; select.style.fontSize = '14px'; select.style.borderRadius = '14px'; }
      var pista = box.querySelector('.pista');
      if (pista) { pista.style.fontSize = '11px'; pista.style.lineHeight = '1.35'; pista.style.marginTop = '5px'; pista.style.opacity = '.76'; }
    }
  }

  function pulirVaciosRenderizados() {
    var lectura = document.getElementById('lectura');
    if (!lectura || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function () {
      var titulos = lectura.querySelectorAll('.titIcon span');
      Array.prototype.forEach.call(titulos, function (t) {
        if (t.textContent.trim() !== 'Tus vacíos') return;
        var hoja = t.closest('.hoja');
        if (!hoja) return;
        var sub = hoja.querySelector('.sub');
        if (sub) sub.textContent = 'Un vacío marca una parte de la carta que suele aprenderse haciendo. Para entenderlo mejor, aquí cruzamos la zona donde aparece con el elemento que la acompaña.';
      });
    });
    observer.observe(lectura, { childList:true, subtree:true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    instalarLectura();
    pulirCalendario();
    pulirVaciosRenderizados();
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
