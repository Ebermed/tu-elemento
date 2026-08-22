/** TU ELEMENTO V3 CELL PREVIEW — punto de entrada único de Carta. */
(function(root){
'use strict';
if(typeof document==='undefined')return;
function cargar(src,id,done){
  var existente=document.getElementById(id);
  if(existente){if(done)done();return;}
  var s=document.createElement('script');s.id=id;s.src=src;s.onload=function(){if(done)done();};document.body.appendChild(s);
}
function iniciar(){
  cargar('copy-v3.js?b=3.0.2-cell','te-copy-v3',function(){
    cargar('carta-v3-render.js?b=3.0.2-cell','te-carta-v3-render',function(){
      if(root.TE_V3_RENDER)root.TE_V3_RENDER();
    });
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})(typeof globalThis!=='undefined'?globalThis:this);
