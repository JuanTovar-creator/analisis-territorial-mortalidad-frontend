import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Play, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { modelTypes } from '../demo/training-demo'

const statusMessages = {
  pending: {
    title: 'Entrenamiento pendiente',
    description: 'La configuración está lista. Inicia la simulación para comenzar el entrenamiento.',
  },
  executing: {
    title: 'Entrenamiento en progreso',
    description: 'Simulando el entrenamiento del modelo. Este proceso tarda entre 8 y 12 segundos.',
  },
  completed: {
    title: 'Entrenamiento completado',
    description: 'La simulación del entrenamiento finalizó correctamente. Los resultados son datos sintéticos.',
  },
  error: {
    title: 'Error en el entrenamiento',
    description: 'La simulación encontró un error. Esto es parte de la demostración.',
  },
}

export default function TrainingExecution({ config, onComplete, onError, onReset }) {
  const [status, setStatus] = useState('pending')
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const timersRef = useRef([])
  const intervalRef = useRef(null)

  const modelName = config
    ? modelTypes.find(m => m.id === config?.model)?.name || 'Modelo desconocido'
    : 'Modelo desconocido'

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t))
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const runSimulation = () => {
    if (status === 'executing') return

    setStatus('executing')
    setProgress(0)
    setElapsed(0)
    timersRef.current = []

    // Duration: 8-12 seconds
    const duration = 8000 + Math.random() * 4000
    const simulateError = Math.random() < 0.15 // 15% chance of simulated error
    const errorAt = simulateError ? 3000 + Math.random() * 2000 : 0

    // Progress interval
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 100)
      setProgress(prev => {
        const next = prev + (100 / (duration / 100))
        return Math.min(next, 99)
      })
    }, 100)

    // Complete or error timer
    const completeTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current)

      if (simulateError && elapsed >= errorAt) {
        setStatus('error')
        setProgress(100)
        onError()
      } else if (!simulateError) {
        setStatus('completed')
        setProgress(100)
        onComplete(config?.model)
      }
    }, duration)

    // Error timer (if simulating error)
    if (simulateError) {
      const errorTimer = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setStatus('error')
        setProgress(100)
        onError()
      }, errorAt)
      timersRef.current.push(errorTimer)
    }

    timersRef.current.push(completeTimer)
  }

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
    setStatus('pending')
    setProgress(0)
    setElapsed(0)
    onReset()
  }

  const statusStyles = {
    pending: 'border-slate-200 bg-slate-50/50',
    executing: 'border-primary/40 bg-primary/5',
    completed: 'border-emerald-200 bg-emerald-50/50',
    error: 'border-rose-200 bg-rose-50/50',
  }

  const progressColor = {
    pending: 'bg-slate-300',
    executing: 'bg-primary',
    completed: 'bg-emerald-500',
    error: 'bg-rose-400',
  }

  const msg = statusMessages[status]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Ejecución del entrenamiento</h2>
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
          Simulación de demostración — no se entrena un modelo real
        </Badge>
      </div>

      {/* Configuration summary */}
      {config && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen de configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <dt className="text-xs text-muted-foreground">Modelo</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{modelName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Dataset</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">
                  {config.dataset === 'integrated' ? 'Integrado (demo)' : 'Municipal (demo)'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Distribución</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">70/15/15</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Parámetros</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">
                  {Object.entries(config.params || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Status card */}
      <Card className={statusStyles[status]}>
        <CardHeader>
          <div className="flex items-center gap-3">
            {status === 'executing' && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Loader2 size={20} className="animate-spin" aria-hidden="true" />
              </span>
            )}
            {status === 'completed' && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={20} aria-hidden="true" />
              </span>
            )}
            {status === 'error' && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                <AlertCircle size={20} aria-hidden="true" />
              </span>
            )}
            {status === 'pending' && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400">
                <Play size={20} aria-hidden="true" />
              </span>
            )}
            <div>
              <CardTitle className="text-base">{msg.title}</CardTitle>
              <CardDescription className="mt-1">{msg.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progreso</span>
              <span className="text-xs font-medium text-slate-700">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor[status]}`}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            {status === 'executing' && (
              <p className="text-[11px] text-muted-foreground">
                Tiempo transcurrido: {(elapsed / 1000).toFixed(1)}s
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {status === 'pending' && (
          <Button onClick={runSimulation} className="gap-2">
            <Play size={16} aria-hidden="true" />
            Iniciar simulación
          </Button>
        )}
        {status === 'executing' && (
          <Button disabled className="gap-2">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Entrenando...
          </Button>
        )}
        {(status === 'completed' || status === 'error') && (
          <>
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw size={16} aria-hidden="true" />
              Nueva simulación
            </Button>
            {status === 'completed' && (
              <p className="text-sm text-emerald-700">
                Simulación completada — los resultados son datos sintéticos.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-rose-700">
                Error simulado — esto es parte de la demostración.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
