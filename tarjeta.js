/**
 * TU ELEMENTO — Tarjeta compartible V5
 * ------------------------------------------------------------------
 * Pieza 1080×1350 pensada para feed y mensajes: identidad primero,
 * dos ideas que aportan valor, los cuatro pilares y una llamada clara
 * a descubrir el propio resultado.
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

function lineasSVG(texto, x, y, max, salto, attrs) {
  const ls = partir(texto, max);
  return '<text x="' + x + '" y="' + y + '" ' + attrs + '>' +
    ls.map(function (l, i) {
      return '<tspan x="' + x + '" dy="' + (i === 0 ? 0 : salto) + '">' + escapar(l) + '</tspan>';
    }).join('') + '</text>';
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
    rocío:'M12 3.5c3.6 4.7 6.2 7.8 6.2 11.2A6.2 6.2 0 0 1 5.8 14.7C5.8 11.3 8.4 8.2 12 3.5z'
  };
  return p[String(nombre || '').toLowerCase()] || p.montaña;
}

function iconoSVG(nombre, cx, cy, tam, color) {
  const esc = tam / 24;
  return '<g transform="translate(' + (cx - tam/2).toFixed(1) + ' ' + (cy - tam/2).toFixed(1) + ') scale(' + esc.toFixed(4) + ')" ' +
    'fill="none" stroke="' + color + '" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="' + iconoPath(nombre) + '"/></g>';
}

function fondoCompartible(paleta, semilla) {
  var cols = paleta && paleta.length ? paleta : ['#D9C5B4','#EEE1CA','#C8D7D0'];
  var r = (typeof rng === 'function') ? rng(semilla || 42) : function(){ return .5; };
  var puntos = [
    [90,100,500,360],[890,120,420,320],[520,420,570,390],
    [70,800,440,390],[930,790,500,410],[420,1260,600,360]
  ];
  var defs = [], manchas = [];
  puntos.forEach(function (p, i) {
    var id='tcg'+i, c=cols[i%cols.length];
    defs.push('<radialGradient id="'+id+'"><stop offset="0" stop-color="'+c+'" stop-opacity=".44"/><stop offset="48%" stop-color="'+c+'" stop-opacity=".20"/><stop offset="100%" stop-color="'+c+'" stop-opacity="0"/></radialGradient>');
    var dx=(r()-.5)*80, dy=(r()-.5)*70;
    manchas.push('<ellipse cx="'+(p[0]+dx).toFixed(0)+'" cy="'+(p[1]+dy).toFixed(0)+'" rx="'+p[2]+'" ry="'+p[3]+'" fill="url(#'+id+')"/>');
  });
  defs.push('<filter id="tcsoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="30"/></filter>');
  defs.push('<filter id="tcshadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#5E4D40" flood-opacity=".10"/></filter>');
  defs.push('<filter id="tcpaper"><feTurbulence type="fractalNoise" baseFrequency=".68" numOctaves="1" seed="'+((semilla||42)+9)+'"/><feColorMatrix type="saturate" values="0"/></filter>');
  var bokeh='';
  for (var i=0;i<6;i++) {
    bokeh += '<circle cx="'+Math.round(100+r()*880)+'" cy="'+Math.round(100+r()*1150)+'" r="'+Math.round(26+r()*48)+'" fill="#fff" opacity="'+(.06+r()*.10).toFixed(2)+'"/>';
  }
  return { defs:defs.join(''), fondo:'<rect width="1080" height="1350" fill="#FBF7F0"/><g filter="url(#tcsoft)">'+manchas.join('')+'</g>'+bokeh+'<rect width="1080" height="1350" fill="#fff" opacity=".10"/><rect width="1080" height="1350" filter="url(#tcpaper)" opacity=".018" style="mix-blend-mode:multiply"/>' };
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

  var fsNombre = nombre.length >= 9 ? 78 : nombre.length >= 7 ? 88 : 102;
  var fraseLineas = partir(frase, 34);
  var yFrase = 430 - (fraseLineas.length - 1) * 22;

  var pilares = '';
  if (lec && lec.pilares) {
    var cortos = { 'De dónde vienes':'ORIGEN', 'Cómo trabajas':'TRABAJO', 'Quién eres':'TÚ', 'Hacia dónde vas':'DESTINO' };
    lec.pilares.forEach(function (p, i) {
      var x = 70 + i * 237;
      var w = 220;
      pilares += '<g>' +
        '<rect x="'+x+'" y="861" width="'+w+'" height="176" rx="28" fill="#fff" opacity=".42" stroke="#fff" stroke-opacity=".68"/>' +
        '<text x="'+(x+22)+'" y="900" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" letter-spacing="2.4" fill="'+oscuro+'" opacity=".56">'+escapar(cortos[p.titulo] || p.titulo.toUpperCase())+'</text>' +
        '<text x="'+(x+22)+'" y="954" font-family="Georgia,serif" font-size="30" fill="'+oscuro+'">'+escapar(p.animal)+'</text>' +
        '<text x="'+(x+22)+'" y="990" font-family="Georgia,serif" font-size="20" font-style="italic" fill="'+oscuro+'" opacity=".62">'+escapar(p.elementoCrudo)+'</text>' +
        (p.vacio ? '<text x="'+(x+22)+'" y="1018" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="12" letter-spacing="1.8" fill="'+oscuro+'" opacity=".48">VACÍO</text>' : '') +
      '</g>';
    });
  }

  var balance = '';
  if (lec && lec.balance && lec.balance.conteo) {
    var orden = Object.keys(lec.balance.conteo).map(function(k){ return [k, lec.balance.conteo[k] || 0]; });
    orden.sort(function(a,b){ return b[1]-a[1]; });
    var mayor = orden[0] ? orden[0][0] : '';
    var menor = orden[orden.length-1] ? orden[orden.length-1][0] : '';
    balance = '<rect x="70" y="1072" width="940" height="112" rx="30" fill="#fff" opacity=".34" stroke="#fff" stroke-opacity=".60"/>' +
      '<text x="102" y="1110" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="14" letter-spacing="2.4" fill="'+oscuro+'" opacity=".50">EN TU CARTA</text>' +
      '<text x="102" y="1153" font-family="Georgia,serif" font-size="27" fill="'+oscuro+'">Más presente: '+escapar(mayor)+'</text>' +
      '<text x="575" y="1153" font-family="Georgia,serif" font-size="27" fill="'+oscuro+'">Menos presente: '+escapar(menor)+'</text>';
  }

  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+ANCHO+'" height="'+ALTO+'" viewBox="0 0 '+ANCHO+' '+ALTO+'">' +
    '<defs>'+fondo.defs+'</defs>' + fondo.fondo +
    '<text x="76" y="92" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="19" font-weight="600" letter-spacing="5.4" fill="'+oscuro+'" opacity=".62">TU ELEMENTO</text>' +
    '<text x="1004" y="92" text-anchor="end" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="16" letter-spacing="3" fill="'+oscuro+'" opacity=".42">MI CARTA</text>' +

    '<g filter="url(#tcshadow)"><rect x="70" y="136" width="940" height="392" rx="48" fill="#fff" opacity=".43" stroke="#fff" stroke-opacity=".75"/></g>' +
    '<circle cx="188" cy="270" r="76" fill="#fff" opacity=".50" stroke="#fff" stroke-opacity=".75"/>' +
    iconoSVG(nombre,188,270,92,oscuro) +
    '<text x="300" y="196" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" letter-spacing="3.3" fill="'+oscuro+'" opacity=".52">MI ELEMENTO</text>' +
    '<text x="296" y="294" font-family="Georgia,serif" font-size="'+fsNombre+'" fill="'+oscuro+'">'+escapar(nombre)+'</text>' +
    '<rect x="298" y="324" width="'+(polaridad?208:148)+'" height="45" rx="22.5" fill="'+claro+'" opacity=".48"/>' +
    '<text x="316" y="354" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="17" font-weight="600" letter-spacing="2.6" fill="'+oscuro+'" opacity=".68">'+escapar(elemento.toUpperCase()+(polaridad?' · '+polaridad:''))+'</text>' +
    lineasSVG(frase,300,yFrase,34,50,'font-family="Georgia,serif" font-size="36" font-style="italic" fill="'+oscuro+'" opacity=".88"') +

    '<rect x="70" y="564" width="455" height="238" rx="34" fill="#fff" opacity=".39" stroke="#fff" stroke-opacity=".68"/>' +
    '<text x="102" y="610" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="14" font-weight="600" letter-spacing="2.5" fill="'+oscuro+'" opacity=".52">ASÍ TE MUEVES</text>' +
    lineasSVG(movimiento,102,658,31,38,'font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="27" fill="'+oscuro+'" opacity=".88"') +

    '<rect x="545" y="564" width="465" height="238" rx="34" fill="#fff" opacity=".39" stroke="#fff" stroke-opacity=".68"/>' +
    '<text x="577" y="610" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="14" font-weight="600" letter-spacing="2.5" fill="'+oscuro+'" opacity=".52">TU RETO</text>' +
    lineasSVG(tension,577,658,31,38,'font-family="Georgia,serif" font-size="27" font-style="italic" fill="'+oscuro+'" opacity=".88"') +

    '<text x="72" y="838" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="15" font-weight="600" letter-spacing="3" fill="'+oscuro+'" opacity=".50">TU CARTA DE UN VISTAZO</text>' +
    pilares + balance +

    '<text x="540" y="1238" text-anchor="middle" font-family="Georgia,serif" font-size="31" fill="'+oscuro+'">¿Cuál es el tuyo?</text>' +
    '<text x="540" y="1280" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="20" font-weight="600" letter-spacing="1.2" fill="'+oscuro+'" opacity=".72">Haz tu carta gratis · '+escapar(pie)+'</text>' +
    '<text x="540" y="1322" text-anchor="middle" font-family="ui-sans-serif,Helvetica,Arial,sans-serif" font-size="13" letter-spacing="3.2" fill="'+oscuro+'" opacity=".34">COMPÁRTELA CON ALGUIEN QUE NECESITE VER LA SUYA</text>' +
  '</svg>';
}

(function (raiz) {
  var api = { tarjetaSVG, ANCHO, ALTO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
