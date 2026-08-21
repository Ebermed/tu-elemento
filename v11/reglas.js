/**
 * TU ELEMENTO — Reglas de calendario
 * ------------------------------------------------------------------
 * El motor conserva las claves tradicionales para que las fórmulas sean
 * auditables. La interfaz usa nombres editoriales propios y actividades
 * cotidianas. Dos capas temporales entran en la lectura del día:
 *   1) un ciclo de 12 ritmos derivado de la rama del mes y la del día;
 *   2) un ciclo continuo de 28 posiciones.
 * A eso se añaden las fricciones entre ramas del día, mes, año y carta natal.
 */

function _depR(nombre, ruta) {
  if (typeof globalThis !== 'undefined' && globalThis[nombre] !== undefined) return globalThis[nombre];
  if (typeof require !== 'undefined') { try { return require(ruta)[nombre]; } catch (e) {} }
  return undefined;
}

function unicas(a, b, limite) {
  var visto = Object.create(null), out = [];
  (a || []).concat(b || []).forEach(function (x) {
    var k = String(x).toLowerCase();
    if (visto[k]) return;
    visto[k] = true; out.push(x);
  });
  return out.slice(0, limite || 6);
}

// ─────────────────────────────────────────────────────────────
// CICLO DE 12 RITMOS
// ─────────────────────────────────────────────────────────────
// La clave pinyin queda interna para reproducir y probar el cálculo.
// Los nombres visibles son una taxonomía editorial propia de Tu Elemento.

