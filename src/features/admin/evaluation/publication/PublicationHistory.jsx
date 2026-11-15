import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { modelTypes, demoDatasets } from '@/features/admin/training/demo/training-demo'

function formatDateTime(isoString) {
  const date = new Date(isoString)
  return {
    date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  }
}

function getModelName(id) {
  return modelTypes.find(m => m.id === id)?.name || id
}

function getDatasetName(id) {
  return demoDatasets.find(d => d.id === id)?.name || id
}

export default function PublicationHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock size={24} className="mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            No hay publicaciones registradas aún.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Historial de publicaciones</h2>
        <Badge variant="outline" className="border-slate-200 text-slate-500">
          Vista previa del módulo
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publicaciones recientes</CardTitle>
          <CardDescription className="mt-1">
            Lista de publicaciones simuladas dentro del módulo. No sustituye el módulo de Historial general.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Hora</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Modelo</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Versión</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Dataset</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Accuracy</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Origen</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => {
                  const { date, time } = formatDateTime(entry.date)
                  const isSession = entry.source === 'session'
                  return (
                    <tr key={entry.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 text-sm text-slate-700">{date}</td>
                      <td className="py-3 text-sm text-slate-700">{time}</td>
                      <td className="py-3 text-sm text-slate-700">
                        {getModelName(entry.model)}
                      </td>
                      <td className="py-3 text-sm text-slate-700">{entry.version}</td>
                      <td className="py-3 text-sm text-slate-700">
                        {getDatasetName(entry.dataset)}
                      </td>
                      <td className="py-3">
                        {entry.status === 'published' && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 size={14} aria-hidden="true" />
                            Publicado
                          </span>
                        )}
                        {entry.status === 'error' && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700">
                            <AlertTriangle size={14} aria-hidden="true" />
                            Error
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-sm text-slate-700">
                        {entry.accuracy != null ? `${(entry.accuracy * 100).toFixed(0)}%` : '—'}
                      </td>
                      <td className="py-3">
                        {isSession ? (
                          <Badge variant="outline" className="text-[11px] border-primary/30 bg-primary/5 text-primary">
                            Publicación de sesión
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[11px] border-slate-200 bg-slate-50 text-slate-500">
                            Datos precargados
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Las publicaciones marcadas como "Datos precargados" son ficticias y forman parte de la demostración.
            Las marcadas como "Publicación de sesión" corresponden a las simulaciones ejecutadas en esta sesión.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
