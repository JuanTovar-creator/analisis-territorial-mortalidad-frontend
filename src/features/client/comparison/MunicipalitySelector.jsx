import { useState, useMemo } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function MunicipalitySelector({ available, selected, departamentos, onAdd, onRemove, minSelection, maxSelection }) {
  const [search, setSearch] = useState('')
  const [departamento, setDepartamento] = useState('')

  const filteredAvailable = useMemo(() => {
    return available.filter(m => {
      const matchesSearch = !search || m.municipio.toLowerCase().includes(search.toLowerCase())
      const matchesDepartamento = !departamento || m.departamento === departamento
      return matchesSearch && matchesDepartamento
    })
  }, [available, search, departamento])

  const canAdd = selected.length < maxSelection

  return (
    <Card>
      <CardContent className="pt-5">
        {/* Selected municipalities */}
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Municipios seleccionados ({selected.length}/{maxSelection})
          </p>
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selected.map(m => (
                <Badge
                  key={m.id}
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-primary px-3 py-1.5 flex items-center gap-1.5"
                >
                  <span className="max-w-[120px] truncate text-xs">{m.municipio}</span>
                  <button
                    onClick={() => onRemove(m.id)}
                    className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5"
                    aria-label={`Quitar ${m.municipio}`}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Selecciona entre {minSelection} y {maxSelection} municipios para comparar.
            </p>
          )}
        </div>

        {/* Add municipality */}
        {canAdd && (
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 md:grid-cols-3">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="comparison-search">Buscar municipio</FieldLabel>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="comparison-search"
                    type="text"
                    placeholder="Ej: Municipio A"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>
              </Field>
              <Field className="gap-1.5">
                <FieldLabel htmlFor="comparison-department">Departamento</FieldLabel>
                <Select value={departamento} onValueChange={(value) => setDepartamento(value)} items={[{ label: 'Todos', value: '' }, ...departamentos.map(d => ({ label: d, value: d }))]}>
                  <SelectTrigger id="comparison-department" className="w-full bg-white"><SelectValue placeholder="Todos" /></SelectTrigger>
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
            </div>

            {/* Available list */}
            {filteredAvailable.length > 0 ? (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
                <ul className="divide-y divide-slate-100">
                  {filteredAvailable.map(m => (
                    <li key={m.id} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50/50">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-slate-700 truncate">{m.municipio}</span>
                        <span className="text-xs text-muted-foreground truncate">{m.departamento}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAdd(m.id)}
                        className="h-7 px-2.5 text-xs gap-1 shrink-0"
                      >
                        <Plus size={12} aria-hidden="true" />
                        Añadir
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No se encontraron municipios disponibles con los filtros seleccionados.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
