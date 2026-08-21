(function(){
'use strict';
if(typeof document==='undefined')return;
var lectura=document.getElementById('lectura');
if(!lectura)return;
var estado={cols:[],contenidos:[],panel:null};
var ocupado=false;
var css=document.createElement('style');
css.textContent='#lectura .hoja,#lectura .inter,#lectura .vidrio,#lectura .col,#lectura .panel{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important;transform:none!important;will-change:auto!important}#lectura .revela-prep,#lectura .revela-viva{opacity:1!important;filter:none!important;transform:none!important;transition:none!important}#lectura .panel.abierto,#lectura .pilarUnico{animation:none!important;transition:none!important}#lectura .col{transition:background .12s ease,border-color .12s ease!important}';
document.head.appendChild(css);
function arr(x){return Array.prototype.slice.call(x||[]);}
function activar(i){if(!estado.panel||!estado.contenidos[i])return;estado.cols.forEach(function(b,n){var activo=n===i;b.setAttribute('aria-expanded',activo?'true':'false');b.setAttribute('data-v11-pilar-index',String(n));var mas=b.querySelector('.mas');if(mas){mas.hidden=false;mas.textContent=activo?'viendo':'leer';}});estado.panel.innerHTML=estado.contenidos[i];}
function preparar(){if(ocupado)return false;var cols=arr(lectura.querySelectorAll('.columnas .col'));if(cols.length<2)return false;if(lectura.querySelector('.pilarUnico')&&cols[0].hasAttribute('data-v11-pilar-index'))return true;var paneles=arr(lectura.querySelectorAll('.panel')).filter(function(p){return!p.classList.contains('pilarUnico');});if(paneles.length<cols.length)return false;ocupado=true;if(obs)obs.disconnect();var contenidos=paneles.slice(0,cols.length).map(function(p){return p.innerHTML;});paneles.slice(0,cols.length).forEach(function(p){p.remove();});var panel=document.createElement('div');panel.className='panel abierto pilarUnico';panel.setAttribute('role','region');cols[0].parentElement.insertAdjacentElement('afterend',panel);estado={cols:cols,contenidos:contenidos,panel:panel};activar(0);ocupado=false;if(obs)obs.observe(lectura,{childList:true});return true;}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#lectura .col[data-v11-pilar-index]'):null;if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();activar(parseInt(b.getAttribute('data-v11-pilar-index'),10)||0);},true);
var obs=typeof MutationObserver!=='undefined'?new MutationObserver(function(){preparar();}):null;if(obs)obs.observe(lectura,{childList:true});preparar();
})();