const OFICIALES = [
  { pinyin:'Jian', han:'建', nombre:'Arrancar', peso:10,
    caracter:'Este ritmo viene bien para dar el primer paso en algo que ya sabes hacia dónde va. Es de esos días que ayudan a convertir una intención en movimiento.',
    bueno:['empezar un curso','iniciar un proyecto','hacer una primera reunión','comenzar un hábito','salir de viaje'],
    posponer:['cerrar una etapa de forma definitiva','tomar una decisión irreversible'] },
  { pinyin:'Chu', han:'除', nombre:'Depurar', peso:2,
    caracter:'Este ritmo ayuda a quitar peso de encima: cerrar pendientes, recortar lo que sobra y dejar espacio para lo que sigue.',
    bueno:['vaciar pendientes','cancelar suscripciones','editar y recortar','ordenar archivos','cerrar una tarea vieja'],
    posponer:['hacer un gran lanzamiento','asumir un compromiso largo','realizar una compra grande'] },
  { pinyin:'Man', han:'滿', nombre:'Reunir', peso:9,
    caracter:'Este ritmo acompaña bien todo lo que implica reunir: personas, recursos, respuestas o piezas que todavía estaban dispersas.',
    bueno:['cobrar pendientes','reunir al equipo','completar una compra planeada','recibir entregas','cerrar una recopilación'],
    posponer:['aceptar obligaciones poco claras','llenar la agenda con compromisos nuevos'] },
  { pinyin:'Ping', han:'平', nombre:'Ajustar', peso:5,
    caracter:'Este ritmo ayuda cuando varias partes necesitan acomodarse entre sí. Va bien para negociar, repartir y ajustar sin apretar de más.',
    bueno:['negociar condiciones','repartir tareas','revisar un presupuesto','coordinar agendas','resolver diferencias prácticas'],
    posponer:['forzar una decisión rápida','cambiar varias cosas a la vez'] },
  { pinyin:'Ding', han:'定', nombre:'Afianzar', peso:10,
    caracter:'Este ritmo se siente más estable. Acompaña bien decisiones que ya pensaste y ahora quieres sostener con más firmeza.',
    bueno:['formalizar un acuerdo','asumir una responsabilidad','definir una rutina','cerrar una estructura de trabajo','confirmar un plan'],
    posponer:['cambiar de rumbo por impulso','improvisar una salida costosa'] },
  { pinyin:'Zhi', han:'執', nombre:'Ejecutar', peso:6,
    caracter:'Este ritmo pide manos a la obra. Si ya pensaste suficiente, hoy puede ser buen momento para convertir esa decisión en algo concreto.',
    bueno:['enviar una propuesta','retomar una tarea','publicar trabajo terminado','hacer una llamada pendiente','resolver un trámite'],
    posponer:['abrir demasiados frentes','sumar compromisos mientras ejecutas'] },
  { pinyin:'Po', han:'破', nombre:'Desmontar', peso:-9,
    caracter:'Este ritmo sirve para desarmar lo que ya se siente agotado. Recortar, cancelar, depurar o cuestionar una estructura puede liberar bastante espacio.',
    bueno:['cerrar un proceso obsoleto','desinstalar y depurar','cancelar un plan agotado','revisar una suposición','recortar gastos'],
    posponer:['firmar un acuerdo de largo plazo','hacer un gran lanzamiento','comprar algo costoso'] },
  { pinyin:'Wei', han:'危', nombre:'Revisar', peso:-5,
    caracter:'Este ritmo agradece un poco más de margen. Probar, revisar y hacer cambios pequeños suele sentirse más cómodo que comprometerlo todo de una vez.',
    bueno:['probar un prototipo','revisar documentos','hacer una prueba pequeña','planear en privado','corregir errores'],
    posponer:['hacer un lanzamiento grande','asumir un compromiso difícil de revertir','hacer una compra impulsiva'] },
  { pinyin:'Cheng', han:'成', nombre:'Consolidar', peso:14,
    caracter:'Este ritmo ayuda a cerrar bien lo que ya venías trabajando. Entregar, formalizar o mostrar un resultado puede sentirse especialmente natural.',
    bueno:['cerrar un proyecto','firmar un acuerdo revisado','presentar un resultado','entregar trabajo','celebrar un logro'],
    posponer:['abrir una discusión sin preparación','cambiar el objetivo al final del proceso'] },
  { pinyin:'Shou', han:'收', nombre:'Captar', peso:8,
    caracter:'Este ritmo pone el movimiento de regreso hacia ti: respuestas, pagos, comentarios, entregas o recursos que estaban pendientes.',
    bueno:['pedir retroalimentación','cobrar un pendiente','negociar compensación','recibir una entrega','evaluar una oferta'],
    posponer:['aceptar condiciones sin revisar','acumular tareas nuevas'] },
  { pinyin:'Kai', han:'開', nombre:'Mostrar', peso:10,
    caracter:'Este ritmo abre puertas hacia afuera. Presentar, publicar, conocer gente o poner algo frente a más ojos suele encontrar buena corriente.',
    bueno:['hacer una presentación','publicar un lanzamiento','hacer networking','abrir inscripciones','conocer gente nueva'],
    posponer:['guardar una conversación importante para última hora','cerrar un tema que necesita privacidad'] },
  { pinyin:'Bi', han:'閉', nombre:'Pausa', peso:-5,
    caracter:'Este ritmo baja un poco el volumen. Ordenar, respaldar, cerrar cosas pequeñas y recuperar energía puede rendir más que llenar el día.',
    bueno:['hacer respaldos','ordenar archivos','cerrar pendientes menores','revisar la agenda','descansar'],
    posponer:['hacer un lanzamiento importante','asumir una obligación grande','llenar la agenda'] },
];

function oficialDelDia(ramaMes, ramaDia) {
  return OFICIALES[((ramaDia - ramaMes) % 12 + 12) % 12];
}

// ─────────────────────────────────────────────────────────────
// CICLO CONTINUO DE 28 POSICIONES
// ─────────────────────────────────────────────────────────────
// Ancla publicada: 22 sep 2022 = primera posición del ciclo. Desde ahí
// basta contar días módulo 28. Los identificadores tradicionales quedan
// internos; la UI muestra nombres propios de esta app.

