import { useEffect, useState } from 'react'
import { BarChart3, FileBarChart, History, Scale } from 'lucide-react'
import { DemoNotice, StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { TabNavigation } from '@/components/dashboard/TabNavigation'
import EvaluationView from './evaluation/EvaluationView'
import ModelComparison from './comparison/ModelComparison'
import PublishedModelView from './publication/PublishedModelView'
import PublicationHistory from './publication/PublicationHistory'
import { getPublicationHistory } from '@/services/evaluation'

const tabs = [
  { id: 'evaluation', label: 'Evaluación', icon: BarChart3 },
  { id: 'comparison', label: 'Comparación', icon: Scale },
  { id: 'publication', label: 'Publicación', icon: FileBarChart },
  { id: 'history', label: 'Historial', icon: History },
]

export default function EvaluationModule() {
  const [activeTab, setActiveTab] = useState('evaluation')
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setHistoryLoading(true)
    setHistoryError(null)
    getPublicationHistory()
      .then(data => {
        if (!cancelled) setHistory(data)
      })
      .catch(err => {
        if (!cancelled) setHistoryError(err.message || 'Error al cargar el historial')
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="EVALUACIÓN"
        title="Evaluación y publicación de modelos"
        description="Evalúa modelos entrenados, compara resultados y visualiza el modelo publicado."
      />
      <DemoNotice />

      <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'evaluation' && (
        <EvaluationView />
      )}

      {activeTab === 'comparison' && (
        <ModelComparison />
      )}

      {activeTab === 'publication' && (
        <PublishedModelView />
      )}

      {activeTab === 'history' && (
        historyLoading && (
          <StatePanel state="loading" title="Cargando historial" description="Obteniendo el historial de publicaciones..." />
        ) ||
        historyError && (
          <StatePanel state="error" title="Error al cargar el historial" description={historyError} />
        ) ||
        <PublicationHistory history={history} />
      )}
    </div>
  )
}
