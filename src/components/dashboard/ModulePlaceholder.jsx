import { PageHeader } from './PageHeader'
import { StatePanel } from './DashboardPrimitives'

export function ModulePlaceholder({ title, description }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="MÓDULO" title={title} description={description} />
      <StatePanel
        title="Vista en preparación"
        description="La navegación ya está disponible. El contenido funcional de este módulo se implementará en una etapa posterior."
      />
    </div>
  )
}
