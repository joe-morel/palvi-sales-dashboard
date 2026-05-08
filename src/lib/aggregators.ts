import type { DayEntry, DayMetrics } from '@/types/metrics'

export type AggregationStrategy = 'sum' | 'avg' | 'last'

// Cómo se colapsa cada métrica sobre un período.
// - sum:  cantidades acumulables (tráfico, leads, deals, tickets abiertos)
// - avg:  promedios diarios — el promedio del período es el promedio de los promedios diarios
// - last: snapshots al cierre del día (stale_deals es un conteo, no un flujo)
export const aggregationByMetric: Record<keyof DayMetrics, AggregationStrategy> = {
  traffic: 'sum',
  leads_created: 'sum',
  leads_qualified: 'sum',
  deals_created: 'sum',
  deals_won: 'sum',
  deals_lost: 'sum',
  support_tickets_opened: 'sum',
  avg_response_time_min: 'avg',
  avg_deal_cycle_days: 'avg',
  support_avg_resolution_hours: 'avg',
  stale_deals: 'last',
}

export function aggregate(days: DayEntry[], key: keyof DayMetrics): number | null {
  if (days.length === 0) return null

  const strategy = aggregationByMetric[key]
  const values = days
    .map((d) => d.metrics[key])
    .filter((v): v is number => v !== null)

  if (values.length === 0) return null

  switch (strategy) {
    case 'sum':
      return values.reduce((acc, v) => acc + v, 0)
    case 'avg':
      return values.reduce((acc, v) => acc + v, 0) / values.length
    case 'last':
      return values[values.length - 1]
  }
}
