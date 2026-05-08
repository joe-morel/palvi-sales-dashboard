import type { JSX } from 'react'
import { format, parseISO } from 'date-fns'
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
import { useMetrics } from '@/hooks/useMetrics'
import { formatValue } from '@/lib/format'
import type { DayMetrics, MetricMeta } from '@/types/metrics'

interface TimeSeriesChartProps {
  metricKey: keyof DayMetrics
  meta: MetricMeta
  // Token de color shadcn (chart-1..chart-5). Default chart-1.
  colorVar?: `--chart-${1 | 2 | 3 | 4 | 5}`
}

interface ChartPoint {
  date: string
  value: number
}

export function TimeSeriesChart({
  metricKey,
  meta,
  colorVar = '--chart-1',
}: TimeSeriesChartProps): JSX.Element {
  const { rangeDays } = useMetrics()

  // Filtrar nulls silenciosamente — el brief lo manda explícitamente.
  // Recharts renderiza el array filtrado como una línea continua, sin gaps.
  const data: ChartPoint[] = rangeDays
    .map((day) => ({ date: day.date, value: day.metrics[metricKey] }))
    .filter((d): d is ChartPoint => d.value !== null)

  return (
    <Card>
      <CardContent>
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {meta.label}
          </h3>
          <span className="text-xs text-muted-foreground">{meta.unit}</span>
        </div>
        {data.length === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-xs text-muted-foreground">
            No data in range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={data}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => format(parseISO(d), 'MMM d')}
                fontSize={11}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis
                fontSize={11}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                width={48}
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
                  typeof label === 'string'
                    ? format(parseISO(label), 'MMM d, yyyy')
                    : ''
                }
                formatter={(value) => [
                  typeof value === 'number'
                    ? formatValue(value, meta.unit)
                    : '—',
                  meta.label,
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={`var(${colorVar})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
