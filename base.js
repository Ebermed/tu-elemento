/**
 * TU ELEMENTO — Base compartida
 * ------------------------------------------------------------------
 * Lo que usan las dos aplicaciones (la carta y el calendario) para no
 * mantener dos copias del mismo código.
 */

var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio',
             'agosto','septiembre','octubre','noviembre','diciembre'];
var DOW = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

var $ = function (s) { return document.querySelector(s); };

/** Revelado progresivo para bloques que entran al viewport. */
function activarApariciones(scope) {
  var raiz = scope && scope.querySelectorAll ? scope : document;
  var nodos = raiz.querySelectorAll('.hoja, .inter, .vidrio, .col, .revela');
  if (!nodos || !nodos.length) return;
  for (var i = 0; i < nodos.length; i++) {
    nodos[i].classList.add('revela-prep');
    if (nodos[i].style && nodos[i].style.setProperty) {
      nodos[i].style.setProperty('--reveal-delay', Math.min(i, 8) * 34 + 'ms');
    }
  }
  if (typeof globalThis.IntersectionObserver === 'undefined') {
    for (var j = 0; j < nodos.length; j++) nodos[j].classList.add('revela-viva');
    return;
  }
  var io = new globalThis.IntersectionObserver(function (entradas) {
    for (var k = 0; k < entradas.length; k++) {
      if (!entradas[k].isIntersecting) continue;
      entradas[k].target.classList.add('revela-viva');
      io.unobserve(entradas[k].target);
    }
  }, { threshold: 0.10, rootMargin: '0px 0px -5% 0px' });
  for (var n = 0; n < nodos.length; n++) io.observe(nodos[n]);
}

function aplicarPaletaUI(paleta) {
  if (!paleta || !paleta.length || !document.documentElement) return;
  var s = document.documentElement.style;
  s.setProperty('--acento', paleta[2] || paleta[0]);
  s.setProperty('--acento-2', paleta[1] || paleta[0]);
  s.setProperty('--acento-3', paleta[0]);
}

function pintarFondo(paleta, semilla, opac) {
  var f = $('#fondo');
  if (!f) return;
  aplicarPaletaUI(paleta);
  var svg = fondoAcuarela(paleta, 1200, 1600, {
    semilla: semilla, opacidad: opac == null ? 1.35 : opac
  });
  try {
    f.style.backgroundImage = 'url("data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22') + '")';
    f.innerHTML = '';
  } catch (e) {
    f.innerHTML = svg;
  }
}

function ir(id) {
  var vivas = document.querySelectorAll('.pantalla.viva');
  for (var i = 0; i < vivas.length; i++) vivas[i].classList.remove('viva');
  var d = $('#' + id);
  if (d) d.classList.add('viva');
  window.scrollTo(0, 0);
}

function faltantes(requiere) {
  var falta = [];
  for (var arch in requiere) {
    if (typeof globalThis[requiere[arch]] === 'undefined') falta.push(arch);
  }
  if (!falta.length) return false;
  document.querySelector('main').innerHTML =
    '<div style="max-width:520px;text-align:left">' +
    '<h1 style="font-size:28px">Faltan archivos</h1>' +
    '<p>Estos deben estar en la misma carpeta que esta página:</p><ul>' +
    falta.map(function (f) { return '<li><code>' + f + '</code></li>'; }).join('') +
    '</ul><p class="pista">Revisa que estén juntos y que los nombres coincidan con los del proyecto.</p></div>';
  return true;
}

function descargarSVG(svg, nombre) {
  if (!svg) return;
  var w = parseInt(svg.getAttribute('width'), 10) || 1080;
  var h = parseInt(svg.getAttribute('height'), 10) || 1350;
  var s = new XMLSerializer().serializeToString(svg);
  var url = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml;charset=utf-8' }));
  var img = new Image();
  img.onload = function () {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#FBF7F0'; ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    c.toBlob(function (b) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = nombre + '.png';
      a.click();
    });
  };
  img.onerror = function () { URL.revokeObjectURL(url); };
  img.src = url;
}

