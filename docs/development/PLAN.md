# palvi-sales-dashboard — Plan de desarrollo

Documento de trabajo usado durante la implementación de la tarea técnica de PALVI.
Se conserva en `docs/development/` para dejar trazabilidad del razonamiento, alcance y decisiones de
descomposición. No forma parte de la aplicación en runtime.

El objetivo del producto final es que el Jefe de Ventas abra el dashboard en la mañana y sepa en 5
minutos dónde poner el foco.

---

## Stack

| Capa          | Tecnología                | Por qué                                                   |
| ------------- | ------------------------- | --------------------------------------------------------- |
| Build         | Vite + React + TypeScript | Setup rápido, HMR veloz, estándar industria               |
| UI            | shadcn/ui + Tailwind CSS  | Profesional de entrada, muy usado en SaaS                 |
| Charting      | Recharts                  | Composable, TypeScript-first, ideal para series de tiempo |
| Estado global | Zustand                   | Minimalista, suficiente para dataset activo + filtros     |
| Fechas        | date-fns                  | Tree-shakeable, sin overengineering                       |
| Linting       | ESLint + Prettier         | Repo limpio desde el día 1                                |

---

## Estructura final de carpetas

```
src/
├── components/
│   ├── ui/              ← shadcn components (auto-generados)
│   ├── layout/          ← Header, PageShell, DashboardFooter
│   ├── kpi/             ← KPICard, KPIGrid, FocusAlert
│   ├── charts/          ← FunnelChart, ExecutiveTrendChart, TimeSeriesChart
│   └── dataset/         ← DatasetSwitcher (tabs A/B/C/D)
├── hooks/
│   ├── useMetrics.ts    ← acceso al dataset activo
│   ├── useAggregates.ts ← cálculo de win rate, funnel y métricas agregadas
│   └── useTheme.ts      ← tema claro/oscuro
├── store/
│   └── dashboardStore.ts ← Zustand: dataset activo, rango de fechas
├── types/
│   └── metrics.ts       ← todos los tipos TypeScript del dataset
├── lib/
│   ├── utils.ts         ← cn() helper
│   ├── ui.ts            ← clases compartidas de superficies/cards
│   ├── format.ts        ← formato de valores, porcentajes y semántica de mejora
│   └── analytics.ts     ← lógica de detección de alertas / foco del día
├── data/
│   └── metrics.json     ← dataset original (4 datasets: A, B, C, D)
├── App.tsx
├── main.tsx
└── index.css
```

---

## Estado final

La implementación final consolidó los PRs planeados en una sola entrega:

- App Vite + React + TypeScript.
- Dataset switcher A/B/C/D.
- Presets 7d/30d/90d comparados contra el período anterior.
- Resumen ejecutivo con top deterioros por `direction`.
- KPI cards con color semántico.
- Embudo con volumen y conversión por etapa.
- Tendencia principal con mini charts separados para evitar doble eje.
- i18n ES/EN.
- Tema claro/oscuro.
- Footer con rango exacto y crédito del creador.

## PRs — Orden de trabajo original

### PR #1 — Setup inicial

**Rama:** `feat/project-setup`

- [ ] Vite + React + TypeScript
- [ ] Tailwind CSS configurado con DM Sans
- [ ] shadcn/ui inicializado
- [ ] ESLint + Prettier configurados
- [ ] `src/types/metrics.ts` con todos los tipos (incluir nullables)
- [ ] `src/lib/utils.ts` con helper `cn()`
- [ ] `src/data/metrics.json` copiado al proyecto
- [ ] `App.tsx` limpio con placeholder
- [ ] README esqueleto

**Commit:** `chore: initial project setup with Vite + React + TS`

---

### PR #2 — Data layer

**Rama:** `feat/data-layer`

