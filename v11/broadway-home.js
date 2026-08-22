/** TU ELEMENTO V2 BROADWAY — inicio */
(function(){
  'use strict';
  if(typeof document==='undefined')return;

  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function polaridad(c){return c&&c.diaMaestro&&c.diaMaestro.yang?'Yang':'Yin';}
  function activo(){return globalThis.TE_ECOSISTEMA&&TE_ECOSISTEMA.perfilActivo?TE_ECOSISTEMA.perfilActivo():'';}
  function setActivo(id){if(globalThis.TE_ECOSISTEMA&&TE_ECOSISTEMA.setPerfilActivo)TE_ECOSISTEMA.setPerfilActivo(id);}
  function link(ruta,id,extra){var q=[];if(id)q.push('perfil='+encodeURIComponent(id));if(extra)q.push(extra);return ruta+(q.length?'?'+q.join('&'):'');}

  var paths={
    'Roble':'M11 19c0-5 3-9 5-12 2 3 5 7 5 12M16 11c-2 0-4-1-5-3',
    'Hiedra':'M6 16c4-6 7-8 12-10-1 5-4 9-10 13-1-2-2-2-2-3z',
    'Sol':'M12 5v2M12 17v2M5 12h2M17 12h2M7.5 7.5l1.5 1.5M15 15l1.5 1.5M16.5 7.5 15 9M9 15l-1.5 1.5M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
    'Brasa':'M14 20c0-4 5-5 5-9 0-3-2-5-4-7 0 3-2 4-4 6-2 2-3 4-3 7 0 4 3 7 6 7s5-2 5-4z',
    'Montaña':'M5 17 12 7l7 10H5z',
    'Huerto':'M7 17h10M9 17v-4m6 4v-6M8 10c1-2 3-3 4-5 1 2 3 3 4 5',
    'Acero':'M12 4l7 7-7 9-7-9 7-7z','Joya':'M12 5l6 4-2 8h-8L6 9l6-4z',
    'Marea':'M4 14c2-2 4-2 6 0s4 2 6 0 4-2 4-2M4 10c2-2 4-2 6 0s4 2 6 0 4-2 4-2',
    'Rocío':'M12 4c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z'
  };
  function icono(nombre){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(paths[nombre]||paths.Montaña)+'"/></svg>';}

  var ps=[];
  try{ps=typeof listarPerfiles==='function'?listarPerfiles():[];}catch(e){ps=[];}
  var idActivo=activo();
  if(!idActivo&&ps.length){idActivo=(typeof perfilPrincipal==='function'&&perfilPrincipal()?perfilPrincipal().id:ps[0].id);setActivo(idActivo);}

  var titulo=document.getElementById('bwTitulo'),intro=document.getElementById('bwIntro'),cartas=document.getElementById('bwCartas'),secCartas=document.getElementById('bwSeccionCartas');
  if(ps.length){
    titulo.textContent='Bienvenido de nuevo';
    intro.textContent='Elige una carta o entra directo a la herramienta que necesitas.';
    secCartas.hidden=false;
    var h='';
    ps.forEach(function(p){
      try{
        var c=cartaDesdePerfil(p),t=traducir(c),nombre=p.tipo==='yo'?'Tu carta':(p.nombre||'Carta guardada'),id=p.id;
        h+='<article class="bwCarta" data-perfil="'+esc(id)+'"><div class="bwCartaIcono">'+icono(t.tarjeta.nombre)+'</div><p class="bwCartaNombre">'+esc(nombre)+'</p><h3>'+esc(t.tarjeta.nombre)+'</h3><p class="bwCartaMeta">'+esc(t.tarjeta.elemento)+' · '+polaridad(c)+(p.nacimiento&&p.nacimiento.ciudad?' · '+esc(p.nacimiento.ciudad):'')+'</p><div class="bwCartaAcciones"><a href="'+link('carta.html',id)+'">Carta</a><a href="'+link('calendario.html',id)+'">Calendario</a><a href="'+link('mes.html',id)+'">Tu mes</a></div></article>';
      }catch(err){}
    });
    cartas.innerHTML=h;
  }else{
    titulo.textContent='¿Qué quieres mirar hoy?';
    intro.textContent='Carta, calendario, lectura mensual, selección de fechas y ciclos en un mismo lugar.';
    secCartas.hidden=true;
  }

  function hrefHerramientas(){
    var id=activo();
    var m={
      carta:link('carta.html',id),calendario:link('calendario.html',id),buscar:link('calendario.html',id,'vista=buscar'),mes:link('mes.html',id),ciclos:link('ciclos.html',id)
    };
    Object.keys(m).forEach(function(k){var a=document.querySelector('[data-tool="'+k+'"]');if(a)a.href=m[k];});
  }
  hrefHerramientas();

  function pintarPerfilActivo(){
    var pill=document.getElementById('bwPerfilActivo'),txt=document.getElementById('bwPerfilTexto');
    if(!pill||!txt||!idActivo)return;
    try{
      var p=typeof leerPerfil==='function'?leerPerfil(idActivo):null;
      var c=p?cartaDesdePerfil(p):null;
      var t=c?traducir(c):null;
      if(!p||!t)return;
      var nombre=p.tipo==='yo'?'Tu carta':(p.nombre||'Carta guardada');
      txt.textContent=nombre+' · '+t.tarjeta.nombre;
      pill.href=link('carta.html',idActivo);
      pill.hidden=false;
    }catch(e){}
  }
  pintarPerfilActivo();

  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('.bwCarta a'):null;if(!a)return;
    var card=a.closest('.bwCarta');if(card)setActivo(card.getAttribute('data-perfil'));
  },true);

  try{
    var pAct=idActivo&&typeof leerPerfil==='function'?leerPerfil(idActivo):null;
    var cAct=pAct?cartaDesdePerfil(pAct):null;
    var idn=cAct&&globalThis.IDENTIDADES?IDENTIDADES[cAct.diaMaestro.pinyin]:null;
    if(idn&&typeof aplicarPaletaUI==='function')aplicarPaletaUI(idn.paleta);
    if(typeof pintarFondo==='function')pintarFondo(idn?idn.paleta:PALETA_NEUTRA,112,1.04);
  }catch(e){if(typeof pintarFondo==='function')pintarFondo(PALETA_NEUTRA,112,1.04);}
})();