var LLAVE_PERFILES = 'tuelemento.perfiles.v2';
var LLAVE_ANTERIOR = 'tuelemento.nacimiento.v1';

function _estadoVacio() {
  return { version:2, perfiles:[], principalId:null, calendarioId:null };
}

function _idPerfil() {
  return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
}

function _nacimientoValido(d) {
  return !!(d && d.anio && d.mes && d.dia && d.zona && isFinite(Number(d.lon)));
}

function _limpiarNacimiento(d) {
  return {
    anio:Number(d.anio), mes:Number(d.mes), dia:Number(d.dia),
    hora:Number(d.hora == null ? 12 : d.hora), minuto:Number(d.minuto || 0),
    sinHora:!!d.sinHora, zona:String(d.zona || ''), lon:Number(d.lon),
    ciudad:String(d.ciudad || ''), sexo:String(d.sexo || '')
  };
}

function _guardarEstado(estado) {
  try { localStorage.setItem(LLAVE_PERFILES, JSON.stringify(estado)); return true; }
  catch (e) { return false; }
}

function _migrarNacimientoAnterior() {
  try {
    var bruto = localStorage.getItem(LLAVE_ANTERIOR);
    if (!bruto) return null;
    var d = JSON.parse(bruto);
    if (!_nacimientoValido(d)) return null;
    var id = _idPerfil();
    var ahora = Date.now();
    var perfil = {
      id:id, tipo:'yo', nombre:'Tu carta',
      nacimiento:_limpiarNacimiento(d), creado:ahora, actualizado:ahora
    };
    var estado = { version:2, perfiles:[perfil], principalId:id, calendarioId:id };
    if (_guardarEstado(estado)) localStorage.removeItem(LLAVE_ANTERIOR);
    return estado;
  } catch (e) { return null; }
}

function estadoPerfiles() {
  try {
    var bruto = localStorage.getItem(LLAVE_PERFILES);
    if (!bruto) return _migrarNacimientoAnterior() || _estadoVacio();
    var e = JSON.parse(bruto);
    if (!e || !Array.isArray(e.perfiles)) return _estadoVacio();
    e.version = 2;
    e.principalId = e.principalId || null;
    e.calendarioId = e.calendarioId || null;
    e.perfiles = e.perfiles.filter(function (p) {
      return p && p.id && _nacimientoValido(p.nacimiento);
    });
    return e;
  } catch (e) { return _estadoVacio(); }
}

function listarPerfiles() {
  return estadoPerfiles().perfiles.slice();
}

function leerPerfil(id) {
  var ps = listarPerfiles();
  for (var i=0; i<ps.length; i++) if (ps[i].id === id) return ps[i];
  return null;
}

function etiquetaPerfil(perfil) {
  if (!perfil) return 'Carta';
  return perfil.tipo === 'yo' ? 'Tu carta' : (perfil.nombre || 'Otra carta');
}

function guardarPerfil(datos) {
  datos = datos || {};
  if (!_nacimientoValido(datos.nacimiento)) return null;
  var e = estadoPerfiles();
  var ahora = Date.now();
  var principalAnterior = e.principalId;
  var tipo = datos.tipo === 'otra' ? 'otra' : 'yo';
  var nombre = tipo === 'yo' ? 'Tu carta' : String(datos.nombre || 'Otra carta').trim();
  var existente = null;

  if (datos.id) {
    for (var i=0; i<e.perfiles.length; i++) {
      if (e.perfiles[i].id === datos.id) { existente = e.perfiles[i]; break; }
    }
  }
  if (!existente && tipo === 'yo') {
    for (var j=0; j<e.perfiles.length; j++) {
      if (e.perfiles[j].tipo === 'yo') { existente = e.perfiles[j]; break; }
    }
  }

  var perfil = existente || { id:_idPerfil(), creado:ahora };
  perfil.tipo = tipo;
  perfil.nombre = nombre;
  perfil.nacimiento = _limpiarNacimiento(datos.nacimiento);
  perfil.actualizado = ahora;

  if (!existente) e.perfiles.push(perfil);
  if (tipo === 'yo') {
    e.principalId = perfil.id;
    if (!principalAnterior) e.calendarioId = perfil.id;
  }
  if (!e.calendarioId || !leerPerfilEnEstado(e, e.calendarioId)) {
    e.calendarioId = e.principalId || perfil.id;
  }
  return _guardarEstado(e) ? perfil : null;
}

