import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { metricResults } from '../demo/training-demo'

export default function ModelComparisonChart() {
  const lr = metricResults['logistic-regression']
  const dt = metricResults['decision-tree']

  const data = [
    { name: 'Accuracy', 'Regresión Logística': lr.accuracy, 'Árbol de Decisión': dt.accuracy },
    { name: 'Precision', 'Regresión Logística': lr.precision, 'Árbol de Decisión': dt.precision },
    { name: 'Recall', 'Regresión Logística': lr.recall, 'Árbol de Decisión': dt.recall },
    { name: 'F1-Score', 'Regresión Logística': lr.f1, 'Árbol de Decisión': dt.f1 },
    { name: 'ROC-AUC', 'Regresión Logística': lr.auc, 'Árbol de Decisión': dt.auc },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación entre modelos</CardTitle>
        <CardDescription className="mt-1">
          Datos sintéticos de demostración — ambos modelos presentan rendimiento similar. Ninguno se presenta como superior.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis
                domain={[0, 1]}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickCount={6}
              />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Regresión Logística" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Árbol de Decisión" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
