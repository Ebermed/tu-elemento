/**
 * TU ELEMENTO — Lectura mensual
 * ------------------------------------------------------------------
 * Módulo independiente para la sección "Tu mes".
 *
 * La matemática usa relaciones clásicas de los cinco elementos:
 *   - mismo elemento,
 *   - lo que el Día Maestro produce,
 *   - lo que el Día Maestro controla,
 *   - lo que controla al Día Maestro,
 *   - lo que produce al Día Maestro,
 * y distingue si la polaridad coincide o se cruza.
 *
 * La capa editorial de Tu Elemento traduce esas diez combinaciones a
 * dinámicas propias y organiza el ciclo mensual en doce ritmos propios.
 */

function _depMes(nombre, ruta) {
  if (typeof globalThis !== 'undefined' && globalThis[nombre] !== undefined) return globalThis[nombre];
  if (typeof require !== 'undefined') { try { return require(ruta)[nombre]; } catch (e) {} }
  return undefined;
}

var TE_ELEMENTOS_MES = ['madera','fuego','tierra','metal','agua'];

var TE_OCULTOS_MES = {
  Zi:[9], Chou:[5,9,7], Yin:[0,2,4], Mao:[1], Chen:[4,1,9], Si:[2,4,6],
  Wu:[3,5], Wei:[5,3,1], Shen:[6,8,4], You:[7], Xu:[4,7,3], Hai:[8,0]
};

var TE_AREAS_MES = {
  pares:{titulo:'Vínculos',tema:'personas, alianzas, pertenencia y límites',puede:['conversaciones que cambian la dinámica con alguien cercano','alianzas, reencuentros o decisiones sobre a quién sumas a tus planes','situaciones donde pertenecer, colaborar o marcar un límite gana importancia'],trabajar:['pedir con claridad lo que necesitas de otras personas','acordar límites y responsabilidades antes de cargar con ellas','elegir vínculos donde el apoyo pueda circular en ambos sentidos'],cuidado:'Repartir demasiado tu atención entre varias personas puede quitarle espacio a lo que también necesitas tú.'},
  salida:{titulo:'Expresión',tema:'ideas, expresión, producción y visibilidad',puede:['ideas que piden convertirse en algo visible','ganas de producir, enseñar, hablar, escribir o mostrar trabajo','oportunidades para sacar una habilidad de la cabeza y ponerla frente a otros'],trabajar:['terminar una pieza antes de abrir demasiados frentes','mostrar una versión suficientemente clara y aprender de la respuesta','usar tu voz con intención y reservar energía para sostener lo que publiques'],cuidado:'El entusiasmo puede abrir más proyectos de los que tu calendario alcanza a sostener.'},
  recursos:{titulo:'Recursos',tema:'dinero, recursos, intercambio y resultados concretos',puede:['decisiones de dinero, compras, cobros o recursos que requieren criterio','oportunidades para convertir trabajo en un resultado concreto','acuerdos donde conviene medir con precisión qué entra, qué sale y qué se compromete'],trabajar:['poner números y condiciones antes de comprometer recursos','cerrar fugas pequeñas que juntas pesan más de lo que parecía','convertir una oportunidad en un plan con fecha, costo y siguiente paso'],cuidado:'Una oportunidad atractiva puede crecer demasiado rápido cuando falta una medida clara de tiempo, dinero o energía.'},
  presion:{titulo:'Estructura',tema:'presión, responsabilidad, autoridad y criterio',puede:['más responsabilidades, reglas, plazos o expectativas alrededor de ti','encuentros con figuras de autoridad o situaciones que piden orden','momentos donde sostener una decisión pesa más que tomarla'],trabajar:['separar obligación real de presión aprendida','poner estructura a lo importante y soltar controles que ya consumen de más','responder desde un criterio propio en vez de reaccionar a cada exigencia'],cuidado:'Cargar con cada expectativa como si tuviera la misma prioridad puede convertir estructura en presión.'},
  soporte:{titulo:'Perspectiva',tema:'aprendizaje, apoyo, observación y conocimiento',puede:['información que cambia la manera de entender un problema','personas que enseñan, orientan o acercan una pieza que faltaba','una etapa de estudio, observación o preparación antes del siguiente movimiento'],trabajar:['buscar una fuente o persona que sepa más del tema que estás resolviendo','darle tiempo a la información para acomodarse antes de decidir','convertir lo aprendido en una acción pequeña y comprobable'],cuidado:'Pensar cada escenario puede consumir el momento que también necesita una decisión.'}
};

