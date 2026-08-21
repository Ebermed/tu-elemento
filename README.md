<div align="center">

# Tu Elemento

### BaZi convertido en una experiencia visual, personal y fácil de explorar.

[![Release](https://img.shields.io/badge/release-V1%20Artx-8B5E3C?style=for-the-badge)](https://ebermed.github.io/tu-elemento/)
[![Web](https://img.shields.io/badge/abrir-Tu%20Elemento-F5EDD6?style=for-the-badge&labelColor=2E2A26)](https://ebermed.github.io/tu-elemento/)
[![Local first](https://img.shields.io/badge/datos-en%20tu%20navegador-B8D4C8?style=for-the-badge&labelColor=2E2A26)](#privacidad-y-datos)

**[Abrir Tu Elemento →](https://ebermed.github.io/tu-elemento/)**

</div>

---

## ¿Qué es Tu Elemento?

**Tu Elemento** es una aplicación web que transforma una carta BaZi en una lectura visual pensada para consultarse con facilidad desde el teléfono o la computadora.

La fecha, hora y lugar de nacimiento se convierten en cuatro pilares que la app presenta con una nomenclatura editorial propia:

- **Tu origen** — el entorno que te recibió.
- **Tu trayectoria** — la forma en que avanzas, trabajas y construyes camino.
- **Tu centro** — la parte más personal de la carta y donde aparece tu elemento base.
- **Tu futuro** — proyectos, vida interior y lo que vas construyendo con el tiempo.

El elemento base se traduce a una de diez identidades visuales: **Roble, Hiedra, Sol, Brasa, Montaña, Huerto, Acero, Joya, Marea y Rocío**.

## Qué puedes hacer

Tu Elemento permite crear y guardar varias cartas, distinguir entre tu propia carta y las de otras personas, consultar lecturas completas de los cuatro pilares, revisar la distribución de los cinco elementos, explorar vacíos con interpretación contextual, consultar ciclos de diez años, descargar una tarjeta visual para compartir y usar un calendario diario personalizado para cualquiera de las cartas almacenadas.

El calendario también funciona como **lectura general** y, al elegir una carta guardada, cruza cada fecha con la persona seleccionada.

## Diseño

La interfaz sigue una dirección visual de **acuarela + liquid glass**. Los fondos se generan proceduralmente a partir de la paleta asociada con cada elemento, mientras tarjetas, controles y superficies utilizan transparencias suaves, bordes luminosos y profundidad contenida.

La prioridad visual es que una carta extensa siga sintiéndose como una experiencia editorial: jerarquía tipográfica clara, lectura cómoda en móvil, iconografía propia y tarjetas compartibles con suficiente contraste para redes sociales.

## Privacidad y datos

El cálculo ocurre en el navegador y las cartas se almacenan mediante `localStorage`. Eso permite volver a una carta y utilizarla en el calendario desde el mismo navegador.

Los datos permanecen asociados al almacenamiento local de ese navegador. Al limpiar los datos del sitio se reinicia también la biblioteca de cartas.

## Cómo funciona

BaZi organiza año, mes, día y hora mediante el calendario solar chino. El motor de Tu Elemento conserva esa estructura de cálculo y después aplica una capa editorial propia para presentar animales, elementos, relaciones entre pilares, vacíos, ciclos y calendario con lenguaje cotidiano.

La aplicación está construida con **HTML, CSS y JavaScript vanilla** y se publica como sitio estático mediante **GitHub Pages**.

## Ejecutar localmente

Clona el repositorio y sirve la raíz con cualquier servidor HTTP estático. Por ejemplo:

```bash
git clone https://github.com/Ebermed/tu-elemento.git
cd tu-elemento
python -m http.server 8000
```

Después abre:

```text
http://localhost:8000/
```

## Estructura del proyecto

```text
tu-elemento/
├── index.html              # Entrada pública
├── calendario.html         # Entrada pública del calendario
├── v11/                    # Aplicación estable actual
│   ├── index.html          # Carta, perfiles y biblioteca
│   ├── calendario.html     # Calendario diario y mensual
│   ├── app.css             # Sistema visual
│   ├── app.js              # Flujo principal de la carta
│   ├── base.js             # Perfiles y persistencia local
│   ├── motor.js            # Cálculo de los cuatro pilares
│   ├── traduccion.js       # Capa de traducción de la carta
│   ├── lectura.js          # Motor de interpretación
│   ├── lectura-personalizada.js
│   ├── pilares.js          # Presentación de los cuatro pilares
│   ├── reglas.js           # Reglas del calendario
│   ├── calendario.js       # Lógica del calendario
│   ├── decadas.js          # Ciclos de diez años
│   ├── tarjeta.js          # Tarjeta compartible
│   ├── acuarela.js         # Fondos procedurales
│   ├── lugares.js          # Búsqueda de lugares
│   ├── zonas.js            # Conversión horaria
│   └── release.js          # Nomenclatura de versiones
└── README.md
```

## Releases

La primera versión final es **V1 — Artx**. Todas las iteraciones anteriores forman parte de la etapa beta del proyecto.

Las mejoras dentro de la misma generación conservan su codename —por ejemplo `V1.1 Artx`, `V1.2 Artx`— y cada cambio de versión mayor avanza al siguiente nombre de la secuencia.

<details>
<summary><strong>Nomenclatura completa A → Z</strong></summary>

| Versión mayor | Codename |
|---:|---|
| V1 | Artx |
| V2 | Broadway |
| V3 | Cell |
| V4 | Dolphin |
| V5 | Espresso |
| V6 | Flipper |
| V7 | Gekko |
| V8 | Hikaru |
| V9 | Indy |
| V10 | Jerry |
| V11 | Katana |
| V12 | Latte |
| V13 | Madam |
| V14 | Naomi |
| V15 | Onyx |
| V16 | Prospero |
| V17 | QSound |
| V18 | Reality |
| V19 | SuperFX |
| V20 | Tegra |
| V21 | Ultra |
| V22 | Voodoo |
| V23 | Wolf |
| V24 | Xenon |
| V25 | YBoard |
| V26 | Zilog |

</details>

Los codenames toman inspiración de **hardware, chips, arquitecturas, placas y nombres de desarrollo vinculados con la historia de los videojuegos**.

## Estado actual

**V1 Artx** inaugura la etapa estable de Tu Elemento con biblioteca multicarta, carta completa, calendario personalizado, tarjetas compartibles, lectura de vacíos, ciclos de diez años y la identidad visual acuarela/liquid glass.

---

<div align="center">

Hecho con ♥ por **Ebermedia**.

**[ebermed.github.io/tu-elemento](https://ebermed.github.io/tu-elemento/)**

</div>
