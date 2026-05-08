import type { JSX, ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps): JSX.Element {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>
}
