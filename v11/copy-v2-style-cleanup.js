/* TU ELEMENTO — barrida editorial anti-antítesis
   Reemplaza construcciones tipo “No es X. Es Y” en el preview sin tocar producción. */
(function(root){
'use strict';

var REEMPLAZOS=[
  ['Cuando decides algo, lo decidiste — y a la gente le queda clarísimo. Te cuesta pedir ayuda, no por orgullo, sino porque genuinamente se te ocurre primero cómo resolverlo por tu cuenta. Por fuera aguantas todo; pero por dentro las cosas te afectan más de lo que dejas ver.',
   'Cuando decides algo, lo decidiste — y a la gente le queda clarísimo. Pedir ayuda casi nunca es tu primer movimiento; normalmente ya se te ocurrió cómo resolverlo por tu cuenta. Por fuera aguantas todo, aunque por dentro las cosas te pegan más de lo que dejas ver.'],
  ['No eres la fogata. Eres la vela que aguantó toda la noche.',
   'Eres la vela que aguantó toda la noche.'],
  ['Todo mundo te cuenta todo. Tú no cuentas casi nada — no porque no confíes, sino porque no te nace. Terminas cargando broncas que ni siquiera eran tuyas, y no se te ocurre que las puedes soltar.',
   'Todo mundo te cuenta todo. Tú cuentas poquísimo; guardarte lo tuyo te sale natural. Terminas cargando broncas que ni siquiera eran tuyas, y soltar esa carga rara vez se te ocurre a tiempo.'],
  ['Lo que se te da bien se te da casi sin pensarlo, y por eso a veces no notas que a los demás sí les cuesta. Lo tuyo no es aprovecharlo — eso ya pasa solo. Lo tuyo es saber cuándo bajarle.',
   'Lo que se te da bien sale casi sin pensarlo, y por eso a veces no notas que a los demás sí les cuesta. Ya traes esa ventaja encendida. El trabajo está en saber cuándo bajarle.'],
  ['No te sale igual en cualquier contexto, y seguro ya lo notaste: hay lugares y hay personas con las que eres otra versión de ti. Eso no es debilidad. Es que sí importa dónde te paras.',
   'Tu versión cambia muchísimo según el contexto. Hay lugares y personas que te sacan recursos que en otros espacios casi no aparecen. Esa diferencia te dice dónde encuentras apoyo y dónde tienes que poner más de tu parte.'],
  ['Tu energía no es infinita y funcionas distinto según quién tengas enfrente. Cuando estás en un lugar que te sostiene, se nota muchísimo la diferencia — y esa diferencia es justo la información que te sirve.',
   'Tu energía rinde distinto según quién y qué tengas enfrente. Cuando estás en un lugar que te sostiene, la diferencia se nota muchísimo — y ahí tienes una pista bastante clara sobre lo que te conviene cuidar.'],
  ['No es que te falte con qué. Es que gastas de más en la forma de usarlo. Esta es la que más cambia según tu cabeza: el mismo día te puede salir muy bien o muy mal dependiendo de con qué actitud entraste.',
   'Capacidad tienes de sobra; el desgaste viene de cómo la estás usando. Esta configuración cambia muchísimo con tu manera de entrarle a las cosas: el mismo día puede salir muy bien o muy mal según la actitud con la que llegaste.'],
  ['Traes cinco ingredientes: Madera, Fuego, Tierra, Metal y Agua. No es que uno sea bueno y otro malo — son cinco maneras distintas de resolver la vida. Casi nadie los tiene parejos: casi todos traemos dos o tres de sobra y uno o dos de menos.',
   'Traes cinco ingredientes: Madera, Fuego, Tierra, Metal y Agua. Cada uno resuelve una parte distinta de la vida. Casi nadie los tiene parejos: casi todos traemos dos o tres de sobra y uno o dos de menos.'],
  ['Esto lo usas poco. No es que no puedas: es que te cuesta arrancar y necesitas más intención para que salga. Nadie te lo va a dar — se aprende.',
   'Esto lo usas poco. Te cuesta más arrancarlo y necesitas intención para que aparezca. Se puede desarrollar, pero toca practicarlo.'],
  ['Balancear no es tener 20% de cada cosa. Es dejar de pedirle a un solo ingrediente que te resuelva todo.',
   'Balancear significa dejar de pedirle a un solo ingrediente que te resuelva todo. Los porcentajes pueden seguir disparejos; lo importante es tener más de una respuesta disponible.'],
  ['Balancear no es tener 20% de cada cosa: es dejar de pedirle a un solo ingrediente que te resuelva todo.',
   'Balancear significa dejar de pedirle a un solo ingrediente que te resuelva todo. Los porcentajes pueden seguir disparejos; lo importante es tener más de una respuesta disponible.'],
  ['Tú decides. Consultar es opcional y normalmente decides que no. No es que no valores a la gente: es que ya lo pensaste y lo que sigue es hacerlo.',
   'Tú decides. Consultar es opcional y normalmente decides que no. Sueles llegar a la conversación con la decisión bastante cocinada; para ti, lo que sigue es hacerla.'],
  ['Ves cómo debería ser y no te aguantas las ganas de decirlo. Lo que dices no es decorativo: quiere cambiar algo.',
   'Ves cómo debería ser y no te aguantas las ganas de decirlo. Lo que dices busca mover algo, corregirlo o sacudirlo.'],
  ['Si tuvieras que desarrollar una sola cosa, sería esta. No es un talento que ya traigas: es una forma de actuar que te compensa lo que te falta y te destraba lo que traes atorado. Cuando ya no sabes por dónde, este es el default al que conviene volver.',
   'Si tuvieras que desarrollar una sola cosa, sería esta. Puede que todavía no te salga por reflejo; justamente por eso compensa lo que te falta y destraba lo que traes atorado. Cuando ya no sabes por dónde, conviene volver aquí.'],
  ['Tu trabajo y tu vida personal compiten por la misma energía. No es falta de organización: literalmente salen del mismo tanque, y el que se lleve más se lo quita al otro.',
   'Tu trabajo y tu vida personal compiten por la misma energía. Los dos salen del mismo tanque: cuando uno se lleva más, el otro lo resiente.'],
  ['Lo que llevas meses aguantando se vuelve visible justo ahora. No es mala suerte: es que ya se acumuló lo suficiente para notarse. Este mes rinde muchísimo más atender la señal chiquita que empujar por inercia — porque la señal chiquita, si la ignoras, no se queda chiquita.',
   'Lo que llevas meses aguantando se vuelve visible justo ahora porque ya se acumuló lo suficiente para notarse. Este mes rinde muchísimo más atender la señal chiquita que empujar por inercia — porque la señal chiquita, si la ignoras, crece.'],
  ['Sí, son animales. No, no significa que te parezcas al animal — eso es una simplificación que se popularizó en los manteles.',
   'Aquí los animales funcionan como nombres fáciles de recordar para doce energías.'],
  ['Sí, son animales. No, no significa que te parezcas al animal',
   'Aquí los animales funcionan como nombres fáciles de recordar para doce energías.'],
  ['Son nombres para doce energías, y aquí no describen cómo eres tú: describen cómo se siente la etapa que estás viviendo. Cada una dura unos diez años.',
   'Cada animal etiqueta una etapa de unos diez años. La lectura que sigue habla de cómo se siente ese periodo mientras lo estás viviendo.'],
  ['Los cuatro no son etapas de tu vida. Son cuatro zonas que traes activas al mismo tiempo.',
   'Tus cuatro pilares son cuatro zonas que traes activas al mismo tiempo.'],
  ['Los cuatro no son etapas de tu vida. Son cuatro zonas que traes activas al mismo tiempo. Ahora la lectura cruza lo que muestras, lo que empuja por debajo, las capas ocultas y la posición exacta donde aparecen.',
   'Tus cuatro pilares son cuatro zonas que traes activas al mismo tiempo. La lectura cruza lo que muestras, lo que empuja por debajo, las capas ocultas y la posición exacta donde aparecen.'],
  ['La dificultad aquí no es entenderlo: es acordarte de usarlo justo cuando vuelves a tu respuesta automática.',
   'Entenderlo suele ser fácil; acordarte de usarlo cuando vuelves a tu respuesta automática es la parte difícil.'],
  ['Forma, tono, acabado y coherencia no son adornos para ti: son parte del resultado.',
   'Forma, tono, acabado y coherencia forman parte del resultado para ti.'],
  ['Tener más de un elemento significa que esa forma de responder está disponible con mucha facilidad; también puede aparecer incluso cuando otra respuesta sería más útil. Tener menos significa que esa función suele necesitar más intención, práctica o un contexto favorable para salir. El objetivo no es repartir todo igual, sino aprender cuándo conviene usar cada parte.',
   'Tener más de un elemento significa que esa forma de responder está disponible con mucha facilidad; también puede aparecer incluso cuando otra respuesta sería más útil. Tener menos señala una función que necesita más intención, práctica o un contexto favorable para salir. El objetivo es aprender cuándo conviene usar cada parte, aunque los porcentajes nunca queden parejos.'],
  ['Tener más no significa “mejor” y tener menos no significa “peor”: habla de qué recursos tienes más automatizados y cuáles necesitas activar de forma consciente.',
   'Tener más habla de recursos que salen casi en automático. Tener menos señala recursos que necesitan más intención y práctica para aparecer.'],
  ['Balancear tu carta no significa convertirla en 20% de cada cosa. Significa ampliar tus opciones para que el elemento que más usas no tenga que resolverlo todo.',
   'Balancear tu carta significa ampliar tus opciones para que el elemento que más usas no tenga que resolverlo todo. El reparto perfecto de 20% por elemento da igual.']
];

if(typeof module!=='undefined'&&module.exports)module.exports=REEMPLAZOS;
if(typeof document==='undefined')return;

function limpiarNodo(base){
  if(!base)return;
  if(base.nodeType===3){
    var t=base.nodeValue,n=t;
    REEMPLAZOS.forEach(function(r){if(n.indexOf(r[0])!==-1)n=n.split(r[0]).join(r[1]);});
    if(n!==t)base.nodeValue=n;
    return;
  }
  var walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);
  var node;
  while((node=walker.nextNode())){
    var original=node.nodeValue,limpio=original;
    REEMPLAZOS.forEach(function(r){if(limpio.indexOf(r[0])!==-1)limpio=limpio.split(r[0]).join(r[1]);});
    if(limpio!==original)node.nodeValue=limpio;
  }
}
function limpiarEspeciales(){
  var ciclos=document.querySelector('.copyV2CiclosEncuadre');
  if(ciclos)ciclos.innerHTML='<p><strong>Aquí los animales funcionan como nombres fáciles de recordar para doce energías.</strong></p><p>Cada animal etiqueta una etapa de unos diez años. La lectura que sigue habla de cómo se siente ese periodo mientras lo estás viviendo.</p>';
  var pilares=document.querySelector('.copyV2PilaresEncuadre');
  if(pilares)pilares.innerHTML='<strong>Tus cuatro pilares son cuatro zonas que traes activas al mismo tiempo.</strong> La lectura cruza lo que muestras, lo que empuja por debajo, las capas ocultas y la posición exacta donde aparecen.';
}
function iniciar(){
  limpiarNodo(document.body);limpiarEspeciales();
  if(typeof MutationObserver!=='undefined')new MutationObserver(function(ms){ms.forEach(function(m){Array.prototype.forEach.call(m.addedNodes,limpiarNodo);});limpiarEspeciales();}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='complete')iniciar();else root.addEventListener('load',iniciar,{once:true});
})(typeof globalThis!=='undefined'?globalThis:this);
