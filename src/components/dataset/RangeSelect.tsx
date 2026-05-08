import type { JSX } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboardStore } from '@/store/dashboardStore'
import type { DateRangePreset } from '@/store/dashboardStore'

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
]

export function RangeSelect(): JSX.Element {
  const rangePreset = useDashboardStore((s) => s.rangePreset)
  const setRangePreset = useDashboardStore((s) => s.setRangePreset)

  return (
    <Tabs
      value={rangePreset}
      onValueChange={(value) => setRangePreset(value as DateRangePreset)}
    >
      <TabsList>
        {PRESETS.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
