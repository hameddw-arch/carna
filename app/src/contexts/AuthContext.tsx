import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthUser, getSession, clearSession } from '../lib/auth'

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
