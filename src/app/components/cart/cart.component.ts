import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ShippingRate } from 'src/app/models/shipping-rate';
import { CartItem } from './../../models/cart-item';
import { ApiService } from './../../services/api.service';
import { DataService } from './../../services/data.service';
import { ShippingMethod } from './../../utils/enums';
import { Utility } from './../../utils/utils';

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
  shippingMethod = ShippingMethod
  deliveryMethodSelected = false
  shippingRates$: Observable<ShippingRate[]>
  loading = false

  ngOnInit() {
    this.utility.orderSummary.grandTotal = this.utility.orderSummary.shippingCost == 0 ? this.utility.orderSummary.totalProductCost :
      this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
    if (this.utility.orderSummary.shippingCost == 0) {
      this.deliveryMethodSelected = false
    }
  }

  changeDeliveryMethod(deliveryMethod) {
    if (this.utility.orderSummary.shippingCost != 0 && deliveryMethod !== this.utility.orderSummary.shippingMethod) {
      this.utility.orderSummary.shippingCost = 0
    }
    this.utility.orderSummary.shippingMethod = deliveryMethod
    this.dataService.changeOrderDetails(this.utility.orderSummary)
    this.showDistanceDialog = true
  }

  calculateShippingCost(value?) {
    this.loading = true
    if (this.utility.orderSummary.shippingMethod === this.shippingMethod.REGISTERED_POST) {
      this.api.calculateShippingCharge({
        shippingMethod: this.utility.orderSummary.shippingMethod, minWeight: { $lte: this.utility.orderSummary.productGrossWeight },
        maxWeight: { $gte: this.utility.orderSummary.productGrossWeight }
      }).subscribe(
        shippingRate => {
          this.utility.orderSummary.shippingCost = shippingRate.rate
          this.utility.orderSummary.grandTotal = this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
          this.dataService.changeOrderDetails(this.utility.orderSummary)
          this.loading = false
          this.cdr.detectChanges()
        },
        err => {
          this.loading = false
          this.cdr.detectChanges()
        }
      )
    } else if (this.utility.orderSummary.shippingMethod === this.shippingMethod.SPEED_POST) {
      var distance = value != -1 ? value.split('-') : []
      this.api.calculateShippingCharge(value != -1 ? {
        shippingMethod: this.utility.orderSummary.shippingMethod, minWeight: { $lte: this.utility.orderSummary.productGrossWeight },
        maxWeight: { $gte: this.utility.orderSummary.productGrossWeight }, minDistance: distance[0], maxDistance: distance[1], isLocal: false
      } : {
          shippingMethod: this.utility.orderSummary.shippingMethod, minWeight: { $lte: this.utility.orderSummary.productGrossWeight },
          maxWeight: { $gte: this.utility.orderSummary.productGrossWeight }, isLocal: true
        }).subscribe(
          shippingRate => {
            this.utility.orderSummary.shippingCost = shippingRate.rate
            this.utility.orderSummary.grandTotal = this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
            this.dataService.changeOrderDetails(this.utility.orderSummary)
            this.loading = false
            this.cdr.detectChanges()
          },
          err => {
            this.utility.orderSummary.shippingCost = 0
            this.utility.orderSummary.grandTotal = this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
            this.loading = false
            this.cdr.detectChanges()
          }
        )
    } else if (this.utility.orderSummary.shippingMethod === this.shippingMethod.PROFESSIONAL ||
      this.utility.orderSummary.shippingMethod === this.shippingMethod.SHREE_MAHAVIR) {
      this.api.calculateShippingCharge({
        shippingMethod: this.utility.orderSummary.shippingMethod, minWeight: { $lte: this.utility.orderSummary.productGrossWeight },
        maxWeight: { $gte: this.utility.orderSummary.productGrossWeight }, isLocal: value
      }).subscribe(
        shippingRate => {
          if (value === 'true') {
            this.utility.orderSummary.shippingCost = shippingRate.perKgRate * this.utility.orderSummary.productGrossWeight / 1000
          } else {
            this.utility.orderSummary.shippingCost = shippingRate.rate
          }
          this.utility.orderSummary.grandTotal = this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
          this.dataService.changeOrderDetails(this.utility.orderSummary)
          this.loading = false
          this.cdr.detectChanges()
        },
        err => {
          this.utility.orderSummary.shippingCost = 0
          this.utility.orderSummary.grandTotal = this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
          this.loading = false
          this.cdr.detectChanges()
        }
      )
    } else {
      this.api.calculateShippingCharge({
        shippingMethod: this.utility.orderSummary.shippingMethod, area: value
      }).subscribe(
        shippingRate => {
          if (this.utility.orderSummary.productGrossWeight <= 500) {
            this.utility.orderSummary.shippingCost = shippingRate.halfKgRate
          } else {
            this.utility.orderSummary.shippingCost = shippingRate.perKgRate * (this.utility.orderSummary.productGrossWeight / 1000)
          }
          this.utility.orderSummary.grandTotal = this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
          this.dataService.changeOrderDetails(this.utility.orderSummary)
          this.loading = false
          this.cdr.detectChanges()
        },
        err => {
          this.utility.orderSummary.shippingCost = 0
          this.utility.orderSummary.grandTotal = this.utility.orderSummary.totalProductCost + this.utility.orderSummary.shippingCost
          this.loading = false
          this.cdr.detectChanges()
        }
      )
    }
  }

  editCartItem(item: CartItem) {
    this.router.navigate(['products', item.product._id], { queryParams: { isEditing: true, returnUrl: this.router.routerState.snapshot.url, itemId: item.id } })
  }

  getDTDCDetails() {
    this.shippingRates$ = this.api.getShippingRates(this.shippingMethod.DTDC)
  }

  cancelledShippingMethod() {
    this.showDistanceDialog = false
    this.deliveryMethodSelected = false
    this.utility.orderSummary.grandTotal -= this.utility.orderSummary.shippingCost
    this.utility.orderSummary.shippingCost = 0
    this.dataService.changeOrderDetails(this.utility.orderSummary)
    this.cdr.detectChanges()
  }

  goToCheckout() {
    this.router.navigate(['/checkout'], { replaceUrl: true })
  }
}
