import { useState } from 'react'
import { FileSpreadsheet, Table2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { TabNavigation } from '@/components/dashboard/TabNavigation'
import FileUploadZone from './upload/FileUploadZone'
import FileUploadList from './upload/FileUploadList'
import EDAView from './eda/EDAView'

const tabs = [
  { id: 'upload', label: 'Carga', icon: FileSpreadsheet },
  { id: 'eda', label: 'Análisis EDA', icon: Table2 },
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

      <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Carga de archivos CSV</CardTitle>
                <CardDescription className="mt-1">
                  Selecciona y arrastra archivos CSV reales desde tu computador. La validación se ejecuta localmente en el navegador.
                </CardDescription>
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
    </div>
  )
}
