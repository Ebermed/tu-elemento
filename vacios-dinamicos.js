/**
 * TU ELEMENTO — Vacíos dinámicos V10.2
 * ------------------------------------------------------------------
 * Enriquece la lectura existente cruzando dos capas del cálculo:
 *   1) el pilar donde cae el vacío;
 *   2) el elemento del tallo celestial de ese pilar.
 * La nomenclatura visible y la redacción son propias de Tu Elemento.
 */
(function (raiz) {
  'use strict';

  var original = raiz.lecturaCompleta;
  if (typeof original !== 'function') return;

  var POR_PILAR = {
    anio: {
      titulo:'Vacío en Tu origen',
      texto:'Este vacío cae en Tu origen: pertenencia, familia extensa, círculo social y la forma en que encuentras lugar dentro de un entorno. Esta zona suele construirse mucho a través de experiencia propia.'
    },
    mes: {
      titulo:'Vacío en Tu trayectoria',
      texto:'Este vacío cae en Tu trayectoria: estudios, trabajo, carrera, logros, responsabilidades y la manera en que aprendiste a abrirte camino. Aquí el criterio profesional suele crecer a través de prueba, ajuste y experiencia.'
    },
    hora: {
      titulo:'Vacío en Tu futuro',
      texto:'Este vacío cae en Tu futuro: proyectos, hijos, vida interior, recursos de largo plazo y legado. Esta zona toma forma a medida que eliges qué quieres sostener, desarrollar y dejar creciendo con el tiempo.'
    }
  };

  var POR_ELEMENTO = {
    madera: {
      texto:'Al aparecer con Madera, el aprendizaje se concentra en crecimiento y autosuficiencia. Esta parte de tu vida pide desarrollar soporte propio, seguir aprendiendo y permitir que el crecimiento nazca también de decisiones tuyas.',
      pregunta:'Pregunta para esta zona: ¿qué parte de tu crecimiento depende hoy de una decisión propia?'
    },
    fuego: {
      texto:'Con Fuego, el tema central es la claridad. Esta zona gana fuerza cuando puedes ver lo que ocurre, elegir dirección y convertir lo aprendido en una luz útil para ti y para otras personas.',
      pregunta:'Pregunta para esta zona: ¿qué necesitas ver con más claridad antes de elegir rumbo?'
    },
    tierra: {
      texto:'Con Tierra, el aprendizaje pasa por arraigo, pertenencia y capacidad de soltar. La estabilidad se vuelve más firme cuando distingues qué merece quedarse contigo y qué ya cumplió su etapa.',
      pregunta:'Pregunta para esta zona: ¿qué puedes soltar para recuperar espacio y dirección?'
    },
    metal: {
      texto:'Con Metal, el foco está en voz, comunicación, criterio, lealtad y justicia. Esta zona crece cuando expresas lo que sabes con palabras claras y conviertes tu criterio en algo que también pueda servir afuera.',
      pregunta:'Pregunta para esta zona: ¿qué sabes que ya merece decirse con claridad?'
    },
    agua: {
      texto:'Con Agua, el aprendizaje se concentra en claridad mental, decisiones y capacidad de concretarlas. Pensar, elegir y después convertir esa elección en movimiento ayuda a que esta zona encuentre cauce.',
      pregunta:'Pregunta para esta zona: ¿qué decisión ya está lista para convertirse en un paso concreto?'
    }
  };

  function mayusInicial(s) {
    s = String(s || '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function vaciosDeCarta(carta, sinHora) {
    var RM = raiz.RAMAS || [];
    var claves = sinHora ? ['anio','mes'] : ['anio','mes','hora'];
    var out = [];

    claves.forEach(function (k) {
      var p = carta && carta.pilares && carta.pilares[k];
      var base = POR_PILAR[k];
      if (!p || !base) return;
      var rama = RM.indexOf(p.rama);
      if (!carta.vacio || carta.vacio.ramas.indexOf(rama) === -1) return;

      var elemento = p.tallo.elemento;
      var matiz = POR_ELEMENTO[elemento] || { texto:'', pregunta:'' };
      out.push({
        pilar:k,
        titulo:base.titulo,
        texto:base.texto + ' ' + matiz.texto,
        filo:matiz.pregunta,
        rama:p.rama.animal,
        elemento:elemento,
        elementoEtiqueta:mayusInicial(elemento)
      });
    });
    return out;
  }

  raiz.lecturaCompleta = function (carta, sinHora) {
    var lec = original(carta, sinHora);
    if (!lec) return lec;

    (lec.pilares || []).forEach(function (p) {
      if (p.clave === 'dia') {
        p.titulo = 'Tu centro';
        p.intro = 'Tu centro reúne la parte más personal de la carta. Aquí aparece el tallo que define tu elemento base, junto con una capa ligada a pareja, intimidad y vida emocional.';
      }
    });

    (lec.tensiones || []).forEach(function (x) {
      if (x.texto) {
        x.texto = x.texto
          .replace(/Tu origen y tú/g, 'Tu origen y tu centro')
          .replace(/Tu trayectoria y tú/g, 'Tu trayectoria y tu centro')
          .replace(/Tú y tu futuro/g, 'Tu centro y tu futuro');
      }
    });

    lec.vacios = vaciosDeCarta(carta, !!sinHora);
    (lec.pilares || []).forEach(function (p) {
      p.vacio = lec.vacios.some(function (v) { return v.pilar === p.clave; });
    });
    return lec;
  };

})(typeof globalThis !== 'undefined' ? globalThis : this);
