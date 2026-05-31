import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getSession, clearSession } from '../lib/auth'
import type { AuthUser } from '../lib/auth'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  setUser: (u: AuthUser | null) => void
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const sessionUser = await getSession()
      setUserState(sessionUser)
      setLoading(false)
    }
    
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
         const currentUser = await getSession()
         setUserState(currentUser)
      } else if (event === 'SIGNED_OUT') {
         setUserState(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  function setUser(u: AuthUser | null) {
    setUserState(u)
  }

  async function logout() {
    await clearSession()
    setUserState(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
