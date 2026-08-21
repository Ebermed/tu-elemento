(function () {
  'use strict';

  function sinCartas() {
    try { return typeof listarPerfiles === 'function' && listarPerfiles().length === 0; }
    catch (e) { return false; }
  }

  function cerrarTooltips(excepto) {
    var abiertos = document.querySelectorAll('.lecturaGeneralTooltip[data-abierto="1"]');
    Array.prototype.forEach.call(abiertos, function (tip) {
      if (tip === excepto) return;
      tip.hidden = true;
      tip.setAttribute('data-abierto','0');
      var btn = tip.parentNode && tip.parentNode.querySelector('.lecturaGeneralAyuda');
      if (btn) btn.setAttribute('aria-expanded','false');
    });
  }

  function etiquetaGeneral() {
    return '<span class="lecturaGeneralEtiqueta">' +
      '<span>Lectura general</span>' +
      '<button class="lecturaGeneralAyuda" type="button" aria-label="¿Qué es una lectura general?" aria-expanded="false">i</button>' +
      '<span class="lecturaGeneralTooltip" role="tooltip" data-abierto="0" hidden>' +
        '<span>Esta lectura usa los ritmos generales del calendario. Con tu carta, el día también se cruza con tu información personal.</span>' +
        '<a href="index.html?nueva=1">Crear mi carta</a>' +
      '</span>' +
    '</span>';
  }

  function pulirDia() {
    var caja = document.getElementById('diaCaja');
    if (!caja) return;

    var si = caja.querySelector('.listas .si h3');
    var evitar = caja.querySelector('.listas .no h3');
    if (si) si.textContent = 'Te recomendamos';
    if (evitar) evitar.textContent = 'Es mejor no hacer';

    if (sinCartas()) {
      var pil = caja.querySelector('.pil');
      if (pil && !pil.querySelector('.lecturaGeneralEtiqueta')) pil.innerHTML = etiquetaGeneral();
    }
  }

  function instalarEstilos() {
    if (document.getElementById('te-cal-copyfix-css')) return;
    var st = document.createElement('style');
    st.id = 'te-cal-copyfix-css';
    st.textContent = [
      '.calSinPerfil{display:none!important}',
      '.lecturaGeneralEtiqueta{position:relative;display:inline-flex;align-items:center;gap:8px;font-family:inherit}',
      '.lecturaGeneralAyuda{width:22px;height:22px;border-radius:999px;border:1px solid rgba(46,42,38,.22);background:rgba(255,255,255,.52);color:var(--tinta);font:600 12px/1 Georgia,serif;display:inline-grid;place-items:center;padding:0;cursor:pointer;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
      '.lecturaGeneralTooltip{position:absolute;z-index:40;left:50%;bottom:calc(100% + 12px);transform:translateX(-50%);width:min(290px,78vw);padding:13px 14px;border-radius:16px;background:rgba(255,253,249,.94);border:1px solid rgba(255,255,255,.9);box-shadow:0 12px 34px rgba(46,42,38,.14);font-family:var(--sans);font-size:13px;line-height:1.45;text-align:left;color:var(--tinta-suave);-webkit-backdrop-filter:blur(20px) saturate(150%);backdrop-filter:blur(20px) saturate(150%)}',
      '.lecturaGeneralTooltip[hidden]{display:none}',
      '.lecturaGeneralTooltip a{display:inline-block;margin-top:8px;color:var(--tinta);font-weight:600;text-decoration:underline;text-underline-offset:3px}',
      '.lecturaGeneralTooltip:after{content:"";position:absolute;left:50%;top:100%;width:12px;height:12px;background:rgba(255,253,249,.94);border-right:1px solid rgba(255,255,255,.9);border-bottom:1px solid rgba(255,255,255,.9);transform:translate(-50%,-6px) rotate(45deg)}'
    ].join('');
    document.head.appendChild(st);
  }

  instalarEstilos();
  pulirDia();

  var caja = document.getElementById('diaCaja');
  if (caja && typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () { pulirDia(); }).observe(caja, { childList:true, subtree:true });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.lecturaGeneralAyuda') : null;
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      var tip = btn.parentNode.querySelector('.lecturaGeneralTooltip');
      var abrir = tip.hidden;
      cerrarTooltips(abrir ? tip : null);
      tip.hidden = !abrir;
      tip.setAttribute('data-abierto', abrir ? '1' : '0');
      btn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      return;
    }
    var dentro = e.target && e.target.closest ? e.target.closest('.lecturaGeneralTooltip') : null;
    if (!dentro) cerrarTooltips(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarTooltips(null);
  });
})();