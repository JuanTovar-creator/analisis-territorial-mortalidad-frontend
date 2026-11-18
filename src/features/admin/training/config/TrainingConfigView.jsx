import { Database, GitBranch, Settings2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { demoDatasets, modelTypes, dataSplit } from '../demo/training-demo'

// Configuración utilizada en la demo
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

export default function TrainingConfigView() {
  const selectedDataset = demoDatasets.find(d => d.id === demoConfig.dataset)
  const selectedModel = modelTypes.find(m => m.id === demoConfig.model)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuración del entrenamiento</CardTitle>
              <CardDescription className="mt-1">
                Visualiza la configuración utilizada para el entrenamiento. Los parámetros son determinados por el backend.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {/* Dataset */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Database size={16} className="text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-800">Dataset</h3>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">
                {selectedDataset?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedDataset?.records.toLocaleString()} registros con {selectedDataset?.variables} variables.
              </p>
            </div>
          </div>

          {/* Model */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings2 size={16} className="text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-800">Modelo</h3>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">
                {selectedModel?.name}
              </p>
            </div>
          </div>

          {/* Data split */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GitBranch size={16} className="text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-800">Distribución de datos</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Entrenamiento</p>
                <p className="text-lg font-bold text-slate-800">{demoConfig.split.train}%</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Validación</p>
                <p className="text-lg font-bold text-slate-800">{demoConfig.split.validation}%</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Prueba</p>
                <p className="text-lg font-bold text-slate-800">{demoConfig.split.test}%</p>
              </div>
            </div>
          </div>

          {/* Parameters */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Parámetros del modelo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedModel?.params.map((param) => (
                <div key={param.key} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-muted-foreground mb-1">{param.label}</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {demoConfig.params[param.key]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rango: {param.min} — {param.max}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Info notice */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <Settings2 size={16} className="mt-0.5 text-blue-600 shrink-0" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-blue-800">
                Configuración determinada por el backend
              </p>
              <p className="text-xs text-blue-700">
                El backend configura y ejecuta los modelos. El frontend solo visualiza la configuración utilizada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
