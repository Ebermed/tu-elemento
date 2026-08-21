/**
 * TU ELEMENTO — Lectura
 * ------------------------------------------------------------------
 * La capa de profundidad. Convierte una carta completa en varias piezas
 * de contenido, cada una con su propia puerta de entrada.
 *
 * PRINCIPIO
 * Nada de efecto Forer. Frases que le quedan a todo el mundo producen
 * "ay sí, es cierto" y luego se olvidan. Lo que hace que alguien mande
 * una captura es lo contrario: algo específico que además le cuesta.
 *
 * Por eso el material más fuerte de este archivo no son las
 * descripciones sino las INTERACCIONES: si tu rama de día choca con la
 * de año, eso es un hecho estructural de tu carta, le pasa a una
 * minoría, y significa algo concreto. Eso no es Forer, es geometría.
 */

// ─────────────────────────────────────────────────────────────
// LAS DOCE RAMAS
// ─────────────────────────────────────────────────────────────
// Mismo tratamiento que los diez tallos: imagen, movimiento, costo,
// frase. Las asociaciones (estación, elemento, hora del día) son las
// clásicas; la redacción es propia.

/* Resolución de dependencias sin declarar nombres nuevos.
   Declarar `var X` cuando otro archivo ya hizo `const X` es un SyntaxError
   en el navegador, así que aquí no se declara nada: se busca. */
function _dep(nombre, ruta) {
  if (typeof globalThis !== 'undefined' && globalThis[nombre] !== undefined) return globalThis[nombre];
  if (typeof require !== 'undefined') { try { return require(ruta)[nombre]; } catch (e) {} }
  return undefined;
}

