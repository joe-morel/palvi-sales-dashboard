import type { JSX } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatValue, formatChange, isImprovement } from '@/lib/format'
import type { MetricDirection } from '@/types/metrics'

interface KPICardProps {
  label: string
  value: number | null
  unit: string
  rawChange: number | null
  direction: MetricDirection
  // Override del format default (usado para win_rate, que es ratio [0..1]).
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
  const improvement = isImprovement(rawChange, direction)

  // Verde si mejora, rojo si empeora, gris si neutral/null.
  const trendColor =
    improvement === null
      ? 'text-muted-foreground'
      : improvement
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-red-600 dark:text-red-400'

  const TrendIcon =
    improvement === null ? Minus : improvement ? TrendingUp : TrendingDown

  const displayValue =
    value === null ? '—' : format ? format(value) : formatValue(value, unit)

  return (
    <Card>
      <CardContent>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <div className="text-2xl font-semibold text-foreground tabular-nums">
            {displayValue}
          </div>
          <div className={cn('flex items-center gap-1 text-sm tabular-nums', trendColor)}>
            <TrendIcon className="size-4" aria-hidden />
            {formatChange(rawChange)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
