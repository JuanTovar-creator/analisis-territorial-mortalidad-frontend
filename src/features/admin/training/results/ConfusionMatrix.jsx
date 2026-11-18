import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConfusionMatrix({ confusionMatrix, positiveClass }) {
  if (!confusionMatrix) return null

  const { tp, tn, fp, fn } = confusionMatrix
  const total = tp + tn + fp + fn
  const negativeClass = 'Riesgo de mortalidad evitable (no)'

  const cellStyle = (type) => {
    if (type === 'tp' || type === 'tn') return 'bg-emerald-50 border-emerald-200 text-emerald-800'
    if (type === 'fp') return 'bg-amber-50 border-amber-200 text-amber-800'
    if (type === 'fn') return 'bg-rose-50 border-rose-200 text-rose-800'
    return 'bg-slate-50 border-slate-200 text-slate-800'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matriz de confusión</CardTitle>
        <CardDescription className="mt-1">
          Resultados reales de validación — clase positiva: {positiveClass}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground" />
                <th colSpan={2} className="p-2 text-center text-xs font-semibold text-slate-700">
                  Predicho
                </th>
              </tr>
              <tr className="border-t border-slate-200">
                <th className="p-2 text-left text-xs font-medium text-muted-foreground" />
                <th className="p-2 text-center text-xs font-medium text-slate-600">
                  {positiveClass}
                </th>
                <th className="p-2 text-center text-xs font-medium text-slate-600">
                  {negativeClass}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="p-2 text-xs font-medium text-slate-600 align-top">
                  <div className="flex items-center gap-1">
                    <span className="sr-only">Real</span>
                    {positiveClass}
                  </div>
                </td>
                <td className={`p-2 text-center border border-slate-200 rounded-l-lg ${cellStyle('tp')}`}>
                  <div className="font-bold text-lg">{tp}</div>
                  <div className="text-[11px] font-medium">TP</div>
                  <div className="text-[10px] opacity-70">
                    {((tp / total) * 100).toFixed(1)}%
                  </div>
                </td>
                <td className={`p-2 text-center border border-slate-200 ${cellStyle('fn')}`}>
                  <div className="font-bold text-lg">{fn}</div>
                  <div className="text-[11px] font-medium">FN</div>
                  <div className="text-[10px] opacity-70">
                    {((fn / total) * 100).toFixed(1)}%
                  </div>
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="p-2 text-xs font-medium text-slate-600 align-top">
                  {negativeClass}
                </td>
                <td className={`p-2 text-center border border-slate-200 ${cellStyle('fp')}`}>
                  <div className="font-bold text-lg">{fp}</div>
                  <div className="text-[11px] font-medium">FP</div>
                  <div className="text-[10px] opacity-70">
                    {((fp / total) * 100).toFixed(1)}%
                  </div>
                </td>
                <td className={`p-2 text-center border border-slate-200 rounded-r-lg ${cellStyle('tn')}`}>
                  <div className="font-bold text-lg">{tn}</div>
                  <div className="text-[11px] font-medium">TN</div>
                  <div className="text-[10px] opacity-70">
                    {((tn / total) * 100).toFixed(1)}%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded bg-emerald-100 border border-emerald-300" />
            <span>Correcto (TP / TN)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded bg-amber-100 border border-amber-300" />
            <span>Falso positivo (FP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded bg-rose-100 border border-rose-300" />
            <span>Falso negativo (FN)</span>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Total: {total} muestras · Accuracy: {(((tp + tn) / total) * 100).toFixed(1)}%
        </p>
      </CardContent>
    </Card>
  )
}
