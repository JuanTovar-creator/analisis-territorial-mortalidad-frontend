import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const PAGE_SIZE = 8

function estadoBadge(estado) {
  const styles = {
    'Completado': 'border-emerald-200 bg-emerald-50 text-emerald-700',
    'En proceso': 'border-amber-200 bg-amber-50 text-amber-700',
    'Pendiente': 'border-slate-200 bg-slate-50 text-slate-600',
  }
  return <Badge variant="outline" className={styles[estado] || styles['Pendiente']}>{estado}</Badge>
}

export default function IntegratedDatasetTable({ data, onExport }) {
  const [sortColumn, setSortColumn] = useState('municipio')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const sortedData = useMemo(() => {
    const sorted = [...data]
    sorted.sort((a, b) => {
      let aVal = a[sortColumn]
      let bVal = b[sortColumn]
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
    { key: 'tipo', label: 'Tipo' },
    { key: 'registros', label: 'Registros' },
    { key: 'variables', label: 'Variables' },
    { key: 'completitud', label: 'Completitud' },
    { key: 'estado', label: 'Estado' },
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
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.municipio}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.departamento}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.tipo}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{row.registros.toLocaleString('es-CO')}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{row.variables}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-700">{row.completitud}</td>
                    <td className="px-4 py-2.5">{estadoBadge(row.estado)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No se encontraron resultados.
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 px-0 text-xs ${currentPage === page ? 'bg-primary text-white' : ''}`}
                >
                  {page}
                </Button>
              ))}
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