function leerPerfilEnEstado(e, id) {
  for (var i=0; i<e.perfiles.length; i++) if (e.perfiles[i].id === id) return e.perfiles[i];
  return null;
}

function perfilPrincipal() {
  var e = estadoPerfiles();
  var p = leerPerfilEnEstado(e, e.principalId);
  if (p) return p;
  for (var i=0; i<e.perfiles.length; i++) if (e.perfiles[i].tipo === 'yo') return e.perfiles[i];
  return null;
}

function perfilCalendario() {
  var e = estadoPerfiles();
  return leerPerfilEnEstado(e, e.calendarioId) || perfilPrincipal() || e.perfiles[0] || null;
}

function seleccionarPerfilCalendario(id) {
  var e = estadoPerfiles();
  var p = leerPerfilEnEstado(e, id);
  e.calendarioId = p ? p.id : null;
  _guardarEstado(e);
  return p;
}

function olvidarPerfil(id) {
  var e = estadoPerfiles();
  var restantes = [];
  for (var i=0; i<e.perfiles.length; i++) if (e.perfiles[i].id !== id) restantes.push(e.perfiles[i]);
  e.perfiles = restantes;
  if (e.principalId === id) {
    e.principalId = null;
    for (var j=0; j<restantes.length; j++) {
      if (restantes[j].tipo === 'yo') { e.principalId = restantes[j].id; break; }
    }
  }
  if (e.calendarioId === id || !leerPerfilEnEstado(e, e.calendarioId)) {
    e.calendarioId = e.principalId || (restantes[0] ? restantes[0].id : null);
  }
  _guardarEstado(e);
  return restantes.length;
}

function cartaDesdePerfil(perfil) {
  if (!perfil || !_nacimientoValido(perfil.nacimiento)) return null;
  var d = perfil.nacimiento;
  try {
    return cuatroPilares({
      anio:d.anio, mes:d.mes, dia:d.dia,
      hora:d.sinHora ? 12 : d.hora, minuto:d.sinHora ? 0 : d.minuto,
      zona:d.zona, longitud:d.lon
    });
  } catch (e) { return null; }
}

function guardarNacimiento(datos) {
  var p = guardarPerfil({ tipo:'yo', nombre:'Tu carta', nacimiento:datos });
  return !!p;
}

function leerNacimiento() {
  var p = perfilPrincipal();
  return p ? p.nacimiento : null;
}

function olvidarNacimiento() {
  var p = perfilPrincipal();
  if (p) olvidarPerfil(p.id);
}

function cartaGuardada() {
  return cartaDesdePerfil(perfilCalendario());
}

