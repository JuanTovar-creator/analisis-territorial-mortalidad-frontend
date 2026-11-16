// Datos ficticios de demostración para el módulo Informes del cliente
// Los informes reales y sus archivos deben provenir del backend.
// En producción, el backend genera los PDF/CSV y los suministra al frontend.

import { demoMunicipalities, demoDepartamentos } from '@/features/client/municipalities/demo/municipalities-demo'

const tiposInforme = [
  { id: 'riesgo-general', label: 'Riesgo general', description: 'Resumen de niveles de riesgo por municipio.' },
  { id: 'socioeconomico', label: 'Indicadores socioeconómicos', description: 'Población, cobertura sanitaria, acceso a agua, índice de pobreza.' },
  { id: 'prediccion', label: 'Predicción de mortalidad', description: 'Probabilidades y tendencias del modelo predictivo.' },
  { id: 'comparativo', label: 'Comparativo territorial', description: 'Análisis comparativo entre municipios seleccionados.' },
]

const generarFecha = (year, month, day) => {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export const demoInformes = Array.from({ length: 20 }, (_, i) => {
  const tipo = tiposInforme[i % tiposInforme.length]
  const municipio = demoMunicipalities[i % demoMunicipalities.length]
  const year = 2025 + Math.floor(i / 12)
  const month = (i % 12) + 1
  const day = Math.min(Math.floor((i % 28) + 1), 28)
  const fecha = generarFecha(year, month, day)
  const estado = i < 16 ? 'disponible' : 'generando'

  return {
    id: `INF-${String(i + 1).padStart(4, '0')}`,
    titulo: `${tipo.label} — ${municipio.municipio}`,
    tipo: tipo.id,
    tipoLabel: tipo.label,
    municipio: municipio.municipio,
    municipioId: municipio.id,
    departamento: municipio.departamento,
    fechaGeneracion: fecha,
    fechaInicio: fecha,
    fechaFin: fecha,
    estado,
    formatos: estado === 'disponible' ? ['pdf', 'csv'] : [],
    descripcion: tipo.description,
    resumen: `Informe de demostración sobre ${tipo.label.toLowerCase()} para ${municipio.municipio} (${municipio.departamento}). Los datos y archivos son ficticios; en producción, el backend generará los informes reales.`,
    indicadores: {
      municipiosIncluidos: 1,
      variablesAnalizadas: 8,
      periodoCobertura: `${fecha}`,
    },
  }
})

export const demoTiposInforme = tiposInforme

export const demoDepartamentosInforme = demoDepartamentos

export const demoMunicipiosInforme = demoMunicipalities.map(m => ({
  id: m.id,
  nombre: m.municipio,
  departamento: m.departamento,
}))
