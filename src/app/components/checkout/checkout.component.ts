import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ccAccessCode, ccMerchantId, paymentUrl, redirectUrl } from './../../../../helpers/config';
import { Address } from './../../models/address';
import { User } from './../../models/user';
import { AlertService } from './../../services/alert.service';
import { ApiService } from './../../services/api.service';
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
  paymentGatewayUrl = paymentUrl
  @ViewChild('form', { static: true }) form: ElementRef;

  encRequest: string;
  accessCode: string;
  constructor(private dataService: DataService, public utility: Utility, private api: ApiService,
    private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef,
    private alertService: AlertService, private jsonUtils: JsonUtils) { }

  ngOnInit() {
    this.accessCode = ccAccessCode
    this.initForm()
    this.user$ = this.api.getUserById()
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
    this.utility.order.orderStatus = OrderStatus.PROCESSING
    var address: Address = this.utility.clone(this.utility.order.address)
    this.utility.order.address = this.jsonUtils.getJsonString(this.utility.order.address)
    this.utility.order.invoiceId = Math.random().toString(10).substring(2, 7)
    this.utility.order.orderSummary = this.jsonUtils.getJsonString(this.utility.orderSummary)
    this.utility.order.orderNo = (`${Math.random().toString(36).substring(3, 6)}-${Math.random().toString(36).substring(7, 15)}-${Math.random().toString(36).substring(9, 17)}`).toLocaleUpperCase()
    this.dataService.changeOrder(this.utility.order)
    this.user$.subscribe(user => {
      var addressParams = `billing_name=${address.firstName} ${address.lastName}&billing_address=${address.address}&billing_city=${address.city}&billing_state=${address.state}&billing_zip=${address.postalCode}&billing_country=India&billing_tel=${address.mobile}&billing_email=${address.user.email}`
      var reqBody = {
        unencReq: `merchant_id=${ccMerchantId}&currency=INR&order_id=${this.utility.order.orderNo}&amount=${this.utility.orderSummary.grandTotal}&redirect_url=${redirectUrl}&cancel_url=${redirectUrl}&language=EN&customer_identifier=${user._id}&${addressParams}`
      }
      this.api.handlePaymentRequest(reqBody).subscribe(res => {
        this.encRequest = res.encRequest
        $('#encRequest').val(this.encRequest);
        setTimeout(_ => {
          this.loading = false
          this.form.nativeElement.submit()
        });
      }, error => { })
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
        this.api.insertAddress(this.addressForm.value).pipe().subscribe({
          next: (address) => {
            this.alertService.success("Address added", true)
            user.addresses.push(address._id)
            this.api.updateUser(user).subscribe(user => {
              this.user$ = this.api.getUserById()
              this.loading = false
              this.submitted = false
              this.showAddressForm = false
              this.addressForm.reset()
              this.addressForm.patchValue({ state: "" })
              this.cdr.detectChanges()
            })
          },
          error: (error) => {
            this.alertService.error("Some error occurred while saving address", true)
            this.loading = false
          }
        })
      } else {
        this.api.updateAddress(this.id, this.addressForm.value).pipe().subscribe(
          address => {
            this.alertService.success("Address updated", true)
            this.user$ = this.api.getUserById()
            this.loading = false
            this.submitted = false
            this.showAddressForm = false
            this.isEditing = false
            this.addressForm.reset()
            this.addressForm.patchValue({ state: "" })
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
          this.api.updateUser(user).subscribe(
            user => {
              this.user$ = this.api.getUserById()
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
