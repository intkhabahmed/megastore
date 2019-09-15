import { Product } from './../models/product';
import { CartItem } from './../models/cart-item';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { OrderSummary } from '../models/order-summary';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor() { }

    private orderSummarySource = new BehaviorSubject<OrderSummary>(new OrderSummary())

    orderSummary = this.orderSummarySource.asObservable();

    changeOrderDetails(orderSummary) {
        this.orderSummarySource.next(orderSummary)
    }
}