/** TU ELEMENTO — nomenclatura de releases */
(function (raiz) {
  'use strict';

  var CODENAMES = [
    'Artx','Broadway','Cell','Dolphin','Espresso','Flipper','Gekko','Hikaru','Indy','Jerry','Katana','Latte','Madam',
    'Naomi','Onyx','Prospero','QSound','Reality','SuperFX','Tegra','Ultra','Voodoo','Wolf','Xenon','YBoard','Zilog'
  ];

  var RELEASE = Object.freeze({
    major: 2,
    minor: 1,
    patch: 5,
    codename: CODENAMES[1],
    label: 'V2 Broadway · Copy Preview',
    build: '2.1.5-copy-v2-preview'
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
      if (!document.getElementById('te-copy-v2-preview-css')) {
        var previewCss = document.createElement('link');
        previewCss.id = 'te-copy-v2-preview-css';
        previewCss.rel = 'stylesheet';
        previewCss.href = base + 'copy-v2-preview.css?b=' + RELEASE.build;
        document.head.appendChild(previewCss);
      }
      if (!document.getElementById('te-copy-v2-preview-js')) {
        var previewJs = document.createElement('script');
        previewJs.id = 'te-copy-v2-preview-js';
        previewJs.src = base + 'copy-v2-preview.js?b=' + RELEASE.build;
        previewJs.defer = true;
        document.head.appendChild(previewJs);
      }
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
