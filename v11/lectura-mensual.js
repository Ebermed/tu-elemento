/**
 * TU ELEMENTO — Lectura mensual
 * ------------------------------------------------------------------
 * Módulo independiente para la sección "Tu mes".
 *
 * La lectura mensual se construye con tres piezas clásicas de BaZi:
 *   1) pilar solar del mes (tallo + rama),
 *   2) perfiles / 10 dioses que ese tallo y los tallos ocultos forman
 *      respecto al Día Maestro,
 *   3) una de las 12 etapas de crecimiento del Día Maestro.
 *
 * Como capa de personalización adicional, la rama del mes se compara
 * con las cuatro ramas natales para detectar combinación, choque o
 * resonancia. La redacción de producto es propia y deliberadamente
 * evita convertir símbolos tradicionales en predicciones literales.
 */

function _depMes(nombre, ruta) {
  if (typeof globalThis !== 'undefined' && globalThis[nombre] !== undefined) return globalThis[nombre];
  if (typeof require !== 'undefined') { try { return require(ruta)[nombre]; } catch (e) {} }
  return undefined;
}

var TE_ELEMENTOS_MES = ['madera','fuego','tierra','metal','agua'];

// Tallos ocultos por rama. Índices según TALLOS de motor.js.
var TE_OCULTOS_MES = {
  Zi:   [9],
  Chou: [5,9,7],
  Yin:  [0,2,4],
  Mao:  [1],
  Chen: [4,1,9],
  Si:   [2,4,6],
  Wu:   [3,5],
  Wei:  [5,3,1],
  Shen: [6,8,4],
  You:  [7],
  Xu:   [4,7,3],
  Hai:  [8,0]
};

var TE_GRUPOS_PERFIL = {
  relaciones: {
    titulo:'Relaciones',
    icono:'◎',
    tema:'personas, alianzas y límites',
    puede:[
      'conversaciones que cambian la dinámica con alguien cercano',
      'alianzas, reencuentros o decisiones sobre a quién sumas a tus planes',
      'situaciones donde pertenecer, colaborar o marcar un límite se vuelve importante'
    ],
    trabajar:[
      'pedir con claridad lo que necesitas de otras personas',
      'acordar límites y responsabilidades antes de cargar con ellas',
      'elegir vínculos donde el apoyo pueda circular en ambos sentidos'
    ],
    cuidado:'Repartir demasiado tu atención entre varias personas puede quitarle espacio a lo que también necesitas tú.'
  },
  creatividad: {
    titulo:'Creatividad',
    icono:'✦',
    tema:'ideas, expresión y producción',
    puede:[
      'ideas que piden convertirse en algo visible',
      'ganas de producir, enseñar, hablar, escribir o mostrar trabajo',
      'oportunidades para sacar una habilidad de la cabeza y ponerla frente a otros'
    ],
    trabajar:[
      'terminar una pieza antes de abrir demasiados frentes',
      'mostrar una versión suficientemente clara y aprender de la respuesta',
      'usar tu voz con intención y reservar energía para sostener lo que publiques'
    ],
    cuidado:'El entusiasmo puede abrir más proyectos de los que tu calendario alcanza a sostener.'
  },
  prosperidad: {
    titulo:'Prosperidad',
    icono:'◇',
    tema:'recursos, dinero y resultados concretos',
    puede:[
      'decisiones de dinero, compras, cobros o recursos que requieren criterio',
      'oportunidades para convertir trabajo en un resultado concreto',
      'acuerdos donde conviene medir con precisión qué entra, qué sale y qué se compromete'
    ],
    trabajar:[
      'poner números y condiciones antes de comprometer recursos',
      'cerrar fugas pequeñas que juntas pesan más de lo que parecía',
      'convertir una oportunidad en un plan con fecha, costo y siguiente paso'
    ],
    cuidado:'Una oportunidad atractiva puede crecer demasiado rápido cuando falta una medida clara de tiempo, dinero o energía.'
  },
  emociones: {
    titulo:'Emociones',
    icono:'◌',
    tema:'presión, responsabilidad y estructura',
    puede:[
      'más responsabilidades, reglas, plazos o expectativas alrededor de ti',
      'encuentros con figuras de autoridad o situaciones que piden orden',
      'momentos donde sostener una decisión pesa más que tomarla'
    ],
    trabajar:[
      'separar obligación real de presión aprendida',
      'poner estructura a lo importante y soltar controles que ya consumen de más',
      'responder desde un criterio propio en vez de reaccionar a cada exigencia'
    ],
    cuidado:'Cargar con cada expectativa como si tuviera la misma prioridad puede convertir estructura en presión.'
  },
  intelecto: {
    titulo:'Intelecto',
    icono:'⌁',
    tema:'aprendizaje, apoyo y perspectiva',
    puede:[
      'información que cambia la manera de entender un problema',
      'personas que enseñan, orientan o acercan una pieza que faltaba',
      'una etapa de estudio, observación o preparación antes del siguiente movimiento'
    ],
    trabajar:[
      'buscar una fuente o persona que sepa más del tema que estás resolviendo',
      'darle tiempo a la información para acomodarse antes de decidir',
      'convertir lo aprendido en una acción pequeña y comprobable'
    ],
    cuidado:'Pensar cada escenario puede consumir el momento que también necesita una decisión.'
  }
};

