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

/** Los tres filtros de sangrado. Insertar dentro de <defs>. */
function filtrosAcuarela(semilla = 42) {
  return `
    <filter id="ac0" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="${semilla}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="55" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="26"/>
    </filter>
    <filter id="ac1" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="5" seed="${semilla + 7}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="42" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="34"/>
    </filter>
    <filter id="ac2" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="${semilla + 19}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="20"/>
    </filter>
    <filter id="grano">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="3"/>
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

/** Fondo completo listo para usar como <svg> de fondo. */
function fondoAcuarela(paleta, w, h, op = {}) {
  const { semilla = 42, papel = '#FBF7F0', densidad = 1, opacidad = 1 } = op;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <defs>${filtrosAcuarela(semilla)}
    <clipPath id="cp${semilla}"><rect width="${w}" height="${h}"/></clipPath>
  </defs>
  <g clip-path="url(#cp${semilla})">
    <rect width="${w}" height="${h}" fill="${papel}"/>
    ${capasAcuarela(paleta, w, h, { semilla, densidad, opacidad })}
    <rect width="${w}" height="${h}" filter="url(#grano)" opacity="0.07" style="mix-blend-mode:multiply"/>
  </g>
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
