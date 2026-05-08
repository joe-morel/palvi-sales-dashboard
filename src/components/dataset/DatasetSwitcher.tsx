import type { JSX } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboardStore } from '@/store/dashboardStore'
import type { DatasetKey } from '@/types/metrics'

const DATASET_KEYS: DatasetKey[] = ['A', 'B', 'C', 'D']

export function DatasetSwitcher(): JSX.Element {
  const datasetKey = useDashboardStore((s) => s.datasetKey)
  const setDatasetKey = useDashboardStore((s) => s.setDatasetKey)

  return (
    <Tabs
      value={datasetKey}
      onValueChange={(value) => setDatasetKey(value as DatasetKey)}
    >
      <TabsList>
        {DATASET_KEYS.map((key) => (
          <TabsTrigger key={key} value={key}>
            {key}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
