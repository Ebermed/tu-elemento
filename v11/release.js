/** TU ELEMENTO — nomenclatura de releases */
(function (raiz) {
  'use strict';

  var CODENAMES = [
    'Artx','Broadway','Cell','Dolphin','Espresso','Flipper','Gekko','Hikaru','Indy','Jerry','Katana','Latte','Madam',
    'Naomi','Onyx','Prospero','QSound','Reality','SuperFX','Tegra','Ultra','Voodoo','Wolf','Xenon','YBoard','Zilog'
  ];

  var RELEASE = Object.freeze({
    major: 2,
    minor: 0,
    patch: 0,
    codename: CODENAMES[1],
    label: 'V2 Broadway',
    build: '2.0.0-broadway'
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
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-release', RELEASE.label);
})(typeof globalThis !== 'undefined' ? globalThis : this);
