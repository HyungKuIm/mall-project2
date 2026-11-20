import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import type { Order, OrderComplete as OrderCompleteData } from '../types'
import { fetchOrder } from '../api/orders'

const DEFAULT_MESSAGE = '주문이 접수되었습니다. (실제 결제는 이뤄지지 않습니다.)'

function OrderComplete() {
  const location = useLocation()
  const [params] = useSearchParams()
  const fromState = location.state as OrderCompleteData | null
  const id = params.get('id')

  const [order, setOrder] = useState<Order | null>(fromState?.order ?? null)
  const [error, setError] = useState<string | null>(null)
  const message = fromState?.message ?? DEFAULT_MESSAGE

  // 새로고침 등으로 state가 사라졌으면 주소의 id로 다시 조회
  useEffect(() => {
    if (order || !id) return
    fetchOrder(id)
      .then(setOrder)
      .catch((e: Error) => setError(e.message))
  }, [order, id])

  if (!order && !id) {
    return (
      <main className="shop">
        <p className="status">주문 정보가 없습니다.</p>
        <Link to="/" className="btn-primary">쇼핑하러 가기</Link>
      </main>
    )
  }

  return (
    <main className="shop">
      <h1>주문 완료</h1>
      {error && <p className="status error">주문 정보를 불러오지 못했습니다: {error}</p>}
      {!order && !error && <p className="status">불러오는 중...</p>}

      {order && (
        <>
          <p className="order-message">{message}</p>

          <section className="order-summary">
            <h2>주문 번호 {order.id}</h2>
            <p className="order-meta">{new Date(order.orderDate).toLocaleString()}</p>
            <ul>
              {order.orderLines.map((line) => (
                <li key={line.id}>
                  <span>{line.productName}</span>
                  <span>{line.quantity}개</span>
                </li>
              ))}
            </ul>
            <p className="order-total">
              <span>합계</span>
              <strong>{order.totalPrice.toLocaleString()}만원</strong>
            </p>
          </section>

          <dl className="order-info">
            <dt>이름</dt>
            <dd>{order.formName}</dd>
            <dt>이메일</dt>
            <dd>{order.formMail}</dd>
            <dt>요청 사항</dt>
            <dd>{order.formMsg}</dd>
          </dl>

          <Link to="/" className="btn-primary">쇼핑 계속하기</Link>
        </>
      )}
    </main>
  )
}

export default OrderComplete
