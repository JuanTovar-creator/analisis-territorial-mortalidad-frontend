import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const PAGE_SIZE = 8

function formatPorcentaje(valor) {
  if (valor === null || valor === undefined) return 'No disponible'
  return `${valor.toFixed(2)}%`
}

function formatDiagnosticos(valor) {
  if (valor === null || valor === undefined) return 'No disponible'
  return valor.toLocaleString('es-CO')
}

export default function MunicipalitiesTable({ data, onSelectMunicipality }) {
  const [sortColumn, setSortColumn] = useState('municipio')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const sortedData = useMemo(() => {
    const sorted = [...data]
    sorted.sort((a, b) => {
      let aVal = a[sortColumn]
      let bVal = b[sortColumn]

      // Manejar valores nulos en ordenamiento
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [data, sortColumn, sortDirection])

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedData.slice(start, start + PAGE_SIZE)
  }, [sortedData, currentPage])

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <ChevronsUpDown size={14} className="text-muted-foreground" aria-hidden="true" />
    return sortDirection === 'asc'
      ? <ChevronUp size={14} className="text-primary" aria-hidden="true" />
      : <ChevronDown size={14} className="text-primary" aria-hidden="true" />
  }

  const columns = [
    { key: 'municipio', label: 'Municipio' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'promedioObservado', label: '% observado sin asistencia' },
    { key: 'promedioPredicho', label: '% predicho sin asistencia' },
    { key: 'totalDiagnosticos', label: 'Total diagnósticos' },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="cursor-pointer px-4 py-3 text-left font-medium text-muted-foreground hover:text-slate-700 select-none"
                    onClick={() => handleSort(col.key)}
                    role="columnheader"
                    aria-sort={sortColumn === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <SortIcon column={col.key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer hover:bg-slate-50/50"
                    onClick={() => onSelectMunicipality(row)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSelectMunicipality(row) }}
                    aria-label={`Ver detalle de ${row.municipio}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.municipio}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.departamento}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-700">{formatPorcentaje(row.promedioObservado)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-700">{formatPorcentaje(row.promedioPredicho)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{formatDiagnosticos(row.totalDiagnosticos)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No se encontraron municipios con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Mostrando {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, sortedData.length)} de {sortedData.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="h-8 px-2.5 text-xs"
              >
                Anterior
              </Button>
              {(() => {
                const delta = 2
                const range = []
                const rangeWithDots = []
                for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                  range.push(i)
                }
                if (currentPage - delta > 2) {
                  rangeWithDots.push(1, '...')
                } else {
                  rangeWithDots.push(1)
                }
                rangeWithDots.push(...range)
                if (currentPage + delta < totalPages - 1) {
                  rangeWithDots.push('...', totalPages)
                } else if (totalPages > 1) {
                  rangeWithDots.push(totalPages)
                }
                return rangeWithDots.map((page, idx) => {
                  if (page === '...') {
                    return <span key={`dots-${idx}`} className="px-1 text-muted-foreground">…</span>
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 px-0 text-xs"
                    >
                      {page}
                    </Button>
                  )
                })
              })()}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="h-8 px-2.5 text-xs"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