var ANIMALES = {
  Zi:   { nombre:'Rata', estacion:'invierno · agua yang',
          movimiento:'Detectas oportunidades rápido y sueles guardar varias salidas antes de moverte. Te gusta saber que todavía quedan opciones.',
          tension:'Tener tantas puertas abiertas puede hacer que elegir una cueste más de lo necesario.',
          frase:'Siempre hay un plan B guardado por ahí. A veces hasta un C.' },
  Chou: { nombre:'Buey', estacion:'final del invierno · tierra yin',
          movimiento:'Avanzas despacio, pero lo que empiezas suele tener continuidad. Prefieres construir paso a paso y saber dónde estás pisando.',
          tension:'Aguantas mucho. Eso ayuda a sostener procesos largos, aunque también puede alargar una etapa que ya pedía soltarse.',
          frase:'Vas midiendo cada paso. Cuando arrancas, cuesta sacarte del camino.' },
  Yin:  { nombre:'Tigre', estacion:'inicio de primavera · madera yang',
          movimiento:'Arrancas con fuerza y te sale natural ser quien pone algo en movimiento cuando los demás siguen pensándolo.',
          tension:'Tu impulso llega antes que la estructura. A veces empiezas a correr mientras el plan todavía se está amarrando los zapatos.',
          frase:'Tú ya empezaste mientras los demás siguen preguntando quién da el primer paso.' },
  Mao:  { nombre:'Conejo', estacion:'primavera · madera yin',
          movimiento:'Lees el ambiente y sabes acomodar las piezas para que una conversación o un grupo funcione con menos fricción.',
          tension:'Cuidar tanto la armonía puede hacer que una conversación importante se quede esperando demasiado tiempo.',
          frase:'Sabes bajar el volumen de una habitación. Solo cuida que lo importante también llegue a decirse.' },
  Chen: { nombre:'Dragón', estacion:'final de primavera · tierra yang',
          movimiento:'Piensas en grande y sueles juntar piezas que parecían venir de lugares distintos. Te atraen las etapas de cambio y construcción.',
          tension:'Cuando todo parece importante, decidir qué va primero puede volverse la parte más pesada.',
          frase:'Tienes varias habitaciones abiertas al mismo tiempo. Conviene elegir cuál toca ordenar primero.' },
  Si:   { nombre:'Serpiente', estacion:'inicio de verano · fuego yin',
          movimiento:'Observas, calculas y prefieres moverte cuando el momento ya está bastante claro. Sueles notar cosas que otros pasan por alto.',
          tension:'Pensarlo un poco más siempre parece razonable, hasta que el momento empieza a irse.',
          frase:'Ya lo habías visto venir. Ahora toca decidir cuándo actuar.' },
  Wu:   { nombre:'Caballo', estacion:'verano pleno · fuego yang',
          movimiento:'Pones ritmo, haces visible lo que ocurre y te sale natural mover las cosas cuando el ambiente se queda quieto.',
          tension:'La velocidad te ayuda a arrancar, aunque mantenerla demasiado tiempo puede dejar pendientes detrás.',
          frase:'Llegas rápido y haces que todo se mueva contigo. También viene bien revisar qué quedó atrás.' },
  Wei:  { nombre:'Cabra', estacion:'final de verano · tierra yin',
          movimiento:'Cuidas el proceso, notas el contexto y sueles prestar atención a detalles que hacen que la experiencia se sienta mejor.',
          tension:'Cuando intentas atender todas las variables, tu prioridad principal puede empezar a perder volumen.',
          frase:'Cuidas muchas cosas a la vez. Tu propia prioridad también merece sitio en la mesa.' },
  Shen: { nombre:'Mono', estacion:'inicio de otoño · metal yang',
          movimiento:'Encuentras atajos, herramientas y maneras ingeniosas de resolver algo que otros estaban complicando.',
          tension:'Resolver la parte interesante puede quitarle encanto al último tramo, justo donde toca cerrar y entregar.',
          frase:'Encuentras la vuelta rápido. El último paso también cuenta.' },
  You:  { nombre:'Gallo', estacion:'otoño pleno · metal yin',
          movimiento:'Ves el detalle que descompone el conjunto y tienes facilidad para ordenar, corregir y elevar el estándar.',
          tension:'Tu ojo sigue encontrando cosas que mejorar incluso cuando el resultado ya está bastante bien.',
          frase:'Ves la costura que nadie más vio. También conviene saber cuándo dejarla en paz.' },
  Xu:   { nombre:'Perro', estacion:'final de otoño · tierra yang',
          movimiento:'Cuando decides que algo o alguien importa, lo sostienes con mucha lealtad y sentido de compromiso.',
          tension:'Esa lealtad puede mantenerte unido a estructuras que ya dieron todo lo que podían dar.',
          frase:'Te quedas cuando importa. Solo revisa de vez en cuando si todavía estás sosteniendo lo mismo.' },
  Hai:  { nombre:'Cerdo', estacion:'inicio de invierno · agua yin',
          movimiento:'Das espacio, haces que la gente se sienta recibida y sueles abrir conversación con bastante facilidad.',
          tension:'Dar tanto de entrada puede dejarte con menos energía o margen del que imaginabas.',
          frase:'Abres la puerta rápido. Acuérdate de guardar un cuarto para ti.' },
};

// ─────────────────────────────────────────────────────────────
// LOS CUATRO PILARES Y SU TERRITORIO
// ─────────────────────────────────────────────────────────────
// Cada pilar gobierna un ámbito de la vida y una etapa. Esto es lo que
// permite varias puertas de entrada: alguien puede llegar buscando "mi
// signo del mes" y recibir una lectura de trabajo.

var PILARES = {
  anio: { titulo:'Tu origen', etapa:'el mundo que te recibió',
          ambito:'familia extensa, amistades tempranas y contexto social',
          intro:'Tu origen habla del mundo que te recibió: familia extensa, amistades tempranas y el ambiente donde aprendiste por primera vez cómo moverte entre los demás.' },
  mes:  { titulo:'Tu trayectoria', etapa:'cómo aprendiste a avanzar',
          ambito:'formación, carrera, logros y entorno de trabajo',
          intro:'Tu trayectoria mira la parte de tu carta ligada a estudios, trabajo, responsabilidades y logros. Cuenta mucho sobre la manera en que aprendiste a desenvolverte fuera de casa.' },
  dia:  { titulo:'Tú', etapa:'tu centro y tus vínculos cercanos',
          ambito:'elemento base, pareja, vínculos íntimos y vida emocional',
          intro:'Este pilar te pone a ti en el centro. Aquí aparece el tallo que define tu elemento base, junto con una capa ligada a pareja, intimidad y vida emocional.' },
  hora: { titulo:'Tu futuro', etapa:'lo que vas construyendo',
          ambito:'proyectos, hijos, vida interior, recursos a largo plazo y legado',
          intro:'Tu futuro mira lo que desarrollas con el tiempo: proyectos, hijos, vida interior, recursos de largo plazo y aquello que quieres dejar creciendo después de ti.' },
};

