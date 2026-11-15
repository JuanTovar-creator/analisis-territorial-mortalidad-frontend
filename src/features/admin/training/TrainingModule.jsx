import { useState } from 'react'
import { Activity, BarChart3, History, Settings } from 'lucide-react'
import { DemoNotice } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
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

      {/* Tab navigation */}
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1" aria-label="Secciones del módulo">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-slate-50 hover:text-slate-700'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </nav>

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
