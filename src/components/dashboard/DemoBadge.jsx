import { Badge } from '@/components/ui/badge'

const variantStyles = {
  demo: 'border-amber-200 bg-amber-50 text-amber-700',
  real: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-600',
}

export function DemoBadge({ children, variant = 'demo', className }) {
  return (
    <Badge
      variant="outline"
      className={`${variantStyles[variant] || variantStyles.demo} ${className || ''}`}
    >
      {children}
    </Badge>
  )
}