- [ ] `src/store/dashboardStore.ts` — Zustand con dataset activo (`'A' | 'B' | 'C' | 'D'`) y rango de fechas
- [ ] `src/hooks/useMetrics.ts` — devuelve los días filtrados del dataset activo
- [ ] `src/hooks/useAggregates.ts` — calcula:
  - Win rate: `sum(deals_won) / sum(deals_won + deals_lost)`
  - Funnel rates: tráfico→leads, leads→leads_qualified, leads_qualified→deals, deals→deals_won
  - Rolling 7d para métricas clave
  - Manejo correcto de nulls en `avg_response_time_min`, `avg_deal_cycle_days`, `support_avg_resolution_hours`
- [ ] `src/lib/analytics.ts` — algoritmo "Foco del día":
  - Compara última semana vs semana anterior por métrica
  - Pondera por `direction` (higher/lower is better)
  - Devuelve top 2-3 métricas más deterioradas

**Commit:** `feat: data layer, zustand store and analytics engine`

---

### PR #3 — Layout principal + selector de dataset

**Rama:** `feat/shell-layout`

- [ ] Header fijo con tabs A / B / C / D
- [ ] Selector de rango de fechas (últimos 7d / 30d / 90d / custom)
- [ ] Grid responsivo para cards y gráficos
- [ ] PageShell que envuelve todo el contenido

**Commit:** `feat: shell layout and dataset switcher`

---

### PR #4 — KPI cards + alertas inteligentes

**Rama:** `feat/kpi-cards`

- [ ] `KPICard` — valor actual, delta vs período anterior, color semántico por `direction`
- [ ] `KPIGrid` — grid de las 6 métricas principales
- [ ] `FocusAlert` — bloque "Foco del día" con top 2-3 métricas críticas detectadas por `analytics.ts`
- [ ] Colores: verde = tendencia positiva, rojo/naranja = alerta, gris = neutral

**Commit:** `feat: KPI cards and focus alerts`

---

### PR #5 — Visualizaciones

**Rama:** `feat/charts`

- [ ] `FunnelChart` — tráfico → leads → leads_qualified → deals → deals_won (horizontal, con tasas de conversión entre pasos)
- [ ] `TimeSeriesChart` — línea para cualquier métrica, reutilizable, nulls filtrados silenciosamente
- [ ] `StaleDealsList` — métrica puntual con tendencia
- [ ] Tooltips con valores exactos y unidades
- [ ] Todos los gráficos responden correctamente al cambio de dataset

**Commit:** `feat: funnel chart, time series and stale deals`

---

### PR #6 — Polish + README final

**Rama:** `feat/polish`

- [ ] Responsive en mobile
- [ ] Empty states cuando no hay datos en el rango
- [ ] Loading skeleton en carga inicial
- [ ] README completo (decisiones técnicas + segunda iteración)
- [ ] Verificar que los 4 datasets (A, B, C, D) producen resultados visualmente distintos
- [ ] Verificar que nulls no rompen ningún gráfico

**Commit:** `docs: complete README and final polish`

---

## Diseño UX — Principios

**Jerarquía de información:**

1. Alertas / Foco del día (arriba, prominente)
2. KPI cards con deltas (centro)
3. Funnel de conversión
4. Series de tiempo detalladas
5. Stale deals

**Paleta:** fondo gris muy claro (#F9FAFB), cards blancas, azul SaaS para acentos, verde semántico para positivo, rojo/naranja para alerta.

**Tipografía:** DM Sans — limpia, moderna, legible a tamaños pequeños.

---

## Lo que NO hacer

- No poner el logo de PALVI (no hay permiso de uso de marca)
- No mostrar todos los datos igual de prominentes — hay jerarquía
- No romper con nulls — filtrarlos silenciosamente en todos los gráficos
- No hardcodear un solo dataset — todos los cálculos deben reaccionar al dataset activo

---

## README final — Estructura (para PR #6)

```
# palvi-sales-dashboard

## Decisiones técnicas
...

## Segunda iteración
...

## Cómo correrlo localmente
npm install
npm run dev
```
