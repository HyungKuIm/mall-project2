import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { PcProduct } from '../types'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<PcProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!product || !window.confirm(`'${product.name}' 제품을 삭제할까요?`)) return

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
            <div className="detail-actions">
              <Link to={`/pc/update/${product.id}`} className="btn-primary">수정</Link>
              <button type="button" className="btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
            {deleteError && <p className="status error">삭제하지 못했습니다: {deleteError}</p>}
          </div>
        </article>
      )}
    </main>
  )
}

export default ProductDetail
