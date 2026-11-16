import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { modelTypes, metricResults } from '../demo/training-demo'
import MetricsCards from './MetricsCards'
import MetricsChart from './MetricsChart'
import ModelComparisonChart from './ModelComparisonChart'
import ConfusionMatrix from './ConfusionMatrix'

export default function TrainingResults() {
  const [selectedModel, setSelectedModel] = useState('logistic-regression')
  const metrics = metricResults[selectedModel]
  const modelName = modelTypes.find(m => m.id === selectedModel)?.name || ''

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Resultados del entrenamiento</h2>
        <DemoBadge>Datos sintéticos de demostración</DemoBadge>
      </div>

      {/* Model selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seleccionar modelo</CardTitle>
          <CardDescription className="mt-1">
            Consulta los resultados de ambos modelos. Ninguno se presenta como superior.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full sm:w-[320px]">
              <SelectValue placeholder="Selecciona un modelo" />
            </SelectTrigger>
            <SelectContent>
              {modelTypes.map(mt => (
                <SelectItem key={mt.id} value={mt.id}>
                  {mt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Metrics cards */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Métricas — {modelName}
        </h3>
        <MetricsCards metrics={metrics} />
      </div>

      {/* Metrics chart */}
      <MetricsChart metrics={metrics} />

      {/* Confusion matrix */}
      <ConfusionMatrix
        confusionMatrix={metrics.confusionMatrix}
        positiveClass={metrics.positiveClass}
      />

      {/* Model comparison */}
      <ModelComparisonChart />
    </div>
  )
}
