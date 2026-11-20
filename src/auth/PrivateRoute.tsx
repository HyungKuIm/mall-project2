import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

/** 로그인한 사용자만 children을 보여줌 (비로그인 → 로그인 후 원래 페이지로 복귀) */
function PrivateRoute({ children }: { children: ReactNode }) {
  const { me, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main className="shop">
        <p className="status">확인 중...</p>
      </main>
    )
  }

  if (!me) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />

  return <>{children}</>
}

export default PrivateRoute
