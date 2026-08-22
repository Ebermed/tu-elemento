/**
 * TU ELEMENTO V2 BROADWAY — Carta profunda
 * ------------------------------------------------------------------
 * Capa derivada de la carta natal. Mantiene el motor clásico separado
 * de la interpretación editorial.
 *
 * Incluye:
 *  - mezcla de cinco elementos;
 *  - diez perfiles relacionales y perfil principal;
 *  - Tu brújula (cálculo Ming Gong, nombre editorial propio);
 *  - Tu punto de partida (cálculo Tai Yuan, nombre editorial propio);
 *  - vacíos y nudo de fondo;
 *  - recurso de equilibrio (selección estacional, expresada como guía,
 *    no como predicción ni como diagnóstico).
 */
(function (raiz) {
  'use strict';

  function dep(nombre, ruta) {
    if (raiz && raiz[nombre] !== undefined) return raiz[nombre];
    if (typeof require !== 'undefined') {
      try { return require(ruta)[nombre]; } catch (e) {}
    }
    return undefined;
  }

  var ELEMENTOS = ['madera','fuego','tierra','metal','agua'];
  var OCULTOS = {
    Zi:[9], Chou:[5,9,7], Yin:[0,2,4], Mao:[1], Chen:[4,1,9], Si:[2,4,6],
    Wu:[3,5], Wei:[5,3,1], Shen:[6,8,4], You:[7], Xu:[4,7,3], Hai:[8,0]
  };

  var TERRITORIOS = {
    anio:{titulo:'Tu origen',tema:'pertenencia, familia y el contexto del que vienes'},
    mes:{titulo:'Tu trayectoria',tema:'trabajo, responsabilidades y la manera de abrirte camino'},
    dia:{titulo:'Tu centro',tema:'identidad, intimidad y decisiones que sientes muy tuyas'},
    hora:{titulo:'Tu futuro',tema:'proyectos, vida privada y lo que quieres dejar construido'}
  };

  var ELEMENTO_COPY = {
    madera:{verbo:'abrir camino',fortaleza:'La madera empuja a empezar, crecer y buscar una dirección.',cuidado:'Cuando ocupa demasiado espacio, varias cosas pueden querer crecer al mismo tiempo.',probar:['elige una prioridad que sí quieras hacer crecer durante las próximas semanas','convierte una idea en un primer paso con fecha','revisa qué proyecto ya creció suficiente y necesita otra etapa']},
    fuego:{verbo:'hacer visible',fortaleza:'El fuego mueve expresión, entusiasmo y presencia.',cuidado:'Cuando se concentra demasiado, mostrar y responder puede gastar más energía de la que devuelve.',probar:['muestra una versión suficientemente clara antes de pulirla de más','reserva ratos donde nadie te pida respuesta ni presencia','celebra avances concretos para que el impulso tenga un cierre']},
    tierra:{verbo:'sostener',fortaleza:'La tierra organiza, da continuidad y crea puntos de apoyo.',cuidado:'Cuando pesa demasiado, sostener lo conocido puede volver más lento un cambio que ya hace falta.',probar:['pon una rutina pequeña al servicio de algo importante','separa estabilidad de costumbre: conserva lo que funciona y mueve lo demás','termina una tarea antes de convertirla en un sistema entero']},
    metal:{verbo:'elegir y cerrar',fortaleza:'El metal ayuda a poner límites, ordenar prioridades y decidir dónde termina algo.',cuidado:'Cuando domina, el criterio puede cerrarse antes de que aparezcan todos los matices.',probar:['define dos o tres criterios antes de decidir','cierra un pendiente que sigue ocupando espacio mental','pide una segunda mirada cuando una decisión parezca demasiado obvia']},
    agua:{verbo:'observar y adaptarte',fortaleza:'El agua conecta información, detecta rutas y cambia de estrategia con facilidad.',cuidado:'Cuando se acumula, contemplar demasiadas posibilidades puede quitarle fuerza a una sola dirección.',probar:['pon un límite de tiempo a la investigación antes de decidir','elige una pregunta concreta en lugar de pensar todos los escenarios','deja reposar una decisión y vuelve a ella con un criterio escrito']}
  };

  var PERFIL_COPY = {
    Espejo:{area:'Vínculos',resumen:'Tu propio criterio pesa mucho cuando eliges con quién y cómo moverte.',seNota:'Suele aparecer como independencia, identificación con gente parecida y necesidad de sentir que sigues siendo tú dentro de un grupo.',cuidado:'La autosuficiencia puede hacer que pidas ayuda más tarde de lo necesario.',probar:'Comparte una decisión antes de cerrarla y observa qué parte mejora sin dejar de sentirse tuya.'},
    Contrapunto:{area:'Vínculos',resumen:'El contraste con otras personas te ayuda a definir mejor tu propia posición.',seNota:'La comparación, la negociación y el reparto de espacio se vuelven motores frecuentes para tomar decisiones.',cuidado:'Competir o compararte de más puede hacer que el rumbo dependa de quién tienes enfrente.',probar:'Antes de compararte, escribe qué querías tú cuando todavía no había otra persona en la ecuación.'},
    Flujo:{area:'Expresión',resumen:'Tienes una vía natural para sacar ideas de la cabeza y convertirlas en algo visible.',seNota:'Crear, explicar, enseñar, producir o desarrollar una idea suele darte movimiento.',cuidado:'Producir con facilidad también puede abrir más frentes de los que alcanzas a sostener.',probar:'Termina una pieza antes de premiar a la siguiente idea con toda tu atención.'},
    Impacto:{area:'Expresión',resumen:'Tu expresión gana fuerza cuando puede cuestionar, editar o cambiar algo.',seNota:'Hay facilidad para detectar lo que podría hacerse distinto y para provocar una respuesta en el entorno.',cuidado:'Decir lo necesario con demasiada intensidad puede convertir una mejora en fricción.',probar:'Separa el cambio que quieres conseguir de la reacción que quieres provocar.'},
    Oportunidad:{area:'Recursos',resumen:'Detectas puertas, intercambios y recursos que pueden convertirse en algo útil.',seNota:'Varias opciones pueden aparecer a la vez y tu ventaja está en reconocer cuáles tienen recorrido real.',cuidado:'Una puerta nueva puede parecer mejor solo porque todavía no ha mostrado su costo.',probar:'Pon fecha, costo y siguiente paso a una oportunidad antes de llamarla oportunidad.'},
    Concreción:{area:'Recursos',resumen:'Te mueves mejor cuando el esfuerzo puede convertirse en un resultado claro y sostenible.',seNota:'Administrar, ordenar recursos y construir algo medible suele darte sensación de avance.',cuidado:'Asegurar cada variable puede retrasar un movimiento que ya tiene suficiente estructura.',probar:'Define qué significa “suficientemente resuelto” antes de seguir optimizando.'},
    Desafío:{area:'Estructura',resumen:'La presión puede encender una parte muy resolutiva de ti.',seNota:'Urgencia, competencia y problemas concretos pueden hacer que tu criterio se vuelva rápido y directo.',cuidado:'Vivir siempre en modo reto vuelve difícil distinguir una emergencia real de una costumbre.',probar:'Haz una parte importante antes de que se vuelva urgente y compara cómo cambia tu forma de decidir.'},
    Estructura:{area:'Estructura',resumen:'Responsabilidades, reglas y acuerdos claros pueden ayudarte a ordenar el movimiento.',seNota:'Sueles funcionar bien cuando sabes qué se espera, qué depende de ti y dónde están los límites.',cuidado:'Cumplir por inercia puede hacerte cargar reglas que ya dejaron de servir.',probar:'Elige una obligación actual y pregúntate qué objetivo concreto sigue protegiendo.'},
    Intuición:{area:'Perspectiva',resumen:'Aprendes conectando pistas, referencias y caminos que no siempre son lineales.',seNota:'Las asociaciones inesperadas y las rutas laterales pueden llevarte a soluciones que otros pasan por alto.',cuidado:'Encontrar conexiones en todo puede hacer más difícil saber cuál merece convertirse en decisión.',probar:'Después de una intuición, busca un dato pequeño que pueda confirmarla o corregirla.'},
    Aprendizaje:{area:'Perspectiva',resumen:'El conocimiento te da piso cuando puedes ordenarlo y volverlo aplicable.',seNota:'Estudiar, consultar referencias y entender bien un sistema suele darte seguridad para avanzar.',cuidado:'Prepararte demasiado puede convertirse en una forma elegante de aplazar la prueba real.',probar:'Convierte lo último que aprendiste en una acción que puedas observar esta semana.'}
  };

  function mod(n, m) { return ((n % m) + m) % m; }
  function titulo(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function copia(o) { var r={}; for(var k in o) r[k]=o[k]; return r; }

  function indiceTallo(tallo) {
    var TL=dep('TALLOS','./motor');
    if (!TL || !tallo) return -1;
    var p=typeof tallo==='string'?tallo:tallo.pinyin;
    for(var i=0;i<TL.length;i++) if(TL[i].pinyin===p) return i;
    return -1;
  }
  function indiceRama(rama) {
    var RM=dep('RAMAS','./motor');
    if (!RM || !rama) return -1;
    var p=typeof rama==='string'?rama:rama.pinyin;
    for(var i=0;i<RM.length;i++) if(RM[i].pinyin===p) return i;
    return -1;
  }

  function dinamicaDe(diaMaestro, tallo) {
    var fn=dep('dinamicaMensualDeTallo','./lectura-mensual');
    if(fn) return fn(diaMaestro,tallo);
    var TL=dep('TALLOS','./motor');
    if(!TL) return null;
    var dm=typeof diaMaestro==='string'?TL[indiceTallo(diaMaestro)]:diaMaestro;
    var tv=typeof tallo==='string'?TL[indiceTallo(tallo)]:tallo;
    if(!dm||!tv) return null;
    var iDM=ELEMENTOS.indexOf(dm.elemento),iTV=ELEMENTOS.indexOf(tv.elemento),rel;
    if(iTV===iDM)rel='pares';
    else if(iTV===(iDM+1)%5)rel='salida';
    else if(iTV===(iDM+2)%5)rel='recursos';
    else if(iTV===(iDM+3)%5)rel='presion';
    else rel='soporte';
    var cruzada=dm.yang!==tv.yang;
    var nombres={
      pares:['Espejo','Contrapunto'],salida:['Flujo','Impacto'],recursos:['Oportunidad','Concreción'],
      presion:['Desafío','Estructura'],soporte:['Intuición','Aprendizaje']
    };
    return {nombre:nombres[rel][cruzada?1:0],area:rel,forma:cruzada?'cruzada':'paralela',tallo:tv};
  }

  function tallosOcultos(rama) {
    var TL=dep('TALLOS','./motor');
    var key=typeof rama==='string'?rama:(rama&&rama.pinyin);
    return (OCULTOS[key]||[]).map(function(i){return TL[i];});
  }

  function mezclaDe(carta) {
    var conteo=copia(carta.balanceElementos||{}),total=0,orden=[];
    ELEMENTOS.forEach(function(e){var n=Number(conteo[e]||0);total+=n;orden.push({elemento:e,valor:n});});
    orden.sort(function(a,b){return b.valor-a.valor;});
    var alto=orden[0],bajo=orden[orden.length-1];
    return {
      conteo:conteo,total:total,orden:orden,dominante:alto.elemento,dominanteValor:alto.valor,
      menor:bajo.elemento,menorValor:bajo.valor,
      lecturaDominante:ELEMENTO_COPY[alto.elemento],lecturaMenor:ELEMENTO_COPY[bajo.elemento]
    };
  }

  function talloPorElementoPolaridad(elemento, yang) {
    var TL=dep('TALLOS','./motor');
    for(var i=0;i<TL.length;i++) if(TL[i].elemento===elemento&&TL[i].yang===yang) return TL[i];
    return null;
  }

  function perfilPrincipal(carta, sinHora) {
    var RM=dep('RAMAS','./motor'),TL=dep('TALLOS','./motor');
    var mes=carta.pilares.mes, iMes=indiceRama(mes.rama), rama=RM[iMes], candidato=null,metodo='mes';
    var esTierra=rama.elemento==='tierra';

    if(!esTierra){
      candidato=talloPorElementoPolaridad(rama.elemento,rama.yang);
    } else {
      var ocultos=tallosOcultos(rama);
      var visibles=['mes','anio','dia']; if(!sinHora)visibles.push('hora');
      // Primero se busca una coincidencia exacta con el tallo visible del mes;
      // luego con los demás tallos visibles. Polaridad incluida.
      var prioridades=['mes','anio','dia']; if(!sinHora)prioridades.push('hora');
      outer: for(var p=0;p<prioridades.length;p++){
        var visible=carta.pilares[prioridades[p]].tallo;
        for(var h=0;h<ocultos.length;h++){
          if(visible.pinyin===ocultos[h].pinyin){candidato=ocultos[h];metodo='mes-tierra-repeticion';break outer;}
        }
      }
      if(!candidato){
        var estacion={Chen:'madera',Wei:'fuego',Xu:'metal',Chou:'agua'}[rama.pinyin];
        for(var q=0;q<ocultos.length;q++) if(ocultos[q].elemento===estacion){candidato=ocultos[q];break;}
        metodo='mes-tierra-estacion';
      }
    }
    var dinamica=dinamicaDe(carta.diaMaestro,candidato);
    var copy=dinamica&&PERFIL_COPY[dinamica.nombre]?PERFIL_COPY[dinamica.nombre]:null;
    return {dinamica:dinamica,tallo:candidato,metodo:metodo,copy:copy};
  }

  function perfilesDe(carta, sinHora) {
    var claves=['anio','mes']; if(!sinHora)claves.push('hora');
    var mapa={};
    function sumar(tallo,tipo,pilar){
      var d=dinamicaDe(carta.diaMaestro,tallo); if(!d)return;
      if(!mapa[d.nombre]) mapa[d.nombre]={nombre:d.nombre,area:(PERFIL_COPY[d.nombre]||{}).area||'',total:0,visibles:0,ocultas:0,pilares:[],copy:PERFIL_COPY[d.nombre]};
      var x=mapa[d.nombre];x.total++;x[tipo]++;if(pilar&&x.pilares.indexOf(pilar)===-1)x.pilares.push(pilar);
    }
    claves.forEach(function(k){sumar(carta.pilares[k].tallo,'visibles',k);});
    ['anio','mes','dia'].concat(sinHora?[]:['hora']).forEach(function(k){
      tallosOcultos(carta.pilares[k].rama).forEach(function(t){sumar(t,'ocultas',k);});
    });
    var lista=Object.keys(mapa).map(function(k){return mapa[k];});
    lista.sort(function(a,b){if(b.total!==a.total)return b.total-a.total;if(b.visibles!==a.visibles)return b.visibles-a.visibles;return a.nombre.localeCompare(b.nombre);});
    return {principal:perfilPrincipal(carta,sinHora),apariciones:lista};
  }

  function mismoDiaLocal(J, offset, n) {
    var desde=dep('desdeJD','./motor'); if(!desde||!n)return false;
    var d=desde(J+(Number(offset)||0)/24);
    return d.anio===Number(n.anio)&&d.mes===Number(n.mes)&&d.dia===Number(n.dia);
  }

  function zhongQiNacimiento(carta,nacimiento) {
    var cruce=dep('cruceSolar','./motor'); if(!cruce||!carta.terminoActual)return false;
    var grados=mod(carta.terminoActual.grados+15,360);
    var J=cruce(grados,carta.terminoActual.jd+1);
    return mismoDiaLocal(J,carta.offsetTZ,nacimiento);
  }

  function pilarDesdeIndices(iT,iR) {
    var TL=dep('TALLOS','./motor'),RM=dep('RAMAS','./motor');
    var t=TL[mod(iT,10)],r=RM[mod(iR,12)];
    return {tallo:t,rama:r,nombre:t.pinyin+'-'+r.pinyin,etiqueta:r.animal+' de '+t.elemento+' '+(t.yang?'yang':'yin')};
  }

  function interaccionesDeRama(rama,carta,sinHora) {
    var choque=dep('choque','./motor'),comb=dep('combinacion','./motor');
    var i=indiceRama(rama),out=[];
    var claves=['anio','mes','dia'];if(!sinHora)claves.push('hora');
    claves.forEach(function(k){
      var j=indiceRama(carta.pilares[k].rama),tipo=null;
      if(j===i)tipo='resonancia'; else if(choque(i)===j)tipo='friccion'; else if(comb(i)===j)tipo='enlace';
      if(tipo)out.push({tipo:tipo,pilar:k,titulo:TERRITORIOS[k].titulo,tema:TERRITORIOS[k].tema,rama:carta.pilares[k].rama});
    });
    return out;
  }

  function brujulaDe(carta,nacimiento,sinHora) {
    if(sinHora)return null;
    var iMes=indiceRama(carta.pilares.mes.rama),iHora=indiceRama(carta.pilares.hora.rama),iAnioT=indiceTallo(carta.pilares.anio.tallo);
    var ramaN=32-((iMes+1)+(iHora+1));
    while(ramaN>12)ramaN-=12;while(ramaN<1)ramaN+=12;
    var enZhong=zhongQiNacimiento(carta,nacimiento);
    if(enZhong&&nacimiento&&nacimiento.sexo==='m')ramaN+=1;
    if(enZhong&&nacimiento&&nacimiento.sexo==='h')ramaN-=1;
    while(ramaN>12)ramaN-=12;while(ramaN<1)ramaN+=12;
    var talloN=(iAnioT+1)*2+(ramaN-2);
    while(talloN>10)talloN-=10;while(talloN<1)talloN+=10;
    var p=pilarDesdeIndices(talloN-1,ramaN-1);
    p.enZhongQi=enZhong;p.interacciones=interaccionesDeRama(p.rama,carta,sinHora);
    return p;
  }

  function puntoPartidaDe(carta,sinHora) {
    var iT=indiceTallo(carta.pilares.mes.tallo),iR=indiceRama(carta.pilares.mes.rama);
    var p=pilarDesdeIndices(iT+1,iR+3);
    p.interacciones=interaccionesDeRama(p.rama,carta,sinHora);
    return p;
  }

  function pilaresExtra(carta,nacimiento,sinHora) {
    return {brujula:brujulaDe(carta,nacimiento,sinHora),puntoPartida:puntoPartidaDe(carta,sinHora)};
  }

  function vaciosDeCarta(carta,sinHora) {
    var RM=dep('RAMAS','./motor');
    var indices=(carta.vacio&&carta.vacio.ramas)||[],ramas=indices.map(function(i){return RM[i];});
    var claves=['anio','mes','dia'];if(!sinHora)claves.push('hora');
    var presentes=[];
    claves.forEach(function(k){
      if(k==='dia')return;
      var i=indiceRama(carta.pilares[k].rama);
      if(indices.indexOf(i)!==-1){
        presentes.push({pilar:k,titulo:TERRITORIOS[k].titulo,tema:TERRITORIOS[k].tema,rama:carta.pilares[k].rama,tallo:carta.pilares[k].tallo,dinamica:dinamicaDe(carta.diaMaestro,carta.pilares[k].tallo)});
      }
    });
    var prioridad={mes:0,anio:1,hora:2};presentes.sort(function(a,b){return prioridad[a.pilar]-prioridad[b.pilar];});
    return {ramas:ramas,presentes:presentes};
  }

  function nudoDeFondo(carta,sinHora) {
    var vac=vaciosDeCarta(carta,sinHora),lecFn=dep('lecturaCompleta','./lectura'),lec=lecFn?lecFn(carta,sinHora):null;
    var items=vac.presentes.map(function(v){
      var tensiones=lec?lec.tensiones.filter(function(t){return t.entre&&t.entre.indexOf(v.pilar)!==-1;}):[];
      return {pilar:v.pilar,titulo:v.titulo,tema:v.tema,rama:v.rama,tallo:v.tallo,dinamica:v.dinamica,perfilCopy:v.dinamica?PERFIL_COPY[v.dinamica.nombre]:null,tensiones:tensiones};
    });
    return {presente:items.length>0,items:items,ramas:vac.ramas};
  }

  function estacionDeRama(rama) {
    var p=typeof rama==='string'?rama:rama.pinyin;
    if(['Yin','Mao','Chen'].indexOf(p)!==-1)return 'primavera';
    if(['Si','Wu','Wei'].indexOf(p)!==-1)return 'verano';
    if(['Shen','You','Xu'].indexOf(p)!==-1)return 'otono';
    return 'invierno';
  }

  function menorEntre(candidatos,conteo) {
    return candidatos.slice().sort(function(a,b){return (conteo[a]||0)-(conteo[b]||0);})[0];
  }
  function mayorEntre(candidatos,conteo) {
    return candidatos.slice().sort(function(a,b){return (conteo[b]||0)-(conteo[a]||0);})[0];
  }

  function candidatosRecurso(carta) {
    var dm=carta.diaMaestro.elemento, est=estacionDeRama(carta.pilares.mes.rama), c=carta.balanceElementos||{},r=[],razon='';
    if(dm==='tierra'){
      if(est==='primavera'){r=['fuego'];razon='La primavera carga madera, que controla a la tierra; el fuego crea un puente hacia tu elemento.';}
      else if(est==='verano'){r=['agua'];razon='El verano concentra fuego; el agua introduce flexibilidad y baja el exceso de calor.';}
      else if(est==='otono'){r=['tierra'];razon='En otoño la tierra cede fuerza al metal; reforzar tierra devuelve continuidad.';}
      else {r=['madera','fuego'];razon='En invierno la carta puede necesitar movimiento y calor: madera y fuego son las dos rutas principales.';}
    } else if(dm==='fuego'){
      if(est==='primavera'){r=(c.agua||0)>=3?['tierra','metal']:['metal','tierra'];razon=(c.agua||0)>=3?'Además del empuje primaveral, tu carta trae bastante agua; la tierra ayuda a darle cauce.':'La primavera alimenta el fuego; el metal ayuda a moderar y dar forma a ese impulso.';}
      else if(est==='verano'){r=['agua'];razon='En verano el fuego recibe mucha fuerza de la estación; el agua ayuda a regular su intensidad.';}
      else if(est==='otono'){r=(c.fuego||0)<=1?['madera','fuego']:['fuego','madera'];razon=(c.fuego||0)<=1?'El fuego aparece poco; la madera puede alimentarlo antes de pedirle más presencia.':'En otoño el fuego pierde fuerza; volver a su propio elemento recupera presencia.';}
      else {if((c.agua||0)<=1&&(c.madera||0)>=2)r=['fuego','madera'];else if((c.agua||0)>=3&&(c.fuego||0)>=2)r=['tierra','madera'];else r=['madera','tierra'];razon='En invierno el agua domina el clima; madera o tierra pueden ayudar al fuego desde rutas distintas.';}
    } else if(dm==='madera'){
      if(est==='primavera'){r=(c.madera||0)>=3?['metal','fuego']:['fuego','metal'];razon=(c.madera||0)>=3?'La madera ya ocupa bastante espacio; el metal ayuda a seleccionar y podar.':'La primavera fortalece la madera; el fuego permite sacar parte de esa fuerza hacia expresión y acción.';}
      else if(est==='verano'){r=['agua'];razon='En verano la madera pierde humedad; el agua devuelve reserva y capacidad de adaptación.';}
      else {var rb=carta.pilares.mes.rama.pinyin;if(est==='otono'){r=rb==='You'?['agua','fuego']:['fuego','agua'];razon='En otoño la madera necesita regular cuánto cede y cuánto conserva; agua y fuego son las rutas principales según el tramo del mes.';}else{r=['fuego','metal','tierra'];var prim=mayorEntre(r,c);r=[prim].concat(r.filter(function(x){return x!==prim;}));razon='En invierno la madera tiene mucha reserva. El método compara fuego, metal y tierra con lo que ya está presente en tu carta.';}}
    } else if(dm==='agua'){
      if(est==='primavera'){r=(c.agua||0)>=3?['tierra','madera']:['madera','tierra'];razon=(c.agua||0)>=3?'Tu carta ya concentra agua; la tierra ayuda a contener y dirigir.':'En primavera el agua alimenta crecimiento; madera y tierra ayudan a convertir esa reserva en dirección.';}
      else if(est==='verano'){r=(c.agua||0)<=1?['metal','agua']:['agua','metal'];razon=(c.agua||0)<=1?'El agua aparece poco; el metal puede darle soporte antes de exigirle más movimiento.':'En verano el agua queda ocupada controlando el fuego; volver a agua recupera reserva.';}
      else if(est==='otono'){r=(c.agua||0)>=3?['tierra','madera']:['madera','tierra'];razon=(c.agua||0)>=3?'Hay bastante agua disponible; la tierra ayuda a darle borde.':'En otoño el agua recibe apoyo del metal; la madera ayuda a convertir esa reserva en salida.';}
      else {r=['fuego','tierra'];razon='En invierno el agua recibe toda la fuerza de la estación; fuego y tierra aportan calor y contención.';}
    } else if(dm==='metal'){
      if(est==='primavera'){r=['metal'];razon='En primavera el metal pierde fuerza frente a la madera; volver a metal refuerza criterio y forma.';}
      else if(est==='verano'){var el=menorEntre(['agua','tierra'],c);r=[el,el==='agua'?'tierra':'agua'];razon='En verano el fuego presiona al metal. El método propone agua o tierra como rutas alternativas, y aquí priorizamos la menos presente en tus ocho caracteres.';}
      else if(est==='otono'){if((c.metal||0)>=3)r=['fuego','agua','madera'];else r=['agua','madera'];razon=(c.metal||0)>=3?'El metal ya ocupa mucho espacio; además de agua y madera, el fuego puede ayudar a moldear y flexibilizar.':'En otoño el metal recibe mucha fuerza; agua y madera permiten sacar parte de esa concentración hacia movimiento.';}
      else {r=['fuego','madera'];razon='En invierno el metal pierde temperatura y flexibilidad; fuego y madera son las dos rutas principales del método.';}
    }
    return {elementoDiaMaestro:dm,estacion:est,candidatos:r,razon:razon};
  }

  function recursoDeEquilibrio(carta,sinHora) {
    var base=candidatosRecurso(carta),c=carta.balanceElementos||{};
    var principal=base.candidatos[0];
    // Cuando el método entrega varias rutas sin una regla de desempate explícita,
    // conservamos la primera regla contextual y dejamos visibles las alternativas.
    var tallos=dep('TALLOS','./motor').filter(function(t){return t.elemento===principal;});
    var presentes=[];
    ['anio','mes','dia'].concat(sinHora?[]:['hora']).forEach(function(k){
      var p=carta.pilares[k];if(p.tallo.elemento===principal)presentes.push({pilar:k,tallo:p.tallo,visible:true});
      tallosOcultos(p.rama).forEach(function(t){if(t.elemento===principal)presentes.push({pilar:k,tallo:t,visible:false});});
    });
    presentes.sort(function(a,b){if(a.visible!==b.visible)return a.visible?-1:1;return a.pilar==='mes'?-1:b.pilar==='mes'?1:0;});
    var talloElegido=presentes.length?presentes[0].tallo:tallos[0];
    var dinamica=dinamicaDe(carta.diaMaestro,talloElegido);
    return {
      elemento:principal,alternativas:base.candidatos.slice(1),estacion:base.estacion,razon:base.razon,
      presente:presentes.length>0,tallo:talloElegido,dinamica:dinamica,copy:ELEMENTO_COPY[principal],conteo:c[principal]||0
    };
  }

  function analizarCartaProfunda(carta,opciones) {
    opciones=opciones||{};var sinHora=!!opciones.sinHora,nacimiento=opciones.nacimiento||{};
    return {
      mezcla:mezclaDe(carta),
      perfiles:perfilesDe(carta,sinHora),
      extras:pilaresExtra(carta,nacimiento,sinHora),
      vacios:vaciosDeCarta(carta,sinHora),
      nudo:nudoDeFondo(carta,sinHora),
      recurso:recursoDeEquilibrio(carta,sinHora),
      territorios:TERRITORIOS
    };
  }

  var api={
    TE_ELEMENTO_COPY:ELEMENTO_COPY,TE_PERFIL_COPY:PERFIL_COPY,TE_TERRITORIOS_CARTA:TERRITORIOS,
    mezclaDe:mezclaDe,perfilPrincipal:perfilPrincipal,perfilesDe:perfilesDe,zhongQiNacimiento:zhongQiNacimiento,
    brujulaDe:brujulaDe,puntoPartidaDe:puntoPartidaDe,pilaresExtra:pilaresExtra,vaciosDeCarta:vaciosDeCarta,
    nudoDeFondo:nudoDeFondo,estacionDeRama:estacionDeRama,recursoDeEquilibrio:recursoDeEquilibrio,
    analizarCartaProfunda:analizarCartaProfunda
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else for(var k in api)raiz[k]=api[k];
})(typeof globalThis!=='undefined'?globalThis:this);
