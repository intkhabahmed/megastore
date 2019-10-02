import { CartItem } from './../../models/cart-item';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderSummary } from './../../models/order-summary';
import { ApiService } from './../../services/api.service';
import { DataService } from './../../services/data.service';
import { Utility } from './../../utils/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  orderSummary: OrderSummary
  constructor(private dataService: DataService, public utility: Utility, private service: ApiService, private router: Router) { }

  ngOnInit() {
    this.dataService.orderSummary.subscribe(summary => this.orderSummary = summary)
  }

  completePurchase() {
    this.orderSummary.cartItems.forEach(cartItem => {
      cartItem.product.quantity[cartItem.product.selectedIndex] -= cartItem.noOfItems
      this.service.updateProduct(cartItem.product._id, cartItem.product).subscribe(() => { })
    })
    this.dataService.changeOrderDetails(new OrderSummary())
    this.router.navigate(['/'])
  }

}
