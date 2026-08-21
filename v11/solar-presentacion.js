/** TU ELEMENTO — presentación transversal del calendario solar chino */
(function(){
  'use strict';
  if(typeof document==='undefined')return;

  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function cap(x){x=String(x||'');return x.charAt(0).toUpperCase()+x.slice(1);}

  function perfilVistaResultado(){
    try{
      var q=new URLSearchParams(location.search).get('perfil');
      if(q&&typeof leerPerfil==='function'){var p=leerPerfil(q);if(p)return p;}
    }catch(e){}
    if(typeof listarPerfiles!=='function')return null;
    var ps=listarPerfiles().slice().sort(function(a,b){return Number(b.actualizado||0)-Number(a.actualizado||0);});
    return ps[0]||null;
  }

  function instalarPistaFormulario(){
    var mes=document.getElementById('mes');
    if(!mes||document.querySelector('[data-pista-solar-form]'))return;
    var campo=mes.closest('.campo');if(!campo)return;
    var p=document.createElement('p');p.className='fechaSolarPista';p.setAttribute('data-pista-solar-form','');
    p.innerHTML='Ingresa tu <strong>fecha gregoriana</strong>. La carta ubica automáticamente en qué mes y año del calendario solar chino cayó.';
    var trio=campo.querySelector('.trio');
    if(trio)trio.insertAdjacentElement('afterend',p);else campo.appendChild(p);
  }

  function decorarResultado(){
    var hero=document.getElementById('resultadoHero');
    if(!hero||!hero.children.length||hero.querySelector('.resultadoCalendarioSolar'))return;
    if(typeof periodoSolarParaFechaCivil!=='function')return;
    var p=perfilVistaResultado();if(!p||!p.nacimiento)return;
    var n=p.nacimiento,periodo;
    try{periodo=periodoSolarParaFechaCivil(n.anio,n.mes,n.dia,n.zona,n.sinHora?12:n.hora,n.sinHora?0:n.minuto);}catch(e){return;}
    var civil=n.dia+' '+MESES[n.mes-1]+' '+n.anio;
    var box=document.createElement('div');box.className='resultadoCalendarioSolar';
    box.innerHTML='<span><b>Fecha civil</b>'+esc(civil)+'</span><span><b>Mes solar chino</b>'+esc(etiquetaMesSolar(periodo))+'</span><span><b>Año solar chino</b>'+esc(etiquetaAnioSolar(periodo))+'</span>';
    var despues=hero.querySelector('.resultadoElemento');
    if(despues)despues.insertAdjacentElement('afterend',box);else hero.appendChild(box);
  }

  function parseFechaDia(){
    var caja=document.getElementById('diaCaja');if(!caja)return null;
    var num=caja.querySelector('.num'),mesTxt=caja.querySelector('.mes');if(!num||!mesTxt)return null;
    var m=String(mesTxt.textContent||'').trim().match(/^(.+?)\s+de\s+(\d{4})$/i);if(!m)return null;
    var mi=MESES.indexOf(m[1].toLowerCase());if(mi<0)return null;
    return {anio:Number(m[2]),mes:mi+1,dia:Number(num.textContent)};
  }

  function decorarDiaCalendario(){
    var f=parseFechaDia();if(!f||typeof periodoSolarParaFechaCivil!=='function')return;
    var cab=document.querySelector('#diaCaja .diaCab');if(!cab||cab.querySelector('.calSolarLinea'))return;
    var zona=typeof zonaNavegador==='function'?zonaNavegador():null,periodo;
    try{periodo=periodoSolarParaFechaCivil(f.anio,f.mes,f.dia,zona,12,0);}catch(e){return;}
    var mesCivil=cab.querySelector('.mes');if(!mesCivil)return;
    var linea=document.createElement('div');linea.className='calSolarLinea';
    linea.innerHTML='<span>Mes solar chino</span><strong>'+esc(etiquetaMesSolar(periodo))+'</strong><small>'+esc(rangoPeriodoSolar(periodo))+' · '+esc(periodo.inicio.nombre)+' → '+esc(periodo.fin.nombre)+'</small><p class="calSolarAnio"><b>Año solar chino:</b> '+esc(etiquetaAnioSolar(periodo))+'</p>';
    mesCivil.insertAdjacentElement('afterend',linea);
  }

  function parseTituloMes(){
    var t=document.getElementById('mesTitulo');if(!t)return null;
    var s=String(t.textContent||'').trim().split(/\s+/);if(s.length<2)return null;
    var mi=MESES.indexOf(s[0].toLowerCase());var y=Number(s[s.length-1]);
    return mi<0||!y?null:{anio:y,mes:mi+1};
  }

  function decorarMesCalendario(){
    var t=parseTituloMes(),out=document.getElementById('mesSolarTitulo');if(!t||!out||typeof resumenMesGregoriano!=='function')return;
    var zona=typeof zonaNavegador==='function'?zonaNavegador():null,r;
    try{r=resumenMesGregoriano(t.anio,t.mes,zona);}catch(e){return;}
    out.textContent=etiquetaResumenMesGregoriano(r);
    var caja=document.getElementById('mesCaja');if(!caja||!r.cambia||!r.cambio)return;
    var boton=caja.querySelector('.celda[data-d="'+r.cambio.dia+'"]');
    if(boton){
      boton.classList.add('solarCorte');
      var antes=boton.getAttribute('aria-label')||'';
      boton.setAttribute('aria-label',antes+'. Aquí empieza el mes solar chino de '+r.final.animal+'.');
      boton.title='Empieza el mes solar chino de '+r.final.animal+' · '+r.final.inicio.nombre;
    }
  }

  function instalarObservadores(){
    var hero=document.getElementById('resultadoHero');
    if(hero){new MutationObserver(decorarResultado).observe(hero,{childList:true,subtree:false});decorarResultado();}
    var dia=document.getElementById('diaCaja');
    if(dia){new MutationObserver(decorarDiaCalendario).observe(dia,{childList:true});decorarDiaCalendario();}
    var mes=document.getElementById('mesCaja');
    if(mes){new MutationObserver(decorarMesCalendario).observe(mes,{childList:true});decorarMesCalendario();}
  }

  instalarPistaFormulario();
  instalarObservadores();
})();
