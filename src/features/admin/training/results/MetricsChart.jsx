import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function MetricsChart({ metrics }) {
  if (!metrics) return null

  const data = [
    { name: 'Accuracy', value: metrics.accuracy },
    { name: 'Precision', value: metrics.precision },
    { name: 'Recall', value: metrics.recall },
    { name: 'F1-Score', value: metrics.f1 },
    { name: 'ROC-AUC', value: metrics.auc },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de clasificación</CardTitle>
        <CardDescription className="mt-1">
          Datos sintéticos de demostración — no representan resultados reales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
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
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
