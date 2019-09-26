import { OrderSummary } from './order-summary';
import { Payment } from './payment';
import { Tracking } from './tracking';
export class Order {
    _id: number
    userId: string
    orderDate: Date
    orderSummary: OrderSummary
    orderStatus: string
    trackingDetails: Tracking
    invoiceId: string
    payment: Payment
}