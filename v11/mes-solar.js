/**
 * TU ELEMENTO — cortes solares de Tu mes
 *
 * Esta capa reutiliza calendario-solar.js para que carta, calendario y
 * lectura mensual compartan exactamente los mismos cortes Jié.
 */
(function(raiz){
  'use strict';

  var MESES_ES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  function periodoSolarParaMes(anio,mes,zona){
    anio=Number(anio);mes=Number(mes);
    if(mes<1||mes>12)throw new Error('Tu mes: mes fuera de rango.');
    if(typeof raiz.resumenMesGregoriano!=='function')throw new Error('Tu mes: falta calendario-solar.js.');
    var resumen=raiz.resumenMesGregoriano(anio,mes,zona);
    var p=resumen.final;
    return {
      anioGregoriano:anio,
      mesGregoriano:mes,
      etiqueta:MESES_ES[mes-1],
      inicio:p.inicio,
      fin:p.fin,
      inicioLocal:p.inicioLocal,
      finLocal:p.finLocal,
      zona:p.zona,
      transito:p.transito,
      pilar:p.pilarMes,
      pilarAnio:p.pilarAnio
    };
  }

  function dinamicaMes(carta,pMes,sinHora){
    var dinamica=raiz.dinamicaMensualDeTallo(carta.diaMaestro,pMes.tallo);
    var secundarias=raiz.tallosOcultosMes(pMes.rama).map(function(t){return raiz.dinamicaMensualDeTallo(carta.diaMaestro,t);});
    var ritmo=raiz.ritmoCicloMes(carta.diaMaestro,pMes.rama);
    var inter=raiz.interaccionesMensuales(carta,pMes.rama,sinHora);
    var area=raiz.TE_AREAS_MES[dinamica.area];
    return {dinamica:dinamica,secundarias:secundarias,ritmo:ritmo,inter:inter,area:area};
  }

  function lecturaMensualSolar(carta,opciones){
    opciones=opciones||{};
    var anio=Number(opciones.anio),mes=Number(opciones.mes),sinHora=!!opciones.sinHora;
    if(!carta||!anio||!mes)throw new Error('Tu mes: faltan carta, año o mes.');
    var periodo=periodoSolarParaMes(anio,mes,opciones.zona);
    var x=dinamicaMes(carta,periodo.pilar,sinHora);
    return {
      anio:anio,mes:mes,
      periodoSolar:periodo,
      transito:periodo.transito,
      pilar:periodo.pilar,
      pilarAnio:periodo.pilarAnio,
      diaMaestro:carta.diaMaestro,
      dinamicaPrincipal:x.dinamica,
      dinamicasSecundarias:x.secundarias,
      ritmo:x.ritmo,
      interacciones:x.inter,
      area:x.area,
      resumen:{
        titulo:'Este mes se mueve con '+x.dinamica.nombre+'.',
        subtitulo:x.area.titulo+' · '+x.area.tema,
        foco:x.ritmo.trabajar[0]+'. Después, '+x.area.trabajar[0]+'.',
        recomendacion:x.area.trabajar[1]+'. '+x.ritmo.trabajar[1]+'.',
        atencion:x.area.cuidado+' '+x.ritmo.cuidado,
        puede:x.area.puede.slice(0,2).concat(x.ritmo.puede.slice(0,2)),
        trabajar:x.area.trabajar.slice(0,2).concat(x.ritmo.trabajar.slice(0,2))
      }
    };
  }

  var api={periodoSolarParaMes:periodoSolarParaMes,lecturaMensualSolar:lecturaMensualSolar};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else for(var k in api)raiz[k]=api[k];
})(typeof globalThis!=='undefined'?globalThis:this);
