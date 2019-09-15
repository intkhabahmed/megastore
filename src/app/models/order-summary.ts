import { CartItem } from './cart-item'

export class OrderSummary {
    productNetWeight: number = 0
    productGrossWeight: number = 0
    totalProductCost: number = 0
    grandTotal: number = 0
    shippingCost: number = 0
    shippingMethod: string
    cartItems: Map<string, CartItem> = new Map<string, CartItem>()
}