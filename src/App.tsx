import type { JSX } from 'react'

function App(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">palvi-sales-dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Project setup complete · Tailwind v4 + shadcn/ui ready
        </p>
      </div>
    </div>
  )
}

export default App
