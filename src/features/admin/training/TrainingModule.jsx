import { useState } from 'react'
import { Activity, BarChart3, History, Settings } from 'lucide-react'
import { DemoNotice } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { TabNavigation } from '@/components/dashboard/TabNavigation'
import TrainingConfig from './config/TrainingConfig'
import TrainingExecution from './execution/TrainingExecution'
import TrainingResults from './results/TrainingResults'
import TrainingHistory from './history/TrainingHistory'
import { trainingHistory as preloadedHistory } from './demo/training-demo'

const tabs = [
  { id: 'config', label: 'Configuración', icon: Settings },
  { id: 'execution', label: 'Ejecución', icon: Activity },
  { id: 'results', label: 'Resultados', icon: BarChart3 },
  { id: 'history', label: 'Historial', icon: History },
]

export default function TrainingModule() {
  const [activeTab, setActiveTab] = useState('config')
  const [config, setConfig] = useState(null)
  const [sessionHistory, setSessionHistory] = useState([])
  const [completedModel, setCompletedModel] = useState(null)

  const handleStartExecution = (selectedConfig) => {
    setConfig(selectedConfig)
    setActiveTab('execution')
  }

  const handleExecutionComplete = (modelId) => {
    setCompletedModel(modelId)
    setActiveTab('results')
    // Agregar al historial de sesión
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      model: modelId,
      dataset: config?.dataset || 'integrated',
      split: '70/15/15',
      status: 'completed',
      accuracy: null, // Se llenará con los resultados
      source: 'session',
    }
    setSessionHistory(prev => [newEntry, ...prev])
  }

  const handleExecutionError = () => {
    // Agregar al historial de sesión como error
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      model: config?.model || 'logistic-regression',
      dataset: config?.dataset || 'integrated',
      split: '70/15/15',
      status: 'error',
      accuracy: null,
      source: 'session',
    }
    setSessionHistory(prev => [newEntry, ...prev])
  }

  const handleReset = () => {
    setConfig(null)
    setCompletedModel(null)
    setActiveTab('config')
  }

  const allHistory = [...sessionHistory, ...preloadedHistory]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="ENTRENAMIENTO"
        title="Entrenamiento de modelos"
        description="Configura, ejecuta y visualiza los resultados de entrenamientos de modelos de predicción de riesgo."
      />
      <DemoNotice />

      <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'config' && (
        <TrainingConfig onStartExecution={handleStartExecution} />
      )}

      {activeTab === 'execution' && (
        <TrainingExecution
          config={config}
          onComplete={handleExecutionComplete}
          onError={handleExecutionError}
          onReset={handleReset}
        />
      )}

      {activeTab === 'results' && (
        <TrainingResults completedModel={completedModel} />
      )}

      {activeTab === 'history' && (
        <TrainingHistory history={allHistory} />
      )}
    </div>
  )
}
