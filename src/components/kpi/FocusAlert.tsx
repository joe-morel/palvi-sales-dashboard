import type { JSX } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useMetrics } from '@/hooks/useMetrics'
import { getFocusOfTheDay } from '@/lib/analytics'
import { formatChange } from '@/lib/format'

export function FocusAlert(): JSX.Element {
  const { dataset } = useMetrics()
  const focus = getFocusOfTheDay(dataset, 3)

  if (focus.length === 0) {
    return (
      <Card className="bg-emerald-50/40 ring-emerald-600/20 dark:bg-emerald-950/20 dark:ring-emerald-400/20">
        <CardContent>
          <div className="flex items-center gap-3">
            <CheckCircle2
              className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden
            />
            <div>
              <div className="text-sm font-semibold text-foreground">
                No major deterioration this week
              </div>
              <div className="text-xs text-muted-foreground">
                Key metrics are stable or improving vs the prior week.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-red-50/40 ring-red-600/20 dark:bg-red-950/20 dark:ring-red-400/20">
      <CardContent>
        <div className="flex items-center gap-2">
          <AlertTriangle
            className="size-5 shrink-0 text-red-600 dark:text-red-400"
            aria-hidden
          />
          <h2 className="text-sm font-semibold text-foreground">
            Focus today — top {focus.length} deteriorating
          </h2>
        </div>
        <ul className="mt-3 space-y-2">
          {focus.map((item) => {
            // rawChange muestra la dirección natural de la métrica.
            // Ej: response time pasó de 32 a 70 min → +118% (subió).
            // El contexto del card rojo ya transmite "esto es malo";
            // el porcentaje crudo es más legible que el signed.
            const rawChange = (item.current - item.prior) / item.prior
            return (
              <li
                key={item.metricKey}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="font-medium text-foreground">
                  {item.meta.label}
                </span>
                <span className="tabular-nums text-red-700 dark:text-red-400">
                  {formatChange(rawChange)} vs prior week
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
