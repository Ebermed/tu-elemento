/**
 * TU ELEMENTO — Tarjeta compartible V6
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
    destino:'M12 5v14M12 5l-4 4M12 5l4 4'
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
  return { defs:defs.join(''), fondo:'<rect width="1080" height="1350" fill="#FBF7F0"/><g filter="url(#tcsoft)">'+manchas.join('')+'</g>'+bokeh+'<rect width="1080" height="1350" fill="#fff" opacity=".08"/><rect width="1080" height="1350" filter="url(#tcpaper)" opacity=".018" style="mix-blend-mode:multiply"/>' };
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
    roble:'Da estructura sin endurecerte.',
    hiedra:'Sostén tu ritmo antes que la aprobación.',
    sol:'Brilla sin gastarte por todos.',
    brasa:'Baja una raya antes de incendiarte.',
    montaña:'Pon límites. Sostener no es cargar con todo.',
    huerto:'Cuida tu energía como cuidas a los tuyos.',
    acero:'Afloja el control. Deja entrar aire.',
    joya:'Tu valor crece cuando dejas de exigirte tanto.',
    marea:'Di lo que sientes antes de replegarte.',
    rocío:'Da forma a lo que sientes con palabras.'
  };
  return mapa[nombre] || ((lec && lec.elemento && lec.elemento.tension) ? lec.elemento.tension : 'Escucha tu ritmo antes de reaccionar.');
}

function colorElemento(e) {
  var mapa = { madera:'#6C7C52', fuego:'#C76A2A', tierra:'#A77B49', metal:'#8A837E', agua:'#6E8794' };
  return mapa[String(e || '').toLowerCase()] || '#8A6A4D';
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
  var frase = (lec && lec.elemento && lec.elemento.frase) || t.tarjeta.frase;
  var movimiento = (lec && lec.elemento && lec.elemento.movimiento) || (t.lectura && t.lectura.movimiento) || '';
  var tension = (lec && lec.elemento && lec.elemento.tension) || (t.lectura && t.lectura.tension) || '';
  var fondo = fondoCompartible(paleta, semilla);
  var fsNombre = nombre.length >= 9 ? 84 : nombre.length >= 7 ? 96 : 108;
  var consejo = consejoCorto(t, lec);

  var hero =
    '<g filter="url(#tcshadow)"><rect x="70" y="118" width="940" height="300" rx="48" fill="#fff" opacity=".42" stroke="#fff" stroke-opacity=".78"/></g>' +
    '<circle cx="185" cy="270" r="76" fill="#fff" opacity=".54" stroke="#fff" stroke-opacity=".76"/>' +
    iconoSVG(nombre,185,270,92,oscuro,.92) +
    '<text x="302" y="188" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="18" font-weight="600" letter-spacing="4.5" fill="'+oscuro+'" opacity=".58">TU ELEMENTO</text>' +
    '<text x="296" y="286" font-family="Georgia,serif" font-size="'+fsNombre+'" fill="'+oscuro+'">'+escapar(nombre)+'</text>' +
    '<rect x="298" y="312" width="'+(polaridad ? 240 : 152)+'" height="48" rx="24" fill="'+claro+'" opacity=".52"/>' +
    '<text x="318" y="344" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="18" font-weight="600" letter-spacing="2.6" fill="'+oscuro+'" opacity=".74">'+escapar(String(elemento).toUpperCase() + (polaridad ? ' · ' + polaridad : ''))+'</text>';

  var frasePanel =
    '<g filter="url(#tcshadow)"><rect x="70" y="448" width="940" height="174" rx="38" fill="#fff" opacity=".34" stroke="#fff" stroke-opacity=".72"/></g>' +
    '<text x="540" y="500" text-anchor="middle" font-family="Georgia,serif" font-size="54" fill="'+oscuro+'" opacity=".52">“</text>' +
    lineasSVG(frase, 540, 548, 28, 48, 'text-anchor="middle" font-family="Georgia,serif" font-size="34" font-style="italic" fill="'+oscuro+'" opacity=".92"', 3);

  var miniPanel = function(x, titulo, texto, icono, serif) {
    return '<g>' +
      '<rect x="'+x+'" y="652" width="455" height="142" rx="30" fill="#fff" opacity=".38" stroke="#fff" stroke-opacity=".68"/>' +
      '<circle cx="'+(x+38)+'" cy="694" r="20" fill="#fff" opacity=".58"/>' +
      iconoSVG(icono, x+38, 694, 22, oscuro, .75) +
      '<text x="'+(x+66)+'" y="699" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.3" fill="'+oscuro+'" opacity=".54">'+escapar(titulo)+'</text>' +
      lineasSVG(texto, x+34, 743, 28, 34, 'font-family="'+(serif ? 'Georgia,serif' : 'ui-sans-serif,Helvetica,Arial,sans-serif')+'" font-size="26"'+(serif ? ' font-style="italic"' : '')+' fill="'+oscuro+'" opacity=".9"', 2) +
      '</g>';
  };

  var pilares = '';
  if (lec && lec.pilares) {
    var cortos = { 'De dónde vienes':'Origen', 'Cómo trabajas':'Trabajo', 'Quién eres':'Tú', 'Hacia dónde vas':'Destino' };
    lec.pilares.forEach(function (p, i) {
      var x = 70 + i * 237;
      var nombreCol = cortos[p.titulo] || p.titulo;
      var col = colorElemento(p.elementoCrudo);
      pilares += '<g>' +
        '<rect x="'+x+'" y="838" width="220" height="188" rx="28" fill="#fff" opacity=".44" stroke="#fff" stroke-opacity=".72"/>' +
        '<circle cx="'+(x+110)+'" cy="885" r="24" fill="#fff" opacity=".56"/>' +
        iconoSVG(nombreCol.toLowerCase(), x+110, 885, 24, oscuro, .62) +
        '<text x="'+(x+110)+'" y="924" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.4" fill="'+oscuro+'" opacity=".56">'+escapar(String(nombreCol).toUpperCase())+'</text>' +
        '<text x="'+(x+110)+'" y="972" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="'+oscuro+'">'+escapar(p.animal)+'</text>' +
        '<text x="'+(x+110)+'" y="1004" text-anchor="middle" font-family="Georgia,serif" font-size="20" font-style="italic" fill="'+col+'">'+escapar(p.elementoCrudo)+'</text>' +
        (p.vacio ? '<text x="'+(x+110)+'" y="1023" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="11" letter-spacing="1.8" fill="'+oscuro+'" opacity=".46">VACÍO</text>' : '') +
      '</g>';
    });
  }

  var balance = '';
  if (lec && lec.balance && lec.balance.conteo) {
    var orden = ['madera','fuego','tierra','metal','agua'];
    balance += '<g><rect x="70" y="1054" width="940" height="154" rx="30" fill="#fff" opacity=".34" stroke="#fff" stroke-opacity=".64"/>' +
      '<text x="540" y="1092" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" font-weight="700" letter-spacing="3" fill="'+oscuro+'" opacity=".56">BALANCE DE 5 ELEMENTOS</text>';
    orden.forEach(function (e, i) {
      var x = 95 + i * 188;
      var n = lec.balance.conteo[e] || 0;
      var col = colorElemento(e);
      balance += iconoSVG(e, x+62, 1136, 28, col, .88) +
        '<text x="'+(x+62)+'" y="1168" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="1.8" fill="'+oscuro+'" opacity=".74">'+escapar(String(e).toUpperCase())+'</text>';
      for (var d=0; d<5; d++) {
        balance += '<circle cx="'+(x+18+d*18)+'" cy="1189" r="6.2" fill="'+(d < n ? col : '#FFFFFF')+'" opacity="'+(d < n ? '.95' : '.46')+'" stroke="'+col+'" stroke-opacity=".75"/>';
      }
      balance += '<text x="'+(x+62)+'" y="1220" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-style="italic" fill="'+col+'">'+nivelTexto(n)+'</text>';
    });
    balance += '</g>';
  }

  var consejoPanel =
    '<g><rect x="70" y="1230" width="940" height="82" rx="28" fill="#fff" opacity=".36" stroke="#fff" stroke-opacity=".64"/>' +
    '<circle cx="115" cy="1271" r="22" fill="#fff" opacity=".56"/>' +
    iconoSVG('joya',115,1271,24,oscuro,.72) +
    '<text x="152" y="1262" font-family="Georgia,serif" font-size="27" fill="'+oscuro+'">Consejo</text>' +
    '<text x="152" y="1290" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="22" fill="'+oscuro+'" opacity=".88">'+escapar(consejo)+'</text>' +
    '</g>';

  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+ANCHO+'" height="'+ALTO+'" viewBox="0 0 '+ANCHO+' '+ALTO+'">' +
    '<defs>'+fondo.defs+'</defs>' + fondo.fondo +
    '<text x="74" y="74" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" font-weight="600" letter-spacing="4.8" fill="'+oscuro+'" opacity=".40">'+escapar(pie)+'</text>' +
    hero + frasePanel +
    miniPanel(70, 'ASÍ TE MUEVES', movimiento, 'marea', false) +
    miniPanel(555, 'TU RETO', tension, 'brasa', true) +
    '<text x="72" y="822" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2.8" fill="'+oscuro+'" opacity=".50">TU CARTA DE UN VISTAZO</text>' +
    pilares + balance + consejoPanel +
  '</svg>';
}

(function (raiz) {
  var api = { tarjetaSVG, ANCHO, ALTO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
