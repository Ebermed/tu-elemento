/**
 * TU ELEMENTO — Tarjeta compartible V8
 * ------------------------------------------------------------------
 * Pieza 1080×1350 pensada para historias y mensajes.
 * Jerarquía alta, menos microtexto, más lectura a primera vista.
 */

const ANCHO = 1080;
const ALTO = 1350;

function partir(texto, max) {
  const palabras = String(texto || '').split(/\s+/).filter(Boolean);
  const out = [];
  let linea = '';
  for (const p of palabras) {
    if ((linea + ' ' + p).trim().length > max && linea) {
      out.push(linea.trim()); linea = p;
    } else linea += ' ' + p;
  }
  if (linea.trim()) out.push(linea.trim());
  return out;
}

const escapar = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function lineasSVG(texto, x, y, max, salto, attrs, maxLineas) {
  const ls = partir(texto, max).slice(0, maxLineas || 99);
  return '<text x="' + x + '" y="' + y + '" ' + attrs + '>' +
    ls.map(function (l, i) {
      return '<tspan x="' + x + '" dy="' + (i === 0 ? 0 : salto) + '">' + escapar(l) + '</tspan>';
    }).join('') + '</text>';
}


/* La tarjeta vive en un lienzo fijo de 1080×1350, pero sus bloques ya no
   usan coordenadas verticales independientes. Estas funciones estiman el
   espacio que ocupa el texto y construyen un flujo vertical. Así una frase
   de dos líneas y una de tres conservan aire parecido alrededor. */
function ajustarLineas(texto, opciones) {
  opciones = opciones || {};
  var maxLineas = opciones.maxLineas || 3;
  var candidatos = opciones.candidatos || [
    { max:32, size:38, salto:46 },
    { max:35, size:36, salto:43 },
    { max:38, size:34, salto:41 },
    { max:42, size:32, salto:39 }
  ];
  for (var i = 0; i < candidatos.length; i++) {
    var c = candidatos[i], ls = partir(texto, c.max);
    if (ls.length <= maxLineas) return { lineas:ls, max:c.max, size:c.size, salto:c.salto };
  }
  var ult = candidatos[candidatos.length - 1];
  return { lineas:partir(texto, ult.max).slice(0, maxLineas), max:ult.max, size:ult.size, salto:ult.salto };
}

function altoTexto(config) {
  var n = Math.max(1, config.lineas.length);
  return config.size + (n - 1) * config.salto;
}

function primeraLineaCentrada(panelY, panelH, config) {
  var h = altoTexto(config);
  // Aproximación de baseline: ~78% del tamaño desde el borde superior del glifo.
  return panelY + (panelH - h) / 2 + config.size * 0.78;
}

function layoutCompartible(frase, movimiento, tension, consejo) {
  var L = {};
  L.heroY = 108; L.heroH = 214;

  L.frase = ajustarLineas(frase, { maxLineas:3 });
  var fraseTextoH = altoTexto(L.frase);
  L.fraseY = L.heroY + L.heroH + 28;
  L.fraseH = Math.max(158, Math.ceil(fraseTextoH + 60));
  L.fraseBaseY = primeraLineaCentrada(L.fraseY, L.fraseH, L.frase);

  L.movimiento = ajustarLineas(movimiento, {
    maxLineas:2,
    candidatos:[
      { max:31, size:23, salto:32 },
      { max:35, size:22, salto:30 },
      { max:40, size:21, salto:29 }
    ]
  });
  L.tension = ajustarLineas(tension, {
    maxLineas:2,
    candidatos:[
      { max:31, size:23, salto:32 },
      { max:35, size:22, salto:30 },
      { max:40, size:21, salto:29 }
    ]
  });
  var miniLineas = Math.max(L.movimiento.lineas.length, L.tension.lineas.length);
  L.miniY = L.fraseY + L.fraseH + 26;
  L.miniH = Math.max(128, 82 + miniLineas * 27);

  L.cartaLabelY = L.miniY + L.miniH + 28;
  L.pilaresY = L.cartaLabelY + 20;
  L.pilaresH = 182;

  L.balanceY = L.pilaresY + L.pilaresH + 30;
  L.balanceH = 180;

  L.consejo = ajustarLineas(consejo, {
    maxLineas:2,
    candidatos:[
      { max:60, size:22, salto:29 },
      { max:67, size:21, salto:28 },
      { max:74, size:20, salto:27 }
    ]
  });
  L.consejoY = L.balanceY + L.balanceH + 28;
  L.consejoH = Math.max(126, 79 + L.consejo.lineas.length * 27);

  // La composición conserva al menos 28 px al final. Si una frase futura
  // creciera más de lo previsto, primero se reducen los huecos entre módulos.
  var limite = ALTO - 28;
  var final = L.consejoY + L.consejoH;
  if (final > limite) {
    var exceso = final - limite;
    var recorte = Math.min(12, Math.ceil(exceso / 4));
    L.miniY -= recorte;
    L.cartaLabelY -= recorte * 2;
    L.pilaresY -= recorte * 2;
    L.balanceY -= recorte * 3;
    L.consejoY -= recorte * 4;
  }
  return L;
}

