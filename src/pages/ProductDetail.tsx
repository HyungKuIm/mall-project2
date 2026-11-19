import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { PcProduct } from '../types'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<PcProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          </div>
        </article>
      )}
    </main>
  )
}

export default ProductDetail
