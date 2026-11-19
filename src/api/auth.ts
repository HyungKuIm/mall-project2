import type { Customer } from '../types'

export type SignupRequest = {
  name: string
  mail: string
  password: string
}

/** 회원가입: JSON 본문으로 전송 */
export async function signup(body: SignupRequest): Promise<void> {
  const res = await fetch('/api/customers/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `HTTP ${res.status}`)
  }
}

/** 내 정보: 로그인 안 되어 있으면 null */
export async function fetchMe(): Promise<Customer | null> {
  const res = await fetch('/api/customers/me', { credentials: 'include', redirect: 'manual' })
  if (!res.ok) return null
  const type = res.headers.get('Content-Type') ?? ''
  if (!type.includes('application/json')) return null
  return (await res.json()) as Customer
}

/**
 * 로그인: 폼 데이터(application/x-www-form-urlencoded)로 전송.
 * 백엔드가 성공/실패 시 리다이렉트를 보낼 수 있으므로 응답 상태만 믿지 않고
 * /api/customers/me 로 실제 로그인 여부를 확인한다.
 */
export async function login(mail: string, password: string): Promise<Customer> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ mail, password }),
    credentials: 'include',
    redirect: 'manual',
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }
  const me = await fetchMe()
  if (!me) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  return me
}

export async function logout(): Promise<void> {
  await fetch('/api/logout', { method: 'POST', credentials: 'include', redirect: 'manual' })
}