const PULSOS_28 = [
  { id:'Jiao', nombre:'Impulso', peso:9,
    caracter:'Este pulso tiene ganas de abrir camino. Presentar una idea, moverte o probar algo nuevo puede sentirse más natural de lo habitual.',
    bueno:['presentar una idea','hacer un viaje','probar algo creativo','ampliar una colaboración'],
    posponer:['cerrar una decisión con información incompleta'] },
  { id:'Kang', nombre:'Reserva', peso:-8,
    caracter:'Este pulso pide cuidar recursos. Comparar, revisar números y pensarlo un poco más antes de comprometer mucho tiempo o dinero puede ahorrarte ruido después.',
    bueno:['comparar precios','revisar presupuesto','reducir gastos','hacer inventario'],
    posponer:['hacer una compra grande','firmar un acuerdo económico importante','apostar mucho a un lanzamiento'] },
  { id:'Di', nombre:'Exposición', peso:4,
    caracter:'Este pulso mira hacia afuera. Mostrar tu trabajo, hablar frente a otros o darle más alcance a un mensaje suele encontrar buena corriente.',
    bueno:['hablar en público','publicar contenido','hacer una presentación','organizar una transmisión'],
    posponer:['tener una conversación privada en un entorno muy expuesto'] },
  { id:'Fang', nombre:'Continuidad', peso:5,
    caracter:'Este pulso ayuda a seguir construyendo sobre algo que ya existe. Va bien con planes, relaciones y procesos que necesitan continuidad más que un giro brusco.',
    bueno:['planear un viaje largo','fortalecer una relación','documentar un legado','revisar planes de largo plazo'],
    posponer:['hacer una inversión impulsiva','comprar algo costoso por presión'] },
  { id:'Xin', nombre:'Roce', peso:-4,
    caracter:'Este pulso puede volver más visibles las diferencias de criterio. Entrar a una conversación sabiendo qué quieres resolver ayuda a que el roce se quede en lo útil.',
    bueno:['viajar','hacer trabajo individual','preparar argumentos','ordenar una conversación pendiente'],
    posponer:['negociar desde el enojo','abrir una discusión delicada sin preparación'] },
  { id:'Wei6', nombre:'Apoyo', peso:8,
    caracter:'Este pulso se lleva bien con pedir ayuda y coordinarse. Permisos, acuerdos y colaboraciones pueden avanzar mejor cuando dejas que otras personas también pongan de su parte.',
    bueno:['pedir apoyo','solicitar permiso','firmar un acuerdo revisado','coordinar una colaboración'],
    posponer:['hacer todo por cuenta propia cuando necesitas apoyo'] },
  { id:'Ji', nombre:'Recursos', peso:5,
    caracter:'Este pulso baja la mirada a lo práctico: pagos, cobros, inventario y recursos que conviene tener ubicados.',
    bueno:['cobrar comisiones','ordenar pagos','revisar inventario','organizar recursos'],
    posponer:['comprometer recursos que todavía tienen destino incierto'] },
  { id:'Dou', nombre:'Administración', peso:5,
    caracter:'Este pulso se siente cómodo entre números y decisiones concretas. Métricas, presupuestos y procesos pueden verse más claros cuando los pones sobre la mesa.',
    bueno:['revisar métricas','hacer presupuesto','analizar ventas','organizar procesos'],
    posponer:['crear una sociedad con responsabilidades ambiguas'] },
  { id:'Niu', nombre:'Margen', peso:-10,
    caracter:'Este pulso agradece que dejes colchón. Las tareas que permiten corregir sobre la marcha suelen encajar mejor que las que te amarran desde el primer minuto.',
    bueno:['hacer mantenimiento','revisar detalles','resolver pendientes pequeños','preparar un plan B'],
    posponer:['hacer un gran lanzamiento','firmar compromisos importantes','hacer compras grandes'] },
  { id:'Nu', nombre:'Estudio', peso:8,
    caracter:'Este pulso se presta para meter la cabeza en algo y quedarte ahí un rato. Estudiar, investigar, escribir o preparar una estrategia puede rendir especialmente bien.',
    bueno:['estudiar','investigar','escribir','tomar un curso','preparar una estrategia'],
    posponer:['llenar el día de eventos sociales','decidir con prisa'] },
  { id:'Xu', nombre:'Recuperación', peso:-5,
    caracter:'Este pulso baja el ritmo. Descansar, editar, ordenar y recuperar capacidad puede darte más que seguir empujando por pura inercia.',
    bueno:['descansar','editar','ordenar','hacer trabajo administrativo','revisar la agenda'],
    posponer:['programar un día físicamente muy demandante','sumar compromisos grandes'] },
  { id:'Wei12', nombre:'Cuidado', peso:-7,
    caracter:'Este pulso pide cuidado con el ritmo y los detalles. Las tareas pequeñas, claras y fáciles de ajustar suelen sentirse mucho más cómodas.',
    bueno:['hacer revisiones','trabajar con calma','corregir detalles','preparar materiales'],
    posponer:['hacer una actividad de alto riesgo','tomar una decisión irreversible'] },
  { id:'Shi', nombre:'Escala', peso:10,
    caracter:'Este pulso trae ganas de crecer. Si algo ya tiene dirección, puede ser buen momento para darle más alcance, recursos o espacio.',
    bueno:['ampliar un proyecto','hacer una compra planeada','lanzar una campaña','abrir una línea de trabajo'],
    posponer:['expandir un plan que todavía carece de prioridades'] },
  { id:'Bi14', nombre:'Ganancia', peso:11,
    caracter:'Este pulso se mueve bien entre intercambios, cobros y acuerdos. Las conversaciones donde ambas partes saben qué quieren pueden encontrar buena corriente.',
    bueno:['negociar','vender','firmar un acuerdo revisado','hacer una compra útil','cobrar'],
    posponer:['aceptar términos poco claros'] },
  { id:'Kui', nombre:'Prueba', peso:-3,
    caracter:'Este pulso sirve para probar hasta dónde aguanta algo. Un reto pequeño, una prueba o una revisión práctica puede darte información útil antes de apostar más.',
    bueno:['viajar','resolver un problema práctico','hacer una prueba','revisar un proyecto'],
    posponer:['inaugurar algo con piezas pendientes','abrir una negociación tensa'] },
  { id:'Lou', nombre:'Fluidez', peso:11,
    caracter:'Este pulso se siente ligero cuando varias personas tienen que coordinarse. Acuerdos, celebraciones y trabajo en equipo pueden fluir con menos fricción.',
    bueno:['cerrar acuerdos','celebrar','coordinar un equipo','hacer una compra planeada','presentar un proyecto'],
    posponer:['llenar la agenda más allá de tu capacidad'] },
  { id:'Wei17', nombre:'Visibilidad', peso:8,
    caracter:'Este pulso pone reflectores. Presentar resultados, publicar o acercarte a gente nueva puede ayudarte a que tu trabajo gane visibilidad.',
    bueno:['pedir una promoción','presentar resultados','hacer networking','publicar contenido','convocar gente'],
    posponer:['tratar un asunto íntimo frente a demasiadas personas'] },
  { id:'Mao', nombre:'Bajo perfil', peso:-9,
    caracter:'Este pulso prefiere trabajar bajito. Borradores, mantenimiento y pendientes internos pueden rendir más que buscar atención afuera.',
    bueno:['trabajar en borrador','ordenar pendientes','hacer mantenimiento','preparar una reunión'],
    posponer:['hacer un lanzamiento','abrir una conversación laboral delicada','cerrar un acuerdo importante'] },
  { id:'Bi19', nombre:'Cooperación', peso:8,
    caracter:'Este pulso se lleva bien con conversaciones pacientes. Negociar, coordinar y llegar a acuerdos puede ser más fácil cuando todos tienen tiempo de escucharse.',
    bueno:['negociar','coordinar una compra','reconciliar agendas','fortalecer una relación'],
    posponer:['presionar por una respuesta inmediata'] },
  { id:'Zui', nombre:'Revisión', peso:-9,
    caracter:'Este pulso quiere segunda mirada. Corregir, comparar y revisar antes de comprometerte puede revelar detalles que todavía faltaban.',
    bueno:['auditar','corregir un documento','comparar opciones','hacer trabajo interno'],
    posponer:['firmar un acuerdo importante','hacer una compra grande','lanzar un proyecto'] },
  { id:'Shen', nombre:'Actualización', peso:8,
    caracter:'Este pulso trae aire de actualización. Retocar una estrategia, refrescar un proyecto o presentar una versión nueva puede caer especialmente bien.',
    bueno:['actualizar una campaña','refrescar un proyecto','viajar','presentar una nueva versión'],
    posponer:['mantener una estrategia agotada por costumbre'] },
  { id:'Jing', nombre:'Estructura', peso:3,
    caracter:'Este pulso pide poner bases. Diseñar procesos, ordenar un proyecto o armar un prototipo puede dejarte mejor preparado para el siguiente movimiento.',
    bueno:['diseñar un proceso','organizar un proyecto','hacer un prototipo','crear una estructura de trabajo'],
    posponer:['firmar antes de cerrar detalles','celebrar antes de terminar'] },
  { id:'Gui', nombre:'Pausa', peso:-10,
    caracter:'Este pulso viene tranquilo. Ordenar, revisar y hacer tareas pequeñas puede darte el espacio mental que hacía falta para ver algo con más claridad.',
    bueno:['ordenar','descansar','hacer respaldos','revisar un borrador'],
    posponer:['hacer una inauguración','asumir un compromiso grande','hacer un lanzamiento'] },
  { id:'Liu', nombre:'Espera', peso:-7,
    caracter:'Este pulso sabe esperar. Cotizar, comparar y preparar primero puede ayudarte a decidir con más calma cuando llegue el momento de comprometer recursos.',
    bueno:['cotizar','comparar opciones','hacer una lista de pendientes','organizar materiales'],
    posponer:['comprar algo costoso','cerrar un trato grande','iniciar un trabajo nuevo'] },
  { id:'Xing', nombre:'Encuentro', peso:8,
    caracter:'Este pulso abre espacio para encontrarse. Una reunión importante, una propuesta o el inicio de un proyecto personal puede recibir un buen empujón.',
    bueno:['negociar','hacer una reunión importante','iniciar un proyecto personal','presentar una propuesta'],
    posponer:['entrar a una reunión sin objetivos definidos'] },
  { id:'Zhang', nombre:'Avance', peso:12,
    caracter:'Este pulso quiere avance visible. Vender, negociar o cerrar un acuerdo revisado puede sentirse como mover una ficha que llevaba rato esperando.',
    bueno:['vender','firmar un acuerdo revisado','hacer una compra planeada','abrir un proyecto','negociar'],
    posponer:['sumar compromisos que compiten entre sí'] },
  { id:'Yi', nombre:'Cautela', peso:-6,
    caracter:'Este pulso pide llegar preparado. Revisar condiciones, hacer respaldos y cerrar pendientes puede darte piso antes de asumir algo nuevo.',
    bueno:['preparar una presentación','revisar condiciones','hacer respaldos','cerrar pendientes'],
    posponer:['asumir un puesto por impulso','abrir un negocio con detalles pendientes'] },
  { id:'Zhen', nombre:'Aprobación', peso:8,
    caracter:'Este pulso se lleva bien con pedir una respuesta, una oportunidad o un recurso. Solicitudes, propuestas y estudios pueden encontrar mejor recepción cuando llegan bien armados.',
    bueno:['pedir aprobación','presentar una solicitud','empezar a estudiar','hacer una compra planeada','enviar una propuesta'],
    posponer:['viajar con logística incompleta'] },
];

