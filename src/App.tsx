import type { JSX } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { Header } from '@/components/layout/Header'
import { FocusAlert } from '@/components/kpi/FocusAlert'
import { KPIGrid } from '@/components/kpi/KPIGrid'

function App(): JSX.Element {
  return (
    <PageShell>
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <FocusAlert />
        <KPIGrid />
        <div className="rounded-lg border border-dashed bg-card/50 p-8 text-center text-xs text-muted-foreground">
          Charts (PR #5) go here.
        </div>
      </main>
    </PageShell>
  )
}

export default App
