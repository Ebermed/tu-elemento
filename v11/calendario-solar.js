/**
 * TU ELEMENTO — contexto compartido del calendario solar chino
 * ------------------------------------------------------------------
 * Una sola fuente para mostrar en carta, calendario y módulos nuevos:
 *   · mes gregoriano visible,
 *   · mes solar chino activo,
 *   · corte Jié real del año,
 *   · año solar chino, cuyo cambio ocurre en Li Chun.
 *
 * Los cortes se calculan astronómicamente con motor.js. Las fechas
 * civiles se convierten a la zona IANA correspondiente antes de mostrarse.
 */
(function(raiz){
  'use strict';

  var MESES_ES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  function dep(nombre){ return raiz[nombre]; }
  function cap(x){x=String(x||'');return x.charAt(0).toUpperCase()+x.slice(1);}
  function tsDesdeJD(J){return (J-2440587.5)*86400000;}
  function jdDesdeTS(ts){return 2440587.5+ts/86400000;}

  function zonaNavegador(){
    try{return Intl.DateTimeFormat().resolvedOptions().timeZone||null;}catch(e){return null;}
  }

  function localDesdeJD(J,zona){
    var desdeJD=dep('desdeJD'),offsetEnZona=dep('offsetEnZona');
    var off=0;
    if(zona&&offsetEnZona){try{off=offsetEnZona(tsDesdeJD(J),zona);}catch(e){off=0;}}
    var d=desdeJD(J+off/24);d.offset=off;return d;
  }

  function instanteDesdeCivil(anio,mes,dia,hora,minuto,zona){
    hora=hora==null?12:hora;minuto=minuto||0;
    var utcDesdeLocal=dep('utcDesdeLocal');
    if(zona&&utcDesdeLocal){
      try{return utcDesdeLocal(anio,mes,dia,hora,minuto,zona).ts;}catch(e){}
    }
    return new Date(anio,mes-1,dia,hora,minuto,0,0).getTime();
  }

  function terminosCercanos(anio){
    var terminosDelAnio=dep('terminosDelAnio');
    var todos=[];
    [anio-1,anio,anio+1].forEach(function(y){
      (terminosDelAnio(y,8)||[]).forEach(function(t){todos.push(t);});
    });
    todos.sort(function(a,b){return a.jd-b.jd;});
    return todos.filter(function(t,i){return !i||Math.abs(t.jd-todos[i-1].jd)>1e-5;});
  }

  function periodoSolarDeInstante(ts,zona){
    var desdeJD=dep('desdeJD'),cuatroPilares=dep('cuatroPilares'),RAMAS=dep('RAMAS');
    if(!desdeJD||!cuatroPilares||!RAMAS)throw new Error('Calendario solar: faltan dependencias del motor.');
    var J=jdDesdeTS(ts),anioUTC=new Date(ts).getUTCFullYear();
    var terms=terminosCercanos(anioUTC),i=-1;
    for(var k=0;k<terms.length-1;k++)if(terms[k].jd<=J&&J<terms[k+1].jd){i=k;break;}
    if(i<0)throw new Error('Calendario solar: periodo fuera del rango calculado.');
    var inicio=terms[i],fin=terms[i+1],mid=(inicio.jd+fin.jd)/2,utc=desdeJD(mid);
    var transito=cuatroPilares({anio:utc.anio,mes:utc.mes,dia:utc.dia,hora:utc.hora,minuto:utc.minuto,offsetTZ:0});
    var rama=RAMAS[inicio.ramaMes];
    return {
      inicio:inicio,fin:fin,
      inicioLocal:localDesdeJD(inicio.jd,zona),
      finLocal:localDesdeJD(fin.jd,zona),
      zona:zona||zonaNavegador()||'UTC',
      ramaMes:rama,
      animal:cap(rama.animal),
      pilarMes:transito.pilares.mes,
      pilarAnio:transito.pilares.anio,
      transito:transito
    };
  }

  function periodoSolarParaFechaCivil(anio,mes,dia,zona,hora,minuto){
    zona=zona||zonaNavegador();
    return periodoSolarDeInstante(instanteDesdeCivil(anio,mes,dia,hora,minuto,zona),zona);
  }

  function resumenMesGregoriano(anio,mes,zona){
    zona=zona||zonaNavegador();
    var ultimo=new Date(anio,mes,0).getDate();
    var primero=periodoSolarParaFechaCivil(anio,mes,1,zona,12,0);
    var final=periodoSolarParaFechaCivil(anio,mes,ultimo,zona,12,0);
    return {
      anio:anio,mes:mes,zona:zona,
      primero:primero,final:final,
      cambia:primero.pilarMes.nombre!==final.pilarMes.nombre,
      cambio:primero.pilarMes.nombre!==final.pilarMes.nombre?final.inicioLocal:null
    };
  }

  function fechaCorta(d){return d.dia+' '+MESES_ES[d.mes-1].slice(0,3);}
  function rangoPeriodo(p){return fechaCorta(p.inicioLocal)+' — '+fechaCorta(p.finLocal);}
  function etiquetaPilarAmable(p){
    if(!p)return '';
    return cap(p.rama.animal)+' · '+cap(p.tallo.elemento)+' '+(p.tallo.yang?'Yang':'Yin');
  }
  function etiquetaMesSolar(p){return p.animal+' · '+cap(p.pilarMes.tallo.elemento)+' '+(p.pilarMes.tallo.yang?'Yang':'Yin');}
  function etiquetaAnioSolar(p){return cap(p.pilarAnio.rama.animal)+' · '+cap(p.pilarAnio.tallo.elemento)+' '+(p.pilarAnio.tallo.yang?'Yang':'Yin');}
  function etiquetaResumenGregoriano(r){
    if(!r.cambia)return etiquetaMesSolar(r.primero);
    return r.primero.animal+' → '+r.final.animal+' · cambio '+fechaCorta(r.cambio);
  }

  var api={
    zonaNavegador:zonaNavegador,
    periodoSolarDeInstante:periodoSolarDeInstante,
    periodoSolarParaFechaCivil:periodoSolarParaFechaCivil,
    resumenMesGregoriano:resumenMesGregoriano,
    fechaSolarCorta:fechaCorta,
    rangoPeriodoSolar:rangoPeriodo,
    etiquetaPilarSolar:etiquetaPilarAmable,
    etiquetaMesSolar:etiquetaMesSolar,
    etiquetaAnioSolar:etiquetaAnioSolar,
    etiquetaResumenMesGregoriano:etiquetaResumenGregoriano
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else for(var k in api)raiz[k]=api[k];
})(typeof globalThis!=='undefined'?globalThis:this);
