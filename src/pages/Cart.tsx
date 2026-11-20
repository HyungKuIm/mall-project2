import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Cart as CartData } from '../types'
import { MAX_CART_QUANTITY, changeCartQuantity, clearCart, fetchCart, removeCartItem } from '../api/cart'

const QUANTITY_OPTIONS = Array.from({ length: MAX_CART_QUANTITY }, (_, i) => i + 1)

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
      .then(setCart)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  /** 장바구니 변경 요청 공통 처리: 진행 중 버튼 잠금 + 에러 표시 */
  const run = async (action: () => Promise<CartData | void>) => {
    setBusy(true)
    setError(null)
    try {
      const next = await action()
      setCart(next ?? { items: [], totalPrice: 0 })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const handleClear = () => {
    if (window.confirm('장바구니를 비울까요?')) run(clearCart)
  }

  const items = cart?.items ?? []

  return (
    <main className="shop">
      <Link to="/" className="back-link">← 쇼핑 계속하기</Link>
      <h1>장바구니</h1>

      {loading && <p className="status">불러오는 중...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && cart && items.length === 0 && <p className="status">장바구니가 비어 있습니다.</p>}

      {cart && items.length > 0 && (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.productId} className="cart-item">
                <Link to={`/pc/${item.productId}`}>
                  <img
                    src={`/api/pc-products/${item.productId}/pic-s`}
                    alt={item.productName}
                    className="cart-thumb"
                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                  />
                </Link>
                <div className="cart-info">
                  <Link to={`/pc/${item.productId}`} className="cart-name">{item.productName}</Link>
                  <span className="cart-unit">{item.price.toLocaleString()}만원</span>
                </div>
                <select
                  className="qty-select"
                  aria-label={`${item.productName} 수량`}
                  value={Math.min(item.quantity, MAX_CART_QUANTITY)}
                  disabled={busy}
                  onChange={(e) => run(() => changeCartQuantity(item.productId, Number(e.target.value)))}
                >
                  {QUANTITY_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}개</option>
                  ))}
                </select>
                <span className="cart-subtotal">{item.subtotal.toLocaleString()}만원</span>
                <button
                  type="button"
                  className="btn-text"
                  disabled={busy}
                  onClick={() => run(() => removeCartItem(item.productId))}
                >
                  빼기
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <button type="button" className="btn-text" disabled={busy} onClick={handleClear}>
              장바구니 비우기
            </button>
            <p className="cart-total">
              합계 <strong>{cart.totalPrice.toLocaleString()}만원</strong>
            </p>
            <button type="button" className="btn-primary" disabled={busy} onClick={() => navigate('/orderForm')}>
              주문하기
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default Cart
