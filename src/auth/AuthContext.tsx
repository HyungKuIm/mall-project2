import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchMe, login as apiLogin, logout as apiLogout } from '../api/auth'
import type { Customer } from '../types'

type AuthState = {
  me: Customer | null
  loading: boolean
  isAdmin: boolean
  login: (mail: string, password: string) => Promise<Customer>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

/** 백엔드가 'ADMIN' 또는 'ROLE_ADMIN' 중 어느 쪽으로 보내도 관리자로 인식 */
function checkAdmin(me: Customer | null): boolean {
  const role = me?.role?.toUpperCase()
  return role === 'ADMIN' || role === 'ROLE_ADMIN'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (mail: string, password: string) => {
    const user = await apiLogin(mail, password)
    setMe(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setMe(null)
  }, [])

  return (
    <AuthContext.Provider value={{ me, loading, isAdmin: checkAdmin(me), login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  return ctx
}
