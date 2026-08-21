(function(){
'use strict';
if(typeof document==='undefined')return;

function $(s,r){return (r||document).querySelector(s);}
function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

var css=document.createElement('style');
css.id='te-pulido-102-css';
css.textContent=[
  /* Jerarquía dentro de cada pilar: explicación base > lectura particular */
  '#lectura .pilarEstaticoLectura>p:nth-of-type(2){margin-bottom:13px!important}',
  '#lectura .pilarEstaticoLectura>p:nth-of-type(n+3){font-size:15px!important;line-height:1.58!important;color:rgba(107,98,89,.82)!important}',
  '#lectura .pilarEstaticoLectura>p.tension:nth-of-type(n+3){font-size:15px!important;color:rgba(91,82,74,.76)!important}',
  '@media(max-width:540px){#lectura .pilarEstaticoLectura>p:nth-of-type(n+3){font-size:14.5px!important;line-height:1.57!important}}',

  /* Señal de continuidad: siempre visible en la cabecera, desaparece al bajar. */
  '#seguirCarta{display:none!important}',
  '#seguirCarta.teContinuidadVisible{display:grid!important;position:fixed!important;z-index:110!important;left:50%!important;bottom:calc(env(safe-area-inset-bottom,0px) + 18px)!important;transform:translateX(-50%)!important;width:min(360px,calc(100vw - 32px))!important;margin:0!important;padding:11px 12px 11px 17px!important;border:1px solid rgba(255,255,255,.88)!important;border-radius:999px!important;background:linear-gradient(155deg,rgba(255,255,255,.84),rgba(255,255,255,.54))!important;box-shadow:0 16px 42px rgba(58,43,34,.16),inset 0 1px 0 rgba(255,255,255,.98)!important;-webkit-backdrop-filter:blur(20px) saturate(155%)!important;backdrop-filter:blur(20px) saturate(155%)!important}',
  '#seguirCarta.teContinuidadVisible .seguirTexto{font-size:16px!important;font-weight:600!important;font-style:normal!important}',
  '#seguirCarta.teContinuidadVisible small{font-size:9px!important;letter-spacing:.82px!important}',
  '#seguirCarta.teContinuidadVisible .seguirFlecha{width:35px!important;height:35px!important;font-size:21px!important}',

  /* Tu mes como módulo hermano de Calendario y Ciclos. */
  '#lectura .teBloqueMes{text-align:center}',
  '#lectura .teBloqueMes .btn{display:inline-block;margin-top:6px;text-decoration:none}',

  /* Calendario: una sola placa de acciones, jerarquía clara. */
  '.calAcciones.teAccionesOrdenadas{display:grid!important;grid-template-columns:1fr 1fr!important;gap:9px!important;width:min(100%,520px)!important;margin:24px auto 0!important;padding:11px!important;border:1px solid rgba(255,255,255,.78)!important;border-radius:24px!important;background:linear-gradient(155deg,rgba(255,255,255,.48),rgba(255,255,255,.26))!important;box-shadow:0 14px 38px rgba(58,43,34,.085),inset 0 1px 0 rgba(255,255,255,.9)!important;-webkit-backdrop-filter:blur(18px) saturate(145%)!important;backdrop-filter:blur(18px) saturate(145%)!important}',
  '.calAcciones.teAccionesOrdenadas .btn{width:100%!important;min-width:0!important;margin:0!important;text-align:center!important;text-decoration:none!important;display:flex!important;align-items:center!important;justify-content:center!important;line-height:1.25!important}',
  '.calAcciones.teAccionesOrdenadas .teAccPrimaria{min-height:52px!important;padding:10px 12px!important;border-radius:16px!important;border:1px solid rgba(255,255,255,.84)!important;background:rgba(255,255,255,.66)!important;color:var(--tinta)!important;font-size:14px!important;font-weight:600!important;box-shadow:0 5px 16px rgba(58,43,34,.055),inset 0 1px 0 rgba(255,255,255,.94)!important}',
  '.calAcciones.teAccionesOrdenadas .teAccSecundaria{min-height:38px!important;padding:7px 10px!important;border:0!important;border-radius:13px!important;background:transparent!important;color:var(--tinta-suave)!important;font-size:12.5px!important;font-weight:500!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;text-decoration:none!important}',
  '.calAcciones.teAccionesOrdenadas .teAccSecundaria:hover{background:rgba(255,255,255,.28)!important}',
  '@media(max-width:430px){.calAcciones.teAccionesOrdenadas{padding:9px!important;gap:7px!important;border-radius:21px!important}.calAcciones.teAccionesOrdenadas .teAccPrimaria{min-height:49px!important;font-size:13.5px!important}.calAcciones.teAccionesOrdenadas .teAccSecundaria{font-size:12px!important;padding-inline:5px!important}}'
].join('');
document.head.appendChild(css);

function perfilDesdeCalendario(){
  var s=$('#perfilCal');
  return s&&s.value?s.value:'';
}
function perfilDesdeCarta(){
  var cal=$('#abrirCalendario');
  if(cal){
    try{return new URL(cal.href,location.href).searchParams.get('perfil')||'';}catch(e){}
  }
  try{return new URLSearchParams(location.search).get('perfil')||'';}catch(e2){return'';}
}

function bloqueMesHTML(id){
  var href='mes.html'+(id?'?perfil='+encodeURIComponent(id):'');
  return '<h2 class="titIcon cent"><span class="iconito" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M17.5 15.5A7 7 0 0 1 8.5 6.5 7.5 7.5 0 1 0 17.5 15.5z"/></svg></span><span>Tu mes</span></h2>'+
    '<p class="sub">Mira qué dinámica toma este mes cuando se cruza con tu carta y en qué parte de tu vida puede sentirse más.</p>'+
    '<a class="btn" href="'+esc(href)+'">Ver tu mes</a>';
}

function ajustarCarta(){
  var lectura=$('#lectura');
  if(!lectura)return;

  /* Retira el CTA provisional de la cabecera. */
  var arriba=$('#p-resultado .teMesCarta');
  if(arriba)arriba.remove();

  /* Inserta Tu mes junto a los módulos de calendario/ciclos. */
  var abrirCal=$('#abrirCalendario');
  if(abrirCal&&!lectura.querySelector('.teBloqueMes')){
    var hojaCal=abrirCal.closest('.hoja');
    if(hojaCal){
      var mes=document.createElement('div');
      mes.className='hoja teBloqueMes';
      mes.innerHTML=bloqueMesHTML(perfilDesdeCarta());
      hojaCal.insertAdjacentElement('afterend',mes);
    }
  }else if(lectura.querySelector('.teBloqueMes')){
    var enlace=$('.teBloqueMes a',lectura),id=perfilDesdeCarta();
    if(enlace)enlace.href='mes.html'+(id?'?perfil='+encodeURIComponent(id):'');
  }
}

var scrollPendiente=false;
function actualizarContinuidad(){
  scrollPendiente=false;
  var btn=$('#seguirCarta'),res=$('#p-resultado');
  if(!btn||!res)return;
  var viva=res.classList.contains('viva');
  btn.classList.toggle('teContinuidadVisible',viva&&window.scrollY<330);
  var t=$('.seguirTexto',btn),s=$('small',btn);
  if(t)t.textContent='Sigue leyendo tu carta';
  if(s)s.textContent='4 pilares · balance · tu mes · calendario · ciclos';
}
function pedirContinuidad(){
  if(scrollPendiente)return;
  scrollPendiente=true;
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(actualizarContinuidad);
  else setTimeout(actualizarContinuidad,16);
}

function ajustarCalendario(){
  var acciones=$('.calAcciones');
  if(!acciones)return;
  acciones.classList.add('teAccionesOrdenadas');
  var mes=$('#verTuMesCal'),carta=$('#verCartaPerfil'),nueva=$('.calAcciones a[href*="nueva=1"]'),olvidar=$('#olvidar');
  var id=perfilDesdeCalendario();

  if(mes){
    mes.classList.remove('fantasma');
    mes.classList.add('teAccPrimaria');
    mes.textContent='Tu mes';
    mes.hidden=!id;
    mes.href='mes.html'+(id?'?perfil='+encodeURIComponent(id):'');
  }
  if(carta){
    carta.classList.add('teAccPrimaria');
    carta.textContent='Ver carta';
  }
  if(nueva){
    nueva.classList.add('teAccSecundaria');
    nueva.textContent=id?'Nueva carta':'Crear una carta';
  }
  if(olvidar){
    olvidar.classList.add('teAccSecundaria');
    olvidar.textContent='Olvidar carta';
  }
}

function refrescar(){
  ajustarCarta();
  ajustarCalendario();
  pedirContinuidad();
}

refrescar();
setTimeout(refrescar,0);
setTimeout(refrescar,250);

var lectura=$('#lectura');
if(lectura&&typeof MutationObserver!=='undefined'){
  new MutationObserver(function(){ajustarCarta();pedirContinuidad();}).observe(lectura,{childList:true,subtree:false});
}
var acciones=$('.calAcciones');
if(acciones&&typeof MutationObserver!=='undefined'){
  new MutationObserver(ajustarCalendario).observe(acciones,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','href']});
}
var perfil=$('#perfilCal');
if(perfil)perfil.addEventListener('change',function(){setTimeout(ajustarCalendario,0);});
window.addEventListener('scroll',pedirContinuidad,{passive:true});
window.addEventListener('resize',pedirContinuidad,{passive:true});
document.addEventListener('click',function(e){
  if(e.target&&e.target.closest&&e.target.closest('[data-nueva-carta],#volverCartas,#volverPortada'))setTimeout(pedirContinuidad,0);
});
})();
