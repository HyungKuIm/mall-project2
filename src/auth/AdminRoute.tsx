import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

/** ADMIN 권한이 있는 사용자만 children을 보여줌 */
function AdminRoute({ children }: { children: ReactNode }) {
  const { me, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main className="shop">
        <p className="status">확인 중...</p>
      </main>
    )
  }

  // 비로그인 → 로그인 페이지로 보내고, 로그인 후 원래 페이지로 돌아오도록 경로 전달
  if (!me) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  if (!isAdmin) {
    return (
      <main className="shop">
        <Link to="/" className="back-link">← 목록으로</Link>
        <p className="status error">관리자만 접근할 수 있습니다.</p>
      </main>
    )
  }

  return <>{children}</>
}

export default AdminRoute