var TE_DINAMICAS_MES = {
  pares_paralela:{nombre:'Espejo',area:'pares',matiz:'La energía se parece a la tuya y pone el foco en pares, semejanzas y decisiones compartidas.'},
  pares_cruzada:{nombre:'Contrapunto',area:'pares',matiz:'La energía se parece a la tuya desde otro ángulo y hace más visible el reparto, la comparación y la negociación.'},
  salida_paralela:{nombre:'Flujo',area:'salida',matiz:'Lo que llevas dentro encuentra una salida bastante natural: ideas, producción y expresión ganan cauce.'},
  salida_cruzada:{nombre:'Impacto',area:'salida',matiz:'Tu expresión busca hacerse visible, cuestionar algo o provocar una respuesta más clara en el entorno.'},
  recursos_paralela:{nombre:'Oportunidad',area:'recursos',matiz:'Los recursos se mueven con variedad y velocidad; aparecen varias puertas y toca elegir cuáles sí merecen energía.'},
  recursos_cruzada:{nombre:'Concreción',area:'recursos',matiz:'Los recursos piden administración, estabilidad y convertir esfuerzo en un resultado que pueda sostenerse.'},
  presion_paralela:{nombre:'Desafío',area:'presion',matiz:'La presión entra como reto: competencia, urgencia o una situación que pide reacción, coraje y criterio.'},
  presion_cruzada:{nombre:'Estructura',area:'presion',matiz:'La presión toma forma de reglas, responsabilidades, autoridad y decisiones que necesitan orden.'},
  soporte_paralela:{nombre:'Intuición',area:'soporte',matiz:'El apoyo llega por rutas laterales: asociaciones, señales, ideas poco obvias y aprendizaje fuera del camino habitual.'},
  soporte_cruzada:{nombre:'Aprendizaje',area:'soporte',matiz:'El apoyo llega con estructura: estudio, referencias, guía y conocimiento que puede organizarse y aplicarse.'}
};

