import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Product } from './../../models/product';
import { AlertService } from './../../services/alert.service';
import { ApiService } from './../../services/api.service';
import { AuthenticationService } from './../../services/authentication.service';
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
  cp: Product
  selectedImage
  imgIndex = 0
  itemId: any

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, public utility: Utility, private dataService: DataService,
    private alertService: AlertService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.loading = true
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.api.getProduct(params.get('id'))
      })
    )
    this.isEditing = this.route.snapshot.queryParams['isEditing'] || false
    this.itemId = this.route.snapshot.queryParams['itemId'] || -1
    this.product$.subscribe(product => {
      this.loading = false
      if (this.isEditing && this.utility.orderSummary.cartItems.has(this.itemId)) {
        var item = this.utility.orderSummary.cartItems.get(this.itemId)
        this.cp = item.product
        this.cp.quantity = product.quantity
        this.cp.price = product.price
        item.product = this.cp
        this.utility.updateCartProduct(item)
        this.colorValueChanged = true
      } else {
        this.cp = product
        this.cp.selectedIndex = -1
        this.cp.subIndex = -1
      }
    })
  }

  redirectBack() {
    this.loading = true
    if (this.isEditing && this.utility.orderSummary.cartItems.get(this.itemId).noOfItems > this.cp.quantity[this.cp.selectedIndex][this.cp.subIndex]) {
      this.alertService.error(`Change quantity, Only ${this.cp.quantity[this.cp.selectedIndex][this.cp.subIndex]} available`, true)
      this.loading = false
      return
    }
    setTimeout(() => {
      this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || 'cart'], { replaceUrl: this.isEditing || false })
      this.loading = false
    }, 300)
  }

  colorOptionChanged(value, product) {
    this.cp.selectedIndex = product.colors.indexOf(value)
    this.cp.subIndex = -1
    if (this.cp.selectedIndex !== -1) {
      this.cp.quantity[this.cp.selectedIndex].forEach((q, i) => {
        if (this.cp.subIndex === -1 && q != 0) {
          this.cp.subIndex = i
          this.colorValueChanged = true
        } else if (q == 0) {
          this.cp.subIndex = -1
        }
      })
    } else {
      this.cp.subIndex = -1
    }
    if (this.cp.selectedIndex === -1 && this.cp.subIndex === -1 && this.utility.orderSummary.cartItems.has(this.itemId)) {
      this.utility.removeItemFromCart(this.utility.orderSummary.cartItems.get(this.itemId))
    }
  }

  sizeValueChanged(value, product) {
    this.cp.subIndex = product.size[this.cp.selectedIndex].indexOf(value)
    if (this.utility.orderSummary.cartItems.has(this.itemId)) {
      var item = this.utility.orderSummary.cartItems.get(this.itemId)
      item.product = this.cp
      if (this.cp.selectedIndex === -1 && this.cp.subIndex === -1) {
        this.utility.removeItemFromCart(item)
      } else {
        if (item.noOfItems > this.cp.quantity[this.cp.selectedIndex][this.cp.subIndex]) {
          item.noOfItems = 1
        }
        this.utility.updateCartProduct(item)
      }
    } else {
      this.colorValueChanged = true
    }

  }

  addToWishList(id: any) {
    this.loading = true
    this.api.getUserById(this.authService.currentUserValue._id).subscribe(user => {
      user.wishlist.push(id)
      this.api.updateUser(user._id, user).subscribe(user => {
        this.loading = false
        this.alertService.success("Added to wishlist")
      },
        error => {
          this.loading = false
          this.alertService.error("Some error occurred while adding to wishlist")
        })
    })
  }
}
