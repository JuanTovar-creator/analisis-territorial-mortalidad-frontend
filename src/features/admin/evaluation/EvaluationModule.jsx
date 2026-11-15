import { useState } from 'react'
import { BarChart3, FileBarChart, History, Scale } from 'lucide-react'
import { DemoNotice } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { TabNavigation } from '@/components/dashboard/TabNavigation'
import EvaluationView from './evaluation/EvaluationView'
import ModelComparison from './comparison/ModelComparison'
import ModelPublication from './publication/ModelPublication'
import PublicationHistory from './publication/PublicationHistory'
import { publicationHistory as preloadedHistory } from './demo/evaluation-demo'

const tabs = [
  { id: 'evaluation', label: 'Evaluación', icon: BarChart3 },
  { id: 'comparison', label: 'Comparación', icon: Scale },
  { id: 'publication', label: 'Publicación', icon: FileBarChart },
  { id: 'history', label: 'Historial', icon: History },
]

export default function EvaluationModule() {
  const [activeTab, setActiveTab] = useState('evaluation')
  const [selectedModel, setSelectedModel] = useState(null) // modelo candidato para publicación
  const [publishedModel, setPublishedModel] = useState(null) // modelo publicado en la sesión
  const [sessionPublications, setSessionPublications] = useState([]) // historial de sesión

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId)
    setActiveTab('publication')
  }

  const handlePublicationComplete = (publication) => {
    // Reemplazar el modelo publicado activo
    setPublishedModel(publication)
    // Agregar al historial de sesión
    setSessionPublications(prev => [publication, ...prev])
  }

  const handlePublicationError = () => {
    // Agregar al historial de sesión como error
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      model: selectedModel?.model || 'logistic-regression',
      version: selectedModel?.version || 'v0.1.0-demo',
      dataset: selectedModel?.dataset || 'integrated',
      status: 'error',
      accuracy: null,
      source: 'session',
    }
    setSessionPublications(prev => [newEntry, ...prev])
  }

  const handleResetPublication = () => {
    setSelectedModel(null)
  }

  const allHistory = [...sessionPublications, ...preloadedHistory]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="EVALUACIÓN"
        title="Evaluación y publicación de modelos"
        description="Evalúa modelos entrenados, compara resultados y simula la publicación de un candidato."
      />
      <DemoNotice />

      <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'evaluation' && (
        <EvaluationView />
      )}

      {activeTab === 'comparison' && (
        <ModelComparison onSelectModel={handleSelectModel} />
      )}

      {activeTab === 'publication' && (
        <ModelPublication
          selectedModel={selectedModel}
          publishedModel={publishedModel}
          onComplete={handlePublicationComplete}
          onError={handlePublicationError}
          onReset={handleResetPublication}
        />
      )}

      {activeTab === 'history' && (
        <PublicationHistory history={allHistory} />
      )}
    </div>
  )
}
