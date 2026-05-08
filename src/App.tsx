import type { JSX } from 'react'
import { ExecutiveTrendChart } from '@/components/charts/ExecutiveTrendChart'
import { FunnelChart } from '@/components/charts/FunnelChart'
import { DashboardFooter } from '@/components/layout/DashboardFooter'
import { Header } from '@/components/layout/Header'
import { PageShell } from '@/components/layout/PageShell'
import { FocusAlert } from '@/components/kpi/FocusAlert'
import { KPIGrid } from '@/components/kpi/KPIGrid'

function App(): JSX.Element {
  return (
    <PageShell>
      <Header />
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-3 px-4 py-3 md:px-6 lg:min-h-0 lg:overflow-y-auto lg:py-4">
        <FocusAlert />
        <KPIGrid />
        <div className="grid min-h-0 grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
          <FunnelChart />
          <ExecutiveTrendChart />
        </div>
      </main>
      <DashboardFooter />
    </PageShell>
  )
}

export default App
