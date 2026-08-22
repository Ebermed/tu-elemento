(function (raiz) {
  'use strict';

  var VISTAS=['general','mezcla','perfiles','pilares','vacios','nudo','equilibrio'];
  var ESTADO_UI={prospero:'la estación le da mucha fuerza',fuerte:'la estación le da apoyo',debil:'la estación le pide apoyo extra',muerto:'la estación le quita bastante fuerza',trampa:'la estación lo pone bajo tensión'};
  function $(s){return document.querySelector(s);}
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function cap(x){x=String(x||'');return x?x.charAt(0).toUpperCase()+x.slice(1):'';}
  function q(n){var m=(location.search||'').match(new RegExp('[?&]'+n+'=([^&]+)'));return m?decodeURIComponent(m[1]):'';}
  function vista(){var v=q('vista')||'general';return VISTAS.indexOf(v)!==-1?v:'general';}
  function idPerfilActual(){var id=q('perfil');if(id&&raiz.leerPerfil&&raiz.leerPerfil(id))return id;var a=$('#abrirCalendario');if(a){var m=(a.getAttribute('href')||'').match(/[?&]perfil=([^&]+)/);if(m)return decodeURIComponent(m[1]);}return '';}
  function href(id,v){return 'index.html?perfil='+encodeURIComponent(id)+(v&&v!=='general'?'&vista='+encodeURIComponent(v):'');}
  function aparecer(el){if(raiz.activarApariciones&&el)raiz.activarApariciones(el);}
  function nombreAnimal(r){if(!r)return'';return raiz.ANIMALES&&raiz.ANIMALES[r.pinyin]?raiz.ANIMALES[r.pinyin].nombre:cap(r.animal);}
  function nombreTallo(t){if(!t)return'';return raiz.IDENTIDADES&&raiz.IDENTIDADES[t.pinyin]?raiz.IDENTIDADES[t.pinyin].nombre:cap(t.elemento)+' '+(t.yang?'Yang':'Yin');}
  function lecturaAnimal(r){return raiz.ANIMALES&&r&&raiz.ANIMALES[r.pinyin]?raiz.ANIMALES[r.pinyin]:null;}
  function lecturaTallo(t){return raiz.IDENTIDADES&&t&&raiz.IDENTIDADES[t.pinyin]?raiz.IDENTIDADES[t.pinyin]:null;}
  function cab(t,i){return '<header class="cpCab"><p class="cpKicker">Tu Elemento · Carta</p><h2>'+esc(t)+'</h2><p>'+esc(i)+'</p></header>';}
  function volver(id){return '<a class="cpVolver" href="'+href(id,'general')+'"><span>‹</span> Volver a la lectura general</a>';}
  function remate(t){return '<p class="cpRemate">'+esc(t)+'</p>';}
  function accion(t){return '<div class="cpAccion">'+esc(t)+'</div>';}

  function resumenGeneral(perfil,carta,lec,a){
    var id=perfil.id,m=a.mezcla,pr=a.perfiles.principal,d=pr&&pr.dinamica,v=a.vacios.presentes,n=a.nudo,r=a.recurso;
    var pilar=lec.sinHora?'Con la fecha ya tenemos Tu origen, Tu trayectoria y Tu centro. La hora completa Tu futuro y Tu brújula.':'Tus cuatro pilares miran zonas distintas. Tu brújula y Tu punto de partida añaden dos referencias complementarias.';
    var vac=v.length?'El vacío aparece en '+v.map(function(x){return x.titulo.toLowerCase();}).join(' y ')+'. Esa zona suele pedir más experiencia propia.':'Tus ramas vacías quedan fuera de los pilares natales, así que esta capa pesa poco en la lectura base.';
    var nudo=n.presente?'El patrón de fondo se concentra primero en '+n.items[0].titulo.toLowerCase()+'. Ahí conviene mirar qué respuesta se repite.':'El nudo de fondo queda tranquilo en esta carta.';
    var perfilTxt=d&&pr.copy?('Tu perfil principal es '+d.nombre+'. '+pr.copy.resumen):'Tus perfiles muestran las formas de moverte que más se repiten.';
    var horaAviso=m.completa?'':' El conteo queda parcial hasta agregar la hora.';
    return '<div class="cpVista">'+cab('Tu carta, en corto','Esta es la lectura general. Aquí ves lo esencial y puedes abrir cada parte para entender de dónde sale.')+
      '<section class="cpHoja"><h3>Lo que más destaca</h3><div class="cpResumenGrid">'+
      '<a class="cpResumen cpResumen--mezcla" href="'+href(id,'mezcla')+'"><span class="tag">Conteo elemental</span><h3>Tu mezcla</h3><p>'+esc(cap(m.dominante)+' es el elemento más repetido: '+m.dominanteValor+' de '+m.total+' posiciones contadas.'+horaAviso)+'</p><b>Ver tu mezcla</b></a>'+
      '<a class="cpResumen cpResumen--perfiles" href="'+href(id,'perfiles')+'"><span class="tag">Modos de moverte</span><h3>Tus perfiles</h3><p>'+esc(perfilTxt)+'</p><b>Ver tus perfiles</b></a>'+
      '<a class="cpResumen cpResumen--pilares" href="'+href(id,'pilares')+'"><span class="tag">Zonas de tu carta</span><h3>Tus pilares</h3><p>'+esc(pilar)+'</p><b>Ver tus pilares</b></a>'+
      '<a class="cpResumen cpResumen--vacios" href="'+href(id,'vacios')+'"><span class="tag">Lo que se construye</span><h3>Tus vacíos</h3><p>'+esc(vac)+'</p><b>Ver tus vacíos</b></a>'+
      '<a class="cpResumen cpResumen--nudo" href="'+href(id,'nudo')+'"><span class="tag">Patrón profundo</span><h3>Tu nudo de fondo</h3><p>'+esc(nudo)+'</p><b>Ver el patrón</b></a>'+
      '<a class="cpResumen cpResumen--recurso" href="'+href(id,'equilibrio')+'"><span class="tag">Contrapeso</span><h3>Tu recurso de equilibrio</h3><p>El cálculo prioriza '+esc(cap(r.elemento))+'. La lectura profunda explica por qué y cómo llevarlo a una conducta concreta.</p><b>Ver cómo usarlo</b></a>'+
      '</div>'+remate('La carta sirve más cuando te ayuda a reconocer algo concreto que cuando intenta explicarlo todo.')+'</section>'+
      '<section class="cpHoja"><h3>También cambia con el tiempo</h3><p class="cpSuave">Calendario, Tu mes y Ciclos miran cómo esta base se encuentra con otros momentos.</p><div class="cpMasAlla"><a href="calendario.html?perfil='+encodeURIComponent(id)+'">Calendario</a><a href="mes.html?perfil='+encodeURIComponent(id)+'">Tu mes</a><a href="ciclos.html?perfil='+encodeURIComponent(id)+'">Ciclos</a></div></section></div>';
  }

  function mezclaHTML(perfil,a){
    var id=perfil.id,m=a.mezcla,total=m.total,dom=m.lecturaDominante,bajo=m.lecturaMenor;
    var barras=m.orden.map(function(x){var pct=total?Math.round(x.valor/total*100):0;return '<div class="cpElementoFila"><span class="cpElementoNombre">'+esc(x.elemento)+'</span><span class="cpElementoTrack"><i style="width:'+pct+'%"></i></span><span class="cpElementoN">'+x.valor+'</span></div>';}).join('');
    var metodo='Contamos el tallo visible y la rama de cada pilar, más los tallos que guarda cada rama. En tu carta eso da '+total+' posiciones.';
    if(!m.completa)metodo+=' La hora quedó abierta, así que Tu futuro y sus posiciones quedan fuera del conteo.';
    return '<div class="cpVista">'+volver(id)+cab('Tu mezcla','Aquí vemos cuánto se repite cada elemento dentro de la estructura de tu carta. Más presencia habla de una función disponible con frecuencia; menos presencia suele pedir más intención.')+
      '<section class="cpHoja"><h3>Así se reparte</h3><p class="cpSuave">'+esc(metodo)+'</p><div class="cpElementos">'+barras+'</div><div class="cpDosColumnas">'+
      '<div class="cpMini"><small>Más presente</small><strong>'+esc(m.dominante)+'</strong><p>'+esc(dom.fortaleza+' '+dom.cuidado)+'</p></div>'+
      '<div class="cpMini"><small>Menos presente</small><strong>'+esc(m.menor)+'</strong><p>'+esc(bajo.fortaleza+' Tener menos de este elemento suele pedir más intención para usar esa función.')+'</p></div></div>'+remate('Balance significa que cada parte pueda hacer su trabajo cuando la necesitas.')+'</section>'+
      '<section class="cpHoja"><h3>Qué puedes probar</h3><h4>Con '+esc(m.dominante)+'</h4>'+accion(dom.probar[2])+accion(dom.probar[1])+'<h4>Para darle más espacio a '+esc(m.menor)+'</h4>'+accion(bajo.probar[0])+accion(bajo.probar[1])+'</section></div>';
  }

  function perfilesHTML(perfil,a){
    var id=perfil.id,p=a.perfiles,pr=p.principal,d=pr.dinamica,c=pr.copy||{};
    var cards=p.apariciones.map(function(x){var cp=x.copy||{};return '<article class="cpPerfil"><div class="cpPerfilTop"><strong>'+esc(x.nombre)+'</strong><span class="conteo">'+x.total+' aparici'+(x.total===1?'ón':'ones')+'</span></div><small>'+esc(cp.area||x.area)+'</small><p>'+esc(cp.resumen||'Este modo aparece dentro de la carta.')+'</p></article>';}).join('');
    return '<div class="cpVista">'+volver(id)+cab('Tus perfiles','Los perfiles salen de comparar los tallos de tu carta con tu Día Maestro. Cada uno describe una forma distinta de relacionarte, expresarte, manejar recursos, responder a presión o aprender.')+
      '<section class="cpHoja"><div class="cpPerfilPrincipal"><span class="numero">Tu perfil principal</span><strong>'+esc(d?d.nombre:'—')+'</strong><em>'+esc(c.area||'')+'</em><p class="cpTexto">'+esc(c.resumen||'')+'</p></div><h4>Cómo suele verse</h4><p>'+esc(c.seNota||'')+'</p><h4>Cuando se carga de más</h4><p>'+esc(c.cuidado||'')+'</p><h4>Qué puedes probar</h4>'+accion(c.probar||'Observa cuándo aparece este modo y qué cambia cuando lo usas con intención.')+remate('Tu perfil principal es una tendencia frecuente, no una definición completa de ti.')+'</section>'+
      '<section class="cpHoja"><h3>Los perfiles que se repiten</h3><p class="cpSuave">Aquí sumamos tallos visibles y tallos ocultos. El número indica repetición dentro de la carta.</p><div class="cpPerfilLista">'+cards+'</div></section></div>';
  }

  function interaccionesExtra(x){if(!x||!x.interacciones||!x.interacciones.length)return'';return '<div class="cpInteracciones">'+x.interacciones.map(function(i){var t=i.tipo==='friccion'?'Roce':i.tipo==='enlace'?'Enlace':'Eco';return '<span class="cpInteraccion">'+esc(t+' · '+i.titulo)+'</span>';}).join('')+'</div>';}
  function pilarBaseHTML(p){return '<article class="cpPilar"><span class="tag">'+esc(p.etapa||'Pilar natal')+'</span><h3>'+esc(p.titulo)+'</h3><p class="meta">'+esc(p.animal+' · '+p.elementoCrudo)+'</p><p>'+esc(p.intro)+'</p><p>'+esc(p.movimiento)+'</p><p class="filo">'+esc(p.tension)+'</p></article>';}
  function pilarExtraHTML(nombre,x,tipo){
    if(!x)return '<article class="cpPilar cpPilarExtra"><span class="tag">Pilar complementario</span><h3>'+esc(nombre)+'</h3><p class="meta">Necesita la hora de nacimiento</p><p>Agrega la hora para calcular esta parte.</p></article>';
    var an=lecturaAnimal(x.rama),it=lecturaTallo(x.tallo),intro=tipo==='brujula'?'Esta referencia muestra una forma de volver a tu propio criterio cuando el entorno mete ruido.':'Esta referencia mira rasgos de arranque: lo que aparece antes de que la experiencia empiece a moldear tu manera de actuar.';
    return '<article class="cpPilar cpPilarExtra"><span class="tag">Pilar complementario</span><h3>'+esc(nombre)+'</h3><p class="meta">'+esc(nombreAnimal(x.rama)+' · '+nombreTallo(x.tallo))+'</p><p>'+esc(intro)+'</p>'+(an?'<p>'+esc(an.movimiento)+'</p>':'')+(it&&it.tension?'<p class="filo">'+esc(it.tension)+'</p>':'')+interaccionesExtra(x)+'</article>';
  }
  function pilaresHTML(perfil,lec,a){
    var id=perfil.id,cards=lec.pilares.map(pilarBaseHTML).join('')+pilarExtraHTML('Tu brújula',a.extras.brujula,'brujula')+pilarExtraHTML('Tu punto de partida',a.extras.puntoPartida,'partida');
    var tens=lec.tensiones&&lec.tensiones.length?'<section class="cpHoja"><h3>Cuando dos zonas se empujan</h3><p class="cpSuave">Estos cruces ayudan a explicar por qué una decisión puede sentirse sencilla en un contexto y más pesada en otro.</p>'+lec.tensiones.map(function(t){return '<div class="cpAccion"><b>'+esc(t.detalle)+'.</b>&nbsp; '+esc(t.texto)+'</div>';}).join('')+'</section>':'';
    return '<div class="cpVista">'+volver(id)+cab('Tus pilares','Cada pilar mira una zona distinta. Año, mes, día y hora forman la base; Tu brújula y Tu punto de partida añaden dos referencias complementarias.')+'<section class="cpHoja"><div class="cpPilares">'+cards+'</div>'+remate('Los pilares muestran contextos distintos de la misma persona.')+'</section>'+tens+'</div>';
  }

  function vaciosHTML(perfil,a){
    var id=perfil.id,v=a.vacios,ramas='<div class="cpRamasVacias">'+v.ramas.map(function(r){return '<span class="cpRamaVacia">'+esc(nombreAnimal(r))+'</span>';}).join('')+'</div>';
    var presentes=v.presentes.length?v.presentes.map(function(x){var d=x.dinamica,cp=d&&raiz.TE_PERFIL_COPY?raiz.TE_PERFIL_COPY[d.nombre]:null;return '<article class="cpNudo"><h3>'+esc(x.titulo)+'</h3><p class="meta">'+esc(nombreAnimal(x.rama)+' · '+nombreTallo(x.tallo)+(d?' · '+d.nombre:''))+'</p><p>Este vacío cae en '+esc(x.tema)+'. La lectura lo trata como una zona donde el criterio suele construirse a través de experiencia, prueba y ajuste.</p>'+(cp?'<p class="cpSuave">El perfil que lo acompaña es '+esc(d.nombre)+': '+esc(cp.resumen)+'</p>':'')+'</article>';}).join(''):'<p>Tus dos ramas vacías quedan fuera de los pilares natales. En la lectura base, esta capa tiene poco peso.</p>';
    return '<div class="cpVista">'+volver(id)+cab('Tus vacíos','En cada bloque del ciclo de 60 quedan dos ramas fuera. La lectura se vuelve personal cuando una de esas ramas aparece dentro de uno de tus pilares.')+'<section class="cpHoja"><h3>Tus dos ramas vacías</h3>'+ramas+'<p class="cpSuave">Aquí el vacío habla de una zona que suele tomar forma con experiencia propia.</p>'+presentes+remate('Lo que se construye a mano también puede terminar siendo una de tus zonas más conscientes.')+'</section></div>';
  }

  var NUDO_PRACTICA={anio:['nota cuándo pertenecer te hace cambiar demasiado tu forma de actuar','elige qué cosas sí quieres conservar de tu origen'],mes:['detecta cuándo un rol te hace funcionar en automático','elige un criterio propio para medir si ese camino todavía te sirve'],hora:['separa el deseo de tener todo resuelto del siguiente paso posible','prueba futuros pequeños antes de convertir uno en toda tu identidad']};
  function nudoHTML(perfil,a){
    var id=perfil.id,n=a.nudo;
    if(!n.presente)return '<div class="cpVista">'+volver(id)+cab('Tu nudo de fondo','Esta capa aparece cuando una rama vacía cae dentro de un pilar natal. En tu carta queda tranquila.')+'<section class="cpHoja"><h3>Aquí hay poco que empujar</h3><p>Tus vacíos quedan fuera de Tu origen, Tu trayectoria y Tu futuro. Puedes leerlos como contexto, pero no necesitan convertirse en el centro de la carta.</p>'+remate('Una buena lectura también sabe cuándo dejar una zona en paz.')+'</section></div>';
    var items=n.items.map(function(x){var cp=x.perfilCopy||{},ec=raiz.TE_ELEMENTO_COPY&&raiz.TE_ELEMENTO_COPY[x.tallo.elemento],pr=NUDO_PRACTICA[x.pilar]||[];return '<article class="cpNudo"><h3>'+esc(x.titulo)+'</h3><p class="meta">'+esc(nombreAnimal(x.rama)+' · '+nombreTallo(x.tallo)+(x.dinamica?' · '+x.dinamica.nombre:''))+'</p><h4>Qué se repite aquí</h4><p>El vacío cae en '+esc(x.tema)+'. Observa qué haces cuando esa zona se siente poco definida o cuando buscas afuera una respuesta que todavía estás formando.</p>'+(cp.cuidado?'<h4>Cómo se puede trabar</h4><p>'+esc(cp.cuidado)+'</p>':'')+'<h4>Qué puedes probar</h4>'+(pr[0]?accion(pr[0]):'')+(pr[1]?accion(pr[1]):'')+(ec?accion(ec.probar[0]):'')+'</article>';}).join('');
    return '<div class="cpVista">'+volver(id)+cab('Tu nudo de fondo','Aquí cruzamos vacío, pilar, elemento, perfil e interacciones para localizar un patrón que puedas reconocer en la vida diaria.')+'<section class="cpHoja"><p class="cpSuave">Esta lectura describe un patrón de aprendizaje. Sirve para observar hábitos y probar respuestas distintas.</p>'+items+remate('La pregunta útil es sencilla: ¿qué respuesta sigues repitiendo y qué podrías hacer distinto la próxima vez?')+'</section></div>';
  }

  function recursoHTML(perfil,a){
    var id=perfil.id,r=a.recurso,cp=r.copy||{},n=a.nudo,estado=a.estado||{},alt=r.alternativas&&r.alternativas.length?'<p class="cpAlternativas">Otras rutas posibles: '+r.alternativas.map(cap).join(', ')+'.</p>':'';
    var estadoTxt=ESTADO_UI[estado.estado]||'la estación cambia su fuerza';
    var cuenta='En el conteo, '+cap(cartaElemento(a))+' aparece '+(estado.conteoPropio||0)+' veces de '+a.mezcla.total+'.';
    var perfilTxt=r.dinamica?'En tu carta, este recurso se expresa sobre todo como <b>'+esc(r.dinamica.nombre)+'</b>. '+esc((raiz.TE_PERFIL_COPY&&raiz.TE_PERFIL_COPY[r.dinamica.nombre]?raiz.TE_PERFIL_COPY[r.dinamica.nombre].resumen:'')):'';
    var puente;
    if(n.presente){var x=n.items[0],pr=NUDO_PRACTICA[x.pilar]||[];puente='<div class="cpPuente"><h3>Cómo usarlo cuando aparece tu nudo</h3><p>Tu nudo principal aparece primero en <b>'+esc(x.titulo)+'</b>. '+cap(r.elemento)+' funciona aquí como una respuesta alternativa.</p><div class="cpSecuencia"><div class="cpPaso">1. Detecta el momento: '+esc(pr[0]||'nota cuándo vuelve el patrón')+'.</div><div class="cpPaso">2. Cambia una cosa: '+esc(cp.probar[0])+'.</div><div class="cpPaso">3. Repítelo en pequeño: '+esc(cp.probar[1])+'. Después revisa si tu margen de decisión aumentó.</div></div></div>';}else puente='<div class="cpPuente"><h3>Cómo usarlo</h3><p>En esta carta funciona como contrapeso general.</p>'+accion(cp.probar[0])+accion(cp.probar[1])+'</div>';
    return '<div class="cpVista">'+volver(id)+cab('Tu recurso de equilibrio','Este cálculo busca qué elemento puede servir como contrapeso. Mira tu Día Maestro, la estación y el conteo completo de la carta.')+
      '<section class="cpHoja"><div class="cpRecursoHero"><small>Tu contrapeso principal</small><strong>'+esc(r.elemento)+'</strong><p>'+esc(r.razon)+'</p>'+alt+'</div><p class="cpSuave">'+esc(cap(estado.elementoDiaMaestro||'Tu elemento')+': '+estadoTxt+'. '+cuenta+(r.conteoCompleto?'':' La hora puede afinar este resultado.'))+'</p><h4>Cómo se traduce en tu vida diaria</h4><p>'+perfilTxt+'</p>'+accion(cp.probar[0])+accion(cp.probar[2])+remate('El contrapeso sirve para ampliar tus opciones cuando tu respuesta habitual se queda corta.')+'</section>'+puente+'</div>';
  }
  function cartaElemento(a){return a.estado&&a.estado.elementoDiaMaestro?a.estado.elementoDiaMaestro:'';}

  function render(){
    if(!raiz.analizarCartaProfunda||!raiz.leerPerfil||!raiz.cartaDesdePerfil)return;
    var id=idPerfilActual();if(!id)return;var perfil=raiz.leerPerfil(id);if(!perfil)return;var carta;try{carta=raiz.cartaDesdePerfil(perfil);}catch(e){return;}if(!carta)return;
    var sinHora=!!(perfil.nacimiento&&perfil.nacimiento.sinHora),lec=raiz.lecturaCompleta?raiz.lecturaCompleta(carta,sinHora):null;if(!lec)return;
    var a=raiz.analizarCartaProfunda(carta,{sinHora:sinHora,nacimiento:perfil.nacimiento||{}}),v=vista(),html='';
    if(v==='mezcla')html=mezclaHTML(perfil,a);else if(v==='perfiles')html=perfilesHTML(perfil,a);else if(v==='pilares')html=pilaresHTML(perfil,lec,a);else if(v==='vacios')html=vaciosHTML(perfil,a);else if(v==='nudo')html=nudoHTML(perfil,a);else if(v==='equilibrio')html=recursoHTML(perfil,a);else html=resumenGeneral(perfil,carta,lec,a);
    var caja=$('#lectura');if(!caja)return;caja.innerHTML=html;caja.classList.add('escalona');aparecer(caja);
    var seguir=$('#seguirCarta');if(seguir){if(v==='general'){seguir.hidden=false;var st=seguir.querySelector('.seguirTexto'),sm=seguir.querySelector('small');if(st)st.textContent='Tu lectura sigue';if(sm)sm.textContent='mezcla · perfiles · pilares · vacíos · equilibrio';}else seguir.hidden=true;}
    var compartir=$('#compartirMarco');if(compartir)compartir.hidden=v!=='general';var acciones=$('.resultadoAcciones');if(acciones)acciones.hidden=v!=='general';
    document.title=(v==='general'?'Lectura general':({mezcla:'Tu mezcla',perfiles:'Tus perfiles',pilares:'Tus pilares',vacios:'Tus vacíos',nudo:'Tu nudo de fondo',equilibrio:'Tu recurso de equilibrio'}[v]))+' — Tu Elemento';
  }
  function renderDespues(){setTimeout(render,35);}
  renderDespues();document.addEventListener('submit',function(e){if(e.target&&e.target.id==='forma')renderDespues();},true);document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#calcular'):null;if(b)renderDespues();},true);raiz.addEventListener&&raiz.addEventListener('popstate',render);raiz.TE_CARTA_PROFUNDA_RENDER=render;
})(typeof globalThis!=='undefined'?globalThis:this);
