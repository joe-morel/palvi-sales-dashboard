# CLAUDE.md — Contexto para Claude Code

Este archivo es leído automáticamente por Claude Code al abrir el proyecto.
No modificar sin revisar el PLAN.md primero.

---

## Qué es este proyecto

Dashboard ejecutivo de métricas B2B SaaS construido como tarea técnica para PALVI.
Usuario objetivo: Jefe de Ventas, 5 minutos disponibles en la mañana, necesita saber dónde poner el foco hoy.

---

## Stack

- **Vite + React + TypeScript** — build tool y framework
- **Tailwind CSS + shadcn/ui** — estilos y componentes
- **Recharts** — gráficos (series de tiempo, funnel)
- **Zustand** — estado global (dataset activo, rango de fechas)
- **date-fns** — manipulación de fechas
- **ESLint + Prettier** — linting y formato

---

## Reglas del proyecto

### TypeScript

- Strict mode activado — no usar `any`
- Todos los tipos viven en `src/types/metrics.ts`
- Importar tipos con `import type { ... }`

### Estilo de código

- Sin punto y coma
- Comillas simples
- 2 espacios de indentación
- Trailing commas en ES5
- Máximo 100 caracteres por línea

### Datos

- El dataset vive en `src/data/metrics.json`
- Tiene 4 sub-datasets: A, B, C, D — misma estructura, comportamiento diferente
- `avg_response_time_min`, `avg_deal_cycle_days`, `support_avg_resolution_hours` pueden ser `null`
- **Nunca mostrar null en la UI** — filtrar silenciosamente antes de graficar
- El dataset activo se maneja en `src/store/dashboardStore.ts`

### Componentes

- Un componente por archivo
- Nombre del archivo = nombre del componente (PascalCase)
- Props siempre tipadas con `interface`, no `type`
- No usar `React.FC` — usar función normal con return type explícito

### Git

- Commits en inglés, formato convencional: `feat:`, `fix:`, `chore:`, `docs:`
- Una rama por PR: `feat/nombre-descriptivo`
- No commitear a `main` directamente

---

## Estructura de carpetas

```
src/
├── components/
│   ├── ui/              ← shadcn (no editar manualmente)
│   ├── layout/          ← Header, PageShell
│   ├── kpi/             ← KPICard, KPIGrid, FocusAlert
│   ├── charts/          ← FunnelChart, TimeSeriesChart
│   └── dataset/         ← DatasetSwitcher
├── hooks/
│   ├── useMetrics.ts    ← datos del dataset activo filtrados por rango
│   └── useAggregates.ts ← win rate, funnel rates, rolling avg
├── store/
│   └── dashboardStore.ts
├── types/
│   └── metrics.ts       ← fuente única de verdad de tipos
├── lib/
│   ├── utils.ts         ← cn() de shadcn
│   └── analytics.ts     ← lógica "Foco del día"
└── data/
    └── metrics.json
```

---

## Tipos clave (referencia rápida)

```typescript
type DatasetKey = 'A' | 'B' | 'C' | 'D'
type MetricDirection = 'higher_is_better' | 'lower_is_better'

interface DayMetrics {
  traffic: number
  leads_created: number
  leads_qualified: number
  deals_created: number
  deals_won: number
  deals_lost: number
  avg_response_time_min: number | null
  avg_deal_cycle_days: number | null
  stale_deals: number
  support_tickets_opened: number
  support_avg_resolution_hours: number | null
}
```

---

## Lógica de negocio importante

### Win rate

```
sum(deals_won) / sum(deals_won + deals_lost)
```

Calculado sobre el rango de fechas seleccionado. No es tasa de cohorte.

### Funnel rates

```
lead rate         = leads_created / traffic
qualification rate = leads_qualified / leads_created
deal rate         = deals_created / leads_qualified
win rate          = deals_won / (deals_won + deals_lost)
```

### Algoritmo "Foco del día" (src/lib/analytics.ts)

- Comparar última semana vs semana anterior para cada métrica
- Calcular variación porcentual
- Ajustar signo según `direction`: si `lower_is_better` y subió → es malo
- Ordenar por deterioro y retornar top 2-3
- Si no hay suficientes datos → retornar array vacío (no romper)

---

## Estado del proyecto

Ver PLAN.md para el detalle completo de cada PR.

PRs planificados:

1. `feat/project-setup` — setup inicial ✅ (empezar aquí)
2. `feat/data-layer` — tipos, hooks, zustand, analytics
3. `feat/shell-layout` — layout y selector de dataset
4. `feat/kpi-cards` — KPI cards y alertas
5. `feat/charts` — funnel y series de tiempo
6. `feat/polish` — responsive, empty states, README final

---

## Qué NO hacer

- No usar `any` en TypeScript
- No hardcodear el dataset — siempre leer del store
- No mostrar valores null — filtrar antes de renderizar
- No poner el logo de PALVI
- No commitear directamente a `main`
- No crear componentes dentro de otros archivos de componentes
