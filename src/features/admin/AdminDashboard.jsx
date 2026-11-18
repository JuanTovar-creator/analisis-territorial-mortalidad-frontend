import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  AlertCircle,
  Loader2,
  BarChart3,
  FileText,
  GitBranch,
  Activity,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { useDemoAuth } from '@/features/auth/AuthContext'
import { getEDAStatus, getEDADane } from '@/services/data'
import { getModelComparison } from '@/services/modelComparison'
import { request } from '@/services/api'

function StatusBadge({ status }) {
  if (status === 'ok') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <CheckCircle2 size={12} aria-hidden="true" /> Disponible
      </span>
    )
  }
  if (status === 'loading') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        <Loader2 size={12} className="animate-spin" aria-hidden="true" /> Verificando
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
      <AlertCircle size={12} aria-hidden="true" /> No disponible
    </span>
  )
}

function SystemStatusCard({ backendStatus, daneStatus, evaluationStatus, daneDetails, evaluationDetails }) {
  return (
    <Card className="border-slate-200/80 shadow-sm shadow-slate-900/[0.02]">
      <CardHeader>
        <CardTitle className="text-base">Estado del sistema</CardTitle>
        <CardDescription>Disponibilidad de los componentes conectados al backend.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                <Database size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">Backend API</p>
                <p className="text-xs text-muted-foreground">Servicio de datos y modelos</p>
              </div>
            </div>
            <StatusBadge status={backendStatus} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <FileText size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">Datos DANE</p>
                {daneDetails && (
                  <p className="text-xs text-muted-foreground">
                    {daneDetails.dimensiones?.filas?.toLocaleString() ?? '?'} filas · {daneDetails.dimensiones?.columnas ?? '?'} columnas
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={daneStatus} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600">
                <BarChart3 size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">Resultados de evaluación</p>
                {evaluationDetails && (
                  <p className="text-xs text-muted-foreground">
                    {evaluationDetails.length} modelo{evaluationDetails.length !== 1 ? 's' : ''} entrenado{evaluationDetails.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={evaluationStatus} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectSummaryCard() {
  return (
    <Card className="border-slate-200/80 shadow-sm shadow-slate-900/[0.02]">
      <CardHeader>
        <CardTitle className="text-base">Resumen del proyecto</CardTitle>
        <CardDescription>Información general del sistema de predicción.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-slate-800 mb-2">Finalidad</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Predecir el riesgo de mortalidad evitable por falta de oportunidad en la atención médica en zonas rurales, utilizando modelos de aprendizaje automático entrenados con datos oficiales.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800 mb-2">Fuentes de datos</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">DANE</Badge>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">RIPS</Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800 mb-2">Modelos implementados</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">Regresión Lineal</Badge>
              <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">Random Forest</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickAccessCard() {
  return (
    <Card className="border-slate-200/80 shadow-sm shadow-slate-900/[0.02]">
      <CardHeader>
        <CardTitle className="text-base">Accesos rápidos</CardTitle>
        <CardDescription>Navega directamente a los módulos principales.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Button
            asChild
            variant="outline"
            className="flex items-center justify-between gap-3 self-start rounded-xl border-slate-200 bg-blue-50/50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800"
          >
            <Link to="/admin/data" className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-600">
                <GitBranch size={15} aria-hidden="true" />
              </span>
              <span>Análisis exploratorio (EDA)</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex items-center justify-between gap-3 self-start rounded-xl border-slate-200 bg-violet-50/50 px-4 py-3 text-sm font-medium text-violet-700 hover:bg-violet-50 hover:text-violet-800"
          >
            <Link to="/admin/evaluation" className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-600">
                <BarChart3 size={15} aria-hidden="true" />
              </span>
              <span>Evaluación de modelos</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function LastActivityCard({ evaluationDetails, daneDetails }) {
  const items = []

  if (evaluationDetails && evaluationDetails.length > 0) {
    evaluationDetails.forEach((model) => {
      const fecha = model.entrenado_en || model.generado_en
      if (fecha) {
        items.push({
          title: `Modelo ${model.nombre || model.tipo || 'desconocido'} entrenado`,
          detail: fecha,
          tone: 'complete',
        })
      }
    })
  }

  if (daneDetails && daneDetails.generado_en) {
    items.push({
      title: 'Datos DANE actualizados',
      detail: daneDetails.generado_en,
      tone: 'complete',
    })
  }

  if (items.length === 0) return null

  return (
    <Card className="border-slate-200/80 shadow-sm shadow-slate-900/[0.02]">
      <CardHeader>
        <CardTitle className="text-base">Última actividad</CardTitle>
        <CardDescription>Eventos recientes obtenidos del backend.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {items.map((item, index) => (
            <li key={index} className="flex gap-3 py-3 first:pt-1 last:pb-1">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={14} aria-hidden="true" />
              </span>
              <div className={`min-w-0 flex-1 ${index < items.length - 1 ? 'border-b border-slate-100 pb-3' : ''}`}>
                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { user } = useDemoAuth()

  const [backendStatus, setBackendStatus] = useState('loading')
  const [daneStatus, setDaneStatus] = useState('loading')
  const [daneDetails, setDaneDetails] = useState(null)
  const [evaluationStatus, setEvaluationStatus] = useState('loading')
  const [evaluationDetails, setEvaluationDetails] = useState(null)

  useEffect(() => {
    let cancelled = false

    // Verificar backend con /eda/status (endpoint ligero)
    getEDAStatus()
      .then((data) => {
        if (!cancelled) {
          setBackendStatus('ok')
          // Si DANE está disponible en el status, marcarlo
          if (data.dane?.disponible) {
            setDaneStatus('ok')
          } else {
            setDaneStatus('unavailable')
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBackendStatus('unavailable')
          setDaneStatus('unavailable')
        }
      })

    // Obtener detalles de DANE
    getEDADane()
      .then((data) => {
        if (!cancelled) {
          setDaneStatus('ok')
          setDaneDetails(data)
        }
      })
      .catch(() => {
        if (!cancelled) setDaneStatus('unavailable')
      })

    // Obtener resultados de evaluación
    getModelComparison()
      .then((data) => {
        if (!cancelled) {
          setEvaluationStatus('ok')
          // Los datos pueden ser un array o un objeto con modelos
          if (Array.isArray(data)) {
            setEvaluationDetails(data)
          } else if (data.modelos || data.models) {
            setEvaluationDetails(data.modelos || data.models)
          } else {
            setEvaluationDetails([data])
          }
        }
      })
      .catch(() => {
        if (!cancelled) setEvaluationStatus('unavailable')
      })

    return () => { cancelled = true }
  }, [])

  const userName = user?.name || 'Administrador'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CENTRO DE CONTROL"
        title={`Bienvenido, ${userName}`}
        description="Sistema de predicción de riesgo de mortalidad evitable por falta de oportunidad en la atención médica en zonas rurales."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <SystemStatusCard
          backendStatus={backendStatus}
          daneStatus={daneStatus}
          evaluationStatus={evaluationStatus}
          daneDetails={daneDetails}
          evaluationDetails={evaluationDetails}
        />
        <ProjectSummaryCard />
      </div>

      <QuickAccessCard />

      <LastActivityCard
        evaluationDetails={evaluationDetails}
        daneDetails={daneDetails}
      />
    </div>
  )
}
