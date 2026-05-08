import type { JSX } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/i18n/useLanguage'
import { useDashboardStore } from '@/store/dashboardStore'
import type { DatasetKey } from '@/types/metrics'

const DATASET_KEYS: DatasetKey[] = ['A', 'B', 'C', 'D']

export function DatasetSwitcher(): JSX.Element {
  const { t } = useLanguage()
  const datasetKey = useDashboardStore((s) => s.datasetKey)
  const setDatasetKey = useDashboardStore((s) => s.setDatasetKey)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {t('datasetLabel')}
      </span>
      <Tabs
        orientation="horizontal"
        value={datasetKey}
        onValueChange={(value) => setDatasetKey(value as DatasetKey)}
      >
        <TabsList className="h-11 min-h-[44px] gap-1 rounded-xl border border-border/80 bg-card p-1 shadow-sm shadow-black/5">
          {DATASET_KEYS.map((key) => (
            <TabsTrigger
              key={key}
              className="min-h-9 min-w-10 rounded-lg px-3 text-sm data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground"
              value={key}
            >
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
