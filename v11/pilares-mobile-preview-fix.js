/* TU ELEMENTO — fix de render móvil para Pilares en copy-v2-preview */
(function(root){
'use strict';
if(typeof document==='undefined')return;
var params;
try{params=new URLSearchParams(location.search);}catch(e){return;}
if(params.get('vista')!=='pilares')return;
document.documentElement.setAttribute('data-vista-pilares-preview','1');

function perfilDisponible(){
  if(!root.leerPerfil)return null;
  var id=params.get('perfil')||'',p=id?root.leerPerfil(id):null;
  if(!p&&root.perfilPrincipal)p=root.perfilPrincipal();
  if(!p&&root.perfilCalendario)p=root.perfilCalendario();
  if(!p&&root.listarPerfiles){var ps=root.listarPerfiles();p=ps&&ps[0]||null;}
  if(p&&p.id&&p.id!==id){
    try{
      params.set('perfil',p.id);
      history.replaceState(null,'',location.pathname+'?'+params.toString()+location.hash);
    }catch(e){}
  }
  return p;
}

function ocultarGeneral(){
  ['seguirCarta','compartirMarco'].forEach(function(id){
    var el=document.getElementById(id);if(!el)return;
    el.hidden=true;el.setAttribute('aria-hidden','true');el.style.setProperty('display','none','important');
  });
  var acciones=document.querySelector('.resultadoAcciones');
  if(acciones){acciones.hidden=true;acciones.style.setProperty('display','none','important');}
}

var intentos=0,ultimoContenido='';
function forzar(){
  ocultarGeneral();
  var p=perfilDisponible();
  if(!p){
    intentos++;
    if(intentos<40)setTimeout(forzar,100);
    else{
      var caja=document.getElementById('lectura');
      if(caja&&!caja.textContent.trim())caja.innerHTML='<div class="copyPilaresError"><strong>No encontré esta carta en este navegador.</strong><p>Abre una de tus cartas guardadas aquí y vuelve a entrar a Pilares.</p></div>';
    }
    return;
  }
  try{if(typeof root.TE_CARTA_PROFUNDA_RENDER==='function')root.TE_CARTA_PROFUNDA_RENDER();}catch(e){}
  setTimeout(function(){
    ocultarGeneral();
    var caja=document.getElementById('lectura'),grid=caja&&caja.querySelector('.cpPilares');
    if(grid){
      caja.style.removeProperty('min-height');
      caja.style.setProperty('display','block');
      caja.style.setProperty('opacity','1');
      var firma=(p.id||'')+'|'+(grid.textContent||'').length;
      if(firma!==ultimoContenido){ultimoContenido=firma;}
      return;
    }
    intentos++;
    if(intentos<40)setTimeout(forzar,100);
  },45);
}

function vigilar(){
  ocultarGeneral();
  forzar();
  if(typeof MutationObserver!=='undefined'){
    new MutationObserver(function(){
      ocultarGeneral();
      var caja=document.getElementById('lectura');
      if(caja&&!caja.querySelector('.cpPilares')&&intentos<40)setTimeout(forzar,25);
    }).observe(document.body,{childList:true,subtree:true});
  }
  root.addEventListener&&root.addEventListener('pageshow',function(){intentos=0;setTimeout(forzar,20);});
}
if(document.readyState==='complete')vigilar();else root.addEventListener('load',vigilar,{once:true});
})(typeof globalThis!=='undefined'?globalThis:this);
