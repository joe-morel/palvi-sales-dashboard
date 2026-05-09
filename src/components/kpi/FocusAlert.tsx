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
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  CheckCircle2,
  Minus,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { METRIC_TITLE_KEY } from '@/i18n/translations'
import { useLanguage } from '@/i18n/useLanguage'
import { useMetrics } from '@/hooks/useMetrics'
import { getFocusOfTheDay } from '@/lib/analytics'
import { formatChange, isImprovement } from '@/lib/format'
import { dashboardCardClass, dashboardSubCardClass } from '@/lib/ui'
import { cn } from '@/lib/utils'
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
  const priorityMetrics = focus
    .slice(0, 2)
    .map((item) => t(METRIC_TITLE_KEY[item.metricKey]))
    .join(' + ')

  if (focus.length === 0) {
    return (
      <Card className={dashboardCardClass}>
        <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-hidden />
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
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
    <Card className={cn('overflow-hidden', dashboardCardClass)}>
      <CardContent className="space-y-2.5 py-3.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                {t('executiveSummary')}
              </span>
              <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary ring-1 ring-primary/20">
                {t('todayFocusAlt')}
              </span>
            </div>
            <div className="text-xs font-medium leading-snug text-muted-foreground">
              {t('todayPriority')}: <span className="text-foreground">{priorityMetrics}</span>
            </div>
          </div>
        </div>
        <div className="grid auto-rows-fr gap-3 md:grid-cols-3">
          {focus.map((item) => {
            const Icon = iconForMetric(item.metricKey)
            const rawChange = (item.current - item.prior) / item.prior
            const improvement = isImprovement(rawChange, item.meta.direction)
            const TrendIcon = rawChange === 0 ? Minus : rawChange > 0 ? TrendingUp : TrendingDown
            const trendColor =
              improvement === null
                ? 'text-muted-foreground'
                : improvement
                  ? 'text-emerald-600'
                  : 'text-rose-600'
            const titleKey = METRIC_TITLE_KEY[item.metricKey]
            const recommendation = tFocusReco(item.metricKey)
            return (
              <div
                key={item.metricKey}
                className={cn(
                  'flex h-full min-h-[8rem] flex-col rounded-xl p-3',
                  dashboardSubCardClass,
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-sm font-semibold leading-tight text-foreground">
                      {t(titleKey)}
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium tabular-nums',
                        trendColor,
                      )}
                      title={t('semanticColorHint')}
                    >
                      <TrendIcon className="size-3.5" aria-hidden />
                      {formatChange(rawChange)} · {t('worseVsPreviousWeek')}
                    </div>
                  </div>
                </div>
                <div className="mt-auto border-t border-border/60 pt-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('recommendation')}
                  </div>
                  <p
                    className="mt-1 line-clamp-2 min-h-8 text-xs leading-snug text-muted-foreground"
                    title={recommendation}
                  >
                    {recommendation}
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
