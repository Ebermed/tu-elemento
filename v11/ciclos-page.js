/** TU ELEMENTO V2 BROADWAY — ciclos de diez años */
(function(){
  'use strict';
  if(typeof document==='undefined')return;
  var caja=document.getElementById('ciclosContenido'),selector=document.getElementById('perfilCiclos'),selectorBox=document.getElementById('ciclosPerfil');
  if(!caja||typeof listarPerfiles!=='function'||typeof cartaDesdePerfil!=='function'||typeof decadas!=='function')return;

  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function cap(x){x=String(x||'');return x.charAt(0).toUpperCase()+x.slice(1);}
  function qPerfil(){try{return new URLSearchParams(location.search).get('perfil')||'';}catch(e){return'';}}
  function perfiles(){try{return listarPerfiles()||[];}catch(e){return[];}}
  function etiqueta(p){return p.tipo==='yo'?'Tu carta':(p.nombre||'Carta guardada');}

  var ps=perfiles();
  if(!ps.length){
    selectorBox.hidden=true;
    caja.innerHTML='<section class="ciclosVacio"><h2>Primero necesitamos una carta</h2><p>Los ciclos se calculan desde tu carta natal y el sexo registrado al nacer.</p><div class="acciones"><a class="btn" href="../nueva.html">Crear una carta</a><a class="btn fantasma" href="../index.html">Volver al inicio</a></div></section>';
    if(typeof pintarFondo==='function')pintarFondo(PALETA_NEUTRA,142,1.04);
    return;
  }

  selector.innerHTML=ps.map(function(p){return'<option value="'+esc(p.id)+'">'+esc(etiqueta(p))+'</option>';}).join('');
  var inicial=qPerfil();
  if(!inicial&&globalThis.TE_ECOSISTEMA&&TE_ECOSISTEMA.perfilActivo)inicial=TE_ECOSISTEMA.perfilActivo();
  if(!inicial||!ps.some(function(p){return p.id===inicial;}))inicial=(typeof perfilPrincipal==='function'&&perfilPrincipal()?perfilPrincipal().id:ps[0].id);
  selector.value=inicial;

  function pintar(id){
    var p=leerPerfil(id);if(!p)return;
    if(globalThis.TE_ECOSISTEMA&&TE_ECOSISTEMA.setPerfilActivo)TE_ECOSISTEMA.setPerfilActivo(id);
    try{history.replaceState(null,'','?perfil='+encodeURIComponent(id));}catch(e){}
    var c=cartaDesdePerfil(p);if(!c)return;
    var identidad=globalThis.IDENTIDADES?IDENTIDADES[c.diaMaestro.pinyin]:null;
    if(identidad&&typeof aplicarPaletaUI==='function')aplicarPaletaUI(identidad.paleta);
    if(typeof pintarFondo==='function')pintarFondo(identidad?identidad.paleta:PALETA_NEUTRA,146+(id.length%19),1.04);

    var n=p.nacimiento||{};
    if(!n.sexo){
      caja.innerHTML='<section class="ciclosVacio"><h2>Falta un dato para esta secuencia</h2><p>Los ciclos de diez años usan el sexo registrado al nacer para definir la dirección del recorrido. Puedes abrir esta carta y completar ese dato.</p><div class="acciones"><a class="btn" href="../carta.html?perfil='+encodeURIComponent(id)+'">Abrir esta carta</a></div></section>';
      return;
    }

    var d=decadas(c,n.sexo,9),edad=edadHoy(n.anio,n.mes,n.dia),actual=decadaActual(d,edad),t=traducir(c);
    var h='<section class="ciclosResumen"><p class="mini">'+esc(etiqueta(p))+' · '+esc(t.tarjeta.nombre)+'</p><h2>Tu recorrido de diez años</h2><p>Esta secuencia empieza alrededor de los '+d.edadInicio+' años. Hoy tienes '+edad+' años y el tramo activo aparece resaltado.</p></section><ul class="ciclosLista">';
    d.lista.forEach(function(x,i){
      var an=globalThis.ANIMALES&&ANIMALES[x.rama.pinyin]?ANIMALES[x.rama.pinyin]:null;
      var idn=globalThis.IDENTIDADES&&IDENTIDADES[x.tallo.pinyin]?IDENTIDADES[x.tallo.pinyin]:null;
      var es=i===actual;
      h+='<li class="cicloItem'+(es?' actual':'')+'"><div class="cicloEdad">'+x.desde+'<small>a '+x.hasta+'</small></div><div>'+(es?'<span class="cicloSello">Aquí andas</span>':'')+'<p class="cicloCab">'+esc(an?an.nombre:cap(x.animal))+' de '+esc(x.elemento)+(idn?' <em>· '+esc(idn.nombre)+'</em>':'')+(x.enVacio?'<span class="cicloVac">vacío</span>':'')+'</p>'+(es&&an?'<p class="cicloTexto">'+esc(an.movimiento)+'</p><p class="cicloTexto cicloTension">'+esc(an.tension)+'</p>':'<p class="cicloTexto">'+esc(an?an.frase:'Un tramo distinto dentro de la secuencia de tu carta.')+'</p>')+'</div></li>';
    });
    h+='</ul>';
    caja.innerHTML=h;
  }

  selector.addEventListener('change',function(){pintar(this.value);});
  pintar(inicial);
})();
