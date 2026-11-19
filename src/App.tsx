import { useEffect, useState } from 'react'
import './App.css'

type PcProduct = {
  id: number
  name: string
  price: number
  kind: string
  text: string
  picSUrl: string
  picLUrl: string
}

function App() {
  const [products, setProducts] = useState<PcProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/pc-products')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<PcProduct[]>
      })
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="shop">
      <h1>중고 노트북 판매</h1>

      {loading && <p className="status">불러오는 중...</p>}
      {error && <p className="status error">목록을 불러오지 못했습니다: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="status">등록된 제품이 없습니다.</p>
      )}

      <ul className="product-list">
        {products.map((p) => (
          <li key={p.id} className="product-card">
            <img src={p.picSUrl} alt={p.name} className="thumb" loading="lazy" />
            <div className="info">
              <span className="kind">{p.kind}</span>
              <h2 className="name">{p.name}</h2>
              <p className="desc">{p.text}</p>
              <p className="price">{p.price.toLocaleString()}만원</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
