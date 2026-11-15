import { useState } from 'react'
import { Database, FileSpreadsheet, GitBranch, Table2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoNotice } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import FileUploadZone from './upload/FileUploadZone'
import FileUploadList from './upload/FileUploadList'
import EDAView from './eda/EDAView'
import ProcessingPipeline from './processing/ProcessingPipeline'
import DatasetView from './dataset/DatasetView'

const tabs = [
  { id: 'upload', label: 'Carga', icon: FileSpreadsheet },
  { id: 'eda', label: 'Análisis EDA', icon: Table2 },
  { id: 'processing', label: 'Procesamiento', icon: GitBranch },
  { id: 'dataset', label: 'Dataset integrado', icon: Database },
]

export default function DataModule() {
  const [activeTab, setActiveTab] = useState('upload')
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFilesSelected = (files) => {
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="DATOS"
        title="Gestión de datos"
        description="Carga, análisis exploratorio, procesamiento y dataset integrado para el modelo de riesgo."
      />
      <DemoNotice />

      {/* Tab navigation */}
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1" aria-label="Secciones del módulo">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-slate-50 hover:text-slate-700'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Tab content */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Carga de archivos CSV</CardTitle>
                  <CardDescription className="mt-1">
                    Selecciona y arrastra archivos CSV reales desde tu computador. La validación se ejecuta localmente en el navegador.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Operación real del navegador
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <FileUploadZone onFilesSelected={handleFilesSelected} />
              <FileUploadList files={uploadedFiles} onRemove={handleRemoveFile} />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'eda' && <EDAView />}

      {activeTab === 'processing' && <ProcessingPipeline />}

      {activeTab === 'dataset' && <DatasetView />}
    </div>
  )
}