function pulso28(fecha) {
  var jdn = _depR('jdn','./motor');
  var ancla = jdn(2022, 9, 22); // primera posición publicada del ciclo
  var actual = jdn(fecha.anio, fecha.mes, fecha.dia);
  var indice = ((actual - ancla) % 28 + 28) % 28;
  var base = PULSOS_28[indice];
  return Object.assign({ indice: indice + 1 }, base);
}

// ─────────────────────────────────────────────────────────────
// FRICCIONES ENTRE RAMAS
// ─────────────────────────────────────────────────────────────

const friccionAnio     = (ramaAnio, ramaDia) => ramaDia === _depR('choque','./motor')(ramaAnio);
const friccionMes      = (ramaMes,  ramaDia) => ramaDia === _depR('choque','./motor')(ramaMes);
const friccionPersonal = (ramaNat,  ramaDia) => ramaDia === _depR('choque','./motor')(ramaNat);

// El nombre tradicional queda fuera de la interfaz. Se conserva la fórmula
// como una capa adicional de fricción direccional para mantener el cálculo.
const INICIO_SAN_SHA = { 0: 5, 1: 2, 2: 11, 3: 8 };

function sanSha(ramaAnioOMes) {
  const inicio = INICIO_SAN_SHA[ramaAnioOMes % 4];
  return {
    robo:      (inicio + 0) % 12,
    calamidad: (inicio + 1) % 12,
    retraso:   (inicio + 2) % 12,
  };
}