function normalizarIcono(nombre) {
  var n = String(nombre || '').toLowerCase();
  var alias = {
    madera:'roble', fuego:'brasa', tierra:'montaña', metal:'acero', agua:'rocío',
    origen:'origen', trabajo:'trabajo', tú:'tú', destino:'destino'
  };
  return alias[n] || n;
}

function iconoPath(nombre) {
  const p = {
    roble:'M11 20c0-5 2.2-8.5 5-12 2.4 3.5 4 7.1 4 12M16 11c-2 0-4-1-5-3M8 20h12',
    hiedra:'M5 18c4-7 7-9 14-12-1 6-5 11-12 14-1-2-2-2-2-2z',
    sol:'M12 4v3M12 17v3M4 12h3M17 12h3M6.4 6.4l2.1 2.1M15.5 15.5l2.1 2.1M17.6 6.4l-2.1 2.1M8.5 15.5l-2.1 2.1M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
    brasa:'M13 21c-4 0-7-2.8-7-6.5 0-3.1 1.9-5.3 4.1-7.8.1 2.8 1.2 4.1 2.2 4.5.3-3.7 2.2-6 4.7-8.2-.2 3.5 2.2 5.4 2.2 8.6 0 5-3.1 9-6.1 9z',
    montaña:'M3.5 19 10.3 8.5l3.2 4.2 2-2.8 5 9.1h-17zM8.3 19l4.2-6.1 3.2 3.9',
    huerto:'M5 19h14M8 19v-5M16 19v-7M7 11c2-1 3.5-3.5 5-6 1.3 2.2 3 3.7 5 5',
    acero:'M12 3.5l7.2 7.2L12 20.5l-7.2-9.8L12 3.5zM8 10.7h8',
    joya:'M12 4l6.5 4.5-2.2 9H7.7l-2.2-9L12 4zM5.5 8.5h13M9 8.5l3 9 3-9',
    marea:'M3.5 10c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 3.8-1.7 3.8-1.7M3.5 15c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 3.8-1.7 3.8-1.7',
    rocío:'M12 3.5c3.6 4.7 6.2 7.8 6.2 11.2A6.2 6.2 0 0 1 5.8 14.7C5.8 11.3 8.4 8.2 12 3.5z',
    origen:'M3.5 19 10.3 8.5l3.2 4.2 2-2.8 5 9.1h-17zM8.3 19l4.2-6.1 3.2 3.9',
    trabajo:'M6 8h12v10H6zM9 8V6h6v2',
    tú:'M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM6 19a6.5 6.5 0 0 1 12 0',
    destino:'M12 5v14M12 5l-4 4M12 5l4 4',
    rata:'M5 15c0-4 3-7 7-7 3.8 0 6.5 2.2 6.5 5.5 0 3.5-2.9 5.5-6.4 5.5H9c-2.2 0-4-1.5-4-4zM8 8 6 5m9.5 4.5L19 7m-1 8 3 1m-3-4 3-1',
    buey:'M6 10c1-3 3-5 6-5s5 2 6 5v5c0 3-2 5-6 5s-6-2-6-5v-5zM7 8 3 5m14 3 4-3M9 13h.1M15 13h.1',
    tigre:'M7 8 5 4l4 2c1-.7 2-1 3-1s2 .3 3 1l4-2-2 4c1 1.2 1.5 2.7 1.5 4.5 0 4-2.8 7-6.5 7s-6.5-3-6.5-7c0-1.8.5-3.3 1.5-4.5zM9 11h.1M15 11h.1M10 15h4M12 7v2',
    conejo:'M8 9C5 5 6 2 8 2c2 0 3 4 3 7m5 0c3-4 2-7 0-7-2 0-3 4-3 7m-5 1c-1 1-2 3-2 5 0 3 2.5 5 6 5s6-2 6-5c0-2-1-4-2-5M9 13h.1M15 13h.1',
    dragón:'M4 15c3-7 8-10 15-9-2 1-3 3-2 5 2 1 3 3 2 5-1 3-5 4-8 3-3-2-3-6 0-7 2-1 4 0 5 2M7 9 5 6m8 0 1-3m4 4 3-1',
    serpiente:'M7 6c4-3 10-2 10 2 0 5-8 3-8 8 0 3 3 4 6 3 2-.7 3-2 3-4M15 7h.1M17 5l3-1',
    caballo:'M8 20V9l4-5 5 3-1 5 2 3-3 5h-4l-2-5-3 5-3-2M12 8h.1',
    cabra:'M7 7C4 5 4 2 5 2c2 0 4 2 4 5m8 0c0-3 2-5 4-5 1 0 1 3-2 5m-9 1c-2 1-3 3-3 6 0 4 2 6 5 6s5-2 5-6c0-3-1-5-3-6M10 12h.1M14 12h.1',
    mono:'M7 8c-2 1-3 3-3 5 0 4 3 7 8 7s8-3 8-7c0-2-1-4-3-5-1-3-3-4-5-4S8 5 7 8zM8 12h.1M16 12h.1M9 16c2 1 4 1 6 0',
    gallo:'M7 18c0-6 2-10 7-10 3 0 5 2 5 5 0 4-4 7-8 7H7zM11 8c0-3 2-5 5-5-1 2 0 3 2 4M7 13H4m13 0 3-1M10 11h.1',
    perro:'M6 9 4 4l5 3c1-.7 2-1 3-1s2 .3 3 1l5-3-2 5v6c0 3-2.5 5-6 5s-6-2-6-5V9zM9 12h.1M15 12h.1M10 16h4',
    cerdo:'M5 11c0-4 3-6 7-6s7 2 7 6v4c0 3-3 5-7 5s-7-2-7-5v-4zM8 7 6 4m10 3 2-3M9 12h6v4H9zM11 14h.1M13 14h.1'
  };
  return p[normalizarIcono(nombre)] || p.montaña;
}

