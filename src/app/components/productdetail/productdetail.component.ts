import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CartItem } from 'src/app/models/cart-item';
import { UnitType } from 'src/app/utils/enums';
import { Product } from './../../models/product';
import { AlertService } from './../../services/alert.service';
import { ApiService } from './../../services/api.service';
import { Utility } from './../../utils/utils';
import * as $ from 'jquery';

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
  unitType = UnitType
  units: string[]
  validChange$: Subject<any> = new Subject()

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
      this.units = this.utility.getUnits(product.unitType)
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
        this.cartItem.product.selectedUnit = this.units[0]
        this.cartItem.noOfItems = 1
      }
    })
    this.validChange$.subscribe(v => {
      if (v === false) {
        $('input[name="quantity"]').val(this.cartItem.noOfItems)
      } else if (v?.value === false) {
        $('select[name="unit"]').val(this.cartItem.product.selectedUnit)
      }
    })
  }

  redirectBack() {
    this.loading = true
    setTimeout(() => {
      this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || 'cart'], { replaceUrl: this.isEditing || false })
      this.loading = false
    }, 300)
  }

  isZeroQuantity(subIndex): boolean {
    return this.utility.availableQuantity(this.cartItem.product, subIndex) === 0
  }

  colorOptionChanged(value, product) {
    this.cartItem.product.selectedIndex = product.colors.indexOf(value)
    this.cartItem.product.subIndex = -1
    if (this.cartItem.product.selectedIndex !== -1) {
      for (let i = 0; i < this.cartItem.product.quantity[this.cartItem.product.selectedIndex].length; i++) {
        if (this.cartItem.product.subIndex === -1 && !this.isZeroQuantity(i)) {
          this.cartItem.product.subIndex = i
          this.colorValueChanged = true
          break
        } else if (this.isZeroQuantity(i)) {
          this.cartItem.product.subIndex = -1
        }
      }
    } else {
      this.cartItem.product.subIndex = -1
    }
    if (this.cartItem.product.selectedIndex !== -1 && this.cartItem.product.subIndex !== -1) {
      var availableQuantity = this.utility.availableQuantity(this.cartItem.product)
      if (this.utility.convertToRequiredUnit({
        quantity: this.cartItem.noOfItems,
        sourceUnit: this.cartItem.product.selectedUnit,
        bunchPerPack: this.cartItem.product.bunchInfo?.bunchPerPacket,
      }) > availableQuantity) {
        this.cartItem.noOfItems = availableQuantity
        this.alertService.warn(`Selected quantity not available for selected size, changing it to maximum available number`)
      } else {
        this.calculateCostAndWeight()
        if (this.utility.orderSummary.cartItems.has(this.cartItem.id)) {
          this.utility.updateCartProduct(this.cartItem)
        }
      }
    }
  }

  sizeValueChanged(value, product) {
    this.cartItem.product.subIndex = product.size[this.cartItem.product.selectedIndex].indexOf(value)
    var availableQuantity = this.utility.availableQuantity(this.cartItem.product)
    if (this.utility.orderSummary.cartItems.has(this.cartItem.id)) {
      if (this.cartItem.product.selectedIndex === -1 && this.cartItem.product.subIndex === -1) {
        this.utility.removeItemFromCart(this.cartItem)
      } else {
        if (this.utility.convertToRequiredUnit({
          quantity: this.cartItem.noOfItems,
          sourceUnit: this.cartItem.product.selectedUnit,
          bunchPerPack: this.cartItem.product.bunchInfo?.bunchPerPacket,
        }) > availableQuantity) {
          this.cartItem.noOfItems = availableQuantity
          this.alertService.warn(`Selected quantity not available for selected size, changing it to maximum available number`)
        }
        this.utility.updateCartProduct(this.cartItem)
      }
    } else {
      if (this.utility.convertToRequiredUnit({
        quantity: this.cartItem.noOfItems,
        sourceUnit: this.cartItem.product.selectedUnit,
        bunchPerPack: this.cartItem.product.bunchInfo?.bunchPerPacket,
      }) > availableQuantity) {
        this.cartItem.noOfItems = availableQuantity
        this.alertService.warn(`Selected quantity not available for selected size, changing it to maximum available number`)
      } else {
        this.colorValueChanged = true
      }
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
      if (this.cartItem.noOfItems <= 1) {
        this.alertService.error('Quantity cannot be less than 1', true)
        return
      }
      this.cartItem.noOfItems--
      this.calculateCostAndWeight()
    }
  }

  increaseQuantity() {
    if (this.utility.orderSummary.cartItems.has(this.cartItem.id)) {
      this.utility.increaseProductQuantity(this.cartItem)
    } else {
      var availableQuantity = this.utility.availableQuantity(this.cartItem.product)
      if (this.utility.convertToRequiredUnit({
        quantity: this.cartItem.noOfItems,
        sourceUnit: this.cartItem.product.selectedUnit,
        bunchPerPack: this.cartItem.product.bunchInfo?.bunchPerPacket,
      }) >= availableQuantity) {
        availableQuantity = this.utility.getQuantityForUnit({
          quantity: availableQuantity,
          prevUnit: this.cartItem.product.selectedUnit,
          newUnit: this.utility.getUnits(this.cartItem.product.unitType)[0],
          bunchPerPack: this.cartItem.product.bunchInfo?.bunchPerPacket
        })
        this.alertService.error(`Only ${availableQuantity} 
        ${this.utility.formatUnit(this.cartItem.product.selectedUnit, availableQuantity)} available`, true)
        return
      }
      this.cartItem.noOfItems++
      this.calculateCostAndWeight()
    }
  }

  calculateCostAndWeight() {
    this.cartItem.itemsCost = this.utility.getPriceForUnit(
      this.cartItem.product.selectedUnit,
      this.cartItem.noOfItems,
      this.cartItem.product.price[this.cartItem.product.selectedIndex][this.cartItem.product.subIndex],
      this.cartItem.product.bunchInfo?.price
    )
    this.cartItem.itemsWeight = this.utility.getWeightForUnit(
      this.cartItem.noOfItems,
      this.cartItem.product
    )
    this.cartItem.discountedCost = this.utility.getDiscountedPrice(
      this.cartItem.itemsCost,
      this.cartItem.noOfItems,
      this.cartItem.product.selectedUnit,
      this.cartItem.product.priceBatches
    )
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
    return !!product.subCategory ? `Products / ${product.category} / ${product.subCategory} / ${product.name}` : `Products / ${product.category} / ${product.name}`
  }

  ngDestroy() {
    this.resetCartItem()
  }
}
