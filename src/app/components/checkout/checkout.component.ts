import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderSummary } from 'src/app/models/order-summary';
import { Address } from './../../models/address';
import { Payment } from './../../models/payment';
import { User } from './../../models/user';
import { AlertService } from './../../services/alert.service';
import { ApiService } from './../../services/api.service';
import { AuthenticationService } from './../../services/authentication.service';
import { DataService } from './../../services/data.service';
import { OrderStatus } from './../../utils/enums';
import { JsonUtils } from './../../utils/json-utils';
import { Utility } from './../../utils/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  addressForm: FormGroup
  submitted = false
  loading = false
  isEditing = false
  showAddressForm = false
  user$: Observable<User>
  id: any
  constructor(private dataService: DataService, public utility: Utility, private api: ApiService,
    private router: Router, private fb: FormBuilder, private authService: AuthenticationService, private cdr: ChangeDetectorRef,
    private alertService: AlertService, private jsonUtils: JsonUtils) { }

  ngOnInit() {

    this.initForm()
    this.user$ = this.api.getUserById(this.authService.currentUserValue._id)
    if (this.utility.orderSummary.cartItems.size == 0) {
      this.router.navigate(['/'], { replaceUrl: true })
    }
  }

  get f() {
    return this.addressForm.controls
  }

  initForm() {
    this.addressForm = this.fb.group({
      user: [],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("\\d{10}")]]
    })
  }

  completePurchase() {
    this.loading = true
    this.utility.orderSummary.cartItems.forEach(item => {
      item.product.quantity[item.product.selectedIndex][item.product.subIndex] -= item.noOfItems
      this.api.updateProduct(item.product._id, item.product).subscribe(() => { })
    })
    this.utility.order.orderStatus = OrderStatus.PROCESSING
    this.utility.order.address = this.utility.order.address._id
    this.utility.order.invoiceId = Math.random().toString(10).substring(2, 7)
    this.utility.order.orderSummary = this.jsonUtils.getJsonString(this.utility.orderSummary)
    var payment = new Payment()
    payment.amount = this.utility.orderSummary.grandTotal
    payment.paymentMethod = "Credit Card"
    payment.transactionId = Math.random().toString(36).substring(2, 15)
    this.utility.order.payment = this.jsonUtils.getJsonString(payment)
    this.utility.order.user = this.authService.currentUserValue._id
    this.utility.order.orderNo = `${Math.random().toString(36).substring(3, 6)}-${Math.random().toString(36).substring(7, 15)}-${Math.random().toString(36).substring(9, 17)}`
    this.api.insertOrder(this.utility.order).subscribe(order => {
      this.loading = false
      this.user$.subscribe(user => {
        user.orders.push(order._id)
        this.api.updateUser(user._id, user).subscribe(user => {
          this.loading = false
          this.submitted = false
        })
      })
      this.dataService.changeOrder(new Order())
      this.dataService.changeOrderDetails(new OrderSummary())
      this.router.navigate(['/success', order._id], { replaceUrl: true })
    },
      error => {
        this.loading = false
        this.alertService.error("Could not complete order, please try again later", true)
      })
  }

  saveAndEditAddress() {
    this.alertService.clear()
    this.submitted = true

    if (this.addressForm.invalid) {
      this.loading = false
      return
    }
    this.loading = true
    this.user$.subscribe(user => {
      this.addressForm.patchValue({ user: user._id })
      if (!this.isEditing) {
        this.api.insertAddress(this.addressForm.value).pipe().subscribe(
          address => {
            this.alertService.success("Address added", true)
            user.addresses.push(address._id)
            this.api.updateUser(user._id, user).subscribe(user => {
              this.user$ = this.api.getUserById(user._id)
              this.loading = false
              this.submitted = false
              this.showAddressForm = false
              this.cdr.detectChanges()
            })
          },
          error => {
            this.alertService.error("Some error occurred while saving address", true)
            this.loading = false
          }
        )
      } else {
        this.api.updateAddress(this.id, this.addressForm.value).pipe().subscribe(
          address => {
            this.alertService.success("Address updated", true)
            this.user$ = this.api.getUserById(user._id)
            this.loading = false
            this.submitted = false
            this.showAddressForm = false
            this.cdr.detectChanges()
          },
          error => {
            this.alertService.error("Some error occurred while saving address", true)
            this.loading = false
          }
        )
      }
    })
  }

  selectAddress(address: Address) {
    if (address === this.utility.order.address) {
      this.utility.order.address = new Address()
    } else {
      this.utility.order.address = address
    }
    this.dataService.changeOrder(this.utility.order)
    this.cdr.detectChanges()
  }

  editAddress(address: Address) {
    this.id = address._id
    this.showAddressForm = true
    this.isEditing = true
    this.addressForm.patchValue(address)
  }

  delete(address: Address) {
    this.api.deleteAddress(address._id).pipe().subscribe(
      address => {
        this.alertService.success("Address Deleted", true)
        this.user$.subscribe(user => {
          user.addresses = user.addresses.filter(id => id != address._id)
          this.api.updateUser(user._id, user).subscribe(
            user => {
              this.user$ = this.api.getUserById(user._id)
              this.cdr.detectChanges()
            }
          )
        })
      },
      error => {
        this.alertService.error("Error deleting address", true)
      }
    )
  }

  cancel() {
    this.isEditing = false
    this.showAddressForm = false
    this.initForm()
  }
}
