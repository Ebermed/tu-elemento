/** TU ELEMENTO — Buscar una fecha · Artx 1.1.1
 *
 * Esta vista reutiliza evaluarDia(): ritmo de 12 pasos + pulso de 28 días
 * + fricciones temporales/personales. La clasificación por actividad vive
 * aquí para mantener intacto el calendario diario estable.
 */
(function(){
  'use strict';

  var vBuscar=document.getElementById('vBuscar');
  var caja=document.getElementById('buscarCaja');
  if(!vBuscar||!caja||typeof evaluarDia!=='function')return;

  var MESES_B=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var DOW_B=['d','l','m','m','j','v','s'];
  var ANIMALES_B=['rata','buey','tigre','conejo','dragón','serpiente','caballo','cabra','mono','gallo','perro','cerdo'];
  var anioVista=(new Date()).getFullYear();
  var actividadId='finanzas';
  var personaFuente='auto';
  var signoIndice=0;
  var activo=false;
  var renderToken=0;
  var cache=Object.create(null);
  var fechaSeleccionada='';

  /* Taxonomía editorial propia. Las claves solo sirven para agrupar las
     recomendaciones ya producidas por los dos ciclos del calendario. */
  var ACTIVIDADES=[
    {id:'finanzas',nombre:'Dinero y finanzas',ayuda:'Pagos, presupuesto, ventas, compras planeadas y decisiones de recursos.',claves:['cobr','pago','presupuesto','venta','vender','compra','comprar','precio','dinero','compens','recurso','metric','ganancia','financier','inventario']},
    {id:'cobrar',nombre:'Cobrar o recibir un pago',ayuda:'Cobros pendientes, compensaciones, pagos y entradas de dinero.',claves:['cobr','pago','compens','ganancia','venta','recibir']},
    {id:'comprar',nombre:'Hacer una compra importante',ayuda:'Compras planeadas, comparación de precios y uso de presupuesto.',claves:['compra','comprar','precio','presupuesto','inventario','adquir']},
    {id:'acuerdo',nombre:'Firmar o negociar un acuerdo',ayuda:'Contratos, condiciones, propuestas, permisos y negociación.',claves:['acuerdo','firmar','negoci','condicion','permiso','propuesta','terminos']},
    {id:'lanzar',nombre:'Lanzar, publicar o presentar',ayuda:'Presentaciones, publicaciones, campañas, convocatorias y visibilidad.',claves:['lanzamiento','publicar','presentacion','campana','inscripcion','convocar','mostrar','visibilidad']},
    {id:'proyecto',nombre:'Iniciar o mover un proyecto',ayuda:'Primeras reuniones, líneas de trabajo, proyectos y ejecución.',claves:['proyecto','primera reunion','linea de trabajo','retomar una tarea','ejecut','iniciar','empezar']},
    {id:'puesto',nombre:'Asumir más responsabilidad',ayuda:'Promociones, nuevas responsabilidades, coordinación y trabajo.',claves:['promocion','responsabilidad','trabajo','equipo','propuesta','coordinar']},
    {id:'estudio',nombre:'Estudiar o iniciar un curso',ayuda:'Estudio, investigación, escritura, cursos y preparación intelectual.',claves:['estudi','curso','investig','escribir','estrateg','aprend']},
    {id:'viaje',nombre:'Viajar',ayuda:'Traslados y viajes que conviene iniciar con margen.',claves:['viaj']},
    {id:'negociar',nombre:'Pedir apoyo o negociar',ayuda:'Apoyos, permisos, colaboración y conversaciones donde buscas acuerdo.',claves:['negoci','acuerdo','condicion','permiso','apoyo','colabor']},
    {id:'social',nombre:'Reunirte y conectar con gente',ayuda:'Networking, reuniones, celebraciones, convocatorias y colaboración.',claves:['network','conocer gente','reunir al equipo','convocar','celebr','colabor','reunion']},
    {id:'cerrar',nombre:'Cerrar, cancelar o depurar',ayuda:'Terminar pendientes, recortar, cancelar y cerrar ciclos prácticos.',claves:['cerrar','cancel','depur','recort','terminar','desinstal','pendiente','vaciar']}
  ];

  function q(s,r){return(r||document).querySelector(s);}
  function qa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function norm(x){return String(x||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function cap(x){x=String(x||'');return x.charAt(0).toUpperCase()+x.slice(1);}
  function actividadActual(){for(var i=0;i<ACTIVIDADES.length;i++)if(ACTIVIDADES[i].id===actividadId)return ACTIVIDADES[i];return ACTIVIDADES[0];}
  function perfilId(){var s=q('#perfilCal');return s&&s.value?s.value:'';}
  function perfiles(){try{return typeof listarPerfiles==='function'?listarPerfiles():[];}catch(e){return[];}}
  function animalDeIndice(i){return ANIMALES_B[((Number(i)||0)%12+12)%12];}

  function fuenteInicial(){
    if(personaFuente!=='auto')return personaFuente;
    var id=perfilId();
    return id?'perfil:'+id:'general';
  }

  function natalActual(){
    var fuente=personaFuente==='auto'?fuenteInicial():personaFuente;
    if(fuente==='signo')return{ramaAnio:signoIndice,soloSigno:true,signo:animalDeIndice(signoIndice)};
    if(fuente.indexOf('perfil:')===0&&typeof leerPerfil==='function'&&typeof cartaDesdePerfil==='function'){
      try{
        var id=fuente.slice(7),p=leerPerfil(id),c=p?cartaDesdePerfil(p):null;
        if(!c||typeof RAMAS==='undefined')return null;
        return{ramaAnio:RAMAS.indexOf(c.pilares.anio.rama),perfil:p,carta:c};
      }catch(e){return null;}
    }
    return null;
  }
  function claveNatal(n){return n&&isFinite(n.ramaAnio)?'r'+n.ramaAnio:'general';}
  function claveFecha(y,m,d,n){return claveNatal(n)+'|'+y+'-'+m+'-'+d;}
  function evalCache(y,m,d,n){
    var k=claveFecha(y,m,d,n);
    if(cache[k])return cache[k];
    cache[k]=evaluarDia({anio:y,mes:m,dia:d},n?{ramaAnio:n.ramaAnio}:null);
    return cache[k];
  }

  function listaUnica(a){
    var out=[],seen=Object.create(null);
    (a||[]).forEach(function(x){var k=norm(x);if(!k||seen[k])return;seen[k]=1;out.push(String(x));});
    return out;
  }
  function textosPos(d){return listaUnica([].concat(d.recomendadoPara||[],d.ritmo12&&d.ritmo12.bueno||[],d.pulso28&&d.pulso28.bueno||[]));}
  function textosNeg(d){return listaUnica([].concat(d.dejarParaLuego||[],d.ritmo12&&d.ritmo12.posponer||[],d.pulso28&&d.pulso28.posponer||[]));}
  function coincide(txt,claves){var t=norm(txt);for(var i=0;i<claves.length;i++)if(t.indexOf(norm(claves[i]))!==-1)return true;return false;}
  function filtrar(arr,claves){return(arr||[]).filter(function(x){return coincide(x,claves);});}

  function clasificar(d,act){
    var fav=filtrar(textosPos(d),act.claves);
    var caut=filtrar(textosNeg(d),act.claves);
    var avisos=d.avisos||[];
    var friccionAlta=avisos.some(function(a){return a&&a.nivel==='alto';});
    var friccionPersonal=avisos.some(function(a){return a&&a.nivel==='alto'&&/tu|signo|personal|origen/i.test(a.motivo||'');});
    var estado='neutral';

    /* Primero se filtran las fricciones fuertes. Después se mira si los
       dos ritmos apoyan o piden margen para la actividad elegida. */
    if(friccionPersonal||d.puntaje<=22||(friccionAlta&&caut.length))estado='mover';
    else if(caut.length&&(!fav.length||d.puntaje<55||caut.length>fav.length))estado='mover';
    else if(fav.length&&d.puntaje>=55&&!friccionAlta)estado='bueno';
    else if(fav.length>=2&&d.puntaje>=45)estado='bueno';

    return{estado:estado,favor:fav,cautela:caut,avisos:avisos};
  }

  function opcionesPersona(){
    var ps=perfiles(),h='';
    ps.forEach(function(p){
      var etiqueta=p.tipo==='yo'?'Tu carta':(p.nombre||'Carta guardada');
      h+='<option value="perfil:'+esc(p.id)+'"'+(personaFuente==='perfil:'+p.id?' selected':'')+'>'+esc(etiqueta)+'</option>';
    });
    h+='<option value="signo"'+(personaFuente==='signo'?' selected':'')+'>Solo conozco su signo</option>';
    h+='<option value="general"'+(personaFuente==='general'?' selected':'')+'>Lectura general</option>';
    return h;
  }
  function opcionesSigno(){
    return ANIMALES_B.map(function(a,i){return'<option value="'+i+'"'+(i===signoIndice?' selected':'')+'>'+cap(a)+'</option>';}).join('');
  }

  function htmlPanel(){
    var opts=ACTIVIDADES.map(function(a){return'<option value="'+a.id+'"'+(a.id===actividadId?' selected':'')+'>'+esc(a.nombre)+'</option>';}).join('');
    return '<section class="buscarPanel">'+
      '<h2>Busca una fecha</h2>'+
      '<p class="sub">Elige a quién va dirigida la búsqueda, la actividad y el año.</p>'+
      '<div class="buscarCampo buscarPersonaCampo"><label for="buscarPersonaFuente">¿Para quién buscas?</label><select id="buscarPersonaFuente">'+opcionesPersona()+'</select></div>'+
      '<div class="buscarCampo buscarSignoCampo" id="buscarSignoCampo"'+(personaFuente==='signo'?'':' hidden')+'><label for="buscarSigno">Signo del año</label><select id="buscarSigno">'+opcionesSigno()+'</select><p class="buscarActividadAyuda">Esta búsqueda usa ese signo como Tu origen durante el cálculo.</p></div>'+
      '<div class="buscarCampo"><label for="buscarActividad">Actividad</label><select id="buscarActividad">'+opts+'</select><p class="buscarActividadAyuda" id="buscarActividadAyuda"></p></div>'+
      '<div class="buscarAnio"><button type="button" id="buscarAnioAnt" aria-label="Año anterior">‹</button><div class="buscarAnioCentro"><strong id="buscarAnioTitulo">'+anioVista+'</strong><button type="button" id="buscarEsteAnio">este año</button></div><button type="button" id="buscarAnioSig" aria-label="Año siguiente">›</button></div>'+
      '<div class="buscarPerfilEstado" id="buscarPerfilEstado"></div>'+
      '</section>'+
      '<div class="buscarResumen"><div class="buenos"><b id="buscarBuenos">0</b><span>Buen encaje</span></div><div class="mover"><b id="buscarMover">0</b><span>Mejor moverlo</span></div></div>'+
      '<div class="buscarLeyenda"><span class="bueno"><i></i> Buen encaje</span><span class="mover"><i></i> Mejor moverlo</span><span><i></i> Neutral</span></div>'+
      '<p class="buscarProgreso" id="buscarProgreso"></p>'+
      '<div class="buscarMeses" id="buscarMeses"></div>'+
      '<aside class="buscarDetalle" id="buscarDetalle" hidden></aside>';
  }

  function actualizarPersonaUI(){
    var campo=q('#buscarSignoCampo');
    if(campo)campo.hidden=personaFuente!=='signo';
    pintarPerfilEstado();
  }
  function pintarPerfilEstado(){
    var e=q('#buscarPerfilEstado');if(!e)return;
    var n=natalActual();
    if(n&&n.soloSigno){
      e.innerHTML='<span>La búsqueda usa únicamente el signo del año: <strong>'+esc(cap(n.signo))+'</strong>. Así puedes afinar fechas para alguien aunque su carta esté fuera de la app.</span>';
    }else if(n&&n.perfil&&n.carta){
      var nom=n.perfil.tipo==='yo'?'tu carta':(n.perfil.nombre||'esta carta');
      e.innerHTML='<span>La búsqueda está personalizada para <strong>'+esc(nom)+'</strong> y cruza cada fecha con Tu origen: '+esc(n.carta.pilares.anio.rama.animal)+'.</span>';
    }else{
      e.innerHTML='<span>Lectura general. También puedes elegir una carta guardada o usar únicamente el signo del año de otra persona.</span>';
    }
  }
  function actualizarAyuda(){var a=actividadActual(),p=q('#buscarActividadAyuda');if(p)p.textContent=a.ayuda;}

  function shellMes(m){
    var primero=new Date(anioVista,m,1),arr=primero.getDay(),dias=new Date(anioVista,m+1,0).getDate();
    var h='<article class="buscarMes" data-m="'+m+'"><h3>'+MESES_B[m]+'</h3><div class="buscarRejilla">';
    DOW_B.forEach(function(x){h+='<div class="buscarDow">'+x+'</div>';});
    for(var i=0;i<arr;i++)h+='<span></span>';
    for(var d=1;d<=dias;d++)h+='<button type="button" class="buscarDia" data-fecha="'+anioVista+'-'+(m+1)+'-'+d+'" aria-busy="true" aria-label="'+d+' de '+MESES_B[m]+'">'+d+'</button>';
    return h+'</div></article>';
  }
  function construirShell(){
    var g=q('#buscarMeses');if(!g)return;
    var h='';for(var m=0;m<12;m++)h+=shellMes(m);g.innerHTML=h;
  }

  function ceder(){return new Promise(function(resolve){
    if(typeof requestIdleCallback==='function')requestIdleCallback(function(){resolve();},{timeout:70});
    else setTimeout(resolve,0);
  });}

  async function renderAnio(){
    var token=++renderToken;
    fechaSeleccionada='';
    var detalle=q('#buscarDetalle');if(detalle)detalle.hidden=true;
    q('#buscarAnioTitulo').textContent=anioVista;
    construirShell();actualizarPersonaUI();actualizarAyuda();
    var prog=q('#buscarProgreso');
    var b=0,mv=0;
    q('#buscarBuenos').textContent='0';q('#buscarMover').textContent='0';
    var act=actividadActual(),n=natalActual(),hoy=new Date();

    for(var mes=0;mes<12;mes++){
      if(token!==renderToken)return;
      if(prog)prog.innerHTML='<i></i>Revisando '+MESES_B[mes]+'…';
      await ceder();
      if(token!==renderToken)return;
      var dias=new Date(anioVista,mes+1,0).getDate();
      for(var dia=1;dia<=dias;dia++){
        var d=evalCache(anioVista,mes+1,dia,n);
        var cl=clasificar(d,act);
        var btn=q('[data-fecha="'+anioVista+'-'+(mes+1)+'-'+dia+'"]',q('#buscarMeses'));
        if(!btn)continue;
        btn.removeAttribute('aria-busy');
        btn.classList.toggle('buen-encaje',cl.estado==='bueno');
        btn.classList.toggle('mejor-mover',cl.estado==='mover');
        if(cl.estado==='bueno')b++;else if(cl.estado==='mover')mv++;
        if(hoy.getFullYear()===anioVista&&hoy.getMonth()===mes&&hoy.getDate()===dia)btn.classList.add('hoy');
        btn.setAttribute('aria-label',dia+' de '+MESES_B[mes]+'. '+(cl.estado==='bueno'?'Buen encaje':cl.estado==='mover'?'Mejor moverlo':'Neutral')+' para '+act.nombre.toLowerCase());
      }
      q('#buscarBuenos').textContent=b;q('#buscarMover').textContent=mv;
    }
    if(prog)prog.textContent='Toca cualquier fecha marcada para ver qué señales pesaron en el resultado.';
  }

  function fechaHumana(y,m,d){return d+' de '+MESES_B[m-1]+' de '+y;}
  function detalleFecha(y,m,d){
    var n=natalActual(),ev=evalCache(y,m,d,n),act=actividadActual(),cl=clasificar(ev,act),box=q('#buscarDetalle');
    if(!box)return;
    qa('.buscarDia.seleccionado').forEach(function(x){x.classList.remove('seleccionado');});
    var btn=q('[data-fecha="'+y+'-'+m+'-'+d+'"]');if(btn)btn.classList.add('seleccionado');
    fechaSeleccionada=y+'-'+m+'-'+d;
    var estado=cl.estado==='bueno'?'Buen encaje':cl.estado==='mover'?'Mejor moverlo':'Día neutral';
    var cls=cl.estado==='bueno'?'bueno':cl.estado==='mover'?'mover':'';
    var razones=[];
    if(cl.favor.length)razones.push('<li><b>A favor:</b> '+esc(cl.favor.slice(0,3).join(' · '))+'</li>');
    if(cl.cautela.length)razones.push('<li><b>Pide margen:</b> '+esc(cl.cautela.slice(0,3).join(' · '))+'</li>');
    if(cl.avisos.length)razones.push('<li><b>Contexto:</b> '+esc(cl.avisos.slice(0,2).map(function(a){return a.motivo;}).join(' · '))+'</li>');
    razones.push('<li><b>Ritmos del día:</b> '+esc(ev.ritmo12.nombre)+' · '+esc(ev.pulso28.nombre)+'</li>');
    if(n&&n.soloSigno)razones.push('<li><b>Personalización:</b> signo del año '+esc(cap(n.signo))+'</li>');
    box.innerHTML='<div class="buscarDetalleCab"><div><h3 class="buscarDetalleFecha">'+esc(fechaHumana(y,m,d))+'</h3><span class="buscarDetalleEstado '+cls+'">'+estado+'</span></div><button class="buscarDetalleCerrar" type="button" aria-label="Cerrar detalle">×</button></div>'+
      '<p>Para <strong>'+esc(act.nombre.toLowerCase())+'</strong>, esta fecha reúne las siguientes señales:</p><ul class="buscarEvidencia">'+razones.join('')+'</ul>';
    box.hidden=false;
  }

  function entrar(){
    activo=true;
    personaFuente=fuenteInicial();
    var pantalla=q('#p-dias');if(pantalla)pantalla.classList.add('buscarVistaActiva');
    var h1=q('#p-dias>h1');if(h1)h1.textContent='¿Cuándo te conviene?';
    q('#diaCaja').hidden=true;q('#mesCaja').hidden=true;q('#navDia').hidden=true;q('#navMes').hidden=true;
    caja.hidden=false;
    q('#vDia').setAttribute('aria-pressed','false');q('#vMes').setAttribute('aria-pressed','false');vBuscar.setAttribute('aria-pressed','true');
    var cv=q('.cambiaVista');if(cv)cv.classList.add('buscar-activo');
    if(!caja.dataset.iniciado){caja.innerHTML=htmlPanel();caja.dataset.iniciado='1';instalarEventosInternos();}
    else{
      var persona=q('#buscarPersonaFuente');if(persona)persona.value=personaFuente;
      actualizarPersonaUI();
    }
    renderAnio();
  }
  function salir(){
    if(!activo)return;
    activo=false;++renderToken;caja.hidden=true;vBuscar.setAttribute('aria-pressed','false');
    var pantalla=q('#p-dias');if(pantalla)pantalla.classList.remove('buscarVistaActiva');
    var cv=q('.cambiaVista');if(cv)cv.classList.remove('buscar-activo');
    var h1=q('#p-dias>h1');if(h1)h1.textContent='¿Cómo viene el día?';
  }

  function instalarEventosInternos(){
    q('#buscarPersonaFuente').addEventListener('change',function(){personaFuente=this.value;actualizarPersonaUI();renderAnio();});
    q('#buscarSigno').addEventListener('change',function(){signoIndice=parseInt(this.value,10)||0;if(personaFuente==='signo')renderAnio();});
    q('#buscarActividad').addEventListener('change',function(){actividadId=this.value;actualizarAyuda();renderAnio();});
    q('#buscarAnioAnt').addEventListener('click',function(){anioVista--;renderAnio();});
    q('#buscarAnioSig').addEventListener('click',function(){anioVista++;renderAnio();});
    q('#buscarEsteAnio').addEventListener('click',function(){anioVista=(new Date()).getFullYear();renderAnio();});
    q('#buscarMeses').addEventListener('click',function(e){
      var b=e.target.closest&&e.target.closest('.buscarDia');if(!b)return;
      var p=b.getAttribute('data-fecha').split('-').map(Number);detalleFecha(p[0],p[1],p[2]);
    });
    caja.addEventListener('click',function(e){var c=e.target.closest&&e.target.closest('.buscarDetalleCerrar');if(c){q('#buscarDetalle').hidden=true;qa('.buscarDia.seleccionado').forEach(function(x){x.classList.remove('seleccionado');});fechaSeleccionada='';}});
  }

  /* Tercera pestaña dentro del segmented control del calendario. */
  var vistas=q('.cambiaVista');if(vistas)vistas.classList.add('teTresVistas');
  vBuscar.addEventListener('click',entrar);
  q('#vDia').addEventListener('click',salir);
  q('#vMes').addEventListener('click',salir);
  var perfil=q('#perfilCal');if(perfil)perfil.addEventListener('change',function(){if(personaFuente==='auto')personaFuente='perfil:'+this.value;if(activo&&personaFuente.indexOf('perfil:')===0){personaFuente='perfil:'+this.value;var s=q('#buscarPersonaFuente');if(s)s.value=personaFuente;renderAnio();}});

  /* Expuesto solo para tests/manual QA sin acoplarlo al motor principal. */
  globalThis.TE_BUSCADOR_FECHAS={actividades:ACTIVIDADES,clasificar:clasificar};
})();