// Índice 0 = Crecer. El nombre UI suaviza las fases cuyo nombre clásico
// puede sonar literal fuera del contexto técnico.
var TE_ETAPAS_MES = [
  {
    clave:'crecer', clasico:'Crecer', pinyin:'Chang Sheng', han:'生', ui:'Crecer', verbo:'empezar',
    titular:'Algo pide empezar.',
    lectura:'La fase favorece el arranque, la recuperación y la ayuda que llega justo cuando hace falta mover una primera pieza.',
    puede:['un proyecto que por fin encuentra punto de partida','una invitación o ayuda que facilita empezar','recuperar energía para algo que llevaba tiempo esperando'],
    trabajar:['elegir una sola semilla y darle continuidad','pedir apoyo temprano, antes de cargar todo por cuenta propia'],
    cuidado:'El primer paso puede sentirse más grande de lo que realmente es.'
  },
  {
    clave:'renovar', clasico:'Renovar', pinyin:'Mu Yu', han:'浴', ui:'Renovar', verbo:'cambiar',
    titular:'Cambiar también implica soltar.',
    lectura:'La fase mueve hábitos, imagen, placer y formas de exponerte. El cambio funciona mejor cuando algo viejo deja espacio de verdad.',
    puede:['cambios de rutina, imagen o dinámica personal','favores o contactos que abren una ruta distinta','ganas de probar una forma nueva de hacer algo conocido'],
    trabajar:['elegir qué versión vieja de una rutina ya cumplió su función','probar el cambio en pequeño antes de volverlo permanente'],
    cuidado:'La novedad puede distraer de la razón por la que querías cambiar.'
  },
  {
    clave:'coronar', clasico:'Coronar', pinyin:'Guan Dai', han:'冠', ui:'Coronar', verbo:'mostrarte',
    titular:'Este mes quiere verte más visible.',
    lectura:'La fase se relaciona con presentación, mejora, carrera y vida social. Conviene cuidar la forma porque la forma también comunica.',
    puede:['más exposición profesional o social','una mejora de presentación, imagen o posición','contactos que ayudan a estabilizar una etapa de trabajo'],
    trabajar:['presentar tu trabajo con claridad','usar la visibilidad para construir una relación o resultado concreto'],
    cuidado:'La apariencia puede comerse el tiempo que también necesita el contenido.'
  },
  {
    clave:'florecer', clasico:'Florecer', pinyin:'Lin Guan', han:'祿', ui:'Florecer', verbo:'materializar',
    titular:'Lo que venías haciendo empieza a tomar forma.',
    lectura:'La fase habla de autosuficiencia, avance visible y materialización apoyada en personas de confianza.',
    puede:['un avance que por fin se vuelve visible','viajes, movimiento o gestiones que acercan una meta','apoyo de personas con quienes ya existe confianza'],
    trabajar:['administrar bien el crecimiento','rodearte de gente que cuide el proceso además del resultado'],
    cuidado:'Esforzarte para demostrar que puedes con todo puede gastar el avance que ya conseguiste.'
  },
  {
    clave:'prosperar', clasico:'Prosperar', pinyin:'Di Wang', han:'旺', ui:'Prosperar', verbo:'empujar resultados',
    titular:'Hay espacio para empujar algo importante.',
    lectura:'La fase concentra logro, reputación, autoridad y resultados. La medida del mes está en usar esa fuerza con dirección.',
    puede:['reconocimiento por algo que ya venías construyendo','una oportunidad de crecimiento económico o profesional','más capacidad para decidir y ocupar espacio'],
    trabajar:['poner tu energía detrás de una prioridad medible','dejar que el resultado hable antes de inflar la promesa'],
    cuidado:'El exceso de confianza puede hacer que una buena racha cargue más de lo necesario.'
  },
  {
    clave:'descansar', clasico:'Descansar', pinyin:'Shuai', han:'衰', ui:'Descansar', verbo:'bajar el ritmo',
    titular:'Bajar el ritmo también forma parte del ciclo.',
    lectura:'La fase favorece retirada, pausa y recuperación. Ceder un poco de velocidad puede devolver claridad para el tramo siguiente.',
    puede:['menos ganas de sostener el mismo ritmo','pendientes que piden cierre antes de crecer','necesidad de espacio, sueño o recuperación'],
    trabajar:['reducir carga de forma deliberada','cerrar pendientes pequeños para recuperar margen'],
    cuidado:'Confundir pausa con abandono puede dejarte sin el descanso y sin el cierre.'
  },
  {
    clave:'enfermar', clasico:'Enfermar', pinyin:'Bing', han:'病', ui:'Recuperar', verbo:'cuidarte',
    titular:'Tu energía pide mantenimiento.',
    lectura:'La fase clásica habla de vulnerabilidad y sanación. En producto la leemos como una invitación a escuchar cuerpo, emociones y carga acumulada.',
    puede:['cansancio que vuelve más evidente un límite','temas emocionales que piden atención práctica','ajustes de rutina para recuperar margen'],
    trabajar:['dar prioridad a descanso, seguimiento y hábitos básicos','atender temprano cualquier señal física o emocional con el apoyo adecuado'],
    cuidado:'Empujar el cuerpo por inercia puede convertir una señal pequeña en una carga mayor.'
  },
  {
    clave:'morir', clasico:'Morir', pinyin:'Si', han:'死', ui:'Cerrar', verbo:'terminar',
    titular:'Algo pide llegar a su final.',
    lectura:'El nombre clásico describe una fase de cierre y baja vitalidad. Aquí funciona como señal para terminar, aplazar lo accesorio y liberar espacio.',
    puede:['un proyecto que llega a su punto de cierre','retrasos que obligan a escoger qué vale la pena sostener','ganas de terminar una etapa antes de abrir la siguiente'],
    trabajar:['cerrar con claridad lo que ya cumplió su función','reservar energía para lo esencial mientras pasa el tramo lento'],
    cuidado:'Aferrarte a una etapa agotada puede hacer que el cierre ocupe más tiempo del que necesita.'
  },
  {
    clave:'enterrar', clasico:'Enterrar', pinyin:'Mu', han:'墓', ui:'Ordenar y cerrar', verbo:'ordenar',
    titular:'Guardar, limpiar y administrar toman protagonismo.',
    lectura:'La fase favorece finales, limpieza, protección y administración. Sirve para decidir qué conservas, qué archivas y qué termina.',
    puede:['cierres administrativos o materiales','necesidad de ordenar papeles, recursos o pendientes','una situación que pide quedar protegida, archivada o concluida'],
    trabajar:['hacer limpieza concreta de pendientes','poner límites y sistemas a lo que seguirá contigo'],
    cuidado:'Controlar cada detalle puede convertir orden en bloqueo.'
  },
  {
    clave:'extinguir', clasico:'Extinguir', pinyin:'Jue', han:'絕', ui:'Soltar', verbo:'simplificar',
    titular:'El terreno viejo empieza a desaparecer.',
    lectura:'La fase favorece simplificación, interioridad y desprendimiento. El valor está en dejar que una ruta agotada pierda fuerza.',
    puede:['planes que dejan de tener el mismo peso','una etapa de introspección o búsqueda espiritual','la desaparición gradual de una opción que antes parecía central'],
    trabajar:['simplificar decisiones y compromisos','dejar espacio para que una respuesta llegue después de soltar presión'],
    cuidado:'Buscar certeza inmediata en un terreno que está cambiando puede aumentar la sensación de vacío.'
  },
  {
    clave:'concebir', clasico:'Concebir', pinyin:'Tai', han:'胎', ui:'Concebir', verbo:'incubar',
    titular:'La idea aparece antes que el resultado.',
    lectura:'La fase habla de planes, información, primeras intenciones y gestación. Sirve para preparar algo que todavía está tomando forma.',
    puede:['información que abre una posibilidad','una propuesta, plan o idea que apenas empieza a definirse','conversaciones que preparan un movimiento posterior'],
    trabajar:['reunir información antes de comprometerte','darle estructura a una idea mientras todavía puede cambiar'],
    cuidado:'Pensar cada variante puede retrasar una idea que ya tiene suficiente forma para probarse.'
  },
  {
    clave:'nutrir', clasico:'Nutrir', pinyin:'Yang', han:'養', ui:'Nutrir', verbo:'sostener',
    titular:'Lo importante necesita alimento antes que velocidad.',
    lectura:'La fase favorece recuperación, cuidado y nacimiento de proyectos o vínculos. El crecimiento del mes viene de sostener bien lo que empieza.',
    puede:['un proyecto o relación que pide cuidados tempranos','más necesidad de descanso y recuperación','oportunidades de apoyar o recibir apoyo'],
    trabajar:['dar tiempo y recursos a lo que quieres ver crecer','tratar tu propia recuperación como parte del trabajo'],
    cuidado:'Cuidar todo alrededor y dejarte al final puede vaciar justo la energía que el mes pide reunir.'
  }
];

