import type { JSX } from 'react'
import { useAggregates } from '@/hooks/useAggregates'
import { METRIC_TITLE_KEY } from '@/i18n/translations'
import { useLanguage } from '@/i18n/useLanguage'
import { formatPercent } from '@/lib/format'
import type { DayMetrics } from '@/types/metrics'
import { KPICard } from './KPICard'

const METRIC_KEYS: (keyof DayMetrics)[] = ['leads_created', 'avg_response_time_min', 'stale_deals']

export function KPIGrid(): JSX.Element {
  const { t } = useLanguage()
  const { metrics, winRate, winRateChange } = useAggregates()
  const byKey = new Map(metrics.map((m) => [m.meta.key, m]))

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        label={t('metricWinRate')}
        value={winRate}
        unit="ratio"
        rawChange={winRateChange}
        direction="higher_is_better"
        format={formatPercent}
      />
      {METRIC_KEYS.map((key) => {
        const m = byKey.get(key)
        if (!m) return null
        return (
          <KPICard
            key={key}
            label={t(METRIC_TITLE_KEY[key])}
            value={m.current}
            unit={m.meta.unit}
            rawChange={m.rawChange}
            direction={m.meta.direction}
          />
        )
      })}
    </div>
  )
}
