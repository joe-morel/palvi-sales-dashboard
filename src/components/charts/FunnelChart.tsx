import type { JSX } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/i18n/useLanguage'
import { useAggregates } from '@/hooks/useAggregates'
import { formatPercent } from '@/lib/format'
import { dashboardCardClass } from '@/lib/ui'
import { cn } from '@/lib/utils'

/** Barras proporcionales + cifras alineadas a la derecha (fuera de la barra). */
export function FunnelChart(): JSX.Element {
  const { funnel } = useAggregates()
  const { language, t, tFunnelStep } = useLanguage()
  const max = funnel[0]?.value ?? 0
  const numberLocale = language === 'es' ? 'es-ES' : 'en-US'

  return (
    <Card size="flush" className={cn('h-full', dashboardCardClass)}>
      <CardContent className="flex h-full min-h-[350px] flex-col gap-4 py-4">
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
          <div className="flex flex-1 flex-col justify-between gap-2">
            {funnel.map((step, i) => {
              const widthPct = (step.value / max) * 100
              const isFirst = i === 0
              const label = tFunnelStep(step.stepKey)
              const previousLabel = i > 0 ? tFunnelStep(funnel[i - 1].stepKey) : null
              const helperText =
                !isFirst && step.rateFromPrev !== null && previousLabel
                  ? `${formatPercent(step.rateFromPrev)} ${t('funnelFromPrevious')} ${previousLabel}`
                  : t('funnelBaseStep')

              return (
                <div
                  key={step.stepKey}
                  className="grid grid-cols-[minmax(6.5rem,8.75rem)_minmax(0,1fr)_5.75rem] items-center gap-x-2 sm:gap-x-3"
                >
                  <div className="min-w-0 text-right">
                    <div className="text-[11px] font-semibold leading-tight text-foreground">
                      {label}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="relative h-8 min-w-0 overflow-hidden rounded-lg bg-muted/55 ring-1 ring-border/60">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md bg-primary shadow-sm"
                        style={{ width: `${Math.max(widthPct, step.value > 0 ? 1.5 : 0)}%` }}
                        aria-label={`${label}: ${step.value.toLocaleString(numberLocale)}. ${helperText}`}
                      />
                    </div>
                    <div className="mt-1 text-[10px] font-medium leading-tight text-muted-foreground">
                      {helperText}
                    </div>
                  </div>
                  <div className="justify-self-end whitespace-nowrap pr-1 text-right text-xs font-semibold tabular-nums text-foreground">
                    {step.value.toLocaleString(numberLocale)}
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
