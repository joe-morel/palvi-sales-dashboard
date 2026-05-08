import type { JSX } from 'react'
import { DatasetSwitcher } from '@/components/dataset/DatasetSwitcher'
import { RangeSelect } from '@/components/dataset/RangeSelect'

export function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 md:px-6">
        <h1 className="text-base font-semibold">Sales Dashboard</h1>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <DatasetSwitcher />
          <RangeSelect />
        </div>
      </div>
    </header>
  )
}
