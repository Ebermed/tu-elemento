/* TU ELEMENTO — COPY V2 PREVIEW
   Capa editorial de prueba basada en Tu_Elemento_Copys_v2.md.
   Solo vive en la rama copy-v2-preview. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute('data-copy-v2-preview','1');

  var HERO={
    'madera yang':{t:'Eres alguien que no se dobla.',p:'Cuando decides algo, lo decidiste — y a la gente le queda clarísimo. Te cuesta pedir ayuda, no por orgullo, sino porque genuinamente se te ocurre primero cómo resolverlo por tu cuenta. Por fuera aguantas todo; pero por dentro las cosas te afectan más de lo que dejas ver.'},
    'madera yin':{t:'Siempre encuentras por dónde.',p:'Te acomodas a casi cualquier cosa y la gente confunde eso con que te da igual. No te da igual: sabes que hay diez formas de llegar y estás escogiendo la que menos cuesta. Tu humor funciona como armadura, y funciona tan bien que casi nadie te pregunta cómo estás de verdad.'},
    'fuego yang':{t:'Entras a un lugar y el lugar cambia de temperatura.',p:'No lo haces a propósito y a veces ni te enteras. Le das energía a todo mundo y luego llegas a tu casa sin batería. Con la gente eres flexible; con tus planes no tanto — el plan A es el plan A.'},
    'fuego yin':{t:'No eres la fogata. Eres la vela que aguantó toda la noche.',p:'Necesitas un empujón para arrancar, pero cuando arrancas duras más que nadie. Y sí: te importa muchísimo que alguien note que estuviste ahí, aunque jamás se lo pedirías.'},
    'tierra yang':{t:'Eres a quien le escriben a las 2 de la mañana.',p:'Todo mundo te cuenta todo. Tú no cuentas casi nada — no porque no confíes, sino porque no te nace. Terminas cargando broncas que ni siquiera eran tuyas, y no se te ocurre que las puedes soltar.'},
    'tierra yin':{t:'Contigo las cosas crecen.',p:'Te acuerdas de lo que le gusta a cada quien. Das lo que hace falta antes de que te lo pidan. Y por dentro tienes una opinión muy firme sobre cómo deberían hacerse las cosas, que casi nunca dices en voz alta.'},
    'metal yang':{t:'Cortas. A veces antes de tiempo, casi nunca sin razón.',p:'Dices la verdad aunque incomode y después no entiendes por qué la gente se ofendió — para ti nada más era información. Eres leal hasta que alguien cruza una línea; cuando la cruza, se acabó, y no hay regreso.'},
    'metal yin':{t:'Ves la costura que nadie más vio.',p:'El margen chueco, el tono que no combina, la frase que sobraba. Te importa cómo se ve — y tienes razón, sí importa. También te importa lo que piensan de ti, aunque digas que no.'},
    'agua yang':{t:'Conoces a alguien en todos lados.',p:'Te aburres rápido, te mueves rápido y conectas gente que jamás se habría conocido sin ti. También abres quince pestañas y cierras tres. Lo que te falta rara vez son ideas.'},
    'agua yin':{t:'Sientes el ambiente antes de que pase algo.',p:'Entras a un cuarto y sabes quién está enojado sin que nadie diga nada. La gente no siempre sabe qué estás pensando — a veces ni tú. Tu forma de resolver casi nunca es la línea recta.'}
  };

  var ESTADOS={
    prospero:{t:'Naciste con el viento a favor.',p:'Lo que se te da bien se te da casi sin pensarlo, y por eso a veces no notas que a los demás sí les cuesta. Lo tuyo no es aprovecharlo — eso ya pasa solo. Lo tuyo es saber cuándo bajarle.'},
    fuerte:{t:'Traes buena base.',p:'Tus cualidades salen sin que tengas que empujarlas mucho. La parte que sí te toca trabajar es no confundir “me sale fácil” con “tengo la razón”.'},
    debil:{t:'Lo tuyo está ahí, pero necesita condiciones.',p:'No te sale igual en cualquier contexto, y seguro ya lo notaste: hay lugares y hay personas con las que eres otra versión de ti. Eso no es debilidad. Es que sí importa dónde te paras.'},
    muerto:{t:'Te toca escoger mejor dónde gastas.',p:'Tu energía no es infinita y funcionas distinto según quién tengas enfrente. Cuando estás en un lugar que te sostiene, se nota muchísimo la diferencia — y esa diferencia es justo la información que te sirve.'},
    trampa:{t:'Tienes capacidad de sobra y aun así acabas agotado.',p:'No es que te falte con qué. Es que gastas de más en la forma de usarlo. Esta es la que más cambia según tu cabeza: el mismo día te puede salir muy bien o muy mal dependiendo de con qué actitud entraste.'}
  };

  var ELEMENTOS={
    madera:{da:'Empezar, crecer, ir hacia algún lado.',mas:'Empiezas cinco cosas y todas te importan. Ninguna avanza.',menos:'Sabes lo que quieres, pero el primer paso se te hace enorme.',probar:['Escoge una cosa. Una. Las otras siguen ahí la semana que entra.','Convierte una idea en un primer paso con fecha.','Revisa cuál de tus proyectos ya creció suficiente y necesita otra etapa.']},
    fuego:{da:'Mostrarte, entusiasmar, que se sienta que estás.',mas:'Andas encendido todo el tiempo y te vacías. Necesitas respuesta para saber que valió la pena.',menos:'Haces cosas buenas de las que nadie se entera.',probar:['Muestra una versión que ya se entienda, antes de pulirla de más.','Aparta ratos donde nadie te pida respuesta ni presencia.','Celebra los avances concretos, para que el impulso tenga cierre.']},
    tierra:{da:'Sostener, dar continuidad, ser el piso.',mas:'Sostienes cosas que ya se acabaron, nada más porque ya las sostenías.',menos:'Se te cae lo que empiezas — no por flojera, por falta de rutina.',probar:['Pon una rutina chiquita al servicio de algo que sí importa.','Separa estabilidad de costumbre: conserva lo que funciona y mueve lo demás.','Termina una tarea antes de convertirla en un sistema entero.']},
    metal:{da:'Decidir, cortar, poner el punto final.',mas:'Decides antes de tener todos los datos, y luego no te retractas.',menos:'Todo sigue abierto. Ninguna conversación se cierra del todo.',probar:['Define dos o tres criterios antes de decidir.','Cierra ese pendiente que sigue ocupándote espacio mental.','Pide una segunda opinión cuando una decisión te parezca demasiado obvia.']},
    agua:{da:'Conectar información, encontrar rutas, cambiar de plan.',mas:'Ves tantas opciones que ninguna se ve claramente mejor.',menos:'Te clavas en un solo camino aunque ya no esté funcionando.',probar:['Ponle hora límite a la investigación antes de decidir.','Escoge una pregunta concreta en lugar de pensar todos los escenarios.','Deja reposar una decisión y vuelve a ella con un criterio escrito.']}
  };

  var FORMAS={
    Espejo:{label:'Decides por tu cuenta',area:'Vínculos',resumen:'Tú decides. Consultar es opcional y normalmente decides que no. No es que no valores a la gente: es que ya lo pensaste y lo que sigue es hacerlo.',nota:'Te llevas con gente que se parece a ti. Te incomoda deber favores. En un grupo, tu primer reflejo es asegurarte de que no te estás disolviendo.',costo:'Pides ayuda tarde. No cuando la necesitas — cuando ya no hay de otra.',prueba:'Cuéntale una decisión a alguien antes de cerrarla. Fíjate si mejora sin dejar de ser tuya.'},
    Contrapunto:{label:'Te defines contra',area:'Vínculos',resumen:'Sabes lo que quieres cuando ves lo que quiere el otro. El contraste te aclara, y con alguien enfrente te vuelves preciso.',nota:'Comparas, negocias, mides el espacio que ocupas y el que ocupan los demás, aunque nadie más lo esté midiendo.',costo:'Tu rumbo termina dependiendo de quién te tocó enfrente. Ganas discusiones que ni querías tener.',prueba:'Antes de compararte, escribe qué querías tú cuando todavía no había nadie más en la ecuación.'},
    Flujo:{label:'Lo que traes adentro sale',area:'Expresión',resumen:'Ideas, cosas, explicaciones, clases, productos. No se te queda nada guardado.',nota:'Haces, enseñas, produces. Cuando algo te prende, ya empezaste antes de decidir que ibas a empezar.',costo:'Produces tan fácil que abres más frentes de los que puedes cerrar. Tienes carpetas llenas de cosas al 80%.',prueba:'Termina una antes de darle toda tu atención a la siguiente idea. La siguiente puede esperar — siempre hay siguiente.'},
    Impacto:{label:'Mueves el avispero',area:'Expresión',resumen:'Ves cómo debería ser y no te aguantas las ganas de decirlo. Lo que dices no es decorativo: quiere cambiar algo.',nota:'Detectas lo que está mal hecho antes que nadie. Provocas reacción, a veces sin proponértelo.',costo:'Dices lo necesario con tanta intensidad que la mejora se convierte en pleito, y luego el pleito se come la mejora.',prueba:'Separa el cambio que quieres lograr de la reacción que quieres provocar. No siempre son lo mismo.'},
    Oportunidad:{label:'Ves puertas',area:'Recursos',resumen:'Detectas movimiento antes que los demás. Intercambios, contactos, chances. Tu ventaja es el olfato.',nota:'Siempre traes algo en el radar. Varias opciones a la vez, y la verdad las disfrutas.',costo:'Una puerta nueva se ve mejor que la actual nada más porque todavía no te ha enseñado su costo.',prueba:'Ponle fecha, precio y siguiente paso a una oportunidad antes de llamarla oportunidad. Si no aguanta esas tres, era una idea.'},
    Concreción:{label:'Necesitas que se pueda tocar',area:'Recursos',resumen:'Necesitas que el esfuerzo se convierta en algo real. Números, resultados, cosas terminadas.',nota:'Ordenas recursos, mides, construyes despacio — pero lo que construyes se queda.',costo:'Aseguras cada variable, y para cuando ya estás listo el momento se movió.',prueba:'Define qué significa “ya está suficientemente resuelto” antes de seguirle optimizando.'},
    Desafío:{label:'Te enciendes bajo presión',area:'Estructura',resumen:'Cuando las cosas se ponen feas, tú te pones bueno. Se te aclara la cabeza justo cuando los demás la pierden.',nota:'Urgencias, competencia, problemas concretos. Ahí decides rápido y decides bien.',costo:'Te acostumbras al modo emergencia y dejas de distinguir una crisis real de un martes.',prueba:'Haz una parte importante antes de que se vuelva urgente. Compara cómo se siente decidir sin adrenalina.'},
    Estructura:{label:'Necesitas saber qué te toca',area:'Estructura',resumen:'Con roles claros y reglas claras te mueves tranquilo; en el desorden gastas el doble.',nota:'Cumples, llegas, sostienes acuerdos incluso cuando nadie está revisando.',costo:'Sigues cumpliendo reglas que ya dejaron de servirte, nada más porque son las reglas.',prueba:'Escoge una responsabilidad que traigas hoy y define qué resultado concreto debería producir. Si ya no lo produce, toca renegociarla — no aguantarla.'},
    Intuición:{label:'Llegas por otro lado',area:'Perspectiva',resumen:'Aprendes en zigzag. Conectas cosas que no venían juntas y llegas a la respuesta por una ruta que nadie pidió.',nota:'Corazonadas que salen bien, soluciones raras que sí funcionan, interés por temas que no le importan a nadie más.',costo:'Encuentras conexiones en todo, y entonces te cuesta saber cuál de todas merecía convertirse en decisión.',prueba:'Después de una corazonada, busca un dato chiquito que la confirme o la tumbe. Uno basta.'},
    Aprendizaje:{label:'Necesitas entender primero',area:'Perspectiva',resumen:'El conocimiento te da piso. Cuando entiendes cómo funciona algo te sueltas; hasta entonces, no.',nota:'Estudias antes de moverte, buscas referencias, le preguntas a quien sabe.',costo:'Prepararte es la forma más elegante de posponer. En algún momento el curso se vuelve la excusa.',prueba:'Convierte lo último que aprendiste en una acción que puedas ver esta semana. Chiquita, pero visible.'}
  };

  var PILARES={
    'Tu origen':'El mundo que te tocó antes de poder opinar. La familia grande, los amigos de la infancia, el ambiente donde aprendiste cómo se trata la gente entre sí. Mucho de lo que crees que es “normal” se decidió aquí.',
    'Tu trayectoria':'Cómo aprendiste a funcionar fuera de tu casa. Escuela, trabajo, responsabilidades, la relación con quien te formó. Es la zona que más se puede mover a propósito, y por eso es la que más rinde trabajar.',
    'Tú':'Aquí estás tú. Cómo piensas, cómo sientes y a quién eliges tener cerca. De este pilar sale tu elemento.',
    'Tu centro':'Aquí estás tú. Cómo piensas, cómo sientes y a quién eliges tener cerca. De este pilar sale tu elemento.',
    'Tu futuro':'Lo que estás construyendo con el tiempo. Proyectos, hijos, lo que te importa en privado, lo que quieres dejar creciendo cuando ya no estés viéndolo.',
    'Tu brújula':'Si tuvieras que desarrollar una sola cosa, sería esta. No es un talento que ya traigas: es una forma de actuar que te compensa lo que te falta y te destraba lo que traes atorado. Cuando ya no sabes por dónde, este es el default al que conviene volver.',
    'Tu punto de partida':'Cómo eras antes de que la vida te enseñara a comportarte. Sigue ahí abajo: sale cuando estás agotado, cuando confías mucho, o cuando algo te agarra desprevenido.'
  };

  var CHOQUES={
    'anio-mes':'Aprendiste un idioma en tu casa y otro allá afuera. Lo que en tu familia era obvio, en la escuela o en el trabajo no lo era — y te tocó traducir. Lo más probable es que sigas traduciendo.',
    'anio-dia':'Traes cosas puestas que nunca escogiste: opiniones, miedos, maneras de reaccionar que llegaron con el paquete familiar. Separar cuáles conservas de cuáles nada más heredaste es trabajo tuyo, y toma años.',
    'anio-hora':'Lo que quieres construir no se parece a de dónde vienes. Y hay un costo en eso que casi nadie nombra: avanzar puede sentirse como estar traicionando algo.',
    'mes-dia':'Tu trabajo y tu vida personal compiten por la misma energía. No es falta de organización: literalmente salen del mismo tanque, y el que se lleve más se lo quita al otro.',
    'mes-hora':'Lo que haces hoy no siempre alimenta lo que dijiste que querías. Vale la pena revisar cuánto de tu semana va de verdad para allá y cuánto nada más mantiene la máquina andando.',
    'dia-hora':'Tus proyectos y tú piden turnos distintos. Cuando el proyecto va rápido, tú te quedas atrás; cuando tú te cuidas, el proyecto se enfría. Encontrar el reparto es el trabajo.'
  };
  var ENLACES={
    'anio-mes':'Lo que aprendiste de chico te sirvió. En serio. Cosas que en su momento te parecían normales o hasta molestas resultaron ser herramientas cuando saliste al mundo.',
    'anio-dia':'Hay bastante continuidad entre de dónde vienes y quién eres hoy. No tuviste que romper con todo para armarte: buena parte de lo que recibiste te acomodó tal cual.',
    'anio-hora':'Algo de lo que heredaste encuentra salida en lo que quieres construir. Lo que en tu familia se hacía de una manera, tú lo estás haciendo de otra — pero sigue siendo eso.',
    'mes-dia':'Lo que haces y cómo piensas se entienden bien. No traes esa sensación de estar actuando un papel en el trabajo: lo que aplicas ahí se parece a lo que eres.',
    'mes-hora':'Lo que haces hoy se convierte con facilidad en material para lo de largo plazo. Poco de tu esfuerzo se va a la basura, aunque en el momento no lo parezca.',
    'dia-hora':'Tus proyectos se sienten tuyos cuando nacen de algo que de verdad te importa. Y se te nota cuando no: esos se te hacen cuesta arriba desde el primer día.'
  };
  var VACIOS={
    'Vacío en tu origen':{p:'La pertenencia no te vino dada. Pudo ser una familia que no acababa de sentirse tuya, o un lugar del que te fuiste, o simplemente que “los tuyos” no fueron los que te tocaron. Terminas construyendo tu propia casa, con gente que sí escogiste.',q:'¿Qué personas y qué lugares se sienten como casa para ti hoy?'},
    'Vacío en tu trayectoria':{p:'Nadie te dijo cómo. Ni qué estudiar, ni cómo funciona el trabajo, ni cuál era el camino. Fuiste armando el criterio sobre la marcha, probando y corrigiendo — y seguro todavía sientes que vas improvisando mientras los demás traen el manual. No lo traen.',q:'¿Qué criterio quieres que guíe tu siguiente paso?'},
    'Vacío en tu futuro':{p:'Lo de largo plazo no se te aparece solo. Los proyectos, los hijos, lo que quieres dejar: todo eso va tomando forma conforme decides qué merece seguir creciendo. No antes.',q:'¿Qué proyecto merece una forma más concreta en esta etapa?'}
  };

  var CICLOS={
    Rata:{m:'En esta etapa vas a ver oportunidades antes que los demás, y vas a querer dejar varias salidas abiertas antes de moverte.',a:'Con tantas puertas abiertas, escoger una cuesta más de lo que debería.',c:'Siempre hay un plan B guardado por ahí. A veces hasta un C.'},
    Buey:{m:'Avanzas despacio, pero lo que empiezas en esta etapa tiene continuidad. Vas construyendo paso a paso y sabiendo dónde estás pisando.',a:'Aguantas mucho. Eso sostiene procesos largos, y también alarga etapas que ya pedían soltarse.',c:'Vas midiendo cada paso. Cuando arrancas, cuesta sacarte del camino.'},
    Tigre:{m:'Arrancas con fuerza. En esta etapa te toca ser quien pone las cosas en movimiento mientras los demás siguen pensándolo.',a:'El impulso te llega antes que la estructura. A veces empiezas a correr mientras el plan todavía se está amarrando los zapatos.',c:'Tú ya empezaste mientras los demás siguen preguntando quién da el primer paso.'},
    Conejo:{m:'Lees el ambiente y acomodas las piezas para que una conversación o un grupo funcione con menos fricción.',a:'Cuidar tanto la armonía deja esperando conversaciones que ya deberían haberse tenido.',c:'Sabes bajarle el volumen a un cuarto. Nada más cuida que lo importante también llegue a decirse.'},
    Dragón:{m:'Piensas en grande y juntas piezas que venían de lugares distintos. Es una etapa de cambio y de construcción.',a:'Cuando todo parece importante, decidir qué va primero se vuelve la parte más pesada.',c:'Traes varias habitaciones abiertas al mismo tiempo. Conviene escoger cuál ordenas primero.'},
    Serpiente:{m:'Observas, calculas y te mueves cuando el momento ya está claro. Notas cosas que a los demás se les pasan.',a:'Pensarlo un poco más siempre parece razonable — hasta que el momento se empieza a ir.',c:'Ya lo habías visto venir. Ahora toca decidir cuándo actúas.'},
    Caballo:{m:'Pones ritmo, haces visible lo que está pasando y mueves las cosas cuando el ambiente se queda quieto.',a:'La velocidad te ayuda a arrancar, pero sostenerla mucho tiempo va dejando pendientes atrás.',c:'Llegas rápido y haces que todo se mueva contigo. También conviene revisar qué quedó atrás.'},
    Cabra:{m:'Cuidas el proceso, notas el contexto y le pones atención a los detalles que hacen que la experiencia se sienta mejor.',a:'Cuando quieres atender todas las variables, tu propia prioridad empieza a perder volumen.',c:'Cuidas muchas cosas a la vez. Lo tuyo también merece un lugar en la mesa.'},
    Mono:{m:'Encuentras atajos, herramientas y maneras ingeniosas de resolver algo que los demás estaban complicando.',a:'Resolver la parte interesante le quita chiste al último tramo, justo donde toca cerrar y entregar.',c:'Encuentras la vuelta rápido. El último paso también cuenta.'},
    Gallo:{m:'Ves el detalle que descompone el conjunto, y se te da ordenar, corregir y subir el estándar.',a:'Tu ojo sigue encontrando cosas que mejorar incluso cuando ya quedó bastante bien.',c:'Ves la costura que nadie más vio. También conviene saber cuándo dejarla en paz.'},
    Perro:{m:'Cuando decides que algo o alguien te importa, lo sostienes con una lealtad que casi nadie tiene.',a:'Esa misma lealtad te puede dejar amarrado a estructuras que ya dieron todo lo que podían dar.',c:'Te quedas cuando importa. Nada más revisa de vez en cuando si sigues sosteniendo lo mismo.'},
    Cerdo:{m:'Das espacio, haces que la gente se sienta recibida y abres conversación con facilidad.',a:'Dar tanto de entrada te deja con menos energía y menos margen del que creías.',c:'Abres la puerta rápido. Acuérdate de guardarte un cuarto para ti.'}
  };

  var AREAS={
    pares:{titulo:'Vínculos',tema:'personas, alianzas, pertenencia y límites',puede:['esa conversación que llevas semanas posponiendo con alguien cercano','alianzas, reencuentros, o decidir a quién sumas a tus planes','alguien te va a pedir algo y vas a tener que decidir si esta vez sí dices que no'],trabajar:['pide claro lo que necesitas, en vez de esperar a que lo adivinen','acuerda límites y responsabilidades antes de cargar con ellas','quédate donde el apoyo va y viene, no solo donde va'],cuidado:'Repartirte entre muchas personas te deja sin espacio para lo que también necesitas tú.'},
    salida:{titulo:'Expresión',tema:'ideas, expresión, producción y visibilidad',puede:['esa idea que llevas cargando y ya pide salir','ganas de producir, enseñar, hablar, escribir o mostrar lo que haces','una oportunidad de sacar algo de tu cabeza y ponerlo frente a otros'],trabajar:['termina una pieza antes de abrir tres frentes más','muestra una versión que ya se entienda y aprende de lo que te respondan','guárdate energía para sostener lo que publiques'],cuidado:'El entusiasmo abre más proyectos de los que tu calendario aguanta.'},
    recursos:{titulo:'Recursos',tema:'dinero, recursos, intercambio y resultados concretos',puede:['decisiones de dinero: una compra, un cobro, un precio que hay que poner','una oportunidad de convertir trabajo en algo que se pueda contar','un acuerdo donde conviene medir bien qué entra, qué sale y a qué te comprometes'],trabajar:['pon números y condiciones antes de comprometer nada','cierra las fugas chiquitas que juntas pesan más de lo que parecía','convierte una oportunidad en un plan con fecha, costo y siguiente paso'],cuidado:'Una oportunidad bonita crece rapidísimo cuando nadie le puso medida de tiempo, dinero o energía.'},
    presion:{titulo:'Estructura',tema:'presión, responsabilidad, autoridad y criterio',puede:['más responsabilidades, reglas, plazos o gente esperando algo de ti','un encuentro con alguien que manda, o una situación que pide orden','un momento donde sostener una decisión pesa más que haberla tomado'],trabajar:['separa la obligación real de la presión aprendida','ponle estructura a lo importante y suelta los controles que ya te cuestan de más','responde desde tu criterio, no desde la última exigencia que te llegó'],cuidado:'Cargar cada expectativa como si todas pesaran igual convierte la estructura en presión.'},
    soporte:{titulo:'Perspectiva',tema:'aprendizaje, apoyo, observación y conocimiento',puede:['un dato que te cambia la forma de ver un problema','alguien que te enseña, te orienta o te acerca la pieza que faltaba','una etapa de estudiar u observar antes del siguiente movimiento'],trabajar:['busca a alguien que sepa más del tema que estás resolviendo','dale tiempo a la información para acomodarse antes de decidir','convierte lo aprendido en una acción chiquita y comprobable'],cuidado:'Pensar cada escenario se come el momento en que también había que decidir.'}
  };
  var DINAMICAS={
    Espejo:'Este mes te vas a topar con gente que se parece a ti. Para bien y para mal: es fácil entenderse y también es fácil chocar por lo mismo.',
    Contrapunto:'Este mes se define quién se lleva qué. Negociaciones, comparaciones, repartos. Conviene que sepas qué querías tú antes de entrar.',
    Flujo:'Este mes sale lo que traías guardado. Buen momento para publicar, enseñar, entregar, mostrar. Menos fricción de la normal.',
    Impacto:'Este mes traes ganas de decir lo que nadie dice. Puede ser justo lo que hacía falta o puede ser un pleito — depende de cómo lo digas, no de si lo dices.',
    Oportunidad:'Este mes se mueven el dinero y las opciones. Van a aparecer más puertas de las que puedes cruzar, así que la habilidad del mes es descartar.',
    Concreción:'Este mes toca convertir esfuerzo en algo que se pueda contar. Números, cierres, cobros, orden. Poco glamour, mucho resultado.',
    Desafío:'Este mes algo te va a exigir reaccionar: competencia, urgencia, un problema concreto. Vas a decidir más rápido de lo que te gustaría, y probablemente bien.',
    Estructura:'Este mes se te van a acumular las responsabilidades. Reglas, plazos, gente esperando algo de ti. La pregunta útil es cuáles de verdad son tuyas.',
    Intuición:'Este mes la ayuda llega de donde no la esperabas: una conversación de pasillo, un dato suelto, alguien que no tenía por qué. Déjale espacio a lo raro.',
    Aprendizaje:'Este mes te conviene estudiar antes de moverte. Alguien que sabe más, un curso, un libro, una asesoría. La información que te falta está disponible.'
  };

  var RITMOS={
    Brote:{t:'Algo pide empezar.',l:'Este mes es de arrancar. Se destraba lo que llevaba tiempo parado y aparece ayuda para mover la primera pieza.',p:['un proyecto que por fin encuentra por dónde empezar','una invitación o una mano que te facilita el arranque','energía de vuelta para algo que llevaba rato esperándote'],w:['escoge una sola semilla y dale seguimiento','pide apoyo temprano, antes de cargar todo por tu cuenta'],c:'El primer paso se siente más grande de lo que en realidad es.'},
    Transición:{t:'Cambiar también implica soltar.',l:'Este mes se mueven hábitos, imagen y la forma en que te expones. El cambio funciona mejor cuando algo viejo de verdad deja el lugar.',p:['ganas de cambiar rutina, imagen o dinámica personal','un favor o un contacto que te abre una ruta distinta','ganas de probar otra forma de hacer algo que ya sabías hacer'],w:['decide qué versión vieja de una rutina ya cumplió su función','prueba el cambio en chiquito antes de volverlo permanente'],c:'Lo nuevo distrae de la razón por la que querías cambiar.'},
    Presencia:{t:'Este mes te quiere más visible.',l:'Este mes se trata de presentación, mejora, carrera y vida social. La forma también comunica, y este mes te puede abrir una puerta.',p:['más exposición en el trabajo o en lo social','una mejora de presentación, de imagen o de posición','contactos que te ayudan a estabilizar una etapa laboral'],w:['presenta lo que haces con claridad','usa la visibilidad para construir algo concreto, no nada más para que te vean'],c:'La apariencia se come el tiempo que también necesitaba el contenido.'},
    Despegue:{t:'Lo que venías haciendo empieza a tomar forma.',l:'Este mes se ve el avance y aparece gente de confianza que te ayuda a aterrizarlo.',p:['un avance que por fin se vuelve visible','viajes, movimiento o trámites que te acercan a una meta','apoyo de gente con la que ya hay confianza'],w:['administra bien el crecimiento','rodéate de quien cuide el proceso además del resultado'],c:'Empujar para demostrar que puedes con todo se come el avance que ya llevabas.'},
    Cumbre:{t:'Hay espacio para empujar algo importante.',l:'Este mes concentra logro, reputación, autoridad y resultados. Lo que se mide aquí es si usas esa fuerza hacia algún lado.',p:['reconocimiento por algo que ya venías construyendo','una oportunidad de crecer económica o profesionalmente','más capacidad de decidir y de ocupar espacio'],w:['pon tu energía detrás de una prioridad que se pueda medir','deja que el resultado hable antes de inflar la promesa'],c:'El exceso de confianza hace que una buena racha cargue más de lo necesario.'},
    Repliegue:{t:'Bajarle también es parte del ciclo.',l:'Este mes es de retirada y recuperación. Ceder un poco de velocidad te devuelve claridad para el tramo que sigue.',p:['menos ganas de sostener el mismo ritmo','pendientes que piden cierre antes de que crezca nada más','necesidad de espacio, de sueño, de recuperarte'],w:['bájale la carga a propósito, no por accidente','cierra pendientes chiquitos para recuperar margen'],c:'Confundir pausa con abandono te deja sin el descanso y sin el cierre.'},
    Ajuste:{t:'Este es el mes en que el cuerpo pasa la factura.',l:'Lo que llevas meses aguantando se vuelve visible justo ahora. No es mala suerte: es que ya se acumuló lo suficiente para notarse. Este mes rinde muchísimo más atender la señal chiquita que empujar por inercia — porque la señal chiquita, si la ignoras, no se queda chiquita.',p:['cansancio que te deja clarísimo un límite','temas emocionales que piden atención práctica, no análisis','ganas de ajustar la rutina para recuperar margen'],w:['ponle prioridad al descanso y a los hábitos básicos','atiende temprano las señales de sobrecarga y reacomoda lo que haga falta'],c:'Empujar por inercia convierte una señal chiquita en una carga grande.'},
    Cierre:{t:'Algo pide llegar a su final.',l:'Este mes es de terminar, posponer lo accesorio y liberar espacio para lo que sigue.',p:['un proyecto que llega a su punto de cierre','retrasos que te obligan a escoger qué sí vale la pena sostener','ganas de terminar una etapa antes de abrir la siguiente'],w:['cierra con claridad lo que ya cumplió su función','guárdate energía para lo esencial mientras pasa el tramo lento'],c:'Aferrarte a una etapa agotada hace que el cierre tarde más de lo que necesitaba.'},
    Resguardo:{t:'Guardar, limpiar y administrar toman el frente.',l:'Este mes es de limpieza y orden: decidir qué conservas, qué archivas y qué se termina.',p:['cierres administrativos o materiales','necesidad de ordenar papeles, recursos o pendientes','una situación que pide quedar protegida, archivada o concluida'],w:['haz limpieza concreta de pendientes','ponle límites y sistemas a lo que se va a quedar contigo'],c:'Controlar cada detalle convierte el orden en bloqueo.'},
    Desprendimiento:{t:'El terreno viejo empieza a perder fuerza.',l:'Este mes es de simplificar y soltar. El valor está en dejar que una ruta agotada ocupe cada vez menos espacio.',p:['planes que dejan de pesar lo que pesaban','una etapa hacia adentro, de buscar perspectiva','una opción que antes parecía central y se va apagando sola'],w:['simplifica decisiones y compromisos','deja espacio para que la respuesta llegue después de soltar la presión'],c:'Buscar certeza inmediata en un terreno que está cambiando aumenta la sensación de vacío.'},
    Semilla:{t:'La idea aparece antes que el resultado.',l:'Este mes es de planes, información y primeras intenciones. Sirve para preparar algo que todavía está tomando forma.',p:['información que te abre una posibilidad','una propuesta o una idea que apenas empieza a definirse','conversaciones que preparan un movimiento posterior'],w:['junta información antes de comprometerte','dale estructura a la idea mientras todavía se puede cambiar'],c:'Pensar cada variante retrasa una idea que ya tenía forma suficiente para probarse.'},
    Incubación:{t:'Lo importante necesita alimento antes que velocidad.',l:'Este mes es de cuidar lo que empieza — un proyecto, un vínculo, o a ti. Lo que crece este mes crece por estar bien sostenido, no por ir rápido.',p:['un proyecto o una relación que pide cuidados tempranos','más necesidad de descanso y recuperación','oportunidades de apoyar o de recibir apoyo'],w:['dale tiempo y recursos a lo que quieres ver crecer','trata tu propia recuperación como parte del trabajo'],c:'Cuidar todo alrededor y dejarte al último vacía justo la energía que el mes pedía juntar.'}
  };

  var DIA12={
    Arrancar:'Hoy es buen día para dar el primer paso en algo que ya sabes hacia dónde va. De esos días que convierten una intención en movimiento.',
    Depurar:'Hoy te conviene quitarte peso: cerrar pendientes, recortar lo que sobra y dejar espacio para lo que sigue.',
    Reunir:'Hoy va bien todo lo que implique juntar: gente, recursos, respuestas o piezas que andaban dispersas.',
    Ajustar:'Hoy varias partes necesitan acomodarse entre sí. Buen día para negociar, repartir y ajustar sin apretar de más.',
    Afianzar:'Hoy se siente más estable. Va bien con decisiones que ya pensaste y ahora quieres sostener con más firmeza.',
    Ejecutar:'Hoy toca manos a la obra. Si ya lo pensaste suficiente, es buen momento para convertirlo en algo concreto.',
    Desmontar:'Hoy sirve para desarmar lo que ya se siente agotado. Recortar, cancelar o cuestionar una estructura libera bastante espacio.',
    Revisar:'Hoy te conviene dejarte margen. Probar y hacer cambios chiquitos se siente mejor que comprometerlo todo de una vez.',
    Consolidar:'Hoy va bien cerrar lo que venías trabajando. Entregar, formalizar o mostrar un resultado se siente natural.',
    Captar:'Hoy el movimiento va de regreso hacia ti: respuestas, pagos, comentarios, entregas o recursos que estaban pendientes.',
    Mostrar:'Hoy se abren puertas hacia afuera. Presentar, publicar o conocer gente encuentra buena corriente.',
    Pausa:'Hoy le conviene bajarle al volumen. Ordenar, respaldar y cerrar cosas chiquitas rinde más que llenarte el día.'
  };
  var DIA28={
    Impulso:'Hoy hay ganas de abrir camino. Presentar una idea, moverte o probar algo nuevo se siente más fácil de lo normal.',
    Reserva:'Hoy te conviene cuidar recursos. Comparar, revisar números y pensarlo un poco más antes de comprometerte te ahorra ruido después.',
    Exposición:'Hoy el día mira hacia afuera. Mostrar tu trabajo, hablar frente a otros o darle alcance a un mensaje encuentra buena corriente.',
    Continuidad:'Hoy va bien seguir construyendo sobre algo que ya existe. Mejor para planes y relaciones que necesitan continuidad que para giros bruscos.',
    Roce:'Hoy se ven más las diferencias de criterio. Si entras a una conversación sabiendo qué quieres resolver, el roce se queda en lo útil.',
    Apoyo:'Hoy va bien pedir ayuda y coordinarse. Permisos, acuerdos y colaboraciones avanzan mejor si dejas que otros pongan de su parte.',
    Recursos:'Hoy toca lo práctico: pagos, cobros, inventario y tener ubicado lo que tienes.',
    Administración:'Hoy los números se ven más claros. Métricas, presupuestos y procesos se acomodan mejor cuando los pones sobre la mesa.',
    Margen:'Hoy te conviene dejar colchón. Las tareas que se pueden corregir sobre la marcha encajan mejor que las que te amarran desde el minuto uno.',
    Estudio:'Hoy te puedes meter en algo y quedarte ahí un rato. Estudiar, investigar, escribir o preparar una estrategia rinde especialmente bien.',
    Recuperación:'Hoy el ritmo baja. Descansar, editar, ordenar y recuperar capacidad te da más que seguir empujando por inercia.',
    Cuidado:'Hoy conviene cuidar el ritmo y los detalles. Las tareas chiquitas, claras y fáciles de ajustar se sienten mucho más cómodas.',
    Escala:'Hoy hay ganas de crecer. Si algo ya trae dirección, es buen momento para darle más alcance, recursos o espacio.',
    Ganancia:'Hoy va bien todo lo que sea intercambio: cobros, ventas, acuerdos. Las conversaciones donde ambas partes saben qué quieren fluyen mejor.',
    Prueba:'Hoy sirve para probar hasta dónde aguanta algo. Un reto chiquito o una revisión práctica te da información útil antes de apostar más.',
    Fluidez:'Hoy se siente ligero cuando hay que coordinarse. Acuerdos, celebraciones y trabajo en equipo fluyen con menos fricción.',
    Visibilidad:'Hoy hay reflectores. Presentar resultados, publicar o acercarte a gente nueva ayuda a que tu trabajo se vea.',
    'Bajo perfil':'Hoy conviene trabajar bajito. Borradores, mantenimiento y pendientes internos rinden más que buscar atención afuera.',
    Cooperación:'Hoy va bien la conversación paciente. Negociar, coordinar y llegar a acuerdos es más fácil cuando todos tienen tiempo de escucharse.',
    Revisión:'Hoy conviene la segunda mirada. Corregir, comparar y revisar antes de comprometerte saca detalles que todavía faltaban.',
    Actualización:'Hoy hay aire de actualización. Retocar una estrategia, refrescar un proyecto o presentar una versión nueva cae especialmente bien.',
    Estructura:'Hoy toca poner bases. Diseñar procesos, ordenar un proyecto o armar un prototipo te deja mejor parado para el siguiente movimiento.',
    Pausa:'Hoy viene tranquilo. Ordenar, revisar y hacer tareas chiquitas te da el espacio mental que hacía falta para ver algo con más claridad.',
    Espera:'Hoy conviene esperar. Cotizar, comparar y preparar primero te ayuda a decidir con más calma cuando toque comprometer recursos.',
    Encuentro:'Hoy se abre espacio para encontrarse. Una reunión importante, una propuesta o el arranque de un proyecto personal recibe buen empujón.',
    Avance:'Hoy hay avance visible. Vender, negociar o cerrar un acuerdo revisado se siente como mover una ficha que llevaba rato esperando.',
    Cautela:'Hoy conviene llegar preparado. Revisar condiciones, hacer respaldos y cerrar pendientes te da piso antes de asumir algo nuevo.',
    Aprobación:'Hoy va bien pedir: una respuesta, una oportunidad, un recurso. Solicitudes y propuestas encuentran mejor recepción cuando llegan bien armadas.'
  };

  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function cap(x){x=String(x||'');return x?x.charAt(0).toUpperCase()+x.slice(1):'';}
  function texto(el,t){if(el&&el.textContent!==t)el.textContent=t;}

  function mutarObjeto(dest,src){if(!dest||!src)return;Object.keys(src).forEach(function(k){if(dest[k])Object.assign(dest[k],src[k]);});}

  function mutarDatos(){
    if(root.TE_ELEMENTO_COPY){Object.keys(ELEMENTOS).forEach(function(k){var d=ELEMENTOS[k],o=root.TE_ELEMENTO_COPY[k];if(o){o.fortaleza=d.da;o.cuidado=d.mas;o.cuandoMenos=d.menos;o.probar=d.probar.slice();}});}
    if(root.TE_PERFIL_COPY){Object.keys(FORMAS).forEach(function(k){var d=FORMAS[k],o=root.TE_PERFIL_COPY[k];if(o){o.area=d.area;o.resumen=d.resumen;o.seNota=d.nota;o.cuidado=d.costo;o.probar=d.prueba;o.etiqueta=d.label;}});}
    if(root.PILARES){Object.keys(PILARES).forEach(function(k){if(root.PILARES[k])root.PILARES[k].intro=PILARES[k];});}
    if(root.CHOQUES)Object.keys(CHOQUES).forEach(function(k){root.CHOQUES[k]=CHOQUES[k];});
    if(root.COMBINACIONES)Object.keys(ENLACES).forEach(function(k){root.COMBINACIONES[k]=ENLACES[k];});
    if(root.VACIOS){
      if(root.VACIOS.anio){root.VACIOS.anio.texto=VACIOS['Vacío en tu origen'].p;root.VACIOS.anio.filo='La pregunta: '+VACIOS['Vacío en tu origen'].q;}
      if(root.VACIOS.mes){root.VACIOS.mes.texto=VACIOS['Vacío en tu trayectoria'].p;root.VACIOS.mes.filo='La pregunta: '+VACIOS['Vacío en tu trayectoria'].q;}
      if(root.VACIOS.hora){root.VACIOS.hora.texto=VACIOS['Vacío en tu futuro'].p;root.VACIOS.hora.filo='La pregunta: '+VACIOS['Vacío en tu futuro'].q;}
    }
    if(root.TE_AREAS_MES)mutarObjeto(root.TE_AREAS_MES,AREAS);
    if(root.TE_DINAMICAS_MES){Object.keys(root.TE_DINAMICAS_MES).forEach(function(k){var o=root.TE_DINAMICAS_MES[k],d=o&&DINAMICAS[o.nombre];if(d)o.matiz=d;});}
    if(root.TE_RITMOS_MES){root.TE_RITMOS_MES.forEach(function(o){var d=RITMOS[o.nombre];if(d){o.titular=d.t;o.lectura=d.l;o.puede=d.p.slice();o.trabajar=d.w.slice();o.cuidado=d.c;}});}
    if(root.OFICIALES){root.OFICIALES.forEach(function(o){if(DIA12[o.nombre])o.caracter=DIA12[o.nombre];});}
    if(root.PULSOS_28){root.PULSOS_28.forEach(function(o){if(DIA28[o.nombre])o.caracter=DIA28[o.nombre];});}
    root.vientoDelDia=function(p){if(p>=80)return'Hoy traes bastante apoyo para mover algo importante.';if(p>=68)return'Hoy hay buena corriente para avanzar.';if(p>=55)return'Hoy viene mixto: importa mucho qué quieras hacer.';if(p>=35)return'Hoy te conviene moverte con un poco más de margen.';return'Hoy viene tranquilo. Preparar, revisar y ordenar te rinde más que empujar.';};
    if(root.evaluarDia&&!root.evaluarDia.__copyV2){
      var original=root.evaluarDia;
      var envuelto=function(fecha,natal){var d=original(fecha,natal);(d.avisos||[]).forEach(function(a){
        if(a.motivo==='el día y el mes jalan a ritmos distintos'){a.motivo='El día y el mes van a ritmos distintos';a.nota='Déjate más espacio entre decisiones y compromisos';}
        else if(a.motivo==='el día y el año llevan ritmos distintos'){a.motivo='El día y el año llevan ritmos distintos';a.nota='Escoge planes que se puedan ajustar sobre la marcha';}
        else if(a.motivo==='el día roza con Tu origen'){a.motivo='Hoy roza con tu origen';a.nota='Escoge tareas con margen de maniobra y revisa qué estás esperando de quién';}
        else if(/recursos/.test(a.motivo)){a.motivo='Roce de recursos';a.nota='Lleva los gastos, los traslados y la coordinación con un poco más de margen';}
        else if(/imprevistos/.test(a.motivo)){a.motivo='Roce de imprevistos';a.nota='Escoge tareas que se puedan ajustar y revisa los detalles con calma antes de cerrar';}
        else if(/ritmo/.test(a.motivo)){a.motivo='Roce de ritmo';a.nota='Déjate más tiempo para respuestas, entregas y coordinación';}
      });return d;};
      envuelto.__copyV2=true;root.evaluarDia=envuelto;
    }
  }

  function datosCarta(){
    try{var qs=new URLSearchParams(location.search),id=qs.get('perfil');if(!id||!root.leerPerfil||!root.cartaDesdePerfil||!root.analizarCartaProfunda)return null;var p=root.leerPerfil(id);if(!p)return null;var c=root.cartaDesdePerfil(p),sin=!!(p.nacimiento&&p.nacimiento.sinHora);return {perfil:p,carta:c,a:root.analizarCartaProfunda(c,{sinHora:sin,nacimiento:p.nacimiento||{}}),sinHora:sin};}catch(e){return null;}
  }

  function parcheHero(){
    var el=document.querySelector('.resultadoElemento'),d=document.querySelector('.resultadoDescripcion');if(!el||!d)return;
    var raw=el.textContent.toLowerCase().replace(/·/g,' ').replace(/\s+/g,' ').trim(),key=null;
    Object.keys(HERO).some(function(k){if(raw.indexOf(k)!==-1){key=k;return true;}return false;});if(!key)return;
    var c=HERO[key],html='<strong>'+esc(c.t)+'</strong><br><span>'+esc(c.p)+'</span>';if(d.innerHTML!==html)d.innerHTML=html;
  }

  function presenciaPorCard(card){var s=card.querySelector('small');var x=s?s.textContent:'';if(/MÁS PRESENTES/i.test(x))return'A esto le echas mano sin pensarlo. Es tu respuesta por default, y sale incluso cuando no era la respuesta que hacía falta.';if(/MENOS PRESENTES/i.test(x))return'Esto lo usas poco. No es que no puedas: es que te cuesta arrancar y necesitas más intención para que salga. Nadie te lo va a dar — se aprende.';return'Esto lo tienes disponible sin que se te suba al volante. Sale cuando la situación lo pide y se quita cuando no.';}

  function parcheCarta(){
    parcheHero();var d=datosCarta();
    var mezcla=document.querySelector('.cpgModulo--mezcla');if(mezcla){
      texto(mezcla.querySelector('.cpgExplica'),'Traes cinco ingredientes: Madera, Fuego, Tierra, Metal y Agua. No es que uno sea bueno y otro malo — son cinco maneras distintas de resolver la vida. Casi nadie los tiene parejos: casi todos traemos dos o tres de sobra y uno o dos de menos.');
      var dato=mezcla.querySelector('.cpgDato');if(dato&&d){var m=d.a.mezcla,pct={},total=m.total||1;['madera','fuego','tierra','metal','agua'].forEach(function(e){pct[e]=Math.round((m.conteo[e]||0)/total*100);});var st=dato.querySelector('strong'),sp=dato.querySelector('span');if(st)st.textContent='Tienes más '+cap(m.dominante)+' ('+pct[m.dominante]+'%) y menos '+cap(m.menor)+' ('+pct[m.menor]+'%).';if(sp)sp.textContent='Lo que traes de más es la respuesta a la que echas mano sin pensarlo, incluso cuando no era la que hacía falta. Lo que traes de menos cuesta más arrancarlo y necesita intención. Balancear no es tener 20% de cada cosa: es dejar de pedirle a un solo ingrediente que te resuelva todo.';}
    }
    var formas=document.querySelector('.cpgModulo--formas');if(formas&&d&&d.a.perfiles&&d.a.perfiles.principal&&d.a.perfiles.principal.dinamica){var k=d.a.perfiles.principal.dinamica.nombre,c=FORMAS[k],datoF=formas.querySelector('.cpgDato');if(c&&datoF){var fs=datoF.querySelector('strong'),fp=datoF.querySelector('span');if(fs)fs.textContent='Tu forma principal: '+c.label+'.';if(fp)fp.textContent=c.resumen;}}
    var pil=document.querySelector('.cpgModulo--pilares .cpgExplica');if(pil)pil.textContent='Los primeros cuatro pilares son cuatro zonas que traes activas al mismo tiempo. Tu brújula y Tu punto de partida agregan dos referencias para entender qué te compensa y qué aparece cuando bajas la guardia.';
    if(d){var es=ESTADOS[d.a.estado&&d.a.estado.estado],box=document.querySelector('.cpgEstado');if(es&&box){var sg=box.querySelector('strong'),pp=box.querySelector('p');if(sg)sg.textContent=es.t;if(pp)pp.textContent=es.p;}}

    document.querySelectorAll('.cpgElementoProfundo').forEach(function(card){var h=card.querySelector('h3');if(!h)return;var e=h.textContent.trim().toLowerCase(),c=ELEMENTOS[e];if(!c)return;var top=card.querySelector('.cpgElementoProfundoTop');if(!top)return;var html='<p class="copyV2Presencia">'+esc(presenciaPorCard(card))+'</p><h4>Lo que te da</h4><p>'+esc(c.da)+'</p><h4>Cuando traes de más</h4><p>'+esc(c.mas)+'</p><div class="copyV2Menos"><h4>Cuando traes de menos</h4><p>'+esc(c.menos)+'</p></div><h4>Qué puedes probar</h4><div class="cpgConsejos">'+c.probar.map(function(x){return'<span>'+esc(x)+'</span>';}).join('')+'</div>';var n=top.nextElementSibling;if(!n||!n.classList.contains('copyV2ElementoCuerpo')){var w=document.createElement('div');w.className='copyV2ElementoCuerpo';while(top.nextSibling)top.parentNode.removeChild(top.nextSibling);top.insertAdjacentElement('afterend',w);n=w;}if(n.innerHTML!==html)n.innerHTML=html;});

    var principal=document.querySelector('.cpgFormaPrincipal');if(principal){var h3=principal.querySelector('h3'),key=h3&&FORMAS[h3.textContent.trim()]?h3.textContent.trim():null,c=key&&FORMAS[key];if(c){h3.textContent=c.label;var p=principal.querySelector(':scope>p');if(p)p.textContent=c.resumen;var cols=principal.querySelectorAll('.cpgFormaPrincipalGrid>div');if(cols[0]){texto(cols[0].querySelector('b'),'Cómo se nota');texto(cols[0].querySelector('span'),c.nota);}if(cols[1]){texto(cols[1].querySelector('b'),'El costo');texto(cols[1].querySelector('span'),c.costo);}if(cols[2]){texto(cols[2].querySelector('b'),'Prueba esto');texto(cols[2].querySelector('span'),c.prueba);}}}
    document.querySelectorAll('.cpgForma').forEach(function(card){var h=card.querySelector('h3');if(!h)return;var key=card.getAttribute('data-copy-key')||h.textContent.trim(),c=FORMAS[key];if(!c)return;card.setAttribute('data-copy-key',key);h.textContent=c.label;var area=card.querySelector('small');if(area)area.textContent=c.area;var ps=card.querySelectorAll('p'),hs=card.querySelectorAll('h4');if(ps[0])ps[0].textContent=c.resumen;if(hs[0])hs[0].textContent='Cómo se nota';if(ps[1])ps[1].textContent=c.nota;if(hs[1])hs[1].textContent='El costo';if(ps[2])ps[2].textContent=c.costo;var tip=card.querySelector('.cpgConsejos span');if(tip)tip.textContent=c.prueba;});

    var cpPilares=document.querySelector('.cpPilares');if(cpPilares&&!document.querySelector('.copyV2PilaresEncuadre')){cpPilares.insertAdjacentHTML('beforebegin','<div class="copyV2Encuadre copyV2PilaresEncuadre"><strong>Los cuatro no son etapas de tu vida.</strong> Son cuatro zonas que traes activas al mismo tiempo.</div>');}
    document.querySelectorAll('.cpPilar').forEach(function(card){var h=card.querySelector('h3');if(!h)return;var k=h.textContent.trim(),c=PILARES[k];if(!c)return;var meta=card.querySelector('.meta');var first=meta&&meta.nextElementSibling;if(first)first.textContent=c;var p=first&&first.nextElementSibling;while(p){var next=p.nextElementSibling;if(p.tagName==='P'&&!p.classList.contains('meta'))p.remove();p=next;}});

    var vacView=document.querySelector('.cpVista');if(vacView&&Array.prototype.some.call(vacView.querySelectorAll('h2'),function(h){return/ vac/i.test(h.textContent)||/^Tus vacíos/i.test(h.textContent);})&&!vacView.querySelector('.copyV2VacioEncuadre')){var cab=vacView.querySelector('.cpCab');if(cab)cab.insertAdjacentHTML('afterend','<div class="copyV2Encuadre copyV2VacioEncuadre"><strong>Es una zona de tu mapa que no vino con instrucciones.</strong> Donde otros recibieron un manual, tú recibiste una hoja en blanco. Suena mal y no lo es: quiere decir que esa parte de tu vida la escribes tú. Casi todo el mundo tiene uno. Quien resuelve el suyo suele decir que fue lo más importante que hizo.</div>');}
    document.querySelectorAll('.cpNudo').forEach(function(card){var h=card.querySelector('h3');if(!h)return;var key=null;if(/origen/i.test(h.textContent))key='Vacío en tu origen';else if(/trayectoria/i.test(h.textContent))key='Vacío en tu trayectoria';else if(/futuro/i.test(h.textContent))key='Vacío en tu futuro';var c=key&&VACIOS[key];if(!c)return;var meta=card.querySelector('.meta');var p=meta&&meta.nextElementSibling;if(p)p.textContent=c.p;var extra=p&&p.nextElementSibling;if(extra)extra.innerHTML='<strong>La pregunta:</strong> '+esc(c.q);});
  }

  function parcheCiclos(){
    var resumen=document.querySelector('.ciclosResumen');if(resumen&&!document.querySelector('.copyV2CiclosEncuadre'))resumen.insertAdjacentHTML('afterend','<section class="copyV2CiclosEncuadre"><p><strong>Sí, son animales. No, no significa que te parezcas al animal</strong> — eso es una simplificación que se popularizó en los manteles.</p><p>Son nombres para doce energías, y aquí no describen cómo eres tú: describen <strong>cómo se siente la etapa que estás viviendo</strong>. Cada una dura unos diez años.</p></section>');
    document.querySelectorAll('.cicloItem').forEach(function(item){var cab=item.querySelector('.cicloCab');if(!cab)return;var animal=Object.keys(CICLOS).find(function(n){return cab.textContent.trim().indexOf(n)===0;});if(!animal)return;var c=CICLOS[animal];item.querySelectorAll('.cicloTexto').forEach(function(p){p.remove();});var box=item.querySelector('.copyV2CicloDetalle');if(!box){box=document.createElement('div');box.className='copyV2CicloDetalle';cab.insertAdjacentElement('afterend',box);}var html='<div class="copyV2CicloBloque"><small>Cómo se mueve</small><p>'+esc(c.m)+'</p></div><div class="copyV2CicloBloque"><small>Dónde aprieta</small><p>'+esc(c.a)+'</p></div><div class="copyV2CicloBloque copyV2CicloBloque--corto"><small>En corto</small><p>'+esc(c.c)+'</p></div>';if(box.innerHTML!==html)box.innerHTML=html;});
  }

  function parcheMes(){
    var sec=document.querySelectorAll('.mesDos .mesSeccion');if(sec[0])texto(sec[0].querySelector('.mesClave'),'Cómo se va a sentir');if(sec[1])texto(sec[1].querySelector('.mesClave'),'En qué te conviene trabajar');
    document.querySelectorAll('.mesSeccion').forEach(function(s){var k=s.querySelector('.mesClave');if(k&&k.textContent.trim()==='Qué se mueve')k.textContent='De qué va';});
    document.querySelectorAll('.mesInter').forEach(function(x){var tit=x.querySelector('b'),tipo=x.querySelector('span'),p=x.querySelector('p');if(!tit||!tipo||!p)return;var tema='';Object.keys(AREAS).forEach(function(k){var a=AREAS[k];if(!tema&&p.textContent.toLowerCase().indexOf(a.tema.toLowerCase().split(',')[0])!==-1)tema=a.tema;});var t=tipo.textContent.toLowerCase();if(t==='friccion'||t==='fricción')p.textContent='En '+tit.textContent+' vas a notar más fricción'+(tema?': '+tema:'')+'. Te conviene ajustar ritmo, expectativas o dirección.';else if(t==='enlace')p.textContent='En '+tit.textContent+' vas a encontrar más apoyo'+(tema?': '+tema:'')+'. Puede darte una vía más fluida para mover lo importante.';else if(t==='resonancia')p.textContent='En '+tit.textContent+' vas a sentir más volumen'+(tema?': '+tema:'')+'. Conviene prestarle atención a propósito.';});
  }

  function parcheCalendario(){
    var capas=document.querySelectorAll('#diaCaja .capaTiempo');if(capas[1])texto(capas[1].querySelector('span'),'Corriente del día');
    var tipo=document.querySelector('#diaCaja .tipoDia');if(tipo){var bar=document.querySelector('#diaCaja .medidor i'),w=bar?parseFloat(bar.style.width):NaN;if(!isNaN(w))tipo.textContent=root.vientoDelDia(w);}
  }

  function parcheTodo(){parcheCarta();parcheCiclos();parcheMes();parcheCalendario();}
  var ocupado=false;
  function programar(){if(ocupado)return;ocupado=true;setTimeout(function(){ocupado=false;parcheTodo();},30);}

  function iniciar(){
    mutarDatos();
    try{if(typeof root.TE_CARTA_PROFUNDA_RENDER==='function')root.TE_CARTA_PROFUNDA_RENDER();}catch(e){}
    setTimeout(function(){var b=document.getElementById('mesHoy');if(b)b.click();var d=document.getElementById('diaHoy');if(d)d.click();parcheTodo();},90);
    if(document.body&&typeof MutationObserver!=='undefined')new MutationObserver(programar).observe(document.body,{childList:true,subtree:true});
    parcheTodo();
  }

  if(document.readyState==='complete')iniciar();else root.addEventListener('load',iniciar,{once:true});
})(typeof globalThis!=='undefined'?globalThis:this);
