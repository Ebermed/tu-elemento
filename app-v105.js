(function () {
  'use strict';

  if (faltantes({
    'acuarela.js':'fondoAcuarela',
    'lugares.js':'LUGARES',
    'zonas.js':'utcDesdeLocal',
    'motor.js':'cuatroPilares',
    'traduccion.js':'traducir',
    'tarjeta.js':'tarjetaSVG',
    'lectura.js':'lecturaCompleta',
    'decadas.js':'decadas',
    'base.js':'listarPerfiles'
  })) return;

  var ultimo = null;
  var tipoCarta = 'yo';
  var perfilEditandoId = null;
  var lugarElegido = null;
  var sugerencias = [];
  var resaltado = -1;
  var caja = $('#buscaLugar');
  var lista = $('#sugerencias');

  function esc(x) {
    return String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function iconoMini(tipo) {
    var path = {
      roble:'M11 19c0-5 3-9 5-12 2 3 5 7 5 12M16 11c-2 0-4-1-5-3',
      hiedra:'M6 16c4-6 7-8 12-10-1 5-4 9-10 13-1-2-2-2-2-3z',
      sol:'M12 5v2M12 17v2M5 12h2M17 12h2M7.5 7.5l1.5 1.5M15 15l1.5 1.5M16.5 7.5 15 9M9 15l-1.5 1.5M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
      brasa:'M14 20c0-4 5-5 5-9 0-3-2-5-4-7 0 3-2 4-4 6-2 2-3 4-3 7 0 4 3 7 6 7s5-2 5-4z',
      montaña:'M5 17 12 7l7 10H5z',
      huerto:'M7 17h10M9 17v-4m6 4v-6M8 10c1-2 3-3 4-5 1 2 3 3 4 5',
      acero:'M12 4l7 7-7 9-7-9 7-7z',
      joya:'M12 5l6 4-2 8h-8L6 9l6-4z',
      marea:'M4 14c2-2 4-2 6 0s4 2 6 0 4-2 4-2M4 10c2-2 4-2 6 0s4 2 6 0 4-2 4-2',
      rocío:'M12 4c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z',
      origen:'M5 17 12 7l7 10H5z',
      trayectoria:'M7 8h10v10H7zM9 8V6h6v2',
      centro:'M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM6 19a6.5 6.5 0 0 1 12 0',
      futuro:'M12 5v14M12 5l-4 4M12 5l4 4',
      destino:'M12 5v14M12 5l-4 4M12 5l4 4'
    };
    var clave = String(tipo || '').toLowerCase().replace(/^tu\s+/,'');
    return '<span class="iconito" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="' + (path[clave] || path.centro) + '"/></svg></span>';
  }

  function polaridadDe(carta) {
    return ['Jia','Bing','Wu','Geng','Ren'].indexOf(carta.diaMaestro.pinyin) !== -1 ? 'Yang' : 'Yin';
  }

  function mostrarError(mensaje, objetivo) {
    var err = $('#err');
    err.textContent = mensaje;
    if (objetivo && objetivo.focus) objetivo.focus();
    if (err.scrollIntoView) err.scrollIntoView({ behavior:'smooth', block:'center' });
  }

  function pintarSugerencias() {
    lista.innerHTML = '';
    sugerencias.forEach(function (l, i) {
      var li = document.createElement('li');
      li.setAttribute('role','option');
      li.setAttribute('aria-selected', i === resaltado ? 'true' : 'false');
      li.innerHTML = esc(l.c) + ' <span class="pais">' + esc(l.p) + '</span>';
      var tomar = function (e) { if (e) e.preventDefault(); elegirLugar(l); };
      li.addEventListener('pointerdown', tomar);
      li.addEventListener('mousedown', tomar);
      li.addEventListener('click', tomar);
      lista.appendChild(li);
    });
    var abierta = sugerencias.length > 0;
    lista.classList.toggle('abierto', abierta);
    caja.setAttribute('aria-expanded', abierta ? 'true' : 'false');
  }

  function elegirLugar(l) {
    lugarElegido = l;
    caja.value = etiquetaLugar(l);
    sugerencias = [];
    resaltado = -1;
    pintarSugerencias();
    $('#pistaLugar').innerHTML = 'Usaremos la hora solar de <b>' + esc(l.c) + '</b>.';
    $('#pistaLugar').className = 'elegido';
  }

  function resolverLugarEscrito() {
    if (lugarElegido) return lugarElegido;
    var texto = caja.value.trim();
    if (!texto) return null;
    var candidatos = buscarLugares(texto, 8);
    if (!candidatos.length) {
      var simple = texto.split(/[·,]/)[0].trim();
      candidatos = simple ? buscarLugares(simple, 8) : [];
    }
    if (candidatos.length) {
      elegirLugar(candidatos[0]);
      return candidatos[0];
    }
    return null;
  }

  function configurarLugar() {
    caja.addEventListener('input', function () {
      lugarElegido = null;
      $('#pistaLugar').textContent = '';
      $('#pistaLugar').className = 'pista';
      sugerencias = this.value.trim() ? buscarLugares(this.value, 8) : [];
      resaltado = sugerencias.length ? 0 : -1;
      pintarSugerencias();
    });
    caja.addEventListener('keydown', function (e) {
      if (!sugerencias.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); resaltado = (resaltado + 1) % sugerencias.length; pintarSugerencias(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); resaltado = (resaltado - 1 + sugerencias.length) % sugerencias.length; pintarSugerencias(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (resaltado >= 0) elegirLugar(sugerencias[resaltado]); }
      else if (e.key === 'Escape') { sugerencias = []; pintarSugerencias(); }
    });
    caja.addEventListener('blur', function () {
      setTimeout(function () { sugerencias = []; pintarSugerencias(); }, 220);
    });
  }

  function ponerTipoCarta(tipo) {
    tipoCarta = tipo === 'otra' ? 'otra' : 'yo';
    var otra = tipoCarta === 'otra';
    $('#paraMi').classList.toggle('activo', !otra);
    $('#paraOtra').classList.toggle('activo', otra);
    $('#paraMi').setAttribute('aria-pressed', otra ? 'false' : 'true');
    $('#paraOtra').setAttribute('aria-pressed', otra ? 'true' : 'false');
    $('#nombrePersona').hidden = !otra;
    $('#tituloForm').textContent = otra ? '¿Cuándo nació?' : '¿Cuándo naciste?';
    $('#calcular').textContent = otra ? 'Ver su elemento' : 'Ver mi elemento';
  }

  function limpiarFormulario() {
    perfilEditandoId = null;
    ponerTipoCarta('yo');
    $('#nombreCarta').value = '';
    $('#dia').value = '';
    $('#mes').value = '';
    $('#anio').value = '';
    $('#hora').value = '';
    $('#minuto').value = '';
    $('#sexo').value = '';
    caja.value = '';
    lugarElegido = null;
    sugerencias = [];
    resaltado = -1;
    $('#pistaLugar').textContent = '';
    $('#pistaLugar').className = 'pista';
    $('#err').textContent = '';
  }

  function nuevaCarta() {
    limpiarFormulario();
    ir('p-form');
  }

  function resumenPerfil(p) {
    try {
      var carta = cartaDesdePerfil(p);
      if (!carta) return null;
      var t = traducir(carta);
      return { carta:carta, t:t, polaridad:polaridadDe(carta) };
    } catch (e) { return null; }
  }

  function pintarPerfilesGuardados() {
    var perfiles = listarPerfiles();
    var portada = $('#p-portada');
    var intro = $('#introPrimera');
    var biblioteca = $('#bibliotecaCartas');
    var listaP = $('#listaPerfiles');
    var titulo = $('#portadaTitulo');

    if (!perfiles.length) {
      portada.classList.remove('portadaRegreso');
      titulo.textContent = '¿De qué estás hecho?';
      intro.hidden = false;
      biblioteca.hidden = true;
      listaP.innerHTML = '';
      return;
    }

    portada.classList.add('portadaRegreso');
    titulo.textContent = 'Bienvenido de nuevo';
    intro.hidden = true;
    biblioteca.hidden = false;
    var html = '';
    perfiles.forEach(function (p) {
      var r = resumenPerfil(p);
      if (!r) return;
      var nombre = p.tipo === 'yo' ? 'Tu carta' : p.nombre;
      html += '<article class="perfilCard">' +
        '<div class="perfilIcono">' + iconoMini(r.t.tarjeta.nombre) + '</div>' +
        '<div class="perfilInfo"><span class="perfilNombre">' + esc(nombre) + '</span>' +
        '<strong>' + esc(r.t.tarjeta.nombre) + '</strong>' +
        '<small>' + esc(r.t.tarjeta.elemento) + ' · ' + r.polaridad + (p.nacimiento.ciudad ? ' · ' + esc(p.nacimiento.ciudad) : '') + '</small></div>' +
        '<div class="perfilAcciones">' +
          '<a class="perfilAccion principal" href="index.html?perfil=' + encodeURIComponent(p.id) + '">Ver carta</a>' +
          '<a class="perfilAccion" href="calendario.html?perfil=' + encodeURIComponent(p.id) + '">Calendario</a>' +
          '<button type="button" class="perfilOlvidar" data-olvidar-perfil="' + esc(p.id) + '">Olvidar esta carta</button>' +
        '</div></article>';
    });
    listaP.innerHTML = html;
    activarApariciones(biblioteca);
  }

  function datosFormulario() {
    var nombre = tipoCarta === 'yo' ? 'Tu carta' : $('#nombreCarta').value.trim();
    if (tipoCarta === 'otra' && !nombre) { mostrarError('Pon un nombre o apodo para guardar esta carta.', $('#nombreCarta')); return null; }

    var dia = parseInt($('#dia').value, 10);
    var mes = parseInt($('#mes').value, 10);
    var anio = parseInt($('#anio').value, 10);
    if (!dia || !mes || !anio) { mostrarError('Completa día, mes y año.'); return null; }
    if (anio < 1900 || anio > 2030) { mostrarError('Usa un año entre 1900 y 2030.', $('#anio')); return null; }
    var maxDia = new Date(anio, mes, 0).getDate();
    if (dia < 1 || dia > maxDia) { mostrarError(MESES[mes - 1] + ' de ' + anio + ' tiene ' + maxDia + ' días.', $('#dia')); return null; }

    var hTxt = $('#hora').value;
    var mTxt = $('#minuto').value;
    var sinHora = hTxt === '';
    var hora = sinHora ? 12 : parseInt(hTxt, 10);
    var minuto = mTxt === '' ? 0 : parseInt(mTxt, 10);
    if (!sinHora && (hora < 0 || hora > 23)) { mostrarError('Usa una hora entre 0 y 23.', $('#hora')); return null; }
    if (minuto < 0 || minuto > 59) { mostrarError('Usa minutos entre 0 y 59.', $('#minuto')); return null; }

    var lugar = resolverLugarEscrito();
    if (!lugar) { mostrarError('Elige una ciudad de las sugerencias para ubicar correctamente la hora solar.', caja); return null; }

    return {
      nombre:nombre,
      nacimiento:{
        anio:anio, mes:mes, dia:dia, hora:hora, minuto:minuto, sinHora:sinHora,
        zona:lugar.z, lon:lugar.lon, ciudad:lugar.c, sexo:$('#sexo').value
      }
    };
  }

  function generarDesdeFormulario() {
    $('#err').textContent = '';
    var datos = datosFormulario();
    if (!datos) return;
    var btn = $('#calcular');
    var textoBtn = btn.textContent;
    btn.textContent = 'Calculando…';
    btn.disabled = true;
    try {
      var n = datos.nacimiento;
      var carta = cuatroPilares({ anio:n.anio, mes:n.mes, dia:n.dia, hora:n.hora, minuto:n.minuto, zona:n.zona, longitud:n.lon });
      var perfil = guardarPerfil({ id:perfilEditandoId, tipo:tipoCarta, nombre:datos.nombre, nacimiento:n });
      if (!perfil) throw new Error('storage');
      perfilEditandoId = perfil.id;
      mostrarResultado(perfil, carta);
    } catch (e) {
      console.error('Tu Elemento · generar carta', e);
      mostrarError('La carta encontró un tropiezo al generarse. Recarga la página y vuelve a intentar con los mismos datos.');
    } finally {
      btn.disabled = false;
      btn.textContent = textoBtn;
    }
  }

  function abrirPerfil(id) {
    var perfil = leerPerfil(id);
    if (!perfil) { pintarPerfilesGuardados(); ir('p-portada'); return; }
    try {
      var carta = cartaDesdePerfil(perfil);
      if (!carta) throw new Error('carta');
      mostrarResultado(perfil, carta);
    } catch (e) {
      console.error('Tu Elemento · abrir perfil', e);
      pintarPerfilesGuardados();
      ir('p-portada');
    }
  }

  function mostrarResultado(perfil, carta) {
    var n = perfil.nacimiento;
    var t = traducir(carta);
    var lec = lecturaCompleta(carta, !!n.sinHora);
    var id = IDENTIDADES[carta.diaMaestro.pinyin];
    var nombrePerfil = perfil.tipo === 'yo' ? 'Tu carta' : perfil.nombre;
    var semilla = n.dia * 31 + n.mes;
    var nacimientoTxt = n.dia + ' de ' + MESES[n.mes - 1] + ' de ' + n.anio + (n.sinHora ? '' : ' · ' + String(n.hora).padStart(2,'0') + ':' + String(n.minuto).padStart(2,'0')) + ' · ' + n.ciudad;

    ultimo = { perfil:perfil, perfilId:perfil.id, carta:carta, t:t, lec:lec, sexo:n.sexo || '', nacAnio:n.anio, nacMes:n.mes, nacDia:n.dia, nacimiento:nacimientoTxt, semilla:semilla };

    pintarFondo(id.paleta, semilla, 1.15);
    document.documentElement.style.setProperty('--acento', id.paleta[2]);

    $('#tarjetaCaja').innerHTML = tarjetaSVG(t, { semilla:semilla, lectura:lec, pie:'ebermed.github.io' });
    var L = t.lectura;
    var polaridad = polaridadDe(carta);
    var contexto = $('#resultadoContexto');
    if (perfil.tipo === 'otra') { contexto.hidden = false; contexto.textContent = 'Carta de ' + perfil.nombre; }
    else contexto.hidden = true;

    $('#resultadoHero').innerHTML =
      '<div class="resultadoIcono">' + iconoMini(t.tarjeta.nombre) + '</div>' +
      '<p class="resultadoKicker">' + (perfil.tipo === 'otra' ? 'Elemento base de ' + esc(perfil.nombre) : 'Tu elemento base') + '</p>' +
      '<h1 class="resultadoNombre">' + esc(t.tarjeta.nombre) + '</h1>' +
      '<p class="resultadoElemento">' + esc(t.tarjeta.elemento) + ' · ' + polaridad + '</p>' +
      '<p class="resultadoFrase">' + esc(t.tarjeta.frase) + '</p>' +
      '<p class="resultadoDescripcion">' + esc(L.imagen) + '</p>';

    $('#compartirTitulo').innerHTML = iconoMini('joya') + '<span>Tu tarjeta para compartir</span>';

    var html = '<div class="hoja">' +
      '<h2 class="titIcon">' + iconoMini('marea') + '<span>Cómo se mueve tu elemento</span></h2>' +
      '<p class="sub">Tu elemento base marca el tono general de la carta. Aquí puedes ver cómo suele moverse esa energía y qué parte tiende a costarte un poco más.</p>' +
      '<p>' + esc(lec.elemento.movimiento) + '</p><p class="tension">' + esc(lec.elemento.tension) + '</p></div>';

    var cortos = {
      'Tu origen':'Tu origen','Tu trayectoria':'Tu trayectoria','Tu centro':'Tu centro','Tú':'Tu centro','Tu futuro':'Tu futuro',
      'Raíces':'Tu origen','Trayectoria':'Tu trayectoria','Centro':'Tu centro','Proyección':'Tu futuro',
      'De dónde vienes':'Tu origen','Cómo trabajas':'Tu trayectoria','Quién eres':'Tu centro','Hacia dónde vas':'Tu futuro'
    };

    html += '<div class="hoja"><h2 class="titIcon">' + iconoMini('origen') + '<span>Tus ' + lec.pilares.length + ' pilares</span></h2>' +
      '<p class="sub">' + esc(t.encuadre) + ' <b>Toca cada pilar para leerlo.</b></p><div class="columnas" style="--n:' + lec.pilares.length + '">';
    lec.pilares.forEach(function (p, i) {
      var titulo = cortos[p.titulo] || p.titulo;
      html += '<button class="col" type="button" data-p="' + i + '" aria-expanded="' + (i === 0 ? 'true' : 'false') + '" aria-controls="pan' + i + '">' +
        '<span class="rot">' + iconoMini(titulo) + esc(titulo) + '</span><span class="an">' + esc(p.animal) + '</span><span class="el">' + esc(p.elementoCrudo) + '</span>' +
        (p.vacio ? '<span class="vac">vacío</span>' : '') + '<span class="mas">' + (i === 0 ? 'cerrar' : 'leer') + '</span></button>';
    });
    html += '</div>';
    lec.pilares.forEach(function (p, i) {
      html += '<div class="panel' + (i === 0 ? ' abierto' : '') + '" id="pan' + i + '"><p class="quien">' + esc(cortos[p.titulo] || p.titulo) + ' · ' + esc(p.etapa) + '</p><p>' + esc(p.intro) + '</p><p>' + esc(p.movimiento) + '</p><p class="tension">' + esc(p.tension) + '</p></div>';
    });
    html += '</div>';

    if (lec.tensiones.length) {
      html += '<div class="hoja"><h2 class="titIcon">' + iconoMini('brasa') + '<span>Cuando tus pilares se jalan entre sí</span></h2><p class="sub">Tus pilares también hablan entre ellos. Aquí puedes ver dónde se apoyan y dónde piden ritmos distintos.</p>';
      lec.tensiones.forEach(function (x) { html += '<div class="inter"><p class="quienes">' + esc(x.detalle) + '</p><p>' + esc(x.texto) + '</p></div>'; });
      html += '</div>';
    }

    if (lec.vacios.length) {
      html += '<div class="hoja"><h2 class="titIcon">' + iconoMini('acero') + '<span>Tus vacíos</span></h2>' +
        '<p class="sub">Un vacío señala una parte de la carta que suele desarrollarse mucho a través de experiencia propia. Su significado cambia según el pilar donde aparece y el elemento que lo acompaña.</p>';
      lec.vacios.forEach(function (v) {
        html += '<div class="inter"><p class="quienes">' + esc(v.titulo) + '</p>' +
          (v.elementoEtiqueta ? '<p class="vacioMeta">' + esc(v.elementoEtiqueta) + ' · ' + esc(v.rama || '') + '</p>' : '') +
          '<p>' + esc(v.texto) + '</p><p class="tension">' + esc(v.filo) + '</p></div>';
      });
      html += '</div>';
    }

    var orden = ['madera','fuego','tierra','metal','agua'];
    var maxN = 1;
    orden.forEach(function (e) { maxN = Math.max(maxN, lec.balance.conteo[e] || 0); });
    html += '<div class="hoja"><h2 class="titIcon">' + iconoMini('joya') + '<span>Distribución de tus 5 elementos</span></h2><p class="sub">Esta vista muestra cuánto espacio ocupa cada elemento dentro del conjunto.</p><div class="barras">';
    orden.forEach(function (e) {
      var val = lec.balance.conteo[e] || 0;
      html += '<div class="barra' + (val === 0 ? ' cero' : '') + '"><i style="height:' + Math.max(5,(val/maxN)*100) + '%"></i><b>' + e + '</b></div>';
    });
    html += '</div>';
    lec.balance.matices.forEach(function (m) { html += '<p>' + esc(m) + '</p>'; });
    if (!lec.balance.matices.length) html += '<p>Tus cinco elementos están bastante repartidos y comparten el espacio de forma pareja.</p>';
    html += '</div>';

    html += '<div class="hoja" style="text-align:center"><h2 class="titIcon cent">' + iconoMini('marea') + '<span>El ritmo de tus días</span></h2><p class="sub">El calendario traduce el ritmo de cada fecha y lo cruza con esta carta.</p><a class="btn" id="abrirCalendario" href="calendario.html?perfil=' + encodeURIComponent(perfil.id) + '" style="margin-top:6px;display:inline-block">Ver el calendario</a></div>';

    var aviso = '';
    if (n.sinHora) aviso = 'Esta lectura usa el mediodía como referencia. Al agregar tu hora también aparece Tu futuro y la carta reúne sus cuatro pilares.';
    else if (carta.avisoZona === 'repetida') aviso = 'Tu hora cayó durante un cambio histórico de horario. El cálculo toma la primera aparición de esa hora.';
    else if (carta.avisoZona === 'hueco') aviso = 'Tu hora cayó dentro de un salto histórico de horario. El cálculo continúa con el horario que empezó después de ese cambio.';
    if (aviso) html += '<div class="hoja"><p class="pista">' + esc(aviso) + '</p></div>';

    html += '<div class="hoja" style="text-align:center"><h2 class="titIcon cent">' + iconoMini('destino') + '<span>Tus ciclos de diez años</span></h2><p class="sub">Estos tramos muestran cómo cambia el clima de la carta a lo largo del tiempo.</p>' +
      (n.sexo ? '<button class="btn" type="button" id="verCarta" style="margin-top:6px">' + (perfil.tipo === 'otra' ? 'Ver sus ciclos' : 'Ver mis ciclos') + '</button>' : '<p class="pista">Agrega el sexo registrado al nacer desde el formulario para calcular esta secuencia.</p>') + '</div>';

    $('#lectura').innerHTML = html;
    $('#lectura').classList.add('escalona');
    activarApariciones($('#resultadoHero'));
    activarApariciones($('#lectura'));
    activarApariciones($('#compartirMarco'));
    enlazarPilares();

    var btnCiclos = $('#verCarta');
    if (btnCiclos) btnCiclos.addEventListener('click', mostrarCiclos);

    pintarPerfilesGuardados();
    ir('p-resultado');
  }

  function enlazarPilares() {
    var cols = $('#lectura').querySelectorAll('.col');
    Array.prototype.forEach.call(cols, function (b) {
      b.addEventListener('click', function () {
        var i = b.getAttribute('data-p');
        var pan = $('#pan' + i);
        var abierto = b.getAttribute('aria-expanded') === 'true';
        Array.prototype.forEach.call(cols, function (o) {
          o.setAttribute('aria-expanded','false');
          var mas = o.querySelector('.mas'); if (mas) mas.textContent = 'leer';
        });
        Array.prototype.forEach.call($('#lectura').querySelectorAll('.panel'), function (o) { o.classList.remove('abierto'); });
        if (!abierto && pan) {
          b.setAttribute('aria-expanded','true');
          var mas2 = b.querySelector('.mas'); if (mas2) mas2.textContent = 'cerrar';
          pan.classList.add('abierto');
        }
      });
    });
  }

  function lineaTiempoHTML(t, lec, dec, edad) {
    var actual = decadaActual(dec, edad);
    var h = '<div class="hoja"><h2 class="titIcon">' + iconoMini('destino') + '<span>Tus ciclos de diez años</span></h2><p class="sub">Tus ciclos empiezan alrededor de los ' + dec.edadInicio + ' años y cambian aproximadamente cada década. Tienes ' + edad + ' años.</p><ul class="tl">';
    dec.lista.forEach(function (d, i) {
      var esAhora = i === actual;
      var esFuturo = i > actual;
      var an = ANIMALES[d.rama.pinyin];
      var idn = IDENTIDADES[d.tallo.pinyin];
      h += '<li class="' + (esAhora ? 'ahora' : esFuturo ? 'futuro' : '') + '"><div class="edad">' + d.desde + '<small>a ' + d.hasta + '</small></div><div class="cuerpo">' +
        (esAhora ? '<span class="sello">Aquí andas</span>' : '') + '<p class="cab">' + esc(an.nombre) + ' de ' + esc(d.elemento) + ' <em>· ' + esc(idn.nombre) + '</em>' + (d.enVacio ? '<span class="vac">vacío</span>' : '') + '</p>' +
        (esAhora ? '<p>' + esc(an.movimiento) + '</p><p class="tension">' + esc(an.tension) + '</p>' : '<p class="pista">' + esc(an.frase) + '</p>') + '</div></li>';
    });
    h += '</ul></div>';
    if (actual >= 0 && actual + 1 < dec.lista.length) {
      var sig = dec.lista[actual + 1];
      h += '<div class="hoja"><h2>Lo que viene después</h2><p class="sub">Alrededor de los ' + sig.desde + ' años empieza tu siguiente tramo de diez años.</p><p>' + esc(ANIMALES[sig.rama.pinyin].movimiento) + '</p><p class="tension">' + esc(ANIMALES[sig.rama.pinyin].tension) + '</p></div>';
    }
    return h;
  }

  function mostrarCiclos() {
    if (!ultimo || !ultimo.sexo) return;
    try {
      var dec = decadas(ultimo.carta, ultimo.sexo, 9);
      var edad = edadHoy(ultimo.nacAnio, ultimo.nacMes, ultimo.nacDia);
      $('#cartaCaja').innerHTML = lineaTiempoHTML(ultimo.t, ultimo.lec, dec, edad);
      $('#cartaCaja').classList.add('escalona');
      activarApariciones($('#cartaCaja'));
      ir('p-carta');
    } catch (e) { console.error('Tu Elemento · ciclos', e); }
  }

  function descargarTarjetaActual() {
    if (!ultimo) return;
    descargarSVG($('#tarjetaCaja svg'), 'tu-elemento-' + ultimo.t.tarjeta.nombre.toLowerCase());
  }

  function olvidar(id) {
    var p = leerPerfil(id);
    if (!p) return;
    var ok = typeof globalThis.confirm === 'function' ? globalThis.confirm('¿Quieres olvidar ' + etiquetaPerfil(p) + '?') : true;
    if (!ok) return;
    olvidarPerfil(id);
    pintarPerfilesGuardados();
  }

  function ruta() {
    var q = globalThis.location && globalThis.location.search ? globalThis.location.search : '';
    var mPerfil = q.match(/[?&]perfil=([^&]+)/);
    if (mPerfil) {
      var id = decodeURIComponent(mPerfil[1]);
      if (leerPerfil(id)) { abrirPerfil(id); return; }
    }
    if (/[?&]nueva=1(?:&|$)/.test(q)) { nuevaCarta(); return; }
    pintarPerfilesGuardados();
    ir('p-portada');
  }

  MESES.forEach(function (m, i) {
    var o = document.createElement('option');
    o.value = i + 1;
    o.textContent = m.charAt(0).toUpperCase() + m.slice(1);
    $('#mes').appendChild(o);
  });

  configurarLugar();
  pintarFondo(PALETA_NEUTRA, 88);
  activarApariciones(document);

  $('#irForm').addEventListener('click', nuevaCarta);
  $('#paraMi').addEventListener('click', function () { ponerTipoCarta('yo'); });
  $('#paraOtra').addEventListener('click', function () { ponerTipoCarta('otra'); });
  $('#calcular').addEventListener('click', generarDesdeFormulario);
  $('#forma').addEventListener('submit', function (e) { e.preventDefault(); generarDesdeFormulario(); });
  $('#volverPortada').addEventListener('click', function () { pintarPerfilesGuardados(); pintarFondo(PALETA_NEUTRA,88); ir('p-portada'); });
  $('#volverCartas').addEventListener('click', function () { pintarPerfilesGuardados(); pintarFondo(PALETA_NEUTRA,88); ir('p-portada'); });
  $('#volverResultado').addEventListener('click', function () { ir('p-resultado'); });
  $('#bajarTop').addEventListener('click', descargarTarjetaActual);
  $('#bajarFinal').addEventListener('click', descargarTarjetaActual);
  $('#seguirCarta').addEventListener('click', function () { var l=$('#lectura'); if(l&&l.scrollIntoView)l.scrollIntoView({behavior:'smooth',block:'start'}); });

  document.addEventListener('click', function (e) {
    var nueva = e.target && e.target.closest ? e.target.closest('[data-nueva-carta]') : null;
    if (nueva) { e.preventDefault(); nuevaCarta(); return; }
    var borrar = e.target && e.target.closest ? e.target.closest('[data-olvidar-perfil]') : null;
    if (borrar) { e.preventDefault(); olvidar(borrar.getAttribute('data-olvidar-perfil')); }
  });

  globalThis.addEventListener && globalThis.addEventListener('error', function (ev) {
    if ($('#p-form').classList.contains('viva')) {
      console.error('Tu Elemento · error de interfaz', ev.error || ev.message);
      mostrarError('La interfaz encontró un tropiezo. Recarga la página y conserva los mismos datos para continuar.');
    }
  });

  ruta();
})();
