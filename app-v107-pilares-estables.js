/* TU ELEMENTO — V10.7 · selector de pilares estable para iOS
   Sustituye el acordeón de cuatro paneles por cuatro botones + un único panel.
   El cambio de pilar modifica contenido, sin animar altura, blur ni transforms. */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  var ESTILO = [
    '.pilaresHojaEstable{',
      '-webkit-backdrop-filter:none!important;backdrop-filter:none!important;',
      'filter:none!important;transform:none!important;transition:none!important;',
      'background:rgba(255,255,255,.68)!important;',
    '}',
    '.pilaresHojaEstable *{filter:none!important;will-change:auto!important;}',
    '.pilaresTabsEstables{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:18px 0 14px;}',
    '.pilarTabEstable{appearance:none;-webkit-appearance:none;border:1px solid rgba(255,255,255,.78);',
      'background:rgba(255,255,255,.48);border-radius:22px;min-width:0;padding:13px 6px 12px;',
      'color:var(--tinta);font:inherit;text-align:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.88);',
      'transition:none!important;transform:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}',
    '.pilarTabEstable[aria-selected="true"]{background:rgba(255,255,255,.90);border-color:rgba(255,255,255,.96);',
      'box-shadow:0 7px 20px rgba(58,43,34,.07),inset 0 1px 0 #fff;}',
    '.pilarTabEstable .rot{display:flex;align-items:center;justify-content:center;gap:5px;min-height:28px;',
      'font-size:9px;font-weight:780;letter-spacing:1.35px;text-transform:uppercase;color:var(--tinta-suave);}',
    '.pilarTabEstable .rot .iconito{width:25px!important;height:25px!important;min-width:25px!important;margin:0!important;background:rgba(255,255,255,.54)!important;}',
    '.pilarTabEstable .rot .iconito svg{width:15px!important;height:15px!important;}',
    '.pilarTabEstable .an{display:block;margin-top:7px;font-family:Georgia,serif;font-size:clamp(17px,4.3vw,24px);line-height:1.05;}',
    '.pilarTabEstable .el{display:block;margin-top:3px;font-family:Georgia,serif;font-size:14px;font-style:italic;color:var(--tinta-suave);}',
    '.pilarTabEstable .vac{display:inline-block;margin-top:6px;padding:3px 7px;border-radius:999px;font-size:8px;letter-spacing:1.1px;text-transform:uppercase;background:rgba(255,255,255,.65);}',
    '.pilarTabEstable .mas{display:none!important;}',
    '.pilarDetalleEstable{min-height:238px;margin-top:8px;padding:22px 20px 20px;border-radius:24px;',
      'background:rgba(255,255,255,.52);border:1px solid rgba(255,255,255,.76);',
      'box-shadow:inset 0 1px 0 rgba(255,255,255,.84);',
      '-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important;transform:none!important;transition:none!important;}',
    '.pilarDetalleEstable .quien{margin-top:0;}',
    '@media(max-width:430px){.pilaresTabsEstables{gap:6px}.pilarTabEstable{padding-left:4px;padding-right:4px;border-radius:19px}.pilarTabEstable .rot{font-size:8px;letter-spacing:.9px}.pilarDetalleEstable{min-height:250px;padding:20px 17px}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'v107-pilares-estables-css';
  style.textContent = ESTILO;
  document.head.appendChild(style);

  function limpiarBoton(original, indice) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pilarTabEstable';
    b.setAttribute('data-pilar-estable', String(indice));
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', indice === 0 ? 'true' : 'false');
    b.innerHTML = original.innerHTML;
    var mas = b.querySelector('.mas');
    if (mas) mas.remove();
    return b;
  }

  function instalarEnHoja(hoja) {
    if (!hoja || hoja.getAttribute('data-pilares-v107') === '1') return false;
    var columnas = hoja.querySelector('.columnas');
    if (!columnas) return false;
    var originales = columnas.querySelectorAll('.col[data-p]');
    var paneles = hoja.querySelectorAll('.panel[id^="pan"]');
    if (!originales.length || !paneles.length) return false;

    var contenidos = [];
    for (var i = 0; i < originales.length; i++) {
      var id = originales[i].getAttribute('data-p');
      var panel = hoja.querySelector('#pan' + id);
      contenidos.push(panel ? panel.innerHTML : '');
    }

    var tabs = document.createElement('div');
    tabs.className = 'pilaresTabsEstables';
    tabs.setAttribute('role', 'tablist');
    for (var j = 0; j < originales.length; j++) tabs.appendChild(limpiarBoton(originales[j], j));

    var detalle = document.createElement('div');
    detalle.className = 'pilarDetalleEstable';
    detalle.setAttribute('role', 'tabpanel');
    detalle.innerHTML = contenidos[0] || '';

    columnas.parentNode.replaceChild(tabs, columnas);
    for (var k = 0; k < paneles.length; k++) paneles[k].remove();
    tabs.insertAdjacentElement('afterend', detalle);

    hoja.classList.add('pilaresHojaEstable');
    hoja.classList.remove('revela-prep', 'revela-viva');
    hoja.style.filter = 'none';
    hoja.style.transform = 'none';
    hoja.style.opacity = '1';
    hoja.style.removeProperty('--reveal-delay');
    hoja.setAttribute('data-pilares-v107', '1');

    tabs.addEventListener('click', function (e) {
      var boton = e.target && e.target.closest ? e.target.closest('.pilarTabEstable') : null;
      if (!boton || !tabs.contains(boton)) return;
      e.preventDefault();
      var indice = parseInt(boton.getAttribute('data-pilar-estable'), 10) || 0;
      var botones = tabs.querySelectorAll('.pilarTabEstable');
      for (var n = 0; n < botones.length; n++) botones[n].setAttribute('aria-selected', n === indice ? 'true' : 'false');
      detalle.innerHTML = contenidos[indice] || '';
    });
    return true;
  }

  function instalar() {
    var lectura = document.getElementById('lectura');
    if (!lectura) return;
    var hojas = lectura.querySelectorAll('.hoja');
    for (var i = 0; i < hojas.length; i++) {
      if (hojas[i].querySelector('.columnas .col[data-p]')) instalarEnHoja(hojas[i]);
    }
  }

  var lectura = document.getElementById('lectura');
  if (lectura && typeof MutationObserver !== 'undefined') {
    var pendiente = false;
    var observer = new MutationObserver(function () {
      if (pendiente) return;
      pendiente = true;
      setTimeout(function () { pendiente = false; instalar(); }, 0);
    });
    observer.observe(lectura, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', instalar, { once:true });
  else instalar();

  globalThis.__tuElementoPilaresV107 = { instalar:instalar };
})();
