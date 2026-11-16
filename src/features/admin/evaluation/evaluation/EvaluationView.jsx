import { useEffect, useState } from 'react'
import { BarChart3, Info } from 'lucide-react'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MetricsCards from '@/features/admin/training/results/MetricsCards'
import MetricsChart from '@/features/admin/training/results/MetricsChart'
import ConfusionMatrix from '@/features/admin/training/results/ConfusionMatrix'
import { modelTypes } from '@/features/admin/training/demo/training-demo'
import { getEvaluationMetrics } from '@/services/evaluation'

export default function EvaluationView() {
  const [model, setModel] = useState('logistic-regression')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getEvaluationMetrics(model)
      .then(data => {
        if (!cancelled) setResults(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar las métricas de evaluación')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [model])

  const selectedModelDef = modelTypes.find(m => m.id === model)

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel state="loading" title="Cargando evaluación" description="Obteniendo las métricas del modelo..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel state="error" title="Error al cargar evaluación" description={error} />
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel title="Sin métricas de evaluación" description="No hay resultados de evaluación disponibles. El backend debe completar la evaluación primero." />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Evaluación de modelos</CardTitle>
              <CardDescription className="mt-1">
                Consulta las métricas de evaluación final de cada modelo sobre el 15% de prueba.
              </CardDescription>
            </div>
            <DemoBadge>Datos sintéticos de demostración</DemoBadge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Model selector */}
          <Field>
            <FieldLabel htmlFor="eval-model-select">Modelo a evaluar</FieldLabel>
            <FieldContent>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="eval-model-select" className="w-full sm:w-[400px]">
                  <BarChart3 size={16} className="text-muted-foreground" aria-hidden="true" />
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
              {selectedModelDef && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedModelDef.name} — métricas de demostración sobre el conjunto de prueba (15%).
                </p>
              )}
            </FieldContent>
          </Field>

          {/* Context notice */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <Info size={16} className="mt-0.5 text-blue-600 shrink-0" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-blue-800">
                Demostración de evaluación final
              </p>
              <p className="text-xs text-blue-700">
                Las métricas mostradas representan una demostración de evaluación final sobre el 15% de prueba, respetando la distribución 70% entrenamiento, 15% validación y 15% prueba. No se ejecutó una evaluación real.
              </p>
              <p className="text-xs text-blue-700">
                Esta interfaz está preparada para recibir resultados reales de la API en una etapa posterior.
              </p>
            </div>
          </div>

          {/* Metrics cards */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Métricas — {selectedModelDef?.name}
            </h3>
            <MetricsCards metrics={results} />
          </div>

          {/* Metrics chart */}
          <MetricsChart metrics={results} />

          {/* Confusion matrix */}
          {results.confusionMatrix && (
            <ConfusionMatrix
              confusionMatrix={results.confusionMatrix}
              positiveClass={results.positiveClass}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
