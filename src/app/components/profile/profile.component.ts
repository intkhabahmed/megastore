import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Message } from './../../models/message';
import { User } from './../../models/user';
import { AlertService } from './../../services/alert.service';
import { ApiService } from './../../services/api.service';
import { AuthenticationService } from './../../services/authentication.service';
import { PdfGeneratorService } from './../../services/pdf-generator.service';
import { ShippingMethod } from './../../utils/enums';
import { JsonUtils } from './../../utils/json-utils';
import { Utility } from './../../utils/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isEditing = false
  editing: string
  addressForm: FormGroup
  user$: Observable<User>
  submitted: boolean;
  loading: boolean;
  courierType = ShippingMethod
  id: any;
  phoneForm: FormGroup
  passwordForm: FormGroup
  messageForm: FormGroup
  constructor(private fb: FormBuilder, private api: ApiService, private authService: AuthenticationService,
    private alertService: AlertService, public utility: Utility, public jsonUtils: JsonUtils, public pdf: PdfGeneratorService) { }

  ngOnInit() {
    this.initForm()
    this.loading = true
    this.user$ = this.api.getUserById()
    this.user$.subscribe(user => {
      this.api.getOrdersByUserId(user._id).subscribe(orders => {
        user.orders = orders
      })
      this.loading = false
      this.user$ = of(user)
    })
  }

  get f() {
    if (this.editing === 'phone') {
      return this.phoneForm.controls
    }
    if (this.editing === 'password') {
      return this.passwordForm.controls
    }
    if (this.editing === 'message') {
      return this.messageForm.controls
    }
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

    this.phoneForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern("\\d{10}")]]
    })

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%\^&\*]).{8,}$")]]
    })

    this.messageForm = this.fb.group({
      message: ['', Validators.required]
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
            this.api.updateUser(user).subscribe(user => {
              this.user$ = this.api.getUserById()
              this.loading = false
              this.submitted = false
              this.cancel()
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
            this.user$ = this.api.getUserById()
            this.loading = false
            this.submitted = false
            this.cancel()
          },
          error => {
            this.alertService.error("Some error occurred while saving address", true)
            this.loading = false
          }
        )
      }
    })
  }

  saveOrEditUser(type) {
    this.alertService.clear()
    this.submitted = true
    this.loading = true
    switch (type) {
      case 'phone':
        if (this.phoneForm.invalid) {
          this.loading = false
          return
        }
        this.user$.subscribe(user => {
          user.mobile = this.phoneForm.value.mobile
          this.api.updateUser(user).subscribe(user => {
            this.user$ = this.api.getUserById()
            this.submitted = false
            this.loading = false
            this.alertService.success("Updated phone number")
            this.cancel()
          })
        },
          error => {
            this.loading = false
            this.alertService.error("Could not update mobile number")
          })
        break;
      case 'password':
        if (this.passwordForm.invalid) {
          this.loading = false
          return
        }
        this.api.changePassword(this.passwordForm.value).subscribe(user => {
          this.submitted = false
          this.loading = false
          this.alertService.success("Updated Password")
          this.cancel()
        },
          error => {
            this.loading = false
            this.alertService.error(error)
          })
        break;
      case 'message':
        if (this.messageForm.invalid) {
          this.loading = false
          return
        }
        this.user$.subscribe(user => {
          var message = new Message()
          message.from = user.email
          message.user = user._id
          message.message = this.messageForm.controls.message.value
          this.api.insertMessage(message).subscribe(message => {
            user.messages.push(message._id)
            this.api.updateUser(user).subscribe(user => {
              this.user$ = this.api.getUserById()
              this.loading = false
              this.submitted = false
              this.cancel()
            })
          },
            error => {
              this.loading = false
              this.alertService.error(error)
            })
        })
        break;
    }
  }

  delete(id: any, type) {
    switch (type) {
      case 'address':
        this.api.deleteAddress(id).pipe().subscribe(
          address => {
            this.alertService.success("Address Deleted", true)
            this.user$.subscribe(user => {
              user.addresses = user.addresses.filter(id => id != address._id)
              this.api.updateUser(user).subscribe(
                user => {
                  this.user$ = this.api.getUserById()
                }
              )
            })
          },
          error => {
            this.alertService.error("Error deleting address", true)
          }
        )
        break;
      case 'wishlist':
        this.loading = true
        this.user$.subscribe(user => {
          user.wishlist = user.wishlist.filter(product => product._id != id)
          this.api.updateUser(user).subscribe(
            user => {
              this.loading = false
              this.user$ = this.api.getUserById()
              this.alertService.success("Removed item from wishlist")
            },
            error => {
              this.loading = false
              this.alertService.error("Some error occurred while removing wishlist item")
            }
          )
        })
        break;
      case 'message':
        this.loading = true
        this.user$.subscribe(user => {
          user.messages = user.messages.filter(message => {
            if (!message.reply) {
              this.api.deleteMessage(message._id).subscribe(message => { })
            }
            return message._id != id
          })
          this.api.updateUser(user).subscribe(
            user => {
              this.loading = false
              this.user$ = this.api.getUserById()
              this.alertService.success("Message Deleted")
            },
            error => {
              this.loading = false
              this.alertService.error("Some error occurred while deleting message")
            }
          )
        })
        break;
      default:
        break;
    }
  }

  populateForm(value, type) {
    switch (type) {
      case 'address':
        this.isEditing = true
        this.id = value._id
        this.editing = 'address'
        this.addressForm.patchValue(value)
        break;
      case 'phone':
        this.editing = 'phone'
        this.phoneForm.setValue({ mobile: value })
        break;
      default:
        break;
    }
  }

  cancel() {
    this.isEditing = false
    this.editing = ''
    this.submitted = false
    this.initForm()
  }

}
