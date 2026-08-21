/**
 * TU ELEMENTO — Capa de traducción
 * ------------------------------------------------------------------
 * Convierte el tallo del día (uno de los 10 tallos) en una identidad
 * con nombre, imagen y texto compartible.
 *
 * PRINCIPIO DE DISEÑO
 * Yang/yin describe la forma. La fuerza del tallo del día pertenece a otro
 * cálculo (estación + apoyo + raíz) y va en la capa de profundidad.
 * Aquí nada puede sonar a "te tocó el bueno" o "te tocó el malo":
 * los diez son pares, ninguno es mejor.
 *
 * Las imágenes (roble/hiedra, sol/brasa, montaña/huerto...) son las
 * asociaciones clásicas de los diez tallos, de dominio público.
 * La redacción es original.
 *
 * CONTRA EL EFECTO BARNUM
 * "Eres cálido y te importa la gente" le queda a todo el mundo y no
 * sirve. Cada texto de aquí tiene que nombrar un COSTO concreto. El
 * costo es lo que hace que alguien se sienta visto en vez de halagado.
 */

const IDENTIDADES = {
  Jia: {
    nombre: 'Roble', elemento: 'madera',
    imagen: 'Madera Yang · firme, vertical y hecha para crecer con dirección.',
    movimiento: 'Cuando ves un rumbo claro, echas raíces y avanzas con constancia. Te gusta construir algo que pueda durar.',
    tension: 'Tu firmeza también pesa: a veces sostienes una ruta un poco más de la cuenta, incluso cuando el terreno ya cambió.',
    frase: 'Creces derecho, incluso cuando el terreno viene chueco. Pero también conviene revisar hacia dónde sigues creciendo.',
    paleta: ['#4A7C59', '#8FBC8F', '#2F4F32'],
  },
  Yi: {
    nombre: 'Hiedra', elemento: 'madera',
    imagen: 'Madera Yin · flexible, conectada y muy buena para encontrar por dónde seguir.',
    movimiento: 'Lees rápido el entorno, detectas apoyos y encuentras una ruta incluso cuando el camino directo está cerrado.',
    tension: 'Te adaptas con tanta facilidad que a veces terminas acomodándote a todo menos a lo que tú querías.',
    frase: 'Siempre encuentras por dónde subir. Solo cuida que la pared siga llevando a donde quieres llegar.',
    paleta: ['#7FB069', '#C9E4A6', '#3E6B3A'],
  },
  Bing: {
    nombre: 'Sol', elemento: 'fuego',
    imagen: 'Fuego Yang · visible, expansivo y capaz de cambiar el ánimo de un lugar.',
    movimiento: 'Llegas y el ambiente se mueve contigo. Das energía, haces visible lo importante y sueles encender a la gente alrededor.',
    tension: 'Tu presencia se nota tanto que también se nota cuando te quedas sin batería. Sostener el mismo brillo todo el tiempo termina cobrando factura.',
    frase: 'Entras, y todo se enciende un poco. Pero hasta el sol necesita bajar antes de volver a salir.',
    paleta: ['#FF8C42', '#FFD97D', '#E4572E'],
  },
  Ding: {
    nombre: 'Brasa', elemento: 'fuego',
    imagen: 'Fuego Yin · concentrado, íntimo y capaz de sostener calor durante mucho tiempo.',
    movimiento: 'Pones mucha energía en pocas cosas. Cuando algo te importa, lo cuidas de cerca y mantienes el fuego encendido.',
    tension: 'Ese foco puede volverse desgaste cuando demasiadas personas o tareas esperan que las sigas calentando tú.',
    frase: 'Calientas a pocos, pero de verdad. El reto aparece cuando todos quieren acercarse al mismo fuego.',
    paleta: ['#D96C4F', '#F2A65A', '#8C3B2E'],
  },
  Wu: {
    nombre: 'Montaña', elemento: 'tierra',
    imagen: 'Tierra Yang · estable, sólida y fácil de convertir en punto de apoyo.',
    movimiento: 'La gente se apoya en ti. Sueles cargar mucho sin hacer ruido y dar sensación de estabilidad cuando alrededor todo se mueve.',
    tension: 'Te cuesta moverte después de haber sostenido algo durante mucho tiempo. A veces te quedas incluso cuando ese lugar ya te quedó chico.',
    frase: 'Todos se recargan en ti. Pero casi nadie te pregunta si cargas demasiado peso.',
    paleta: ['#B08968', '#DDB892', '#7F5539'],
  },
  Ji: {
    nombre: 'Huerto', elemento: 'tierra',
    imagen: 'Tierra Yin · fértil, cuidadosa y pendiente de lo que necesita cada cosa para crecer.',
    movimiento: 'Haces florecer lo ajeno. Notas qué falta, cuidas los detalles y sabes crear condiciones para que algo prospere.',
    tension: 'Dar tanto espacio a los demás puede dejar tu propio terreno para después, sobre todo cuando todos parecen necesitar algo de ti.',
    frase: 'Lo que cuidas crece. Solo acuérdate de guardar una parte de esa tierra para ti.',
    paleta: ['#C2A878', '#E6D3A3', '#8A7145'],
  },
  Geng: {
    nombre: 'Acero', elemento: 'metal',
    imagen: 'Metal Yang · directo, estructurado y hecho para cortar lo que estorba.',
    movimiento: 'Dices lo que otros vienen rodeando. Separas lo esencial de lo accesorio y decides con rapidez.',
    tension: 'La misma claridad que resuelve también puede sentirse afilada. A veces ves la herida después de haber hecho el corte.',
    frase: 'Dices lo necesario, aunque a veces cortes de más. Un poco de contexto también puede hacer el trabajo.',
    paleta: ['#8D99AE', '#C9D1D9', '#5C6672'],
  },
  Xin: {
    nombre: 'Joya', elemento: 'metal',
    imagen: 'Metal Yin · preciso, sensible al detalle y pendiente de la forma final.',
    movimiento: 'Notas el detalle que cambia el conjunto. Te importa que las cosas tengan intención, coherencia y un acabado que se sienta bien hecho.',
    tension: 'Tu estándar puede subir tanto que el punto de cierre se aleja. A veces cuesta aceptar que algo ya está suficientemente pulido.',
    frase: 'Te tomó tiempo pulirte, y eso se nota. También merece la pena saber cuándo dejar de seguir puliendo.',
    paleta: ['#B8B8D1', '#E8E4F0', '#7A7A99'],
  },
  Ren: {
    nombre: 'Marea', elemento: 'agua',
    imagen: 'Agua Yang · amplia, móvil y capaz de conectar muchas cosas a la vez.',
    movimiento: 'Te mueves en volumen. Conectas personas, ideas y oportunidades, y sueles llevar varias corrientes contigo.',
    tension: 'Cuando todas esas corrientes jalan al mismo tiempo, tu energía se reparte. Elegir un cauce ayuda a que toda esa fuerza llegue a algún sitio.',
    frase: 'Cuando encuentras cauce, arrastras mucho contigo. Cuando todo tira a la vez, terminas repartido entre demasiadas corrientes.',
    paleta: ['#3D5A80', '#98C1D9', '#1F3A5F'],
  },
  Gui: {
    nombre: 'Rocío', elemento: 'agua',
    imagen: 'Agua Yin · sutil, observadora y muy atenta a lo que cambia en el ambiente.',
    movimiento: 'Llegas despacio y notas lo que otros pasan por alto. Sueles captar matices, silencios y cambios pequeños antes de que se vuelvan evidentes.',
    tension: 'Esa sutileza hace que a veces tus propias necesidades queden fuera de cuadro. Los demás pueden tardar en darse cuenta de lo que tú ya llevabas rato sintiendo.',
    frase: 'Llegas sin ruido, pero dejas huella. Solo procura que también se vea lo que tú necesitas.',
    paleta: ['#7BA7BC', '#CDE5EC', '#4A7186'],
  },
};

