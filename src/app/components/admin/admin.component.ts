import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { GrossWeight } from 'src/app/models/gross-weight';
import { Message } from 'src/app/models/message';
import { Order } from 'src/app/models/order';
import { ShippingRate } from 'src/app/models/shipping-rate';
import { Product } from './../../models/product';
import { User } from './../../models/user';
import { AlertService } from './../../services/alert.service';
import { ApiService } from './../../services/api.service';
import { AdminTab, ShippingMethod } from './../../utils/enums';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentTab: AdminTab
  courierType = ShippingMethod
  row: number
  isEditing = false
  products: Observable<Product[]>
  users: Observable<User[]>
  productForm: FormGroup
  updateProductForm: FormGroup
  grossWeightForm: FormGroup
  shippingRateForm: FormGroup
  loading = false
  submitted = false;
  editing: string
  orders: Observable<Order[]>
  shippingRates: Observable<ShippingRate[]>
  grossWeights: Observable<GrossWeight[]>
  messages: Observable<Message[]>
  showOverlay = false
  id: string

  constructor(private api: ApiService, private fb: FormBuilder, private alertService: AlertService) { }

  get adminTab() {
    return AdminTab
  }

  ngOnInit() {
    this.currentTab = this.adminTab.NEW_PRODUCT_UPLOAD

    this.initializeFormGroups()
  }

  initializeFormGroups() {
    this.productForm = this.fb.group({
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
      name: ['', Validators.required],
      productCode: ['', Validators.required],
      description: ['', Validators.required],
      colors: this.fb.array([]),
      size: this.fb.array([]),
      price: this.fb.array([]),
      weight: this.fb.array([]),
      quantity: this.fb.array([]),
      productStatus: [true]
    })

    this.addField('colors')
    this.addField('size')
    this.addField('price')
    this.addField('weight')
    this.addField('quantity')

    this.grossWeightForm = this.fb.group({
      minWeight: ['', Validators.required],
      maxWeight: ['', Validators.required],
      toBeAdded: ['', Validators.required]
    })

    this.shippingRateForm = this.fb.group({
      rate: [''],
      localRate: [''],
      minDistance: [''],
      maxDistance: [''],
      minWeight: [''],
      maxWeight: [''],
      perKgRate: [''],
      halfKgRate: [''],
      area: [''],
      shippingMethod: ['']
    })
  }
  get f() {
    if (this.editing == 'product') {
      return this.productForm.controls
    }
    if (this.editing == 'grossWeight') {
      return this.grossWeightForm.controls
    }
    if (this.editing == 'shippingRate') {
      return this.shippingRateForm.controls
    }
    return this.productForm.controls
  }

  showTab(selectedTab) {
    this.alertService.clear()
    switch (selectedTab) {
      case this.adminTab.NEW_PRODUCT_UPLOAD:
        if (!this.isEditing) {
          this.initializeFormGroups()
        }
        this.currentTab = this.adminTab.NEW_PRODUCT_UPLOAD
        break;
      case this.adminTab.PRODUCT_LIST:
        this.products = this.api.getProducts()
        this.currentTab = this.adminTab.PRODUCT_LIST
        break;
      case this.adminTab.POPULAR_PRODUCTS:
        this.currentTab = this.adminTab.POPULAR_PRODUCTS
        break;
      case this.adminTab.ORDER_INVOICE:
        this.currentTab = this.adminTab.ORDER_INVOICE
        break;
      case this.adminTab.SHIPPING_RATES:
        this.shippingRates = this.api.getShippingRates()
        this.currentTab = this.adminTab.SHIPPING_RATES
        break;
      case this.adminTab.GROSS_WEIGHT_CALCULATOR:
        this.grossWeights = this.api.getGrossWeights()
        this.currentTab = this.adminTab.GROSS_WEIGHT_CALCULATOR
        break;
      case this.adminTab.REGISTERED_USERS:
        this.users = this.api.getRegisteredUsers()
        this.currentTab = this.adminTab.REGISTERED_USERS
        break;
      case this.adminTab.MESSAGES:
        this.currentTab = this.adminTab.MESSAGES
        break;
      default:
        break;
    }
  }

  addOrUpdateProduct() {
    this.alertService.clear()
    this.submitted = true

    if (this.productForm.invalid) {
      this.loading = false
      return
    }
    this.loading = true
    if (!this.isEditing) {
      this.api.addProduct(this.productForm.value).pipe().subscribe(
        product => {
          this.alertService.success("Product added", true)
          this.loading = false
          this.submitted = false
          // this.productForm.reset({})
          this.initializeFormGroups()
        },
        error => {
          this.alertService.error("Some error occurred while adding product", true)
          this.loading = false
        }
      )
    } else {
      this.api.updateProduct(this.id, this.productForm.value).pipe().subscribe(
        data => {
          this.alertService.success("Product updated")
          this.products = this.api.getProducts()
          this.showOverlay = false
          this.loading = false
          this.submitted = false
          this.productForm.reset({})
        }
      )
    }
  }

  deleteProduct(id) {
    this.alertService.clear()
    this.api.deleteProduct(id).pipe().subscribe(
      data => {
        this.alertService.success("Product Deleted", true)
        this.products = this.api.getProducts()
      },
      error => {
        this.alertService.error("Error deleting product", true)
      }
    )
  }

  updateProduct(id, product: Product) {
    this.submitted = true
    if (this.updateProductForm.invalid) {
      return
    }
    this.loading = true
    this.api.updateProduct(id, product).pipe().subscribe(
      data => {
        this.alertService.success("Product updated")
      }
    )
  }

  addOrUpdateGrossWeight() {
    this.alertService.clear()
    this.submitted = true
    if (this.grossWeightForm.invalid) {
      this.loading = false;
      return
    }
    this.loading = true
    if (!this.isEditing) {
      this.api.insertGrossWeight(this.grossWeightForm.value).pipe().subscribe(
        grossWeight => {
          this.alertService.success("Gross Weight added")
          this.grossWeights = this.api.getGrossWeights()
          this.showOverlay = false
          this.loading = false
          this.submitted = false
          this.grossWeightForm.reset({})
        },
        error => {
          this.alertService.error("Some error occurred while adding gross weight", true)
          this.loading = false
          this.submitted = false
        }
      )
    } else {
      this.api.updateGrossWeight(this.id, this.grossWeightForm.value).pipe().subscribe(
        data => {
          this.alertService.success("Gross Weight updated")
          this.grossWeights = this.api.getGrossWeights()
          this.showOverlay = false
          this.loading = false
          this.submitted = false
          this.grossWeightForm.reset({})
        }
      )
    }
  }

  addOrUpdateShippingRate() {
    this.alertService.clear()
    this.submitted = true
    if (this.shippingRateForm.invalid) {
      this.loading = false;
      return
    }
    this.loading = true
    if (!this.isEditing) {
      this.api.insertShippingRate(this.shippingRateForm.value).pipe().subscribe(
        shippingRate => {
          this.alertService.success("Shipping Rate added")
          this.shippingRates = this.api.getShippingRates()
          this.showOverlay = false
          this.loading = false
          this.submitted = false
          this.shippingRateForm.reset({})
        },
        error => {
          this.alertService.error("Some error occurred while adding shipping rate", true)
          this.loading = false
          this.submitted = false
        }
      )
    } else {
      this.api.updateShippingRate(this.id, this.shippingRateForm.value).pipe().subscribe(
        data => {
          this.alertService.success("Shipping Rate updated")
          this.shippingRates = this.api.getShippingRates()
          this.showOverlay = false
          this.loading = false
          this.submitted = false
          this.shippingRateForm.reset({})
        }
      )
    }
  }

  populateEditForm(value: any) {
    this.id = value._id
    if (this.editing == "product") {
      this.productForm.patchValue(value)
      this.formArray('colors').clear()
      this.formArray('size').clear()
      this.formArray('price').clear()
      this.formArray('weight').clear()
      this.formArray('quantity').clear()
      value.colors.map(color => this.formArray('colors').push(this.fb.control(color, Validators.required)))
      value.size.map(size => this.formArray('size').push(this.fb.control(size, Validators.required)))
      value.price.map(price => this.formArray('price').push(this.fb.control(price, Validators.required)))
      value.weight.map(weight => this.formArray('weight').push(this.fb.control(weight, Validators.required)))
      value.quantity.map(quantity => this.formArray('quantity').push(this.fb.control(quantity, Validators.required)))
    } else if (this.editing == "grossWeight") {
      this.grossWeightForm.patchValue(value)
    } else if (this.editing == "shippingRate") {
      this.shippingRateForm.patchValue(value)
    } else if (this.editing == "grossWeight") {
      this.grossWeightForm.patchValue(value)
    } else if (this.editing == "message") {

    }
  }

  formArray(type): FormArray {
    return this.productForm.get(type) as FormArray
  }

  addField(fieldName) {
    this.formArray(fieldName).push(this.fb.control('', Validators.required))
  }

  removeField(fieldName, index) {
    this.formArray(fieldName).removeAt(index)
  }

  filterShippingRates(value) {
    this.shippingRates = this.api.getShippingRatesByCourierType(value)
  }

}
