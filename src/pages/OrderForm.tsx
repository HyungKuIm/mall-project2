import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import type { Cart } from '../types'
import { fetchCart } from '../api/cart'
import { placeOrder } from '../api/orders'
import { useAuth } from '../auth/AuthContext'

function OrderForm() {
  const navigate = useNavigate()
  const { me } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  // 주문자 이름/메일은 로그인 정보로 미리 채움 (수정 가능)
  const [formName, setFormName] = useState(me?.name ?? '')
  const [formMail, setFormMail] = useState(me?.mail ?? '')
  const [formMsg, setFormMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
      .then(setCart)
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const result = await placeOrder({
        formName: formName.trim(),
        formMail: formMail.trim(),
        formMsg: formMsg.trim(),
      })
      // 새로고침해도 주문을 다시 불러올 수 있도록 id를 주소에 남김
      navigate(`/orderComplete?id=${result.order.id}`, { replace: true, state: result })
    } catch (err) {
      setError((err as Error).message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="shop">
        <p className="status">불러오는 중...</p>
      </main>
    )
  }

  // 빈 장바구니로는 주문서를 쓸 수 없음
  if (cart && cart.items.length === 0) return <Navigate to="/cart" replace />

  return (
    <main className="shop">
      <Link to="/cart" className="back-link">← 장바구니로</Link>
      <h1>주문서</h1>

      {loadError && <p className="status error">장바구니를 불러오지 못했습니다: {loadError}</p>}

      {cart && (
        <section className="order-summary">
          <h2>주문 상품</h2>
          <ul>
            {cart.items.map((item) => (
              <li key={item.productId}>
                <span>{item.productName} × {item.quantity}</span>
                <span>{item.subtotal.toLocaleString()}만원</span>
              </li>
            ))}
          </ul>
          <p className="order-total">
            <span>합계</span>
            <strong>{cart.totalPrice.toLocaleString()}만원</strong>
          </p>
        </section>
      )}

      <form className="create-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>이름</span>
          <input value={formName} maxLength={100} onChange={(e) => setFormName(e.target.value)} required />
        </label>

        <label className="field">
          <span>이메일</span>
          <input
            type="email"
            value={formMail}
            maxLength={255}
            onChange={(e) => setFormMail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>요청 사항</span>
          <textarea rows={4} value={formMsg} maxLength={1000} onChange={(e) => setFormMsg(e.target.value)} required />
        </label>

        {error && <p className="status error">주문하지 못했습니다: {error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting || !cart}>
          {submitting ? '주문 중...' : '주문 완료'}
        </button>
      </form>
    </main>
  )
}

export default OrderForm
