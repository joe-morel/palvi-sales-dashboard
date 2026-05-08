import type { JSX } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useAggregates } from '@/hooks/useAggregates'
import { formatPercent } from '@/lib/format'

// Render custom (no Recharts) — para 5 pasos con tasas de conversión explícitas
// entre cada uno, un funnel HTML controla mejor la jerarquía visual.
// Cada barra tiene ancho proporcional al valor, normalizado al primer paso.
export function FunnelChart(): JSX.Element {
  const { funnel } = useAggregates()
  const max = funnel[0]?.value ?? 0

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Conversion funnel
          </h3>
          <span className="text-xs text-muted-foreground">
            Traffic → Won
          </span>
        </div>
        {max === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-xs text-muted-foreground">
            No funnel data in range
          </div>
        ) : (
          <div className="space-y-1">
            {funnel.map((step, i) => {
              const widthPct = (step.value / max) * 100
              const isFirst = i === 0
              return (
                <div key={step.label}>
                  {!isFirst && step.rateFromPrev !== null && (
                    <div className="ml-20 py-1 text-xs text-muted-foreground sm:ml-24">
                      ↓ {formatPercent(step.rateFromPrev)}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-16 text-right text-xs font-medium text-muted-foreground sm:w-20">
                      {step.label}
                    </div>
                    <div className="flex h-9 flex-1 items-center">
                      <div
                        className="flex h-full min-w-fit items-center justify-end rounded bg-primary/85 px-3 text-xs font-semibold text-primary-foreground tabular-nums transition-[width] duration-300"
                        style={{ width: `${Math.max(widthPct, 4)}%` }}
                      >
                        {step.value.toLocaleString('en-US')}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
