(function () {
  'use strict';

  function abrirPilar(boton) {
    if (!boton) return;
    var lectura = document.getElementById('lectura');
    if (!lectura || !lectura.contains(boton)) return;

    var bloque = boton.closest ? boton.closest('.hoja') : lectura;
    var indice = boton.getAttribute('data-p');
    var panel = document.getElementById('pan' + indice);
    var estabaAbierto = boton.getAttribute('aria-expanded') === 'true';
    var columnas = bloque.querySelectorAll('.col[data-p]');
    var paneles = bloque.querySelectorAll('.panel');

    for (var i = 0; i < columnas.length; i++) {
      columnas[i].setAttribute('aria-expanded', 'false');
      var etiqueta = columnas[i].querySelector('.mas');
      if (etiqueta) etiqueta.textContent = 'leer';
    }
    for (var j = 0; j < paneles.length; j++) {
      paneles[j].classList.remove('abierto');
      paneles[j].setAttribute('aria-hidden', 'true');
    }

    if (!estabaAbierto && panel) {
      boton.setAttribute('aria-expanded', 'true');
      var etiquetaActiva = boton.querySelector('.mas');
      if (etiquetaActiva) etiquetaActiva.textContent = 'cerrar';
      panel.classList.add('abierto');
      panel.setAttribute('aria-hidden', 'false');
    }
  }

  /* Captura el evento antes del listener antiguo del botón. */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var boton = t && t.closest ? t.closest('#lectura .col[data-p]') : null;
    if (!boton) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    abrirPilar(boton);
  }, true);

  globalThis.__tuElementoAbrirPilar = abrirPilar;
})();
