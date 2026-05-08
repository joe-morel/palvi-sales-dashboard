import { useMemo } from 'react'
import { aggregate } from '@/lib/aggregators'
import { useMetrics } from './useMetrics'
import type { DayMetrics, MetricMeta } from '@/types/metrics'

export interface MetricAggregate {
  meta: MetricMeta
  current: number | null
  prior: number | null
  // Variación porcentual cruda. NO ajustada por direction — eso lo decide
  // quien renderice (la KPI card sabe colorear según su propio direction).
  rawChange: number | null
}

export interface FunnelStep {
  // Nombre del paso del embudo (lo que ven los visitantes).
  label: string
  // Total absoluto del paso (suma sobre el período).
  value: number
  // Tasa de conversión de este paso desde el anterior. null en el primero.
  rateFromPrev: number | null
}

export interface UseAggregatesResult {
  metrics: MetricAggregate[]
  funnel: FunnelStep[]
  winRate: number | null
  // Cambio porcentual del win rate vs período anterior. null si alguno
  // de los dos es null o si el anterior es 0.
  winRateChange: number | null
}

const METRIC_KEYS: (keyof DayMetrics)[] = [
  'traffic',
  'leads_created',
  'leads_qualified',
  'deals_created',
  'deals_won',
  'deals_lost',
  'avg_response_time_min',
  'avg_deal_cycle_days',
  'stale_deals',
  'support_tickets_opened',
  'support_avg_resolution_hours',
]

function safeRatio(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator === 0) return null
  return numerator / denominator
}

export function useAggregates(): UseAggregatesResult {
  const { metricsMeta, rangeDays, priorRangeDays } = useMetrics()

  return useMemo(() => {
    const metaByKey = new Map(metricsMeta.map((m) => [m.key, m]))

    const metrics: MetricAggregate[] = METRIC_KEYS.flatMap((key) => {
      const meta = metaByKey.get(key)
      if (!meta) return []
      const current = aggregate(rangeDays, key)
      const prior = aggregate(priorRangeDays, key)
      const rawChange =
        current === null || prior === null || prior === 0
          ? null
          : (current - prior) / prior
      return [{ meta, current, prior, rawChange }]
    })

    // Embudo: tráfico → leads → leads calificados → deals → deals ganados.
    // Cada paso es la suma del período. Usamos aggregate() por consistencia
    // (todas estas son métricas 'sum').
    const traffic = aggregate(rangeDays, 'traffic')
    const leadsCreated = aggregate(rangeDays, 'leads_created')
    const leadsQualified = aggregate(rangeDays, 'leads_qualified')
    const dealsCreated = aggregate(rangeDays, 'deals_created')
    const dealsWon = aggregate(rangeDays, 'deals_won')
    const dealsLost = aggregate(rangeDays, 'deals_lost')

    const funnel: FunnelStep[] = [
      { label: 'Traffic', value: traffic ?? 0, rateFromPrev: null },
      { label: 'Leads', value: leadsCreated ?? 0, rateFromPrev: safeRatio(leadsCreated, traffic) },
      {
        label: 'Qualified',
        value: leadsQualified ?? 0,
        rateFromPrev: safeRatio(leadsQualified, leadsCreated),
      },
      {
        label: 'Deals',
        value: dealsCreated ?? 0,
        rateFromPrev: safeRatio(dealsCreated, leadsQualified),
      },
      {
        label: 'Won',
        value: dealsWon ?? 0,
        rateFromPrev: safeRatio(dealsWon, dealsCreated),
      },
    ]

    // Win rate del período: ganados / (ganados + perdidos).
    // Métrica de período, no de cohorte — lo dice el brief explícitamente.
    const closed =
      dealsWon !== null && dealsLost !== null ? dealsWon + dealsLost : null
    const winRate = safeRatio(dealsWon, closed)

    // Mismo cálculo sobre el período anterior, para mostrar delta en KPI card.
    const priorDealsWon = aggregate(priorRangeDays, 'deals_won')
    const priorDealsLost = aggregate(priorRangeDays, 'deals_lost')
    const priorClosed =
      priorDealsWon !== null && priorDealsLost !== null
        ? priorDealsWon + priorDealsLost
        : null
    const priorWinRate = safeRatio(priorDealsWon, priorClosed)
    const winRateChange =
      winRate === null || priorWinRate === null || priorWinRate === 0
        ? null
        : (winRate - priorWinRate) / priorWinRate

    return { metrics, funnel, winRate, winRateChange }
  }, [metricsMeta, rangeDays, priorRangeDays])
}
