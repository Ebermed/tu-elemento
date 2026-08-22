(function (raiz) {
  'use strict';

  var VISTAS=['general','mezcla','perfiles','pilares','vacios','nudo','equilibrio'];

  function $(s){return document.querySelector(s);}
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function cap(x){x=String(x||'');return x?x.charAt(0).toUpperCase()+x.slice(1):'';}
  function q(name){var m=(location.search||'').match(new RegExp('[?&]'+name+'=([^&]+)'));return m?decodeURIComponent(m[1]):'';}
  function vista(){var v=q('vista')||'general';return VISTAS.indexOf(v)!==-1?v:'general';}

  function idPerfilActual(){
    var id=q('perfil');if(id&&typeof raiz.leerPerfil==='function'&&raiz.leerPerfil(id))return id;
    var a=$('#abrirCalendario');if(a){var h=a.getAttribute('href')||'',m=h.match(/[?&]perfil=([^&]+)/);if(m)return decodeURIComponent(m[1]);}
    return '';
  }
  function href(id,v){return 'index.html?perfil='+encodeURIComponent(id)+(v&&v!=='general'?'&vista='+encodeURIComponent(v):'');}
  function aparecer(el){if(typeof raiz.activarApariciones==='function'&&el)raiz.activarApariciones(el);}

  function nombreAnimal(rama){
    if(!rama)return '';
    if(raiz.ANIMALES&&raiz.ANIMALES[rama.pinyin])return raiz.ANIMALES[rama.pinyin].nombre;
    return cap(rama.animal);
  }
  function nombreTallo(tallo){
    if(!tallo)return '';
    if(raiz.IDENTIDADES&&raiz.IDENTIDADES[tallo.pinyin])return raiz.IDENTIDADES[tallo.pinyin].nombre;
    return cap(tallo.elemento)+' '+(tallo.yang?'Yang':'Yin');
  }
  function lecturaAnimal(rama){return raiz.ANIMALES&&rama&&raiz.ANIMALES[rama.pinyin]?raiz.ANIMALES[rama.pinyin]:null;}
  function lecturaTallo(tallo){return raiz.IDENTIDADES&&tallo&&raiz.IDENTIDADES[tallo.pinyin]?raiz.IDENTIDADES[tallo.pinyin]:null;}

  function cab(titulo,intro){
    return '<header class="cpCab"><p class="cpKicker">Tu Elemento · Carta</p><h2>'+esc(titulo)+'</h2><p>'+esc(intro)+'</p></header>';
  }
  function volver(id){return '<a class="cpVolver" href="'+href(id,'general')+'"><span>‹</span> Volver a la lectura general</a>';}
  function remate(texto){return '<p class="cpRemate">'+esc(texto)+'</p>';}
  function accion(texto){return '<div class="cpAccion">'+esc(texto)+'</div>';}

  function resumenGeneral(perfil,carta,lec,a){
    var id=perfil.id,mez=a.mezcla,pp=a.perfiles.principal,principal=pp&&pp.dinamica,dom=mez.dominante;
    var vac=a.vacios.presentes,nudo=a.nudo,recurso=a.recurso;
    var pilarIntro=lec.sinHora?'La carta tiene tres pilares calculados. Con la hora de nacimiento también aparecen Tu futuro y Tu brújula.':'Tus cuatro pilares miran zonas distintas de tu vida. A ellos se suman Tu brújula y Tu punto de partida.';
    var vacIntro=vac.length?('El vacío toca '+vac.map(function(v){return v.titulo.toLowerCase();}).join(' y ')+'. Ahí la carta describe algo que suele construirse más por experiencia que por guion previo.'):'Tus dos ramas vacías no ocupan un pilar natal. En la lectura base, esta capa queda bastante tranquila.';
    var nudoIntro=nudo.presente?('El patrón de fondo se concentra primero en '+nudo.items[0].titulo.toLowerCase()+'. La idea es observar qué se repite ahí y probar una respuesta distinta.'):'La carta no coloca un vacío dentro de tus pilares natales, así que el nudo de fondo no domina esta lectura.';
    var perfilIntro=principal&&pp.copy?(pp.copy.resumen+' '+pp.copy.cuidado):'El perfil principal organiza una de las formas en que la carta busca movimiento.';
    var recursoIntro='El método de balance prioriza '+cap(recurso.elemento)+'. Aquí lo convertimos en una conducta concreta que puedes practicar cuando tu manera habitual de responder se queda corta.';

    return '<div class="cpVista">'+cab('Tu carta, en corto','Esta es la lectura general. Resume lo que más destaca y te deja entrar a cada capa cuando quieras verla con calma.')+
      '<section class="cpHoja"><h3>Lo que más destaca</h3><p class="cpSuave">Tu elemento base sigue siendo el punto de entrada, pero una carta completa mira varias cosas a la vez. Estas son las puertas principales de la tuya.</p><div class="cpResumenGrid">'+
      '<a class="cpResumen cpResumen--mezcla" href="'+href(id,'mezcla')+'"><span class="tag">Conteo elemental</span><h3>Tu mezcla</h3><p>'+esc(cap(dom)+' ocupa más espacio: '+mez.dominanteValor+' de '+mez.total+' caracteres conocidos. '+mez.lecturaDominante.fortaleza)+'</p><b>Ver tu mezcla</b></a>'+
      '<a class="cpResumen cpResumen--perfiles" href="'+href(id,'perfiles')+'"><span class="tag">Modos de moverte</span><h3>Tus perfiles</h3><p>'+esc(principal?('Tu perfil principal es '+principal.nombre+'. '+perfilIntro):perfilIntro)+'</p><b>Ver tus perfiles</b></a>'+
      '<a class="cpResumen cpResumen--pilares" href="'+href(id,'pilares')+'"><span class="tag">Zonas de tu carta</span><h3>Tus pilares</h3><p>'+esc(pilarIntro)+'</p><b>Ver tus pilares</b></a>'+
      '<a class="cpResumen cpResumen--vacios" href="'+href(id,'vacios')+'"><span class="tag">Lo que se construye</span><h3>Tus vacíos</h3><p>'+esc(vacIntro)+'</p><b>Ver tus vacíos</b></a>'+
      '<a class="cpResumen cpResumen--nudo" href="'+href(id,'nudo')+'"><span class="tag">Patrón profundo</span><h3>Tu nudo de fondo</h3><p>'+esc(nudoIntro)+'</p><b>Ver el patrón</b></a>'+
      '<a class="cpResumen cpResumen--recurso" href="'+href(id,'equilibrio')+'"><span class="tag">Contrapeso</span><h3>Tu recurso de equilibrio</h3><p>'+esc(recursoIntro)+'</p><b>Ver cómo usarlo</b></a>'+
      '</div>'+remate('La carta sirve más cuando una descripción te ayuda a reconocer algo concreto, no cuando intenta explicarte la vida entera.')+'</section>'+
      '<section class="cpHoja"><h3>También cambia con el tiempo</h3><p class="cpSuave">La carta natal es la base. El calendario, la lectura mensual y los ciclos miran qué pasa cuando esa base se encuentra con otro momento.</p><div class="cpMasAlla">'+
      '<a href="calendario.html?perfil='+encodeURIComponent(id)+'">Calendario</a><a href="mes.html?perfil='+encodeURIComponent(id)+'">Tu mes</a><a href="ciclos.html?perfil='+encodeURIComponent(id)+'">Ciclos</a></div></section></div>';
  }

  function mezclaHTML(perfil,a){
    var id=perfil.id,m=a.mezcla,total=m.total;
    var barras=m.orden.map(function(x){var pct=total?Math.round(x.valor/total*100):0;return '<div class="cpElementoFila"><span class="cpElementoNombre">'+esc(x.elemento)+'</span><span class="cpElementoTrack"><i style="width:'+pct+'%"></i></span><span class="cpElementoN">'+x.valor+'</span></div>';}).join('');
    var dom=m.lecturaDominante,bajo=m.lecturaMenor;
    var piezas=total===8?'Tus cuatro pilares aportan un tallo y una rama cada uno: ocho piezas en total.':'Como la hora quedó abierta, aquí contamos únicamente los tres pilares conocidos: seis piezas. La hora no se rellena a la fuerza.';
    return '<div class="cpVista">'+volver(id)+cab('Tu mezcla','Aquí contamos los cinco elementos dentro de las piezas que realmente conocemos de tu carta. El conteo muestra qué funciones tienen más espacio y cuáles suelen necesitar más intención; no busca repartir todo por partes iguales.')+
      '<section class="cpHoja"><h3>Así se reparte tu carta</h3><p class="cpSuave">'+esc(piezas)+'</p><div class="cpElementos">'+barras+'</div><div class="cpDosColumnas">'+
      '<div class="cpMini"><small>Más presente</small><strong>'+esc(m.dominante)+'</strong><p>'+esc(dom.fortaleza+' '+dom.cuidado)+'</p></div>'+
      '<div class="cpMini"><small>Menos presente</small><strong>'+esc(m.menor)+'</strong><p>'+esc(bajo.fortaleza+' Tener menos de este elemento no significa que te falte una capacidad; suele pedir más intención para usarla.')+'</p></div></div>'+remate('Balance no significa cinco partes iguales. Significa que cada parte pueda hacer su trabajo cuando la necesitas.')+'</section>'+
      '<section class="cpHoja"><h3>Qué puedes probar</h3><h4>Con '+esc(m.dominante)+'</h4>'+accion(dom.probar[2])+accion(dom.probar[1])+'<h4>Para darle más espacio a '+esc(m.menor)+'</h4>'+accion(bajo.probar[0])+accion(bajo.probar[1])+'</section></div>';
  }

  function perfilesHTML(perfil,a){
    var id=perfil.id,p=a.perfiles,pr=p.principal,d=pr.dinamica,c=pr.copy||{},lista=p.apariciones;
    var cards=lista.map(function(x){var cp=x.copy||{};return '<article class="cpPerfil"><div class="cpPerfilTop"><strong>'+esc(x.nombre)+'</strong><span class="conteo">'+x.total+' aparici'+(x.total===1?'ón':'ones')+'</span></div><small>'+esc(cp.area||x.area)+'</small><p>'+esc(cp.resumen||'Este modo aparece dentro de la estructura de la carta.')+'</p></article>';}).join('');
    return '<div class="cpVista">'+volver(id)+cab('Tus perfiles','Los perfiles salen de comparar los tallos de la carta con tu Día Maestro. Describen maneras distintas de vincularte, expresarte, manejar recursos, responder a presión y aprender.')+
      '<section class="cpHoja"><div class="cpPerfilPrincipal"><span class="numero">Tu perfil principal</span><strong>'+esc(d?d.nombre:'—')+'</strong><em>'+esc(c.area||'')+'</em><p class="cpTexto">'+esc(c.resumen||'')+'</p></div><h4>Cómo suele verse</h4><p>'+esc(c.seNota||'')+'</p><h4>Cuando se carga de más</h4><p>'+esc(c.cuidado||'')+'</p><h4>Qué puedes probar</h4>'+accion(c.probar||'Observa cuándo aparece este modo y qué cambia cuando lo usas con intención.')+remate('No eres un perfil. El principal solo señala una puerta que la carta usa con mucha frecuencia.')+'</section>'+
      '<section class="cpHoja"><h3>Los perfiles que aparecen en tu carta</h3><p class="cpSuave">Este conteo suma tallos visibles y tallos ocultos. Sirve para ver qué modos se repiten; por eso mostramos apariciones en vez de convertirlas en un porcentaje psicológico.</p><div class="cpPerfilLista">'+cards+'</div></section></div>';
  }

  function interaccionesExtra(extra){
    if(!extra||!extra.interacciones||!extra.interacciones.length)return '';
    return '<div class="cpInteracciones">'+extra.interacciones.map(function(x){var t=x.tipo==='friccion'?'Roce':x.tipo==='enlace'?'Enlace':'Eco';return '<span class="cpInteraccion">'+esc(t+' · '+x.titulo)+'</span>';}).join('')+'</div>';
  }
  function pilarBaseHTML(p){
    return '<article class="cpPilar"><span class="tag">'+esc(p.etapa||'Pilar natal')+'</span><h3>'+esc(p.titulo)+'</h3><p class="meta">'+esc(p.animal+' · '+p.elementoCrudo)+'</p><p>'+esc(p.intro)+'</p><p>'+esc(p.movimiento)+'</p><p class="filo">'+esc(p.tension)+'</p></article>';
  }
  function pilarExtraHTML(nombre,extra,tipo){
    if(!extra)return '<article class="cpPilar cpPilarExtra"><span class="tag">Pilar complementario</span><h3>'+esc(nombre)+'</h3><p class="meta">Necesita tu hora de nacimiento</p><p>Esta parte usa la rama de la hora. Agrégala a la carta para calcularla con el mismo criterio que el resto.</p></article>';
    var an=lecturaAnimal(extra.rama),id=lecturaTallo(extra.tallo);
    var intro=tipo==='brujula'?'Esta referencia sirve para mirar qué pasa cuando necesitas volver a tu propio criterio, sobre todo cuando entra en relación con otra zona de la carta.':'Este pilar mira el material de arranque: rasgos y tendencias que el método coloca antes de la adaptación que viene con la experiencia.';
    var mov=(an&&an.movimiento)?an.movimiento:'';var filo=(id&&id.tension)?id.tension:(an&&an.tension?an.tension:'');
    return '<article class="cpPilar cpPilarExtra"><span class="tag">Pilar complementario</span><h3>'+esc(nombre)+'</h3><p class="meta">'+esc(nombreAnimal(extra.rama)+' · '+nombreTallo(extra.tallo))+'</p><p>'+esc(intro)+'</p>'+(mov?'<p>'+esc(mov)+'</p>':'')+(filo?'<p class="filo">'+esc(filo)+'</p>':'')+interaccionesExtra(extra)+'</article>';
  }
  function pilaresHTML(perfil,lec,a){
    var id=perfil.id,cards=lec.pilares.map(pilarBaseHTML).join('');
    cards+=pilarExtraHTML('Tu brújula',a.extras.brujula,'brujula');
    cards+=pilarExtraHTML('Tu punto de partida',a.extras.puntoPartida,'partida');
    return '<div class="cpVista">'+volver(id)+cab('Tus pilares','Cada pilar mira una zona distinta. Los pilares natales salen de año, mes, día y, cuando la conocemos, hora. Tu brújula y Tu punto de partida son dos referencias complementarias construidas con esos mismos datos.')+
      '<section class="cpHoja"><div class="cpPilares">'+cards+'</div>'+remate('Sigues siendo la misma persona. Los pilares solo muestran en qué “habitación” aparece cada parte de ti.')+'</section>'+
      (lec.tensiones&&lec.tensiones.length?'<section class="cpHoja"><h3>Cuando dos zonas piden cosas distintas</h3><p class="cpSuave">Los roces y enlaces entre pilares ayudan a entender por qué una misma decisión puede sentirse fácil en un contexto y más compleja en otro.</p>'+lec.tensiones.map(function(t){return '<div class="cpAccion"><b>'+esc(t.detalle)+'.</b>&nbsp; '+esc(t.texto)+'</div>';}).join('')+'</section>':'')+'</div>';
  }

  function vaciosHTML(perfil,a){
    var id=perfil.id,v=a.vacios;
    var ramas='<div class="cpRamasVacias">'+v.ramas.map(function(r){return '<span class="cpRamaVacia">'+esc(nombreAnimal(r))+'</span>';}).join('')+'</div>';
    var presentes=v.presentes.length?v.presentes.map(function(x){var d=x.dinamica,cp=d&&raiz.TE_PERFIL_COPY?raiz.TE_PERFIL_COPY[d.nombre]:null;return '<article class="cpNudo"><h3>'+esc(x.titulo)+'</h3><p class="meta">'+esc(nombreAnimal(x.rama)+' · '+nombreTallo(x.tallo)+(d?' · '+d.nombre:''))+'</p><p>El vacío cae en una zona ligada a '+esc(x.tema)+'. Aquí lo tratamos como un terreno que suele pedir experiencia propia, prueba y ajuste, en vez de asumir que ya viene resuelto.</p>'+(cp?'<p class="cpSuave">El perfil que lo acompaña es '+esc(d.nombre)+': '+esc(cp.resumen)+'</p>':'')+'</article>';}).join(''):'<p>Estas dos ramas no ocupan ninguno de tus pilares natales. El vacío existe como parte técnica del ciclo, pero en tu carta base no se instala dentro de Tu origen, Tu trayectoria o Tu futuro.</p>';
    return '<div class="cpVista">'+volver(id)+cab('Tus vacíos','El ciclo de 60 combina diez tallos con doce ramas. En cada bloque quedan dos ramas sin tallo; esas son tus ramas vacías. La lectura se vuelve personal cuando una de ellas ocupa uno de tus pilares.')+
      '<section class="cpHoja"><h3>Tus dos ramas vacías</h3>'+ramas+'<p class="cpSuave">Un vacío no significa que una parte de tu vida esté condenada ni que te falte una capacidad. Aquí lo usamos como una señal de aprendizaje construido.</p>'+presentes+remate('Lo que no viene dado también se puede construir, y a veces termina siendo de lo que más conoces por experiencia propia.')+'</section></div>';
  }

  var NUDO_PRACTICA={
    anio:['observa en qué momentos pertenecer te hace cambiar demasiado tu forma de actuar','define qué cosas sí quieres conservar de tu origen y cuáles ya son elección tuya'],
    mes:['detecta cuándo un rol o trabajo te obliga a funcionar en automático','elige un criterio propio para medir si un camino todavía te sirve'],
    hora:['separa el deseo de tener todo resuelto del siguiente paso que sí puedes decidir hoy','prueba futuros pequeños antes de exigirle a uno que cargue con toda tu identidad']
  };
  function nudoHTML(perfil,a){
    var id=perfil.id,n=a.nudo;
    if(!n.presente){return '<div class="cpVista">'+volver(id)+cab('Tu nudo de fondo','Esta capa se construye cuando una de tus ramas vacías cae dentro de un pilar natal. En tu carta eso no sucede, así que aquí no vamos a inventarte un problema que el cálculo no está marcando.')+'<section class="cpHoja"><h3>Esta parte queda tranquila</h3><p>Tus vacíos existen en el ciclo, pero no ocupan Tu origen, Tu trayectoria ni Tu futuro. Puedes usar la lectura de vacíos como contexto técnico sin convertirla en el centro de tu carta.</p>'+remate('Una lectura también es útil cuando sabe qué no necesita dramatizar.')+'</section></div>';}
    var items=n.items.map(function(x){var d=x.dinamica,cp=x.perfilCopy||{},ec=raiz.TE_ELEMENTO_COPY&&raiz.TE_ELEMENTO_COPY[x.tallo.elemento],pr=NUDO_PRACTICA[x.pilar]||[];return '<article class="cpNudo"><h3>'+esc(x.titulo)+'</h3><p class="meta">'+esc(nombreAnimal(x.rama)+' · '+nombreTallo(x.tallo)+(d?' · '+d.nombre:''))+'</p><h4>Qué patrón estamos mirando</h4><p>El vacío cae en '+esc(x.tema)+'. Por eso conviene observar qué haces cuando esa zona se siente poco definida o cuando esperas que alguien más te dé una respuesta que todavía estás construyendo.</p>'+(cp.cuidado?'<h4>Cómo se puede trabar</h4><p>'+esc(cp.cuidado)+'</p>':'')+(x.tensiones&&x.tensiones.length?'<p class="cpSuave">Además, este pilar tiene '+x.tensiones.map(function(t){return t.detalle.toLowerCase();}).join(' y ')+'. El patrón puede hacerse más visible cuando dos zonas de tu vida piden ritmos distintos.</p>':'')+'<h4>Qué puedes probar</h4>'+(pr[0]?accion(pr[0]):'')+(pr[1]?accion(pr[1]):'')+(ec?accion(ec.probar[0]):'')+'</article>';}).join('');
    return '<div class="cpVista">'+volver(id)+cab('Tu nudo de fondo','Esta lectura toma tus vacíos y los cruza con el pilar donde aparecen, el elemento que llevan, el perfil que los acompaña y las relaciones internas de la carta. Busca localizar un patrón que puedas reconocer en la vida diaria.')+
      '<section class="cpHoja"><p class="cpSuave">Esta capa habla de un tema de aprendizaje que puede repetirse alrededor de un vacío natal. La tratamos como un patrón para observar y trabajar, no como un diagnóstico psicológico.</p>'+items+remate('El objetivo no es encontrar una explicación total de tu pasado. Es reconocer qué respuesta sigues repitiendo y decidir si todavía te sirve.')+'</section></div>';
  }

  function recursoHTML(perfil,a){
    var id=perfil.id,r=a.recurso,cp=r.copy||{},n=a.nudo;
    var alt=r.alternativas&&r.alternativas.length?'<p class="cpAlternativas">Otras rutas que el mismo criterio deja abiertas: '+r.alternativas.map(cap).join(', ')+'.</p>':'';
    var perfilTxt=r.dinamica?'En tu carta, este recurso se expresa sobre todo como <b>'+esc(r.dinamica.nombre)+'</b>. '+esc((raiz.TE_PERFIL_COPY&&raiz.TE_PERFIL_COPY[r.dinamica.nombre]?raiz.TE_PERFIL_COPY[r.dinamica.nombre].resumen:'')):'';
    var puente;
    if(n.presente){var x=n.items[0],pr=NUDO_PRACTICA[x.pilar]||[];puente='<div class="cpPuente"><h3>Cómo usarlo sobre tu nudo de fondo</h3><p>Tu nudo principal aparece primero en <b>'+esc(x.titulo)+'</b>. '+cap(r.elemento)+' no borra ese patrón. Funciona mejor como una conducta alternativa que puedes practicar justo cuando esa zona se activa.</p><div class="cpSecuencia"><div class="cpPaso">Detecta el momento: '+esc((pr[0]||'nota cuándo el patrón vuelve a aparecer'))+'.</div><div class="cpPaso">Cambia la respuesta: '+esc(cp.probar[0])+'.</div><div class="cpPaso">Hazlo pequeño y repetible: '+esc(cp.probar[1])+'. Después revisa si tu margen de decisión aumentó.</div></div></div>';}else{puente='<div class="cpPuente"><h3>Cómo usarlo</h3><p>Como tu nudo de fondo no ocupa un pilar natal, este recurso funciona aquí como contrapeso general.</p>'+accion(cp.probar[0])+accion(cp.probar[1])+'</div>';}
    return '<div class="cpVista">'+volver(id)+cab('Tu recurso de equilibrio','Este cálculo busca un contrapeso para la carta. Primero mira tu Día Maestro y la estación solar de nacimiento; cuando hay más de una ruta posible, el conteo de tu propia carta ayuda a ponerlas en contexto.')+
      '<section class="cpHoja"><div class="cpRecursoHero"><small>Tu contrapeso principal</small><strong>'+esc(r.elemento)+'</strong><p>'+esc(r.razon)+'</p>'+alt+'</div><h4>Cómo se traduce en tu vida diaria</h4><p>'+perfilTxt+'</p>'+accion(cp.probar[0])+accion(cp.probar[2])+remate('Un buen contrapeso no cambia quién eres. Te da otra manera de responder cuando tu forma habitual ya no alcanza.')+'</section>'+puente+'</div>';
  }

  function render(){
    if(typeof raiz.analizarCartaProfunda!=='function'||typeof raiz.leerPerfil!=='function'||typeof raiz.cartaDesdePerfil!=='function')return;
    var id=idPerfilActual();if(!id)return;var perfil=raiz.leerPerfil(id);if(!perfil)return;
    var carta;try{carta=raiz.cartaDesdePerfil(perfil);}catch(e){return;}if(!carta)return;
    var sinHora=!!(perfil.nacimiento&&perfil.nacimiento.sinHora),lec=typeof raiz.lecturaCompleta==='function'?raiz.lecturaCompleta(carta,sinHora):null;if(!lec)return;
    var a=raiz.analizarCartaProfunda(carta,{sinHora:sinHora,nacimiento:perfil.nacimiento||{}}),v=vista(),html='';
    if(v==='mezcla')html=mezclaHTML(perfil,a);
    else if(v==='perfiles')html=perfilesHTML(perfil,a);
    else if(v==='pilares')html=pilaresHTML(perfil,lec,a);
    else if(v==='vacios')html=vaciosHTML(perfil,a);
    else if(v==='nudo')html=nudoHTML(perfil,a);
    else if(v==='equilibrio')html=recursoHTML(perfil,a);
    else html=resumenGeneral(perfil,carta,lec,a);
    var caja=$('#lectura');if(!caja)return;caja.innerHTML=html;caja.classList.add('escalona');aparecer(caja);

    var seguir=$('#seguirCarta');if(seguir){if(v==='general'){seguir.hidden=false;var st=seguir.querySelector('.seguirTexto'),sm=seguir.querySelector('small');if(st)st.textContent='Tu lectura sigue';if(sm)sm.textContent='mezcla · perfiles · pilares · vacíos · equilibrio';}else seguir.hidden=true;}
    var compartir=$('#compartirMarco');if(compartir)compartir.hidden=v!=='general';
    var acciones=$('.resultadoAcciones');if(acciones)acciones.hidden=v!=='general';
    document.title=(v==='general'?'Lectura general':({mezcla:'Tu mezcla',perfiles:'Tus perfiles',pilares:'Tus pilares',vacios:'Tus vacíos',nudo:'Tu nudo de fondo',equilibrio:'Tu recurso de equilibrio'}[v]))+' — Tu Elemento';
  }

  function renderDespues(){setTimeout(render,35);}
  renderDespues();
  document.addEventListener('submit',function(e){if(e.target&&e.target.id==='forma')renderDespues();},true);
  document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#calcular'):null;if(b)renderDespues();},true);
  raiz.addEventListener&&raiz.addEventListener('popstate',render);
  raiz.TE_CARTA_PROFUNDA_RENDER=render;
})(typeof globalThis!=='undefined'?globalThis:this);
