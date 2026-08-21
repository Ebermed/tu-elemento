/** TU ELEMENTO — interfaz de la lectura mensual */
(function(){
  'use strict';

  if (faltantes({
    'acuarela.js':'PALETA_NEUTRA',
    'motor.js':'cuatroPilares',
    'traduccion.js':'IDENTIDADES',
    'base.js':'listarPerfiles',
    'lectura-mensual.js':'lecturaMensual'
  })) return;

  var perfiles=listarPerfiles();
  var perfil=null;
  var carta=null;
  var fechaVista=new Date();
  fechaVista=new Date(fechaVista.getFullYear(),fechaVista.getMonth(),15,12,0,0,0);

  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function cap(x){x=String(x||'');return x.charAt(0).toUpperCase()+x.slice(1);}
  function hash(s){var h=17;for(var i=0;i<String(s).length;i++)h=(h*31+String(s).charCodeAt(i))>>>0;return h;}
  function nombreMes(f){return MESES[f.getMonth()]+' '+f.getFullYear();}
  function etiquetaDM(c){return cap(c.diaMaestro.elemento)+' '+(c.diaMaestro.yang?'Yang':'Yin');}
  function etiquetaPilar(p){return cap(p.rama.animal)+' · '+cap(p.tallo.elemento)+' '+(p.tallo.yang?'Yang':'Yin');}
  function formaDinamica(d){return d.forma==='paralela'?'polaridad paralela':'polaridad cruzada';}

  function listaHTML(arr){return '<ul class="mesLista">'+arr.map(function(x){return '<li>'+esc(cap(x))+'</li>';}).join('')+'</ul>';}

  function pintarSelector(){
    var caja=$('#mesPerfilBox'),sel=$('#perfilMes');
    if(!perfiles.length){caja.hidden=true;return;}
    sel.innerHTML='';
    perfiles.forEach(function(p){var o=document.createElement('option');o.value=p.id;o.textContent=etiquetaPerfil(p);sel.appendChild(o);});
    caja.hidden=false;
  }

  function elegirInicial(){
    if(!perfiles.length)return null;
    var q=null;try{q=new URLSearchParams(location.search).get('perfil');}catch(e){}
    if(q){var porId=leerPerfil(q);if(porId)return porId;}
    return perfilPrincipal()||perfiles[0];
  }

  function mostrarSinCarta(){perfil=null;carta=null;$('#mesConCarta').hidden=true;$('#mesSinCarta').hidden=false;pintarFondo(PALETA_NEUTRA,91,1.05);}

  function aplicarPerfil(p){
    perfil=p;carta=cartaDesdePerfil(p);if(!carta){mostrarSinCarta();return;}
    $('#mesSinCarta').hidden=true;$('#mesConCarta').hidden=false;$('#perfilMes').value=p.id;
    var identidad=IDENTIDADES[carta.diaMaestro.pinyin];
    aplicarPaletaUI(identidad.paleta);pintarFondo(identidad.paleta,70+(hash(p.id)%83),1.02);
    $('#perfilMesMeta').textContent=identidad.nombre+' · '+etiquetaDM(carta)+' · '+(p.nacimiento.ciudad||'carta guardada');
    $('#verCartaMes').href='index.html?perfil='+encodeURIComponent(p.id);
    try{history.replaceState(null,'','?perfil='+encodeURIComponent(p.id));}catch(e){}
    pintarMes();
  }

  function pintarMes(){
    if(!carta||!perfil)return;
    var anio=fechaVista.getFullYear(),mes=fechaVista.getMonth()+1;
    var l=lecturaMensual(carta,{anio:anio,mes:mes,sinHora:!!perfil.nacimiento.sinHora});
    $('#mesTitulo').textContent=nombreMes(fechaVista);

    var dinamica=l.dinamicaPrincipal,ritmo=l.ritmo,id=IDENTIDADES[carta.diaMaestro.pinyin],nombreCarta=etiquetaPerfil(perfil);

    var h='<article class="vidrio mesHero">'+
      '<p class="mesEyebrow">'+esc(MESES[mes-1]+' '+anio+' · '+nombreCarta)+'</p>'+
      '<h2>'+esc(l.resumen.titulo)+'</h2>'+
      '<p class="mesPilar">'+esc(etiquetaPilar(l.pilar))+' · dinámica '+esc(dinamica.nombre)+'</p>'+
      '<div class="mesEtapaWrap">'+
        '<p class="mesEtapaRot">Tu ritmo del mes</p>'+
        '<p class="mesEtapa">'+esc(ritmo.nombre)+'</p>'+
        '<p class="mesEtapaTitular">'+esc(ritmo.titular)+'</p>'+
        '<p class="mesIntro">'+esc(ritmo.lectura)+' '+esc(dinamica.matiz)+'</p>'+
      '</div></article>';

    h+='<section class="mesSeccion">'+
      '<p class="mesClave">Dinámica del mes</p>'+
      '<h3>'+esc(dinamica.nombre)+' · '+esc(l.area.titulo)+'</h3>'+
      '<p>'+esc(dinamica.matiz)+'</p>'+
      '<p class="mesSub">La relación elemental del tallo mensual con tu '+esc(id.nombre)+' pone atención en '+esc(l.area.tema)+'.</p>'+
    '</section>';

    h+='<section class="mesSeccion">'+
      '<p class="mesClave">Tu foco del mes</p>'+
      '<h3>'+esc(cap(ritmo.verbo))+' con '+esc(l.area.titulo.toLowerCase())+'</h3>'+
      '<p class="mesFoco">'+esc(cap(l.resumen.foco))+'</p>'+
    '</section>';

    h+='<div class="mesDos">'+
      '<section class="mesSeccion"><p class="mesClave">Puede moverse</p><h3>Lo que puede aparecer</h3>'+listaHTML(l.resumen.puede)+'</section>'+
      '<section class="mesSeccion"><p class="mesClave">Para trabajar</p><h3>Cómo aprovecharlo</h3>'+listaHTML(l.resumen.trabajar)+'</section>'+
    '</div>';

    h+='<section class="mesSeccion"><p class="mesClave">Pon atención a</p><h3>El costo del mes</h3><p>'+esc(l.resumen.atencion)+'</p><p class="mesSub">Usa el ritmo como referencia para decidir dónde poner energía y dónde guardar margen.</p></section>';

    h+='<section class="mesSeccion"><p class="mesClave">Dónde se siente</p><h3>El mes frente a tus pilares</h3>';
    if(l.interacciones.length){
      l.interacciones.forEach(function(x){h+='<div class="mesInter"><b>'+esc(x.titulo)+'</b><span>'+esc(x.tipo)+'</span><p>'+esc(x.texto)+'</p></div>';});
    }else{
      h+='<p>El peso principal de este mes queda en la dinámica '+esc(dinamica.nombre)+' y en el ritmo '+esc(ritmo.nombre)+'. Tus cuatro ramas natales aportan un fondo más estable durante este tramo.</p>';
    }
    h+='</section>';

    h+='<details class="mesTecnico"><summary>¿Cómo salió esta lectura?</summary><div class="mesSeccion">'+
      '<p><strong>Día Maestro:</strong> '+esc(carta.diaMaestro.pinyin)+' · '+esc(etiquetaDM(carta))+' · '+esc(id.nombre)+'.</p>'+
      '<p><strong>Pilar solar del mes:</strong> '+esc(l.pilar.nombre)+' · '+esc(etiquetaPilar(l.pilar))+'.</p>'+
      '<p><strong>Dinámica principal:</strong> '+esc(dinamica.nombre)+' · '+esc(formaDinamica(dinamica))+'.</p>'+
      '<p><strong>Ritmo del ciclo:</strong> '+esc(ritmo.nombre)+' · posición '+esc(ritmo.indice+1)+' de 12.</p>'+
      '<p><strong>Corrientes secundarias de '+esc(cap(l.pilar.rama.animal))+':</strong></p>';

    l.dinamicasSecundarias.forEach(function(d){
      h+='<div class="mesPerfilFila"><div><span class="mesPerfilCodigo">'+esc(d.nombre.slice(0,2).toUpperCase())+'</span></div><div><b>'+esc(d.nombre)+'</b><small>'+esc(d.tallo.pinyin)+' · '+esc(cap(d.tallo.elemento))+' '+(d.tallo.yang?'Yang':'Yin')+' · '+esc(formaDinamica(d))+'</small></div></div>';
    });

    h+='<p class="mesNota">Las dinámicas y los doce ritmos son nombres editoriales propios de Tu Elemento. La base matemática compara elementos, polaridades, tallos y ramas; la lectura los convierte en lenguaje cotidiano para organizar la reflexión del mes.</p></div></details>';

    var caja=$('#mesContenido');caja.classList.remove('mesEntrada');caja.innerHTML=h;void caja.offsetWidth;caja.classList.add('mesEntrada');
  }

  function moverMes(n){fechaVista=new Date(fechaVista.getFullYear(),fechaVista.getMonth()+n,15,12,0,0,0);pintarMes();}
  function volverHoy(){var h=new Date();fechaVista=new Date(h.getFullYear(),h.getMonth(),15,12,0,0,0);pintarMes();}

  pintarSelector();if(!perfiles.length){mostrarSinCarta();return;}
  $('#perfilMes').addEventListener('change',function(){var p=leerPerfil(this.value);if(p)aplicarPerfil(p);});
  $('#mesAnt').addEventListener('click',function(){moverMes(-1);});$('#mesSig').addEventListener('click',function(){moverMes(1);});$('#mesHoy').addEventListener('click',volverHoy);
  document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')moverMes(-1);else if(e.key==='ArrowRight')moverMes(1);});
  (function(){var x0=null,z=$('#mesConCarta');z.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});z.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>60)moverMes(dx<0?1:-1);x0=null;},{passive:true});})();
  aplicarPerfil(elegirInicial());
})();
