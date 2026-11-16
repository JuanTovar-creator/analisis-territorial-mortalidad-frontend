import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function MunicipalitiesFilters({ search, onSearchChange, departamento, onDepartamentoChange, riesgo, onRiesgoChange, departamentos, riesgos }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="municipality-search">Buscar municipio</FieldLabel>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="municipality-search"
                type="text"
                placeholder="Ej: Municipio A"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
          </Field>
          <Field className="gap-1.5">
            <FieldLabel htmlFor="department-filter">Departamento</FieldLabel>
            <Select value={departamento} onValueChange={(value) => onDepartamentoChange(value)} items={[{ label: 'Todos', value: '' }, ...departamentos.map(d => ({ label: d, value: d }))]}>
              <SelectTrigger id="department-filter" className="w-full bg-white"><SelectValue placeholder="Todos los departamentos" /></SelectTrigger>
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
            <FieldLabel htmlFor="risk-filter">Nivel de riesgo</FieldLabel>
            <Select value={riesgo} onValueChange={(value) => onRiesgoChange(value)} items={[{ label: 'Todos', value: '' }, ...riesgos.map(r => ({ label: r, value: r }))]}>
              <SelectTrigger id="risk-filter" className="w-full bg-white"><SelectValue placeholder="Todos los niveles" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">Todos los niveles</SelectItem>
                  {riesgos.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}
