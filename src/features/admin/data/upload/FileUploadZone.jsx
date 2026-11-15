import { useCallback, useRef, useState } from 'react'
import { AlertCircle, FileSpreadsheet, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function FileUploadZone({ onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const validateFiles = useCallback((files) => {
    const validated = []
    const errors = []

    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (ext !== 'csv') {
        errors.push(`${file.name}: extensión no válida (se requiere .csv)`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: excede el tamaño máximo de 10 MB`)
        continue
      }
      validated.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'text/csv',
        status: 'valid',
        error: null,
      })
    }

    if (errors.length) {
      setError(errors.join('\n'))
    } else {
      setError(null)
    }

    if (validated.length) {
      onFilesSelected(validated)
    }
  }, [onFilesSelected])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    validateFiles(files)
  }, [validateFiles])

  const handleInputChange = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    validateFiles(files)
    // Reset input so the same file can be selected again
    e.target.value = ''
  }, [validateFiles])

  const handleButtonClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
        aria-label="Zona de carga de archivos"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          multiple
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
        <span className={`grid size-12 place-items-center rounded-xl ${isDragging ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
          <Upload size={22} aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-medium text-slate-700">
          Arrastra archivos CSV aquí
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          o usa el botón de abajo para seleccionar desde tu computador
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={handleButtonClick}
        >
          <FileSpreadsheet size={16} aria-hidden="true" />
          Seleccionar archivos
        </Button>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Solo archivos .csv · Máximo 10 MB por archivo
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle data-icon="inline-start" />
          <AlertTitle>Error de validación</AlertTitle>
          <AlertDescription className="whitespace-pre-line text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