/** Alternativas para A/B test. La marca puede cambiar sin tocar el motor. */
const VARIANTES = {
  Ji:   ['Huerto', 'Milpa'],      // Milpa pega durísimo en México, revisar fuera
  Ren:  ['Marea', 'Océano'],
  Gui:  ['Rocío', 'Neblina'],
  Geng: ['Acero', 'Hacha'],
};

// ─────────────────────────────────────────────────────────────
// BALANCE DE ELEMENTOS → LENGUAJE
// ─────────────────────────────────────────────────────────────
// Segunda capa de personalización, y la que hace que dos personas del
// mismo tallo del día reciban matices distintos.

const ELEMENTO_ABUNDA = {
  madera: 'La madera aparece con fuerza en tu carta. Hay impulso para empezar, crecer y buscar nuevas rutas; elegir cuáles sí merecen continuidad evita que todo quiera crecer al mismo tiempo.',
  fuego:  'El fuego tiene mucha presencia. Expresar, entusiasmar y hacer visible lo que te importa suele salir con facilidad; guardar ratos de descanso ayuda a que esa energía dure.',
  tierra: 'La tierra pesa bastante en tu carta. Sostener, organizar y dar continuidad se te puede dar con naturalidad; dejar espacio para cambiar de opinión mantiene esa estabilidad viva.',
  metal:  'El metal aparece con fuerza. Sueles detectar límites, criterios y puntos de cierre con claridad; una segunda mirada ayuda a que esa precisión también deje espacio para matices.',
  agua:   'El agua tiene mucha presencia. Observas, conectas y detectas posibilidades rápido; elegir una corriente principal evita que tanta información termine jalando para lados distintos.',
};

