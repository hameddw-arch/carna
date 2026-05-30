import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getSession, clearSession } from '../lib/auth'
import type { AuthUser } from '../lib/auth'

interface AuthContextType {
  user: AuthUser | null
  setUser: (u: AuthUser | null) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUserState(getSession())
    setLoading(false)
  }, [])

  function setUser(u: AuthUser | null) {
    setUserState(u)
  }

  function logout() {
    clearSession()
    setUserState(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
