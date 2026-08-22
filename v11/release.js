/** TU ELEMENTO — nomenclatura de releases */
(function (raiz) {
  'use strict';

  var CODENAMES = [
    'Artx','Broadway','Cell','Dolphin','Espresso','Flipper','Gekko','Hikaru','Indy','Jerry','Katana','Latte','Madam',
    'Naomi','Onyx','Prospero','QSound','Reality','SuperFX','Tegra','Ultra','Voodoo','Wolf','Xenon','YBoard','Zilog'
  ];

  var RELEASE = Object.freeze({
    major: 3,
    minor: 0,
    patch: 0,
    codename: CODENAMES[2],
    label: 'V3 Cell Preview',
    build: '3.0.0-cell-preview'
  });

  function nombreVersion(major, minor, patch) {
    major = Math.max(1, Number(major) || 1);
    minor = Math.max(0, Number(minor) || 0);
    patch = Math.max(0, Number(patch) || 0);
    var codename = CODENAMES[(major - 1) % CODENAMES.length];
    var numero = 'V' + major;
    if (minor || patch) numero += '.' + minor;
    if (patch) numero += '.' + patch;
    return numero + ' ' + codename;
  }

  raiz.TU_ELEMENTO_CODENAMES = CODENAMES.slice();
  raiz.TU_ELEMENTO_RELEASE = RELEASE;
  raiz.nombreVersionTuElemento = nombreVersion;

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-release', RELEASE.label);
    var actual = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
    var base = actual ? actual.replace(/release\.js(?:\?.*)?$/,'') : '';
    if (base) {
      if (!document.getElementById('te-ecosistema-css')) {
        var link = document.createElement('link');
        link.id = 'te-ecosistema-css';
        link.rel = 'stylesheet';
        link.href = base + 'ecosistema.css?b=' + RELEASE.build;
        document.head.appendChild(link);
      }
      if (!document.getElementById('te-ecosistema-js')) {
        var script = document.createElement('script');
        script.id = 'te-ecosistema-js';
        script.src = base + 'ecosistema.js?b=' + RELEASE.build;
        script.defer = true;
        document.head.appendChild(script);
      }
      if (/\/v11\/index\.html$/.test(location.pathname)) {
        raiz.addEventListener('load', function () {
          if (document.getElementById('te-copy-v3')) return;
          var copy = document.createElement('script');
          copy.id = 'te-copy-v3';
          copy.src = base + 'copy-v3.js?b=' + RELEASE.build;
          copy.async = false;
          copy.onload = function () {
            var renderer = document.createElement('script');
            renderer.id = 'te-carta-v3-render';
            renderer.src = base + 'carta-v3-render.js?b=' + RELEASE.build;
            renderer.async = false;
            document.body.appendChild(renderer);
          };
          document.body.appendChild(copy);
        }, {once:true});
      }
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
