import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { APP_NAME, APP_SHORT_NAME, ROLE_LABELS } from '@/config/app'
import { findNavigationItem, ROLE_NAVIGATION } from '@/config/navigation'
import { useDemoAuth } from '@/features/auth/AuthContext'

function BrandMark({ compact = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-sm shadow-indigo-950/20" aria-hidden="true">
        <ShieldCheck />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-white">{APP_NAME}</span>
          <span className="mt-0.5 block text-[11px] tracking-wide text-slate-400">ANÁLISIS E INTELIGENCIA</span>
        </span>
      )}
    </div>
  )
}

function NavigationGroups({ role, onNavigate }) {
  return (
    <nav className="flex flex-col gap-6" aria-label={`Navegación de ${ROLE_LABELS[role].toLowerCase()}`}>
      {ROLE_NAVIGATION[role].map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-500">{group.label}</p>
          <div className="flex flex-col gap-1">
            {group.items.map(({ title, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === `/${role}`}
                onClick={onNavigate}
                className={({ isActive }) => `group flex min-h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${isActive ? 'bg-primary text-white shadow-sm shadow-indigo-950/20' : 'text-slate-300 hover:bg-white/6 hover:text-white'}`}
              >
                <Icon className="size-[17px] shrink-0 opacity-90" aria-hidden="true" />
                <span className="truncate">{title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function SidebarContent({ role, onNavigate }) {
  const { user, signOut } = useDemoAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/login', { replace: true })
    onNavigate?.()
  }

  return (
    <div className="flex h-full flex-col bg-[#1e293b] px-4 py-5 text-white">
      <div className="px-2 pb-7"><BrandMark /></div>
      <NavigationGroups role={role} onNavigate={onNavigate} />
      <div className="mt-auto pt-6">
        <Separator className="mb-4 bg-white/10" />
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-violet-400/20 text-xs font-semibold text-violet-100" aria-hidden="true">
            {user?.name.slice(0, 1) || APP_SHORT_NAME.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-white">{user?.name}</span>
            <span className="mt-0.5 block text-[11px] text-slate-400">{ROLE_LABELS[role]} · Demo</span>
          </span>
          <Button type="button" variant="ghost" size="icon-sm" className="text-slate-300 hover:bg-white/10 hover:text-white" onClick={handleSignOut} aria-label="Salir del demo">
            <LogOut aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AppShell({ role }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useDemoAuth()
  const location = useLocation()
  const page = findNavigationItem(role, location.pathname)

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] md:block">
        <SidebarContent role={role} />
      </aside>

      <div className="min-h-screen md:pl-[264px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menú de navegación" />}>
                <Menu aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] border-0 bg-[#1e293b] p-0 text-white sm:max-w-[280px]">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menú de navegación</SheetTitle>
                  <SheetDescription>Secciones de {APP_NAME}</SheetDescription>
                </SheetHeader>
                <SidebarContent role={role} onNavigate={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 sm:text-[15px]">{page.title}</p>
              <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{APP_NAME}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-xs font-medium text-slate-800">{user?.name}</span>
              <span className="block text-[11px] text-muted-foreground">{ROLE_LABELS[role]}</span>
            </span>
            <span className="grid size-9 place-items-center rounded-full border border-violet-100 bg-violet-50 text-xs font-semibold text-primary" aria-label={`Usuario ${user?.name}`}>
              {user?.name.slice(0, 1)}
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
