/** TU ELEMENTO V2 BROADWAY — microcopy del hero de la lectura. */
(function(){
  'use strict';
  if(typeof document==='undefined')return;

  var COPY={
    'madera|Yang':'firme, vertical y orientado a crecer con dirección.',
    'madera|Yin':'flexible, conectado y capaz de encontrar por dónde seguir.',
    'fuego|Yang':'visible, expansivo y capaz de cambiar el ánimo de un lugar.',
    'fuego|Yin':'concentrado, íntimo y capaz de sostener calor durante mucho tiempo.',
    'tierra|Yang':'estable, sólido y fácil de convertir en punto de apoyo.',
    'tierra|Yin':'fértil, cuidadoso y atento a lo que necesita cada cosa para crecer.',
    'metal|Yang':'directo, estructurado y hecho para cortar lo que estorba.',
    'metal|Yin':'preciso, sensible al detalle y pendiente de la forma final.',
    'agua|Yang':'amplio, móvil y capaz de conectar muchas cosas a la vez.',
    'agua|Yin':'sutil, observador y muy atento a lo que cambia en el ambiente.'
  };

  function cap(x){x=String(x||'');return x?x.charAt(0).toUpperCase()+x.slice(1):'';}

  function pulir(){
    var hero=document.getElementById('resultadoHero');
    if(!hero)return;
    var elemento=hero.querySelector('.resultadoElemento');
    var descripcion=hero.querySelector('.resultadoDescripcion');
    if(!elemento||!descripcion||descripcion.getAttribute('data-copy-broadway')==='1')return;
    var partes=elemento.textContent.split('·').map(function(x){return x.trim();});
    if(partes.length<2)return;
    var el=partes[0].toLowerCase(),pol=partes[1],texto=COPY[el+'|'+pol];
    if(!texto)return;
    descripcion.innerHTML='<strong>Eres '+cap(el)+' '+pol+'</strong><span aria-hidden="true"> &nbsp;|&nbsp; </span>Tu elemento es '+texto;
    descripcion.setAttribute('data-copy-broadway','1');
  }

  pulir();
  var hero=document.getElementById('resultadoHero');
  if(hero&&typeof MutationObserver!=='undefined'){
    new MutationObserver(function(){pulir();}).observe(hero,{childList:true,subtree:true});
  }
})();