function evaluarSanSha(sh, ramaDia) {
  if (ramaDia === sh.robo)      return { tipo:'recursos', nota:'lleva gastos, traslados y coordinación con un poco más de margen' };
  if (ramaDia === sh.calamidad) return { tipo:'imprevistos', nota:'elige tareas que permitan ajustar y revisa los detalles con calma antes de cerrar' };
  if (ramaDia === sh.retraso)   return { tipo:'ritmo', nota:'deja un poco más de tiempo para respuestas, entregas y coordinación' };
  return null;
}

// ─────────────────────────────────────────────────────────────
// EVALUACIÓN COMPLETA DE UN DÍA
// ─────────────────────────────────────────────────────────────

function evaluarDia(fecha, natal = null) {
  const RM = _depR('RAMAS','./motor');
  const p = _depR('cuatroPilares','./motor')({ ...fecha, hora:12, offsetTZ:0 });
  const ramaAnio = RM.indexOf(p.pilares.anio.rama);
  const ramaMes  = RM.indexOf(p.pilares.mes.rama);
  const ramaDia  = RM.indexOf(p.pilares.dia.rama);

  const shAnio = sanSha(ramaAnio);
  const shMes  = sanSha(ramaMes);
  const avisos = [];

  if (friccionMes(ramaMes, ramaDia))   avisos.push({ nivel:'alto', motivo:'el día y el mes jalan a ritmos distintos', nota:'deja más espacio entre decisiones y compromisos' });
  if (friccionAnio(ramaAnio, ramaDia)) avisos.push({ nivel:'medio', motivo:'el día y el año llevan ritmos distintos', nota:'elige planes que puedan ajustarse sobre la marcha' });
  if (natal && friccionPersonal(natal.ramaAnio, ramaDia))
    avisos.push({ nivel:'alto', motivo:'el día roza con Tu origen', nota:'elige tareas con margen de maniobra y revisa expectativas' });

  const ssA = evaluarSanSha(shAnio, ramaDia);
  const ssM = evaluarSanSha(shMes, ramaDia);
  if (ssM) avisos.push({ nivel:'medio', motivo:'el mes suma un poco de roce · ' + ssM.tipo, nota:ssM.nota });
  else if (ssA) avisos.push({ nivel:'bajo', motivo:'el año suma un poco de roce · ' + ssA.tipo, nota:ssA.nota });

  const ritmo12 = oficialDelDia(ramaMes, ramaDia);
  const ciclo28 = pulso28(fecha);

  let puntaje = 60 + ritmo12.peso + ciclo28.peso;
  for (const a of avisos) puntaje -= a.nivel === 'alto' ? 18 : a.nivel === 'medio' ? 10 : 5;
  puntaje = Math.max(8, Math.min(94, puntaje));

  const recomendadoPara = unicas(ritmo12.bueno, ciclo28.bueno, 6);
  const dejarParaLuego = unicas(ritmo12.posponer, ciclo28.posponer, 6);

  return {
    fecha,
    pilares:p.pilares,
    ritmo12,
    pulso28:ciclo28,
    oficial:ritmo12, // compatibilidad con versiones anteriores
    sanShaAnio:shAnio,
    sanShaMes:shMes,
    avisos,
    puntaje,
    recomendadoPara,
    dejarParaLuego,
    evitarHoy:dejarParaLuego,
  };
}

