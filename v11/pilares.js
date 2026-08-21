(function(){
'use strict';
if(typeof document==='undefined')return;

/* V11.2 · runtime estable.
   Conserva el flujo robusto de creación de cartas y reemplaza el acordeón
   por cuatro lecturas estáticas. Cero interacción, cero cambios de altura. */

function $(s){return document.querySelector(s);}
function arr(x){return Array.prototype.slice.call(x||[]);}

/* ── Crear carta ─────────────────────────────────────────────── */
var procesando=false;
function fallo(msg,el){
  var e=$('#err');if(e)e.textContent=msg;
  if(el&&el.focus)el.focus();
  procesando=false;
  var b=$('#calcular');
  if(b){
    b.disabled=false;
    b.textContent=$('#paraOtra')&&$('#paraOtra').getAttribute('aria-pressed')==='true'?'Ver su elemento':'Ver mi elemento';
  }
}
function resolverLugar(){
  var c=$('#buscaLugar');
  var t=String(c&&c.value||'').trim();
  if(!t||typeof buscarLugares!=='function')return null;
  var a=buscarLugares(t,8)||[];
  if(!a.length){var s=t.split(/[·,]/)[0].trim();a=s?(buscarLugares(s,8)||[]):[];}
  return a[0]||null;
}
function enviar(ev){
  if(ev){ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();}
  if(procesando)return;
  procesando=true;
  var otra=$('#paraOtra')&&$('#paraOtra').getAttribute('aria-pressed')==='true';
  var nombre=otra?String($('#nombreCarta').value||'').trim():'Tu carta';
  if(otra&&!nombre)return fallo('Pon un nombre o apodo para guardar esta carta.',$('#nombreCarta'));
  var d=parseInt($('#dia').value,10),m=parseInt($('#mes').value,10),a=parseInt($('#anio').value,10);
  if(!d||!m||!a)return fallo('Completa día, mes y año.');
  if(a<1900||a>2030)return fallo('Usa un año entre 1900 y 2030.',$('#anio'));
  var max=new Date(a,m,0).getDate();
  if(d<1||d>max)return fallo((MESES[m-1]||'Ese mes')+' de '+a+' tiene '+max+' días.',$('#dia'));
  var ht=String($('#hora').value||''),mt=String($('#minuto').value||'');
  var sinHora=ht==='';
  var h=sinHora?12:parseInt(ht,10);
  var min=mt===''?0:parseInt(mt,10);
  if(!sinHora&&(isNaN(h)||h<0||h>23))return fallo('Usa una hora entre 0 y 23.',$('#hora'));
  if(isNaN(min)||min<0||min>59)return fallo('Usa minutos entre 0 y 59.',$('#minuto'));
  var l=resolverLugar();
  if(!l)return fallo('Elige una ciudad de las sugerencias para ubicar correctamente la hora solar.',$('#buscaLugar'));
  var b=$('#calcular');
  if(b){b.disabled=true;b.textContent='Abriendo tu carta…';}
  try{
    var p=guardarPerfil({
      tipo:otra?'otra':'yo',nombre:nombre,
      nacimiento:{anio:a,mes:m,dia:d,hora:h,minuto:min,sinHora:sinHora,zona:l.z,lon:l.lon,ciudad:l.c,sexo:String($('#sexo').value||'')}
    });
    if(!p||!p.id)throw new Error('save');
    location.href='index.html?perfil='+encodeURIComponent(p.id)+'&fresh='+Date.now();
  }catch(ex){
    console.error('Tu Elemento V11.2 · guardar',ex);
    fallo('La carta encontró un tropiezo al guardarse. Vuelve a tocar el botón.');
  }
}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#calcular'):null;if(b)enviar(e);},true);
document.addEventListener('submit',function(e){if(e.target&&e.target.id==='forma')enviar(e);},true);

/* ── Iconos de los 12 animales ──────────────────────────────── */
function animalIcon(animal){
  var a=String(animal||'').toLowerCase();
  var dibujos={
    'rata':'<circle cx="9" cy="9" r="2.2"/><circle cx="15" cy="9" r="2.2"/><path d="M8 10.5c1-2 7-2 8 0 1 2 .5 5-4 7-4.5-2-5-5-4-7zM12 13v1M6 13h3M15 13h3"/>',
    'buey':'<path d="M8 9C6 8 5 6 5 4c3 0 5 1 6 3M16 9c2-1 3-3 3-5-3 0-5 1-6 3M8 9c1-2 7-2 8 0v6c-1 3-7 3-8 0V9zM10 14h4"/>',
    'tigre':'<path d="M7 8 5 5l4 1M17 8l2-3-4 1M7 8c1-2 9-2 10 0v7c-2 3-8 3-10 0V8zM9 10h6M10 12h4M12 9v6"/>',
    'conejo':'<path d="M9 9C7 6 7 2 9 2c2 0 2 4 2 7M15 9c2-3 2-7 0-7-2 0-2 4-2 7M8 10c1-2 7-2 8 0v5c-1 3-7 3-8 0v-5zM10 13h.1M14 13h.1"/>',
    'dragón':'<path d="M5 15c2-5 4-7 8-7 3 0 5 2 6 4-2-1-4 0-5 2-2 3-6 4-9 1zM10 8 8 5M14 8l2-3M17 11l2-1"/>',
    'serpiente':'<path d="M8 6c4-3 8-1 8 2 0 4-8 3-8 7 0 3 5 4 8 1M16 8h.1"/>',
    'caballo':'<path d="M8 18V9l3-5 5 3v8c-1 3-5 4-8 3zM11 8h5M13 10h.1M8 11 5 9"/>',
    'cabra':'<path d="M8 9C6 7 6 4 7 3c2 1 3 3 3 5M16 9c2-2 2-5 1-6-2 1-3 3-3 5M8 9c1-2 7-2 8 0v6c-2 3-6 3-8 0V9zM10 13h4"/>',
    'mono':'<circle cx="12" cy="12" r="6"/><circle cx="5.5" cy="12" r="2"/><circle cx="18.5" cy="12" r="2"/><path d="M9 11c1-2 5-2 6 0v4c-1 2-5 2-6 0v-4zM10 14h4"/>',
    'gallo':'<path d="M9 18V8c2-3 6-3 8 0v6c-1 3-5 5-8 4zM11 6c0-2 2-3 3-1 1-2 3-1 3 1M17 9l3 2-3 1M7 10 4 8M7 13 4 14"/>',
    'perro':'<path d="M8 8 5 5v6M16 8l3-3v6M8 8c1-2 7-2 8 0v7c-1 3-7 3-8 0V8zM10 12h.1M14 12h.1M10 15h4"/>',
    'cerdo':'<path d="M7 9C8 6 16 6 17 9v6c-2 3-8 3-10 0V9zM8 8 6 5l4 2M16 8l2-3-4 2M9 13c1-2 5-2 6 0v2c-1 2-5 2-6 0v-2zM11 14h.1M13 14h.1"/>'
  };
  var cuerpo=dibujos[a]||'<circle cx="12" cy="12" r="6"/><path d="M9 12h6M12 9v6"/>';
  return '<span class="pilarAnimalIcon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">'+cuerpo+'</svg></span>';
}

/* ── Pilares desplegados + pulido de jerarquía ─────────────── */
var estilos=document.createElement('style');
estilos.id='v112-pilares-css';
estilos.textContent=[
  '#lectura .pilaresEstaticosV112{display:grid;gap:14px;margin-top:18px}',
  '#lectura .pilarEstaticoV112{padding:18px;border:1px solid rgba(255,255,255,.82);border-radius:22px;background:rgba(255,253,249,.62);box-shadow:0 10px 28px rgba(62,46,35,.055),inset 0 1px 0 rgba(255,255,255,.88)}',
  '#lectura .pilarEstaticoCab{display:flex;align-items:center;gap:13px;margin-bottom:13px}',
  '#lectura .pilarAnimalIcon{width:48px;height:48px;flex:0 0 48px;border-radius:16px;display:grid;place-items:center;background:rgba(255,255,255,.70);border:1px solid rgba(255,255,255,.9);box-shadow:0 7px 20px rgba(58,43,34,.055);color:var(--acento,var(--tinta))}',
  '#lectura .pilarAnimalIcon svg{width:29px;height:29px}',
  '#lectura .pilarEstaticoMeta{min-width:0;display:flex;flex-direction:column;gap:2px}',
  '#lectura .pilarEstaticoMeta small{font-size:10px;line-height:1.2;letter-spacing:1.7px;text-transform:uppercase;color:var(--tinta-suave);font-weight:720}',
  '#lectura .pilarEstaticoMeta strong{font-family:var(--serif);font-size:25px;line-height:1.05;font-weight:500}',
  '#lectura .pilarEstaticoMeta em{font-family:var(--serif);font-size:16px;color:var(--tinta-suave)}',
  '#lectura .pilarVacioV112{display:inline-flex;align-items:center;width:max-content;margin-top:5px;padding:3px 8px;border-radius:999px;background:rgba(46,42,38,.07);font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:var(--tinta-suave)}',
  '#lectura .pilarEstaticoLectura{padding-top:13px;border-top:1px solid rgba(46,42,38,.10)}',
  '#lectura .pilarEstaticoLectura .quien{margin:0 0 10px!important;font-family:var(--sans)!important;font-size:12px!important;line-height:1.35!important;letter-spacing:.45px!important;text-transform:none!important;color:var(--tinta)!important;font-weight:760!important}',
  '#lectura .vacioMeta{font-family:var(--sans)!important;font-size:13px!important;line-height:1.35!important;font-weight:500!important;color:rgba(107,98,89,.68)!important;letter-spacing:.1px!important}',
  '#lectura .pilarEstaticoV112,#lectura .pilarEstaticoV112 *{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important;transform:none!important}',
  '#p-resultado .resultadoAcciones{flex-wrap:wrap;gap:10px}',
  '#p-resultado .resultadoAcciones .teMesCarta{min-width:170px;text-decoration:none;text-align:center}',
  '#seguirCarta.tePistaScroll{position:fixed;z-index:70;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);transform:translateX(-50%);width:min(340px,calc(100vw - 36px));margin:0;padding:10px 13px 10px 16px;border:1px solid rgba(255,255,255,.84);border-radius:999px;background:linear-gradient(155deg,rgba(255,255,255,.78),rgba(255,255,255,.48));box-shadow:0 14px 38px rgba(58,43,34,.13),inset 0 1px 0 rgba(255,255,255,.94);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%)}',
  '#seguirCarta.tePistaScroll .seguirTexto{font-size:16px}',
  '#seguirCarta.tePistaScroll small{font-size:9px;letter-spacing:.9px}',
  '#seguirCarta.tePistaScroll .seguirFlecha{width:34px;height:34px;font-size:20px}',
  '@media(max-width:540px){#lectura .pilarEstaticoV112{padding:16px;border-radius:20px}#lectura .pilarAnimalIcon{width:44px;height:44px;flex-basis:44px;border-radius:15px}#lectura .pilarAnimalIcon svg{width:27px;height:27px}#lectura .pilarEstaticoMeta strong{font-size:23px}#p-resultado .resultadoAcciones .btn{min-width:0;flex:1 1 160px}}'
].join('');
document.head.appendChild(estilos);

function transformarPilares(){
  var lectura=$('#lectura');
  if(!lectura)return false;
  var columnas=lectura.querySelector('.columnas');
  if(!columnas||lectura.querySelector('.pilaresEstaticosV112'))return false;
  var cols=arr(columnas.querySelectorAll('.col'));
  var paneles=arr(lectura.querySelectorAll('.panel'));
  if(!cols.length||paneles.length<cols.length)return false;

  var wrap=document.createElement('div');
  wrap.className='pilaresEstaticosV112';
  cols.forEach(function(col,i){
    var titulo=String(col.querySelector('.rot')&&col.querySelector('.rot').textContent||'Pilar').trim();
    var animal=String(col.querySelector('.an')&&col.querySelector('.an').textContent||'').trim();
    var elemento=String(col.querySelector('.el')&&col.querySelector('.el').textContent||'').trim();
    var vacio=!!col.querySelector('.vac');
    var art=document.createElement('article');
    art.className='pilarEstaticoV112';
    art.innerHTML='<header class="pilarEstaticoCab">'+animalIcon(animal)+'<div class="pilarEstaticoMeta"><small>'+titulo+'</small><strong>'+animal+'</strong><em>'+elemento+'</em>'+(vacio?'<span class="pilarVacioV112">Vacío</span>':'')+'</div></header><div class="pilarEstaticoLectura">'+paneles[i].innerHTML+'</div>';
    wrap.appendChild(art);
  });

  var hoja=columnas.closest('.hoja');
  if(hoja){
    var b=hoja.querySelector('.sub b');
    if(b&&/Toca cada pilar/i.test(b.textContent||''))b.remove();
  }
  columnas.parentNode.insertBefore(wrap,columnas);
  columnas.remove();
  paneles.slice(0,cols.length).forEach(function(p){p.remove();});
  return true;
}

function perfilDeRuta(){
  try{return new URLSearchParams(location.search).get('perfil')||'';}catch(e){return'';}
}

function instalarMesCarta(){
  var acciones=$('#p-resultado .resultadoAcciones');
  if(!acciones||acciones.querySelector('.teMesCarta'))return;
  var a=document.createElement('a');
  a.className='btn fantasma teMesCarta';
  a.textContent='Ver tu mes';
  var id=perfilDeRuta();
  a.href='mes.html'+(id?'?perfil='+encodeURIComponent(id):'');
  acciones.appendChild(a);
}

var scrollPendiente=false;
function actualizarPistaScroll(){
  scrollPendiente=false;
  var btn=$('#seguirCarta'),pant=$('#p-resultado');
  if(!btn||!pant)return;
  var activa=pant.classList.contains('viva');
  var lectura=$('#lectura');
  var inicioLectura=lectura&&lectura.getBoundingClientRect?lectura.getBoundingClientRect().top:9999;
  var mostrar=activa&&window.scrollY<220&&inicioLectura>window.innerHeight*.74;
  btn.classList.toggle('tePistaScroll',mostrar);
}
function pedirPistaScroll(){
  if(scrollPendiente)return;
  scrollPendiente=true;
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(actualizarPistaScroll);
  else setTimeout(actualizarPistaScroll,16);
}

function instalarUIExtra(){
  instalarMesCarta();
  pedirPistaScroll();
}

var lectura=$('#lectura');
var obs=null;
if(lectura&&typeof MutationObserver!=='undefined'){
  obs=new MutationObserver(function(){
    if(!lectura.querySelector('.columnas'))return;
    obs.disconnect();
    transformarPilares();
    instalarUIExtra();
    obs.observe(lectura,{childList:true});
  });
  obs.observe(lectura,{childList:true});
}
setTimeout(function(){transformarPilares();instalarUIExtra();},0);
window.addEventListener('scroll',pedirPistaScroll,{passive:true});
window.addEventListener('resize',pedirPistaScroll,{passive:true});

/* Cualquier botón viejo que alcance a existir durante un frame queda inerte. */
document.addEventListener('click',function(e){
  var viejo=e.target&&e.target.closest?e.target.closest('#lectura .columnas .col'):null;
  if(viejo){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();}
},true);

})();