import type { JSX, ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,var(--app-bg-top)_0%,var(--background)_42%)] text-foreground">
      {children}
    </div>
  )
}
