(function () {
  'use strict';

  /*
   * V10.6 · El revelado original dejaba filter/transform activos aun después
   * de terminar la animación. En iOS Safari eso obliga a recomponer capas
   * grandes cuando un pilar cambia de altura. Esta versión anima únicamente
   * opacidad y libera los estilos inmediatamente después.
   */
  globalThis.activarApariciones = function (scope) {
    var raiz = scope && scope.querySelectorAll ? scope : document;
    var nodos = raiz.querySelectorAll('.hoja, .inter, .vidrio, .revela');
    if (!nodos || !nodos.length) return;

    for (var i = 0; i < nodos.length; i++) {
      var n = nodos[i];
      n.classList.remove('revela-prep', 'revela-viva');
      n.style.filter = 'none';
      n.style.transform = 'none';
      n.style.opacity = '1';
      n.style.removeProperty('--reveal-delay');
    }
  };

  document.documentElement.classList.add('modo-carta-ligero');
})();
