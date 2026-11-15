import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Play, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { pipelineStages } from '../demo/data-demo'

const stageIcons = {
  'shield-check': CheckCircle2,
  sparkles: Sparkles,
  'arrow-right-left': ArrowRight,
  combine: ArrowRight,
  'database-zip': CheckCircle2,
}

const stageMessages = {
  validation: {
    pending: 'Esperando inicio del proceso.',
    progress: 'Verificando estructura de columnas y tipos de datos...',
    complete: 'Estructura y tipos validados correctamente.',
    error: 'Error al validar la estructura de datos.',
  },
  cleaning: {
    pending: 'Esperando validación previa.',
    progress: 'Eliminando duplicados y manejando valores nulos...',
    complete: 'Datos limpios sin duplicados ni valores faltantes críticos.',
    error: 'Error durante la limpieza de datos.',
  },
  transformation: {
    pending: 'Esperando limpieza previa.',
    progress: 'Normalizando y estandarizando variables...',
    complete: 'Variables normalizadas y estandarizadas.',
    error: 'Error durante la transformación.',
  },
  aggregation: {
    pending: 'Esperando transformación previa.',
    progress: 'Consolidando datos por municipio y periodo...',
    complete: 'Datos consolidados por municipio y periodo.',
    error: 'Error durante la agregación.',
  },
  integration: {
    pending: 'Esperando agregación previa.',
    progress: 'Unificando fuentes en dataset final...',
    complete: 'Dataset integrado listo para uso.',
    error: 'Error durante la integración.',
  },
}

function StageCard({ stage, status, progress, message }) {
  const Icon = stageIcons[stage.icon] || Sparkles

  const statusStyles = {
    pending: 'border-slate-200 bg-slate-50/50',
    progress: 'border-primary/40 bg-primary/5',
    complete: 'border-emerald-200 bg-emerald-50/50',
    error: 'border-rose-200 bg-rose-50/50',
  }

  const iconStyles = {
    pending: 'bg-slate-100 text-slate-400',
    progress: 'bg-primary/10 text-primary',
    complete: 'bg-emerald-100 text-emerald-700',
    error: 'bg-rose-100 text-rose-700',
  }

  return (
    <Card className={`border transition-colors ${statusStyles[status]}`}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconStyles[status]}`}>
            {status === 'progress' ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <Icon size={18} aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">{stage.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stage.description}</p>
          </div>
        </div>
        {status !== 'pending' && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Progreso</span>
              <span className="text-[11px] font-medium text-slate-700">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  status === 'error' ? 'bg-rose-400' : status === 'complete' ? 'bg-emerald-500' : 'bg-primary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] leading-4 text-muted-foreground">{message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ProcessingPipeline() {
  const [stages, setStages] = useState(
    pipelineStages.map(s => ({ ...s, status: 'pending', progress: 0 }))
  )
  const [isRunning, setIsRunning] = useState(false)
  const timersRef = useRef([])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t))
      timersRef.current = []
    }
  }, [])

  const runSimulation = () => {
    if (isRunning) return

    setIsRunning(true)
    const allStages = pipelineStages.map(s => ({ ...s, status: 'pending', progress: 0 }))
    setStages(allStages)
    timersRef.current = []

    let stageIndex = 0

    function runStage(index) {
      if (index >= pipelineStages.length) {
        setIsRunning(false)
        return
      }

      // Set current stage to progress
      setStages(prev => {
        const next = [...prev]
        next[index] = { ...next[index], status: 'progress', progress: 0 }
        return next
      })

      // Animate progress
      let progress = 0
      const progressTimer = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(progressTimer)
        }
        setStages(prev => {
          const next = [...prev]
          next[index] = { ...next[index], progress }
          return next
        })
      }, 200)

      // Complete stage after delay
      const completeTimer = setTimeout(() => {
        clearInterval(progressTimer)
        setStages(prev => {
          const next = [...prev]
          next[index] = { ...next[index], status: 'complete', progress: 100 }
          return next
        })
        stageIndex = index + 1
        runStage(stageIndex)
      }, 1500 + Math.random() * 1000)

      timersRef.current.push(completeTimer)
    }

    runStage(0)
  }

  const allComplete = stages.every(s => s.status === 'complete')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Pipeline de procesamiento</h2>
        <DemoBadge>Simulación de demostración — no se procesan datos reales</DemoBadge>
      </div>

      <div className="flex flex-col gap-4">
        {stages.map((stage, index) => {
          const message = stageMessages[stage.id]?.[stage.status] || ''
          return (
            <div key={stage.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  stage.status === 'complete' ? 'bg-emerald-100 text-emerald-700'
                    : stage.status === 'progress' ? 'bg-primary/10 text-primary'
                    : stage.status === 'error' ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {index + 1}
                </span>
                {index < stages.length - 1 && (
                  <div className={`mt-1 h-8 w-px ${
                    stage.status === 'complete' ? 'bg-emerald-300' : 'bg-slate-200'
                  }`} />
                )}
              </div>
              <div className="flex-1 pb-4">
                <StageCard
                  stage={stage}
                  status={stage.status}
                  progress={stage.progress}
                  message={message}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={runSimulation}
          disabled={isRunning}
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Ejecutando simulación...
            </>
          ) : allComplete ? (
            <>
              <Play size={16} aria-hidden="true" />
              Reejecutar simulación
            </>
          ) : (
            <>
              <Play size={16} aria-hidden="true" />
              Simular ejecución
            </>
          )}
        </Button>
        {allComplete && (
          <p className="text-sm text-emerald-700">
            Simulación completada — todas las etapas finalizadas.
          </p>
        )}
      </div>
    </div>
  )
}
