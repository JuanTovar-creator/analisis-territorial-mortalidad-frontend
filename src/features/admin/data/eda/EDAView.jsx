import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  edaIndicators,
  edaChartData,
  edaSummaryData,
  edaFilters,
  dataQuality,
} from '../demo/data-demo'
import EDAFilters from './EDAFilters'
import EDAIndicators from './EDAIndicators'
import EDAChart from './EDAChart'
import EDADataQuality from './EDADataQuality'
import EDASummaryTable from './EDASummaryTable'

export default function EDAView() {
  const [periodo, setPeriodo] = useState('all')
  const [tipo, setTipo] = useState('all')

  // Simulated filtering — in a real app this would query the API
  const filteredChartData = useMemo(() => {
    if (tipo === 'all') return edaChartData
    return edaChartData.filter(item => item.name === tipo)
  }, [tipo])

  const filteredSummaryData = useMemo(() => {
    // In a real app, both filters would affect the data
    return edaSummaryData
  }, [periodo, tipo])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Análisis exploratorio de datos</h2>
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
          Simulación de demostración
        </Badge>
      </div>

      <EDAFilters
        periodos={edaFilters.periodos}
        tipos={edaFilters.tipos}
        periodo={periodo}
        onPeriodChange={setPeriodo}
        tipo={tipo}
        onTipoChange={setTipo}
      />

      <EDAIndicators indicators={edaIndicators} />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <EDAChart data={filteredChartData} />
        <EDADataQuality quality={dataQuality} />
      </div>

      <EDASummaryTable data={filteredSummaryData} />
    </div>
  )
}
