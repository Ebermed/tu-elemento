/* TU ELEMENTO — V10.5.7 · selector estable de pilares
   Conserva las cuatro tarjetas y un único panel de lectura.
   Cambiar de pilar reemplaza contenido dentro del mismo panel,
   evitando show/hide, acordeones y recomposición de varias capas. */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  var estado = {
    lectura:null,
    fila:null,
    cols:[],
    contenidos:[],
    panel:null,
    activo:0
  };
  var rafMedida = 0;

  var css = document.createElement('style');
  css.id = 'pilares-selector-v1057-css';
  css.textContent = [
    '#lectura .hoja,#lectura .inter,#lectura .col,#lectura .pilarSelectorPanel{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important;will-change:auto!important}',
    '#lectura .revela-prep,#lectura .revela-prep.revela-viva{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}',
    '#lectura .col{pointer-events:auto!important;cursor:pointer!important;filter:none!important;transform:none!important;transition:background .12s ease,border-color .12s ease,box-shadow .12s ease!important}',
    '#lectura .col .mas{display:inline-flex!important;align-items:center!important;justify-content:center!important}',
    '#lectura .col[aria-expanded="true"]{background:rgba(255,255,255,.94)!important;box-shadow:0 7px 22px rgba(58,43,34,.06)!important}',
    '#lectura .pilarSelectorPanel{display:block!important;opacity:1!important;transform:none!important;filter:none!important;animation:none!important;transition:none!important;contain:layout paint!important;margin-top:16px!important;padding-top:16px!important;border-top:1px solid rgba(0,0,0,.10)!important}',
    '#lectura .pilarSelectorMedidor{position:absolute!important;left:-99999px!important;top:0!important;visibility:hidden!important;pointer-events:none!important;display:block!important;contain:none!important}',
    '#lectura .hoja{background:rgba(255,253,249,.90)!important}',
    '#lectura .inter{background:rgba(255,255,255,.62)!important}'
  ].join('\n');
  document.head.appendChild(css);

  function array(nodos) {
    return Array.prototype.slice.call(nodos || []);
  }

  function limpiarRevelado(nodo) {
    if (!nodo) return;
    nodo.classList.remove('revela-prep', 'revela-viva');
    if (nodo.style) {
      nodo.style.filter = 'none';
      nodo.style.transform = 'none';
      nodo.style.opacity = '1';
      nodo.style.willChange = 'auto';
    }
  }

  function actualizarBotones(indice) {
    estado.cols.forEach(function (b, i) {
      var activo = i === indice;
      b.disabled = false;
      b.setAttribute('aria-expanded', activo ? 'true' : 'false');
      b.setAttribute('aria-selected', activo ? 'true' : 'false');
      b.setAttribute('tabindex', activo ? '0' : '-1');
      b.dataset.pilarSelectorIndex = String(i);
      limpiarRevelado(b);
      var mas = b.querySelector('.mas');
      if (mas) {
        mas.hidden = false;
        mas.textContent = activo ? 'viendo' : 'leer';
      }
    });
  }

  function medirAlturaMaxima() {
    if (!estado.panel || !estado.lectura || !estado.contenidos.length) return;
    if (rafMedida) cancelAnimationFrame(rafMedida);
    rafMedida = requestAnimationFrame(function () {
      rafMedida = 0;
      var ancho = estado.panel.getBoundingClientRect().width;
      if (!ancho) return;
      var medidor = estado.panel.cloneNode(false);
      medidor.className = 'panel pilarSelectorPanel pilarSelectorMedidor abierto';
      medidor.removeAttribute('id');
      medidor.style.width = ancho + 'px';
      medidor.style.minHeight = '0';
      estado.lectura.appendChild(medidor);
      var max = 0;
      estado.contenidos.forEach(function (html) {
        medidor.innerHTML = html;
        max = Math.max(max, medidor.scrollHeight);
      });
      medidor.remove();
      if (max) estado.panel.style.minHeight = max + 'px';
    });
  }

  function activar(indice, enfocar) {
    if (!estado.panel || !estado.contenidos.length) return;
    indice = Math.max(0, Math.min(indice, estado.contenidos.length - 1));
    estado.activo = indice;
    actualizarBotones(indice);
    estado.panel.innerHTML = estado.contenidos[indice];
    estado.panel.setAttribute('data-pilar-activo', String(indice));
    limpiarRevelado(estado.panel);
    if (enfocar && estado.cols[indice] && estado.cols[indice].focus) {
      estado.cols[indice].focus({ preventScroll:true });
    }
  }

  function preparar() {
    var lectura = document.getElementById('lectura');
    if (!lectura) return;

    var cols = array(lectura.querySelectorAll('.col'));
    if (cols.length < 2) return;

    var existente = lectura.querySelector('.pilarSelectorPanel');
    if (existente && cols[0].dataset.pilarSelectorIndex != null) {
      estado.lectura = lectura;
      estado.cols = cols;
      estado.panel = existente;
      return;
    }

    var paneles = array(lectura.querySelectorAll('.panel')).filter(function (p) {
      return !p.classList.contains('pilarSelectorPanel');
    });
    if (paneles.length < cols.length) return;

    var fila = cols[0].parentElement;
    if (!fila) return;

    estado.lectura = lectura;
    estado.fila = fila;
    estado.cols = cols;
    estado.contenidos = paneles.slice(0, cols.length).map(function (p) { return p.innerHTML; });
    estado.activo = 0;

    paneles.forEach(function (p) { p.remove(); });

    var panel = document.createElement('div');
    panel.className = 'panel pilarSelectorPanel abierto';
    panel.id = 'panelPilarActivo';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-live', 'polite');
    fila.insertAdjacentElement('afterend', panel);
    estado.panel = panel;

    array(lectura.querySelectorAll('.hoja,.inter')).forEach(limpiarRevelado);
    activar(0, false);
    medirAlturaMaxima();
    lectura.dataset.pilarSelectorV1057 = '1';
  }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#lectura .col[data-pilar-selector-index]') : null;
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    activar(parseInt(b.dataset.pilarSelectorIndex, 10) || 0, false);
  }, true);

  document.addEventListener('keydown', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#lectura .col[data-pilar-selector-index]') : null;
    if (!b) return;
    var i = parseInt(b.dataset.pilarSelectorIndex, 10) || 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); e.stopImmediatePropagation();
      activar((i + 1) % estado.cols.length, true);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); e.stopImmediatePropagation();
      activar((i - 1 + estado.cols.length) % estado.cols.length, true);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); e.stopImmediatePropagation();
      activar(i, false);
    }
  }, true);

  var lectura = document.getElementById('lectura');
  if (lectura && typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () {
      if (!lectura.querySelector('.pilarSelectorPanel') && lectura.querySelectorAll('.panel').length) {
        requestAnimationFrame(preparar);
      }
    }).observe(lectura, { childList:true });
  }

  globalThis.addEventListener && globalThis.addEventListener('resize', function () {
    if (estado.panel) {
      estado.panel.style.minHeight = '0';
      medirAlturaMaxima();
    }
  }, { passive:true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { requestAnimationFrame(preparar); }, { once:true });
  } else {
    requestAnimationFrame(preparar);
  }
})();
