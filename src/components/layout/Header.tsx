import type { JSX } from 'react'
import { DatasetSwitcher } from '@/components/dataset/DatasetSwitcher'
import { RangeSelect } from '@/components/dataset/RangeSelect'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/i18n/useLanguage'

export function Header(): JSX.Element {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="min-w-0 space-y-0.5">
          <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {t('appTitle')}
          </h1>
          <p className="text-xs font-medium text-muted-foreground md:text-sm">{t('appSubtitle')}</p>
        </div>
        <div className="flex flex-wrap items-end gap-4 md:gap-5">
          <DatasetSwitcher />
          <RangeSelect />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t('languageLabel')}
            </span>
            <Tabs
              orientation="horizontal"
              value={language}
              onValueChange={(v) => setLanguage(v as 'es' | 'en')}
            >
              <TabsList className="h-11 min-h-[44px] gap-1 bg-muted/80 p-1">
                <TabsTrigger className="min-h-10 px-4 text-sm" value="es">
                  {t('langEs')}
                </TabsTrigger>
                <TabsTrigger className="min-h-10 px-4 text-sm" value="en">
                  {t('langEn')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </header>
  )
}