function vientoDelDia(puntaje) {
  if (puntaje >= 80) return 'El día viene con bastante apoyo para mover algo importante';
  if (puntaje >= 68) return 'Hay buena corriente para avanzar';
  if (puntaje >= 55) return 'El día viene mixto: importa mucho qué quieras hacer';
  if (puntaje >= 35) return 'Hoy conviene moverte con un poco más de margen';
  return 'El ritmo viene tranquilo: preparar, revisar y ordenar puede rendir más';
}

function mejoresDias(desde, hasta, natal = null, limite = 10) {
  const out = [];
  let J = _depR('jdn','./motor')(desde.anio, desde.mes, desde.dia);
  const fin = _depR('jdn','./motor')(hasta.anio, hasta.mes, hasta.dia);
  const desdeJD = _depR('desdeJD','./motor');
  for (; J <= fin; J++) {
    const f = desdeJD(J + 0.5);
    out.push(evaluarDia({ anio:f.anio, mes:f.mes, dia:f.dia }, natal));
  }
  return out.sort((a,b) => b.puntaje - a.puntaje).slice(0, limite);
}

(function (raiz) {
  var api = { OFICIALES, PULSOS_28, oficialDelDia, pulso28, vientoDelDia,
    friccionAnio, friccionMes, friccionPersonal, sanSha, evaluarSanSha,
    evaluarDia, mejoresDias };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else for (var k in api) raiz[k] = api[k];
})(typeof globalThis !== 'undefined' ? globalThis : this);
