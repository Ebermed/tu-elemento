/* TU ELEMENTO — PILARES PERSONALIZADOS PREVIEW
   Motor editorial aislado para copy-v2-preview. No forma parte de producción. */
(function(root){
'use strict';
if(typeof document==='undefined')return;

var PRODUCE={madera:'fuego',fuego:'tierra',tierra:'metal',metal:'agua',agua:'madera'};
var CONTROLA={madera:'tierra',tierra:'agua',agua:'fuego',fuego:'metal',metal:'madera'};

var ZONAS={
  anio:{titulo:'Tu origen',kicker:'EL MUNDO QUE TE RECIBIÓ',intro:'El mundo que te tocó antes de poder opinar. La familia grande, los amigos de la infancia, el ambiente donde aprendiste cómo se trata la gente entre sí. Mucho de lo que crees que es “normal” se decidió aquí.',como:'En familia, amistades viejas y grupos donde ya hay historia,',costo:'Lo aprendido aquí se vuelve automático con facilidad.',prueba:'Haz una cosa distinta en un contexto viejo y fíjate qué parte de ti protesta primero.'},
  mes:{titulo:'Tu trayectoria',kicker:'CÓMO APRENDISTE A AVANZAR',intro:'Cómo aprendiste a funcionar fuera de tu casa. Escuela, trabajo, responsabilidades, la relación con quien te formó. Es la zona que más se puede mover a propósito, y por eso es la que más rinde trabajar.',como:'En escuela, trabajo y responsabilidades,',costo:'Cuando esta zona se automatiza, puedes terminar funcionando para la estructura antes de preguntarte si todavía te sirve.',prueba:'Cambia una regla de tu rutina laboral antes de que se vuelva insoportable.'},
  dia:{titulo:'Tu centro',kicker:'AQUÍ ESTÁS TÚ',intro:'Aquí estás tú. Cómo piensas, cómo sientes y a quién eliges tener cerca. De este pilar sale tu elemento.',como:'Con la gente cercana y cuando nadie te está pidiendo que actúes un papel,',costo:'Aquí el costo se siente muy personal porque no puedes dejarlo en la oficina ni en la casa de alguien más.',prueba:'Haz un cambio pequeño en la forma en que pides, respondes o pones un límite.'},
  hora:{titulo:'Tu futuro',kicker:'LO QUE VAS CONSTRUYENDO',intro:'Lo que estás construyendo con el tiempo. Proyectos, hijos, lo que te importa en privado, lo que quieres dejar creciendo cuando ya no estés viéndolo.',como:'Con proyectos largos, planes privados y lo que todavía está tomando forma,',costo:'Aquí es fácil exigirle al futuro que resuelva hoy una incertidumbre que todavía necesita tiempo.',prueba:'Haz una versión pequeña del futuro que quieres antes de comprometerte con la versión completa.'},
  brujula:{titulo:'Tu brújula',kicker:'LO QUE TE CONVIENE DESARROLLAR',intro:'Si tuvieras que desarrollar una sola cosa, sería esta. No es un talento que ya traigas: es una forma de actuar que te compensa lo que te falta y te destraba lo que traes atorado. Cuando ya no sabes por dónde, este es el default al que conviene volver.',como:'Cuando te atoras o sientes que estás resolviendo todo con la misma herramienta,',costo:'La dificultad aquí no es entenderlo: es acordarte de usarlo justo cuando vuelves a tu respuesta automática.',prueba:'Escoge una situación repetida de esta semana y prueba deliberadamente esta respuesta una sola vez.'},
  partida:{titulo:'Tu punto de partida',kicker:'ANTES DE APRENDER A COMPORTARTE',intro:'Cómo eras antes de que la vida te enseñara a comportarte. Sigue ahí abajo: sale cuando estás agotado, cuando confías mucho, o cuando algo te agarra desprevenido.',como:'Cuando bajas la guardia, hay mucha confianza o ya no te queda energía para editarte,',costo:'Esta respuesta puede sentirse tan natural que aparece antes de que decidas si todavía te conviene.',prueba:'La próxima vez que salga en automático, no la frenes: nómbrala y decide qué parte sí quieres conservar.'}
};

var TALLOS={
  Jia:{desc:'Te sale empujar hacia adelante. Cuando ya viste una dirección, prefieres sostenerla y hacer que algo crezca de verdad.',escena:'te conviertes en quien marca rumbo y sigue aunque el resto todavía esté dudando.',costo:'Puedes sostener una dirección después de que el terreno ya cambió.',prueba:'Revisa una decisión que dabas por cerrada y pregunta qué cambió desde que la tomaste.'},
  Yi:{desc:'Te sale encontrar por dónde. Lees el entorno, detectas apoyos y cambias de ruta sin sentir que por eso cambiaste de objetivo.',escena:'encuentras una salida lateral cuando el camino directo se traba.',costo:'Adaptarte tanto puede hacer que lo tuyo termine acomodándose siempre al final.',prueba:'Antes de adaptarte, escribe qué parte de tu plan no quieres negociar.'},
  Bing:{desc:'Te sale poner energía y hacer visible lo que está pasando. Cuando llegas, el ambiente rara vez se queda exactamente igual.',escena:'eres quien prende la conversación, empuja el ánimo o vuelve visible lo que nadie estaba diciendo.',costo:'Mantener la intensidad demasiado tiempo te cobra batería.',prueba:'Deja una parte del día sin público, respuesta ni obligación de sostener el ánimo de nadie.'},
  Ding:{desc:'Te sale concentrar energía en pocas cosas y sostenerlas durante mucho tiempo. Cuando algo te importa, lo mantienes prendido.',escena:'te quedas cuidando el proceso cuando el entusiasmo de los demás ya bajó.',costo:'Puedes terminar calentando demasiadas cosas al mismo tiempo.',prueba:'Escoge qué merece seguir recibiendo tu energía y qué ya puede mantenerse sin ti.'},
  Wu:{desc:'Te toca ser el piso: la gente se apoya en ti, tú respondes, tú sostienes. Y funciona, se te da.',escena:'terminas siendo quien resuelve, quien organiza, quien aguanta.',costo:'Sostienes cosas por responsabilidad mucho después de que ya te querías mover.',prueba:'Cámbiale algo a una estructura mientras todavía está funcionando.'},
  Ji:{desc:'Te sale cuidar condiciones para que algo crezca. Notas lo que falta y muchas veces lo das antes de que te lo pidan.',escena:'te acuerdas de detalles, anticipas necesidades y arreglas el terreno para que los demás puedan avanzar.',costo:'Tu propio terreno se puede quedar para después porque siempre hay algo más que cuidar.',prueba:'Pon primero una necesidad tuya en una lista que normalmente empieza con las de los demás.'},
  Geng:{desc:'Te sale cortar lo que sobra y decir dónde está la línea. Ves rápido qué sí, qué no y qué ya terminó.',escena:'eres quien pone una decisión sobre la mesa cuando los demás siguen rodeándola.',costo:'La claridad puede llegar antes que el contexto.',prueba:'Antes de cerrar algo, agrega una pregunta que pueda darte un dato que todavía no estabas considerando.'},
  Xin:{desc:'Te sale ver el detalle que cambia el conjunto. Forma, tono, acabado y coherencia no son adornos para ti: son parte del resultado.',escena:'detectas la costura, el margen o la frase que desacomoda todo.',costo:'El punto de cierre se mueve cada vez que encuentras una cosa más que pulir.',prueba:'Define antes de empezar qué significa “ya quedó” y respétalo cuando llegues ahí.'},
  Ren:{desc:'Te sale conectar personas, ideas y oportunidades. Rara vez ves una sola ruta cuando hay cinco posibles.',escena:'abres posibilidades y juntas cosas que sin ti probablemente no se habrían encontrado.',costo:'Tantas corrientes abiertas reparten tu energía.',prueba:'Escoge un cauce principal por una semana y deja las demás opciones anotadas, no activas.'},
  Gui:{desc:'Te sale leer el ambiente antes de que alguien lo explique. Notas silencios, cambios chiquitos y cosas que todavía no tienen nombre.',escena:'captas que algo cambió antes de que el resto lo ponga en palabras.',costo:'Lo que tú necesitas puede quedar fuera de cuadro porque lo ajeno hace más ruido.',prueba:'Di una necesidad en voz alta antes de esperar a que alguien la adivine.'}
};

var RAMAS={
  Zi:{animal:'Rata',desc:'Abajo traes radar para oportunidades y varias salidas abiertas. Te tranquiliza saber que todavía hay plan B.',escena:'una parte de ti sigue buscando otra opción incluso cuando ya escogiste.',costo:'Tantas puertas abiertas hacen más difícil cerrar una.',prueba:'Elige una opción y ponle una fecha de revisión en vez de mantenerlas todas vivas.'},
  Chou:{animal:'Buey',desc:'Abajo hay paciencia y resistencia. Puedes ir despacio durante mucho tiempo si sientes que el piso sigue firme.',escena:'aguantas procesos que a otra gente ya le habrían cansado la paciencia.',costo:'También aguantas etapas que ya pedían terminar.',prueba:'Ponle fecha de caducidad a una obligación que normalmente sostendrías por pura continuidad.'},
  Yin:{animal:'Tigre',desc:'Abajo hay arranque. Cuando algo prende, tu cuerpo quiere empezar antes de que todo esté perfectamente armado.',escena:'das el primer paso mientras los demás siguen definiendo quién lo debería dar.',costo:'El impulso llega antes que la estructura.',prueba:'Arranca, pero deja escrito cuál es el segundo paso antes de correr al tercero.'},
  Mao:{animal:'Conejo',desc:'Abajo hay un radar muy fino para el ambiente y para cómo se acomodan las personas entre sí.',escena:'mueves el tono de una conversación para que no explote innecesariamente.',costo:'Cuidar la armonía puede retrasar conversaciones que ya hacían falta.',prueba:'Di una cosa incómoda temprano, cuando todavía no necesita salir en forma de pleito.'},
  Chen:{animal:'Dragón',desc:'Abajo hay escala. Tu cabeza junta piezas grandes y distintas, y le cuesta tratar una transformación como si fuera poca cosa.',escena:'ves conexiones entre proyectos o problemas que otros mantienen separados.',costo:'Cuando todo parece importante, priorizar pesa.',prueba:'Escoge qué habitación vas a ordenar primero y deja las demás cerradas por una semana.'},
  Si:{animal:'Serpiente',desc:'Abajo hay observación y cálculo. Prefieres entender el momento antes de exponerte de más.',escena:'notas un detalle antes de moverte y eso suele ahorrarte un error.',costo:'Siempre parece razonable pensarlo un poquito más.',prueba:'Define antes de analizar qué dato sería suficiente para actuar.'},
  Wu:{animal:'Caballo',desc:'Pero abajo traes un motor que no se apaga. Necesitas movimiento, respuesta y sentir que algo está pasando.',escena:'cuando todo lleva demasiado tiempo igual, no lo sientes como descanso: empiezas a buscar qué mover.',costo:'La velocidad deja pendientes si la sostienes como estado permanente.',prueba:'Mete movimiento pequeño antes de necesitar un cambio enorme.'},
  Wei:{animal:'Cabra',desc:'Abajo hay atención al contexto y a los detalles que hacen que una experiencia funcione para todos.',escena:'te das cuenta de lo que falta para que un grupo o un proceso se sienta bien cuidado.',costo:'Atender todas las variables baja el volumen de tu propia prioridad.',prueba:'Antes de arreglar el contexto, nombra cuál era tu prioridad original.'},
  Shen:{animal:'Mono',desc:'Abajo hay ingenio y gusto por encontrar la vuelta. Lo complicado te prende más que lo obvio.',escena:'encuentras una herramienta, atajo o método que simplifica algo que venía atorado.',costo:'El último 20% pierde encanto cuando ya resolviste la parte interesante.',prueba:'Define el cierre antes de empezar a optimizar el camino.'},
  You:{animal:'Gallo',desc:'Abajo hay ojo crítico. Ves el detalle que descompone el conjunto y te cuesta fingir que no está ahí.',escena:'encuentras qué corregir incluso en algo que ya funciona bastante bien.',costo:'La mejora no tiene un final natural si tú no se lo pones.',prueba:'Haz una última pasada con límite de tiempo y luego suelta.'},
  Xu:{animal:'Perro',desc:'Abajo hay lealtad y sentido de compromiso. Cuando algo entra en la categoría de “esto importa”, cuesta dejarlo caer.',escena:'te quedas sosteniendo cuando la mayoría ya habría soltado.',costo:'La lealtad también amarra a estructuras que ya dieron todo lo que podían dar.',prueba:'Pregunta si sigues sosteniendo lo mismo por valor o por historia.'},
  Hai:{animal:'Cerdo',desc:'Abajo hay apertura. Das espacio, recibes a la gente y facilitas que una conversación empiece.',escena:'la gente te cuenta cosas rápido porque siente que hay lugar para hacerlo.',costo:'Dar tanto de entrada te deja menos margen del que calculabas.',prueba:'No abras toda la puerta de golpe: deja una parte de tu tiempo sin repartir.'}
};

var GANCHOS={
  'madera|madera':'Cuando algo te importa, crece por todos lados. El problema es escoger cuál rama sí seguir.',
  'madera|fuego':'Arrancas rápido y por dentro todavía quieres acelerar más.',
  'madera|tierra':'Quieres crecer, pero una parte de ti necesita saber que el piso no se va a mover.',
  'madera|metal':'Quieres avanzar, pero por dentro ya estás podando el camino antes de dar el paso.',
  'madera|agua':'Siempre estás buscando hacia dónde crecer, y por dentro ya viste tres rutas distintas.',
  'fuego|madera':'Te enciendes fácil porque por dentro siempre hay algo queriendo crecer.',
  'fuego|fuego':'No pasas desapercibido aunque quisieras. Traes fuego arriba y fuego abajo.',
  'fuego|tierra':'Haces que las cosas se muevan, pero por dentro necesitas que algo se quede firme.',
  'fuego|metal':'Prendes el ambiente y por dentro ya estás midiendo qué sí vale la pena.',
  'fuego|agua':'Por fuera das energía; por dentro nunca dejas de leer el cuarto.',
  'tierra|madera':'Sostienes lo que hay mientras una parte de ti ya está pensando qué debería crecer después.',
  'tierra|fuego':'Eres la parte estable de las cosas, y por dentro te estás muriendo de ganas de que algo pase.',
  'tierra|tierra':'Lo tuyo es sostener — y cuando algo depende de ti, te cuesta muchísimo soltarlo.',
  'tierra|metal':'Das estabilidad, pero por dentro ya estás decidiendo qué sobra.',
  'tierra|agua':'Pareces piso firme, pero por dentro nunca dejas de buscar otra salida.',
  'metal|madera':'Sabes cortar, pero por dentro siempre hay algo nuevo queriendo crecer.',
  'metal|fuego':'Decides rápido, y por dentro traes una urgencia que quiere resolver ya.',
  'metal|tierra':'Cortas claro porque por dentro necesitas que las cosas tengan piso.',
  'metal|metal':'Ves el punto de cierre antes que los demás, y te cuesta fingir que no.',
  'metal|agua':'Pones límites afuera mientras por dentro sigues viendo todas las opciones.',
  'agua|madera':'Conectas posibilidades y por dentro ya estás buscando cuál puede crecer.',
  'agua|fuego':'Lees todo lo que pasa, y por dentro traes más intensidad de la que muestras.',
  'agua|tierra':'Te adaptas a casi todo, pero por dentro necesitas algún punto fijo.',
  'agua|metal':'Ves muchas rutas, pero por dentro necesitas criterios para decidir cuál sí.',
  'agua|agua':'Tu cabeza rara vez se queda en una sola corriente. Incluso en calma, algo sigue moviéndose.'
};

function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function cap(x){x=String(x||'');return x?x.charAt(0).toUpperCase()+x.slice(1):'';}
function nombreTallo(t){var i=root.IDENTIDADES&&t&&root.IDENTIDADES[t.pinyin];return i?i.nombre:(t?cap(t.elemento)+' '+(t.yang?'Yang':'Yin'):'—');}
function nombreRama(r){return r?(RAMAS[r.pinyin]?RAMAS[r.pinyin].animal:cap(r.animal||r.pinyin)):'—';}
function polaridad(x){return x&&x.yang?'Yang':'Yin';}
function relacion(arriba,abajo){
  if(arriba===abajo)return'Lo que muestras y lo que traes abajo empujan hacia el mismo lado. Esa respuesta se vuelve muy disponible y también cuesta apagarla.';
  if(PRODUCE[abajo]===arriba)return'Lo que traes abajo alimenta justo lo que muestras arriba. Por eso este papel sale con facilidad y puede quedarse prendido más tiempo de la cuenta.';
  if(PRODUCE[arriba]===abajo)return'Lo que haces arriba termina alimentando lo que traes abajo. Mientras más usas una parte, más despiertas la otra.';
  if(CONTROLA[arriba]===abajo)return'La parte de arriba intenta mantener a raya lo que pasa abajo. Funciona, pero gasta más energía de la que se ve desde fuera.';
  if(CONTROLA[abajo]===arriba)return'Lo que traes abajo presiona la forma en que intentas responder arriba. Por eso esta zona puede sentirse más intensa de lo que parece desde fuera.';
  return'Las dos capas empujan distinto y te toca aprender cuándo dejar pasar a cada una.';
}
function formaDe(carta,tallo){
  try{if(!root.dinamicaMensualDeTallo)return null;var d=root.dinamicaMensualDeTallo(carta.diaMaestro,tallo);if(!d)return null;var c=root.TE_PERFIL_COPY&&root.TE_PERFIL_COPY[d.nombre];return{nombre:d.nombre,label:c&&c.etiqueta?c.etiqueta:d.nombre};}catch(e){return null;}
}
function ocultosDe(rama,carta){
  try{return(root.tallosOcultos?root.tallosOcultos(rama):[]).map(function(t){var f=formaDe(carta,t);return{tallo:t,forma:f};});}catch(e){return[];}
}
function crucesCore(key,lec){
  if(!lec||!lec.tensiones)return[];return lec.tensiones.filter(function(t){return t.entre&&t.entre.indexOf(key)!==-1;}).map(function(t){var otro=t.entre[0]===key?t.entre[1]:t.entre[0],z=ZONAS[otro];return{tipo:t.tipo==='choque'?'Roce':'Enlace',con:z?z.titulo:cap(otro),texto:t.texto};});
}
function crucesExtra(x){
  return(x&&x.interacciones||[]).map(function(i){return{tipo:i.tipo==='friccion'?'Roce':i.tipo==='enlace'?'Enlace':'Eco',con:i.titulo,texto:''};});
}
function tecnicoHTML(p,carta){
  var ocultos=ocultosDe(p.rama,carta),visible=formaDe(carta,p.tallo);
  return '<details class="copyPilarTecnico"><summary>¿De dónde sale esta lectura?</summary><div class="copyPilarMapa">'+
    '<div><small>LO QUE SE VE</small><strong>'+esc(nombreTallo(p.tallo))+'</strong><span>'+esc(cap(p.tallo.elemento)+' '+polaridad(p.tallo))+(visible?' · '+visible.label:'')+'</span></div>'+
    '<div><small>LO QUE EMPUJA POR DEBAJO</small><strong>'+esc(nombreRama(p.rama))+'</strong><span>'+esc(cap(p.rama.elemento)+' '+polaridad(p.rama))+'</span></div>'+
    '<div class="copyPilarOcultos"><small>CAPAS OCULTAS</small><div>'+((ocultos.length?ocultos.map(function(o){return'<span><b>'+esc(nombreTallo(o.tallo))+'</b>'+(o.forma?' · '+esc(o.forma.label):'')+'</span>';}).join(''):'<span>Sin capas adicionales</span>'))+'</div></div>'+
  '</div></details>';
}
function lecturaGenerica(key,p,carta,lec,extra){
  var z=ZONAS[key],ta=TALLOS[p.tallo.pinyin]||TALLOS.Wu,ra=RAMAS[p.rama.pinyin]||RAMAS.Wu;
  var hook=GANCHOS[p.tallo.elemento+'|'+p.rama.elemento]||'Por fuera respondes de una forma y por dentro hay otra cosa empujando.';
  var desc=ta.desc+' '+ra.desc+' '+relacion(p.tallo.elemento,p.rama.elemento);
  var como=z.como+' '+ta.escena+' '+cap(ra.escena);
  var costo=ta.costo+' '+ra.costo+' '+z.costo;
  var prueba=z.prueba+' '+ta.prueba+' '+ra.prueba;
  var cruces=extra?crucesExtra(p):crucesCore(key,lec);
  return{hook:hook,desc:desc,como:como,costo:costo,prueba:prueba,cruces:cruces};
}
function lecturaPilar(key,p,carta,lec,extra){
  if(key==='dia'&&p.tallo&&p.tallo.pinyin==='Wu'&&p.rama&&p.rama.pinyin==='Wu'){
    return{
      hook:'Eres la parte estable de las cosas, y por dentro te estás muriendo de ganas de que algo pase.',
      desc:'Te toca ser el piso: la gente se apoya en ti, tú respondes, tú sostienes. Y funciona, se te da. Pero abajo traes un motor que no se apaga, y por eso la calma que das afuera casi nunca la sientes adentro. Cuando llevas mucho tiempo sin que se mueva nada, no descansas: te desesperas.',
      como:'Terminas siendo quien resuelve, quien organiza, quien aguanta. Sales bien de ese papel — el problema es que nadie te pregunta si lo querías.',
      costo:'Sostienes cosas por responsabilidad mucho después de que ya te querías mover. Y aguantas tanto que para cuando por fin cambias algo, ya venías harto desde hace meses.',
      prueba:'No esperes a estar harto para mover una estructura. Cámbiale algo mientras todavía está funcionando: un horario, una persona, el orden de las cosas. Chiquito. Justo cuando todavía no hace falta.',
      cruces:crucesCore(key,lec)
    };
  }
  return lecturaGenerica(key,p,carta,lec,extra);
}
function cardHTML(key,p,carta,lec,extra){
  var z=ZONAS[key],l=lecturaPilar(key,p,carta,lec,extra),cruces=l.cruces||[];
  return '<article class="copyPilarPersonalizado">'+
    '<div class="copyPilarCab"><div><small>'+esc(z.kicker)+'</small><h3>'+esc(z.titulo)+'</h3></div><span>'+esc(nombreTallo(p.tallo))+' · '+esc(nombreRama(p.rama))+'</span></div>'+
    '<p class="copyPilarIntro">'+esc(z.intro)+'</p>'+
    '<div class="copyPilarLectura"><h4>'+esc(l.hook)+'</h4><p>'+esc(l.desc)+'</p></div>'+
    '<div class="copyPilarTres"><section><small>CÓMO SE NOTA</small><p>'+esc(l.como)+'</p></section><section><small>EL COSTO</small><p>'+esc(l.costo)+'</p></section><section><small>PRUEBA ESTO</small><p>'+esc(l.prueba)+'</p></section></div>'+
    (cruces.length?'<div class="copyPilarCruces"><small>ESTE PILAR TAMBIÉN SE CRUZA CON</small>'+cruces.map(function(c){return'<span><b>'+esc(c.tipo)+'</b> · '+esc(c.con)+'</span>';}).join('')+'</div>':'')+
    tecnicoHTML(p,carta)+
  '</article>';
}
function datos(){
  try{var qs=new URLSearchParams(location.search),id=qs.get('perfil');if(!id||!root.leerPerfil||!root.cartaDesdePerfil||!root.lecturaCompleta)return null;var perfil=root.leerPerfil(id);if(!perfil)return null;var carta=root.cartaDesdePerfil(perfil),sin=!!(perfil.nacimiento&&perfil.nacimiento.sinHora),lec=root.lecturaCompleta(carta,sin),a=root.analizarCartaProfunda?root.analizarCartaProfunda(carta,{sinHora:sin,nacimiento:perfil.nacimiento||{}}):null;return{perfil:perfil,carta:carta,sin:sin,lec:lec,a:a};}catch(e){return null;}
}
function render(){
  if(!/[?&]vista=pilares(?:&|$)/.test(location.search||''))return;
  var d=datos(),grid=document.querySelector('.cpPilares');if(!d||!grid)return;
  var firma=(d.perfil.id||'')+'|'+(d.carta.pilares.dia.nombre||'');if(grid.getAttribute('data-personalizado')===firma)return;
  var html='';
  ['anio','mes','dia'].concat(d.sin?[]:['hora']).forEach(function(k){html+=cardHTML(k,d.carta.pilares[k],d.carta,d.lec,false);});
  if(d.sin)html+='<article class="copyPilarPersonalizado copyPilarFaltante"><div class="copyPilarCab"><div><small>LO QUE VAS CONSTRUYENDO</small><h3>Tu futuro</h3></div><span>Falta la hora</span></div><p class="copyPilarIntro">La hora de nacimiento completa esta zona y permite leer cómo se combinan sus capas.</p></article>';
  if(d.a&&d.a.extras&&d.a.extras.brujula)html+=cardHTML('brujula',d.a.extras.brujula,d.carta,d.lec,true);else html+='<article class="copyPilarPersonalizado copyPilarFaltante"><div class="copyPilarCab"><div><small>LO QUE TE CONVIENE DESARROLLAR</small><h3>Tu brújula</h3></div><span>Falta la hora</span></div><p class="copyPilarIntro">Agrega la hora de nacimiento para calcular esta referencia.</p></article>';
  if(d.a&&d.a.extras&&d.a.extras.puntoPartida)html+=cardHTML('partida',d.a.extras.puntoPartida,d.carta,d.lec,true);
  grid.classList.add('copyV2PilaresPersonalizados');grid.innerHTML=html;grid.setAttribute('data-personalizado',firma);
  var enc=document.querySelector('.copyV2PilaresEncuadre');if(enc)enc.innerHTML='<strong>Los cuatro no son etapas de tu vida.</strong> Son cuatro zonas que traes activas al mismo tiempo. Ahora la lectura cruza lo que muestras, lo que empuja por debajo, las capas ocultas y la posición exacta donde aparecen.';
  var cab=document.querySelector('.cpCab>p:last-child');if(cab)cab.textContent='Primero te contamos qué zona mira cada pilar. Después viene lo importante: qué significa la combinación que te tocó justo ahí.';
}
var ocupado=false;
function programar(){if(ocupado)return;ocupado=true;setTimeout(function(){ocupado=false;render();},45);}
function iniciar(){render();if(document.body&&typeof MutationObserver!=='undefined')new MutationObserver(programar).observe(document.body,{childList:true,subtree:true});root.addEventListener&&root.addEventListener('popstate',programar);}
if(document.readyState==='complete')iniciar();else root.addEventListener('load',iniciar,{once:true});
})(typeof globalThis!=='undefined'?globalThis:this);
