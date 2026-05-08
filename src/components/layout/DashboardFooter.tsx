import type { JSX } from 'react'
import { useLanguage } from '@/i18n/useLanguage'

export function DashboardFooter(): JSX.Element {
  const { t } = useLanguage()
  return (
    <footer className="mx-auto w-full max-w-[1400px] shrink-0 px-4 py-3 text-center text-[11px] leading-relaxed text-muted-foreground md:px-6">
      {t('footerDataNotice')}
    </footer>
  )
}
