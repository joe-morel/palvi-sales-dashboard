import type { JSX } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/i18n/useLanguage'
import { useDashboardStore } from '@/store/dashboardStore'
import type { DateRangePreset } from '@/store/dashboardStore'
import type { TranslationKey } from '@/i18n/translations'

const PRESETS: { value: DateRangePreset; labelKey: TranslationKey }[] = [
  { value: '7d', labelKey: 'last7Days' },
  { value: '30d', labelKey: 'last30Days' },
  { value: '90d', labelKey: 'last90Days' },
]

export function RangeSelect(): JSX.Element {
  const { t } = useLanguage()
  const rangePreset = useDashboardStore((s) => s.rangePreset)
  const setRangePreset = useDashboardStore((s) => s.setRangePreset)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {t('rangeLabel')}
      </span>
      <Tabs
        orientation="horizontal"
        value={rangePreset}
        onValueChange={(value) => setRangePreset(value as DateRangePreset)}
      >
        <TabsList className="h-11 min-h-[44px] gap-1 bg-muted/80 p-1">
          {PRESETS.map((p) => (
            <TabsTrigger key={p.value} className="min-h-10 px-3 text-sm sm:px-4" value={p.value}>
              {t(p.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
