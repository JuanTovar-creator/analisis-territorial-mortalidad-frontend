import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { integratedDataset } from '../demo/data-demo'
import DatasetToolbar from './DatasetToolbar'
import IntegratedDatasetTable from './IntegratedDatasetTable'

export default function DatasetView() {
  const [search, setSearch] = useState('')
  const [departamento, setDepartamento] = useState('all')
  const [tipo, setTipo] = useState('all')

  // Get unique departments from data
  const departamentos = useMemo(() => {
    const depts = new Set(integratedDataset.map(item => item.departamento))
    return Array.from(depts).sort()
  }, [])

  // Filter data
  const filteredData = useMemo(() => {
    return integratedDataset.filter(item => {
      const matchSearch = !search || item.municipio.toLowerCase().includes(search.toLowerCase())
      const matchDepto = departamento === 'all' || item.departamento === departamento
      const matchTipo = tipo === 'all' || item.tipo === tipo
      return matchSearch && matchDepto && matchTipo
    })
  }, [search, departamento, tipo])

  // Export CSV
  const handleExport = () => {
    const headers = ['Municipio', 'Departamento', 'Tipo', 'Registros', 'Variables', 'Completitud', 'Estado']
    const rows = filteredData.map(item => [
      item.municipio,
      item.departamento,
      item.tipo,
      item.registros,
      item.variables,
      item.completitud,
      item.estado,
    ])

    const csvContent = [
      'DEMOSTRACIÓN — Datos ficticios, no representan información real.',
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dataset-demo.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Dataset integrado</h2>
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
          Simulación de demostración
        </Badge>
      </div>

      <DatasetToolbar
        search={search}
        onSearchChange={setSearch}
        departamento={departamento}
        onDepartamentoChange={setDepartamento}
        tipo={tipo}
        onTipoChange={setTipo}
        departamentos={departamentos}
        onExport={handleExport}
      />

      <IntegratedDatasetTable data={filteredData} />

      <p className="text-xs text-muted-foreground">
        {filteredData.length} registros encontrados · Los datos son ficticios y solo sirven para demostrar la funcionalidad de la interfaz.
      </p>
    </div>
  )
}
