# palvi-sales-dashboard

## Decisiones técnicas

Construí un dashboard ejecutivo para que un Jefe de Ventas pueda abrirlo en la mañana y entender en
menos de 5 minutos dónde poner foco. La app corre con React + TypeScript sobre Vite; para levantarla
localmente: `npm install` y luego `npm run dev`.

La lectura de datos está anclada a `metadata.end_date` de cada dataset, no a la fecha real del sistema.
Esto hace que A/B/C/D sean deterministas y comparables aunque el dashboard se abra meses después. El
estado global es mínimo y vive en Zustand: dataset activo y rango (`7d`, `30d`, `90d`).

La lógica de agregación está centralizada en `src/lib/aggregators.ts`: métricas acumulables usan
`sum`, promedios diarios usan `avg` filtrando `null`, y snapshots como `stale_deals` usan `last`.
El foco ejecutivo se calcula en `src/lib/analytics.ts`, comparando la última semana contra la anterior
y ajustando el deterioro según `direction`. Por eso una métrica `lower_is_better` puede subir y verse
roja: la flecha muestra movimiento real, el color muestra si eso mejora o empeora.

En UI prioricé claridad antes que cantidad: resumen ejecutivo con recomendaciones, cuatro KPIs clave,
embudo de conversión y tendencia principal. Separé la tendencia en mini-gráficos para evitar un doble
eje confuso, e hice el embudo en HTML custom para mostrar volumen y conversión por etapa de forma más
directa que con un chart genérico. La interfaz soporta ES/EN y tema claro/oscuro con tokens compartidos.

Detalle de implementación:

- **i18n ligero (ES/EN).** Context + `translations.ts` sin i18next; idioma en `localStorage`
  (`sales-pulse-lang`), `document.documentElement.lang`, etiquetas de métricas y recomendaciones de foco
  centralizadas para evitar mezcla ES/EN en UI.
- **UI ejecutiva “Sales Pulse”.** Gradiente de fondo suave, primario índigo, hero de resumen con hasta 3
  insights y recomendación por `metricKey`, 4 KPIs (win rate, leads creados, tiempo de respuesta, deals
  estancados), embudo con pasos i18n por `FunnelStepKey`, tendencia combinada leads + deals ganados (eje
  dual).
- **Tailwind v4 + shadcn/ui (style `base-nova`).** Tokens `oklch` + utilities atómicas.
- **Zustand** para `datasetKey` y `rangePreset`.
- **Recharts para series; embudo en HTML custom** para tasas entre pasos.
- **“Hoy” = `dataset.metadata.end_date`, no `new Date()`.**
- **Agregación declarativa por métrica** ([`src/lib/aggregators.ts`](src/lib/aggregators.ts)).
- **Foco del día:** `signedChange` para ordenar, `rawChange` para mostrar
  ([`src/lib/analytics.ts`](src/lib/analytics.ts)).
- **Tipos** reflejan nulls del brief; `aggregate()` los filtra.

## Segunda iteración

Agregaría tests unitarios para `aggregators.ts` y `analytics.ts`, porque ahí vive la lógica más crítica:
comparaciones de período, nulls y semántica de `direction`. También sumaría un test visual o e2e básico
para recorrer A/B/C/D y verificar que los datos cambian sin romper el layout.

Para producción real, optimizaría el bundle separando Recharts con dynamic import, ya que hoy Vite avisa
que el chunk supera 500 kB. También exploraría un selector de métrica en tendencia, pero solo como capa
secundaria: para el uso de 5 minutos, mantener pocas señales visibles ayuda más que mostrar las 11
métricas al mismo tiempo.

Finalmente, evaluaría un rango custom de fechas y benchmarks por objetivo comercial. Los presets actuales
son suficientes para la tarea, pero un equipo real podría querer comparar campañas, lanzamientos o semanas
fiscales específicas.

Otras líneas posibles: date range picker arbitrario, rolling 7d en series, más cobertura de tests y
auditoría a11y con axe.
