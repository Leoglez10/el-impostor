<div align="center">

# El Impostor

Juego web de deducción social para compartir un solo dispositivo: reparte roles en secreto, guía el debate y resuelve la votación final.

[Probar la demo](https://el-impostor-839098521388.us-west1.run.app/)

</div>

> La partida se desarrolla de forma local en un navegador. No hay salas, servidor multijugador ni sincronización entre dispositivos.

## Qué permite hacer

- Configurar entre **3 y 16 jugadores** y uno o más impostores, hasta un máximo de `jugadores - 2`.
- Usar nombres personalizados o identificadores automáticos como `Jugador 1`.
- Elegir la palabra de forma manual, aleatoria, por categoría o mediante Gemini.
- Mostrar el rol a cada participante por turnos sin revelar la información al resto.
- Seleccionar al jugador que inicia el debate y anunciarlo mediante audio.
- Registrar votaciones, limitar los intentos y mostrar el resultado de la partida.
- Evitar las últimas 100 palabras utilizadas mediante un historial local.
- Ajustar tema claro u oscuro, contraste, tamaño de texto, tipografía y reducción de animaciones.
- Activar una categoría para adultos mediante una confirmación en dos pasos.

## Capturas

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/03a26fa0-1907-4839-8a69-b95dd4aa3f14" alt="Pantalla de configuración de El Impostor" /></td>
    <td><img src="https://github.com/user-attachments/assets/9acf3403-703b-4fb5-a580-97f994186150" alt="Pantalla de revelación de rol de El Impostor" /></td>
  </tr>
</table>

## Cómo jugar

1. Define el número de jugadores y de impostores.
2. Decide si usarás nombres personalizados.
3. Selecciona el origen de la palabra secreta:
   - **Manual:** una persona escribe la palabra.
   - **Azar:** la aplicación elige una palabra de su catálogo.
   - **Tema:** la aplicación elige dentro de una categoría.
   - **IA:** Gemini genera y valida una palabra a partir de un tema.
4. Pasa el dispositivo a cada participante para que consulte su rol y vuelva a ocultarlo.
5. Debate por turnos; quienes conocen la palabra deben dar pistas sin ser demasiado evidentes.
6. Abre la votación y selecciona a la persona sospechosa.
7. Si quedan intentos o impostores por encontrar, continúa votando; de lo contrario, la aplicación revela el resultado.

> El modo **IA** y los anuncios de voz requieren conexión a Internet y una clave de Gemini configurada. Las palabras manuales, aleatorias y por categoría no necesitan esa integración.

## Datos y privacidad

La aplicación no incluye cuentas ni base de datos. El estado de la partida vive en memoria y se reinicia al recargar la página.

El navegador conserva únicamente el historial de palabras recientes en `localStorage`, con la clave `el_impostor_historial_palabras`. Borrar los datos del sitio elimina ese historial.

Cuando se usa Gemini, el tema solicitado se envía al servicio de Google para generar una palabra. Los anuncios de voz también usan Gemini Text-to-Speech.

## Desarrollo local

### Requisitos

- Node.js y npm. El repositorio no fija una versión concreta ni incluye un lockfile.
- Una clave de Gemini únicamente si se van a probar la generación por IA o los anuncios de voz.

### Instalación

```bash
git clone https://github.com/Leoglez10/el-impostor.git
cd el-impostor
npm install
```

### Configuración de Gemini

Crea un archivo `.env.local` en la raíz:

```dotenv
GEMINI_API_KEY=your_key_here
```

Vite carga esta variable y la expone al código cliente como `process.env.API_KEY`.

> ⚠️ Una aplicación frontend no puede mantener una clave en secreto: el valor queda incorporado en el JavaScript enviado al navegador. No uses una credencial sin restricciones en un despliegue público. Para producción, la integración debería pasar por un backend y aplicar controles de acceso y cuota.

### Scripts disponibles

| Comando | Función |
|---|---|
| `npm run dev` | Inicia Vite en `0.0.0.0:3000`. |
| `npm run build` | Genera la salida de producción en `dist/`. |
| `npm run preview` | Sirve localmente la salida generada por Vite. |

> ⚠️ Estado actual del repositorio: `index.html` no enlaza `index.tsx` mediante un `<script type="module">`. Por eso, aunque `npm run build` finaliza, la salida convencional de Vite contiene solo el documento HTML y no monta la aplicación React. La demo publicada sí responde, pero su proceso de despliegue no está versionado en este repositorio.

## Arquitectura

El proyecto es una aplicación React de una sola página y mantiene toda la partida en el cliente.

```text
index.tsx
└── App.tsx                    Estado y transiciones de la partida
    ├── components/            Pantallas de configuración, rol, debate y votación
    ├── constants.ts           Palabras, categorías y límites de jugadores
    └── utils/
        ├── wordSelector.ts    Selección e historial local de palabras
        ├── gemini.ts          Generación y validación de palabras con Gemini
        └── audio.ts           Efectos Web Audio y anuncios de voz con Gemini
```

`App.tsx` controla un flujo secuencial de fases: inicio → revelación de roles → debate → votación → resultado. No existe backend, autenticación ni comunicación en tiempo real dentro del código versionado.

## Stack verificado

- React 19
- TypeScript 5.8
- Vite 6
- Google Gen AI SDK
- Lucide React
- Tailwind CSS cargado desde CDN en `index.html`
- Web Audio API y `localStorage` del navegador

## Estado de calidad

- El repositorio no incluye pruebas automatizadas.
- No hay scripts de lint ni typecheck separados.
- No hay workflows de CI/CD ni configuración de despliegue versionada.
- `npm run build` finaliza, pero presenta la limitación del punto de entrada descrita arriba.

## Licencia

Este repositorio no incluye actualmente una licencia pública. El código permanece sujeto a los derechos de su autor; abrir el repositorio no concede por sí solo permiso para copiarlo, modificarlo o redistribuirlo.
