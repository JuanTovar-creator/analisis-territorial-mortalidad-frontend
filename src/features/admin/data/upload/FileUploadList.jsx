import { X, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUploadList({ files, onRemove }) {
  if (!files || files.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
        <p className="text-sm text-muted-foreground">No hay archivos cargados.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          Archivos cargados ({files.length})
        </p>
        <DemoBadge variant="real">Operación real del navegador</DemoBadge>
      </div>
      <div className="flex flex-col gap-2">
        {files.map((file, index) => (
          <Card key={`${file.name}-${index}`} className="border-slate-200/80 shadow-sm">
            <CardContent className="flex items-center gap-3 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-400">
                <FileSpreadsheet size={16} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatSize(file.size)} · {file.type || 'text/csv'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {file.status === 'valid' ? (
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={12} aria-hidden="true" />
                    Válido
                  </Badge>
                ) : file.status === 'error' ? (
                  <Badge variant="destructive">
                    <AlertCircle size={12} aria-hidden="true" />
                    Error
                  </Badge>
                ) : null}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onRemove(index)}
                  aria-label={`Eliminar ${file.name}`}
                >
                  <X size={16} aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
