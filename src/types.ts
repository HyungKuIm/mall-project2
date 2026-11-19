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
