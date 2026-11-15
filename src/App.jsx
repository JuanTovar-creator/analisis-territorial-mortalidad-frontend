import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ModulePlaceholder } from '@/components/dashboard/ModulePlaceholder'
import { DemoAuthProvider, useDemoAuth } from '@/features/auth/AuthContext'
import LoginPage from '@/features/auth/LoginPage'

const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard'))
const ClientDashboard = lazy(() => import('@/features/client/ClientDashboard'))
const DataModule = lazy(() => import('@/features/admin/data/DataModule'))
const DashboardLoading = () => <p className="py-12 text-center text-sm text-muted-foreground" role="status">Cargando panel…</p>

function ProtectedRoute({ role, children }) {
  const { user } = useDemoAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />
  return children
}

function PublicOnlyRoute() {
  const { user } = useDemoAuth()
  return user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicOnlyRoute />} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AppShell role="admin" /></ProtectedRoute>}>
        <Route index element={<Suspense fallback={<DashboardLoading />}><AdminDashboard /></Suspense>} />
        <Route path="data" element={<Suspense fallback={<DashboardLoading />}><DataModule /></Suspense>} />
        <Route path="training" element={<ModulePlaceholder title="Entrenamiento" description="Configuración y seguimiento de entrenamientos." />} />
        <Route path="evaluation" element={<ModulePlaceholder title="Evaluación y publicación" description="Evaluación y ciclo de publicación del modelo." />} />
        <Route path="history" element={<ModulePlaceholder title="Historial" description="Registro de actividad y procesos." />} />
        <Route path="account" element={<ModulePlaceholder title="Mi cuenta" description="Configuración de la cuenta de administrador." />} />
      </Route>
      <Route path="/client" element={<ProtectedRoute role="client"><AppShell role="client" /></ProtectedRoute>}>
        <Route index element={<Suspense fallback={<DashboardLoading />}><ClientDashboard /></Suspense>} />
        <Route path="municipalities" element={<ModulePlaceholder title="Municipios" description="Consulta territorial pendiente de cartografía y datos validados." />} />
        <Route path="comparison" element={<ModulePlaceholder title="Comparación" description="Comparación territorial pendiente de fuentes y metodología aprobadas." />} />
        <Route path="reports" element={<ModulePlaceholder title="Informes" description="Informes territoriales disponibles en una etapa posterior." />} />
        <Route path="methodology" element={<ModulePlaceholder title="Metodología" description="Documentación de la metodología aprobada." />} />
        <Route path="account" element={<ModulePlaceholder title="Mi cuenta" description="Configuración de la cuenta de cliente." />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <DemoAuthProvider><AppRoutes /></DemoAuthProvider>
}
