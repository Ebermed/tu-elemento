/** TU ELEMENTO V2 BROADWAY — experiencia general y dos lecturas profundas. */
(function (raiz) {
  'use strict';

  var ELEMENTOS=['madera','fuego','tierra','metal','agua'];
  var ETIQUETAS={madera:'MADERA',fuego:'FUEGO',tierra:'TIERRA',metal:'METAL',agua:'AGUA'};
  var ESTADO_AMIGABLE={
    prospero:{titulo:'Con mucho apoyo',texto:'La estación de tu nacimiento refuerza bastante tu elemento base. Eso hace que sus cualidades aparezcan con facilidad y también que convenga saber cuándo bajarles volumen.'},
    fuerte:{titulo:'Con apoyo',texto:'La estación de tu nacimiento favorece a tu elemento base. Suele ser una función disponible y relativamente fácil de usar.'},
    debil:{titulo:'Con poco apoyo',texto:'La estación de tu nacimiento le da poco respaldo a tu elemento base. Sus cualidades siguen ahí, pero a veces necesitan mejores condiciones para aparecer.'},
    muerto:{titulo:'Con muy poco apoyo',texto:'La estación de tu nacimiento le quita bastante fuerza a tu elemento base. Eso vuelve más importante cuidar dónde gastas energía y qué cosas sí te sostienen.'},
    trampa:{titulo:'En tensión',texto:'La estación de tu nacimiento pone a tu elemento base bajo presión. Puede sentirse como tener capacidad, pero necesitar más ajuste para usarla sin desgaste.'}
  };

  function $(s){return document.querySelector(s);}
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function cap(x){x=String(x||'');return x?x.charAt(0).toUpperCase()+x.slice(1):'';}
  function q(n){try{return new URLSearchParams(location.search).get(n)||'';}catch(e){return'';}}
  function vista(){return q('vista')||'general';}
  function href(id,v){return 'index.html?perfil='+encodeURIComponent(id)+(v&&v!=='general'?'&vista='+encodeURIComponent(v):'');}
  function perfilActual(){var id=q('perfil');return id&&raiz.leerPerfil?raiz.leerPerfil(id):null;}
  function nombreAnimal(r){if(!r)return'';return raiz.ANIMALES&&raiz.ANIMALES[r.pinyin]?raiz.ANIMALES[r.pinyin].nombre:cap(r.animal||r.pinyin);}
  function nombreTallo(t){if(!t)return'';return raiz.IDENTIDADES&&raiz.IDENTIDADES[t.pinyin]?raiz.IDENTIDADES[t.pinyin].nombre:cap(t.elemento)+' '+(t.yang?'Yang':'Yin');}
  function polaridad(t){return t&&t.yang?'Yang':'Yin';}
  function elementoCopy(e){return raiz.TE_ELEMENTO_COPY&&raiz.TE_ELEMENTO_COPY[e]?raiz.TE_ELEMENTO_COPY[e]:null;}

  function copyForma(nombre,base){
    base=base||{};
    if(nombre!=='Estructura')return base;
    return {
      area:'Estructura',
      resumen:'Te funciona saber qué te toca, qué depende de los demás y cuándo una tarea puede darse por terminada.',
      seNota:'Los roles claros, los horarios, los acuerdos y las responsabilidades concretas suelen darte tranquilidad para actuar.',
      cuidado:'Puedes seguir cumpliendo una regla aunque ya haya dejado de ayudarte.',
      probar:'Elige una responsabilidad actual y define qué resultado concreto debería producir. Si ya no lo produce, toca renegociarla.'
    };
  }

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

  function moduloCompacto(clase,titulo,explicacion,cuerpo,cta,link){
    return '<section class="cpgCompacto cpgCompacto--'+clase+'"><h3>'+esc(titulo)+'</h3><p class="cpgExplica">'+esc(explicacion)+'</p>'+cuerpo+'<a class="cpgCTA" href="'+link+'">'+esc(cta)+'</a></section>';
  }

  function pilarVisual(titulo,p){
    if(!p)return '<article class="cpgPilar"><small>'+esc(titulo)+'</small><strong>Falta la hora</strong><p>Esta parte se completa cuando agregas la hora de nacimiento.</p></article>';
    var ocultos=raiz.tallosOcultos?raiz.tallosOcultos(p.rama):[];
    var chips=ocultos.length?ocultos.map(function(t){return '<span>'+esc(nombreTallo(t))+' · '+esc(cap(t.elemento))+'</span>';}).join(''):'<span>Sin capas adicionales</span>';
    return '<article class="cpgPilar">'+
      '<small>'+esc(titulo)+'</small>'+
      '<div class="cpgCapa"><em>ARRIBA · TALLO VISIBLE</em><strong>'+esc(nombreTallo(p.tallo))+'</strong><b>'+esc(cap(p.tallo.elemento)+' '+polaridad(p.tallo))+'</b></div>'+
      '<div class="cpgCapa cpgCapa--rama"><em>BASE · RAMA</em><strong>'+esc(nombreAnimal(p.rama))+'</strong><b>'+esc(cap(p.rama.elemento)+' '+polaridad(p.rama))+'</b></div>'+
      '<div class="cpgOcultos"><em>DENTRO · TALLOS OCULTOS</em><div>'+chips+'</div></div>'+
      '</article>';
  }

  function resumenPilares(carta,lec){
    var centro=carta.pilares.dia,tray=carta.pilares.mes,origen=carta.pilares.anio,futuro=carta.pilares.hora;
    var base='Tu centro combina '+nombreTallo(centro.tallo)+' con '+nombreAnimal(centro.rama)+', mientras que Tu trayectoria combina '+nombreTallo(tray.tallo)+' con '+nombreAnimal(tray.rama)+'.';
    if(lec&&lec.sinHora)return base+' Tu origen también está calculado; la hora completa Tu futuro y las referencias complementarias.';
    return base+' Tu origen abre con '+nombreTallo(origen.tallo)+' sobre '+nombreAnimal(origen.rama)+' y Tu futuro con '+nombreTallo(futuro.tallo)+' sobre '+nombreAnimal(futuro.rama)+'.';
  }

  function renderGeneral(perfil,carta,lec,a){
    var id=perfil.id,m=a.mezcla,pct=porcentajes(m),pr=a.perfiles&&a.perfiles.principal,d=pr&&pr.dinamica,pc=copyForma(d&&d.nombre,pr&&pr.copy||{});
    var vacios=a.vacios&&a.vacios.presentes||[],n=a.nudo||{},r=a.recurso||{},est=a.estado||{},estado=ESTADO_AMIGABLE[est.estado]||null;
    var dom=cap(m.dominante),menor=cap(m.menor),domCopy=elementoCopy(m.dominante),menorCopy=elementoCopy(m.menor);

    var mezclaCuerpo=columnasElementos(m)+
      '<div class="cpgDato"><strong>Tienes más '+esc(dom)+' ('+pct[m.dominante]+'%) y menos '+esc(menor)+' ('+pct[m.menor]+'%).</strong><span>Tener más de un elemento significa que esa forma de responder está disponible con mucha facilidad; también puede aparecer incluso cuando otra respuesta sería más útil. Tener menos significa que esa función suele necesitar más intención, práctica o un contexto favorable para salir. El objetivo no es repartir todo igual, sino aprender cuándo conviene usar cada parte.</span></div>'+
      (domCopy?'<div class="cpgLecturaRapida"><div><small>LO QUE MÁS USAS</small><strong>'+esc(domCopy.fortaleza)+'</strong><p>'+esc(domCopy.cuidado)+'</p></div>'+(menorCopy?'<div><small>LO QUE PIDE MÁS INTENCIÓN</small><strong>'+esc(menorCopy.fortaleza)+'</strong><p>Tener menos '+esc(menor)+' vuelve esta función menos automática. Puedes desarrollarla cuando la situación la necesite.</p></div>':'')+'</div>':'')+
      (estado?'<div class="cpgEstado"><small>FUERZA DE TU ELEMENTO BASE</small><strong>'+esc(estado.titulo)+'</strong><p>'+esc(estado.texto)+'</p></div>':'');

    var formasCuerpo='<div class="cpgDato"><strong>Tu forma principal es '+esc(d?d.nombre:'—')+'.</strong><span>'+esc(pc.resumen||'Estas formas muestran qué respuesta te sale primero en distintos tipos de situación.')+'</span></div>';

    var pilaresVisual='<div class="cpgPilaresGeneral">'+
      pilarVisual('TU ORIGEN',carta.pilares.anio)+pilarVisual('TU TRAYECTORIA',carta.pilares.mes)+pilarVisual('TU CENTRO',carta.pilares.dia)+pilarVisual('TU FUTURO',lec.sinHora?null:carta.pilares.hora)+
      pilarVisual('TU BRÚJULA',a.extras&&a.extras.brujula)+pilarVisual('TU PUNTO DE PARTIDA',a.extras&&a.extras.puntoPartida)+
      '</div><div class="cpgDato"><strong>Tu configuración, en una frase</strong><span>'+esc(resumenPilares(carta,lec))+'</span></div>';

    var vaciosCuerpo=vacios.length?'<div class="cpgDato"><strong>El vacío toca '+esc(vacios.map(function(x){return x.titulo.toLowerCase();}).join(' y '))+'.</strong><span>Ahí suele haber más aprendizaje por experiencia propia que respuestas automáticas.</span></div>':'<div class="cpgDato"><strong>Tus vacíos quedan fuera de los pilares natales.</strong><span>Esta capa existe, aunque pesa poco dentro de tu lectura base.</span></div>';
    var nudoCuerpo=n.presente?'<div class="cpgDato"><strong>Tu patrón de fondo aparece primero en '+esc(n.items[0].titulo.toLowerCase())+'.</strong><span>Ahí conviene mirar qué haces de forma repetida cuando esa parte de tu vida se siente poco definida.</span></div>':'<div class="cpgDato"><strong>Tu nudo de fondo queda tranquilo.</strong><span>Esta capa tiene poca presión dentro de tu carta base.</span></div>';
    var recursoCuerpo='<div class="cpgDato"><strong>Tu principal recurso de equilibrio es '+esc(cap(r.elemento||'—'))+'.</strong><span>Esta función puede ayudarte cuando tu respuesta habitual se queda corta o una parte de la carta toma demasiado espacio.</span></div>';

    return '<div class="cpgVista">'+
      '<header class="cpgCab"><p class="cpgKicker">TU ELEMENTO · LECTURA GENERAL</p><h2>Este eres tú</h2><p>Este es un mapa general sobre ti. Puedes conocer más haciendo clic en cada apartado.</p></header>'+
      modulo('mezcla','TU MEZCLA','Tu carta está hecha de cinco elementos: Madera, Fuego, Tierra, Metal y Agua. La cantidad de cada uno cambia de persona a persona y modifica qué respuestas te salen más fácil, cuáles requieren más intención y qué cosas conviene aprender a equilibrar.',mezclaCuerpo,'Aprender a balancear mis elementos',href(id,'mezcla'))+
      modulo('formas','TUS FORMAS DE ACTUAR','La carta también reúne diez formas de responder a lo que te pasa: relacionarte, expresarte, conseguir recursos, lidiar con presión y aprender. Algunas aparecen más que otras y una suele marcar el tono principal.',formasCuerpo,'Conocer mis formas de actuar',href(id,'perfiles'))+
      modulo('pilares','TUS PILARES','Los pilares muestran que una misma persona puede funcionar distinto según el contexto. Cada columna combina lo que muestras, la base sobre la que reaccionas y capas menos evidentes que también participan.',pilaresVisual,'Entender mis pilares a fondo',href(id,'pilares'))+
      '<div class="cpgTrio">'+
        moduloCompacto('vacios','TUS VACÍOS','Muestran zonas donde el criterio suele construirse más por experiencia propia.',vaciosCuerpo,'Ver mis vacíos',href(id,'vacios'))+
        moduloCompacto('nudo','TU NUDO DE FONDO','Cruza esos vacíos con el lugar donde aparecen para localizar una respuesta que puede repetirse.',nudoCuerpo,'Ver mi nudo',href(id,'nudo'))+
        moduloCompacto('recurso','TU RECURSO DE EQUILIBRIO','Busca qué función puede servirte de contrapeso cuando una respuesta se está llevando demasiado espacio.',recursoCuerpo,'Ver cómo usarlo',href(id,'equilibrio'))+
      '</div>'+
      '<section class="cpgTiempo"><h3>Tu carta también cambia con el tiempo</h3><p>Calendario, Tu mes y Ciclos muestran cómo esta base se encuentra con distintos momentos.</p><div><a href="calendario.html?perfil='+encodeURIComponent(id)+'">Calendario</a><a href="mes.html?perfil='+encodeURIComponent(id)+'">Tu mes</a><a href="ciclos.html?perfil='+encodeURIComponent(id)+'">Ciclos</a></div></section>'+
      '</div>';
  }

  function presenciaElemento(e,m,pct){
    if(e===m.dominante)return {etiqueta:'DE LOS MÁS PRESENTES',texto:'Esta función está muy disponible en tu carta. Es fácil recurrir a ella y por eso también conviene notar cuándo la estás usando de más.'};
    if(e===m.menor)return {etiqueta:'DE LOS MENOS PRESENTES',texto:'Esta función aparece menos que las demás. Eso no la vuelve una carencia: suele ser algo que activas con más intención, práctica o contexto.'};
    return {etiqueta:'PRESENCIA INTERMEDIA',texto:'Esta función tiene espacio dentro de tu carta sin llevar el volante todo el tiempo. Suele estar disponible cuando la situación la pide.'};
  }

  function renderMezcla(perfil,a){
    var id=perfil.id,m=a.mezcla,pct=porcentajes(m),estado=ESTADO_AMIGABLE[a.estado&&a.estado.estado]||null;
    var cards=ELEMENTOS.map(function(e){
      var cp=elementoCopy(e)||{fortaleza:'',cuidado:'',probar:[]},p=presenciaElemento(e,m,pct);
      return '<article class="cpgElementoProfundo cpgElementoProfundo--'+e+'"><div class="cpgElementoProfundoTop"><div><small>'+p.etiqueta+'</small><h3>'+ETIQUETAS[e]+'</h3></div><strong>'+pct[e]+'%</strong></div><p>'+esc(p.texto)+'</p><h4>Lo que te aporta</h4><p>'+esc(cp.fortaleza)+'</p><h4>Cuando se carga de más</h4><p>'+esc(cp.cuidado)+'</p><h4>Qué puedes probar</h4><div class="cpgConsejos">'+(cp.probar||[]).slice(0,2).map(function(t){return '<span>'+esc(t)+'</span>';}).join('')+'</div></article>';
    }).join('');
    return '<div class="cpgVista cpgProfunda"><a class="cpgVolver" href="'+href(id,'general')+'">‹ Volver a la lectura general</a><header class="cpgCab cpgCab--profunda"><p class="cpgKicker">TU ELEMENTO · LECTURA PROFUNDA</p><h2>Tus cinco elementos</h2><p>Aquí vemos qué función cumple cada elemento en tu configuración, qué pasa cuando tiene mucho o poco espacio y cómo puedes usarlo con más intención.</p></header><section class="cpgModulo cpgModulo--mezcla"><h3>ASÍ SE REPARTE TU CARTA</h3><p class="cpgExplica">El porcentaje sale de los tallos visibles, las ramas y los tallos ocultos de tus pilares. Tener más no significa “mejor” y tener menos no significa “peor”: habla de qué recursos tienes más automatizados y cuáles necesitas activar de forma consciente.</p>'+columnasElementos(m)+(estado?'<div class="cpgEstado"><small>FUERZA DE TU ELEMENTO BASE</small><strong>'+esc(estado.titulo)+'</strong><p>'+esc(estado.texto)+'</p></div>':'')+'</section><div class="cpgElementosProfundos">'+cards+'</div><p class="cpgCierre">Balancear tu carta no significa convertirla en 20% de cada cosa. Significa ampliar tus opciones para que el elemento que más usas no tenga que resolverlo todo.</p></div>';
  }

  function renderFormas(perfil,a){
    var id=perfil.id,p=a.perfiles||{},principal=p.principal||{},d=principal.dinamica,pc=copyForma(d&&d.nombre,principal.copy||{});
    var lista=(p.apariciones||[]).map(function(x){var cp=copyForma(x.nombre,x.copy||{});return '<article class="cpgForma"><div class="cpgFormaTop"><div><small>'+esc(cp.area||x.area||'')+'</small><h3>'+esc(x.nombre)+'</h3></div><span>'+x.total+' aparici'+(x.total===1?'ón':'ones')+'</span></div><p>'+esc(cp.resumen||'Esta forma aparece dentro de tu carta.')+'</p><h4>Cómo suele verse</h4><p>'+esc(cp.seNota||'')+'</p><h4>Ojo con esto</h4><p>'+esc(cp.cuidado||'')+'</p><div class="cpgConsejos"><span>'+esc(cp.probar||'Observa cuándo aparece esta forma y qué cambia cuando la usas con intención.')+'</span></div></article>';}).join('');
    return '<div class="cpgVista cpgProfunda"><a class="cpgVolver" href="'+href(id,'general')+'">‹ Volver a la lectura general</a><header class="cpgCab cpgCab--profunda"><p class="cpgKicker">TU ELEMENTO · LECTURA PROFUNDA</p><h2>Tus formas de actuar</h2><p>Son diez respuestas posibles que aparecen al comparar tu elemento base con las demás piezas de tu carta. Hablan de cómo te relacionas, produces, administras recursos, respondes a presión y aprendes.</p></header><section class="cpgFormaPrincipal"><small>TU FORMA PRINCIPAL</small><h3>'+esc(d?d.nombre:'—')+'</h3><p>'+esc(pc.resumen||'')+'</p><div class="cpgFormaPrincipalGrid"><div><b>Cómo suele verse</b><span>'+esc(pc.seNota||'')+'</span></div><div><b>Lo que puedes vigilar</b><span>'+esc(pc.cuidado||'')+'</span></div><div><b>Una prueba útil</b><span>'+esc(pc.probar||'')+'</span></div></div></section><section class="cpgModulo cpgModulo--formas"><h3>LAS QUE MÁS SE REPITEN EN TU CARTA</h3><p class="cpgExplica">El número indica cuántas veces aparece cada forma entre tallos visibles y tallos ocultos. Repetición significa disponibilidad: es una respuesta que tu carta tiene a mano con frecuencia.</p><div class="cpgFormasLista">'+lista+'</div></section></div>';
  }

  function construir(){
    if(!raiz.analizarCartaProfunda||!raiz.cartaDesdePerfil||!raiz.leerPerfil)return null;
    var perfil=perfilActual();if(!perfil)return null;
    var carta;try{carta=raiz.cartaDesdePerfil(perfil);}catch(e){return null;}if(!carta)return null;
    var sinHora=!!(perfil.nacimiento&&perfil.nacimiento.sinHora);
    var a=raiz.analizarCartaProfunda(carta,{sinHora:sinHora,nacimiento:perfil.nacimiento||{}});
    var lec=raiz.lecturaCompleta?raiz.lecturaCompleta(carta,sinHora):null;
    return {perfil:perfil,carta:carta,a:a,lec:lec};
  }

  function renderExperiencia(){
    var datos=construir();if(!datos)return;
    var v=vista(),html='';
    if(v==='general')html=renderGeneral(datos.perfil,datos.carta,datos.lec||{sinHora:false},datos.a);
    else if(v==='mezcla')html=renderMezcla(datos.perfil,datos.a);
    else if(v==='perfiles')html=renderFormas(datos.perfil,datos.a);
    else return;
    var caja=$('#lectura');if(!caja)return;caja.innerHTML=html;
    if(raiz.activarApariciones)raiz.activarApariciones(caja);
    var seguir=$('#seguirCarta');if(seguir){if(v==='general'){seguir.hidden=false;var st=seguir.querySelector('.seguirTexto'),sm=seguir.querySelector('small');if(st)st.textContent='Tu lectura sigue';if(sm)sm.textContent='mezcla · formas de actuar · pilares · vacíos · equilibrio';}else seguir.hidden=true;}
    var compartir=$('#compartirMarco');if(compartir)compartir.hidden=v!=='general';var acciones=$('.resultadoAcciones');if(acciones)acciones.hidden=v!=='general';
    if(v==='general')document.title='Lectura general — Tu Elemento';
    if(v==='mezcla')document.title='Tus cinco elementos — Tu Elemento';
    if(v==='perfiles')document.title='Tus formas de actuar — Tu Elemento';
  }

  var anterior=raiz.TE_CARTA_PROFUNDA_RENDER;
  if(typeof anterior==='function')raiz.TE_CARTA_PROFUNDA_RENDER=function(){anterior();setTimeout(renderExperiencia,0);};
  setTimeout(renderExperiencia,80);
  document.addEventListener('submit',function(e){if(e.target&&e.target.id==='forma')setTimeout(renderExperiencia,90);},true);
  document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('#calcular'))setTimeout(renderExperiencia,90);},true);
  if(raiz.addEventListener)raiz.addEventListener('popstate',function(){setTimeout(renderExperiencia,20);});
})(typeof globalThis!=='undefined'?globalThis:this);
