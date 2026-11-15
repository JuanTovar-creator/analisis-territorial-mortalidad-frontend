import { useState } from 'react'
import { Database, GitBranch, Play, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { demoDatasets, modelTypes, dataSplit } from '../demo/training-demo'

export default function TrainingConfig({ onStartExecution }) {
  const [dataset, setDataset] = useState('integrated')
  const [model, setModel] = useState('logistic-regression')
  const [params, setParams] = useState({})
  const [errors, setErrors] = useState({})

  const selectedModel = modelTypes.find(m => m.id === model)
  const selectedDataset = demoDatasets.find(d => d.id === dataset)

  // Inicializar parámetros con valores predeterminados al cambiar de modelo
  const handleModelChange = (value) => {
    setModel(value)
    const modelDef = modelTypes.find(m => m.id === value)
    const defaults = {}
    modelDef?.params.forEach(p => { defaults[p.key] = p.default })
    setParams(defaults)
    setErrors({})
  }

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }))
    // Limpiar error del campo
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    selectedModel?.params.forEach(p => {
      const val = parseFloat(params[p.key])
      if (isNaN(val)) {
        newErrors[p.key] = `Ingresa un valor numérico válido.`
      } else if (val < p.min || val > p.max) {
        newErrors[p.key] = `El valor debe estar entre ${p.min} y ${p.max}.`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const config = {
      dataset,
      model,
      params: { ...params },
      split: dataSplit,
    }
    onStartExecution(config)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuración del entrenamiento</CardTitle>
              <CardDescription className="mt-1">
                Selecciona el dataset, el tipo de modelo y ajusta los parámetros antes de iniciar la simulación.
              </CardDescription>
            </div>
            <DemoBadge>Simulación de demostración</DemoBadge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {/* Dataset selection */}
          <Field>
            <FieldLabel htmlFor="dataset-select">Dataset de demostración</FieldLabel>
            <FieldContent>
              <Select value={dataset} onValueChange={setDataset}>
                <SelectTrigger id="dataset-select" className="w-full sm:w-[400px]">
                  <Database size={16} className="text-muted-foreground" aria-hidden="true" />
                  <SelectValue placeholder="Selecciona un dataset" />
                </SelectTrigger>
                <SelectContent>
                  {demoDatasets.map(ds => (
                    <SelectItem key={ds.id} value={ds.id}>
                      <div className="flex flex-col">
                        <span>{ds.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {ds.records.toLocaleString()} registros · {ds.variables} variables
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDataset && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedDataset.records.toLocaleString()} registros con {selectedDataset.variables} variables.
                </p>
              )}
            </FieldContent>
          </Field>

          {/* Model selection */}
          <Field>
            <FieldLabel htmlFor="model-select">Tipo de modelo</FieldLabel>
            <FieldContent>
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger id="model-select" className="w-full sm:w-[400px]">
                  <Settings2 size={16} className="text-muted-foreground" aria-hidden="true" />
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {modelTypes.map(mt => (
                    <SelectItem key={mt.id} value={mt.id}>
                      {mt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          {/* Data split visualization */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Distribución de datos</h3>
              <Badge variant="outline" className="text-[11px] border-slate-200 text-slate-500">
                Fija — no editable
              </Badge>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Entrenamiento</span>
                  <span className="text-xs font-medium text-slate-700">{dataSplit.train}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${dataSplit.train}%` }} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Validación</span>
                  <span className="text-xs font-medium text-slate-700">{dataSplit.validation}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${dataSplit.validation}%` }} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Prueba</span>
                  <span className="text-xs font-medium text-slate-700">{dataSplit.test}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${dataSplit.test}%` }} />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              La distribución 70/15/15 (entrenamiento / validación / prueba) es fija y siempre suma 100%.
            </p>
          </div>

          {/* Dynamic parameters */}
          {selectedModel && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <GitBranch size={16} className="text-muted-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Parámetros — {selectedModel.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedModel.params.map(p => (
                  <Field key={p.key}>
                    <FieldLabel htmlFor={`param-${p.key}`}>{p.label}</FieldLabel>
                    <FieldContent>
                      <Input
                        id={`param-${p.key}`}
                        type="number"
                        step={p.step}
                        min={p.min}
                        max={p.max}
                        value={params[p.key] ?? p.default}
                        onChange={(e) => handleParamChange(p.key, e.target.value)}
                        className="max-w-[200px]"
                        aria-invalid={!!errors[p.key]}
                        aria-describedby={errors[p.key] ? `error-${p.key}` : undefined}
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Rango: {p.min} — {p.max} · Predeterminado: {p.default}
                      </p>
                      {errors[p.key] && (
                        <FieldError id={`error-${p.key}`}>{errors[p.key]}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSubmit} className="gap-2">
              <Play size={16} aria-hidden="true" />
              Iniciar entrenamiento simulado
            </Button>
            <p className="text-xs text-muted-foreground">
              Esta acción inicia una simulación local. No se entrena un modelo real.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
