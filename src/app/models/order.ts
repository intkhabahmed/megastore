import { Address } from './address';
import { OrderSummary } from './order-summary';
export class Order {
    _id: string
    user: any //User Model
    orderNo: string
    orderDate: Date
    orderSummary: any = new OrderSummary() //OrderSummary Model
    orderStatus: number
    address: any = new Address() //Address Model
    trackingNo: string
    invoiceId: string
    payment: any // Payment Model
}