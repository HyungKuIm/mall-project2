import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  // 관리자 페이지에서 튕겨 온 경우 로그인 후 그 페이지로 복귀
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(mail.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="shop">
      <Link to="/" className="back-link">← 목록으로</Link>
      <h1>로그인</h1>

      <form className="create-form auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>이메일</span>
          <input
            type="email"
            autoComplete="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="status error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? '로그인 중...' : '로그인'}
        </button>

        <p className="auth-switch">
          아직 회원이 아니신가요? <Link to="/register">회원가입</Link>
        </p>
      </form>
    </main>
  )
}

export default Login
