/* TU ELEMENTO — V10.5.6 · modo seguro de pilares
   Los cuatro pilares permanecen visibles y sin interacción.
   El objetivo es eliminar por completo el acordeón que congela la página. */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  var css = document.createElement('style');
  css.id = 'pilares-estaticos-v1056-css';
  css.textContent = [
    '#lectura .col{pointer-events:none!important;cursor:default!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important;transform:none!important;transition:none!important}',
    '#lectura .col .mas{display:none!important}',
    '#lectura .panel{display:block!important;animation:none!important;filter:none!important;transform:none!important;transition:none!important;opacity:1!important}',
    '#lectura .hoja,#lectura .inter{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important;transform:none!important}',
    '#lectura .revela-prep,#lectura .revela-prep.revela-viva{opacity:1!important;filter:none!important;transform:none!important;transition:none!important}',
    '#lectura .panel{margin-top:16px!important;padding-top:16px!important;border-top:1px solid rgba(0,0,0,.10)!important}',
    '#lectura .panel + .panel{margin-top:22px!important}',
    '#lectura .col[aria-expanded="true"]{border-width:1px!important;padding:12px 4px 10px!important;background:rgba(255,255,255,.72)!important}'
  ].join('\n');
  document.head.appendChild(css);

  function estabilizar() {
    var lectura = document.getElementById('lectura');
    if (!lectura) return;

    var cols = lectura.querySelectorAll('.col');
    var panels = lectura.querySelectorAll('.panel');
    if (!cols.length && !panels.length) return;

    Array.prototype.forEach.call(cols, function (b) {
      b.disabled = true;
      b.setAttribute('aria-expanded', 'true');
      b.setAttribute('tabindex', '-1');
      b.removeAttribute('aria-controls');
      b.classList.remove('revela-prep', 'revela-viva');
      if (b.style) {
        b.style.filter = 'none';
        b.style.transform = 'none';
        b.style.opacity = '1';
        b.style.transition = 'none';
      }
      var mas = b.querySelector('.mas');
      if (mas) mas.hidden = true;
    });

    Array.prototype.forEach.call(panels, function (p) {
      p.classList.add('abierto');
      p.classList.remove('revela-prep', 'revela-viva');
      if (p.style) {
        p.style.display = 'block';
        p.style.filter = 'none';
        p.style.transform = 'none';
        p.style.opacity = '1';
        p.style.transition = 'none';
        p.style.animation = 'none';
      }
    });

    Array.prototype.forEach.call(lectura.querySelectorAll('.hoja,.inter'), function (n) {
      n.classList.remove('revela-prep', 'revela-viva');
      if (n.style) {
        n.style.filter = 'none';
        n.style.transform = 'none';
        n.style.opacity = '1';
        n.style.transition = 'none';
      }
    });
  }

  // Bloquea cualquier interacción residual del acordeón antes de que alcance
  // los listeners de la aplicación antigua.
  document.addEventListener('click', function (e) {
    var col = e.target && e.target.closest ? e.target.closest('#lectura .col') : null;
    if (!col) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);

  var lectura = document.getElementById('lectura');
  if (lectura && typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () {
      requestAnimationFrame(estabilizar);
    }).observe(lectura, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', estabilizar, { once:true });
  } else {
    estabilizar();
  }
})();
