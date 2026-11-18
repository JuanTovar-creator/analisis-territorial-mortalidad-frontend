import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Muestra las estadísticas descriptivas numéricas de un dataset.
 * Para RIPS: mínimo, p25, mediana, p75, media, desviación estándar, máximo y suma.
 *
 * Props:
 * - stats: objeto con minimo, p25, mediana, p75, media, desviacion_estandar, maximo, suma.
 * - title: título de la sección (por defecto "Estadísticas de atenciones").
 * - description: descripción de la sección.
 */
export default function EDANumericStats({ stats, title, description }) {
  if (!stats) return null

  const metricas = [
    { label: 'Mínimo', value: stats.minimo, key: 'minimo' },
    { label: 'Percentil 25', value: stats.p25, key: 'p25' },
    { label: 'Mediana', value: stats.mediana, key: 'mediana' },
    { label: 'Percentil 75', value: stats.p75, key: 'p75' },
    { label: 'Media', value: stats.media, key: 'media' },
    { label: 'Desv. Estándar', value: stats.desviacion_estandar, key: 'desviacion_estandar' },
    { label: 'Máximo', value: stats.maximo, key: 'maximo' },
    { label: 'Suma total', value: stats.suma, key: 'suma' },
  ]

  const formatValue = (val) => {
    if (val == null || val === undefined) return '—'
    if (typeof val === 'number') {
      // Números grandes: formato con separador de miles
      if (Math.abs(val) >= 1000) {
        return val.toLocaleString('es-CO', { maximumFractionDigits: 0 })
      }
      // Números decimales: 2 decimales
      return val.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    return val
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? 'Estadísticas de atenciones'}</CardTitle>
        <CardDescription className="mt-1">
          {description ?? 'Resumen estadístico del número de atenciones por municipio y diagnóstico.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metricas.map(m => (
            <div key={m.key} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">{m.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {formatValue(m.value)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