var TE_RITMOS_MES = [
  {clave:'brote',nombre:'Brote',verbo:'empezar',titular:'Algo pide empezar.',lectura:'El ciclo abre espacio para el arranque, la recuperación y la ayuda que facilita mover una primera pieza.',puede:['un proyecto que por fin encuentra punto de partida','una invitación o ayuda que facilita empezar','recuperar energía para algo que llevaba tiempo esperando'],trabajar:['elegir una sola semilla y darle continuidad','pedir apoyo temprano, antes de cargar todo por cuenta propia'],cuidado:'El primer paso puede sentirse más grande de lo que realmente es.'},
  {clave:'transicion',nombre:'Transición',verbo:'cambiar',titular:'Cambiar también implica soltar.',lectura:'El ciclo mueve hábitos, imagen y formas de exponerte. El cambio funciona mejor cuando algo viejo deja espacio de verdad.',puede:['cambios de rutina, imagen o dinámica personal','favores o contactos que abren una ruta distinta','ganas de probar una forma nueva de hacer algo conocido'],trabajar:['elegir qué versión vieja de una rutina ya cumplió su función','probar el cambio en pequeño antes de volverlo permanente'],cuidado:'La novedad puede distraer de la razón por la que querías cambiar.'},
  {clave:'presencia',nombre:'Presencia',verbo:'mostrarte',titular:'Este mes quiere verte más visible.',lectura:'El ciclo pone atención en presentación, mejora, carrera y vida social. La forma también comunica y puede abrir una puerta.',puede:['más exposición profesional o social','una mejora de presentación, imagen o posición','contactos que ayudan a estabilizar una etapa de trabajo'],trabajar:['presentar tu trabajo con claridad','usar la visibilidad para construir una relación o resultado concreto'],cuidado:'La apariencia puede comerse el tiempo que también necesita el contenido.'},
  {clave:'despegue',nombre:'Despegue',verbo:'materializar',titular:'Lo que venías haciendo empieza a tomar forma.',lectura:'El ciclo favorece autosuficiencia, avance visible y materialización apoyada en personas de confianza.',puede:['un avance que por fin se vuelve visible','viajes, movimiento o gestiones que acercan una meta','apoyo de personas con quienes ya existe confianza'],trabajar:['administrar bien el crecimiento','rodearte de gente que cuide el proceso además del resultado'],cuidado:'Esforzarte para demostrar que puedes con todo puede gastar el avance que ya conseguiste.'},
  {clave:'cumbre',nombre:'Cumbre',verbo:'empujar resultados',titular:'Hay espacio para empujar algo importante.',lectura:'El ciclo concentra logro, reputación, autoridad y resultados. La medida del mes está en usar esa fuerza con dirección.',puede:['reconocimiento por algo que ya venías construyendo','una oportunidad de crecimiento económico o profesional','más capacidad para decidir y ocupar espacio'],trabajar:['poner tu energía detrás de una prioridad medible','dejar que el resultado hable antes de inflar la promesa'],cuidado:'El exceso de confianza puede hacer que una buena racha cargue más de lo necesario.'},
  {clave:'repliegue',nombre:'Repliegue',verbo:'bajar el ritmo',titular:'Bajar el ritmo también forma parte del ciclo.',lectura:'El ciclo favorece retirada, pausa y recuperación. Ceder un poco de velocidad puede devolver claridad para el tramo siguiente.',puede:['menos ganas de sostener el mismo ritmo','pendientes que piden cierre antes de crecer','necesidad de espacio, sueño o recuperación'],trabajar:['reducir carga de forma deliberada','cerrar pendientes pequeños para recuperar margen'],cuidado:'Confundir pausa con abandono puede dejarte sin el descanso y sin el cierre.'},
  {clave:'ajuste',nombre:'Ajuste',verbo:'recalibrar',titular:'Tu energía pide mantenimiento.',lectura:'El ciclo vuelve visibles límites, carga acumulada y necesidades de ajuste. Sirve para recalibrar ritmo, hábitos y expectativas.',puede:['cansancio que vuelve más evidente un límite','temas emocionales que piden atención práctica','ajustes de rutina para recuperar margen'],trabajar:['dar prioridad a descanso, seguimiento y hábitos básicos','atender temprano las señales de sobrecarga y reorganizar lo necesario'],cuidado:'Empujar por inercia puede convertir una señal pequeña en una carga mayor.'},
  {clave:'cierre',nombre:'Cierre',verbo:'terminar',titular:'Algo pide llegar a su final.',lectura:'El ciclo favorece terminar, aplazar lo accesorio y liberar espacio para la etapa siguiente.',puede:['un proyecto que llega a su punto de cierre','retrasos que obligan a escoger qué vale la pena sostener','ganas de terminar una etapa antes de abrir la siguiente'],trabajar:['cerrar con claridad lo que ya cumplió su función','reservar energía para lo esencial mientras pasa el tramo lento'],cuidado:'Aferrarte a una etapa agotada puede hacer que el cierre ocupe más tiempo del que necesita.'},
  {clave:'resguardo',nombre:'Resguardo',verbo:'ordenar',titular:'Guardar, limpiar y administrar toman protagonismo.',lectura:'El ciclo favorece limpieza, protección, administración y decisiones sobre qué conservas, qué archivas y qué termina.',puede:['cierres administrativos o materiales','necesidad de ordenar papeles, recursos o pendientes','una situación que pide quedar protegida, archivada o concluida'],trabajar:['hacer limpieza concreta de pendientes','poner límites y sistemas a lo que seguirá contigo'],cuidado:'Controlar cada detalle puede convertir orden en bloqueo.'},
  {clave:'desprendimiento',nombre:'Desprendimiento',verbo:'simplificar',titular:'El terreno viejo empieza a perder fuerza.',lectura:'El ciclo favorece simplificación, interioridad y desprendimiento. El valor está en dejar que una ruta agotada ocupe cada vez menos espacio.',puede:['planes que dejan de tener el mismo peso','una etapa de introspección o búsqueda de perspectiva','la desaparición gradual de una opción que antes parecía central'],trabajar:['simplificar decisiones y compromisos','dejar espacio para que una respuesta llegue después de soltar presión'],cuidado:'Buscar certeza inmediata en un terreno que está cambiando puede aumentar la sensación de vacío.'},
  {clave:'semilla',nombre:'Semilla',verbo:'preparar',titular:'La idea aparece antes que el resultado.',lectura:'El ciclo habla de planes, información y primeras intenciones. Sirve para preparar algo que todavía está tomando forma.',puede:['información que abre una posibilidad','una propuesta, plan o idea que apenas empieza a definirse','conversaciones que preparan un movimiento posterior'],trabajar:['reunir información antes de comprometerte','darle estructura a una idea mientras todavía puede cambiar'],cuidado:'Pensar cada variante puede retrasar una idea que ya tiene suficiente forma para probarse.'},
  {clave:'incubacion',nombre:'Incubación',verbo:'sostener',titular:'Lo importante necesita alimento antes que velocidad.',lectura:'El ciclo favorece recuperación, cuidado y nacimiento de proyectos o vínculos. El crecimiento viene de sostener bien lo que empieza.',puede:['un proyecto o relación que pide cuidados tempranos','más necesidad de descanso y recuperación','oportunidades de apoyar o recibir apoyo'],trabajar:['dar tiempo y recursos a lo que quieres ver crecer','tratar tu propia recuperación como parte del trabajo'],cuidado:'Cuidar todo alrededor y dejarte al final puede vaciar justo la energía que el mes pide reunir.'}
];

