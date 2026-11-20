import type { Order, OrderComplete, OrderFormRequest } from '../types'
import { requestJson } from './http'

/** 주문하기: 장바구니 내용으로 주문하고, 성공하면 서버가 장바구니를 비운다. */
export function placeOrder(form: OrderFormRequest): Promise<OrderComplete> {
  return requestJson<OrderComplete>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(form),
  })
}

export function fetchOrder(id: number | string): Promise<Order> {
  return requestJson<Order>(`/api/orders/${id}`)
}
