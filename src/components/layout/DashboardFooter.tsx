import type { JSX } from 'react'
import { format } from 'date-fns'
import { enUS, es as esLocale } from 'date-fns/locale'
import { useMetrics } from '@/hooks/useMetrics'
import { useLanguage } from '@/i18n/useLanguage'

export function DashboardFooter(): JSX.Element {
  const { language, t } = useLanguage()
  const { rangeDays, priorRangeDays } = useMetrics()
  const locale = language === 'es' ? esLocale : enUS
  const currentStart = rangeDays[0]?.date
  const currentEnd = rangeDays.at(-1)?.date
  const priorStart = priorRangeDays[0]?.date
  const priorEnd = priorRangeDays.at(-1)?.date

  const formatShortDate = (date: string): string =>
    format(new Date(`${date}T00:00:00`), 'd MMM', { locale })

  const rangeCopy =
    currentStart && currentEnd && priorStart && priorEnd
      ? `${t('exactRangeLabel')}: ${formatShortDate(currentStart)} - ${formatShortDate(
          currentEnd,
        )} ${t('exactRangeVs')} ${formatShortDate(priorStart)} - ${formatShortDate(priorEnd)}`
      : null

  return (
    <footer className="mx-auto grid w-full max-w-[1400px] shrink-0 gap-2 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground md:grid-cols-[1fr_auto_1fr] md:items-center md:px-6">
      <div className="text-center md:text-left">{rangeCopy}</div>
      <div className="text-center">{t('footerDataNotice')}</div>
      <div className="text-center md:text-right">
        {t('footerCreator')}{' '}
        <a
          className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          href="https://www.joemorel.dev"
          rel="noreferrer"
          target="_blank"
        >
          joemorel
        </a>
      </div>
    </footer>
  )
}
