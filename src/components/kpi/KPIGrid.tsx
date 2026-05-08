import type { JSX } from 'react'
import { useAggregates } from '@/hooks/useAggregates'
import { KPICard } from './KPICard'
import { formatPercent } from '@/lib/format'
import type { DayMetrics } from '@/types/metrics'

// Las 6 métricas que ve primero el Jefe de Ventas. Cobertura:
// - traffic           → top of funnel
// - leads_qualified   → mid funnel (calidad de demanda)
// - deals_won         → bottom (resultado)
// - win_rate          → headline de conversión (sintético, no en metricsMeta)
// - avg_response_time_min → driver operacional crítico en B2B
// - stale_deals       → salud del pipeline
const SHOWN_KEYS: (keyof DayMetrics)[] = [
  'traffic',
  'leads_qualified',
  'deals_won',
  'avg_response_time_min',
  'stale_deals',
]

export function KPIGrid(): JSX.Element {
  const { metrics, winRate, winRateChange } = useAggregates()
  const byKey = new Map(metrics.map((m) => [m.meta.key, m]))

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SHOWN_KEYS.map((key) => {
        const m = byKey.get(key)
        if (!m) return null
        return (
          <KPICard
            key={key}
            label={m.meta.label}
            value={m.current}
            unit={m.meta.unit}
            rawChange={m.rawChange}
            direction={m.meta.direction}
          />
        )
      })}
      <KPICard
        label="Win rate"
        value={winRate}
        unit="ratio"
        rawChange={winRateChange}
        direction="higher_is_better"
        format={formatPercent}
      />
    </div>
  )
}
