import { JsonUtils } from './../utils/json-utils';
import { Utility } from './../utils/utils';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Order } from '../models/order';
import { OrderSummary } from '../models/order-summary';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private jsonUtils: JsonUtils) { }

    private orderSummarySource = new BehaviorSubject<OrderSummary>(this.jsonUtils.parseJson(localStorage.getItem('orderSummary')) || new OrderSummary())

    private orderSource = new BehaviorSubject<Order>(JSON.parse(localStorage.getItem('order')) || new Order())

    orderSummary = this.orderSummarySource.asObservable();
    order = this.orderSource.asObservable();

    changeOrderDetails(orderSummary: OrderSummary) {
        this.orderSummarySource.next(orderSummary)
        localStorage.setItem('orderSummary', this.jsonUtils.getJsonString(orderSummary))
    }

    changeOrder(order: Order) {
        this.orderSource.next(order)
        localStorage.setItem('order', JSON.stringify(order))
    }
}