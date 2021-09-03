import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CartItem } from 'src/app/models/cart-item';
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
  wishlistLoading = false
  selectedImage
  imgIndex = 0
  cartItem: CartItem

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private api: ApiService, 
    public utility: Utility, 
    private alertService: AlertService) { 
      this.cartItem = new CartItem()
    }

  ngOnInit() {
    this.loading = true
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.api.getProduct(params.get('id'))
      })
    )
    this.isEditing = this.route.snapshot.queryParams['isEditing'] || false
    this.product$.subscribe(product => {
      this.loading = false
      this.cartItem.id = this.route.snapshot.queryParams['itemId'] || -1
      if (this.isEditing && this.utility.orderSummary.cartItems.has(this.cartItem.id)) {
        this.cartItem = this.utility.orderSummary.cartItems.get(this.cartItem.id)
        this.cartItem.product.quantity = product.quantity
        this.cartItem.product.price = product.price
        this.cartItem.product.weight = product.weight
        this.utility.updateCartProduct(this.cartItem)
        this.colorValueChanged = true
      } else {
        this.cartItem.id = this.utility.generateShortId()
        this.cartItem.product = product
        this.cartItem.product.selectedIndex = -1
        this.cartItem.product.subIndex = -1
        this.cartItem.product.message = ''
        this.cartItem.noOfItems = 1
      }
    })
  }

  redirectBack() {
    this.loading = true
    var product = this.cartItem.product
    if (this.isEditing && this.cartItem.noOfItems > product.quantity[product.selectedIndex][product.subIndex]) {
      this.alertService.error(`Change quantity, Only ${product.quantity[product.selectedIndex][product.subIndex]} available`, true)
      this.loading = false
      return
    }
    setTimeout(() => {
      this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || 'cart'], { replaceUrl: this.isEditing || false })
      this.loading = false
    }, 300)
  }

  colorOptionChanged(value, product) {
    this.cartItem.product.selectedIndex = product.colors.indexOf(value)
    this.cartItem.product.subIndex = -1
    if (this.cartItem.product.selectedIndex !== -1) {
      this.cartItem.product.quantity[this.cartItem.product.selectedIndex].forEach((q, i) => {
        if (this.cartItem.product.subIndex === -1 && q != 0) {
          this.cartItem.product.subIndex = i
          this.colorValueChanged = true
        } else if (q == 0) {
          this.cartItem.product.subIndex = -1
        }
      })
    } else {
      this.cartItem.product.subIndex = -1
    }
    if (this.cartItem.product.selectedIndex !== -1 && this.cartItem.product.subIndex !== -1) {
      this.cartItem.itemsCost = product.price[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex]
      this.cartItem.itemsWeight = product.weight[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex]
    }   
  }

  sizeValueChanged(value, product) {
    this.cartItem.product.subIndex = product.size[this.cartItem.product.selectedIndex].indexOf(value)
    if (this.utility.orderSummary.cartItems.has(this.cartItem.id)) {
      if (this.cartItem.product.selectedIndex === -1 && this.cartItem.product.subIndex === -1) {
        this.utility.removeItemFromCart(this.cartItem)
      } else {
        if (this.cartItem.noOfItems > this.cartItem.product.quantity[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex]) {
          this.cartItem.noOfItems = this.cartItem.product.quantity[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex]
          this.alertService.warn(`Selected quantity not available for selected size, changing it to maximum available number`)
        }
        this.utility.updateCartProduct(this.cartItem)
      }
    } else {
      this.colorValueChanged = true
    }

  }

  messageEntered(value: string) {
    this.cartItem.product.message = value.trim()
    if (this.utility.orderSummary.cartItems.has(this.cartItem.id)) {
      this.utility.updateCartProduct(this.cartItem)
    }
  }

  decreaseQuantity() {
    if (this.utility.orderSummary.cartItems.has(this.cartItem.id)) {
      this.utility.decreaseProductQuantity(this.cartItem)
    } else {
      if (this.cartItem.noOfItems == 1) {
        this.alertService.error('Quantity cannot be less than 1', true)
        return
      }
      this.cartItem.noOfItems--
      this.cartItem.itemsCost -= this.cartItem.product.price[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex]
      this.cartItem.itemsWeight -= this.cartItem.product.weight[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex]
    }
  }

  increaseQuantity() {
    if (this.utility.orderSummary.cartItems.has(this.cartItem.id)) {
      this.utility.increaseProductQuantity(this.cartItem)
    } else {
      if (this.cartItem.noOfItems == 100) {
        this.alertService.error('You can buy Only 100 items at a time of same kind', true)
        return
      }
      this.cartItem.noOfItems++
      this.cartItem.itemsCost += this.cartItem.product.price[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex]
      this.cartItem.itemsWeight += this.cartItem.product.weight[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex]
    }
  }

  addToCart() {
    this.utility.addItemToCart(this.utility.clone(this.cartItem))
    this.resetCartItem()
  }

  addToWishList(id: any) {
    this.wishlistLoading = true
    this.api.getUserById().subscribe(user => {
      user.wishlist.push(id)
      this.api.updateUser(user).subscribe(user => {
        this.wishlistLoading = false
        this.alertService.success("Added to wishlist")
      },
        error => {
          this.wishlistLoading = false
          this.alertService.error("Some error occurred while adding to wishlist")
        })
    })
  }

  resetCartItem() {
    this.cartItem.id = this.utility.generateShortId()
    this.cartItem.noOfItems = 1
    this.cartItem.product.selectedIndex = -1
    this.cartItem.product.subIndex = -1
  }

  getNavMap(product: Product) {
    return !!product.subCategory ? `Products / ${product.category} / ${product.subCategory} / ${product.name}` : `Products >> ${product.category} >> ${product.name}`
  }

  ngDestroy() {
    this.resetCartItem()
  }
}
