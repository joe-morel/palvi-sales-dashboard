import type { JSX } from 'react'
import { ArrowDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/i18n/useLanguage'
import { useAggregates } from '@/hooks/useAggregates'
import { formatPercent } from '@/lib/format'

// Barras proporcionales + tasas entre etapas — jerarquía clara para ejecutivos.
export function FunnelChart(): JSX.Element {
  const { funnel } = useAggregates()
  const { t, tFunnelStep } = useLanguage()
  const max = funnel[0]?.value ?? 0

  return (
    <Card className="border-border/80 shadow-sm shadow-indigo-950/5 ring-1 ring-border/60">
      <CardContent className="flex flex-col gap-3 pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {t('funnelSectionTitle')}
          </h3>
          <span className="max-w-[14rem] text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t('funnelSectionSubtitle')}
          </span>
        </div>
        {max === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
            {t('noFunnelData')}
          </div>
        ) : (
          <div className="space-y-1.5">
            {funnel.map((step, i) => {
              const widthPct = (step.value / max) * 100
              const isFirst = i === 0
              const label = tFunnelStep(step.stepKey)
              return (
                <div key={step.stepKey}>
                  {!isFirst && step.rateFromPrev !== null && (
                    <div className="flex items-center gap-1 py-0.5 text-[11px] font-medium text-indigo-600/90 sm:ml-[5.5rem]">
                      <ArrowDown className="size-3 shrink-0" aria-hidden />
                      <span>{formatPercent(step.rateFromPrev)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-[5rem] shrink-0 text-right text-[11px] font-semibold leading-tight text-muted-foreground sm:w-[5.5rem]">
                      {label}
                    </div>
                    <div className="flex h-9 flex-1 items-center rounded-lg bg-gradient-to-r from-indigo-500/12 to-indigo-600/20 ring-1 ring-indigo-500/15">
                      <div
                        className="flex h-full min-w-[2rem] items-center justify-end rounded-md bg-gradient-to-br from-indigo-600 to-indigo-700 px-2.5 text-xs font-semibold text-white shadow-sm tabular-nums sm:px-3"
                        style={{ width: `${Math.max(widthPct, 6)}%` }}
                      >
                        {step.value.toLocaleString(undefined)}
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
