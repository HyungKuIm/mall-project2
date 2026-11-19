import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useImageFile } from '../hooks/useImageFile'

function ProductCreate() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [kind, setKind] = useState('')
  const [text, setText] = useState('')
  const picS = useImageFile()
  const picL = useImageFile()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!picS.file || !picL.file) {
      setError('작은 이미지와 큰 이미지를 모두 선택해 주세요.')
      return
    }

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('price', price)
    formData.append('kind', kind.trim())
    formData.append('text', text.trim())
    formData.append('picS', picS.file)
    formData.append('picL', picL.file)

    setSubmitting(true)
    setError(null)
    try {
      // Content-Type은 지정하지 않음 → 브라우저가 multipart boundary를 붙여 설정
      const res = await fetch('/api/pc-products', { method: 'POST', body: formData })
      if (res.status !== 201) throw new Error(`HTTP ${res.status}`)
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="shop">
      <Link to="/" className="back-link">← 목록으로</Link>
      <h1>제품 등록</h1>

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
            <span>작은 이미지</span>
            <input type="file" accept="image/*" onChange={picS.onChange} required />
            {picS.preview && <img src={picS.preview} alt="작은 이미지 미리보기" className="preview" />}
          </label>

          <label className="field">
            <span>큰 이미지</span>
            <input type="file" accept="image/*" onChange={picL.onChange} required />
            {picL.preview && <img src={picL.preview} alt="큰 이미지 미리보기" className="preview" />}
          </label>
        </div>

        {error && <p className="status error">등록하지 못했습니다: {error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? '등록 중...' : '등록'}
        </button>
      </form>
    </main>
  )
}

export default ProductCreate
