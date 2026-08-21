(function(){
'use strict';
if(typeof document==='undefined')return;

function $(s,r){return (r||document).querySelector(s);}
function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

var css=document.createElement('style');
css.id='te-pulido-103-css';
css.textContent=[
  '#lectura .pilarEstaticoLectura>p:nth-of-type(2){margin-bottom:13px!important}',
  '#lectura .pilarEstaticoLectura>p:nth-of-type(n+3){font-size:15px!important;line-height:1.58!important;color:rgba(107,98,89,.82)!important}',
  '#lectura .pilarEstaticoLectura>p.tension:nth-of-type(n+3){font-size:15px!important;color:rgba(91,82,74,.76)!important}',
  '@media(max-width:540px){#lectura .pilarEstaticoLectura>p:nth-of-type(n+3){font-size:14.5px!important;line-height:1.57!important}}',

  /* La continuidad depende solo de que la carta esté activa. */
  '#seguirCarta{display:none!important}',
  '#p-resultado.viva #seguirCarta{display:grid!important;position:fixed!important;z-index:140!important;left:50%!important;bottom:max(22px,env(safe-area-inset-bottom,0px))!important;transform:translateX(-50%)!important;width:min(382px,calc(100vw - 28px))!important;margin:0!important;padding:12px 12px 12px 18px!important;border:1px solid rgba(255,255,255,.92)!important;border-radius:999px!important;background:linear-gradient(155deg,rgba(255,255,255,.91),rgba(255,255,255,.64))!important;box-shadow:0 18px 48px rgba(58,43,34,.20),inset 0 1px 0 rgba(255,255,255,1)!important;-webkit-backdrop-filter:blur(22px) saturate(165%)!important;backdrop-filter:blur(22px) saturate(165%)!important;opacity:1!important;pointer-events:auto!important;transition:opacity .22s ease,transform .22s ease!important}',
  '#p-resultado.viva #seguirCarta.teContinuidadOculta{opacity:0!important;pointer-events:none!important;transform:translate(-50%,12px)!important}',
  '#p-resultado.viva #seguirCarta .seguirTexto{font-size:16px!important;font-weight:680!important;font-style:normal!important;letter-spacing:-.1px!important}',
  '#p-resultado.viva #seguirCarta small{font-size:9px!important;letter-spacing:.72px!important;color:var(--tinta-suave)!important}',
  '#p-resultado.viva #seguirCarta .seguirFlecha{width:38px!important;height:38px!important;font-size:22px!important;background:rgba(255,255,255,.72)!important;border:1px solid rgba(255,255,255,.92)!important;box-shadow:0 4px 13px rgba(58,43,34,.08)!important}',
  '@media(max-width:430px){#p-resultado.viva #seguirCarta{width:calc(100vw - 24px)!important;bottom:max(14px,env(safe-area-inset-bottom,0px))!important;padding:11px 11px 11px 16px!important}#p-resultado.viva #seguirCarta .seguirTexto{font-size:15.5px!important}}',

  '#lectura .teBloqueMes{text-align:center}',
  '#lectura .teBloqueMes .btn{display:inline-block;margin-top:6px;text-decoration:none}',
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
  if(cal){try{return new URL(cal.href,location.href).searchParams.get('perfil')||'';}catch(e){}}
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
  var arriba=$('#p-resultado .teMesCarta');
  if(arriba)arriba.remove();
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
  btn.classList.toggle('teContinuidadOculta',window.scrollY>180);
  var t=$('.seguirTexto',btn),s=$('small',btn);
  if(t)t.textContent='Hay mucho más en tu carta';
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
  if(carta){carta.classList.add('teAccPrimaria');carta.textContent='Ver carta';}
  if(nueva){nueva.classList.add('teAccSecundaria');nueva.textContent=id?'Nueva carta':'Crear una carta';}
  if(olvidar){olvidar.classList.add('teAccSecundaria');olvidar.textContent='Olvidar carta';}
}
function refrescar(){ajustarCarta();ajustarCalendario();pedirContinuidad();}

refrescar();
setTimeout(refrescar,0);
setTimeout(refrescar,250);

var lectura=$('#lectura');
if(lectura&&typeof MutationObserver!=='undefined'){
  new MutationObserver(function(){ajustarCarta();pedirContinuidad();}).observe(lectura,{childList:true,subtree:false});
}
var resultado=$('#p-resultado');
if(resultado&&typeof MutationObserver!=='undefined'){
  new MutationObserver(pedirContinuidad).observe(resultado,{attributes:true,attributeFilter:['class']});
}
var perfil=$('#perfilCal');
if(perfil)perfil.addEventListener('change',function(){setTimeout(ajustarCalendario,0);});
window.addEventListener('scroll',pedirContinuidad,{passive:true});
window.addEventListener('resize',pedirContinuidad,{passive:true});
document.addEventListener('click',function(e){
  if(e.target&&e.target.closest&&e.target.closest('[data-nueva-carta],#volverCartas,#volverPortada'))setTimeout(pedirContinuidad,0);
});
})();
