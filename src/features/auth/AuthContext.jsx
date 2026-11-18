import { createContext, useContext, useMemo, useState } from 'react'

const DemoAuthContext = createContext(null)

export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(null)

  async function enterDemo({ email, role }) {
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    setUser({
      email: email.trim(),
      role,
      name: role === 'admin' ? 'Administrador' : (email.split('@')[0] || 'Usuario'),
    })
  }

  function signOut() {
    setUser(null)
  }

  const value = useMemo(() => ({ user, enterDemo, signOut }), [user])

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)

  if (!context) {
    throw new Error('useDemoAuth debe utilizarse dentro de DemoAuthProvider')
  }

  return context
}
