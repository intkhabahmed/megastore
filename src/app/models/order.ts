import { Tracking } from './tracking';
import { OrderSummary } from './order-summary';
export class Order {
    _id: number
    userId: number
    orderDate: Date
    orderSummary: OrderSummary
    trackingDetails: Tracking
}