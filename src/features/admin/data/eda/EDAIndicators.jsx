import { CheckCircle2, Database, MapPin, Table2 } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/DashboardPrimitives'

const iconMap = { database: Database, 'map-pin': MapPin, table: Table2, 'check-circle': CheckCircle2 }

export default function EDAIndicators({ indicators }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores EDA">
      {indicators.map((item) => (
        <MetricCard key={item.label} {...item} icon={iconMap[item.icon]} />
      ))}
    </section>
  )
}
