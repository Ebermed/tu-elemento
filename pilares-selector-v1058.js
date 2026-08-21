/* TU ELEMENTO — V10.5.8 · selector de pilares de panel único
   Un solo panel visible. Cero medición, clones o animación de altura. */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  var estado = { lectura:null, cols:[], contenidos:[], panel:null, activo:0 };

  var css = document.createElement('style');
  css.id = 'pilares-selector-v1058-css';
  css.textContent = [
    '#lectura .col{pointer-events:auto!important;cursor:pointer!important;transition:background .12s ease,border-color .12s ease!important}',
    '#lectura .col .mas{display:inline-flex!important;align-items:center!important;justify-content:center!important}',
    '#lectura .col[aria-expanded="true"]{background:rgba(255,255,255,.96)!important;box-shadow:0 7px 22px rgba(58,43,34,.05)!important}',
    '#lectura .pilarSelectorPanel{display:block!important;opacity:1!important;animation:none!important;transition:none!important;margin-top:14px!important;padding:16px 2px 2px!important;border-top:1px solid rgba(0,0,0,.10)!important}'
  ].join('\n');
  document.head.appendChild(css);

  function a(nodos) { return Array.prototype.slice.call(nodos || []); }

  function limpiar(n) {
    if (!n) return;
    n.classList.remove('revela-prep','revela-viva');
    if (n.style) {
      n.style.opacity = '1';
      n.style.filter = 'none';
      n.style.transform = 'none';
      n.style.transition = 'none';
      n.style.willChange = 'auto';
    }
  }

  function actualizarBotones(indice) {
    estado.cols.forEach(function (b, i) {
      var activo = i === indice;
      b.disabled = false;
      b.setAttribute('aria-expanded', activo ? 'true' : 'false');
      b.setAttribute('aria-selected', activo ? 'true' : 'false');
      b.dataset.pilarSimpleIndex = String(i);
      limpiar(b);
      var mas = b.querySelector('.mas');
      if (mas) {
        mas.hidden = false;
        mas.textContent = activo ? 'cerrar' : 'leer';
      }
    });
  }

  function activar(indice) {
    if (!estado.panel || !estado.contenidos.length) return;
    indice = Math.max(0, Math.min(indice, estado.contenidos.length - 1));
    estado.activo = indice;
    actualizarBotones(indice);
    estado.panel.innerHTML = estado.contenidos[indice];
    limpiar(estado.panel);
  }

  function preparar() {
    var lectura = document.getElementById('lectura');
    if (!lectura) return false;

    var cols = a(lectura.querySelectorAll('.columnas .col'));
    if (cols.length < 2) return false;

    var ya = lectura.querySelector('.pilarSelectorPanel');
    if (ya) {
      estado.lectura = lectura;
      estado.cols = cols;
      estado.panel = ya;
      return true;
    }

    var paneles = a(lectura.querySelectorAll('.panel')).filter(function (p) {
      return !p.classList.contains('pilarSelectorPanel');
    });
    if (paneles.length < cols.length) return false;

    var fila = cols[0].parentElement;
    if (!fila) return false;

    estado.lectura = lectura;
    estado.cols = cols;
    estado.contenidos = paneles.slice(0, cols.length).map(function (p) { return p.innerHTML; });
    estado.activo = 0;

    paneles.slice(0, cols.length).forEach(function (p) { p.remove(); });

    var panel = document.createElement('div');
    panel.className = 'panel pilarSelectorPanel abierto';
    panel.id = 'panelPilarActivo';
    panel.setAttribute('role','region');
    fila.insertAdjacentElement('afterend', panel);
    estado.panel = panel;

    a(lectura.querySelectorAll('.hoja,.inter,.vidrio,.col,.panel,.revela')).forEach(limpiar);
    activar(0);
    lectura.dataset.pilarSelectorV1058 = '1';
    return true;
  }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#lectura .col[data-pilar-simple-index]') : null;
    if (!b) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    activar(parseInt(b.dataset.pilarSimpleIndex,10) || 0);
  }, true);

  var lectura = document.getElementById('lectura');
  var observer = null;
  function vigilar() {
    if (preparar()) return;
    lectura = document.getElementById('lectura');
    if (!lectura || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(function () {
      if (lectura.querySelector('.pilarSelectorPanel')) return;
      preparar();
    });
    observer.observe(lectura,{childList:true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', vigilar, {once:true});
  } else {
    vigilar();
  }
})();
