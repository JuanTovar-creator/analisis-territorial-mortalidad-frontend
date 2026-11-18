import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Map, ShieldCheck, UserRound } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APP_NAME } from '@/config/app'
import { useDemoAuth } from './AuthContext'

const roles = [
  { id: 'admin', name: 'Administrador', description: 'Gestión de datos y modelos', icon: ShieldCheck },
  { id: 'client', name: 'Cliente', description: 'Consulta de análisis territoriales', icon: UserRound },
]

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const { enterDemo } = useDemoAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!isValidEmail(email)) nextErrors.email = 'Ingresa un correo electrónico válido.'
    if (password.length < 8) nextErrors.password = 'La contraseña debe tener al menos 8 caracteres.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    await enterDemo({ email, role })
    navigate(`/${role}`, { replace: true })
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(380px,0.9fr)_1.1fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#1e293b] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] bg-size-[52px_52px]" />
          <div className="absolute -right-40 top-1/4 size-[520px] rounded-full border border-violet-300/50" />
          <div className="absolute -right-20 top-[30%] size-[360px] rounded-full border border-violet-300/50" />
          <div className="absolute right-12 top-[36%] size-[210px] rounded-full border border-violet-300/50" />
        </div>
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-white"><Map aria-hidden="true" /></span>
          <span className="text-sm font-semibold tracking-wide">{APP_NAME}</span>
        </div>
        <div className="relative max-w-xl pb-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-violet-100">
            <span className="size-1.5 rounded-full bg-violet-300" aria-hidden="true" />
            Plataforma de análisis e inteligencia territorial
          </div>
          <h1 className="max-w-lg text-4xl leading-[1.15] font-semibold tracking-tight xl:text-[46px]">
            Información territorial, presentada con claridad.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            Un espacio de trabajo para explorar indicadores, revisar procesos y consultar la metodología de análisis.
          </p>
          <div className="mt-8 flex items-center gap-3 text-xs text-slate-300">
            <span className="grid size-8 place-items-center rounded-lg bg-white/8"><ShieldCheck size={16} aria-hidden="true" /></span>
            Acceso para dos perfiles de usuario
          </div>
        </div>
        <p className="relative text-xs text-slate-400">Interfaz en desarrollo · Modo claro</p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-slate-50/70 px-4 py-8 sm:px-8 lg:bg-white lg:px-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-white"><Map aria-hidden="true" /></span>
            <span className="text-sm font-semibold text-slate-800">{APP_NAME}</span>
          </div>
          <Card className="border-slate-200/80 shadow-lg shadow-slate-900/[0.04]">
            <CardHeader className="gap-2 px-6 pt-7 sm:px-8 sm:pt-8">
              <div className="mb-1 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole aria-hidden="true" /></div>
              <CardTitle className="text-[22px] font-semibold tracking-tight">Iniciar sesión</CardTitle>
              <CardDescription>Accede al espacio de trabajo de {APP_NAME}.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
              <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                <FieldGroup className="gap-4">
                  <Field data-invalid={Boolean(errors.email)}>
                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                    <Input id="email" type="email" autoComplete="email" placeholder="nombre@institucion.gov.co" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} />
                    {errors.email && <FieldError>{errors.email}</FieldError>}
                  </Field>
                  <Field data-invalid={Boolean(errors.password)}>
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Mínimo 8 caracteres" className="pr-11" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} />
                      <Button type="button" variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}>
                        {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                      </Button>
                    </div>
                    {errors.password && <FieldError>{errors.password}</FieldError>}
                  </Field>
                </FieldGroup>

                <fieldset className="flex flex-col gap-2">
                  <legend className="text-sm font-medium">Selecciona tu perfil</legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {roles.map(({ id, name, description, icon: Icon }) => (
                      <label key={id} className="relative cursor-pointer">
                        <input className="peer sr-only" type="radio" name="demo-role" value={id} checked={role === id} onChange={() => setRole(id)} />
                        <span className="flex min-h-[68px] items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 transition-colors peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
                          <Icon className={`mt-0.5 size-4 shrink-0 ${role === id ? 'text-primary' : 'text-slate-400'}`} aria-hidden="true" />
                          <span>
                            <span className="block text-xs font-semibold text-slate-800">{name}</span>
                            <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{description}</span>
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Button type="submit" size="lg" className="mt-1 h-10 w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Ingresando…</> : <>Continuar como {role === 'admin' ? 'administrador' : 'cliente'} <ArrowRight data-icon="inline-end" /></>}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Alert className="mt-4 border-slate-200 bg-white text-muted-foreground [&>svg]:text-primary">
            <ShieldCheck data-icon="inline-start" />
            <AlertDescription className="text-xs leading-5">Entorno local. El formulario valida el formato de entrada.</AlertDescription>
          </Alert>
          <div className="mt-5 text-center text-[11px] text-slate-400">{APP_NAME}</div>
        </div>
      </section>
    </main>
  )
}
