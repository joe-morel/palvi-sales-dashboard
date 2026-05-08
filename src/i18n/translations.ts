import type { DayMetrics } from '@/types/metrics'

export type Language = 'es' | 'en'

export const LANGUAGE_STORAGE_KEY = 'sales-pulse-lang'

/** Keys used by `t()` for static UI copy */
export const translations = {
  es: {
    appTitle: 'Sales Pulse',
    appSubtitle: 'Reporte ejecutivo de métricas',
    datasetLabel: 'Dataset',
    rangeLabel: 'Periodo',
    languageLabel: 'Idioma',
    langEs: 'ES',
    langEn: 'EN',
    last7Days: '7 días',
    last30Days: '30 días',
    last90Days: '90 días',
    executiveSummary: 'Resumen ejecutivo',
    todayFocusAlt: 'Foco de hoy',
    noMajorDeterioration: 'Sin deterioro relevante esta semana',
    metricsStableOrImproving:
      'Las métricas clave están estables o mejorando vs la semana anterior.',
    vsPreviousWeek: 'vs semana anterior',
    recommendation: 'Recomendación',
    metricWinRate: 'Tasa de cierre',
    metricTraffic: 'Tráfico',
    metricLeadsCreated: 'Leads creados',
    metricLeadsQualified: 'Leads calificados',
    metricDealsCreated: 'Deals creados',
    metricDealsWon: 'Deals ganados',
    metricDealsLost: 'Deals perdidos',
    metricResponseTime: 'Tiempo de respuesta',
    metricAvgDealCycleDays: 'Ciclo de deal',
    metricStaleDeals: 'Deals estancados',
    metricSupportTickets: 'Tickets de soporte',
    metricSupportResolution: 'Resolución soporte',
    funnelSectionTitle: 'Salud del embudo',
    funnelSectionSubtitle: 'Tráfico → Ganados',
    funnelTraffic: 'Tráfico',
    funnelLeads: 'Leads',
    funnelQualified: 'Calificados',
    funnelOpportunities: 'Oportunidades',
    funnelWon: 'Ganados',
    trendSectionTitle: 'Tendencia principal',
    trendSeriesLeads: 'Leads creados',
    trendSeriesDealsWon: 'Deals ganados',
    noDataInRange: 'Sin datos en el periodo',
    noFunnelData: 'Sin datos de embudo en el periodo',
    comparedToPreviousPeriod: 'vs periodo anterior',
  },
  en: {
    appTitle: 'Sales Pulse',
    appSubtitle: 'Executive Metrics Report',
    datasetLabel: 'Dataset',
    rangeLabel: 'Range',
    languageLabel: 'Language',
    langEs: 'ES',
    langEn: 'EN',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    last90Days: 'Last 90 days',
    executiveSummary: 'Executive summary',
    todayFocusAlt: "Today's focus",
    noMajorDeterioration: 'No major deterioration this week',
    metricsStableOrImproving: 'Key metrics are stable or improving vs the prior week.',
    vsPreviousWeek: 'vs prior week',
    recommendation: 'Recommendation',
    metricWinRate: 'Win rate',
    metricTraffic: 'Traffic',
    metricLeadsCreated: 'Leads created',
    metricLeadsQualified: 'Qualified leads',
    metricDealsCreated: 'Deals created',
    metricDealsWon: 'Deals won',
    metricDealsLost: 'Deals lost',
    metricResponseTime: 'Response time',
    metricAvgDealCycleDays: 'Deal cycle',
    metricStaleDeals: 'Stale deals',
    metricSupportTickets: 'Support tickets',
    metricSupportResolution: 'Support resolution',
    funnelSectionTitle: 'Funnel health',
    funnelSectionSubtitle: 'Traffic → Won',
    funnelTraffic: 'Traffic',
    funnelLeads: 'Leads',
    funnelQualified: 'Qualified',
    funnelOpportunities: 'Opportunities',
    funnelWon: 'Won',
    trendSectionTitle: 'Main trend',
    trendSeriesLeads: 'Leads created',
    trendSeriesDealsWon: 'Deals won',
    noDataInRange: 'No data in range',
    noFunnelData: 'No funnel data in range',
    comparedToPreviousPeriod: 'vs prior period',
  },
} as const

export type TranslationKey = keyof (typeof translations)['es']

/** Maps DayMetrics keys to translation keys for KPI/focus titles */
export const METRIC_TITLE_KEY: Record<keyof DayMetrics, TranslationKey> = {
  traffic: 'metricTraffic',
  leads_created: 'metricLeadsCreated',
  leads_qualified: 'metricLeadsQualified',
  deals_created: 'metricDealsCreated',
  deals_won: 'metricDealsWon',
  deals_lost: 'metricDealsLost',
  avg_response_time_min: 'metricResponseTime',
  avg_deal_cycle_days: 'metricAvgDealCycleDays',
  stale_deals: 'metricStaleDeals',
  support_tickets_opened: 'metricSupportTickets',
  support_avg_resolution_hours: 'metricSupportResolution',
}

/** Actionable copy per metric when it appears in executive focus (ES). */
const focusRecoEs: Record<keyof DayMetrics, string> = {
  traffic: 'Prioriza campañas y fuentes que traigan visitas con intención de compra.',
  leads_created: 'Monitorea generación y calificación de demanda; revisa SLAs de respuesta.',
  leads_qualified: 'Revisa criterios de ICP y handoff marketing → ventas para calificar mejor.',
  deals_created: 'Asegura volumen de oportunidades: revisa demos agendadas y propuestas.',
  deals_won: 'Refuerza playbook de cierre y elimina fricciones en negociación.',
  deals_lost: 'Analiza causas de pérdida y objeciones recurrentes con el equipo.',
  avg_response_time_min: 'Prioriza contacto rápido a nuevos leads y reduce cuellos de botella.',
  avg_deal_cycle_days: 'Acorta etapas claras en el pipeline y define próximos pasos con fecha.',
  stale_deals: 'Audita deals sin movimiento; define siguiente acción o descarta con criterio.',
  support_tickets_opened: 'Revisa carga operativa y fricción postventa con soporte y CS.',
  support_avg_resolution_hours:
    'Reduce tiempo de resolución con plantillas y priorización por impacto.',
}

/** Same recommendations in English */
const focusRecoEn: Record<keyof DayMetrics, string> = {
  traffic: 'Prioritize campaigns and sources that bring high-intent pipeline.',
  leads_created: 'Monitor demand generation and qualification; tighten response SLAs.',
  leads_qualified: 'Review ICP criteria and marketing → sales handoff for better qualification.',
  deals_created: 'Protect opportunity volume: check booked demos and proposals.',
  deals_won: 'Reinforce closing playbook and remove negotiation friction.',
  deals_lost: 'Review loss reasons and recurring objections with the team.',
  avg_response_time_min: 'Prioritize faster follow-up on new leads and remove bottlenecks.',
  avg_deal_cycle_days: 'Shorten pipeline stages with clear next steps and dates.',
  stale_deals: 'Audit stalled deals; define the next action or disqualify with criteria.',
  support_tickets_opened: 'Review operational load and post-sale friction with support and CS.',
  support_avg_resolution_hours:
    'Reduce resolution time with templates and impact-based prioritization.',
}

export function focusRecommendation(language: Language, metricKey: keyof DayMetrics): string {
  const map = language === 'es' ? focusRecoEs : focusRecoEn
  return map[metricKey]
}
