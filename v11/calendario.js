(function () {
  'use strict';

  if (faltantes({
    'acuarela.js':'fondoAcuarela',
    'zonas.js':'utcDesdeLocal',
    'motor.js':'cuatroPilares',
    'traduccion.js':'IDENTIDADES',
    'reglas.js':'evaluarDia',
    'base.js':'listarPerfiles'
  })) return;

  var diaVisto = null;
  var mesVisto = null;
  var enMes = false;
  var perfilActivo = null;
  var mia = null;

  function esc(x) {
    return String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function iconoMini(tipo) {
    var path = {
      madera:'M11 19c0-5 3-9 5-12 2 3 5 7 5 12M16 11c-2 0-4-1-5-3',
      fuego:'M14 20c0-4 5-5 5-9 0-3-2-5-4-7 0 3-2 4-4 6-2 2-3 4-3 7 0 4 3 7 6 7s5-2 5-4z',
      tierra:'M5 17 12 7l7 10H5z',
      metal:'M12 4l7 7-7 9-7-9 7-7z',
      agua:'M12 4c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z'
    };
    return '<span class="iconito" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="' + (path[tipo] || path.tierra) + '"/></svg></span>';
  }

  function resumenPerfil(p) {
    try {
      var carta = cartaDesdePerfil(p);
      if (!carta) return null;
      return { carta:carta, t:traducir(carta) };
    } catch (e) { return null; }
  }

  function pintarSelectorPerfiles() {
    var perfiles = listarPerfiles();
    var box = $('#calPerfilBox');
    var general = $('#calSinPerfil');
    var sel = $('#perfilCal');
    box.hidden = perfiles.length === 0;
    general.hidden = perfiles.length > 0;

    var html = '';
    perfiles.forEach(function (p) {
      var r = resumenPerfil(p);
      if (!r) return;
      var nombre = p.tipo === 'yo' ? 'Tu carta' : p.nombre;
      html += '<option value="' + esc(p.id) + '">' + esc(nombre) + ' · ' + esc(r.t.tarjeta.nombre) + '</option>';
    });
    sel.innerHTML = html;
    if (perfilActivo) sel.value = perfilActivo.id;

    $('#olvidar').hidden = !perfilActivo;
    $('#verCartaPerfil').hidden = !perfilActivo;
    if (perfilActivo) {
      var r2 = resumenPerfil(perfilActivo);
      var origen = r2 && r2.carta ? r2.carta.pilares.anio.rama.animal : '';
      $('#perfilCalMeta').textContent = (perfilActivo.tipo === 'yo' ? 'Tu origen' : 'Origen de ' + perfilActivo.nombre) + ': ' + origen + '.';
      $('#verCartaPerfil').href = 'index.html?perfil=' + encodeURIComponent(perfilActivo.id);
    } else {
      $('#perfilCalMeta').textContent = '';
      $('#verCartaPerfil').href = 'index.html';
    }
  }

  function usarPerfil(id, guardar) {
    var perfil = id ? leerPerfil(id) : perfilCalendario();
    if (perfil && guardar) seleccionarPerfilCalendario(perfil.id);
    perfilActivo = perfil || null;
    mia = perfilActivo ? cartaDesdePerfil(perfilActivo) : null;
    pintarSelectorPerfiles();
  }

  function natalActual() {
    return mia ? { ramaAnio: RAMAS.indexOf(mia.pilares.anio.rama) } : null;
  }

  function paletaDia(pilarDia) {
    return mia ? IDENTIDADES[mia.diaMaestro.pinyin] : IDENTIDADES[pilarDia.tallo.pinyin];
  }

  function pintarDia(fecha, dir) {
    try {
      var d = evaluarDia({ anio:fecha.getFullYear(), mes:fecha.getMonth()+1, dia:fecha.getDate() }, natalActual());
      var p = d.pilares.dia;
      var base = paletaDia(p);
      document.documentElement.style.setProperty('--acento', base.paleta[2]);
      pintarFondo(base.paleta, fecha.getDate()*31 + fecha.getMonth(), 1.15);

      var h = '<div class="vidrio"><div class="diaCab">' +
        '<p class="dow">' + DOW[fecha.getDay()] + '</p><p class="num">' + fecha.getDate() + '</p>' +
        '<p class="mes">' + MESES[fecha.getMonth()] + ' de ' + fecha.getFullYear() + '</p>' +
        '<p class="pil">' + iconoMini(p.tallo.elemento) + esc(p.rama.animal) + ' de ' + esc(p.tallo.elemento) + '</p></div>' +
        '<p class="tipoDia">' + esc(vientoDelDia(d.puntaje)) + '</p><div class="medidor"><i style="width:' + d.puntaje + '%"></i></div>' +
        '<p class="leyenda">Una lectura rápida de cómo se mezclan los dos ritmos</p>' +
        '<div class="capasTiempo escalona"><article class="capaTiempo"><span>Ritmo de 12 pasos</span><strong>' + esc(d.ritmo12.nombre) + '</strong><p>' + esc(d.ritmo12.caracter) + '</p></article>' +
        '<article class="capaTiempo"><span>Pulso de 28 días</span><strong>' + esc(d.pulso28.nombre) + '</strong><p>' + esc(d.pulso28.caracter) + '</p></article></div>' +
        '<div class="listas escalona"><div class="si"><h3>Puede fluir mejor</h3><ul>' + d.recomendadoPara.slice(0,5).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="no"><h3>Mejor con más margen</h3><ul>' + d.dejarParaLuego.slice(0,5).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';

      if (d.avisos.length) {
        h += '<div class="roce"><b>Un par de cosas para llevar con calma.</b> ' + d.avisos.map(function (a) { return esc(a.motivo) + (a.nota ? ': ' + esc(a.nota) : ''); }).join('. ') + '.</div>';
      }
      if (mia) {
        h += '<p class="pista" style="margin-top:18px">' + (perfilActivo && perfilActivo.tipo === 'otra' ? 'Esta lectura está personalizada para ' + esc(perfilActivo.nombre) + ' y cruza el día con su origen: ' : 'Esta lectura cruza el día con Tu origen: ') + esc(mia.pilares.anio.rama.animal) + '.</p>';
      }
      h += '</div>';

      var caja = $('#diaCaja');
      caja.innerHTML = h;
      caja.classList.remove('zoomEntra','zoomSale');
      if (dir === 'zoom') { void caja.offsetWidth; caja.classList.add('zoomEntra'); }
      else { caja.style.setProperty('--dir',(dir || 0) >= 0 ? '16px' : '-16px'); caja.style.animation='none'; void caja.offsetWidth; caja.style.animation=''; }
      activarApariciones(caja);
      diaVisto = new Date(fecha.getTime());
    } catch (e) {
      console.error('Tu Elemento · calendario día', e);
      $('#diaCaja').innerHTML = '<div class="vidrio"><p>El calendario encontró un tropiezo al cargar esta fecha. Toca Hoy para volver a intentarlo.</p></div>';
    }
  }

  function moverDia(n) {
    var base = diaVisto || new Date();
    var f = new Date(base.getTime());
    f.setDate(f.getDate() + n);
    pintarDia(f, n);
  }

  function pintarMes(base, dir) {
    try {
      var y = base.getFullYear();
      var m = base.getMonth();
      var primero = new Date(y,m,1);
      var arranque = primero.getDay();
      var diasMes = new Date(y,m+1,0).getDate();
      var hoy = new Date();
      var natal = natalActual();
      $('#mesTitulo').textContent = MESES[m] + ' ' + y;

      var h = '<div class="vidrio"><div class="rejilla">';
      ['d','l','m','m','j','v','s'].forEach(function (x) { h += '<div class="dowCab">' + x + '</div>'; });
      for (var i=0;i<arranque;i++) h += '<div></div>';
      for (var dia=1;dia<=diasMes;dia++) {
        var ev = evaluarDia({anio:y,mes:m+1,dia:dia}, natal);
        var esHoy = hoy.getFullYear()===y && hoy.getMonth()===m && hoy.getDate()===dia;
        var retraso=(arranque+dia-1)*8;
        h += '<button type="button" class="celda' + (esHoy?' hoy':'') + '" data-d="' + dia + '" style="animation-delay:' + retraso + 'ms;--nivel:' + (ev.puntaje/100).toFixed(2) + '" aria-label="' + dia + ' de ' + MESES[m] + '. ' + esc(vientoDelDia(ev.puntaje)) + '"><span class="n">' + dia + '</span><span class="pt" style="opacity:' + (0.18+ev.puntaje/125).toFixed(2) + '"></span></button>';
      }
      h += '</div></div>';
      var caja=$('#mesCaja');
      caja.innerHTML=h;
      caja.classList.remove('zoomEntra','zoomSale'); void caja.offsetWidth; caja.classList.add(dir==='zoom'?'zoomSale':'zoomEntra');
      Array.prototype.forEach.call(caja.querySelectorAll('.celda'),function(b){
        b.addEventListener('click',function(){ verDia(new Date(y,m,parseInt(b.getAttribute('data-d'),10)),'zoom'); });
      });
      activarApariciones(caja);
      mesVisto=new Date(y,m,1);
    } catch (e) {
      console.error('Tu Elemento · calendario mes', e);
      $('#mesCaja').innerHTML='<div class="vidrio"><p>El mes encontró un tropiezo al cargarse. Toca Día para volver a la fecha actual.</p></div>';
    }
  }

  function verMes(base, dir) {
    enMes=true;
    $('#diaCaja').hidden=true; $('#navDia').hidden=true;
    $('#mesCaja').hidden=false; $('#navMes').hidden=false;
    $('#vDia').setAttribute('aria-pressed','false'); $('#vMes').setAttribute('aria-pressed','true');
    $('.cambiaVista').classList.add('mes-activo');
    pintarMes(base || mesVisto || diaVisto || new Date(),dir);
  }

  function verDia(fecha, dir) {
    enMes=false;
    $('#mesCaja').hidden=true; $('#navMes').hidden=true;
    $('#diaCaja').hidden=false; $('#navDia').hidden=false;
    $('#vDia').setAttribute('aria-pressed','true'); $('#vMes').setAttribute('aria-pressed','false');
    $('.cambiaVista').classList.remove('mes-activo');
    pintarDia(fecha || diaVisto || new Date(),dir==='zoom'?'zoom':0);
  }

  function olvidarActivo() {
    if (!perfilActivo) return;
    var ok=typeof globalThis.confirm==='function' ? globalThis.confirm('¿Quieres olvidar ' + etiquetaPerfil(perfilActivo) + '?') : true;
    if (!ok) return;
    olvidarPerfil(perfilActivo.id);
    usarPerfil(null,false);
    if (enMes) pintarMes(mesVisto || new Date(),0); else pintarDia(diaVisto || new Date(),0);
  }

  function perfilDeRuta() {
    var q=globalThis.location && globalThis.location.search ? globalThis.location.search : '';
    var m=q.match(/[?&]perfil=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  var pedido=perfilDeRuta();
  if (pedido && leerPerfil(pedido)) seleccionarPerfilCalendario(pedido);
  usarPerfil(null,false);

  $('#perfilCal').addEventListener('change',function(){ usarPerfil(this.value,true); if(enMes) pintarMes(mesVisto || new Date(),0); else pintarDia(diaVisto || new Date(),0); });
  $('#olvidar').addEventListener('click',olvidarActivo);
  $('#diaAnt').addEventListener('click',function(){ moverDia(-1); });
  $('#diaSig').addEventListener('click',function(){ moverDia(1); });
  $('#diaHoy').addEventListener('click',function(){ var hoy=new Date(); if(enMes) verDia(hoy,'zoom'); else pintarDia(hoy,0); });
  $('#vDia').addEventListener('click',function(){ verDia(diaVisto || new Date(),'zoom'); });
  $('#vMes').addEventListener('click',function(){ verMes(diaVisto || new Date()); });
  $('#mesAnt').addEventListener('click',function(){ var f=new Date((mesVisto || new Date()).getTime()); f.setMonth(f.getMonth()-1); pintarMes(f,-1); });
  $('#mesSig').addEventListener('click',function(){ var f=new Date((mesVisto || new Date()).getTime()); f.setMonth(f.getMonth()+1); pintarMes(f,1); });

  document.addEventListener('keydown',function(e){
    var n=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0;
    if(!n)return;
    if(enMes){var f=new Date((mesVisto || new Date()).getTime());f.setMonth(f.getMonth()+n);pintarMes(f,n);}else moverDia(n);
  });

  pintarDia(new Date(),0);
})();
