import { ShippingMethod } from './../utils/enums';
import { CartItem } from './cart-item'

export class OrderSummary {
    productNetWeight: number = 0
    productGrossWeight: number
    totalProductCost: number = 0
    grandTotal: number = 0
    shippingCost: number = 0
    shippingMethod: number
    cartItems: Map<string, CartItem> = new Map<string, CartItem>()
}