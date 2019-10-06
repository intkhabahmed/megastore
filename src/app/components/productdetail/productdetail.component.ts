import { AlertService } from './../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Product } from './../../models/product';
import { ApiService } from './../../services/api.service';
import { DataService } from './../../services/data.service';
import { Utility } from './../../utils/utils';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {

  product$: Observable<Product>
  colorValueChanged = false
  isEditing: boolean
  loading = false
  id: any
  cp: Product = new Product()

  constructor(private route: ActivatedRoute, private router: Router, private service: ApiService, public utility: Utility, private dataService: DataService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = params.get('id')
        return this.service.getProduct(this.id)
      })
    )
    this.product$.subscribe(product => {
      if (this.utility.orderSummary.cartItems.has(this.id)) {
        this.cp = this.utility.orderSummary.cartItems.get(this.id).product
        this.cp.quantity = product.quantity
        this.cp.price = product.price
        this.utility.updateCartProduct(this.cp)
        this.colorValueChanged = true
      } else {
        this.cp = product
        this.cp.selectedIndex = -1
      }
    })
    this.isEditing = this.route.snapshot.queryParams['isEditing'] || false
  }

  redirectBack() {
    this.loading = true
    if (this.utility.orderSummary.cartItems.get(this.cp._id).noOfItems > this.cp.quantity[this.cp.selectedIndex]) {
      this.alertService.error(`Change quantity, Only ${this.cp.quantity[this.cp.selectedIndex]} available`, true)
      this.loading = false
      return
    }
    setTimeout(() => {
      this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || 'cart'], { replaceUrl: this.isEditing || false })
      this.loading = false
    }, 300)
  }
}
