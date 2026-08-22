/** TU ELEMENTO V2 BROADWAY — lectura general vertical y explicativa. */
(function (raiz) {
  'use strict';

  var ELEMENTOS=['madera','fuego','tierra','metal','agua'];
  var ETIQUETAS={madera:'MADERA',fuego:'FUEGO',tierra:'TIERRA',metal:'METAL',agua:'AGUA'};
  var ESTADO_AMIGABLE={
    prospero:{titulo:'Con mucho apoyo',texto:'La estación de tu nacimiento refuerza bastante tu elemento base.'},
    fuerte:{titulo:'Con apoyo',texto:'La estación de tu nacimiento le da apoyo a tu elemento base.'},
    debil:{titulo:'Con poco apoyo',texto:'La estación de tu nacimiento hace que tu elemento base necesite más apoyo para expresarse con facilidad.'},
    muerto:{titulo:'Con muy poco apoyo',texto:'La estación de tu nacimiento le resta bastante fuerza a tu elemento base.'},
    trampa:{titulo:'En tensión',texto:'La estación de tu nacimiento coloca a tu elemento base en una zona de tensión y contraste.'}
  };

  function $(s){return document.querySelector(s);}
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function cap(x){x=String(x||'');return x?x.charAt(0).toUpperCase()+x.slice(1):'';}
  function q(n){try{return new URLSearchParams(location.search).get(n)||'';}catch(e){return'';}}
  function vista(){return q('vista')||'general';}
  function href(id,v){return 'index.html?perfil='+encodeURIComponent(id)+(v&&v!=='general'?'&vista='+encodeURIComponent(v):'');}
  function idPerfilActual(){
    var id=q('perfil');
    if(id&&raiz.leerPerfil&&raiz.leerPerfil(id))return id;
    if(raiz.TE_ECOSISTEMA&&typeof raiz.TE_ECOSISTEMA.perfilActivo==='function'){
      id=raiz.TE_ECOSISTEMA.perfilActivo();if(id&&raiz.leerPerfil&&raiz.leerPerfil(id))return id;
    }
    var a=$('#abrirCalendario');
    if(a){var m=(a.getAttribute('href')||'').match(/[?&]perfil=([^&]+)/);if(m){id=decodeURIComponent(m[1]);if(raiz.leerPerfil&&raiz.leerPerfil(id))return id;}}
    return '';
  }
  function perfilActual(){var id=idPerfilActual();return id&&raiz.leerPerfil?raiz.leerPerfil(id):null;}

  function porcentajes(m){
    var total=Number(m&&m.total)||0,res={};
    ELEMENTOS.forEach(function(e){res[e]=total?Math.round((Number(m.conteo[e]||0)/total)*100):0;});
    return res;
  }

  function columnasElementos(m){
    var pct=porcentajes(m);
    return '<div class="cpgElementos" aria-label="Porcentaje de los cinco elementos">'+ELEMENTOS.map(function(e){
      return '<div class="cpgElemento cpgElemento--'+e+'"><span>'+ETIQUETAS[e]+'</span><strong>'+pct[e]+'%</strong><i aria-hidden="true"><b style="height:'+Math.max(5,pct[e])+'%"></b></i></div>';
    }).join('')+'</div>';
  }

  function modulo(clase,titulo,explicacion,cuerpo,cta,link){
    return '<section class="cpgModulo cpgModulo--'+clase+'"><h3>'+esc(titulo)+'</h3><p class="cpgExplica">'+esc(explicacion)+'</p>'+cuerpo+'<a class="cpgCTA" href="'+link+'">'+esc(cta)+'</a></section>';
  }

  function renderGeneral(){
    if(vista()!=='general')return;
    if(!raiz.analizarCartaProfunda||!raiz.cartaDesdePerfil||!raiz.leerPerfil)return;
    var perfil=perfilActual();if(!perfil)return;
    var carta;try{carta=raiz.cartaDesdePerfil(perfil);}catch(e){return;}if(!carta)return;
    var sinHora=!!(perfil.nacimiento&&perfil.nacimiento.sinHora);
    var a=raiz.analizarCartaProfunda(carta,{sinHora:sinHora,nacimiento:perfil.nacimiento||{}});
    if(!a||!a.mezcla)return;

    var id=perfil.id,m=a.mezcla,pct=porcentajes(m),pr=a.perfiles&&a.perfiles.principal,d=pr&&pr.dinamica,pc=pr&&pr.copy||{};
    var v=a.vacios&&a.vacios.presentes||[],n=a.nudo||{},r=a.recurso||{},est=a.estado||{};
    var estado=ESTADO_AMIGABLE[est.estado]||null;
    var dom=cap(m.dominante),menor=cap(m.menor);

    var mezclaCuerpo=columnasElementos(m)+
      '<div class="cpgDato"><strong>'+esc(dom)+' es lo que más se repite en tu carta: '+pct[m.dominante]+'%.</strong><span>'+esc(menor)+' es el elemento con menor presencia: '+pct[m.menor]+'%.'+(m.completa?'':' Este conteo queda parcial hasta agregar la hora de nacimiento.')+'</span></div>'+
      (estado?'<div class="cpgEstado"><small>CÓMO LLEGA TU ELEMENTO BASE</small><strong>'+esc(estado.titulo)+'</strong><p>'+esc(estado.texto)+'</p></div>':'');

    var perfilesCuerpo='<div class="cpgDato"><strong>Tu perfil principal es '+esc(d?d.nombre:'—')+'.</strong><span>'+esc(pc.resumen||'Tus perfiles muestran las formas de actuar que más se repiten dentro de tu carta.')+'</span></div>';

    var pilaresCuerpo='<div class="cpgDato"><strong>Tu carta se reparte en distintas zonas de tu vida.</strong><span>'+(sinHora?'Con tu fecha conocemos Tu origen, Tu trayectoria y Tu centro. La hora completa Tu futuro y Tu brújula.':'Tu origen, Tu trayectoria, Tu centro y Tu futuro forman la base. Tu brújula y Tu punto de partida añaden dos lecturas complementarias.')+'</span></div>';

    var vaciosCuerpo=v.length?'<div class="cpgDato"><strong>En tu carta, el vacío toca '+esc(v.map(function(x){return x.titulo.toLowerCase();}).join(' y '))+'.</strong><span>Ahí suele haber más aprendizaje por experiencia propia que respuestas automáticas.</span></div>':'<div class="cpgDato"><strong>Tus vacíos quedan fuera de los pilares natales.</strong><span>Esta capa existe técnicamente, pero pesa poco dentro de tu lectura base.</span></div>';

    var nudoCuerpo=n.presente?'<div class="cpgDato"><strong>Tu patrón de fondo aparece primero en '+esc(n.items[0].titulo.toLowerCase())+'.</strong><span>Ahí conviene mirar qué respuesta se repite cuando esa parte de tu vida se siente poco definida.</span></div>':'<div class="cpgDato"><strong>Tu nudo de fondo queda tranquilo en la carta base.</strong><span>Tus vacíos no están ocupando un pilar natal, así que esta capa no necesita convertirse en el centro de tu lectura.</span></div>';

    var recursoCuerpo='<div class="cpgDato"><strong>Tu principal recurso de equilibrio es '+esc(cap(r.elemento||'—'))+'.</strong><span>Este elemento funciona como contrapeso cuando tu forma habitual de responder ya no te alcanza.</span></div>';

    var html='<div class="cpgVista">'+
      '<header class="cpgCab"><p class="cpgKicker">TU ELEMENTO · LECTURA GENERAL</p><h2>Este eres tú</h2><p>Este es un mapa general sobre ti. Puedes conocer más haciendo clic en cada apartado.</p></header>'+
      modulo('mezcla','TU MEZCLA','En BaZi, tu carta se reparte entre cinco elementos: Madera, Fuego, Tierra, Metal y Agua. La proporción cambia de persona a persona y nos ayuda a ver qué formas de actuar te salen más fácil, cuáles usas menos y dónde puede faltar equilibrio.',mezclaCuerpo,'Conocer más de mis elementos',href(id,'mezcla'))+
      modulo('perfiles','TUS PERFILES','Los perfiles describen diez maneras en que tu elemento base se relaciona con lo que te rodea: cómo conectas con otras personas, expresas ideas, manejas recursos, respondes a la presión y aprendes.',perfilesCuerpo,'Conocer más de mis perfiles',href(id,'perfiles'))+
      modulo('pilares','TUS PILARES','Tu carta se organiza en pilares porque una misma persona puede funcionar distinto según el contexto. Cada uno mira una zona de tu historia, tus decisiones, tus vínculos y lo que quieres construir.',pilaresCuerpo,'Conocer más de mis pilares',href(id,'pilares'))+
      modulo('vacios','TUS VACÍOS','Los vacíos señalan zonas de la carta que suelen necesitar más experiencia propia para tomar forma. Sirven para ver dónde aprendes haciendo, probando y corrigiendo.',vaciosCuerpo,'Conocer más de mis vacíos',href(id,'vacios'))+
      modulo('nudo','TU NUDO DE FONDO','Esta lectura cruza tus vacíos con el lugar donde aparecen y con los perfiles que los acompañan. La usamos para localizar una respuesta que puede repetirse en situaciones parecidas.',nudoCuerpo,'Conocer más de mi patrón de fondo',href(id,'nudo'))+
      modulo('recurso','TU RECURSO DE EQUILIBRIO','Tu carta también muestra qué tipo de energía puede ayudarte a recuperar balance cuando una parte toma demasiado espacio o tu respuesta habitual se queda corta.',recursoCuerpo,'Conocer cómo usar mi recurso',href(id,'equilibrio'))+
      '<section class="cpgTiempo"><h3>Tu carta también cambia con el tiempo</h3><p>Calendario, Tu mes y Ciclos muestran cómo esta base se encuentra con distintos momentos.</p><div><a href="calendario.html?perfil='+encodeURIComponent(id)+'">Calendario</a><a href="mes.html?perfil='+encodeURIComponent(id)+'">Tu mes</a><a href="ciclos.html?perfil='+encodeURIComponent(id)+'">Ciclos</a></div></section>'+
      '</div>';

    var caja=$('#lectura');if(!caja)return;caja.innerHTML=html;
    if(raiz.activarApariciones)raiz.activarApariciones(caja);
  }

  var anterior=raiz.TE_CARTA_PROFUNDA_RENDER;
  if(typeof anterior==='function'){
    raiz.TE_CARTA_PROFUNDA_RENDER=function(){anterior();setTimeout(renderGeneral,0);};
  }
  setTimeout(renderGeneral,80);
  document.addEventListener('submit',function(e){if(e.target&&e.target.id==='forma')setTimeout(renderGeneral,90);},true);
  document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('#calcular'))setTimeout(renderGeneral,90);},true);
  if(raiz.addEventListener)raiz.addEventListener('popstate',function(){setTimeout(renderGeneral,20);});
})(typeof globalThis!=='undefined'?globalThis:this);
