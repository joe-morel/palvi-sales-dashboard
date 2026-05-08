import type { JSX } from 'react'
import { ArrowDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/i18n/useLanguage'
import { useAggregates } from '@/hooks/useAggregates'
import { formatPercent } from '@/lib/format'

/** Barras proporcionales + cifras alineadas a la derecha (fuera de la barra). */
export function FunnelChart(): JSX.Element {
  const { funnel } = useAggregates()
  const { language, t, tFunnelStep } = useLanguage()
  const max = funnel[0]?.value ?? 0
  const numberLocale = language === 'es' ? 'es-ES' : 'en-US'

  return (
    <Card className="border-border/80 shadow-sm shadow-black/5 ring-1 ring-border/60">
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
                    <div className="mb-0.5 grid grid-cols-[minmax(4.5rem,6rem)_minmax(0,1fr)_minmax(3.25rem,5rem)] items-center gap-x-2 sm:gap-x-3">
                      <div />
                      <div className="flex min-w-0 items-center gap-1 py-0.5 text-[11px] font-medium text-primary">
                        <ArrowDown className="size-3 shrink-0" aria-hidden />
                        <span>{formatPercent(step.rateFromPrev)}</span>
                      </div>
                      <div />
                    </div>
                  )}
                  <div className="grid grid-cols-[minmax(4.5rem,6rem)_minmax(0,1fr)_minmax(3.25rem,5rem)] items-center gap-x-2 sm:gap-x-3">
                    <div className="text-right text-[11px] font-semibold leading-tight text-muted-foreground">
                      {label}
                    </div>
                    <div className="relative h-9 min-w-0 overflow-hidden rounded-lg bg-muted/55 ring-1 ring-border/60">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md bg-gradient-to-br from-primary to-primary/88 shadow-sm"
                        style={{ width: `${Math.max(widthPct, 1)}%` }}
                        aria-hidden
                      />
                    </div>
                    <div className="text-right text-xs font-semibold tabular-nums text-foreground">
                      {step.value.toLocaleString(numberLocale)}
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
