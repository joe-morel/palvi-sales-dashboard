import type { MetricDirection } from '@/types/metrics'

const COUNT_UNITS = new Set(['visits', 'leads', 'deals', 'tickets'])
const DURATION_UNITS = new Set(['min', 'hours', 'days'])

// Formatea el valor crudo de una métrica con su unidad.
// - Counts (visits/leads/deals/tickets): entero con separador de miles.
// - Durations (min/hours/days): un decimal + unidad.
// - Otros: un decimal sin unidad.
// null se representa con guión largo, nunca con texto literal "null".
export function formatValue(value: number | null, unit: string, locale: string = 'en-US'): string {
  if (value === null) return '—'
  if (COUNT_UNITS.has(unit)) {
    return Math.round(value).toLocaleString(locale)
  }
  if (DURATION_UNITS.has(unit)) {
    return `${value.toLocaleString(locale, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    })} ${unit}`
  }
  return value.toLocaleString(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })
}

// Formatea un cambio porcentual (e.g. 0.124 → "+12.4%", -0.085 → "-8.5%").
// El signo es literal — el color/dirección la decide el caller según
// `direction` de la métrica.
export function formatChange(rawChange: number | null): string {
  if (rawChange === null) return '—'
  const sign = rawChange >= 0 ? '+' : ''
  return `${sign}${(rawChange * 100).toFixed(1)}%`
}

// Formatea una proporción [0..1] como porcentaje. Para win_rate, conversion rates, etc.
export function formatPercent(value: number | null): string {
  if (value === null) return '—'
  return `${(value * 100).toFixed(1)}%`
}

// Devuelve si un cambio es "mejora" para una métrica dada.
// - higher_is_better + cambio positivo → mejora
// - lower_is_better + cambio negativo → mejora
// - cambio cero o null → null (neutral, no aplica color)
export function isImprovement(
  rawChange: number | null,
  direction: MetricDirection,
): boolean | null {
  if (rawChange === null || rawChange === 0) return null
  return direction === 'higher_is_better' ? rawChange > 0 : rawChange < 0
}
