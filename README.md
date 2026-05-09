# palvi-sales-dashboard

## Decisiones técnicas

Construí **Sales Pulse** como un reporte ejecutivo para que un Jefe de Ventas pueda abrir la app en la mañana y entender, en pocos minutos, dónde poner foco. La interfaz prioriza un resumen accionable, cuatro KPIs principales, salud del embudo y una tendencia comercial; no intenta mostrar todas las métricas con el mismo peso.

Para correrlo localmente: `npm install` y luego `npm run dev`.

Elegí **Vite + React + TypeScript** porque el problema es principalmente client-side: cargar `metrics.json`, cambiar entre datasets A/B/C/D y transformar series diarias en señales de negocio. La app no necesita backend ni SSR para este alcance.

La capa de datos está separada de la UI. `useMetrics` toma el dataset activo y el rango seleccionado (`7d`, `30d`, `90d`) y calcula el período actual y el período anterior usando `metadata.end_date`, no la fecha real del sistema. Esto hace que los resultados sean deterministas aunque la app se abra después.

La agregación vive en `src/lib/aggregators.ts`. Cada métrica tiene una estrategia explícita: `sum` para métricas acumulables como tráfico, leads y deals; `avg` para tiempos promedio filtrando valores `null`; y `last` para snapshots como `stale_deals`. Esto evita tratar todas las métricas como si fueran del mismo tipo.

El foco ejecutivo vive en `src/lib/analytics.ts`: compara la última semana contra la semana anterior y usa `direction` para saber si un cambio representa mejora o deterioro. Por eso la flecha muestra el movimiento real del dato, mientras el color comunica si ese movimiento es bueno o malo para el negocio.

Usé **Zustand** solo para estado compartido mínimo del dashboard: dataset activo y rango seleccionado. No era estrictamente necesario, pero evita prop drilling entre controles, hooks de cálculo y visualizaciones. La traducción ES/EN está separada en un `LanguageProvider` propio con `localStorage`, sin instalar una librería pesada de i18n.

En UI usé **Tailwind + shadcn/ui** para mantener una base visual consistente y **Recharts** para las series. El embudo es HTML custom porque necesitaba mostrar volumen y conversión entre etapas de forma más directa que con un gráfico genérico. La pantalla está diseñada como un briefing ejecutivo above-the-fold: en desktop debe verse el resumen completo sin depender de scroll para entender el estado general.

## Segunda iteración

Agregaría tests unitarios para `aggregators.ts`, `analytics.ts` y `format.ts`, porque ahí vive la lógica más crítica: manejo de `null`, cálculo de períodos, win rate y lectura semántica de `direction`.

También agregaría una verificación e2e simple para recorrer A/B/C/D y confirmar que los valores, insights y visualizaciones cambian correctamente sin romper el layout.

Para una versión de producción evaluaría optimizar el bundle separando Recharts con dynamic import, agregar objetivos o benchmarks configurables por métrica y permitir rangos de fecha personalizados. Mantendría esas mejoras fuera de esta entrega porque el foco de la tarea es claridad ejecutiva y toma de decisión rápida, no cantidad de features.