function iconoSVG(nombre, cx, cy, tam, color, op) {
  const esc = tam / 24;
  return '<g transform="translate(' + (cx - tam/2).toFixed(1) + ' ' + (cy - tam/2).toFixed(1) + ') scale(' + esc.toFixed(4) + ')" ' +
    'fill="none" stroke="' + color + '" stroke-opacity="' + (op == null ? 1 : op) + '" stroke-width="1.58" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="' + iconoPath(nombre) + '"/></g>';
}

function fondoCompartible(paleta, semilla) {
  var cols = paleta && paleta.length ? paleta : ['#D9C5B4','#EEE1CA','#C8D7D0'];
  var r = (typeof rng === 'function') ? rng(semilla || 42) : function(){ return .5; };
  var puntos = [
    [90,100,500,360],[890,120,420,320],[520,420,570,390],
    [70,820,440,390],[930,790,500,410],[420,1260,600,360]
  ];
  var defs = [], manchas = [];
  puntos.forEach(function (p, i) {
    var id='tcg'+i, c=cols[i%cols.length];
    defs.push('<radialGradient id="'+id+'"><stop offset="0" stop-color="'+c+'" stop-opacity=".38"/><stop offset="48%" stop-color="'+c+'" stop-opacity=".18"/><stop offset="100%" stop-color="'+c+'" stop-opacity="0"/></radialGradient>');
    var dx=(r()-.5)*80, dy=(r()-.5)*70;
    manchas.push('<ellipse cx="'+(p[0]+dx).toFixed(0)+'" cy="'+(p[1]+dy).toFixed(0)+'" rx="'+p[2]+'" ry="'+p[3]+'" fill="url(#'+id+')"/>');
  });
  defs.push('<filter id="tcsoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>');
  defs.push('<filter id="tcshadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#5E4D40" flood-opacity=".10"/></filter>');
  defs.push('<filter id="tcpaper"><feTurbulence type="fractalNoise" baseFrequency=".68" numOctaves="1" seed="'+((semilla||42)+9)+'"/><feColorMatrix type="saturate" values="0"/></filter>');
  var bokeh='';
  for (var i=0;i<6;i++) bokeh += '<circle cx="'+Math.round(100+r()*880)+'" cy="'+Math.round(100+r()*1150)+'" r="'+Math.round(26+r()*48)+'" fill="#fff" opacity="'+(.05+r()*.08).toFixed(2)+'"/>';
  return { defs:defs.join(''), fondo:'<rect width="1080" height="1350" fill="#FBF7F0"/><g filter="url(#tcsoft)">'+manchas.join('')+'</g>'+bokeh+'<rect width="1080" height="1350" fill="#fff" opacity=".16"/><rect width="1080" height="1350" filter="url(#tcpaper)" opacity=".018" style="mix-blend-mode:multiply"/>' };
}

