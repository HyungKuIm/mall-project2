import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

/** 로그인 상태에 따라 로그인/회원가입 링크 또는 사용자 이름/로그아웃 버튼 표시 */
function AuthNav() {
  const { me, loading, isAdmin, logout } = useAuth()

  if (loading) return null

  return (
    <nav className="auth-nav">
      {me ? (
        <>
          <span className="auth-user">
            {me.name}님{isAdmin && ' (관리자)'}
          </span>
          <button type="button" className="btn-text" onClick={logout}>로그아웃</button>
        </>
      ) : (
        <>
          <Link to="/login" className="btn-text">로그인</Link>
          <Link to="/register" className="btn-text">회원가입</Link>
        </>
      )}
    </nav>
  )
}

export default AuthNav
