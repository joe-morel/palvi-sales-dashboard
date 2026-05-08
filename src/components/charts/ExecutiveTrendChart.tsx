import { useMemo, type JSX } from 'react'
import { format, parseISO } from 'date-fns'
import type { Locale } from 'date-fns'
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
import { dashboardCardClass } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { useAggregates } from '@/hooks/useAggregates'

interface TrendRow {
  startDate: string
  endDate: string
  leads: number | null
  won: number | null
}

interface MiniTrendProps {
  color: string
  data: TrendRow[]
  dataKey: 'leads' | 'won'
  label: string
  locale: Locale
  numberLocale: string
  periodLabel: string
  unit: string
}

function sumValues(values: (number | null)[]): number | null {
  const valid = values.filter((value): value is number => value !== null)
  if (valid.length === 0) return null
  return valid.reduce((total, value) => total + value, 0)
}

function MiniTrend({
  color,
  data,
  dataKey,
  label,
  locale,
  numberLocale,
  periodLabel,
  unit,
}: MiniTrendProps): JSX.Element {
  const periodTotal = sumValues(data.map((row) => row[dataKey]))

  return (
    <div className="flex min-h-[136px] flex-1 flex-col rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
          <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
          {formatValue(periodTotal, unit, numberLocale)} {periodLabel}
        </span>
      </div>
      <div className="mt-1 min-h-[98px]">
        <ResponsiveContainer width="100%" height={98}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="endDate"
              tickFormatter={(d: string) => format(parseISO(d), 'd MMM', { locale })}
              fontSize={10}
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              minTickGap={32}
            />
            <YAxis
              allowDecimals={false}
              fontSize={10}
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              width={36}
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
              labelFormatter={(_, rows) => {
                const payload = rows?.[0]?.payload as TrendRow | undefined
                if (!payload) return ''
                const start = format(parseISO(payload.startDate), 'd MMM', { locale })
                const end = format(parseISO(payload.endDate), 'd MMM', { locale })
                return payload.startDate === payload.endDate ? end : `${start} - ${end}`
              }}
              formatter={(value) => {
                const num = typeof value === 'number' ? value : null
                return [formatValue(num, unit, numberLocale), label]
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function ExecutiveTrendChart(): JSX.Element {
  const { language, t } = useLanguage()
  const { rangeDays } = useMetrics()
  const { metrics } = useAggregates()
  const metaByKey = new Map(metrics.map((m) => [m.meta.key, m.meta]))

  const leadsMeta = metaByKey.get('leads_created')
  const wonMeta = metaByKey.get('deals_won')

  const locale = language === 'es' ? esLocale : enUS
  const numberLocale = language === 'es' ? 'es-ES' : 'en-US'

  const data: TrendRow[] = useMemo(() => {
    const bucketSize = rangeDays.length > 60 ? 7 : rangeDays.length > 21 ? 3 : 1
    const rows: TrendRow[] = []

    for (let i = 0; i < rangeDays.length; i += bucketSize) {
      const bucket = rangeDays.slice(i, i + bucketSize)
      const first = bucket[0]
      const last = bucket[bucket.length - 1]
      if (!first || !last) continue

      rows.push({
        startDate: first.date,
        endDate: last.date,
        leads: sumValues(bucket.map((day) => day.metrics.leads_created)),
        won: sumValues(bucket.map((day) => day.metrics.deals_won)),
      })
    }

    return rows
  }, [rangeDays])

  const hasLeads = data.some((d) => d.leads !== null)
  const hasWon = data.some((d) => d.won !== null)
  const hasAny = hasLeads || hasWon

  return (
    <Card size="flush" className={cn('h-full', dashboardCardClass)}>
      <CardContent className="flex h-full min-h-[350px] flex-col gap-4 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {t('trendSectionTitle')}
          </h3>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <span>{t('comparedToPreviousPeriod')}</span>
            <span className="size-2 rounded-full bg-chart-1" aria-hidden />
            <span className="size-2 rounded-full bg-chart-2" aria-hidden />
          </div>
        </div>
        {!hasAny || !leadsMeta || !wonMeta ? (
          <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
            {t('noDataInRange')}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <MiniTrend
              color="var(--chart-1)"
              data={data}
              dataKey="leads"
              label={t('trendSeriesLeads')}
              locale={locale}
              numberLocale={numberLocale}
              periodLabel={t('periodTotalLabel')}
              unit={leadsMeta.unit}
            />
            <MiniTrend
              color="var(--chart-2)"
              data={data}
              dataKey="won"
              label={t('trendSeriesDealsWon')}
              locale={locale}
              numberLocale={numberLocale}
              periodLabel={t('periodTotalLabel')}
              unit={wonMeta.unit}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
