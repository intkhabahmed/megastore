import { Address } from './address';
import { Order } from './order'

export class User {
    _id: string
    firstName: string
    lastName: string
    email: string
    mobile: number
    password: string
    shippingAddress: Address
    billingAddress: Address
    orders: Order[]
    wishlist: number[]
    token: string
    registedOn: Date
}