function nivelTexto(n) {
  if (n >= 4) return 'alta';
  if (n === 3) return 'media';
  if (n === 2) return 'media';
  if (n === 1) return 'baja';
  return 'muy baja';
}

function consejoCorto(t, lec) {
  var nombre = String(t.tarjeta && t.tarjeta.nombre || '').toLowerCase();
  var mapa = {
    roble:'Tu rumbo importa. También puedes cambiar de ruta sin perder lo que ya construiste.',
    hiedra:'Acuérdate de dónde querías llegar antes de acomodarte a lo que todos necesitan.',
    sol:'Guarda un poco de luz para ti. Estar disponible todo el tiempo también cansa.',
    brasa:'Cuida dónde pones tu fuego. Pocas cosas bien sostenidas pueden darte mucho más.',
    montaña:'Pon límites claros. Sostener a todos también pesa.',
    huerto:'Reserva tiempo para tu propio terreno. Tú también necesitas espacio para crecer.',
    acero:'Tu claridad ayuda mucho. Un poco de contexto puede hacer que el corte duela menos.',
    joya:'Ponle un punto final a lo que ya está bien. Seguir puliendo también consume.',
    marea:'Elige una corriente principal. Toda tu fuerza junta llega mucho más lejos.',
    rocío:'Haz visible lo que necesitas. La gente tarda en notar lo que dices bajito.'
  };
  return mapa[nombre] || ((lec && lec.elemento && lec.elemento.tension) ? lec.elemento.tension : 'Escucha tu ritmo y deja espacio para ajustarlo.');
}

function colorElemento(e) {
  var mapa = { madera:'#6C7C52', fuego:'#C76A2A', tierra:'#A77B49', metal:'#8A837E', agua:'#6E8794' };
  return mapa[String(e || '').toLowerCase()] || '#8A6A4D';
}

