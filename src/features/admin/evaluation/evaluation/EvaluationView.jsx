import { useEffect, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MetricsCards from '@/features/admin/training/results/MetricsCards'
import MetricsChart from '@/features/admin/training/results/MetricsChart'
import ConfusionMatrix from '@/features/admin/training/results/ConfusionMatrix'
import { getModelComparison } from '@/services/modelComparison'

// Mapeo de modelos del backend a nombres amigables
const MODELS = [
  { id: 'regresion_lineal', name: 'Regresión Lineal' },
  { id: 'random_forest', name: 'Random Forest' },
]

export default function EvaluationView() {
  const [model, setModel] = useState('regresion_lineal')
  const [comparisonData, setComparisonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getModelComparison()
      .then(data => {
        if (!cancelled) {
          setComparisonData(data)
          // Verificar si el modelo seleccionado existe en los datos
          if (data.modelos && !data.modelos[model]) {
            // Cambiar al primer modelo disponible
            const available = Object.keys(data.modelos)[0]
            if (available) setModel(available)
          }
        }
      })
      .catch(err => {
        if (!cancelled) {
          if (err.message && err.message.includes('404')) {
            setError('Los modelos aún no han sido entrenados y evaluados. Primero debes ejecutar el entrenamiento desde el módulo correspondiente.')
          } else {
            setError(err.message || 'Error al cargar las métricas de evaluación')
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const selectedModelDef = MODELS.find(m => m.id === model)
  const modelData = comparisonData?.modelos?.[model]

  // Extraer métricas de clasificación del modelo seleccionado
  const classificationMetrics = modelData?.metricas_clasificacion_validacion || null
  const regressionMetrics = modelData?.metricas_validacion || null

  // Métricas de clasificación formateadas para los componentes visuales
  // El backend devuelve proporciones (0.0-1.0), las convertimos a porcentajes para visualización
  const displayMetrics = classificationMetrics ? {
    accuracy: classificationMetrics.accuracy * 100,
    precision: classificationMetrics.precision * 100,
    recall: classificationMetrics.recall * 100,
    f1: classificationMetrics.f1_score * 100,
  } : null

  // Matriz de confusión del backend
  const confusionMatrix = classificationMetrics?.matriz_confusion ? {
    tp: classificationMetrics.matriz_confusion.TP,
    tn: classificationMetrics.matriz_confusion.TN,
    fp: classificationMetrics.matriz_confusion.FP,
    fn: classificationMetrics.matriz_confusion.FN,
  } : null

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

  if (!comparisonData || !modelData) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel title="Sin métricas de evaluación" description="No hay resultados de evaluación disponibles. Los modelos deben ser entrenados y evaluados primero." />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Evaluación de modelos</CardTitle>
            <CardDescription className="mt-1">
              Consulta las métricas de evaluación de cada modelo sobre el conjunto de validación.
            </CardDescription>
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
                  {MODELS.map(mt => (
                    <SelectItem key={mt.id} value={mt.id}>
                      {mt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedModelDef && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedModelDef.name} — métricas de validación sobre el conjunto de validación (15%).
                </p>
              )}
            </FieldContent>
          </Field>

          {/* Métricas de regresión */}
          {regressionMetrics && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Métricas de regresión — {selectedModelDef?.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">MAE</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {regressionMetrics.MAE?.toFixed(4) ?? '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">RMSE</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {regressionMetrics.RMSE?.toFixed(4) ?? '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">R²</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {regressionMetrics.R2?.toFixed(4) ?? '—'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metrics cards - clasificación */}
          {displayMetrics && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Métricas de clasificación — {selectedModelDef?.name}
              </h3>
              <MetricsCards metrics={displayMetrics} />
            </div>
          )}

          {/* Metrics chart */}
          {displayMetrics && <MetricsChart metrics={displayMetrics} />}

          {/* Confusion matrix */}
          {confusionMatrix && (
            <ConfusionMatrix
              confusionMatrix={confusionMatrix}
              positiveClass="Riesgo de mortalidad evitable (sí)"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
