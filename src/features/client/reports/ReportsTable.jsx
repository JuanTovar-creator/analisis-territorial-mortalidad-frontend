import { useState } from 'react'
import { Eye, Download, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoBadge } from '@/components/dashboard/DemoBadge'

const PAGE_SIZE = 10

function estadoBadge(estado) {
  const styles = {
    disponible: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    generando: 'border-amber-200 bg-amber-50 text-amber-700',
    error: 'border-red-200 bg-red-50 text-red-700',
  }
  const labels = {
    disponible: 'Disponible',
    generando: 'Generando',
    error: 'Error',
  }
  return (
    <Badge variant="outline" className={styles[estado] || styles.disponible}>
      {labels[estado] || estado}
    </Badge>
  )
}

function tipoBadge(tipo) {
  const styles = {
    'riesgo-general': 'border-indigo-200 bg-indigo-50 text-indigo-700',
    socioeconomico: 'border-blue-200 bg-blue-50 text-blue-700',
    prediccion: 'border-purple-200 bg-purple-50 text-purple-700',
    comparativo: 'border-teal-200 bg-teal-50 text-teal-700',
  }
  return <Badge variant="outline" className={styles[tipo] || ''}>{tipo}</Badge>
}

export default function ReportsTable({ informes, onViewDetail, onDownload, downloadLoading }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(informes.length / PAGE_SIZE)
  const startIndex = (page - 1) * PAGE_SIZE
  const paginatedInformes = informes.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Informes disponibles</CardTitle>
          <DemoBadge />
        </div>
        <CardDescription>
          {informes.length} informe{informes.length !== 1 ? 's' : ''} encontrado{informes.length !== 1 ? 's' : ''}. Datos de demostración.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paginatedInformes.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 py-8 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-muted text-primary" aria-hidden="true">
              <Eye />
            </span>
            <h3 className="font-medium text-slate-800">No se encontraron informes</h3>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              No hay informes que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Título</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-36">Tipo</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Municipio</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Fecha</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Estado</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedInformes.map((informe) => (
                    <tr key={informe.id} className="hover:bg-slate-50/30">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{informe.id}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-700 line-clamp-1" title={informe.titulo}>
                          {informe.titulo}
                        </span>
                      </td>
                      <td className="px-4 py-3">{tipoBadge(informe.tipoLabel)}</td>
                      <td className="px-4 py-3 text-slate-600">{informe.municipio}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{informe.fechaGeneracion}</td>
                      <td className="px-4 py-3">{estadoBadge(informe.estado)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetail(informe.id)}
                            className="h-7 px-2 text-xs gap-1"
                            title="Ver detalle"
                          >
                            <Eye size={12} aria-hidden="true" />
                            Ver
                          </Button>
                          {informe.estado === 'disponible' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDownload(informe.id, 'pdf')}
                              disabled={downloadLoading === informe.id}
                              className="h-7 px-2 text-xs gap-1"
                              title="Descargar PDF"
                            >
                              {downloadLoading === informe.id ? (
                                <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                              ) : (
                                <Download size={12} aria-hidden="true" />
                              )}
                              PDF
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Mostrando {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, informes.length)} de {informes.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-7 px-2.5 text-xs"
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="h-7 w-7 px-0 text-xs"
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-7 px-2.5 text-xs"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
