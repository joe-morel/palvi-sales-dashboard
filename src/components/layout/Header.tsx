import type { JSX } from 'react'
import { Activity, Moon, Sun } from 'lucide-react'
import { DatasetSwitcher } from '@/components/dataset/DatasetSwitcher'
import { RangeSelect } from '@/components/dataset/RangeSelect'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/i18n/useLanguage'

export function Header(): JSX.Element {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const ThemeIcon = theme === 'dark' ? Sun : Moon

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-border/70 bg-card/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-black/5 ring-1 ring-border/40">
            <Activity className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-0.5">
            <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {t('appTitle')}
            </h1>
            <p className="text-xs font-medium text-muted-foreground md:text-sm">
              {t('appSubtitle')}
            </p>
          </div>
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
              <TabsList className="h-11 min-h-[44px] gap-1 rounded-xl border border-border/80 bg-card p-1 shadow-sm shadow-black/5">
                <TabsTrigger
                  className="min-h-9 rounded-lg px-4 text-sm data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground"
                  value="es"
                >
                  {t('langEs')}
                </TabsTrigger>
                <TabsTrigger
                  className="min-h-9 rounded-lg px-4 text-sm data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground"
                  value="en"
                >
                  {t('langEn')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t('themeLabel')}
            </span>
            <Button
              aria-label={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
              className="size-11 rounded-xl border-border/80 bg-card shadow-sm shadow-black/5 hover:bg-muted"
              onClick={toggleTheme}
              title={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
              type="button"
              variant="outline"
            >
              <ThemeIcon className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