var TE_INICIO_RITMO = {
  Jia:{rama:11,dir:1},Yi:{rama:6,dir:-1},Bing:{rama:2,dir:1},Ding:{rama:9,dir:-1},Wu:{rama:2,dir:1},Ji:{rama:9,dir:-1},Geng:{rama:5,dir:1},Xin:{rama:0,dir:-1},Ren:{rama:8,dir:1},Gui:{rama:3,dir:-1}
};

var TE_TERRITORIOS_MES = {
  anio:{titulo:'Tu origen',tema:'familia, contexto y pertenencia'},
  mes:{titulo:'Tu trayectoria',tema:'trabajo, entorno y dirección profesional'},
  dia:{titulo:'Tu centro',tema:'identidad, pareja y decisiones personales'},
  hora:{titulo:'Tu futuro',tema:'proyectos, hijos, legado y vida privada'}
};

function dinamicaMensualDeTallo(diaMaestro,talloVisitante){
  var TL=_depMes('TALLOS','./motor');
  var dm=typeof diaMaestro==='string'?TL.filter(function(t){return t.pinyin===diaMaestro;})[0]:diaMaestro;
  var tv=typeof talloVisitante==='string'?TL.filter(function(t){return t.pinyin===talloVisitante;})[0]:talloVisitante;
  if(!dm||!tv)return null;
  var iDM=TE_ELEMENTOS_MES.indexOf(dm.elemento),iTV=TE_ELEMENTOS_MES.indexOf(tv.elemento),relacion;
  if(iTV===iDM)relacion='pares';
  else if(iTV===(iDM+1)%5)relacion='salida';
  else if(iTV===(iDM+2)%5)relacion='recursos';
  else if(iTV===(iDM+3)%5)relacion='presion';
  else relacion='soporte';
  var forma=dm.yang===tv.yang?'paralela':'cruzada';
  var d=TE_DINAMICAS_MES[relacion+'_'+forma];
  return{clave:relacion+'_'+forma,nombre:d.nombre,area:d.area,forma:forma,tallo:tv,matiz:d.matiz,tema:TE_AREAS_MES[d.area].tema};
}

function tallosOcultosMes(rama){var TL=_depMes('TALLOS','./motor');var key=typeof rama==='string'?rama:(rama&&rama.pinyin);return(TE_OCULTOS_MES[key]||[]).map(function(i){return TL[i];});}

function ritmoCicloMes(diaMaestro,ramaMes){
  var TL=_depMes('TALLOS','./motor'),RM=_depMes('RAMAS','./motor');
  var dm=typeof diaMaestro==='string'?TL.filter(function(t){return t.pinyin===diaMaestro;})[0]:diaMaestro;
  var rm=typeof ramaMes==='string'?RM.filter(function(r){return r.pinyin===ramaMes;})[0]:ramaMes;
  if(!dm||!rm||!TE_INICIO_RITMO[dm.pinyin])return null;
  var inicio=TE_INICIO_RITMO[dm.pinyin],iR=RM.indexOf(rm);
  var paso=inicio.dir===1?((iR-inicio.rama)%12+12)%12:((inicio.rama-iR)%12+12)%12;
  var base=TE_RITMOS_MES[paso],out={};for(var k in base)out[k]=base[k];out.indice=paso;out.rama=rm;return out;
}

