/** TU ELEMENTO V2 BROADWAY — navegación compartida */
(function(){
  'use strict';
  if(typeof document==='undefined')return;

  var dentroV11=/\/v11\//.test(location.pathname);
  var base=dentroV11?'../':'';
  var ACTIVO='tuelemento.ui.perfilActivo';

  function param(n){try{return new URLSearchParams(location.search).get(n)||'';}catch(e){return'';}}
  function getActivo(){
    var q=param('perfil');
    if(q)return q;
    try{return localStorage.getItem(ACTIVO)||'';}catch(e){return'';}
  }
  function setActivo(id){
    if(!id)return;
    try{localStorage.setItem(ACTIVO,id);}catch(e){}
    refrescarLinks();
  }
  function conPerfil(url){var id=getActivo();return url+(id?'?perfil='+encodeURIComponent(id):'');}
  function pagina(){
    var p=location.pathname.toLowerCase();
    if(/ciclos\.html$/.test(p))return'ciclos';
    if(/mes\.html$/.test(p))return'mes';
    if(/calendario\.html$/.test(p))return'calendario';
    if(/carta\.html$|nueva\.html$|\/v11\/$|\/v11\/index\.html$/.test(p))return'carta';
    return'inicio';
  }

  function html(){
    var actual=pagina();
    var items=[
      ['inicio','Inicio',base+'index.html'],
      ['carta','Carta',conPerfil(base+'carta.html')],
      ['calendario','Calendario',conPerfil(base+'calendario.html')],
      ['mes','Tu mes',conPerfil(base+'mes.html')],
      ['ciclos','Ciclos',conPerfil(base+'ciclos.html')]
    ];
    var links=items.map(function(x){return'<a data-eco="'+x[0]+'" href="'+x[2]+'"'+(actual===x[0]?' aria-current="page"':'')+'>'+x[1]+'</a>';}).join('');
    return '<nav class="teEcoNav" aria-label="Tu Elemento"><div class="teEcoBar">'+
      '<a class="teEcoBrand" href="'+base+'index.html" aria-label="Inicio de Tu Elemento"><span class="teEcoMark">◇</span><span>Tu Elemento</span></a>'+
      '<span class="teEcoVersion">V2 Broadway</span>'+
      '<button class="teEcoMenuBtn" type="button" aria-expanded="false" aria-label="Abrir menú"><span></span></button>'+
      '<div class="teEcoLinks">'+links+'</div></div></nav><div class="teEcoBackdrop" aria-hidden="true"></div>';
  }

  function refrescarLinks(){
    var id=getActivo();
    [['carta','carta.html'],['calendario','calendario.html'],['mes','mes.html'],['ciclos','ciclos.html']].forEach(function(x){
      var a=document.querySelector('[data-eco="'+x[0]+'"]');
      if(a)a.href=base+x[1]+(id?'?perfil='+encodeURIComponent(id):'');
    });
  }

  function cerrar(){
    var b=document.querySelector('.teEcoMenuBtn'),l=document.querySelector('.teEcoLinks'),f=document.querySelector('.teEcoBackdrop');
    if(b)b.setAttribute('aria-expanded','false');if(l)l.classList.remove('abierto');if(f)f.classList.remove('abierto');
  }

  document.body.insertAdjacentHTML('afterbegin',html());
  var boton=document.querySelector('.teEcoMenuBtn'),links=document.querySelector('.teEcoLinks'),fondo=document.querySelector('.teEcoBackdrop');
  if(boton)boton.addEventListener('click',function(){var abrir=this.getAttribute('aria-expanded')!=='true';this.setAttribute('aria-expanded',abrir?'true':'false');links.classList.toggle('abierto',abrir);fondo.classList.toggle('abierto',abrir);});
  if(fondo)fondo.addEventListener('click',cerrar);
  if(links)links.addEventListener('click',cerrar);
  addEventListener('resize',function(){if(innerWidth>760)cerrar();});

  var qid=param('perfil');if(qid)setActivo(qid);
  ['#perfilCal','#perfilMes'].forEach(function(sel){var el=document.querySelector(sel);if(el)el.addEventListener('change',function(){setActivo(this.value);});});
  document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href*="perfil="]'):null;if(!a)return;try{var u=new URL(a.href,location.href),id=u.searchParams.get('perfil');if(id)setActivo(id);}catch(err){}},true);

  // Enlaces profundos hacia una vista concreta del calendario.
  if(pagina()==='calendario'&&param('vista')==='buscar')setTimeout(function(){var b=document.getElementById('vBuscar');if(b)b.click();},80);

  globalThis.TE_ECOSISTEMA={perfilActivo:getActivo,setPerfilActivo:setActivo,refrescarLinks:refrescarLinks};
})();
