/* TU ELEMENTO — V10.5.2 · envío robusto del formulario
   Una carta nueva se guarda primero y después abre por la misma ruta
   que usa el mosaico de cartas guardadas. */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  var boton = document.getElementById('calcular');
  var forma = document.getElementById('forma');
  var err = document.getElementById('err');
  if (!boton || !forma || !err) return;

  var procesando = false;

  function campo(id) { return document.getElementById(id); }
  function fallo(texto, objetivo) {
    err.textContent = texto;
    if (objetivo && objetivo.focus) objetivo.focus();
    if (err.scrollIntoView) err.scrollIntoView({ behavior:'smooth', block:'center' });
    procesando = false;
    boton.disabled = false;
    boton.textContent = campo('paraOtra').getAttribute('aria-pressed') === 'true' ? 'Ver su elemento' : 'Ver mi elemento';
  }

  function resolverLugar() {
    var caja = campo('buscaLugar');
    var texto = String(caja.value || '').trim();
    if (!texto || typeof buscarLugares !== 'function') return null;
    var candidatos = buscarLugares(texto, 8) || [];
    if (!candidatos.length) {
      var simple = texto.split(/[·,]/)[0].trim();
      candidatos = simple ? (buscarLugares(simple, 8) || []) : [];
    }
    return candidatos[0] || null;
  }

  function enviar(e) {
    if (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    if (procesando) return;
    procesando = true;
    err.textContent = '';

    var esOtra = campo('paraOtra').getAttribute('aria-pressed') === 'true';
    var nombre = esOtra ? String(campo('nombreCarta').value || '').trim() : 'Tu carta';
    if (esOtra && !nombre) return fallo('Pon un nombre o apodo para guardar esta carta.', campo('nombreCarta'));

    var dia = parseInt(campo('dia').value, 10);
    var mes = parseInt(campo('mes').value, 10);
    var anio = parseInt(campo('anio').value, 10);
    if (!dia || !mes || !anio) return fallo('Completa día, mes y año.');
    if (anio < 1900 || anio > 2030) return fallo('Usa un año entre 1900 y 2030.', campo('anio'));
    var maxDia = new Date(anio, mes, 0).getDate();
    if (dia < 1 || dia > maxDia) return fallo((MESES[mes - 1] || 'Ese mes') + ' de ' + anio + ' tiene ' + maxDia + ' días.', campo('dia'));

    var hTxt = String(campo('hora').value || '');
    var mTxt = String(campo('minuto').value || '');
    var sinHora = hTxt === '';
    var hora = sinHora ? 12 : parseInt(hTxt, 10);
    var minuto = mTxt === '' ? 0 : parseInt(mTxt, 10);
    if (!sinHora && (isNaN(hora) || hora < 0 || hora > 23)) return fallo('Usa una hora entre 0 y 23.', campo('hora'));
    if (isNaN(minuto) || minuto < 0 || minuto > 59) return fallo('Usa minutos entre 0 y 59.', campo('minuto'));

    var lugar = resolverLugar();
    if (!lugar) return fallo('Elige una ciudad de las sugerencias para ubicar correctamente la hora solar.', campo('buscaLugar'));

    boton.disabled = true;
    boton.textContent = 'Abriendo tu carta…';

    try {
      var perfil = guardarPerfil({
        tipo: esOtra ? 'otra' : 'yo',
        nombre: nombre,
        nacimiento: {
          anio:anio, mes:mes, dia:dia, hora:hora, minuto:minuto,
          sinHora:sinHora, zona:lugar.z, lon:lugar.lon, ciudad:lugar.c,
          sexo:String(campo('sexo').value || '')
        }
      });
      if (!perfil || !perfil.id) throw new Error('profile-save');

      // Reutiliza la ruta estable de apertura de perfiles. El cálculo y el
      // render ocurren tras la navegación, igual que al tocar "Ver carta".
      globalThis.location.href = 'index.html?perfil=' + encodeURIComponent(perfil.id) + '&r=10.5.2';
    } catch (ex) {
      console.error('Tu Elemento · guardar carta nueva', ex);
      fallo('La carta encontró un tropiezo al guardarse. Vuelve a tocar el botón para intentarlo otra vez.');
    }
  }

  // Captura vence al manejador anterior del botón y evita que dos caminos
  // intenten generar la misma carta a la vez.
  boton.addEventListener('click', enviar, true);
  forma.addEventListener('submit', enviar, true);

  // Semántica nativa para teclado, lectores de pantalla y navegadores móviles.
  boton.type = 'submit';
})();