(function (raiz) {
  var api = { MESES, DOW, $, activarApariciones, aplicarPaletaUI, pintarFondo, ir, faltantes, descargarSVG,
              estadoPerfiles, listarPerfiles, leerPerfil, etiquetaPerfil, guardarPerfil, perfilPrincipal,
              perfilCalendario, seleccionarPerfilCalendario, olvidarPerfil, cartaDesdePerfil,
              guardarNacimiento, leerNacimiento, olvidarNacimiento, cartaGuardada };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);

/* ═══ V10.4 · home para perfiles guardados ═══ */
(function (raiz) {
  'use strict';

  if (typeof raiz.lecturaCompleta === 'function' && !raiz.__teLecturaV104) {
    raiz.__teLecturaV104 = true;
    var lecturaAnterior = raiz.lecturaCompleta;
    var ZONA = {
      anio:{nombre:'Tu origen',cuerpo:'Este vacío aparece en Tu origen, la parte de tu carta relacionada con familia, pertenencia, amistades tempranas y el lugar que ocupas dentro de un grupo. Puede sentirse como tardar un poco más en descubrir qué costumbres, personas o ambientes realmente sientes tuyos.'},
      mes:{nombre:'Tu trayectoria',cuerpo:'Este vacío aparece en Tu trayectoria, la parte relacionada con estudios, trabajo, responsabilidades y logros. Puede sentirse como tener que construir tu propio criterio profesional a base de probar, ajustar y encontrar una manera de avanzar que sí te haga sentido.'},
      hora:{nombre:'Tu futuro',cuerpo:'Este vacío aparece en Tu futuro, la parte relacionada con proyectos, hijos, vida interior y lo que quieres dejar construido con el tiempo. Puede sentirse como ir definiendo esa zona más adelante, a medida que descubres qué proyectos merecen de verdad tu energía.'}
    };
    var ELEMENTO = {
      madera:{cuerpo:'Como aquí aparece Madera, el aprendizaje está en crecer con soporte propio: aprender, desarrollar recursos y tomar decisiones que también nazcan de ti.',accion:'Trabájalo así: elige una habilidad o proyecto cuyo siguiente paso dependa principalmente de ti.'},
      fuego:{cuerpo:'Como aquí aparece Fuego, el aprendizaje está en ganar claridad: reconocer qué quieres, hacerlo visible y confiar más en tu propia lectura de la situación.',accion:'Trabájalo así: ponle nombre a lo que quieres antes de buscar aprobación afuera.'},
      tierra:{cuerpo:'Como aquí aparece Tierra, el aprendizaje está en construir estabilidad y también en saber soltar. Tener raíces firmes pesa menos cuando distingues qué merece quedarse contigo y qué ya cumplió su etapa.',accion:'Trabájalo así: identifica una carga que ya puedes dejar y un punto de apoyo que sí quieres conservar.'},
      metal:{cuerpo:'Como aquí aparece Metal, el aprendizaje está en poner en palabras tu criterio: decir lo que piensas, marcar límites y convertir lo que sabes en una posición clara.',accion:'Trabájalo así: expresa una decisión importante de forma simple y concreta.'},
      agua:{cuerpo:'Como aquí aparece Agua, el aprendizaje está en ordenar ideas, decidir y llevar esa decisión a algo concreto. Pensar sirve más cuando termina encontrando un cauce.',accion:'Trabájalo así: convierte una decisión pendiente en un siguiente paso con fecha.'}
    };

    raiz.lecturaCompleta = function (carta, sinHora) {
      var lec = lecturaAnterior(carta, sinHora);
      if (!lec) return lec;
      (lec.pilares || []).forEach(function (p) {
        if (p.clave === 'dia') {
          p.titulo = 'Tu centro';
          p.etapa = 'tu centro y tus vínculos cercanos';
          p.intro = 'Tu centro reúne la parte más personal de la carta. Aquí aparece el tallo que define tu elemento base, junto con una capa ligada a pareja, intimidad y vida emocional.';
        }
      });
      (lec.tensiones || []).forEach(function (x) {
        if (!x.texto) return;
        x.texto = x.texto.replace(/Tu origen y tú/g,'Tu origen y tu centro').replace(/Tu trayectoria y tú/g,'Tu trayectoria y tu centro').replace(/Tú y tu futuro/g,'Tu centro y tu futuro');
      });
      lec.vacios = (lec.vacios || []).map(function (v) {
        var zona = ZONA[v.pilar] || {nombre:v.titulo,cuerpo:v.texto};
        var pilar = carta && carta.pilares ? carta.pilares[v.pilar] : null;
        var elemento = pilar && pilar.tallo ? pilar.tallo.elemento : '';
        var matiz = ELEMENTO[elemento] || {cuerpo:'',accion:v.filo || ''};
        var etiqueta = elemento ? elemento.charAt(0).toUpperCase()+elemento.slice(1) : '';
        return {pilar:v.pilar,titulo:(etiqueta?'Vacío de '+etiqueta+' en ':'Vacío en ')+zona.nombre,texto:zona.cuerpo+(matiz.cuerpo?' '+matiz.cuerpo:''),filo:matiz.accion,rama:v.rama,elemento:elemento,elementoEtiqueta:etiqueta};
      });
      return lec;
    };
  }

  if (typeof document === 'undefined') return;

  function inyectarEstilos() {
    if (document.getElementById('te-v104-css')) return;
    var st = document.createElement('style');
    st.id = 'te-v104-css';
    st.textContent = '#p-portada.portadaRegreso{padding-top:clamp(48px,10vh,86px)}#p-portada.portadaRegreso>h1{margin:14px 0 8px;font-size:clamp(36px,8vw,54px)}#p-portada.portadaRegreso .bibliotecaCartas{width:100%;max-width:680px;margin:22px auto 18px;padding:18px;border-radius:30px;background:linear-gradient(145deg,rgba(255,255,255,.58),rgba(255,255,255,.30));border:1px solid rgba(255,255,255,.80);box-shadow:0 18px 50px rgba(62,46,35,.075),inset 0 1px 0 rgba(255,255,255,.92);-webkit-backdrop-filter:blur(26px) saturate(155%);backdrop-filter:blur(26px) saturate(155%)}#p-portada.portadaRegreso .bibliotecaCab{margin-bottom:16px}#p-portada.portadaRegreso .bibliotecaCab h2{font-family:Georgia,serif;font-size:clamp(25px,5.5vw,34px);font-weight:500;margin:4px 0 5px}#p-portada.portadaRegreso .listaPerfiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}#p-portada.portadaRegreso .perfilCard{display:flex;flex-direction:column;align-items:flex-start;min-width:0;min-height:222px;padding:16px;border-radius:24px;background:rgba(255,255,255,.53);border:1px solid rgba(255,255,255,.78);box-shadow:inset 0 1px 0 rgba(255,255,255,.92),0 9px 28px rgba(55,42,34,.05)}#p-portada.portadaRegreso .perfilIcono{width:54px;height:54px;margin-bottom:12px;border-radius:19px;background:rgba(255,255,255,.72)}#p-portada.portadaRegreso .perfilInfo{width:100%}#p-portada.portadaRegreso .perfilInfo strong{font-size:27px}#p-portada.portadaRegreso .perfilInfo small{white-space:normal;line-height:1.35;margin-top:3px}#p-portada.portadaRegreso .perfilAcciones{display:grid;grid-template-columns:1fr;gap:6px;width:100%;margin-top:auto;padding-top:14px}#p-portada.portadaRegreso .perfilAccion{display:block;text-align:center;padding:9px 10px}#p-portada.portadaRegreso .perfilOlvidar{width:100%;margin:2px 0 0;text-align:center;font-size:11px;opacity:.70}.cartaVolver{position:absolute;z-index:8;left:max(18px,calc((100% - 680px)/2));top:22px;width:46px;height:46px;border-radius:999px;border:1px solid rgba(255,255,255,.82);background:rgba(255,255,255,.48);color:var(--tinta);font-family:Georgia,serif;font-size:34px;line-height:1;display:grid;place-items:center;box-shadow:0 10px 30px rgba(55,42,34,.07),inset 0 1px 0 rgba(255,255,255,.96);-webkit-backdrop-filter:blur(20px) saturate(150%);backdrop-filter:blur(20px) saturate(150%);cursor:pointer}#p-resultado{position:relative}.calPerfilBox.teCompacto{width:min(82%,330px)!important;margin:0 auto 12px!important;padding:7px 9px!important;border-radius:16px!important}.calPerfilBox.teCompacto label{font-size:8px!important;margin-bottom:3px!important}.calPerfilBox.teCompacto select{min-height:38px!important;font-size:13px!important}.calPerfilBox.teCompacto .pista{font-size:10px!important;margin-top:4px!important}@media(max-width:420px){#p-portada.portadaRegreso .listaPerfiles{grid-template-columns:repeat(2,minmax(0,1fr))}#p-portada.portadaRegreso .perfilCard{min-height:210px;padding:13px}.cartaVolver{left:16px;top:18px;width:42px;height:42px;font-size:31px}}';
    document.head.appendChild(st);
  }

  function prepararPortadaRecurrente() {
    var perfiles = typeof listarPerfiles === 'function' ? listarPerfiles() : [];
    var portada = document.getElementById('p-portada');
    if (!portada || !perfiles.length) return;
    portada.classList.add('portadaRegreso');
    var h1 = portada.querySelector('h1');
    if (h1) h1.textContent = 'Bienvenido de nuevo';
    var hijos = portada.children;
    for (var i=0;i<hijos.length;i++) if (hijos[i].classList && hijos[i].classList.contains('bajada')) hijos[i].hidden = true;
    var descubrir = document.getElementById('irForm'); if (descubrir) descubrir.hidden = true;
    var diez = portada.querySelector('.diez'); if (diez) diez.hidden = true;
    var detalle = portada.querySelector('details'); if (detalle) detalle.hidden = true;
    var biblioteca = document.getElementById('bibliotecaCartas');
    if (biblioteca) {
      biblioteca.hidden = false;
      if (h1 && h1.nextSibling !== biblioteca) h1.parentNode.insertBefore(biblioteca,h1.nextSibling);
      var kicker=biblioteca.querySelector('.miniKicker'); if(kicker) kicker.textContent='Tus cartas';
      var titulo=biblioteca.querySelector('h2'); if(titulo) titulo.textContent='Aquí están tus cartas';
      var sub=biblioteca.querySelector('.sub'); if(sub) sub.textContent='Elige una para abrir su lectura o cambia al calendario de esa persona.';
    }
  }

  function prepararCalendario() {
    var titulo=document.querySelector('#p-dias h1');
    if(!titulo || titulo.textContent.indexOf('¿Cómo viene el día?')===-1) return;
    var sig=titulo.nextElementSibling;
    var intro='Cada fecha mezcla dos ritmos del calendario solar chino. Juntos ayudan a ver qué tipo de actividades fluyen mejor ese día y cuáles agradecen un poco más de margen. Con una carta guardada, la lectura también se cruza con su origen.';
    if(sig && sig.classList && sig.classList.contains('bajada')) sig.remove();
    var details=document.querySelector('#p-dias details');
    if(details && !details.querySelector('.teIntroCalendario')) {
      var pp=document.createElement('p'); pp.className='teIntroCalendario'; pp.textContent=intro;
      var summary=details.querySelector('summary'); if(summary) summary.insertAdjacentElement('afterend',pp);
    }
    var selector=document.getElementById('calPerfilBox'); if(selector) selector.classList.add('teCompacto');
  }

  function ponerFlechaCarta() {
    var pantalla=document.getElementById('p-resultado');
    if(!pantalla || pantalla.querySelector('.cartaVolver')) return;
    var b=document.createElement('button'); b.type='button'; b.className='cartaVolver'; b.setAttribute('aria-label','Volver a tus cartas'); b.textContent='‹';
    b.addEventListener('click',function(){prepararPortadaRecurrente();if(typeof PALETA_NEUTRA!=='undefined'&&typeof pintarFondo==='function')pintarFondo(PALETA_NEUTRA,88);if(typeof ir==='function')ir('p-portada');});
    pantalla.appendChild(b);
  }

  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('[data-perfil-ver]'):null;
    if(!t)return;
    var id=t.getAttribute('data-perfil-ver'); if(!id)return;
    e.preventDefault(); e.stopImmediatePropagation(); globalThis.location.href='index.html?perfil='+encodeURIComponent(id);
  },true);

  function listo(){inyectarEstilos();prepararPortadaRecurrente();prepararCalendario();ponerFlechaCarta();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',listo);else setTimeout(listo,0);

})(typeof globalThis !== 'undefined' ? globalThis : this);
