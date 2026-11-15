import { Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DatasetToolbar({
  search,
  onSearchChange,
  departamento,
  onDepartamentoChange,
  tipo,
  onTipoChange,
  departamentos,
  onExport,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1.5 flex-1">
        <Label htmlFor="dataset-search" className="text-xs font-medium text-muted-foreground">Buscar municipio</Label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="dataset-search"
            placeholder="Ej: Municipio A"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dataset-depto" className="text-xs font-medium text-muted-foreground">Departamento</Label>
        <Select value={departamento} onValueChange={onDepartamentoChange}>
          <SelectTrigger id="dataset-depto" className="w-[180px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {departamentos.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dataset-tipo" className="text-xs font-medium text-muted-foreground">Tipo</Label>
        <Select value={tipo} onValueChange={onTipoChange}>
          <SelectTrigger id="dataset-tipo" className="w-[130px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Rural">Rural</SelectItem>
            <SelectItem value="Urbano">Urbano</SelectItem>
            <SelectItem value="Mixto">Mixto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
          <Download size={16} aria-hidden="true" />
          Exportar CSV
        </Button>
      </div>
    </div>
  )
}
