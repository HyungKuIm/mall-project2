export type PcProduct = {
  id: number
  name: string
  price: number
  kind: string
  text: string
  picSUrl: string
  picLUrl: string
}

export type Customer = {
  id?: number
  name: string
  mail: string
  role?: string
}

/** 장바구니 한 줄 (GET /api/cart 응답의 items) */
export type CartItem = {
  productId: number
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export type Cart = {
  items: CartItem[]
  totalPrice: number
}

export type OrderLine = {
  id: number
  productId: number
  productName: string
  quantity: number
}

export type Order = {
  id: number
  orderDate: string
  totalPrice: number
  formName: string
  formMail: string
  formMsg: string
  orderLines: OrderLine[]
}

export type OrderFormRequest = {
  formName: string
  formMail: string
  formMsg: string
}

/** POST /api/orders 응답 (201) */
export type OrderComplete = {
  message: string
  order: Order
}
