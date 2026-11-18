import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function formatPorcentaje(valor) {
  if (valor === null || valor === undefined) return 'No disponible'
  return `${valor.toFixed(2)}%`
}

function formatDiferencia(valor) {
  if (valor === null || valor === undefined) return 'No disponible'
  const sign = valor >= 0 ? '+' : ''
  return `${sign}${valor.toFixed(2)} pp`
}

function getDiferenciaColor(valor) {
  if (valor === null || valor === undefined) return ''
  if (valor > 0) return 'text-amber-600'
  if (valor < 0) return 'text-emerald-600'
  return 'text-slate-600'
}

export default function ComparisonTable({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de municipios</CardTitle>
        <CardDescription>
          Porcentaje de defunciones sin asistencia médica: valores observados vs. predichos por el modelo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Municipio</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Departamento</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Observado (%)</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Predicho (%)</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Diferencia (pp)</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Diagnósticos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(m => {
                const observado = m.promedioObservado
                const predicho = m.promedioPredicho
                const diff = (observado !== null && predicho !== null)
                  ? +(predicho - observado).toFixed(2)
                  : null

                return (
                  <tr key={m.id} className="hover:bg-slate-50/30">
                    <td className="px-4 py-2.5 font-medium text-slate-700">{m.municipio}</td>
                    <td className="px-4 py-2.5 text-slate-600">{m.departamento}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-700">
                      {formatPorcentaje(observado)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-700">
                      {formatPorcentaje(predicho)}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-mono ${getDiferenciaColor(diff)}`}>
                      {formatDiferencia(diff)}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-600">
                      {m.totalDiagnosticos !== null && m.totalDiagnosticos !== undefined
                        ? m.totalDiagnosticos
                        : 'No disponible'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
