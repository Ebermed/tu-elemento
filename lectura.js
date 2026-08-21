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
  Zi:   { nombre:'Rata',      estacion:'plena medianoche del invierno',
          movimiento:'Detectas la oportunidad antes que nadie y te mueves sin avisar.',
          tension:'Guardas de más: contactos, opciones, salidas. Nunca cierras una puerta del todo.',
          frase:'Siempre tienes un plan B. Y un C.' },
  Chou: { nombre:'Buey',      estacion:'el invierno que ya no se va',
          movimiento:'Avanzas despacio y no retrocedes. Lo que empiezas, lo terminas años después.',
          tension:'Aguantas situaciones mucho más allá del punto donde ya debías soltarlas.',
          frase:'Vas midiendo cada paso antes de darlo.' },
  Yin:  { nombre:'Tigre',     estacion:'el primer día en que se rompe el invierno',
          movimiento:'Arrancas de golpe. Donde otros piden permiso, tú ya empezaste.',
          tension:'Enciendes con una fuerza que después no sabes administrar.',
          frase:'Empiezas incendios. Los apaga alguien más.' },
  Mao:  { nombre:'Conejo',    estacion:'la primavera ya asentada',
          movimiento:'Lees el ambiente al entrar y te acomodas sin fricción.',
          tension:'Evitas el conflicto tan bien que las cosas se pudren sin que nadie las nombre.',
          frase:'Nunca peleas. Por eso nada se resuelve.' },
  Chen: { nombre:'Dragón',    estacion:'la primavera que se desborda',
          movimiento:'Piensas en grande de forma natural. Lo pequeño te aburre rápido.',
          tension:'Guardas cosas que no muestras, y a veces ni tú sabes qué hay ahí.',
          frase:'Cargas una bodega que nadie ha visto.' },
  Si:   { nombre:'Serpiente', estacion:'el verano que apenas calienta',
          movimiento:'Observas, calculas y hablas al final. Sueles tener razón.',
          tension:'Piensas tanto antes de moverte que a veces el momento ya pasó.',
          frase:'Ya lo habías pensado. No lo dijiste.' },
  Wu:   { nombre:'Caballo',   estacion:'el mediodía del verano',
          movimiento:'Vas al frente, visible, sin pedir permiso. La gente te sigue.',
          tension:'No sabes esperar. Lo que tarda te lo saltas, aunque valiera la pena.',
          frase:'Llegas primero. A veces al lugar equivocado.' },
  Wei:  { nombre:'Cabra',     estacion:'el verano que se va apagando',
          movimiento:'Rodeas. Consigues lo que quieres sin haberlo pedido nunca directamente.',
          tension:'Das tantas vueltas que la gente no sabe qué necesitas de ella.',
          frase:'Nunca pides nada. Y esperas mucho.' },
  Shen: { nombre:'Mono',      estacion:'el primer aire frío del otoño',
          movimiento:'Encuentras el atajo. Le das la vuelta al problema en vez de atravesarlo.',
          tension:'Te aburres apenas lo resuelves, y lo dejas justo antes de terminarlo.',
          frase:'Resuelves rápido. Terminas casi nunca.' },
  You:  { nombre:'Gallo',     estacion:'el otoño en su punto exacto',
          movimiento:'Ves el detalle que descompone el conjunto, y no puedes no verlo.',
          tension:'Corriges en voz alta cosas que nadie te pidió que corrigieras.',
          frase:'Tenías razón. Nadie te lo agradeció.' },
  Xu:   { nombre:'Perro',     estacion:'el otoño que ya es frío',
          movimiento:'Decides de qué lado estás y ahí te quedas, aunque salga caro.',
          tension:'Tu lealtad no distingue entre quien la merece y quien no.',
          frase:'Te quedas. Aunque ya no debías.' },
  Hai:  { nombre:'Cerdo',     estacion:'el invierno que empieza',
          movimiento:'Das primero y preguntas después. La gente se abre contigo rápido.',
          tension:'Confías por defecto, y eso ya te costó por lo menos una vez.',
          frase:'Das de más. Otra vez.' },
};

// ─────────────────────────────────────────────────────────────
// LOS CUATRO PILARES Y SU TERRITORIO
// ─────────────────────────────────────────────────────────────
// Cada pilar gobierna un ámbito de la vida y una etapa. Esto es lo que
// permite varias puertas de entrada: alguien puede llegar buscando "mi
// signo del mes" y recibir una lectura de trabajo.

var PILARES = {
  anio: { titulo:'De dónde vienes', etapa:'infancia y primeros años',
          ambito:'tu familia de origen, tus padres, lo que traías puesto antes de elegir nada',
          intro:'El pilar del año es el que todo el mundo conoce, porque es el animal que te tocó. Pero no habla de ti: habla del mundo donde apareciste.' },
  mes:  { titulo:'Cómo trabajas', etapa:'juventud y vida adulta temprana',
          ambito:'tu carrera, tu ambiente, la gente con la que compites y colaboras',
          intro:'El pilar del mes es el más importante de los cuatro para los maestros clásicos, y el que menos gente conoce. Marca la estación en que naciste y con ella la fuerza de todo lo demás.' },
  dia:  { titulo:'Quién eres', etapa:'la vida adulta plena',
          ambito:'tú mismo en el tallo, y tu pareja en la rama',
          intro:'Aquí vive tu elemento. El tallo eres tú; la rama es el lugar donde se para tu pareja.' },
  hora: { titulo:'Hacia dónde vas', etapa:'la segunda mitad de la vida',
          ambito:'tus hijos, lo que dejas, la parte tuya que solo ves en privado',
          intro:'El pilar de la hora es el más íntimo y el que casi nadie puede calcular, porque casi nadie sabe a qué hora nació.' },
};