const ELEMENTO_FALTA = {
  madera: 'La madera aparece poco. Darle nombre al siguiente paso, aunque sea pequeño, puede ayudarte a que una idea tenga por dónde empezar a crecer.',
  fuego:  'El fuego aparece poco. Mostrar lo que te entusiasma, celebrar avances y dejar que otras personas vean tu trabajo puede abrir una parte que suele quedarse más reservada.',
  tierra: 'La tierra aparece poco. Una rutina simple, una fecha en el calendario o un punto fijo de apoyo pueden darle continuidad a lo que ya comenzaste.',
  metal:  'El metal aparece poco. Poner criterios claros y decidir dónde termina cada cosa puede hacer más ligeras varias decisiones.',
  agua:   'El agua aparece poco. Darte un momento para observar, comparar y dejar que una idea repose puede aportar perspectiva antes del siguiente movimiento.',
};

/**
 * Traduce la salida de motor.cuatroPilares() a texto de producto.
 * @param {object} carta  resultado de M.cuatroPilares()
 */
function traducir(carta) {
  const id = IDENTIDADES[carta.diaMaestro.pinyin];
  const bal = carta.balanceElementos;

  const total = Object.values(bal).reduce((a, b) => a + b, 0);
  const orden = Object.entries(bal).sort((a, b) => b[1] - a[1]);
  const [elMax, nMax] = orden[0];
  const [elMin, nMin] = orden[orden.length - 1];

  const matices = [];
  if (nMax >= total * 0.375) matices.push(ELEMENTO_ABUNDA[elMax]);
  if (nMin === 0) matices.push(ELEMENTO_FALTA[elMin]);

  return {
    // ── LO QUE VA EN LA IMAGEN COMPARTIBLE ──
    tarjeta: {
      nombre: id.nombre,
      elemento: id.elemento,
      frase: id.frase,
      paleta: id.paleta,
    },
    // ── LO QUE VA EN LA PÁGINA ──
    lectura: {
      titular: `Tu elemento base: ${id.nombre}`,
      imagen: id.imagen,
      movimiento: id.movimiento,
      tension: id.tension,
      matices,
    },
    // Encuadre del pilar de año. NO regaña al lector: no le dice que
    // estaba equivocado, le dice qué territorio cubre ese animal.
    encuadre: `Tu animal del año es ${carta.pilares.anio.rama.animal}. Es la parte más conocida del zodiaco chino y aquí aparece dentro de Tu origen. Tu elemento base sale del tallo del día y ocupa el centro de la lectura.`,
    // ── DEBUG / capa técnica, oculta por defecto ──
    tecnico: {
      diaMaestro: carta.diaMaestro.pinyin,
      pilares: Object.fromEntries(
        ['hora', 'dia', 'mes', 'anio'].map(k => [k, carta.pilares[k].nombre])
      ),
    },
  };
}

/* Exportación universal: CommonJS en Node, global explícito en el navegador.
   Se asigna a globalThis a propósito — los `const` de nivel superior NO se
   cuelgan de window, y depender de eso hace frágil la carga entre archivos. */
(function (raiz) {
  var api = { IDENTIDADES, VARIANTES, traducir };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
