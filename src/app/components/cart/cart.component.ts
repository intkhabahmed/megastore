import { CartItem } from './../../models/cart-item';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Product } from 'src/app/models/product';
import { OrderSummary } from './../../models/order-summary';
import { DataService } from './../../services/data.service';
import { Utility } from './../../utils/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(public dataService: DataService, public utility: Utility, private cdr: ChangeDetectorRef) { }

  showDistanceDialog: boolean
  distances = [100, 200, 300, 400]
  baseShippingCost = 0.5
  orderSummary: OrderSummary;

  ngOnInit() {
    this.dataService.orderSummary.subscribe(summary => this.orderSummary = summary);
    this.orderSummary.grandTotal = this.orderSummary.shippingCost == 0 ? this.orderSummary.totalProductCost :
      this.orderSummary.totalProductCost + this.orderSummary.shippingCost
  }

  removeItemFromCart(product: Product) {
    var cartItem = this.orderSummary.cartItems.get(product._id)
    this.orderSummary.productNetWeight -= product.weight
    this.orderSummary.totalProductCost -= cartItem.itemsCost
    this.orderSummary.grandTotal -= cartItem.itemsCost * cartItem.noOfItems
    this.orderSummary.cartItems.delete(product._id)
    if (this.orderSummary.cartItems.size == 0) {
      this.orderSummary.shippingCost = 0
      this.orderSummary.shippingMethod = ""
    }
    this.dataService.changeOrderDetails(this.orderSummary)
  }

  changeDeliveryMethod(deliveryMethod) {
    this.orderSummary.shippingMethod = deliveryMethod
    this.dataService.changeOrderDetails(this.orderSummary)
    this.showDistanceDialog = true
  }

  calculateShippingCost(distance) {
    this.orderSummary.shippingCost = this.baseShippingCost * distance;
    this.orderSummary.grandTotal = this.orderSummary.totalProductCost + this.orderSummary.shippingCost
    this.dataService.changeOrderDetails(this.orderSummary)
  }
}
