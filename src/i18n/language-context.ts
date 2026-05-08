import { createContext } from 'react'
import type { DayMetrics, FunnelStepKey } from '@/types/metrics'
import type { Language, TranslationKey } from './translations'

export interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  tFocusReco: (metricKey: keyof DayMetrics) => string
  tFunnelStep: (step: FunnelStepKey) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
