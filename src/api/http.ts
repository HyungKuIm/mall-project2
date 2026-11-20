/** 세션 쿠키를 포함해 JSON API를 호출하고, 실패 시 서버 메시지(있으면)로 에러를 던진다. */
export async function requestJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    redirect: 'manual',
    headers: init.body ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
  })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.type === 'opaqueredirect') {
      throw new Error('로그인이 필요합니다.')
    }
    let message = ''
    try {
      const data = (await res.json()) as { message?: string }
      message = data.message ?? ''
    } catch {
      // 본문이 없거나 JSON이 아님
    }
    throw new Error(message || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
