/** TU ELEMENTO V3 CELL PREVIEW — hero editorial. */
(function(root){
'use strict';
if(typeof document==='undefined')return;
function aplicar(){
  var C=root.TE_COPY_V3,hero=document.getElementById('resultadoHero');
  if(!C||!C.heroes||!hero)return false;
  var elemento=hero.querySelector('.resultadoElemento'),descripcion=hero.querySelector('.resultadoDescripcion');
  if(!elemento||!descripcion)return false;
  var partes=elemento.textContent.split('·').map(function(x){return x.trim();});
  if(partes.length<2)return false;
  var el=partes[0].toLowerCase(),pol=partes[1],copy=C.heroes[el+'|'+pol];
  if(!copy)return false;
  descripcion.innerHTML='<strong>'+copy.titulo+'</strong><span class="heroV3Texto">'+copy.texto+'</span>';
  descripcion.setAttribute('data-copy-cell','1');
  return true;
}
function intentar(n){if(aplicar()||n>8)return;setTimeout(function(){intentar(n+1);},40);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){intentar(0);},{once:true});else intentar(0);
root.TE_V3_HERO=aplicar;
})(typeof globalThis!=='undefined'?globalThis:this);
