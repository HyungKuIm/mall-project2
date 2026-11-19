import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { PcProduct } from '../types'
import { useImageFile } from '../hooks/useImageFile'

function ProductUpdate() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<PcProduct | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [kind, setKind] = useState('')
  const [text, setText] = useState('')
  const picS = useImageFile()
  const picL = useImageFile()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 기존 제품 정보를 불러와 폼에 채움
  useEffect(() => {
    setLoading(true)
    setLoadError(null)
    fetch(`/api/pc-products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<PcProduct>
      })
      .then((p) => {
        setProduct(p)
        setName(p.name)
        setPrice(String(p.price))
        setKind(p.kind)
        setText(p.text)
      })
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('price', price)
    formData.append('kind', kind.trim())
    formData.append('text', text.trim())
    // 새로 선택한 이미지만 전송 (선택하지 않으면 기존 이미지 유지)
    if (picS.file) formData.append('picS', picS.file)
    if (picL.file) formData.append('picL', picL.file)

    setSubmitting(true)
    setError(null)
    try {
      // Content-Type은 지정하지 않음 → 브라우저가 multipart boundary를 붙여 설정
      const res = await fetch(`/api/pc-products/${id}`, { method: 'PUT', body: formData })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="shop">
      <Link to={`/pc/${id}`} className="back-link">← 상세로</Link>
      <h1>제품 수정</h1>

      {loading && <p className="status">불러오는 중...</p>}
      {loadError && <p className="status error">제품 정보를 불러오지 못했습니다: {loadError}</p>}

      {product && !loading && (
        <form className="create-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>제품명</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="field">
            <span>가격 (만원)</span>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>종류</span>
            <input value={kind} onChange={(e) => setKind(e.target.value)} required />
          </label>

          <label className="field">
            <span>설명</span>
            <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} required />
          </label>

          <div className="file-row">
            <label className="field">
              <span>작은 이미지 (변경 시에만 선택)</span>
              <input type="file" accept="image/*" onChange={picS.onChange} />
              <img
                src={picS.preview ?? product.picSUrl}
                alt="작은 이미지 미리보기"
                className="preview"
              />
            </label>

            <label className="field">
              <span>큰 이미지 (변경 시에만 선택)</span>
              <input type="file" accept="image/*" onChange={picL.onChange} />
              <img
                src={picL.preview ?? product.picLUrl}
                alt="큰 이미지 미리보기"
                className="preview"
              />
            </label>
          </div>

          {error && <p className="status error">수정하지 못했습니다: {error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? '수정 중...' : '수정'}
          </button>
        </form>
      )}
    </main>
  )
}

export default ProductUpdate
