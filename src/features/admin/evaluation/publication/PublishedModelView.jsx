import { useEffect, useState } from 'react'
import { CheckCircle2, Package } from 'lucide-react'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { modelTypes, demoDatasets } from '@/features/admin/training/demo/training-demo'
import { getPublishedModel } from '@/services/evaluation'

function formatDateTime(isoString) {
  const date = new Date(isoString)
  return {
    date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  }
}

function getModelName(id) {
  return modelTypes.find(m => m.id === id)?.name || id
}

function getDatasetName(id) {
  return demoDatasets.find(d => d.id === id)?.name || id
}

export default function PublishedModelView() {
  const [publishedModel, setPublishedModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getPublishedModel()
      .then(data => {
        if (!cancelled) setPublishedModel(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar el modelo publicado')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel state="loading" title="Cargando modelo publicado" description="Obteniendo la información del modelo activo..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel state="error" title="Error al cargar modelo publicado" description={error} />
      </div>
    )
  }

  if (!publishedModel) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package size={24} className="mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-700">
            No hay un modelo publicado actualmente.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            El backend debe publicar un modelo antes de que pueda visualizarse aquí.
          </p>
        </CardContent>
      </Card>
    )
  }

  const modelName = getModelName(publishedModel.model)
  const datasetName = getDatasetName(publishedModel.dataset)
  const { date, time } = formatDateTime(publishedModel.publishedAt)
  const metrics = publishedModel.metrics

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Modelo publicado</h2>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
        <Package size={16} className="mt-0.5 text-blue-600 shrink-0" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-blue-800">
            Vista de solo lectura
          </p>
          <p className="text-xs text-blue-700">
            El modelo publicado es determinado y gestionado por el backend. El frontend solo visualiza el modelo activo actualmente.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-xl border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={16} aria-hidden="true" />
              Modelo activo
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Model info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">Modelo</p>
              <p className="text-sm font-semibold text-slate-800">{modelName}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">Versión</p>
              <p className="text-sm font-semibold text-slate-800">{publishedModel.version}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">Dataset</p>
              <p className="text-sm font-semibold text-slate-800">{datasetName}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">Fecha de publicación</p>
              <p className="text-sm font-semibold text-slate-800">
                {date} a las {time}
              </p>
            </div>
          </div>

          {/* Metrics */}
          {metrics && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Métricas del modelo publicado</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-lg font-bold text-slate-800">{(metrics.accuracy * 100).toFixed(0)}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Precision</p>
                  <p className="text-lg font-bold text-slate-800">{(metrics.precision * 100).toFixed(0)}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Recall</p>
                  <p className="text-lg font-bold text-slate-800">{(metrics.recall * 100).toFixed(0)}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">F1-Score</p>
                  <p className="text-lg font-bold text-slate-800">{(metrics.f1 * 100).toFixed(0)}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">ROC-AUC</p>
                  <p className="text-lg font-bold text-slate-800">{(metrics.auc * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
