(function(){
'use strict';
if(typeof document==='undefined')return;

/* V11 runtime: formulario robusto + pilares perezosos.
   Este módulo se carga antes de app.js y captura ambos gestos antes de
   que puedan llegar a los controladores heredados del render principal. */

var css=document.createElement('style');
css.textContent='#lectura .hoja,#lectura .inter,#lectura .vidrio,#lectura .col,#lectura .panel{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important;will-change:auto!important}#lectura .revela-prep,#lectura .revela-viva{opacity:1!important;filter:none!important;transform:none!important;transition:none!important}#lectura .panel.abierto,#lectura .pilarUnico{animation:none!important;transition:none!important}';
document.head.appendChild(css);

function $(s){return document.querySelector(s);}

/* ── Crear carta ─────────────────────────────────────────────── */
var procesando=false;
function fallo(msg,el){
  var e=$('#err'); if(e)e.textContent=msg;
  if(el&&el.focus)el.focus();
  procesando=false;
  var b=$('#calcular');
  if(b){b.disabled=false;b.textContent=$('#paraOtra')&&$('#paraOtra').getAttribute('aria-pressed')==='true'?'Ver su elemento':'Ver mi elemento';}
}
function resolverLugar(){
  var c=$('#buscaLugar'); var t=String(c&&c.value||'').trim();
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
  var sinHora=ht===''; var h=sinHora?12:parseInt(ht,10); var min=mt===''?0:parseInt(mt,10);
  if(!sinHora&&(isNaN(h)||h<0||h>23))return fallo('Usa una hora entre 0 y 23.',$('#hora'));
  if(isNaN(min)||min<0||min>59)return fallo('Usa minutos entre 0 y 59.',$('#minuto'));
  var l=resolverLugar();
  if(!l)return fallo('Elige una ciudad de las sugerencias para ubicar correctamente la hora solar.',$('#buscaLugar'));
  var b=$('#calcular'); if(b){b.disabled=true;b.textContent='Abriendo tu carta…';}
  try{
    var p=guardarPerfil({tipo:otra?'otra':'yo',nombre:nombre,nacimiento:{anio:a,mes:m,dia:d,hora:h,minuto:min,sinHora:sinHora,zona:l.z,lon:l.lon,ciudad:l.c,sexo:String($('#sexo').value||'')}});
    if(!p||!p.id)throw new Error('save');
    location.href='index.html?perfil='+encodeURIComponent(p.id)+'&fresh='+Date.now();
  }catch(ex){console.error('Tu Elemento V11 · guardar',ex);fallo('La carta encontró un tropiezo al guardarse. Vuelve a tocar el botón.');}
}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#calcular'):null;if(b)enviar(e);},true);
document.addEventListener('submit',function(e){if(e.target&&e.target.id==='forma')enviar(e);},true);

/* ── Pilares: un panel, creado solo al primer toque ─────────── */
var estado=null;
function arr(x){return Array.prototype.slice.call(x||[]);}
function activar(i){
  if(!estado||!estado.panel||!estado.contenidos[i])return;
  estado.cols.forEach(function(b,n){var on=n===i;b.setAttribute('aria-expanded',on?'true':'false');var mas=b.querySelector('.mas');if(mas)mas.textContent=on?'cerrar':'leer';});
  estado.panel.innerHTML=estado.contenidos[i];
}
function preparar(){
  var lectura=$('#lectura'); if(!lectura)return false;
  var cols=arr(lectura.querySelectorAll('.columnas .col')); if(cols.length<2)return false;
  if(estado&&estado.lectura===lectura&&estado.cols[0]&&document.contains(estado.cols[0]))return true;
  var paneles=arr(lectura.querySelectorAll('.panel')).filter(function(p){return!p.classList.contains('pilarUnico');});
  if(paneles.length<cols.length)return false;
  var contenidos=paneles.slice(0,cols.length).map(function(p){return p.innerHTML;});
  paneles.slice(0,cols.length).forEach(function(p){p.remove();});
  var panel=document.createElement('div'); panel.className='panel abierto pilarUnico'; panel.setAttribute('role','region');
  cols[0].parentElement.insertAdjacentElement('afterend',panel);
  estado={lectura:lectura,cols:cols,contenidos:contenidos,panel:panel};
  activar(0); return true;
}
document.addEventListener('click',function(e){
  var b=e.target&&e.target.closest?e.target.closest('#lectura .columnas .col'):null;
  if(!b)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  if(!preparar())return;
  var i=estado.cols.indexOf(b); activar(i<0?0:i);
},true);
})();