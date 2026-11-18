import { useState } from 'react'
import { BarChart3, FileBarChart, Scale } from 'lucide-react'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { TabNavigation } from '@/components/dashboard/TabNavigation'
import EvaluationView from './evaluation/EvaluationView'
import ModelComparison from './comparison/ModelComparison'
import PublishedModelView from './publication/PublishedModelView'

const tabs = [
  { id: 'evaluation', label: 'Evaluación', icon: BarChart3 },
  { id: 'comparison', label: 'Comparación', icon: Scale },
  { id: 'publication', label: 'Publicación', icon: FileBarChart },
]

export default function EvaluationModule() {
  const [activeTab, setActiveTab] = useState('evaluation')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="EVALUACIÓN"
        title="Evaluación y publicación de modelos"
        description="Evalúa modelos entrenados, compara resultados y visualiza el modelo publicado."
      />

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

    </div>
  )
}
