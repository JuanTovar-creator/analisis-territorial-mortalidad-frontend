import { useState } from 'react'
import { Database, FileSpreadsheet, GitBranch, Table2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { DemoNotice } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { TabNavigation } from '@/components/dashboard/TabNavigation'
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

      <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

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
                <DemoBadge variant="real">Operación real del navegador</DemoBadge>
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
