import type { JSX } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { Header } from '@/components/layout/Header'
import { useMetrics } from '@/hooks/useMetrics'
import { useDashboardStore } from '@/store/dashboardStore'

function App(): JSX.Element {
  const datasetKey = useDashboardStore((s) => s.datasetKey)
  const rangePreset = useDashboardStore((s) => s.rangePreset)
  const { rangeDays, rangeStart, rangeEnd } = useMetrics()

  return (
    <PageShell>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Dataset{' '}
          <span className="font-semibold text-foreground">{datasetKey}</span> ·
          range{' '}
          <span className="font-semibold text-foreground">{rangePreset}</span> ·{' '}
          {rangeDays.length} days ({rangeStart.toISOString().slice(0, 10)} →{' '}
          {rangeEnd.toISOString().slice(0, 10)})
          <p className="mt-2 text-xs">
            KPI cards (PR #4) and charts (PR #5) go here.
          </p>
        </div>
      </main>
    </PageShell>
  )
}

export default App
