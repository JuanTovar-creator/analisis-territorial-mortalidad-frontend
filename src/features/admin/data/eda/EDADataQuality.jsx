import { AlertCircle, CheckCircle2, OctagonX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EDADataQuality({ quality }) {
  const { missingValues, duplicates, overallCompleteness } = quality

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calidad de datos</CardTitle>
            <CardDescription className="mt-1">Valores faltantes, duplicados y completitud general (datos sintéticos).</CardDescription>
          </div>
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            Simulación de demostración
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Overall completeness */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Completitud general</span>
            <span className="text-sm font-semibold text-slate-800">{overallCompleteness}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${overallCompleteness}%` }}
              role="progressbar"
              aria-valuenow={overallCompleteness}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${overallCompleteness}% de completitud`}
            />
          </div>
        </div>

        {/* Missing values */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <OctagonX size={16} className="text-rose-500" aria-hidden="true" />
            Valores faltantes por variable
          </h4>
          <div className="flex flex-col gap-2">
            {missingValues.map((item) => (
              <div key={item.variable} className="flex items-center gap-3">
                <span className="w-44 shrink-0 truncate text-xs text-muted-foreground">{item.variable}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-rose-400"
                    style={{ width: `${Math.min(item.porcentaje * 10, 100)}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs font-medium text-slate-600">
                  {item.faltantes} ({item.porcentaje}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Duplicates */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <AlertCircle size={16} className="text-amber-500" aria-hidden="true" />
            Registros duplicados por fuente
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 text-left font-medium text-muted-foreground">Fuente</th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">Duplicados</th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">Porcentaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {duplicates.map((item) => (
                  <tr key={item.fuente}>
                    <td className="py-2 font-medium text-slate-700">{item.fuente}</td>
                    <td className="py-2 text-right text-slate-600">{item.registros_duplicados}</td>
                    <td className="py-2 text-right text-slate-600">{item.porcentaje}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
