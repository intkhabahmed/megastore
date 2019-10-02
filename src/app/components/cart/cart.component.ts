import { ApiService } from './../../services/api.service';
import { Observable } from 'rxjs';
import { CartItem } from './../../models/cart-item';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Product } from 'src/app/models/product';
import { OrderSummary } from './../../models/order-summary';
import { DataService } from './../../services/data.service';
import { Utility } from './../../utils/utils';
import { Router, RouterStateSnapshot } from '@angular/router';
import { GrossWeight } from 'src/app/models/gross-weight';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(public dataService: DataService, public utility: Utility, private cdr: ChangeDetectorRef,
    private router: Router, private api: ApiService) { }

  showDistanceDialog: boolean
  distances = [100, 200, 300, 400]
  baseShippingCost = 0.5

  ngOnInit() {
    this.utility.orderSummary.grandTotal = this.utility.orderSummary.shippingCost == 0 ? this.utility.orderSummary.totalProductCost :
      this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
  }

  changeDeliveryMethod(deliveryMethod) {
    this.utility.orderSummary.shippingMethod = deliveryMethod
    this.dataService.changeOrderDetails(this.utility.orderSummary)
    this.showDistanceDialog = true
  }

  calculateShippingCost(distance) {
    this.utility.orderSummary.shippingCost = this.baseShippingCost * distance;
    this.utility.orderSummary.grandTotal = this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
    this.dataService.changeOrderDetails(this.utility.orderSummary)
  }

  editCartItem(id: any) {
    this.router.navigate(['products', id], { queryParams: { isEditing: true, returnUrl: this.router.routerState.snapshot.url } })
  }
}
