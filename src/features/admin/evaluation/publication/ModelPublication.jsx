import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, FileText, Loader2, Package, RotateCcw, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MetricsCards from '@/features/admin/training/results/MetricsCards'
import { metricResults, modelTypes, demoDatasets } from '@/features/admin/training/demo/training-demo'
import { demoVersion, availableVersions } from '../demo/evaluation-demo'

const statusMessages = {
  pending: {
    title: 'Publicación pendiente',
    description: 'Revisa la información del modelo y confirma la publicación simulada.',
  },
  publishing: {
    title: 'Publicando modelo',
    description: 'Simulando la publicación del modelo. Este proceso tarda entre 5 y 8 segundos.',
  },
  published: {
    title: 'Modelo publicado',
    description: 'La simulación de publicación finalizó correctamente. No se realizó una publicación real.',
  },
  error: {
    title: 'Error en la publicación',
    description: 'La simulación encontró un error. Esto es parte de la demostración.',
  },
}

export default function ModelPublication({ selectedModel, publishedModel, onComplete, onError, onReset }) {
  const [status, setStatus] = useState('pending')
  const [progress, setProgress] = useState(0)
  const [version, setVersion] = useState(demoVersion)
  const timersRef = useRef([])
  const intervalRef = useRef(null)

  const modelName = selectedModel
    ? modelTypes.find(m => m.id === selectedModel.model)?.name || 'Modelo desconocido'
    : null

  const results = selectedModel ? metricResults[selectedModel.model] : null

  // Check if this model+version is already published in session
  const isDuplicate = publishedModel &&
    publishedModel.model === selectedModel?.model &&
    publishedModel.version === version &&
    publishedModel.status === 'published'

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t))
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Reset state when selectedModel changes
  useEffect(() => {
    if (selectedModel) {
      setStatus('pending')
      setProgress(0)
      setVersion(demoVersion)
    }
  }, [selectedModel])

  const runPublication = () => {
    if (status === 'publishing') return
    if (!selectedModel) return
    if (isDuplicate) return

    setStatus('publishing')
    setProgress(0)
    timersRef.current = []

    // Duration: 5-8 seconds
    const duration = 5000 + Math.random() * 3000
    const simulateError = Math.random() < 0.1 // 10% chance of simulated error

    // Progress interval
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (duration / 100))
        return Math.min(next, 99)
      })
    }, 100)

    // Complete or error timer
    const completeTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current)

      if (simulateError) {
        setStatus('error')
        setProgress(100)
        onError()
      } else {
        setStatus('published')
        setProgress(100)

        const publication = {
          id: Date.now(),
          date: new Date().toISOString(),
          model: selectedModel.model,
          version: version,
          dataset: 'integrated',
          status: 'published',
          accuracy: results?.accuracy || null,
          source: 'session',
        }
        onComplete(publication)
      }
    }, duration)

    timersRef.current.push(completeTimer)
  }

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
    setStatus('pending')
    setProgress(0)
    onReset()
  }

  const statusStyles = {
    pending: 'border-slate-200 bg-slate-50/50',
    publishing: 'border-primary/40 bg-primary/5',
    published: 'border-emerald-200 bg-emerald-50/50',
    error: 'border-rose-200 bg-rose-50/50',
  }

  const statusIcons = {
    pending: FileText,
    publishing: Loader2,
    published: CheckCircle2,
    error: AlertCircle,
  }

  const statusIconColors = {
    pending: 'text-slate-400',
    publishing: 'text-primary animate-spin',
    published: 'text-emerald-500',
    error: 'text-rose-500',
  }

  const StatusIcon = statusIcons[status]

  // No model selected
  if (!selectedModel) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Publicación del modelo</CardTitle>
            <CardDescription className="mt-1">
              Selecciona un modelo candidato desde la pestaña Comparación para comenzar la publicación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package size={48} className="mb-4 text-muted-foreground/40" aria-hidden="true" />
              <h3 className="text-sm font-medium text-slate-700 mb-1">
                No hay modelo seleccionado
              </h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Ve a la pestaña <strong>Comparación</strong> y selecciona un modelo como candidato para publicación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Published model in session */}
      {publishedModel && publishedModel.status === 'published' && (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-500" aria-hidden="true" />
                <div>
                  <CardTitle className="text-base">
                    Modelo publicado en esta sesión
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    {modelTypes.find(m => m.id === publishedModel.model)?.name} — {publishedModel.version}
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Publicado en esta sesión
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Dataset</span>
                <p className="font-medium text-slate-700">
                  {demoDatasets.find(d => d.id === publishedModel.dataset)?.name || publishedModel.dataset}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Fecha</span>
                <p className="font-medium text-slate-700">
                  {new Date(publishedModel.date).toLocaleString('es-ES')}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Accuracy</span>
                <p className="font-medium text-slate-700">
                  {publishedModel.accuracy ? publishedModel.accuracy.toFixed(2) : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Estado</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Publicado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className={statusStyles[status]}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon size={20} className={statusIconColors[status]} aria-hidden="true" />
              <div>
                <CardTitle>{statusMessages[status].title}</CardTitle>
                <CardDescription className="mt-1">
                  {statusMessages[status].description}
                </CardDescription>
              </div>
            </div>
            <DemoBadge>Simulación de demostración</DemoBadge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Model info */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Información del modelo candidato
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Modelo</span>
                <p className="font-medium text-slate-700">{modelName}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Dataset</span>
                <p className="font-medium text-slate-700">
                  {demoDatasets.find(d => d.id === 'integrated')?.name || 'integrated'}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Fecha</span>
                <p className="font-medium text-slate-700">
                  {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Version selector */}
            <div className="mt-4">
              <Field>
                <FieldLabel htmlFor="version-select">Versión de demostración</FieldLabel>
                <FieldContent>
                  <Select
                    value={version}
                    onValueChange={(v) => {
                      setVersion(v)
                      // Reset status if version changes
                      if (status === 'published' || status === 'error') {
                        setStatus('pending')
                        setProgress(0)
                      }
                    }}
                    disabled={status === 'publishing'}
                  >
                    <SelectTrigger id="version-select" className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Selecciona una versión" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVersions.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>
          </div>

          {/* Metrics */}
          {results && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Métricas del modelo
              </h3>
              <MetricsCards metrics={results} />
            </div>
          )}

          {/* Progress bar */}
          {status === 'publishing' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progreso de publicación</span>
                <span className="font-medium text-slate-700">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Duplicate warning */}
          {isDuplicate && status !== 'published' && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <AlertCircle size={16} className="mt-0.5 text-amber-600 shrink-0" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-amber-800">
                  Modelo ya publicado
                </p>
                <p className="text-xs text-amber-700">
                  Este modelo y versión ya están publicados en la sesión. Selecciona una versión diferente para publicar.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {status === 'pending' && (
              <Button
                onClick={runPublication}
                disabled={isDuplicate}
                className="gap-2"
              >
                <Upload size={16} aria-hidden="true" />
                Publicar modelo (simulado)
              </Button>
            )}
            {status === 'published' && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw size={16} aria-hidden="true" />
                Reiniciar publicación
              </Button>
            )}
            {status === 'error' && (
              <div className="flex gap-2">
                <Button
                  onClick={runPublication}
                  className="gap-2"
                >
                  <Upload size={16} aria-hidden="true" />
                  Reintentar publicación
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Reiniciar
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Esta acción simula una publicación. No se realiza una publicación real.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
