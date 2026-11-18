import { BookOpenCheck, Database, GitCompareArrows, Info, Layers, LineChart, Settings2, ShieldAlert, Target } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/dashboard/PageHeader'

function MethodologySection({ icon: Icon, title, description, children, tone = 'primary' }) {
  const toneStyles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-violet-100 text-violet-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  }

  return (
    <Card className="border-slate-200/80 shadow-sm shadow-slate-900/[0.02]">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${toneStyles[tone] || toneStyles.primary}`} aria-hidden="true">
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

function StepList({ items }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-800">{item.title}</p>
            <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function InfoCallout({ title, children }) {
  return (
    <Alert className="mt-4 border-primary/20 bg-primary/5 text-foreground [&>svg]:text-primary">
      <Info size={16} />
      <AlertTitle className="text-sm">{title}</AlertTitle>
      <AlertDescription className="text-sm leading-6">{children}</AlertDescription>
    </Alert>
  )
}

export default function MethodologyModule() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="ANÁLISIS TERRITORIAL"
        title="Metodología"
        description="Documentación de la metodología utilizada para la predicción de riesgo de mortalidad evitable por falta de oportunidad en la atención en zonas rurales."
      />

      {/* 1. Objetivo del proyecto */}
      <MethodologySection
        icon={Target}
        title="1. Objetivo del proyecto"
        description="Propósito y alcance del análisis territorial."
        tone="primary"
      >
        <div className="space-y-4 text-sm leading-6 text-slate-700">
          <p>
            Este proyecto tiene como objetivo identificar los municipios rurales con mayor riesgo de mortalidad evitable
            debido a la falta de oportunidad en la atención sanitaria. La mortalidad evitable se refiere a los fallecimientos
            que podrían haberse prevenido con acceso oportuno y adecuado a servicios de salud.
          </p>
          <p>
            El análisis combina datos demográficos, socioeconómicos y sanitarios para construir modelos predictivos que
            estimen el riesgo en cada municipio, permitiendo priorizar intervenciones y asignar recursos de manera más
            eficiente en las zonas con mayor necesidad.
          </p>
          <InfoCallout title="Nota importante">
            Esta página describe la metodología propuesta. Los resultados que visualizas en el sistema dependen de los
            datos y modelos realmente procesados por el equipo de backend.
          </InfoCallout>
        </div>
      </MethodologySection>

      {/* 2. Fuentes de datos */}
      <MethodologySection
        icon={Database}
        title="2. Fuentes de datos"
        description="Origen y naturaleza de los datos utilizados."
        tone="emerald"
      >
        <div className="space-y-4 text-sm leading-6 text-slate-700">
          <p>Los datos provienen de fuentes oficiales del gobierno colombiano, principalmente:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200/60">
              <CardContent className="pt-5">
                <h4 className="font-medium text-slate-800">DANE — Departamento Administrativo Nacional de Estadística</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Proporciona datos demográficos y socioeconómicos a nivel municipal, incluyendo población, indicadores
                  de pobreza, acceso a servicios básicos y características territoriales.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200/60">
              <CardContent className="pt-5">
                <h4 className="font-medium text-slate-800">RIPS — Registro Individual de Prestación de Servicios de Salud</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contiene registros individuales de atención en salud (ambulatoria y hospitalaria) que permiten analizar
                  patrones de morbilidad, mortalidad y acceso a servicios sanitarios.
                </p>
              </CardContent>
            </Card>
          </div>
          <InfoCallout title="Periodo de referencia">
            Los datos de demostración se basan en información del año 2021. En producción, el backend utilizará los
            datos reales obtenidos de estas fuentes oficiales, con el periodo de referencia definido por el equipo técnico.
          </InfoCallout>
        </div>
      </MethodologySection>

      {/* 3. Preparación e integración de datos */}
      <MethodologySection
        icon={Layers}
        title="3. Preparación e integración de datos"
        description="Procesamiento y construcción del dataset integrado."
        tone="secondary"
      >
        <div className="space-y-4 text-sm leading-6 text-slate-700">
          <p>
            El backend se encarga de todo el procesamiento de datos. El pipeline incluye las siguientes etapas:
          </p>
          <StepList
            items={[
              {
                title: 'Validación',
                description: 'Verificación de la integridad y consistencia de los archivos fuente (DANE y RIPS).',
              },
              {
                title: 'Limpieza',
                description: 'Manejo de valores faltantes, duplicados y registros inconsistentes.',
              },
              {
                title: 'Transformación',
                description: 'Normalización de variables, codificación de categorías y estandarización de formatos.',
              },
              {
                title: 'Agregación',
                description: 'Construcción de indicadores a nivel municipal a partir de registros individuales.',
              },
              {
                title: 'Integración',
                description: 'Unificación de las fuentes DANE y RIPS en un dataset integrado por municipio.',
              },
            ]}
          />
          <InfoCallout title="Responsabilidad del backend">
            El frontend solo visualiza los resultados del pipeline. El backend ejecuta todas las etapas de procesamiento
            y notifica al frontend el estado y progreso de cada una.
          </InfoCallout>
        </div>
      </MethodologySection>

      {/* 4. Modelos predictivos */}
      <MethodologySection
        icon={LineChart}
        title="4. Modelos predictivos"
        description="Algoritmos utilizados para la predicción de riesgo."
        tone="amber"
      >
        <div className="space-y-4 text-sm leading-6 text-slate-700">
          <p>Se entrenan y evalúan dos modelos de clasificación para predecir el riesgo de mortalidad evitable:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200/60">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-slate-800">Regresión Logística</h4>
                  <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">Clasificación</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Modelo lineal que estima la probabilidad de pertenecer a una clase (riesgo alto o bajo) a partir de
                  las variables predictoras. Es interpretable y permite evaluar el impacto de cada variable en la predicción.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Parámetros configurables:</span> tasa de aprendizaje (learning rate) y
                  regularización.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200/60">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-slate-800">Árbol de Decisión</h4>
                  <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">Clasificación</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Modelo no lineal que construye una estructura de decisiones basada en las variables predictoras.
                  Captura interacciones entre variables sin necesidad de transformaciones previas.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Parámetros configurables:</span> profundidad máxima (max depth) y
                  mínimo de muestras para dividir un nodo (min samples split).
                </p>
              </CardContent>
            </Card>
          </div>
          <InfoCallout title="Distribución de datos">
            El dataset se divide en tres conjuntos: 70% para entrenamiento, 15% para validación y 15% para prueba.
            La distribución exacta puede variar según la configuración del backend.
          </InfoCallout>
        </div>
      </MethodologySection>

      {/* 5. Evaluación de modelos */}
      <MethodologySection
        icon={GitCompareArrows}
        title="5. Evaluación de modelos"
        description="Métricas y criterios de comparación."
        tone="slate"
      >
        <div className="space-y-4 text-sm leading-6 text-slate-700">
          <p>
            Ambos modelos se evalúan sobre el conjunto de prueba (15% de los datos) utilizando las siguientes métricas
            de clasificación:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Accuracy', desc: 'Proporción de predicciones correctas sobre el total.' },
              { name: 'Precision', desc: 'Proporción de positivos predichos que son realmente positivos.' },
              { name: 'Recall', desc: 'Proporción de positivos reales correctamente identificados.' },
              { name: 'F1-score', desc: 'Media armónica entre Precision y Recall.' },
              { name: 'ROC-AUC', desc: 'Área bajo la curva ROC; mide la capacidad de discriminación del modelo.' },
            ].map((metric) => (
              <Card key={metric.name} className="border-slate-200/60">
                <CardContent className="pt-5">
                  <h4 className="font-medium text-sm text-slate-800">{metric.name}</h4>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{metric.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p>
            Además, se utiliza una <span className="font-medium">matriz de confusión</span> que muestra los verdaderos
            positivos (TP), verdaderos negativos (TN), falsos positivos (FP) y falsos negativos (FN), permitiendo
            evaluar el comportamiento del modelo por clase.
          </p>
          <InfoCallout title="Métricas de demostración">
            Las métricas que ves en el módulo de Evaluación son datos sintéticos de demostración. En producción, el
            backend calculará las métricas reales sobre el conjunto de prueba y las enviará al frontend para su visualización.
          </InfoCallout>
        </div>
      </MethodologySection>

      {/* 6. Selección y publicación del modelo */}
      <MethodologySection
        icon={Settings2}
        title="6. Selección y publicación del modelo"
        description="Cómo se determina el modelo indicado."
        tone="primary"
      >
        <div className="space-y-4 text-sm leading-6 text-slate-700">
          <p>
            Tras evaluar ambos modelos, el <span className="font-medium">backend determina cuál es el modelo indicado</span>{' '}
            basándose en los criterios definidos por el equipo técnico. Este proceso es automático y no requiere
            intervención manual desde el frontend.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200/60">
              <CardContent className="pt-5">
                <h4 className="font-medium text-sm text-slate-800">Rol del administrador</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Visualiza los resultados de ambos modelos, puede consultar y comparar sus métricas, matrices de confusión
                  y resultados. Puede ver cuál fue determinado como el modelo indicado, pero no selecciona manualmente
                  candidatos ni decide qué modelo es mejor.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200/60">
              <CardContent className="pt-5">
                <h4 className="font-medium text-sm text-slate-800">Rol del cliente</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Solo visualiza el modelo indicado por el backend y sus predicciones. No puede cambiar de modelo ni
                  comparar los dos algoritmos. Accede a los resultados, municipios y informes basados en el modelo publicado.
                </p>
              </CardContent>
            </Card>
          </div>
          <InfoCallout title="Publicación automática">
            El backend gestiona la publicación del modelo. El frontend muestra únicamente el modelo publicado actualmente
            y su historial de publicaciones.
          </InfoCallout>
        </div>
      </MethodologySection>

      {/* 7. Interpretación de predicciones */}
      <MethodologySection
        icon={ShieldAlert}
        title="7. Interpretación de predicciones"
        description="Cómo leer y utilizar los resultados."
        tone="emerald"
      >
        <div className="space-y-4 text-sm leading-6 text-slate-700">
          <p>
            Las predicciones del modelo indican el <span className="font-medium">nivel de riesgo de mortalidad evitable</span>{' '}
            para cada municipio. Los niveles de riesgo se clasifican como:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="border-emerald-200/60 bg-emerald-50/50">
              <CardContent className="pt-5">
                <h4 className="font-medium text-sm text-emerald-800">Riesgo bajo</h4>
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  El municipio presenta indicadores favorables y un riesgo reducido de mortalidad evitable.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200/60 bg-amber-50/50">
              <CardContent className="pt-5">
                <h4 className="font-medium text-sm text-amber-800">Riesgo moderado</h4>
                <p className="mt-1 text-xs leading-5 text-amber-700">
                  El municipio presenta algunos indicadores de alerta que requieren seguimiento y atención.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200/60 bg-red-50/50">
              <CardContent className="pt-5">
                <h4 className="font-medium text-sm text-red-800">Riesgo alto</h4>
                <p className="mt-1 text-xs leading-5 text-red-700">
                  El municipio presenta indicadores críticos que sugieren un riesgo elevado de mortalidad evitable.
                </p>
              </CardContent>
            </Card>
          </div>
          <p>
            Las predicciones se visualizan en el módulo de Municipios, donde cada municipio muestra su nivel de riesgo
            asignado por el modelo, junto con los indicadores socioeconómicos y sanitarios que respaldan la predicción.
          </p>
          <InfoCallout title="Limitaciones">
            Las predicciones son estimaciones basadas en datos históricos y modelos estadísticos. No constituyen diagnósticos
            médicos ni conclusiones definitivas. Su propósito es orientar la toma de decisiones y priorizar intervenciones
            en las zonas con mayor necesidad.
          </InfoCallout>
        </div>
      </MethodologySection>

      {/* 8. Arquitectura del sistema */}
      <MethodologySection
        icon={BookOpenCheck}
        title="8. Arquitectura del sistema"
        description="División de responsabilidades frontend y backend."
        tone="slate"
      >
        <div className="space-y-4 text-sm leading-6 text-slate-700">
          <p>El sistema se divide en dos componentes principales con responsabilidades claramente definidas:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200/60">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-slate-800">Frontend (React)</h4>
                  <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">Este proyecto</Badge>
                </div>
                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    Interfaz de usuario, navegación y visualización de datos
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    Gráficos, tablas, indicadores y mapas territoriales
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    Estados de carga, error y vacío
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    Solicitudes al backend y renderizado de respuestas
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-slate-200/60">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-slate-800">Backend (Python)</h4>
                  <Badge variant="outline" className="border-slate-300 bg-slate-50 text-slate-600 text-xs">Otro equipo</Badge>
                </div>
                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    Procesamiento de datos DANE y RIPS
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    Entrenamiento y evaluación de modelos
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    Selección y publicación del modelo indicado
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    Generación de predicciones e informes
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    API REST para suministro de datos al frontend
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <InfoCallout title="Integración con API">
            El frontend está preparado para recibir datos del backend mediante una API REST. Mientras no exista integración
            real, los módulos funcionan con datos de demostración claramente identificados.
          </InfoCallout>
        </div>
      </MethodologySection>
    </div>
  )
}
