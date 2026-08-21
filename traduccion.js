/**
 * TU ELEMENTO — Capa de traducción
 * ------------------------------------------------------------------
 * Convierte el Día Maestro (uno de los 10 tallos) en una identidad
 * con nombre, imagen y texto compartible.
 *
 * PRINCIPIO DE DISEÑO
 * Yang/yin es FORMA, no fuerza. La fuerza del Día Maestro es otro
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
    nombre: 'Roble',
    elemento: 'madera',
    imagen: 'el árbol que crece derecho',
    // Cómo te mueves por el mundo
    movimiento: 'Avanzas en línea recta y con plan largo. No te encoges para caber en un lugar más chico.',
    // El costo. Sin esto el texto es horóscopo de revista.
    tension: 'Cuando el viento no cede, prefieres quebrarte antes que torcerte.',
    // La línea de la imagen compartible
    frase: 'Creces derecho aunque el terreno esté torcido.',
    paleta: ['#4A7C59', '#8FBC8F', '#2F4F32'],
  },
  Yi: {
    nombre: 'Hiedra',
    elemento: 'madera',
    imagen: 'la enredadera que encuentra la grieta',
    movimiento: 'No empujas de frente: rodeas. Llegas igual, y a nadie le queda claro cómo llegaste.',
    tension: 'Te adaptas tan bien que a veces se te olvida hacia dónde ibas.',
    frase: 'Encuentras la grieta y subes por ahí.',
    paleta: ['#7FB069', '#C9E4A6', '#3E6B3A'],
  },
  Bing: {
    nombre: 'Sol',
    elemento: 'fuego',
    imagen: 'la luz que no sabe esconderse',
    movimiento: 'Entras a un cuarto y el cuarto cambia. Das calor sin escoger a quién.',
    tension: 'Tu único volumen es el alto. El día que te apagas, todos lo notan.',
    frase: 'No sabes entrar despacio.',
    paleta: ['#FF8C42', '#FFD97D', '#E4572E'],
  },
  Ding: {
    nombre: 'Brasa',
    elemento: 'fuego',
    imagen: 'el fuego que dura toda la noche',
    movimiento: 'Alumbras una cosa a la vez, y esa cosa queda alumbrada de verdad.',
    tension: 'Te consumes cuando te piden ser el sol de todos.',
    frase: 'Calientas a pocos, pero de verdad.',
    paleta: ['#D96C4F', '#F2A65A', '#8C3B2E'],
  },
  Wu: {
    nombre: 'Montaña',
    elemento: 'tierra',
    imagen: 'lo que ya estaba aquí y va a seguir después',
    movimiento: 'La gente se recarga en ti. Aguantas peso sin avisar que pesa.',
    tension: 'Te cuesta tanto moverte que a veces te quedas donde ya no querías estar.',
    frase: 'Todos se recargan en ti. Nadie pregunta si pesas.',
    paleta: ['#B08968', '#DDB892', '#7F5539'],
  },
  Ji: {
    nombre: 'Huerto',
    elemento: 'tierra',
    imagen: 'la tierra donde las cosas sí crecen',
    movimiento: 'Haces florecer lo ajeno. Tu talento es notar qué le falta a cada quien.',
    tension: 'Siembras tanto en otros que se te olvida sembrar en ti.',
    frase: 'Todo lo que sembraste está creciendo en jardines ajenos.',
    paleta: ['#C2A878', '#E6D3A3', '#8A7145'],
  },
  Geng: {
    nombre: 'Acero',
    elemento: 'metal',
    imagen: 'el filo antes de pulirse',
    movimiento: 'Cortas. Dices lo que los demás rodean. Decides rápido y sin adornos.',
    tension: 'La misma franqueza que resuelve deja heridas que no alcanzaste a ver.',
    frase: 'Cortas rápido. A veces de más.',
    paleta: ['#8D99AE', '#C9D1D9', '#5C6672'],
  },
  Xin: {
    nombre: 'Joya',
    elemento: 'metal',
    imagen: 'lo que tomó años quedar así',
    movimiento: 'Cuidas la forma. Notas el detalle que descompone el conjunto entero.',
    tension: 'Quieres que te vean, y te enoja contigo mismo querer que te vean.',
    frase: 'Te tomó años quedar así. Y quieres que se note.',
    paleta: ['#B8B8D1', '#E8E4F0', '#7A7A99'],
  },
  Ren: {
    nombre: 'Marea',
    elemento: 'agua',
    imagen: 'el agua que no se queda quieta',
    movimiento: 'Te mueves en volumen. Arrastras gente, ideas y proyectos contigo.',
    tension: 'Cuando no tienes cauce, inundas.',
    frase: 'O te encauzas, o te desbordas.',
    paleta: ['#3D5A80', '#98C1D9', '#1F3A5F'],
  },
  Gui: {
    nombre: 'Rocío',
    elemento: 'agua',
    imagen: 'el agua que entra sin que la sientas',
    movimiento: 'Llegas despacio y llegas hasta el fondo. Notas lo que nadie dijo en voz alta.',
    tension: 'Eres tan sutil que a veces nadie se entera de que estuviste.',
    frase: 'Nadie te vio entrar. Todo está mojado.',
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
// mismo Día Maestro no reciban el mismo texto.

const ELEMENTO_ABUNDA = {
  madera: 'Traes mucha madera: empiezas más cosas de las que terminas.',
  fuego:  'Traes mucho fuego: se te nota todo en la cara antes de que hables.',
  tierra: 'Traes mucha tierra: aguantas situaciones más tiempo del necesario.',
  metal:  'Traes mucho metal: tienes una regla interna para casi todo.',
  agua:   'Traes mucha agua: piensas tres pasos adelante y a veces te quedas ahí.',
};

const ELEMENTO_FALTA = {
  madera: 'Casi no traes madera: te cuesta arrancar sin que alguien te empuje.',
  fuego:  'Casi no traes fuego: guardas el entusiasmo hasta que ya no se ve.',
  tierra: 'Casi no traes tierra: te mueves rápido pero sin suelo fijo.',
  metal:  'Casi no traes metal: te cuesta cerrar y decir que no.',
  agua:   'Casi no traes agua: actúas antes de terminar de pensarlo.',
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
      titular: `Eres ${id.nombre}`,
      imagen: id.imagen,
      movimiento: id.movimiento,
      tension: id.tension,
      matices,
    },
    // Encuadre del pilar de año. NO regaña al lector: no le dice que
    // estaba equivocado, le dice qué territorio cubre ese animal.
    encuadre: `Tu animal de nacimiento es ${carta.pilares.anio.rama.animal}. ` +
              `Ese pilar habla de dónde vienes. Tu elemento habla de quién eres.`,
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
