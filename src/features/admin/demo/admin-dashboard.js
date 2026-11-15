export const adminDemoOverview = {
  metrics: [
    { label: 'Conjuntos de datos', value: '03', detail: 'Registros sintéticos de ejemplo', icon: 'database', tone: 'primary' },
    { label: 'Procesamientos', value: '08', detail: 'Ejecuciones de muestra', icon: 'activity', tone: 'secondary' },
    { label: 'Entrenamientos', value: '02', detail: 'Sesiones simuladas', icon: 'brain', tone: 'primary' },
    { label: 'Modelo publicado', value: 'No', detail: 'No hay un modelo publicado', icon: 'shield', tone: 'secondary' },
  ],
  datasets: [
    { name: 'Esquema territorial de prueba', kind: 'Estructura ficticia', status: 'Disponible en demo' },
    { name: 'Registros sintéticos de salud', kind: 'Datos generados', status: 'Disponible en demo' },
    { name: 'Geometrías municipales', kind: 'Fuente pendiente', status: 'No conectada' },
  ],
  activity: [
    { title: 'Esquema de datos de demostración preparado', detail: 'Espacio de pruebas · Hace 12 min', tone: 'complete' },
    { title: 'Vista de procesamiento simulada', detail: 'Sin ejecución sobre fuentes reales · Hace 38 min', tone: 'neutral' },
    { title: 'Publicación de modelo deshabilitada', detail: 'No hay un modelo conectado · Hoy', tone: 'pending' },
  ],
}
