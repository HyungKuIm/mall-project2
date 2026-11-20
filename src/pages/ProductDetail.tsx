import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { PcProduct } from '../types'
import { useAuth } from '../auth/AuthContext'
import { MAX_CART_QUANTITY, addCartItem, fetchCart } from '../api/cart'

function ProductDetail() {
  const { me, isAdmin } = useAuth()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [quantity, setQuantity] = useState(1)
  const [inCart, setInCart] = useState(0)
  const [adding, setAdding] = useState(false)
  const [cartMsg, setCartMsg] = useState<{ ok: boolean; text: string } | null>(null)
  // 같은 상품은 수량이 더해지므로, 이미 담긴 수량을 빼고 남은 만큼만 선택 가능
  const remaining = Math.max(0, MAX_CART_QUANTITY - inCart)

  useEffect(() => {
    if (!me || !id) return
    fetchCart()
      .then((cart) => setInCart(cart.items.find((i) => i.productId === Number(id))?.quantity ?? 0))
      .catch(() => setInCart(0))
  }, [me, id])

  const handleAddToCart = async () => {
    if (!product) return
    if (!me) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setAdding(true)
    setCartMsg(null)
    try {
      const cart = await addCartItem(product.id, Math.min(quantity, remaining))
      setInCart(cart.items.find((i) => i.productId === product.id)?.quantity ?? 0)
      setQuantity(1)
      setCartMsg({ ok: true, text: '장바구니에 담았습니다.' })
    } catch (err) {
      setCartMsg({ ok: false, text: `담지 못했습니다: ${(err as Error).message}` })
    } finally {
      setAdding(false)
    }
  }
  const [product, setProduct] = useState<PcProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!isAdmin || !product || !window.confirm(`'${product.name}' 제품을 삭제할까요?`)) return

    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/pc-products/${product.id}`, { method: 'DELETE' })
      if (res.status !== 204) throw new Error(`HTTP ${res.status}`)
      navigate('/')
    } catch (err) {
      setDeleteError((err as Error).message)
      setDeleting(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    // vite 프록시가 /api 요청을 http://localhost:8080 으로 전달
    fetch(`/api/pc-products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<PcProduct>
      })
      .then(setProduct)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <main className="shop">
      <Link to="/" className="back-link">← 목록으로</Link>

      {loading && <p className="status">불러오는 중...</p>}
      {error && <p className="status error">제품 정보를 불러오지 못했습니다: {error}</p>}

      {product && !loading && (
        <article className="detail">
          <img src={product.picLUrl} alt={product.name} className="detail-image" />
          <div className="detail-info">
            <span className="kind">{product.kind}</span>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-price">{product.price.toLocaleString()}만원</p>
            <p className="detail-desc">{product.text}</p>

            <div className="cart-add">
              {remaining > 0 ? (
                <>
                  <select
                    className="qty-select"
                    aria-label="수량"
                    value={Math.min(quantity, remaining)}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={adding}
                  >
                    {Array.from({ length: remaining }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}개</option>
                    ))}
                  </select>
                  <button type="button" className="btn-primary" onClick={handleAddToCart} disabled={adding}>
                    {adding ? '담는 중...' : '장바구니 담기'}
                  </button>
                </>
              ) : (
                <p className="status">최대 수량({MAX_CART_QUANTITY}개)을 이미 담았습니다.</p>
              )}
            </div>
            {inCart > 0 && <p className="cart-note">장바구니에 {inCart}개 담겨 있습니다 (최대 {MAX_CART_QUANTITY}개).</p>}
            {cartMsg && (
              <p className={cartMsg.ok ? 'status' : 'status error'}>
                {cartMsg.text} {cartMsg.ok && <Link to="/cart" className="btn-text">장바구니 보기 →</Link>}
              </p>
            )}
            {isAdmin && (
              <div className="detail-actions">
                <Link to={`/pc/update/${product.id}`} className="btn-primary">수정</Link>
                <button type="button" className="btn-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
            {deleteError && <p className="status error">삭제하지 못했습니다: {deleteError}</p>}
          </div>
        </article>
      )}
    </main>
  )
}

export default ProductDetail
