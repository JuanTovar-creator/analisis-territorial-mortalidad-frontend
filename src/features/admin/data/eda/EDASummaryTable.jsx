import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EDASummaryTable({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen por categoría</CardTitle>
        <CardDescription className="mt-1">Variables, registros y completitud por grupo de datos (ficticio).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 text-left font-medium text-muted-foreground">Categoría</th>
                <th className="pb-2 text-right font-medium text-muted-foreground">Variables</th>
                <th className="pb-2 text-right font-medium text-muted-foreground">Registros</th>
                <th className="pb-2 text-right font-medium text-muted-foreground">Completitud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr key={row.categoria}>
                  <td className="py-2.5 font-medium text-slate-800">{row.categoria}</td>
                  <td className="py-2.5 text-right text-slate-600">{row.variables}</td>
                  <td className="py-2.5 text-right text-slate-600">{row.registros.toLocaleString('es-CO')}</td>
                  <td className="py-2.5 text-right font-medium text-slate-700">{row.completitud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
