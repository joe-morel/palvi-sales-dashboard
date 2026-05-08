import type { JSX } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/i18n/useLanguage'
import { cn } from '@/lib/utils'
import { formatValue, formatChange, isImprovement } from '@/lib/format'
import type { MetricDirection } from '@/types/metrics'

interface KPICardProps {
  label: string
  value: number | null
  unit: string
  rawChange: number | null
  direction: MetricDirection
  format?: (value: number) => string
}

export function KPICard({
  label,
  value,
  unit,
  rawChange,
  direction,
  format,
}: KPICardProps): JSX.Element {
  const { t } = useLanguage()
  const improvement = isImprovement(rawChange, direction)

  const trendColor =
    improvement === null
      ? 'text-muted-foreground'
      : improvement
        ? 'text-emerald-600'
        : 'text-rose-600'

  const TrendIcon = improvement === null ? Minus : improvement ? TrendingUp : TrendingDown

  const displayValue = value === null ? '—' : format ? format(value) : formatValue(value, unit)

  return (
    <Card
      size="sm"
      className="border-border/80 bg-card/90 shadow-sm shadow-black/5 ring-1 ring-border/60"
    >
      <CardContent className="space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {displayValue}
          </div>
          <div
            className={cn(
              'flex shrink-0 items-center gap-1 text-sm font-medium tabular-nums',
              trendColor,
            )}
          >
            <TrendIcon className="size-4" aria-hidden />
            {formatChange(rawChange)}
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground">{t('comparedToPreviousPeriod')}</div>
      </CardContent>
    </Card>
  )
}
