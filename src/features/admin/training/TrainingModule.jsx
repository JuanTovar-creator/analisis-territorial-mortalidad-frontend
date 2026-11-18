import { useEffect, useState } from 'react'
import { Activity, BarChart3, History, Settings } from 'lucide-react'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { TabNavigation } from '@/components/dashboard/TabNavigation'
import TrainingConfigView from './config/TrainingConfigView'
import TrainingExecution from './execution/TrainingExecution'
import TrainingResults from './results/TrainingResults'
import TrainingHistory from './history/TrainingHistory'
import { getTrainingHistory } from '@/services/training'

const tabs = [
  { id: 'config', label: 'Configuración', icon: Settings },
  { id: 'execution', label: 'Ejecución', icon: Activity },
  { id: 'results', label: 'Resultados', icon: BarChart3 },
  { id: 'history', label: 'Historial', icon: History },
]

export default function TrainingModule() {
  const [activeTab, setActiveTab] = useState('config')
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setHistoryLoading(true)
    setHistoryError(null)
    getTrainingHistory()
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
        eyebrow="ENTRENAMIENTO"
        title="Entrenamiento de modelos"
        description="Visualiza la configuración, progreso, resultados e historial de entrenamientos de modelos."
      />

      <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'config' && (
        <TrainingConfigView />
      )}

      {activeTab === 'execution' && (
        <TrainingExecution />
      )}

      {activeTab === 'results' && (
        <TrainingResults />
      )}

      {activeTab === 'history' && (
        historyLoading && (
          <StatePanel state="loading" title="Cargando historial" description="Obteniendo el historial de entrenamientos..." />
        ) ||
        historyError && (
          <StatePanel state="error" title="Error al cargar el historial" description={historyError} />
        ) ||
        <TrainingHistory history={history} />
      )}
    </div>
  )
}
