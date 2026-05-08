import type { JSX } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { Header } from '@/components/layout/Header'
import { FocusAlert } from '@/components/kpi/FocusAlert'
import { KPIGrid } from '@/components/kpi/KPIGrid'
import { FunnelChart } from '@/components/charts/FunnelChart'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { useMetrics } from '@/hooks/useMetrics'
import type { DayMetrics } from '@/types/metrics'

// Las 4 series temporales que cuentan la "historia" del período:
// top funnel, bottom funnel, driver operacional, salud del pipeline.
const TIME_SERIES: { key: keyof DayMetrics; color: `--chart-${1 | 2 | 3 | 4}` }[] = [
  { key: 'traffic', color: '--chart-1' },
  { key: 'deals_won', color: '--chart-2' },
  { key: 'avg_response_time_min', color: '--chart-3' },
  { key: 'stale_deals', color: '--chart-4' },
]

function App(): JSX.Element {
  const { metricsMeta } = useMetrics()
  const metaByKey = new Map(metricsMeta.map((m) => [m.key, m]))

  return (
    <PageShell>
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <FocusAlert />
        <KPIGrid />
        <FunnelChart />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {TIME_SERIES.map(({ key, color }) => {
            const meta = metaByKey.get(key)
            if (!meta) return null
            return (
              <TimeSeriesChart
                key={key}
                metricKey={key}
                meta={meta}
                colorVar={color}
              />
            )
          })}
        </div>
      </main>
    </PageShell>
  )
}

export default App
