import { useMemo } from 'react'
import { parseISO, subDays, isAfter, isBefore } from 'date-fns'
import metricsJson from '@/data/metrics.json'
import { useDashboardStore, PRESET_DAYS } from '@/store/dashboardStore'
import type { Dataset, DayEntry, MetricMeta, MetricsData } from '@/types/metrics'

const data = metricsJson as unknown as MetricsData

export interface UseMetricsResult {
  dataset: Dataset
  metricsMeta: MetricMeta[]
  // Días dentro del rango activo (último día del dataset hacia atrás).
  rangeDays: DayEntry[]
  // Días del período inmediatamente anterior, mismo tamaño que rangeDays.
  // Lo usamos para calcular deltas en KPI cards.
  priorRangeDays: DayEntry[]
  rangeStart: Date
  rangeEnd: Date
}

export function useMetrics(): UseMetricsResult {
  const datasetKey = useDashboardStore((s) => s.datasetKey)
  const rangePreset = useDashboardStore((s) => s.rangePreset)

  return useMemo(() => {
    const dataset = data[datasetKey]
    const days = PRESET_DAYS[rangePreset]
    const rangeEnd = parseISO(dataset.metadata.end_date)
    const rangeStart = subDays(rangeEnd, days - 1)
    const priorEnd = subDays(rangeStart, 1)
    const priorStart = subDays(priorEnd, days - 1)

    const inRange = (d: DayEntry, start: Date, end: Date): boolean => {
      const date = parseISO(d.date)
      return !isBefore(date, start) && !isAfter(date, end)
    }

    const rangeDays = dataset.days.filter((d) => inRange(d, rangeStart, rangeEnd))
    const priorRangeDays = dataset.days.filter((d) => inRange(d, priorStart, priorEnd))

    return {
      dataset,
      metricsMeta: dataset.metadata.metrics,
      rangeDays,
      priorRangeDays,
      rangeStart,
      rangeEnd,
    }
  }, [datasetKey, rangePreset])
}
