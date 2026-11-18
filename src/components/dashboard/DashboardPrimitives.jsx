import { AlertCircle, Info } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DataNotice({ children = 'Los datos mostrados provienen de fuentes oficiales (DANE, RIPS) y modelos predictivos entrenados con información real.' }) {
  return (
    <Alert className="border-primary/20 bg-primary/5 text-foreground [&>svg]:text-primary">
      <Info data-icon="inline-start" />
      <AlertTitle className="flex flex-wrap items-center gap-2">
        Nota sobre los datos
      </AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export function MetricCard({ label, value, detail, icon: Icon, tone = 'primary' }) {
  return (
    <Card className="min-w-0 border-slate-200/80 shadow-sm shadow-slate-900/[0.02]">
      <CardContent className="flex items-start justify-between gap-3 pt-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">{value}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone === 'secondary' ? 'bg-violet-100 text-violet-700' : 'bg-primary/10 text-primary'}`}>
          <Icon aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  )
}

export function StatePanel({ state = 'empty', title, description, className = '' }) {
  if (state === 'loading') {
    return (
      <Card className={className} aria-busy="true" aria-label="Cargando contenido">
        <CardContent className="flex flex-col gap-3 py-6">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-24 w-full" />
          <span className="sr-only" role="status">Cargando contenido</span>
        </CardContent>
      </Card>
    )
  }

  if (state === 'error') {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle data-icon="inline-start" />
        <AlertTitle>{title || 'No fue posible cargar la información'}</AlertTitle>
        <AlertDescription>{description || 'Intenta nuevamente más tarde.'}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="flex min-h-40 flex-col items-center justify-center gap-2 py-8 text-center">
        <span className="grid size-10 place-items-center rounded-full bg-muted text-primary" aria-hidden="true">
          <Info />
        </span>
        <h3 className="font-medium text-slate-800">{title || 'Aún no hay información disponible'}</h3>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{description || 'Este espacio se completará cuando se conecten las fuentes de datos correspondientes.'}</p>
      </CardContent>
    </Card>
  )
}
