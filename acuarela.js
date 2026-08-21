/**
 * TU ELEMENTO — Acuarela
 * ------------------------------------------------------------------
 * Generador de manchas orgánicas. Lo usan la tarjeta compartible y el
 * fondo del sitio, para que todo se vea del mismo pincel.
 *
 * La forma vive en la GEOMETRÍA (paths de bézier con radio perturbado),
 * no en los filtros. Si un renderizador ignora feTurbulence, la mancha
 * sigue viéndose de pincel; los filtros solo añaden el sangrado.
 */

function rng(semilla) {
  let s = semilla >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

function manchaPath(cx, cy, r, irregular, aplanar, r1) {
  const n = 9, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rad = r * (1 - irregular / 2 + r1() * irregular);
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * aplanar]);
  }
  let d = `M${pts[0][0].toFixed(0)},${pts[0][1].toFixed(0)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[i], p1 = pts[(i + 1) % n], p2 = pts[(i + 2) % n],
          pm = pts[(i - 1 + n) % n];
    const c1 = [p0[0] + (p1[0] - pm[0]) / 4, p0[1] + (p1[1] - pm[1]) / 4];
    const c2 = [p1[0] - (p2[0] - p0[0]) / 4, p1[1] - (p2[1] - p0[1]) / 4];
    d += ` C${c1[0].toFixed(0)},${c1[1].toFixed(0)} ${c2[0].toFixed(0)},${c2[1].toFixed(0)} ${p1[0].toFixed(0)},${p1[1].toFixed(0)}`;
  }
  return d + 'Z';
}

/**
 * Los tres filtros de sangrado. Insertar dentro de <defs>.
 *
 * RENDIMIENTO: feTurbulence calcula ruido Perlin píxel por píxel, en CPU
 * en la mayoría de navegadores. Sobre un lienzo grande y con muchas
 * octavas se vuelve lento de verdad. Por eso el fondo se dibuja chico y
 * se estira por CSS: como todo va desenfocado, se ve idéntico y el
 * trabajo de filtrado baja con el cuadrado de la escala.
 *
 * @param {number} [k]  factor de escala del lienzo (1 = tamaño completo)
 */
function filtrosAcuarela(semilla = 42, k) {
  k = k || 1;
  var esc = function (v) { return +(v * k).toFixed(2); };
  return `
    <filter id="ac0" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="' + (0.011 / k).toFixed(4) + '" numOctaves="4" seed="${semilla}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="' + esc(55) + '" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="' + esc(26) + '"/>
    </filter>
    <filter id="ac1" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="' + (0.013 / k).toFixed(4) + '" numOctaves="5" seed="${semilla + 7}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="' + esc(42) + '" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="' + esc(34) + '"/>
    </filter>
    <filter id="ac2" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="' + (0.006 / k).toFixed(4) + '" numOctaves="3" seed="${semilla + 19}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="' + esc(70) + '" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="' + esc(20) + '"/>
    </filter>
    <filter id="grano">
      <feTurbulence type="fractalNoise" baseFrequency="' + (0.85 / k).toFixed(3) + '" numOctaves="2" seed="3"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>`;
}

/**
 * Capas de acuarela.
 * @param {string[]} paleta   colores hex
 * @param {number} w,h        dimensiones del lienzo
 * @param {object} [op]  {semilla, densidad (0-1), opacidad (multiplicador)}
 */
function capasAcuarela(paleta, w, h, op = {}) {
  const { semilla = 42, densidad = 1, opacidad = 1 } = op;
  const r = rng(semilla);
  const puntos = [
    { cx: 0.18, cy: 0.14, rr: 0.40, o: 0.42, f: 0 },
    { cx: 0.86, cy: 0.22, rr: 0.34, o: 0.34, f: 1 },
    { cx: 0.50, cy: 0.47, rr: 0.46, o: 0.30, f: 2 },
    { cx: 0.10, cy: 0.72, rr: 0.33, o: 0.38, f: 1 },
    { cx: 0.90, cy: 0.80, rr: 0.36, o: 0.32, f: 0 },
    { cx: 0.40, cy: 0.95, rr: 0.30, o: 0.26, f: 2 },
    { cx: 0.66, cy: 0.60, rr: 0.22, o: 0.30, f: 1 },
  ].slice(0, Math.max(3, Math.round(7 * densidad)));

  return puntos.map((p, i) => {
    const color = paleta[i % paleta.length];
    const cx = (p.cx + (r() - 0.5) * 0.07) * w;
    const cy = (p.cy + (r() - 0.5) * 0.07) * h;
    const rad = p.rr * w * (0.85 + r() * 0.3);
    const d = manchaPath(cx, cy, rad, 0.55, 0.86, r);
    return `<path d="${d}" fill="${color}" opacity="${(p.o * opacidad).toFixed(2)}" filter="url(#ac${p.f})"/>`;
  }).join('\n    ');
}

/**
 * Fondo completo para la interfaz.
 * Las manchas usan gradientes radiales enormes que se pierden en el papel;
 * un blur común mezcla sus intersecciones y evita bordes duros.
 */
function fondoAcuarela(paleta, w, h, op = {}) {
  const { semilla = 42, papel = '#FBF7F0', opacidad = 1 } = op;
  const r = rng(semilla);
  const colores = (paleta && paleta.length ? paleta : PALETA_NEUTRA);
  const bases = [
    [0.10,0.08,0.52,0.34], [0.88,0.10,0.46,0.30], [0.48,0.34,0.58,0.34],
    [0.06,0.62,0.45,0.34], [0.88,0.60,0.52,0.36], [0.38,0.88,0.56,0.32],
    [0.78,0.94,0.42,0.27], [0.60,0.68,0.40,0.26]
  ];
  const defs = [], manchas = [];
  bases.forEach((b, i) => {
    const id = 'wash' + semilla + '_' + i;
    const c = colores[i % colores.length];
    const centro = Math.min(0.62, (0.30 + r() * 0.18) * opacidad);
    const medio = Math.min(0.38, (0.16 + r() * 0.12) * opacidad);
    defs.push(`<radialGradient id="${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c}" stop-opacity="${centro.toFixed(3)}"/>
      <stop offset="38%" stop-color="${c}" stop-opacity="${medio.toFixed(3)}"/>
      <stop offset="76%" stop-color="${c}" stop-opacity="${(medio * .34).toFixed(3)}"/>
      <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
    </radialGradient>`);
    const cx = (b[0] + (r()-.5)*.08) * w, cy = (b[1] + (r()-.5)*.08) * h;
    const rx = b[2] * w * (.92 + r()*.18), ry = b[3] * h * (.92 + r()*.20);
    manchas.push(`<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="url(#${id})"/>`);
  });
  defs.push(`<filter id="soft${semilla}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="22"/></filter>`);
  defs.push(`<filter id="bokeh${semilla}" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="18"/></filter>`);
  defs.push(`<filter id="paper${semilla}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="1" seed="${semilla + 5}"/><feColorMatrix type="saturate" values="0"/></filter>`);
  defs.push(`<linearGradient id="light${semilla}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".50"/><stop offset=".48" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".28"/></linearGradient>`);
  const luces = [];
  for (let i = 0; i < 7; i++) {
    const cx = (0.08 + r()*.84) * w, cy = (0.06 + r()*.88) * h, rr = (0.035 + r()*.075) * w;
    luces.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rr.toFixed(0)}" fill="#fff" opacity="${(0.08 + r()*.11).toFixed(3)}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" width="${w}" height="${h}">
    <defs>${defs.join('')}</defs><rect width="${w}" height="${h}" fill="${papel}"/>
    <g filter="url(#soft${semilla})">${manchas.join('')}</g>
    <g filter="url(#bokeh${semilla})">${luces.join('')}</g>
    <rect width="${w}" height="${h}" fill="url(#light${semilla})"/>
    <rect width="${w}" height="${h}" filter="url(#paper${semilla})" opacity=".018" style="mix-blend-mode:multiply"/>
  </svg>`;
}

/** Paleta neutra para pantallas donde todavía no hay elemento asignado. */
const PALETA_NEUTRA = ['#F2B8A2', '#F7D9A0', '#B8D4C8', '#D9BBD4', '#A8C4D8', '#F5C9B8'];

/* Exportación universal: CommonJS en Node, global explícito en el navegador.
   Se asigna a globalThis a propósito — los `const` de nivel superior NO se
   cuelgan de window, y depender de eso hace frágil la carga entre archivos. */
(function (raiz) {
  var api = { rng, manchaPath, filtrosAcuarela, capasAcuarela, fondoAcuarela, PALETA_NEUTRA };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
