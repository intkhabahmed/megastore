import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from './../../models/order';
import { OrderSummary } from './../../models/order-summary';
import { ApiService } from './../../services/api.service';
import { DataService } from './../../services/data.service';
import { OrderStatus } from './../../utils/enums';
import { Utility } from './../../utils/utils';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {

  isSuccess = 0
  loading = true
  orderStatus = OrderStatus
  constructor(private router: Router, private route: ActivatedRoute, private utility: Utility, private api: ApiService, private dataService: DataService) { }

  ngOnInit() {
    this.isSuccess = this.route.snapshot.queryParams['status']
    this.api.getPaymentForUserByOrderId({orderId: this.utility.order.orderNo}).subscribe(payment => {
      this.utility.order.orderStatus = this.isSuccess == 0 ? this.orderStatus.FAILED : this.orderStatus.PROCESSING
      this.utility.order.payment = payment._id
      this.api.insertOrder(this.utility.order).subscribe(order => {
        this.api.getUserById().subscribe(user => {
          user.orders.push(order._id)
          this.api.updateUser(user).subscribe(user => { })
        })
        if (this.isSuccess == 1) {
          this.utility.orderSummary.cartItems.forEach(item => {
            item.product.quantity[item.product.selectedIndex][item.product.subIndex] -= this.utility.convertToRequiredUnit({
              quantity: item.noOfItems,
              sourceUnit: item.product.selectedUnit,
              bunchPerPack: item.product.bunchInfo?.bunchPerPacket
            })
            this.api.updateProduct(item.product._id, item.product).subscribe(() => { })
          })
        }
        this.loading = false
        this.dataService.changeOrder(new Order())
        this.dataService.changeOrderDetails(new OrderSummary())
      },
        error => {
          this.loading = false
          this.isSuccess = 0
        })
    })
  }

  goToPage(target: string) {
    switch (target) {
      case 'profile':
        this.router.navigate(['/profile'], { replaceUrl: true })
        break
      case 'home':
        this.router.navigate(['/'], { replaceUrl: true })
        break
      default:
        break
    }

  }
}