function interaccionesMensuales(carta,ramaMes,sinHora){
  var RM=_depMes('RAMAS','./motor'),choqueFn=_depMes('choque','./motor'),combinaFn=_depMes('combinacion','./motor');
  var iMes=RM.indexOf(ramaMes),claves=sinHora?['anio','mes','dia']:['anio','mes','dia','hora'],out=[];
  claves.forEach(function(k){
    var natal=carta.pilares[k].rama,iNat=RM.indexOf(natal),tipo=null;
    if(iMes===iNat)tipo='resonancia';else if(choqueFn(iMes)===iNat)tipo='friccion';else if(combinaFn(iMes)===iNat)tipo='enlace';if(!tipo)return;
    var terr=TE_TERRITORIOS_MES[k],texto;
    if(tipo==='friccion')texto='El mes pone fricción en '+terr.titulo+': '+terr.tema+' piden ajustar ritmo, expectativas o dirección.';
    else if(tipo==='enlace')texto='El mes encuentra apoyo en '+terr.titulo+': '+terr.tema+' pueden ofrecer una vía más fluida para mover lo importante.';
    else texto='El mes repite la rama de '+terr.titulo+': '+terr.tema+' ganan volumen y merecen atención deliberada.';
    out.push({pilar:k,tipo:tipo,titulo:terr.titulo,tema:terr.tema,texto:texto,ramaNatal:natal});
  });return out;
}

function pilarMensualPara(anio,mes){var cuatro=_depMes('cuatroPilares','./motor');return cuatro({anio:anio,mes:mes,dia:15,hora:12,minuto:0,offsetTZ:0});}

function lecturaMensual(carta,opciones){
  opciones=opciones||{};var anio=Number(opciones.anio),mes=Number(opciones.mes),sinHora=!!opciones.sinHora;
  if(!carta||!anio||!mes)throw new Error('Lectura mensual: faltan carta, año o mes.');
  var transito=pilarMensualPara(anio,mes),pMes=transito.pilares.mes;
  var dinamica=dinamicaMensualDeTallo(carta.diaMaestro,pMes.tallo);
  var secundarias=tallosOcultosMes(pMes.rama).map(function(t){return dinamicaMensualDeTallo(carta.diaMaestro,t);});
  var ritmo=ritmoCicloMes(carta.diaMaestro,pMes.rama),inter=interaccionesMensuales(carta,pMes.rama,sinHora),area=TE_AREAS_MES[dinamica.area];
  return{anio:anio,mes:mes,transito:transito,pilar:pMes,diaMaestro:carta.diaMaestro,dinamicaPrincipal:dinamica,dinamicasSecundarias:secundarias,ritmo:ritmo,interacciones:inter,area:area,resumen:{titulo:'Este mes se mueve con '+dinamica.nombre+'.',subtitulo:area.titulo+' · '+area.tema,foco:ritmo.trabajar[0]+'. Después, '+area.trabajar[0]+'.',recomendacion:area.trabajar[1]+'. '+ritmo.trabajar[1]+'.',atencion:area.cuidado+' '+ritmo.cuidado,puede:area.puede.slice(0,2).concat(ritmo.puede.slice(0,2)),trabajar:area.trabajar.slice(0,2).concat(ritmo.trabajar.slice(0,2))}};
}

(function(raiz){var api={TE_OCULTOS_MES:TE_OCULTOS_MES,TE_AREAS_MES:TE_AREAS_MES,TE_DINAMICAS_MES:TE_DINAMICAS_MES,TE_RITMOS_MES:TE_RITMOS_MES,dinamicaMensualDeTallo:dinamicaMensualDeTallo,tallosOcultosMes:tallosOcultosMes,ritmoCicloMes:ritmoCicloMes,interaccionesMensuales:interaccionesMensuales,pilarMensualPara:pilarMensualPara,lecturaMensual:lecturaMensual};if(typeof module!=='undefined'&&module.exports)module.exports=api;else for(var k in api)raiz[k]=api[k];})(typeof globalThis!=='undefined'?globalThis:this);
