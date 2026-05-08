# palvi-sales-dashboard

Dashboard ejecutivo para un Jefe de Ventas B2B SaaS. Lee `src/data/metrics.json` (4 datasets A/B/C/D, 365 días cada uno) y muestra en una pantalla dónde poner foco hoy: foco del día, KPI cards con delta vs período anterior, funnel de conversión y series temporales.

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # bundle de producción en dist/
```

## Decisiones técnicas

- **i18n ligero (ES/EN).** Context + `translations.ts` sin i18next; idioma en `localStorage` (`sales-pulse-lang`), `document.documentElement.lang`, etiquetas de métricas y recomendaciones de foco centralizadas para evitar mezcla ES/EN en UI.
- **UI ejecutiva “Sales Pulse”.** Gradiente de fondo suave, primario índigo, hero de resumen con hasta 3 insights y recomendación por `metricKey`, 4 KPIs (win rate, leads creados, tiempo de respuesta, deals estancados), embudo con pasos i18n por `FunnelStepKey`, tendencia combinada leads + deals ganados (eje dual).
- **Tailwind v4 + shadcn/ui (style `base-nova`).** shadcn 4 ya defaultea a Tailwind v4 — pelearle a la herramienta consume tiempo que no agrega valor. Tokens `oklch` + utilities atómicas dejan UI rápida y theme-aware sin construir un design system propio.
- **Zustand** para `datasetKey` y `rangePreset`. El selector vive en el header y los consumidores en el body — Context implicaría prop-drilling o un Provider extra; Redux es overkill para 2 piezas de estado.
- **Recharts solo para time series; Funnel custom HTML.** El componente `FunnelChart` de Recharts no controla bien las tasas de conversión entre pasos. 5 barras proporcionales con tasas anotadas debajo cubren mejor el caso y pesan menos.
- **"Hoy" = `dataset.metadata.end_date`, no `new Date()`.** El dataset cubre `2025-04-26 → 2026-04-25`; usar la fecha real del sistema dejaría los últimos días en blanco según cuándo se abra el dashboard. Anclar a `end_date` lo hace determinista por dataset.
- **Estrategia de agregación declarativa por métrica** ([`src/lib/aggregators.ts`](src/lib/aggregators.ts)): counts → `sum`, promedios diarios → `avg` (filtrando nulls), snapshots como `stale_deals` → `last`. La intención queda en datos, no escondida en `if/else`.
- **Foco del día: `signedChange` para ordenar, `rawChange` para mostrar.** [`src/lib/analytics.ts`](src/lib/analytics.ts) ajusta el signo según `direction` (subir el tiempo de respuesta es malo), ordena por deterioro y devuelve top-3. El display usa el cambio crudo — el banner rojo ya transmite "esto es malo", el porcentaje natural es más legible.
- **Tipos reflejan el contrato del brief, no el sample.** El dataset entregado no trae nulls, pero el brief dice que pueden existir; los tipos los marcan `number | null` y `aggregate()` los filtra.

## Segunda iteración

- **Custom date range picker** + comparación entre períodos arbitrarios. Hoy hay solo presets (7d/30d/90d), suficiente para una mañana de Sales Manager pero no para un análisis post-mortem.
- **Rolling 7d** en las time series para suavizar ruido y revelar tendencia. Iba en el plan original pero el shape correcto se decide mejor con la API de Recharts a la mano.
- **Code splitting de Recharts** (~700KB del bundle de 1MB). Para producción real, dynamic import + Suspense en los charts.
- **Selector de métrica** en las time series. Ahora muestro 4 hardcodeadas (traffic, deals_won, response time, stale_deals); un selector dejaría al usuario explorar las 11 sin tocar código.
- **Tests** — Vitest unit para `analytics`/`aggregators` (la lógica del walk-through es donde más vale tests), Playwright e2e contra los 4 datasets. El brief no los pide y los tipos cubren mucho, pero un PR review serio los esperaría.
- **Polish** — auditoría de a11y con axe; dark mode alineado a los nuevos tokens; code-splitting de Recharts para el chunk >500KB.