// ─────────────────────────────────────────────────────────────
// INTERACCIONES INTERNAS
// ─────────────────────────────────────────────────────────────
// Aquí está la especificidad real. No le pasa a todos.

var CHOQUES = {
  'anio-mes':  'Tu origen y tu trayectoria a veces te piden cosas distintas. Puede sentirse como haber aprendido un código en casa y necesitar otro para estudiar, trabajar o abrirte camino.',
  'anio-dia':  'Tu origen y tú quedan frente a frente. Este roce suele hablar de aprender a distinguir qué viene de tu entorno y qué sí elegiste para ti.',
  'anio-hora': 'Tu origen y tu futuro jalan hacia lugares distintos. Parte de lo que heredaste puede pedir una cosa mientras lo que quieres construir te pide otra.',
  'mes-dia':   'Tu trayectoria y tú piden atención al mismo tiempo. El reto suele estar en repartir energía entre desempeño, relaciones y vida personal.',
  'mes-hora':  'Tu trayectoria y tu futuro llevan ritmos distintos. Vale la pena mirar cuánto de lo que haces hoy alimenta de verdad lo que quieres construir después.',
  'dia-hora':  'Tú y tu futuro pueden pedir tiempos distintos. Tus necesidades personales y tus proyectos crecen mejor cuando cada uno recibe su propio espacio.',
};

var COMBINACIONES = {
  'anio-mes':  'Tu origen y tu trayectoria se apoyan entre sí. Cosas que aprendiste temprano pueden convertirse en recursos muy útiles para estudiar, trabajar y asumir responsabilidades.',
  'anio-dia':  'Tu origen y tú encuentran puntos de continuidad. Parte de lo que recibiste al crecer puede sentirse bastante integrada con quien eres hoy.',
  'anio-hora': 'Tu origen y tu futuro se conectan. Algo de lo heredado encuentra una salida natural dentro de lo que quieres construir y dejar.',
  'mes-dia':   'Tu trayectoria y tú se entienden bien. Lo que haces y la forma en que piensas pueden encontrar una salida bastante natural entre sí.',
  'mes-hora':  'Tu trayectoria y tu futuro se apoyan. Lo que haces hoy puede convertirse con facilidad en material para proyectos de más largo plazo.',
  'dia-hora':  'Tú y tu futuro encuentran continuidad. Tus proyectos tienden a sentirse más propios cuando nacen de algo que de verdad te importa.',
};

// ─────────────────────────────────────────────────────────────
// VACÍOS · ramas que quedan sin pareja en cada bloque de diez
// ─────────────────────────────────────────────────────────────
// La interfaz conserva la etiqueta "vacío" porque el usuario la reconoce y la entiende dentro de esta lectura.
// El motor conserva la mecánica matemática de las dos ramas que quedan
// fuera en cada bloque de diez combinaciones del ciclo de 60.

var VACIOS = {
  anio: {
    titulo:'Vacío en tu origen',
    texto:'Aquí el vacío pone atención en pertenencia, familia extensa y entorno social. Muchas de esas referencias se van construyendo con experiencia propia, en vez de sentirse dadas desde el principio.',
    filo:'Una buena pregunta para esta zona: ¿qué personas y lugares sí se sienten como casa para ti hoy?' },
  mes: {
    titulo:'Vacío en tu trayectoria',
    texto:'Aquí el vacío toca estudios, trabajo, responsabilidades y logros. Puede acompañar caminos donde el criterio profesional se arma más sobre la marcha, probando y ajustando.',
    filo:'Una buena pregunta para esta zona: ¿qué criterio quieres que guíe tu siguiente paso?' },
  hora: {
    titulo:'Vacío en tu futuro',
    texto:'Aquí el vacío cae sobre proyectos, hijos, vida interior y lo que quieres construir a largo plazo. Esa parte del mapa suele tomar forma a medida que eliges qué merece seguir creciendo.',
    filo:'Una buena pregunta para esta zona: ¿qué proyecto merece una forma más concreta durante esta etapa?' },
};