// Rama de inicio de Crecer y dirección para cada tallo del Día Maestro.
// Índices de RAMAS: Zi=0 ... Hai=11.
var TE_INICIO_ETAPA = {
  Jia:{rama:11,dir:1}, Yi:{rama:6,dir:-1},
  Bing:{rama:2,dir:1}, Ding:{rama:9,dir:-1},
  Wu:{rama:2,dir:1}, Ji:{rama:9,dir:-1},
  Geng:{rama:5,dir:1}, Xin:{rama:0,dir:-1},
  Ren:{rama:8,dir:1}, Gui:{rama:3,dir:-1}
};

var TE_TERRITORIOS_MES = {
  anio:{titulo:'Tu origen', tema:'familia, contexto y pertenencia'},
  mes:{titulo:'Tu trayectoria', tema:'trabajo, entorno y dirección profesional'},
  dia:{titulo:'Tu centro', tema:'identidad, pareja y decisiones personales'},
  hora:{titulo:'Tu futuro', tema:'proyectos, hijos, legado y vida privada'}
};

function perfilMensualDeTallo(diaMaestro, talloVisitante) {
  var TL = _depMes('TALLOS','./motor');
  var dm = typeof diaMaestro === 'string' ? TL.filter(function(t){return t.pinyin===diaMaestro;})[0] : diaMaestro;
  var tv = typeof talloVisitante === 'string' ? TL.filter(function(t){return t.pinyin===talloVisitante;})[0] : talloVisitante;
  if (!dm || !tv) return null;

  var iDM = TE_ELEMENTOS_MES.indexOf(dm.elemento);
  var iTV = TE_ELEMENTOS_MES.indexOf(tv.elemento);
  var grupo;
  if (iTV === iDM) grupo = 'relaciones';
  else if (iTV === (iDM + 1) % 5) grupo = 'creatividad';
  else if (iTV === (iDM + 2) % 5) grupo = 'prosperidad';
  else if (iTV === (iDM + 3) % 5) grupo = 'emociones';
  else grupo = 'intelecto';

  var directo = dm.yang === tv.yang;
  var pref = {relaciones:'R', creatividad:'C', prosperidad:'P', emociones:'E', intelecto:'I'}[grupo];
  return {
    codigo: pref + (directo ? 'D' : 'I'),
    grupo: grupo,
    titulo: TE_GRUPOS_PERFIL[grupo].titulo,
    modo: directo ? 'directo' : 'indirecto',
    tallo: tv,
    descripcionModo: directo
      ? 'El tema entra de frente: suele sentirse más visible y fácil de ubicar.'
      : 'El tema entra por los bordes: suele aparecer a través de señales, cambios o personas menos obvias.'
  };
}

