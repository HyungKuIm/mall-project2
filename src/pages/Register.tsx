import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await signup({ name: name.trim(), mail: mail.trim(), password })
      alert('회원가입이 완료되었습니다. 로그인해 주세요.')
      navigate('/login')
    } catch (err) {
      setError(`가입하지 못했습니다: ${(err as Error).message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="shop">
      <Link to="/" className="back-link">← 목록으로</Link>
      <h1>회원가입</h1>

      <form className="create-form auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>이름</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>비밀번호 확인</span>
          <input
            type="password"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </label>

        {error && <p className="status error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? '가입 중...' : '가입하기'}
        </button>

        <p className="auth-switch">
          이미 회원이신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </main>
  )
}

export default Register