/** ¿Qué pilares de esta carta caen en vacío? */
function vaciosDe(carta, claves) {
  var RM = _dep('RAMAS','./motor');
  var out = [];
  claves.forEach(function (k) {
    if (k === 'dia') return;                    // el día define el vacío
    var r = RM.indexOf(carta.pilares[k].rama);
    if (carta.vacio.ramas.indexOf(r) !== -1 && VACIOS[k]) {
      out.push({ pilar:k, titulo:VACIOS[k].titulo, texto:VACIOS[k].texto,
                 filo:VACIOS[k].filo, rama:carta.pilares[k].rama.animal });
    }
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// BALANCE DE ELEMENTOS, EN LENGUAJE
// ─────────────────────────────────────────────────────────────

var ABUNDA = {
  madera:'La madera aparece con fuerza. Hay bastante impulso para empezar, crecer y abrir rutas; elegir cuáles sí merecen continuidad evita que todo quiera crecer al mismo tiempo.',
  fuego: 'El fuego tiene mucha presencia. Expresar, entusiasmar y hacer visible lo que te importa suele salir con facilidad; guardar ratos de descanso ayuda a que esa energía dure.',
  tierra:'La tierra pesa bastante en tu carta. Sostener, organizar y dar continuidad puede salirte natural; dejar espacio para cambiar de opinión mantiene esa estabilidad viva.',
  metal: 'El metal aparece con fuerza. Límites, criterio y puntos de cierre suelen verse claros; una segunda mirada puede sumar matices antes de decidir.',
  agua:  'El agua tiene mucha presencia. Observas, conectas y detectas posibilidades rápido; elegir una corriente principal evita que tanta información te jale para lados distintos.',
};
var FALTA = {
  madera:'La madera aparece poco. Darle nombre al siguiente paso, aunque sea pequeño, puede ayudarte a que una idea tenga por dónde empezar a crecer.',
  fuego: 'El fuego aparece poco. Mostrar lo que te entusiasma, celebrar avances y dejar que otras personas vean tu trabajo puede abrir una parte más reservada.',
  tierra:'La tierra aparece poco. Una rutina simple, una fecha en el calendario o un punto fijo de apoyo pueden darle continuidad a lo que ya comenzaste.',
  metal: 'El metal aparece poco. Poner criterios claros y decidir dónde termina cada cosa puede hacer más ligeras varias decisiones.',
  agua:  'El agua aparece poco. Darte un momento para observar, comparar y dejar que una idea repose puede aportar perspectiva antes del siguiente movimiento.',
};

// ─────────────────────────────────────────────────────────────
// ENSAMBLADO
// ─────────────────────────────────────────────────────────────

/**
 * @param {object} carta   salida de cuatroPilares()
 * @param {boolean} sinHora  si el usuario no dio hora de nacimiento
 */
function lecturaCompleta(carta, sinHora) {
  var claves = sinHora ? ['anio','mes','dia'] : ['anio','mes','dia','hora'];
  var IDS = _dep('IDENTIDADES','./traduccion');
  var id = IDS[carta.diaMaestro.pinyin];

  // ── los cuatro pilares, cada uno como pieza independiente ──
  var pilares = claves.map(function (k) {
    var p = carta.pilares[k];
    var an = ANIMALES[p.rama.pinyin];
    var tallo = IDS[p.tallo.pinyin];
    return {
      clave: k,
      titulo: PILARES[k].titulo,
      etapa: PILARES[k].etapa,
      ambito: PILARES[k].ambito,
      intro: PILARES[k].intro,
      animal: an.nombre,
      elemento: tallo.nombre,
      elementoCrudo: p.tallo.elemento,
      nombreTecnico: p.nombre,
      etiqueta: an.nombre + ' de ' + p.tallo.elemento,
      movimiento: an.movimiento,
      tension: an.tension,
      frase: an.frase,
      estacion: an.estacion,
    };
  });

  // ── interacciones entre las ramas de la propia carta ──
  var RM = _dep('RAMAS','./motor'), CH = _dep('choque','./motor'),
      CB = _dep('combinacion','./motor');
  var tensiones = [];
  for (var i = 0; i < claves.length; i++) {
    for (var j = i + 1; j < claves.length; j++) {
      var a = claves[i], b = claves[j];
      var ra = RM.indexOf(carta.pilares[a].rama);
      var rb = RM.indexOf(carta.pilares[b].rama);
      var par = a + '-' + b;
      if (rb === CH(ra)) {
        tensiones.push({ tipo:'choque', par: par, entre: [a, b],
          texto: CHOQUES[par],
          detalle: 'Roce · ' + ANIMALES[carta.pilares[a].rama.pinyin].nombre + ' y ' +
                   ANIMALES[carta.pilares[b].rama.pinyin].nombre });
      } else if (rb === CB(ra)) {
        tensiones.push({ tipo:'combinacion', par: par, entre: [a, b],
          texto: COMBINACIONES[par],
          detalle: 'Enlace · ' + ANIMALES[carta.pilares[a].rama.pinyin].nombre + ' y ' +
                   ANIMALES[carta.pilares[b].rama.pinyin].nombre });
      }
    }
  }

  // ── vacíos ──
  var vacios = vaciosDe(carta, claves);
  var RM2 = _dep('RAMAS','./motor');
  pilares.forEach(function (p) {
    p.vacio = vacios.some(function (v) { return v.pilar === p.clave; });
  });

  // ── balance ──
  var bal = carta.balanceElementos;
  var total = 0, orden = [];
  for (var e in bal) { total += bal[e]; orden.push([e, bal[e]]); }
  orden.sort(function (x, y) { return y[1] - x[1]; });
  var matices = [];
  if (orden[0][1] >= total * 0.375) matices.push(ABUNDA[orden[0][0]]);
  if (orden[orden.length-1][1] === 0) matices.push(FALTA[orden[orden.length-1][0]]);

  return {
    elemento: {
      nombre: id.nombre, imagen: id.imagen, movimiento: id.movimiento,
      tension: id.tension, frase: id.frase, paleta: id.paleta,
      elemento: id.elemento,
    },
    pilares: pilares,
    tensiones: tensiones,
    vacios: vacios,
    ramasVacias: carta.vacio.ramas.map(function (i) { return RM2[i].animal; }),
    balance: { conteo: bal, matices: matices, dominante: orden[0][0], ausente: orden[orden.length-1][1] === 0 ? orden[orden.length-1][0] : null },
    sinHora: !!sinHora,
    // Cuántas piezas de contenido tiene esta carta. Sirve para prometer
    // profundidad en la portada sin mentir.
    piezas: 1 + pilares.length + tensiones.length + vacios.length + matices.length,
  };
}

/** Puertas de entrada: cada una devuelve una pieza suelta y compartible. */
function porElemento(carta) {
  var IDS = _dep('IDENTIDADES','./traduccion');
  var id = IDS[carta.diaMaestro.pinyin];
  return { tipo:'elemento', titulo:'Tu elemento base: ' + id.nombre, cuerpo:[id.movimiento, id.tension], frase:id.frase };
}
function porAnimal(carta, cualPilar) {
  var p = carta.pilares[cualPilar || 'anio'];
  var an = ANIMALES[p.rama.pinyin];
  return { tipo:'animal', titulo:PILARES[cualPilar || 'anio'].titulo + ': ' + an.nombre,
           cuerpo:[an.movimiento, an.tension], frase:an.frase };
}

(function (raiz) {
  var api = { ANIMALES, PILARES, CHOQUES, COMBINACIONES, VACIOS, vaciosDe, lecturaCompleta, porElemento, porAnimal };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
