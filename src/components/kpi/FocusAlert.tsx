import type { JSX } from 'react'
import {
  Activity,
  CircleAlert,
  Clock,
  Gauge,
  HeadphonesIcon,
  Layers,
  Target,
  Ticket,
  Trophy,
  Users,
  Wallet,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { METRIC_TITLE_KEY } from '@/i18n/translations'
import { useLanguage } from '@/i18n/useLanguage'
import { useMetrics } from '@/hooks/useMetrics'
import { getFocusOfTheDay } from '@/lib/analytics'
import { formatChange } from '@/lib/format'
import type { DayMetrics } from '@/types/metrics'

function iconForMetric(key: keyof DayMetrics): LucideIcon {
  switch (key) {
    case 'traffic':
      return Users
    case 'leads_created':
      return Target
    case 'leads_qualified':
      return Activity
    case 'deals_created':
      return Wallet
    case 'deals_won':
      return Trophy
    case 'deals_lost':
      return CircleAlert
    case 'avg_response_time_min':
      return Clock
    case 'avg_deal_cycle_days':
      return Gauge
    case 'stale_deals':
      return Layers
    case 'support_tickets_opened':
      return Ticket
    case 'support_avg_resolution_hours':
      return HeadphonesIcon
    default:
      return Activity
  }
}

export function FocusAlert(): JSX.Element {
  const { dataset } = useMetrics()
  const { t, tFocusReco } = useLanguage()
  const focus = getFocusOfTheDay(dataset, 3)

  if (focus.length === 0) {
    return (
      <Card className="border-emerald-500/25 bg-gradient-to-br from-emerald-50/90 to-white shadow-sm shadow-emerald-950/10 ring-1 ring-emerald-600/15">
        <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-hidden />
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
              {t('executiveSummary')}
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="text-sm font-semibold text-foreground">{t('noMajorDeterioration')}</div>
            <div className="text-xs leading-snug text-muted-foreground">
              {t('metricsStableOrImproving')}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-indigo-500/25 bg-gradient-to-br from-indigo-50/90 via-white to-amber-50/40 shadow-md shadow-indigo-950/10 ring-1 ring-indigo-500/20">
      <CardContent className="space-y-3 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-900">
            {t('executiveSummary')}
          </span>
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-500/25">
            {t('todayFocusAlt')}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {focus.map((item) => {
            const Icon = iconForMetric(item.metricKey)
            const rawChange = (item.current - item.prior) / item.prior
            const titleKey = METRIC_TITLE_KEY[item.metricKey]
            return (
              <div
                key={item.metricKey}
                className="flex min-h-[7.5rem] flex-col rounded-xl border border-border/70 bg-white/90 p-3 shadow-sm ring-1 ring-border/50"
              >
                <div className="flex items-start gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-sm font-semibold leading-tight text-foreground">
                      {t(titleKey)}
                    </div>
                    <div className="text-xs font-medium tabular-nums text-rose-700">
                      {formatChange(rawChange)} {t('vsPreviousWeek')}
                    </div>
                  </div>
                </div>
                <div className="mt-auto border-t border-border/60 pt-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('recommendation')}
                  </div>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {tFocusReco(item.metricKey)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
