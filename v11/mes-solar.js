/**
 * TU ELEMENTO — cortes solares de Tu mes
 *
 * Traduce la navegación enero–diciembre a los 12 meses solares BaZi:
 *   enero    → Xiao Han / Buey
 *   febrero  → Li Chun / Tigre
 *   marzo    → Jing Zhe / Conejo
 *   ...
 *   diciembre→ Da Xue / Rata
 *
 * Los límites se toman del instante astronómico Jié calculado por motor.js.
 * La fecha civil mostrada se convierte a la zona IANA guardada en la carta.
 */
(function(raiz){
  'use strict';

  function dep(nombre,ruta){
    if(typeof globalThis!=='undefined'&&globalThis[nombre]!==undefined)return globalThis[nombre];
    if(typeof require!=='undefined'){try{return require(ruta)[nombre];}catch(e){}}
    return undefined;
  }

  var MESES_ES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  function tsDesdeJD(J){return (J-2440587.5)*86400000;}

  function localDesdeJD(J,zona){
    var desdeJD=dep('desdeJD','./motor');
    var offsetEnZona=dep('offsetEnZona','./zonas');
    var off=8;
    if(zona&&offsetEnZona){
      try{off=offsetEnZona(tsDesdeJD(J),zona);}catch(e){}
    }
    var d=desdeJD(J+off/24);
    d.offset=off;
    return d;
  }

  function terminoParaMes(anio,mes){
    var terms=dep('terminosDelAnio','./motor');
    if(mes===1){
      var prev=terms(anio-1,8),actual=terms(anio,8);
      return {inicio:prev[11],fin:actual[0]};
    }
    var lista=terms(anio,8),i=mes-2;
    return {inicio:lista[i],fin:lista[i+1]};
  }

  function periodoSolarParaMes(anio,mes,zona){
    anio=Number(anio);mes=Number(mes);
    if(mes<1||mes>12)throw new Error('Tu mes: mes fuera de rango.');
    var par=terminoParaMes(anio,mes);
    var mid=(par.inicio.jd+par.fin.jd)/2;
    var desdeJD=dep('desdeJD','./motor');
    var cuatro=dep('cuatroPilares','./motor');
    var utc=desdeJD(mid);
    var transito=cuatro({anio:utc.anio,mes:utc.mes,dia:utc.dia,hora:utc.hora,minuto:utc.minuto,offsetTZ:0});
    return {
      anioGregoriano:anio,
      mesGregoriano:mes,
      etiqueta:MESES_ES[mes-1],
      inicio:par.inicio,
      fin:par.fin,
      inicioLocal:localDesdeJD(par.inicio.jd,zona),
      finLocal:localDesdeJD(par.fin.jd,zona),
      zona:zona||'Asia/Shanghai',
      transito:transito,
      pilar:transito.pilares.mes,
      pilarAnio:transito.pilares.anio
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
