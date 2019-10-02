import { map } from 'rxjs/operators';
import { Product } from './../models/product';
import { CartItem } from './../models/cart-item';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { OrderSummary } from '../models/order-summary';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor() { }

    private orderSummarySource = new BehaviorSubject<OrderSummary>(JSON.parse(localStorage.getItem('orderSummary'), (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (value.dataType === 'Map') {
                return new Map(value.value);
            }
        }
        return value;
    }) || new OrderSummary())

    orderSummary = this.orderSummarySource.asObservable();

    changeOrderDetails(orderSummary: OrderSummary) {
        this.orderSummarySource.next(orderSummary)
        localStorage.setItem('orderSummary', JSON.stringify(orderSummary, (key, value) => {
            if (value instanceof Map) {
                return {
                    dataType: 'Map',
                    value: [...value]
                }
            } else {
                return value
            }
        }))
    }
}