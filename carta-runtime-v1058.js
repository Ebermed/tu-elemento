/* TU ELEMENTO — V10.5.8 · runtime ligero de carta
   La lectura queda fuera del sistema global de blur/reveal. */
(function () {
  'use strict';
  if (typeof globalThis === 'undefined' || typeof document === 'undefined') return;

  var original = globalThis.activarApariciones;
  if (typeof original === 'function') {
    globalThis.activarApariciones = function (scope) {
      if (scope && scope.id === 'lectura') {
        var nodos = scope.querySelectorAll('.hoja,.inter,.vidrio,.col,.panel,.revela');
        Array.prototype.forEach.call(nodos, function (n) {
          n.classList.remove('revela-prep','revela-viva');
          if (n.style) {
            n.style.opacity = '1';
            n.style.filter = 'none';
            n.style.transform = 'none';
            n.style.transition = 'none';
            n.style.willChange = 'auto';
          }
        });
        return;
      }
      return original(scope);
    };
  }

  var style = document.createElement('style');
  style.id = 'carta-runtime-v1058-css';
  style.textContent = [
    '#lectura .hoja,#lectura .inter,#lectura .vidrio,#lectura .col,#lectura .panel{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important;transform:none!important;will-change:auto!important}',
    '#lectura .revela-prep,#lectura .revela-prep.revela-viva{opacity:1!important;filter:none!important;transform:none!important;transition:none!important}',
    '#lectura .hoja{background:rgba(255,253,249,.93)!important}',
    '#lectura .inter{background:rgba(255,255,255,.34)!important}'
  ].join('\n');
  document.head.appendChild(style);
})();
