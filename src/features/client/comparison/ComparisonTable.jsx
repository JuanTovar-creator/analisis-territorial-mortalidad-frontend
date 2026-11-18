import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function riesgoBadge(riesgo) {
  const styles = {
    'Bajo': 'border-emerald-200 bg-emerald-50 text-emerald-700',
    'Moderado': 'border-blue-200 bg-blue-50 text-blue-700',
    'Alto': 'border-amber-200 bg-amber-50 text-amber-700',
    'Muy alto': 'border-red-200 bg-red-50 text-red-700',
  }
  return <Badge variant="outline" className={styles[riesgo] || styles['Moderado']}>{riesgo}</Badge>
}

const indicators = [
  { key: 'municipio', label: 'Municipio', type: 'text' },
  { key: 'departamento', label: 'Departamento', type: 'text' },
  { key: 'tipo', label: 'Tipo', type: 'text' },
  { key: 'riesgo', label: 'Nivel de riesgo', type: 'badge' },
  { key: 'poblacion', label: 'Población', type: 'number', format: (v) => v.toLocaleString('es-CO') },
  { key: 'coberturaSanitaria', label: 'Cobertura sanitaria', type: 'percent' },
  { key: 'tasaMortalidad', label: 'Tasa mortalidad', type: 'number', suffix: '/1,000 hab.' },
  { key: 'accesoAgua', label: 'Acceso a agua potable', type: 'percent' },
  { key: 'indicePobreza', label: 'Índice de pobreza', type: 'number' },
]

export default function ComparisonTable({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicadores comparativos</CardTitle>
        <CardDescription>
          Comparación de indicadores, niveles de riesgo y predicciones entre municipios seleccionados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-40">Indicador</th>
                {data.map(m => (
                  <th key={m.id} className="px-4 py-3 text-left font-medium text-slate-700">
                    <div className="flex flex-col">
                      <span className="whitespace-nowrap">{m.municipio}</span>
                      <span className="text-xs font-normal text-muted-foreground">{m.departamento}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {indicators.map((ind) => (
                <tr key={ind.key} className="hover:bg-slate-50/30">
                  <td className="px-4 py-2.5 font-medium text-muted-foreground">{ind.label}</td>
                  {data.map(m => {
                    let value = m[ind.key]
                    let cellContent

                    if (ind.type === 'badge') {
                      cellContent = riesgoBadge(value)
                    } else if (ind.type === 'percent') {
                      cellContent = <span className="text-slate-700">{value}%</span>
                    } else if (ind.type === 'number' && ind.format) {
                      cellContent = <span className="text-slate-700">{ind.format(value)}</span>
                    } else if (ind.type === 'number' && ind.suffix) {
                      cellContent = (
                        <span className="text-slate-700">
                          {value} <span className="text-xs text-muted-foreground">{ind.suffix}</span>
                        </span>
                      )
                    } else {
                      cellContent = <span className="text-slate-700">{value}</span>
                    }

                    return (
                      <td key={m.id} className="px-4 py-2.5">
                        {cellContent}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
