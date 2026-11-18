import { AlertCircle, CheckCircle2, Info, Loader2, Play } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { modelTypes, demoDatasets, dataSplit } from '../demo/training-demo'

// Configuración de demo para la visualización
// En producción, estos datos se reciben del backend.
const demoConfig = {
  dataset: 'integrated',
  model: 'logistic-regression',
  params: {
    learning_rate: 0.01,
    regularization: 0.001,
  },
  split: dataSplit,
}

// Estado del entrenamiento en curso (datos de demo)
// En producción, el backend notifica el estado real.
const demoStatus = 'completed'
const demoProgress = 100

export default function TrainingExecution() {
  const selectedModel = modelTypes.find(m => m.id === demoConfig.model)
  const selectedDataset = demoDatasets.find(d => d.id === demoConfig.dataset)

  const statusMessages = {
    pending: {
      title: 'Entrenamiento pendiente',
      description: 'El backend aún no ha iniciado el entrenamiento.',
    },
    executing: {
      title: 'Entrenamiento en progreso',
      description: 'El backend está ejecutando el entrenamiento del modelo.',
    },
    completed: {
      title: 'Entrenamiento completado',
      description: 'El entrenamiento finalizó correctamente. Consulta los resultados en la pestaña correspondiente.',
    },
    error: {
      title: 'Error en el entrenamiento',
      description: 'El backend reportó un error durante el entrenamiento.',
    },
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

  const msg = statusMessages[demoStatus]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Ejecución del entrenamiento</h2>
      </div>

      {/* Configuration summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración utilizada</CardTitle>
          <CardDescription className="mt-1">
            Parámetros determinados por el backend para este entrenamiento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <dt className="text-xs text-muted-foreground">Modelo</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">
                {selectedModel?.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Dataset</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">
                {selectedDataset?.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Distribución</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">
                {demoConfig.split.train}/{demoConfig.split.validation}/{demoConfig.split.test}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Parámetros</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">
                {Object.entries(demoConfig.params).map(([k, v]) => `${k}: ${v}`).join(', ')}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Status card */}
      <Card className={statusStyles[demoStatus]}>
        <CardHeader>
          <div className="flex items-center gap-3">
            {demoStatus === 'executing' && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Loader2 size={20} className="animate-spin" aria-hidden="true" />
              </span>
            )}
            {demoStatus === 'completed' && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={20} aria-hidden="true" />
              </span>
            )}
            {demoStatus === 'error' && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                <AlertCircle size={20} aria-hidden="true" />
              </span>
            )}
            {demoStatus === 'pending' && (
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
                {Math.round(demoProgress)}%
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor[demoStatus]}`}
                style={{ width: `${demoProgress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(demoProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
        <Info size={16} className="mt-0.5 text-blue-600 shrink-0" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-blue-800">
            Estado suministrado por el backend
          </p>
          <p className="text-xs text-blue-700">
            El backend ejecuta el entrenamiento y notifica el progreso. Esta vista muestra el estado actual.
          </p>
        </div>
      </div>
    </div>
  )
}
