import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function EDAFilters({ periodos, tipos, periodo, onPeriodChange, tipo, onTipoChange }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eda-periodo" className="text-xs font-medium text-muted-foreground">Periodo</Label>
        <Select value={periodo} onValueChange={onPeriodChange}>
          <SelectTrigger id="eda-periodo" className="w-[160px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {periodos.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eda-tipo" className="text-xs font-medium text-muted-foreground">Tipo de dato</Label>
        <Select value={tipo} onValueChange={onTipoChange}>
          <SelectTrigger id="eda-tipo" className="w-[160px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {tipos.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
