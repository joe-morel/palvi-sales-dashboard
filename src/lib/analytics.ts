import { parseISO, subDays, isAfter, isBefore } from 'date-fns'
import { aggregate } from './aggregators'
import type { Dataset, DayEntry, DayMetrics, MetricMeta } from '@/types/metrics'

export interface FocusItem {
  metricKey: keyof DayMetrics
  meta: MetricMeta
  current: number
  prior: number
  // Variación porcentual ya orientada según `direction`.
  // Negativo = la métrica empeoró respecto a la semana anterior.
  // Positivo = mejoró. Sirve directo para sortear "qué está peor hoy".
  signedChange: number
}

const FOCUS_WINDOW_DAYS = 7

function inRange(day: DayEntry, start: Date, end: Date): boolean {
  const date = parseISO(day.date)
  return !isBefore(date, start) && !isAfter(date, end)
}

// "Foco del día": qué métricas se deterioraron más en la última semana
// vs la semana anterior. Devuelve top-N para que el Jefe de Ventas
// sepa dónde mirar primero al abrir el dashboard.
//
// Reglas:
// - Compara última semana (7 días hasta end_date) vs la semana previa (días 8-14).
// - Cada métrica se agrega según su naturaleza (sum/avg/last) — ver aggregators.ts.
// - El cambio se invierte para métricas `lower_is_better`: subir tiempos de
//   respuesta es malo, así que un +20% pasa a ser -20% en signedChange.
// - Solo retornamos las que efectivamente empeoraron (signedChange < 0).
// - Filtramos casos sin señal: prior=0, datos insuficientes, valores null.
export function getFocusOfTheDay(dataset: Dataset, count: number = 3): FocusItem[] {
  const endDate = parseISO(dataset.metadata.end_date)
  const lastWeekStart = subDays(endDate, FOCUS_WINDOW_DAYS - 1)
  const priorWeekEnd = subDays(lastWeekStart, 1)
  const priorWeekStart = subDays(priorWeekEnd, FOCUS_WINDOW_DAYS - 1)

  const lastWeek = dataset.days.filter((d) => inRange(d, lastWeekStart, endDate))
  const priorWeek = dataset.days.filter((d) => inRange(d, priorWeekStart, priorWeekEnd))

  if (lastWeek.length === 0 || priorWeek.length === 0) return []

  const items: FocusItem[] = []

  for (const meta of dataset.metadata.metrics) {
    const key = meta.key as keyof DayMetrics
    const current = aggregate(lastWeek, key)
    const prior = aggregate(priorWeek, key)

    if (current === null || prior === null || prior === 0) continue

    const rawChange = (current - prior) / prior
    const signedChange = meta.direction === 'higher_is_better' ? rawChange : -rawChange

    items.push({ metricKey: key, meta, current, prior, signedChange })
  }

  // Peores primero (signedChange más negativo)
  items.sort((a, b) => a.signedChange - b.signedChange)

  return items.filter((item) => item.signedChange < 0).slice(0, count)
}
