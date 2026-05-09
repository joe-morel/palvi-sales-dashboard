import { create } from 'zustand'
import type { DatasetKey } from '@/types/metrics'

export type DateRangePreset = '7d' | '30d' | '90d'

export const PRESET_DAYS: Record<DateRangePreset, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

interface DashboardState {
  datasetKey: DatasetKey
  rangePreset: DateRangePreset
  setDatasetKey: (key: DatasetKey) => void
  setRangePreset: (preset: DateRangePreset) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  datasetKey: 'A',
  rangePreset: '7d',
  setDatasetKey: (key) => set({ datasetKey: key }),
  setRangePreset: (preset) => set({ rangePreset: preset }),
}))
