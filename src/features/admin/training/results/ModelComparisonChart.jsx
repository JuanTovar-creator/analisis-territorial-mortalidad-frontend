import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ModelComparisonChart({ modelA, modelB }) {
  if (!modelA || !modelB) return null

  const data = [
    { name: 'Accuracy', [modelA.name]: modelA.metrics.accuracy, [modelB.name]: modelB.metrics.accuracy },
    { name: 'Precision', [modelA.name]: modelA.metrics.precision, [modelB.name]: modelB.metrics.precision },
    { name: 'Recall', [modelA.name]: modelA.metrics.recall, [modelB.name]: modelB.metrics.recall },
    { name: 'F1-Score', [modelA.name]: modelA.metrics.f1, [modelB.name]: modelB.metrics.f1 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación entre modelos</CardTitle>
        <CardDescription className="mt-1">
          Resultados reales de evaluación sobre el conjunto de validación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis
                domain={[0, 100]}
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
              <Bar dataKey={modelA.name} fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey={modelB.name} fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