// ─────────────────────────────────────────────────────────────
// INTERACCIONES INTERNAS
// ─────────────────────────────────────────────────────────────
// Aquí está la especificidad real. No le pasa a todos.

var CHOQUES = {
  'anio-mes':  'Tu origen y tu trabajo empujan en direcciones opuestas. Lo que aprendiste en casa no te sirvió para el mundo donde acabaste.',
  'anio-dia':  'Chocas con el lugar del que vienes. Construir quién eres te costó separarte de tu familia, y algo de eso sigue abierto.',
  'anio-hora': 'Lo que heredaste y lo que quieres dejar no se parecen. Estás rompiendo una cadena a propósito.',
  'mes-dia':   'Tu trabajo y tu vida privada se estorban. Cuando uno va bien, el otro paga la cuenta.',
  'mes-hora':  'Lo que haces para vivir apunta a otro lado que lo que quieres al final. Ya lo sabes.',
  'dia-hora':  'Tú y lo que estás construyendo van a distinto ritmo. Hay una prisa tuya que no le sirve a lo que viene.',
};

var COMBINACIONES = {
  'anio-mes':  'Tu origen te preparó para el mundo donde acabaste. Lo que viste en casa te sirvió.',
  'anio-dia':  'Estás en paz con el lugar del que vienes. No te tuviste que romper para ser tú.',
  'anio-hora': 'Estás continuando algo que empezó antes de ti, y te sale natural.',
  'mes-dia':   'Trabajas en algo que se parece a lo que eres. Suena obvio y es rarísimo.',
  'mes-hora':  'Lo que haces hoy va en la dirección de lo que quieres al final.',
  'dia-hora':  'Tú y lo que construyes se llevan bien. Avanzas sin pelearte contigo.',
};

// ─────────────────────────────────────────────────────────────
// LOS VACÍOS  (空亡 Kong Wang)
// ─────────────────────────────────────────────────────────────
// Nombre propio: "los vacíos". Ni el término chino ni ninguna
// traducción de nadie más.
//
// Un pilar vacío marca un territorio que no viene dado. Lo que otros
// heredan, aquí se construye a mano. Ese encuadre es el correcto y
// además es el que no asusta.

var VACIOS = {
  anio: {
    titulo:'Tu origen viene vacío',
    texto:'El lugar del que vienes te dejó sin piso firme. El apoyo que otros dan por sentado a ti nunca te llegó solo, y lo que tienes de raíz te lo construiste tú.',
    filo:'Sueles sentirte de ningún lado, incluso en tu propia casa.' },
  mes: {
    titulo:'Tu camino viene vacío',
    texto:'Las carreras con escalones claros te expulsan o te aburren. Llevas años improvisando un camino que nadie te enseñó.',
    filo:'Te cuesta explicar a qué te dedicas en una sola frase.' },
  hora: {
    titulo:'Tu destino viene vacío',
    texto:'Lo que viene después no está escrito, ni siquiera en borrador. Otros a tu edad ya saben en qué van a terminar; tú no, y eso te inquieta más de lo que admites.',
    filo:'Planeas todo menos el final.' },
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
  madera:'Traes mucha madera: empiezas más cosas de las que terminas.',
  fuego: 'Traes mucho fuego: se te nota todo en la cara antes de que hables.',
  tierra:'Traes mucha tierra: aguantas situaciones más tiempo del necesario.',
  metal: 'Traes mucho metal: tienes una regla interna para casi todo.',
  agua:  'Traes mucha agua: piensas tres pasos adelante y a veces te quedas ahí.',
};
var FALTA = {
  madera:'No traes nada de madera: te cuesta arrancar sin que alguien te empuje.',
  fuego: 'No traes nada de fuego: guardas el entusiasmo hasta que ya no se ve.',
  tierra:'No traes nada de tierra: te mueves rápido pero sin suelo fijo.',
  metal: 'No traes nada de metal: te cuesta cerrar y decir que no.',
  agua:  'No traes nada de agua: actúas antes de terminar de pensarlo.',
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
          detalle: ANIMALES[carta.pilares[a].rama.pinyin].nombre + ' contra ' +
                   ANIMALES[carta.pilares[b].rama.pinyin].nombre });
      } else if (rb === CB(ra)) {
        tensiones.push({ tipo:'combinacion', par: par, entre: [a, b],
          texto: COMBINACIONES[par],
          detalle: ANIMALES[carta.pilares[a].rama.pinyin].nombre + ' con ' +
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
  return { tipo:'elemento', titulo:'Eres ' + id.nombre, cuerpo:[id.movimiento, id.tension], frase:id.frase };
}
function porAnimal(carta, cualPilar) {
  var p = carta.pilares[cualPilar || 'anio'];
  var an = ANIMALES[p.rama.pinyin];
  return { tipo:'animal', titulo:'Tu ' + PILARES[cualPilar || 'anio'].titulo.toLowerCase() + ': ' + an.nombre,
           cuerpo:[an.movimiento, an.tension], frase:an.frase };
}

(function (raiz) {
  var api = { ANIMALES, PILARES, CHOQUES, COMBINACIONES, VACIOS, vaciosDe, lecturaCompleta, porElemento, porAnimal };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
