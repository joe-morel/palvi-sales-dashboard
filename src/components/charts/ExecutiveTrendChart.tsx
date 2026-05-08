import type { JSX } from 'react'
import { format, parseISO } from 'date-fns'
import { enUS, es as esLocale } from 'date-fns/locale'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/i18n/useLanguage'
import { useMetrics } from '@/hooks/useMetrics'
import { formatValue } from '@/lib/format'
import { useAggregates } from '@/hooks/useAggregates'

interface TrendRow {
  date: string
  leads: number | null
  won: number | null
}

export function ExecutiveTrendChart(): JSX.Element {
  const { language, t } = useLanguage()
  const { rangeDays } = useMetrics()
  const { metrics } = useAggregates()
  const metaByKey = new Map(metrics.map((m) => [m.meta.key, m.meta]))

  const leadsMeta = metaByKey.get('leads_created')
  const wonMeta = metaByKey.get('deals_won')

  const locale = language === 'es' ? esLocale : enUS

  const data: TrendRow[] = rangeDays.map((day) => ({
    date: day.date,
    leads: day.metrics.leads_created,
    won: day.metrics.deals_won,
  }))

  const hasLeads = data.some((d) => d.leads !== null)
  const hasWon = data.some((d) => d.won !== null)
  const hasAny = hasLeads || hasWon

  return (
    <Card className="border-border/80 shadow-sm shadow-black/5 ring-1 ring-border/60">
      <CardContent className="flex flex-col gap-3 pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {t('trendSectionTitle')}
          </h3>
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t('comparedToPreviousPeriod')}
          </span>
        </div>
        {!hasAny || !leadsMeta || !wonMeta ? (
          <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
            {t('noDataInRange')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => format(parseISO(d), 'd MMM', { locale })}
                fontSize={11}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                yAxisId="left"
                fontSize={11}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                fontSize={11}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Tooltip
                cursor={{ stroke: 'var(--border)' }}
                contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--popover-foreground)',
                }}
                labelFormatter={(label) =>
                  typeof label === 'string' ? format(parseISO(label), 'PP', { locale }) : ''
                }
                formatter={(value, name) => {
                  const num = typeof value === 'number' ? value : null
                  if (name === 'leads') {
                    return [formatValue(num, leadsMeta.unit), t('trendSeriesLeads')]
                  }
                  if (name === 'won') {
                    return [formatValue(num, wonMeta.unit), t('trendSeriesDealsWon')]
                  }
                  return [String(value ?? ''), '']
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="leads"
                name="leads"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="won"
                name="won"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
