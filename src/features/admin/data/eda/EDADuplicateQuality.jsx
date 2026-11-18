import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Muestra las métricas de calidad de un dataset EDA:
 * duplicados exactos, nulos por columna, vacíos por columna, y espacios.
 *
 * Props:
 * - quality: objeto con duplicados_exactos, nulos_por_columna, vacios_por_columna,
 *   y opcionalmente solo_espacios_por_columna, espacios_ext_por_columna, espacios_por_columna.
 */
export default function EDADuplicateQuality({ quality }) {
  if (!quality) return null

  const duplicados = quality.duplicados_exactos ?? 0
  const nulos = quality.nulos_por_columna || {}
  const vacios = quality.vacios_por_columna || {}
  const soloEspacios = quality.solo_espacios_por_columna || {}
  const espaciosExt = quality.espacios_ext_por_columna || {}
  const espacios = quality.espacios_por_columna || {}

  // Columnas con nulos o vacíos
  const columnasConProblemas = new Set([
    ...Object.keys(nulos),
    ...Object.keys(vacios),
  ])

  // Columnas con problemas de espacios
  const columnasConEspacios = new Set([
    ...Object.keys(soloEspacios),
    ...Object.keys(espaciosExt),
    ...Object.keys(espacios),
  ])

  // Filtrar solo columnas que tienen valores > 0
  const filasNulosVacios = Array.from(columnasConProblemas)
    .filter(col => (nulos[col] || 0) > 0 || (vacios[col] || 0) > 0)
    .map(col => ({
      columna: col,
      nulos: nulos[col] || 0,
      vacios: vacios[col] || 0,
    }))

  const filasEspacios = Array.from(columnasConEspacios)
    .filter(col => (soloEspacios[col] || 0) > 0 || (espaciosExt[col] || 0) > 0 || (espacios[col] || 0) > 0)
    .map(col => ({
      columna: col,
      solo_espacios: soloEspacios[col] || 0,
      espacios_ext: espaciosExt[col] || 0,
      espacios: espacios[col] || 0,
    }))

  const tieneProblemas = duplicados > 0 || filasNulosVacios.length > 0 || filasEspacios.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Calidad de datos
          {duplicados > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {duplicados.toLocaleString()} duplicados exactos
            </Badge>
          )}
          {duplicados === 0 && (
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 ml-auto">
              Sin duplicados
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="mt-1">
          Duplicados, valores nulos, celdas vacías y problemas de espacios por columna.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!tieneProblemas ? (
          <p className="text-sm text-emerald-600">Sin problemas de calidad detectados.</p>
        ) : (
          <div className="space-y-4">
            {filasNulosVacios.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Nulos y vacíos por columna
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="pb-2 pr-4 font-medium">Columna</th>
                        <th className="pb-2 pr-4 text-right font-medium">Nulos</th>
                        <th className="pb-2 text-right font-medium">Vacíos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filasNulosVacios.map(fila => (
                        <tr key={fila.columna} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs text-slate-700">{fila.columna}</td>
                          <td className="py-2 pr-4 text-right text-slate-700">
                            {fila.nulos > 0 ? (
                              <Badge variant="secondary">{fila.nulos.toLocaleString()}</Badge>
                            ) : '—'}
                          </td>
                          <td className="py-2 text-right text-slate-700">
                            {fila.vacios > 0 ? (
                              <Badge variant="secondary">{fila.vacios.toLocaleString()}</Badge>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filasEspacios.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Problemas de espacios por columna
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="pb-2 pr-4 font-medium">Columna</th>
                        <th className="pb-2 pr-4 text-right font-medium">Solo espacios</th>
                        <th className="pb-2 pr-4 text-right font-medium">Espacios ext</th>
                        <th className="pb-2 text-right font-medium">Espacios</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filasEspacios.map(fila => (
                        <tr key={fila.columna} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs text-slate-700">{fila.columna}</td>
                          <td className="py-2 pr-4 text-right text-slate-700">
                            {fila.solo_espacios > 0 ? (
                              <Badge variant="secondary">{fila.solo_espacios.toLocaleString()}</Badge>
                            ) : '—'}
                          </td>
                          <td className="py-2 pr-4 text-right text-slate-700">
                            {fila.espacios_ext > 0 ? (
                              <Badge variant="secondary">{fila.espacios_ext.toLocaleString()}</Badge>
                            ) : '—'}
                          </td>
                          <td className="py-2 text-right text-slate-700">
                            {fila.espacios > 0 ? (
                              <Badge variant="secondary">{fila.espacios.toLocaleString()}</Badge>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