function resumenCompartible(nombre, tipo) {
  var n = String(nombre || '').toLowerCase();
  var textos = {
    roble:{ frase:'Creces con firmeza, incluso cuando el terreno viene chueco.', movimiento:'Echas raíces rápido y sostienes el rumbo.', reto:'Te cuesta doblarte cuando el contexto cambia.' },
    hiedra:{ frase:'Siempre encuentras por dónde subir.', movimiento:'Rodeas, te adaptas y terminas llegando.', reto:'A veces te adaptas tanto que se te mueve el rumbo.' },
    sol:{ frase:'Entras, y todo se enciende un poco.', movimiento:'Tu presencia activa y calienta el ambiente.', reto:'Cuando te apagas, el bajón también se siente.' },
    brasa:{ frase:'Calientas poco, pero calientas hondo.', movimiento:'Pones el foco en una cosa y la sostienes.', reto:'Te desgastas cuando cargas a demasiados.' },
    montaña:{ frase:'Todos se recargan en ti. Pero casi nadie te pregunta si cargas demasiado peso.', movimiento:'La gente se apoya en ti. Cargas mucho sin hacer ruido.', reto:'Te cuesta moverte. A veces te quedas más de la cuenta.' },
    huerto:{ frase:'Lo que cuidas crece. Solo acuérdate de cuidarte también.', movimiento:'Haces crecer lo ajeno con mucha facilidad.', reto:'A veces te dejas para después.' },
    acero:{ frase:'Dices lo necesario, aunque a veces cortes de más.', movimiento:'Hablas con claridad y decides sin rodeos.', reto:'Tu franqueza resuelve, aunque a veces deja marcas.' },
    joya:{ frase:'Te tomó tiempo pulirte, y eso se nota.', movimiento:'Ves matices y elevas la calidad de lo que tocas.', reto:'La exigencia pesa cuando nunca marcas cierre.' },
    marea:{ frase:'Cuando fluyes con dirección, arrastras mucho contigo.', movimiento:'Mueves personas, ideas y proyectos con fuerza.', reto:'Sin cauce claro, tu energía se dispersa.' },
    rocío:{ frase:'Llegas sin ruido, pero dejas huella.', movimiento:'Notas matices que a otros se les pasan.', reto:'A veces lo que traes pasa de largo.' }
  };
  return (textos[n] && textos[n][tipo]) || '';
}

