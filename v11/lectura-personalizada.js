(function(raiz){
'use strict';
var original=raiz.lecturaCompleta;
if(typeof original!=='function')return;
var ZONA={
anio:{nombre:'Tu origen',cuerpo:'Este vacío aparece en Tu origen, la parte de tu carta relacionada con familia, pertenencia, amistades tempranas y el lugar que ocupas dentro de un grupo. Puede sentirse como tardar un poco más en descubrir qué costumbres, personas o ambientes realmente sientes tuyos.'},
mes:{nombre:'Tu trayectoria',cuerpo:'Este vacío aparece en Tu trayectoria, la parte relacionada con estudios, trabajo, responsabilidades y logros. Puede sentirse como tener que construir tu propio criterio profesional a base de probar, ajustar y encontrar una manera de avanzar que sí te haga sentido.'},
hora:{nombre:'Tu futuro',cuerpo:'Este vacío aparece en Tu futuro, la parte relacionada con proyectos, hijos, vida interior y lo que quieres dejar construido con el tiempo. Puede sentirse como ir definiendo esa zona más adelante, a medida que descubres qué proyectos merecen de verdad tu energía.'}
};
var ELEMENTO={
madera:{cuerpo:'Como aquí aparece Madera, el aprendizaje está en crecer con soporte propio: aprender, desarrollar recursos y tomar decisiones que también nazcan de ti.',accion:'Trabájalo así: elige una habilidad o proyecto cuyo siguiente paso dependa principalmente de ti.'},
fuego:{cuerpo:'Como aquí aparece Fuego, el aprendizaje está en ganar claridad: reconocer qué quieres, hacerlo visible y confiar más en tu propia lectura de la situación.',accion:'Trabájalo así: ponle nombre a lo que quieres antes de buscar aprobación afuera.'},
tierra:{cuerpo:'Como aquí aparece Tierra, el aprendizaje está en construir estabilidad y también en saber soltar. Tener raíces firmes pesa menos cuando distingues qué merece quedarse contigo y qué ya cumplió su etapa.',accion:'Trabájalo así: identifica una carga que ya puedes dejar y un punto de apoyo que sí quieres conservar.'},
metal:{cuerpo:'Como aquí aparece Metal, el aprendizaje está en poner en palabras tu criterio: decir lo que piensas, marcar límites y convertir lo que sabes en una posición clara.',accion:'Trabájalo así: expresa una decisión importante de forma simple y concreta.'},
agua:{cuerpo:'Como aquí aparece Agua, el aprendizaje está en ordenar ideas, decidir y llevar esa decisión a algo concreto. Pensar sirve más cuando termina encontrando un cauce.',accion:'Trabájalo así: convierte una decisión pendiente en un siguiente paso con fecha.'}
};
raiz.lecturaCompleta=function(carta,sinHora){
var lec=original(carta,sinHora);if(!lec)return lec;
(lec.pilares||[]).forEach(function(p){if(p.clave==='dia'){p.titulo='Tu centro';p.etapa='tu centro y tus vínculos cercanos';p.intro='Tu centro reúne la parte más personal de la carta. Aquí aparece el tallo que define tu elemento base, junto con una capa ligada a pareja, intimidad y vida emocional.';}});
(lec.tensiones||[]).forEach(function(x){if(x.texto)x.texto=x.texto.replace(/Tu origen y tú/g,'Tu origen y tu centro').replace(/Tu trayectoria y tú/g,'Tu trayectoria y tu centro').replace(/Tú y tu futuro/g,'Tu centro y tu futuro');});
lec.vacios=(lec.vacios||[]).map(function(v){var zona=ZONA[v.pilar]||{nombre:v.titulo,cuerpo:v.texto};var pilar=carta&&carta.pilares?carta.pilares[v.pilar]:null;var elemento=pilar&&pilar.tallo?pilar.tallo.elemento:'';var matiz=ELEMENTO[elemento]||{cuerpo:'',accion:v.filo||''};var etiqueta=elemento?elemento.charAt(0).toUpperCase()+elemento.slice(1):'';return{pilar:v.pilar,titulo:(etiqueta?'Vacío de '+etiqueta+' en ':'Vacío en ')+zona.nombre,texto:zona.cuerpo+(matiz.cuerpo?' '+matiz.cuerpo:''),filo:matiz.accion,rama:v.rama,elemento:elemento,elementoEtiqueta:etiqueta};});
return lec;
};
})(typeof globalThis!=='undefined'?globalThis:this);
