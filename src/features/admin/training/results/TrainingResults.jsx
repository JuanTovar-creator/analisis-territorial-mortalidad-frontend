import { useEffect, useState } from 'react'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { modelTypes } from '../demo/training-demo'
import { getTrainingResults } from '@/services/training'
import MetricsCards from './MetricsCards'
import MetricsChart from './MetricsChart'
import ModelComparisonChart from './ModelComparisonChart'
import ConfusionMatrix from './ConfusionMatrix'

export default function TrainingResults() {
  const [selectedModel, setSelectedModel] = useState('logistic-regression')
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getTrainingResults(selectedModel)
      .then(data => {
        if (!cancelled) setMetrics(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar los resultados')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [selectedModel])

  const modelName = modelTypes.find(m => m.id === selectedModel)?.name || ''

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel state="loading" title="Cargando resultados" description="Obteniendo las métricas del entrenamiento..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel state="error" title="Error al cargar resultados" description={error} />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel title="Sin resultados" description="No hay resultados de entrenamiento disponibles. El backend debe completar un entrenamiento primero." />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Resultados del entrenamiento</h2>
      </div>

      {/* Model selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seleccionar modelo</CardTitle>
          <CardDescription className="mt-1">
            Consulta los resultados de ambos modelos. Ninguno se presenta como superior.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full sm:w-[320px]">
              <SelectValue placeholder="Selecciona un modelo" />
            </SelectTrigger>
            <SelectContent>
              {modelTypes.map(mt => (
                <SelectItem key={mt.id} value={mt.id}>
                  {mt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Metrics cards */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Métricas — {modelName}
        </h3>
        <MetricsCards metrics={metrics} />
      </div>

      {/* Metrics chart */}
      <MetricsChart metrics={metrics} />

      {/* Confusion matrix */}
      {metrics.confusionMatrix && (
        <ConfusionMatrix
          confusionMatrix={metrics.confusionMatrix}
          positiveClass={metrics.positiveClass}
        />
      )}

      {/* Model comparison */}
      <ModelComparisonChart />
    </div>
  )
}