function tallosOcultosMes(rama) {
  var TL = _depMes('TALLOS','./motor');
  var key = typeof rama === 'string' ? rama : (rama && rama.pinyin);
  var ids = TE_OCULTOS_MES[key] || [];
  return ids.map(function(i){ return TL[i]; });
}

function etapaCrecimientoMes(diaMaestro, ramaMes) {
  var TL = _depMes('TALLOS','./motor'), RM = _depMes('RAMAS','./motor');
  var dm = typeof diaMaestro === 'string' ? TL.filter(function(t){return t.pinyin===diaMaestro;})[0] : diaMaestro;
  var rm = typeof ramaMes === 'string' ? RM.filter(function(r){return r.pinyin===ramaMes;})[0] : ramaMes;
  if (!dm || !rm || !TE_INICIO_ETAPA[dm.pinyin]) return null;
  var inicio = TE_INICIO_ETAPA[dm.pinyin];
  var iR = RM.indexOf(rm);
  var paso = inicio.dir === 1
    ? ((iR - inicio.rama) % 12 + 12) % 12
    : ((inicio.rama - iR) % 12 + 12) % 12;
  var base = TE_ETAPAS_MES[paso];
  var out = {};
  for (var k in base) out[k] = base[k];
  out.indice = paso;
  out.rama = rm;
  return out;
}

