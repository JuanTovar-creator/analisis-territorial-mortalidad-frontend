import { useState } from 'react'
import { ArrowLeft, Download, FileText, Loader2, MapPin, Calendar, Tag, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { MetricCard, StatePanel } from '@/components/dashboard/DashboardPrimitives'

function estadoBadge(estado) {
  const styles = {
    disponible: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    generando: 'border-amber-200 bg-amber-50 text-amber-700',
    error: 'border-red-200 bg-red-50 text-red-700',
  }
  const labels = {
    disponible: 'Disponible',
    generando: 'Generando',
    error: 'Error',
  }
  return (
    <Badge variant="outline" className={styles[estado] || styles.disponible}>
      {labels[estado] || estado}
    </Badge>
  )
}

export default function ReportDetail({ informe, onBack, onDownload, downloadLoading }) {
  if (!informe) {
    return <StatePanel state="empty" title="Informe no encontrado" description="El informe seleccionado no existe o fue eliminado." />
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 px-2.5 text-sm gap-1 shrink-0"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Volver
        </Button>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-semibold tracking-tight text-slate-800">{informe.titulo}</h2>
            <DemoBadge />
            {estadoBadge(informe.estado)}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {informe.descripcion}
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Municipio"
          value={informe.municipio}
          detail={informe.departamento}
          icon={MapPin}
          tone="secondary"
        />
        <MetricCard
          label="Fecha de generación"
          value={informe.fechaGeneracion}
          detail={`Período: ${informe.indicadores.periodoCobertura}`}
          icon={Calendar}
          tone="secondary"
        />
        <MetricCard
          label="Tipo de informe"
          value={informe.tipoLabel}
          detail={informe.id}
          icon={Tag}
          tone="secondary"
        />
        <MetricCard
          label="Variables analizadas"
          value={informe.indicadores.variablesAnalizadas}
          detail={`${informe.indicadores.municipiosIncluidos} municipio incluido`}
          icon={FileText}
          tone="secondary"
        />
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Descripción general del informe.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-slate-700">{informe.resumen}</p>
        </CardContent>
      </Card>

      {/* Download section */}
      {informe.estado === 'disponible' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Descargar informe</CardTitle>
              <DemoBadge variant="info" children="Simulado" />
            </div>
            <CardDescription>
              En modo demostración, la descarga genera un archivo ficticio. En producción, el backend suministrará los archivos reales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(informe.id, 'pdf')}
                disabled={downloadLoading === informe.id}
                className="gap-2"
              >
                {downloadLoading === informe.id ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={14} aria-hidden="true" />
                )}
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(informe.id, 'csv')}
                disabled={downloadLoading === informe.id}
                className="gap-2"
              >
                {downloadLoading === informe.id ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={14} aria-hidden="true" />
                )}
                Descargar CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {informe.estado === 'generando' && (
        <StatePanel
          state="loading"
          title="Informe en generación"
          description="El backend está generando este informe. Vuelve a intentarlo en unos momentos."
        />
      )}
    </div>
  )
}
