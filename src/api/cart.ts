import type { Cart } from '../types'
import { requestJson } from './http'

/** 한 상품당 담을 수 있는 최대 수량 (서버는 99개까지 허용하지만 화면에서 5개로 제한) */
export const MAX_CART_QUANTITY = 5

export function fetchCart(): Promise<Cart> {
  return requestJson<Cart>('/api/cart')
}

/** 담기: 이미 담긴 상품이면 서버에서 수량이 더해짐 */
export function addCartItem(productId: number, quantity: number): Promise<Cart> {
  return requestJson<Cart>('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })
}

export function changeCartQuantity(productId: number, quantity: number): Promise<Cart> {
  return requestJson<Cart>(`/api/cart/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  })
}

export function removeCartItem(productId: number): Promise<Cart> {
  return requestJson<Cart>(`/api/cart/items/${productId}`, { method: 'DELETE' })
}

export function clearCart(): Promise<void> {
  return requestJson<void>('/api/cart', { method: 'DELETE' })
}