function interaccionesMensuales(carta, ramaMes, sinHora) {
  var RM = _depMes('RAMAS','./motor');
  var choqueFn = _depMes('choque','./motor');
  var combinaFn = _depMes('combinacion','./motor');
  var iMes = RM.indexOf(ramaMes);
  var claves = sinHora ? ['anio','mes','dia'] : ['anio','mes','dia','hora'];
  var out = [];

  claves.forEach(function(k){
    var natal = carta.pilares[k].rama;
    var iNat = RM.indexOf(natal);
    var tipo = null;
    if (iMes === iNat) tipo = 'resonancia';
    else if (choqueFn(iMes) === iNat) tipo = 'choque';
    else if (combinaFn(iMes) === iNat) tipo = 'combinacion';
    if (!tipo) return;

    var terr = TE_TERRITORIOS_MES[k];
    var texto;
    if (tipo === 'choque') {
      texto = 'El mes pone fricción en ' + terr.titulo + ': ' + terr.tema + ' piden ajustar ritmo, expectativas o dirección.';
    } else if (tipo === 'combinacion') {
      texto = 'El mes encuentra apoyo en ' + terr.titulo + ': ' + terr.tema + ' pueden ofrecer una vía más fluida para mover lo importante.';
    } else {
      texto = 'El mes repite la rama de ' + terr.titulo + ': ' + terr.tema + ' ganan volumen y merecen atención deliberada.';
    }
    out.push({pilar:k,tipo:tipo,titulo:terr.titulo,tema:terr.tema,texto:texto,ramaNatal:natal});
  });
  return out;
}

function pilarMensualPara(anio, mes) {
  var cuatro = _depMes('cuatroPilares','./motor');
  // El día 15 queda lejos de las transiciones solares de inicio de mes.
  // Así obtenemos el pilar que representa al mes gregoriano mostrado.
  return cuatro({anio:anio,mes:mes,dia:15,hora:12,minuto:0,offsetTZ:0});
}

function lecturaMensual(carta, opciones) {
  opciones = opciones || {};
  var anio = Number(opciones.anio), mes = Number(opciones.mes);
  var sinHora = !!opciones.sinHora;
  if (!carta || !anio || !mes) throw new Error('Lectura mensual: faltan carta, año o mes.');

  var transito = pilarMensualPara(anio, mes);
  var pMes = transito.pilares.mes;
  var principal = perfilMensualDeTallo(carta.diaMaestro, pMes.tallo);
  var ocultos = tallosOcultosMes(pMes.rama).map(function(t){
    return perfilMensualDeTallo(carta.diaMaestro, t);
  });
  var etapa = etapaCrecimientoMes(carta.diaMaestro, pMes.rama);
  var inter = interaccionesMensuales(carta, pMes.rama, sinHora);
  var grupo = TE_GRUPOS_PERFIL[principal.grupo];

  var tono = principal.modo === 'directo'
    ? 'Este tema entra de frente durante el mes.'
    : 'Este tema entra por vías laterales y puede tardar un poco más en hacerse evidente.';

  var foco = etapa.trabajar[0] + '. Después, ' + grupo.trabajar[0] + '.';
  var recomendacion = grupo.trabajar[1] + '. ' + etapa.trabajar[1] + '.';
  var atencion = grupo.cuidado + ' ' + etapa.cuidado;

  return {
    anio:anio, mes:mes,
    transito:transito,
    pilar:pMes,
    diaMaestro:carta.diaMaestro,
    perfilPrincipal:principal,
    perfilesOcultos:ocultos,
    etapa:etapa,
    interacciones:inter,
    grupo:grupo,
    resumen: {
      titulo:'Este mes se mueve alrededor de ' + grupo.titulo.toLowerCase() + '.',
      tono:tono,
      foco:foco,
      recomendacion:recomendacion,
      atencion:atencion,
      puede:grupo.puede.slice(0,2).concat(etapa.puede.slice(0,2)),
      trabajar:grupo.trabajar.slice(0,2).concat(etapa.trabajar.slice(0,2))
    }
  };
}

(function(raiz){
  var api={
    TE_OCULTOS_MES:TE_OCULTOS_MES,
    TE_ETAPAS_MES:TE_ETAPAS_MES,
    TE_GRUPOS_PERFIL:TE_GRUPOS_PERFIL,
    perfilMensualDeTallo:perfilMensualDeTallo,
    tallosOcultosMes:tallosOcultosMes,
    etapaCrecimientoMes:etapaCrecimientoMes,
    interaccionesMensuales:interaccionesMensuales,
    pilarMensualPara:pilarMensualPara,
    lecturaMensual:lecturaMensual
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else for(var k in api)raiz[k]=api[k];
})(typeof globalThis!=='undefined'?globalThis:this);
