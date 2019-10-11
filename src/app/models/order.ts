import { User } from './user';
import { Address } from './address';
import { OrderSummary } from './order-summary';
import { Payment } from './payment';
import { Tracking } from './tracking';
export class Order {
    _id: string
    user: any //User Model
    orderNo: string
    orderDate: Date
    orderSummary: any = new OrderSummary() //OrderSummary Model
    orderStatus: number
    address: any = new Address() //Address Model
    trackingDetails: any //Tracking model
    invoiceId: string
    payment: any // Payment Model
}