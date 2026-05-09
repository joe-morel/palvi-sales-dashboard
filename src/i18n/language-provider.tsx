import { useCallback, useEffect, useMemo, useState, type JSX, type ReactNode } from 'react'
import type { DayMetrics, FunnelStepKey } from '@/types/metrics'
import { LanguageContext, type LanguageContextValue } from './language-context'
import {
  LANGUAGE_STORAGE_KEY,
  translations,
  focusRecommendation,
  type Language,
  type TranslationKey,
} from './translations'

const FUNNEL_TO_TRANSLATION: Record<FunnelStepKey, TranslationKey> = {
  traffic: 'funnelTraffic',
  leads: 'funnelLeads',
  qualified: 'funnelQualified',
  opportunities: 'funnelOpportunities',
  won: 'funnelWon',
}

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'es'
  const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return raw === 'en' ? 'en' : 'es'
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps): JSX.Element {
  const [language, setLanguageState] = useState<Language>(() => readStoredLanguage())

  useEffect(() => {
    document.documentElement.lang = language === 'es' ? 'es' : 'en'
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }, [])

  const value = useMemo((): LanguageContextValue => {
    const t = (key: TranslationKey): string => {
      const table = translations[language]
      const fallback = translations.es
      return table[key] ?? fallback[key] ?? key
    }

    const tFocusReco = (metricKey: keyof DayMetrics): string =>
      focusRecommendation(language, metricKey)

    const tFunnelStep = (step: FunnelStepKey): string => {
      const key = FUNNEL_TO_TRANSLATION[step]
      return t(key)
    }

    return { language, setLanguage, t, tFocusReco, tFunnelStep }
  }, [language, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