function tarjetaSVG(t, op) {
  op = op || {};
  var semilla = op.semilla || 42;
  var pie = op.pie || 'ebermed.github.io';
  var lec = op.lectura || null;
  var nombre = t.tarjeta.nombre;
  var elemento = t.tarjeta.elemento;
  var paleta = t.tarjeta.paleta;
  var oscuro = paleta[2] || '#443B34';
  var claro = paleta[1] || '#E6D8CB';
  var tecnica = t.tecnico && t.tecnico.diaMaestro;
  var yang = ['Jia','Bing','Wu','Geng','Ren'].indexOf(tecnica) !== -1;
  var polaridad = tecnica ? (yang ? 'YANG' : 'YIN') : '';
  var frase = resumenCompartible(nombre, 'frase') || (lec && lec.elemento && lec.elemento.frase) || t.tarjeta.frase;
  var movimiento = resumenCompartible(nombre, 'movimiento') || (lec && lec.elemento && lec.elemento.movimiento) || (t.lectura && t.lectura.movimiento) || '';
  var tension = resumenCompartible(nombre, 'reto') || (lec && lec.elemento && lec.elemento.tension) || (t.lectura && t.lectura.tension) || '';
  var fondo = fondoCompartible(paleta, semilla);
  var fsNombre = nombre.length >= 9 ? 84 : nombre.length >= 7 ? 96 : 108;
  var consejo = consejoCorto(t, lec);
  var lay = layoutCompartible(frase, movimiento, tension, consejo);

  var hero =
    '<g filter="url(#tcshadow)"><rect x="86" y="108" width="908" height="214" rx="42" fill="#fff" opacity=".72" stroke="#fff" stroke-opacity=".92"/></g>' +
    '<circle cx="258" cy="214" r="70" fill="#fff" opacity=".84" stroke="#fff" stroke-opacity=".94"/>' +
    iconoSVG(nombre,258,214,84,oscuro,.92) +
    '<text x="356" y="170" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="18" font-weight="600" letter-spacing="4.1" fill="'+oscuro+'" opacity=".58">TU ELEMENTO BASE</text>' +
    '<text x="350" y="254" font-family="Georgia,serif" font-size="'+fsNombre+'" fill="'+oscuro+'">'+escapar(nombre)+'</text>' +
    '<rect x="352" y="278" width="'+(polaridad ? 240 : 152)+'" height="44" rx="22" fill="'+claro+'" opacity=".56"/>' +
    '<text x="372" y="307" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="17" font-weight="600" letter-spacing="2.4" fill="'+oscuro+'" opacity=".74">'+escapar(String(elemento).toUpperCase() + (polaridad ? ' · ' + polaridad : ''))+'</text>';

  var frasePanel =
    '<g filter="url(#tcshadow)"><rect x="70" y="'+lay.fraseY+'" width="940" height="'+lay.fraseH+'" rx="38" fill="#fff" opacity=".74" stroke="#fff" stroke-opacity=".92"/></g>' +
    '<text x="118" y="'+(lay.fraseY + 76)+'" font-family="Georgia,serif" font-size="92" font-weight="700" fill="'+oscuro+'" opacity=".26">“</text>' +
    '<text x="948" y="'+(lay.fraseY + lay.fraseH - 18)+'" text-anchor="end" font-family="Georgia,serif" font-size="92" font-weight="700" fill="'+oscuro+'" opacity=".20">”</text>' +
    lineasSVG(frase, 540, lay.fraseBaseY, lay.frase.max, lay.frase.salto, 'text-anchor="middle" font-family="Georgia,serif" font-size="'+lay.frase.size+'" font-weight="600" font-style="italic" fill="'+oscuro+'" opacity=".94"', 3);

  var miniPanel = function(x, titulo, texto, icono, serif, cfg) {
    var baseTexto = lay.miniY + 82;
    return '<g>' +
      '<rect x="'+x+'" y="'+lay.miniY+'" width="455" height="'+lay.miniH+'" rx="28" fill="#fff" opacity=".74" stroke="#fff" stroke-opacity=".90"/>' +
      '<circle cx="'+(x+42)+'" cy="'+(lay.miniY+40)+'" r="22" fill="#fff" opacity=".82"/>' +
      iconoSVG(icono, x+42, lay.miniY+40, 24, oscuro, .82) +
      '<text x="'+(x+76)+'" y="'+(lay.miniY+47)+'" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" font-weight="800" letter-spacing="2.4" fill="'+oscuro+'" opacity=".66">'+escapar(titulo)+'</text>' +
      lineasSVG(texto, x+32, baseTexto, cfg.max, cfg.salto, 'font-family="Georgia,serif" font-size="'+cfg.size+'" font-weight="600"'+(serif ? ' font-style="italic"' : '')+' fill="'+oscuro+'" opacity=".94"', 2) +
      '</g>';
  };

  var pilares = '';
  if (lec && lec.pilares) {
    var cortos = { 'Tu origen':'Tu origen', 'Tu trayectoria':'Tu trayectoria', 'Tú':'Tú', 'Tu futuro':'Tu futuro', 'Raíces':'Tu origen', 'Trayectoria':'Tu trayectoria', 'Centro':'Tú', 'Proyección':'Tu futuro', 'De dónde vienes':'Tu origen', 'Cómo trabajas':'Tu trayectoria', 'Quién eres':'Tú', 'Hacia dónde vas':'Tu futuro' };
    lec.pilares.forEach(function (p, i) {
      var x = 70 + i * 240;
      var nombreCol = cortos[p.titulo] || p.titulo;
      var col = colorElemento(p.elementoCrudo);
      pilares += '<g>' +
        '<rect x="'+x+'" y="'+lay.pilaresY+'" width="220" height="'+lay.pilaresH+'" rx="28" fill="#fff" opacity=".70" stroke="#fff" stroke-opacity=".88"/>' +
        '<circle cx="'+(x+110)+'" cy="'+(lay.pilaresY+44)+'" r="27" fill="#fff" opacity=".58"/>' +
        iconoSVG(p.animal.toLowerCase(), x+110, lay.pilaresY+44, 29, oscuro, .72) +
        '<text x="'+(x+110)+'" y="'+(lay.pilaresY+82)+'" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="13" font-weight="800" letter-spacing="1.9" fill="'+oscuro+'" opacity=".56">'+escapar(String(nombreCol).toUpperCase())+'</text>' +
        '<text x="'+(x+110)+'" y="'+(lay.pilaresY+126)+'" text-anchor="middle" font-family="Georgia,serif" font-size="31" font-weight="600" fill="'+oscuro+'">'+escapar(p.animal)+'</text>' +
        '<text x="'+(x+110)+'" y="'+(lay.pilaresY+156)+'" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-style="italic" fill="'+col+'">'+escapar(p.elementoCrudo)+'</text>' +
        (p.vacio ? '<text x="'+(x+110)+'" y="'+(lay.pilaresY+175)+'" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="11" letter-spacing="1.8" fill="'+oscuro+'" opacity=".46">VACÍO</text>' : '') +
      '</g>';
    });
  }

  var balance = '';
  if (lec && lec.balance && lec.balance.conteo) {
    var orden = ['madera','fuego','tierra','metal','agua'];
    balance += '<g><rect x="70" y="'+lay.balanceY+'" width="940" height="'+lay.balanceH+'" rx="30" fill="#fff" opacity=".74" stroke="#fff" stroke-opacity=".88"/>' +
      '<text x="540" y="'+(lay.balanceY+36)+'" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" font-weight="800" letter-spacing="3" fill="'+oscuro+'" opacity=".56">DISTRIBUCIÓN DE TUS 5 ELEMENTOS</text>';
    orden.forEach(function (e, i) {
      var cx = 164 + i * 188;
      var n = lec.balance.conteo[e] || 0;
      var col = colorElemento(e);
      balance += iconoSVG(e, cx, lay.balanceY+76, 24, col, .88) +
        '<text x="'+cx+'" y="'+(lay.balanceY+112)+'" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="13" font-weight="800" letter-spacing="1.8" fill="'+oscuro+'" opacity=".74">'+escapar(String(e).toUpperCase())+'</text>';
      for (var d=0; d<5; d++) {
        balance += '<circle cx="'+(cx-36+d*18)+'" cy="'+(lay.balanceY+141)+'" r="6.5" fill="'+(d < n ? col : '#FFFFFF')+'" opacity="'+(d < n ? '.95' : '.46')+'" stroke="'+col+'" stroke-opacity=".75"/>';
      }
      balance += '<text x="'+cx+'" y="'+(lay.balanceY+168)+'" text-anchor="middle" font-family="Georgia,serif" font-size="17" font-style="italic" fill="'+col+'">'+nivelTexto(n)+'</text>';
    });
    balance += '</g>';
  }

  var consejoPanel =
    '<g><rect x="70" y="'+lay.consejoY+'" width="940" height="'+lay.consejoH+'" rx="30" fill="#fff" opacity=".76" stroke="#fff" stroke-opacity=".90"/>' +
    '<circle cx="120" cy="'+(lay.consejoY + lay.consejoH/2)+'" r="27" fill="#fff" opacity=".84"/>' +
    iconoSVG('joya',120,lay.consejoY + lay.consejoH/2,29,oscuro,.78) +
    '<text x="164" y="'+(lay.consejoY+48)+'" font-family="Georgia,serif" font-size="30" font-weight="600" fill="'+oscuro+'">Consejo</text>' +
    lineasSVG(consejo, 164, lay.consejoY+82, lay.consejo.max, lay.consejo.salto, 'font-family="Georgia,serif" font-size="'+lay.consejo.size+'" font-weight="600" fill="'+oscuro+'" opacity=".92"', 2) +
    '</g>';

  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+ANCHO+'" height="'+ALTO+'" viewBox="0 0 '+ANCHO+' '+ALTO+'">' +
    '<defs>'+fondo.defs+'</defs>' + fondo.fondo +
    '<text x="540" y="62" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" font-weight="600" letter-spacing="4.8" fill="'+oscuro+'" opacity=".40">'+escapar(pie)+'</text>' +
    hero + frasePanel +
    miniPanel(70, 'ASÍ TE MUEVES', movimiento, 'marea', false, lay.movimiento) +
    miniPanel(555, 'TU RETO', tension, 'brasa', true, lay.tension) +
    '<text x="540" y="'+lay.cartaLabelY+'" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" font-weight="800" letter-spacing="2.8" fill="'+oscuro+'" opacity=".50">TU CARTA DE UN VISTAZO</text>' +
    pilares + balance + consejoPanel +
  '</svg>';
}

(function (raiz) {
  var api = { tarjetaSVG, ANCHO, ALTO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
