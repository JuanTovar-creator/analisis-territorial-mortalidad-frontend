import { FileText, Filter, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ReportsFilters({
  municipios,
  departamentos,
  tipos,
  search,
  departamento,
  tipo,
  municipio,
  fechaDesde,
  fechaHasta,
  onSearch,
  onDepartamento,
  onTipo,
  onMunicipio,
  onFechaDesde,
  onFechaHasta,
  onReset,
  activeFiltersCount,
}) {
  const hasActiveFilters = activeFiltersCount > 0

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium text-muted-foreground">Filtros</p>
            {hasActiveFilters && (
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">
                {activeFiltersCount} activo{hasActiveFilters > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs gap-1">
              <X size={12} aria-hidden="true" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="reports-search">Buscar</FieldLabel>
            <Input
              id="reports-search"
              type="text"
              placeholder="Título, municipio, departamento..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="bg-white"
            />
          </Field>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="reports-department">Departamento</FieldLabel>
            <Select value={departamento} onValueChange={(value) => onDepartamento(value)} items={[{ label: 'Todos', value: '' }, ...departamentos.map(d => ({ label: d, value: d }))]}>
              <SelectTrigger id="reports-department" className="w-full bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">Todos los departamentos</SelectItem>
                  {departamentos.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="reports-type">Tipo de informe</FieldLabel>
            <Select value={tipo} onValueChange={(value) => onTipo(value)} items={[{ label: 'Todos', value: '' }, ...tipos.map(t => ({ label: t.label, value: t.id }))]}>
              <SelectTrigger id="reports-type" className="w-full bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  {tipos.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="reports-municipality">Municipio</FieldLabel>
            <Select value={municipio} onValueChange={(value) => onMunicipio(value)} items={[{ label: 'Todos', value: '' }, ...municipios.map(m => ({ label: m.nombre, value: m.nombre }))]}>
              <SelectTrigger id="reports-municipality" className="w-full bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">Todos los municipios</SelectItem>
                  {municipios.map((m) => (
                    <SelectItem key={m.id} value={m.nombre}>{m.nombre}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="reports-date-from">Fecha desde</FieldLabel>
            <Input
              id="reports-date-from"
              type="date"
              value={fechaDesde}
              onChange={(e) => onFechaDesde(e.target.value)}
              className="bg-white"
            />
          </Field>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="reports-date-to">Fecha hasta</FieldLabel>
            <Input
              id="reports-date-to"
              type="date"
              value={fechaHasta}
              onChange={(e) => onFechaHasta(e.target.value)}
              className="bg-white"
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}
