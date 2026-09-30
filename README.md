# Weather Render Lab

Taller de programación orientada a la web: **un solo caso de estudio (clima real de ocho ciudades colombianas) implementado con los cuatro patrones de renderizado**: CSR, SSR, SSG e ISR. Los datos vienen de [Open-Meteo](https://open-meteo.com), una API pública, gratuita y **sin API key**.

- Framework: **Next.js 15 (App Router)** con **React 19**
- Lenguaje: **TypeScript**
- Todo el código está en inglés; este README es la única parte en español.

## Los cuatro patrones

| Ruta | Patrón | Qué muestra | Cuándo se genera |
|---|---|---|---|
| `/csr/[city]` | Client-Side Rendering | Clima actual y pronóstico a 7 días | En el navegador, en cada visita (y cada 60 s) |
| `/ssr/[city]` | Server-Side Rendering | Clima actual y pronóstico a 7 días | En el servidor, en cada petición |
| `/ssg/[city]` | Static Site Generation | Clima mensual de 2025 (histórico) | Una sola vez, en el build |
| `/isr/[city]` | Incremental Static Regeneration | Clima actual y pronóstico a 7 días | En el build y luego en segundo plano, máximo cada 60 s |

El menú de la portada (`/`) lleva a cada patrón. Dentro de cada página hay pestañas para cambiar de patrón conservando la ciudad, y botones para cambiar de ciudad.

### Cómo se activa cada patrón en el código

- **CSR**: `src/components/CsrWeather.tsx` es un componente `'use client'` que llama a Open-Meteo con `useEffect`.
- **SSR**: `src/app/ssr/[city]/page.tsx` declara `export const dynamic = 'force-dynamic'` y la petición usa `cache: 'no-store'`.
- **SSG**: `src/app/ssg/[city]/page.tsx` usa `generateStaticParams`, `dynamic = 'force-static'` y `cache: 'force-cache'`.
- **ISR**: `src/app/isr/[city]/page.tsx` usa `export const revalidate = 60` y la petición usa `next: { revalidate: 60 }`.

## Requisitos y dependencias

- **Node.js 18.18 o superior** (recomendado 20 o 22) y **npm**
- Conexión a internet (para consultar Open-Meteo)

Dependencias (se instalan solas con `npm install`):

- `next`, `react`, `react-dom`
- Desarrollo: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

**Importante:** el modo `dev` no se comporta como producción (no cachea ni regenera igual y las métricas no son representativas). Para probar de verdad SSG e ISR y medir el rendimiento usa:

```bash
npm run build
npm start
```

## Cómo probar cada patrón

1. **Marca de tiempo**: cada página muestra "HTML generated". Recarga varias veces:
   - SSR cambia en cada recarga.
   - SSG nunca cambia hasta el próximo deploy.
   - ISR se mantiene igual hasta pasar 60 s; la primera visita después de ese tiempo sigue mostrando la versión vieja y la siguiente ya muestra la nueva.
   - CSR muestra la hora en que el navegador pidió los datos y se actualiza sola cada 60 s.
2. **Ver código fuente** (Ctrl+U): en SSR, SSG e ISR el clima aparece dentro del HTML; en CSR solo verás el mensaje de carga.
3. **Pestaña Network** de las DevTools: en CSR verás la llamada a `api.open-meteo.com` desde el navegador; en los demás no.
4. **Panel de métricas** al final de cada página: TTFB, FCP y LCP medidos con `PerformanceObserver`. Con `npm run build && npm start`, SSG e ISR suelen tener el menor TTFB, SSR el mayor, y CSR pinta rápido un esqueleto pero su LCP llega tarde porque espera los datos. Para verlo mejor, activa el throttling "Slow 4G" en DevTools.

Los enlaces entre patrones son `<a>` normales (no `<Link>`) para que cada visita sea una carga completa y las métricas sean reales.

## Subir a GitHub y desplegar en Vercel

```bash
git init
git add .
git commit -m "Weather Render Lab"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/weather-render-lab.git
git push -u origin main
```

Luego en [vercel.com](https://vercel.com): **Add New > Project**, importa el repositorio y pulsa **Deploy**. Vercel detecta Next.js solo, no necesitas variables de entorno. ISR funciona de forma nativa en Vercel.

## Estructura del proyecto

```
src/
  app/            Rutas (layout, portada y una carpeta por patrón) y estilos globales
  components/     Vistas: WeatherDashboard, ClimateChart, PageFrame, MetricsPanel, CsrWeather, ServerView
  config/         Ciudades y descripción de cada patrón
  domain/         Tipos del dominio y códigos del clima
  lib/            Utilidades de formato
  services/       Acceso a datos (ver patrones de diseño)
```

## Arquitectura y patrones de diseño

- **Facade**: `WeatherService` expone `getSnapshot` y `getClimate` y oculta las llamadas HTTP.
- **Adapter**: `WeatherMapper` convierte las respuestas crudas de Open-Meteo a los modelos del dominio.
- **Strategy**: `fetch-strategies.ts` define cómo cachea sus peticiones cada patrón de renderizado.
- **Factory**: `createWeatherService(pattern)` arma el servicio con la estrategia correcta.
- **Cliente HTTP**: `HttpClient` y `OpenMeteoClient` separan el transporte de la construcción de URLs.

## Endpoints de Open-Meteo usados

- `https://api.open-meteo.com/v1/forecast` (clima actual y pronóstico)
- `https://air-quality-api.open-meteo.com/v1/air-quality` (calidad del aire)
- `https://archive-api.open-meteo.com/v1/archive` (histórico de 2025)

## Notas y limitaciones

- Open-Meteo es gratuito para uso no comercial y pide atribución (CC BY 4.0); ya aparece en el pie de página.
- La página SSG queda "congelada" con lo que respondió la API durante el build. Si la API falla justo en ese momento, verás un aviso de error hasta el siguiente deploy.
- La calidad del aire es opcional: si esa consulta falla, el resto de la página se muestra igual.
