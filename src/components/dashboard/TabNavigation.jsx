import { cn } from '@/lib/utils'

export function TabNavigation({ tabs, activeTab, onChange, className }) {
  return (
    <nav
      className={cn('flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1', className)}
      aria-label="Secciones del módulo"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-slate-50 hover:text-slate-700'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={16} aria-hidden="true" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
