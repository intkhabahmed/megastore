import { PdfGeneratorService } from './../../services/pdf-generator.service';
import { JsonUtils } from './../../utils/json-utils';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
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
  products$: Observable<Product[]>
  users$: Observable<User[]>
  productForm: FormGroup
  updateProductForm: FormGroup
  grossWeightForm: FormGroup
  shippingRateForm: FormGroup
  loading = false
  submitted = false;
  editing: string
  orders$: Observable<Order[]>
  shippingRates$: Observable<ShippingRate[]>
  grossWeights$: Observable<GrossWeight[]>
  messages$: Observable<Message[]>
  showOverlay = false
  id: string

  constructor(private api: ApiService, private fb: FormBuilder, private alertService: AlertService, private jsonUtils: JsonUtils, public pdf: PdfGeneratorService) { }

  get adminTab() {
    return AdminTab
  }

  ngOnInit() {
    this.currentTab = this.adminTab.NEW_PRODUCT_UPLOAD

    this.initializeFormGroups()
  }

  cancel() {
    this.isEditing = false
    this.showOverlay = false
    this.initializeFormGroups()
  }

  initializeFormGroups() {
    this.productForm = this.fb.group({
      category: ['', Validators.required],
      imageUrl: this.fb.array([]),
      name: ['', Validators.required],
      productCode: ['', Validators.required],
      description: ['', Validators.required],
      colors: this.fb.array([]),
      properties: this.fb.array([this.addProperty(true)]),
      productStatus: [true]
    })

    this.addField('colors', { isNotDeep: true })
    this.addField('imageUrl', { isNotDeep: true })

    this.grossWeightForm = this.fb.group({
      minWeight: ['', Validators.required],
      maxWeight: ['', Validators.required],
      toBeAdded: ['', Validators.required]
    })

    this.shippingRateForm = this.fb.group({
      rate: [''],
      isLocal: null,
      minDistance: [''],
      maxDistance: [''],
      minWeight: [''],
      maxWeight: [''],
      perKgRate: [''],
      halfKgRate: [''],
      area: [''],
      shippingMethod: ['', Validators.required]
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
        this.products$ = this.api.getProducts()
        this.currentTab = this.adminTab.PRODUCT_LIST
        break;
      case this.adminTab.POPULAR_PRODUCTS:
        this.currentTab = this.adminTab.POPULAR_PRODUCTS
        break;
      case this.adminTab.ORDER_INVOICE:
        this.api.getOrders().subscribe(orders => {
          orders.forEach(order => {
            order.orderSummary = this.jsonUtils.parseJson(order.orderSummary)
            order.payment = this.jsonUtils.parseJson(order.payment)
          })
          this.orders$ = of(orders)
        })
        this.currentTab = this.adminTab.ORDER_INVOICE
        break;
      case this.adminTab.SHIPPING_RATES:
        this.shippingRates$ = this.api.getShippingRates("")
        this.currentTab = this.adminTab.SHIPPING_RATES
        break;
      case this.adminTab.GROSS_WEIGHT_CALCULATOR:
        this.grossWeights$ = this.api.getGrossWeights()
        this.currentTab = this.adminTab.GROSS_WEIGHT_CALCULATOR
        break;
      case this.adminTab.REGISTERED_USERS:
        this.users$ = this.api.getRegisteredUsers()
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
    this.productForm.addControl('size', this.fb.array([]))
    this.productForm.addControl('price', this.fb.array([]))
    this.productForm.addControl('weight', this.fb.array([]))
    this.productForm.addControl('quantity', this.fb.array([]))
    this.formArray('properties', { isNotDeep: true }).controls.forEach((property, i) => {
      this.formArray('size', { isNotDeep: true }).push(this.fb.control(this.formArray('size', { index: i }).value, Validators.required));
      this.formArray('price', { isNotDeep: true }).push(this.fb.control(this.formArray('price', { index: i }).value, Validators.required));
      this.formArray('weight', { isNotDeep: true }).push(this.fb.control(this.formArray('weight', { index: i }).value, Validators.required));
      this.formArray('quantity', { isNotDeep: true }).push(this.fb.control(this.formArray('quantity', { index: i }).value, Validators.required));
    })
    this.productForm.removeControl('properties')
    if (!this.isEditing) {
      this.api.addProduct(this.productForm.value).pipe().subscribe(
        product => {
          this.alertService.success("Product added", true)
          this.loading = false
          this.submitted = false
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
          this.products$ = this.api.getProducts()
          this.showOverlay = false
          this.loading = false
          this.submitted = false
          this.productForm.reset({})
        }
      )
    }
    this.productForm.addControl('properties', this.fb.array([this.addProperty]))
  }

  delete(id, type) {
    this.alertService.clear()
    switch (type) {
      case 'product':
        this.api.deleteProduct(id).pipe().subscribe(
          data => {
            this.alertService.success("Product Deleted", true)
            this.products$ = this.api.getProducts()
          },
          error => {
            this.alertService.error("Error deleting product", true)
          }
        )
        break;
      case 'shippingRate':
        this.api.deleteShippingRate(id).pipe().subscribe(
          data => {
            this.alertService.success("Shipping Rate Deleted", true)
            this.shippingRates$ = this.api.getShippingRates('')
          },
          error => {
            this.alertService.error("Error deleting Shipping Rate", true)
          }
        )
        break;
    }
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
          this.grossWeights$ = this.api.getGrossWeights()
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
          this.grossWeights$ = this.api.getGrossWeights()
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
          this.shippingRates$ = this.api.getShippingRates("")
          this.showOverlay = false
          this.loading = false
          this.submitted = false
          this.shippingRateForm.reset({})
          this.shippingRateForm.patchValue({ isLocal: null, shippingMethod: [''] })
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
          this.shippingRates$ = this.api.getShippingRates("")
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
      this.formArray('properties', { isNotDeep: true }).clear()
      this.formArray('colors', { isNotDeep: true }).clear()
      this.formArray('imageUrl', { isNotDeep: true }).clear()
      value.colors.map(color => this.formArray('colors', { isNotDeep: true }).push(this.fb.control(color, Validators.required)))
      value.imageUrl.map(image => this.formArray('imageUrl', { isNotDeep: true }).push(this.fb.control(image, Validators.required)))

      value.colors.forEach((color, i) => {
        this.formArray('properties', { isNotDeep: true }).push(this.addProperty(false))
        value.size[i].forEach(size => this.formArray('size', { index: i }).push(this.fb.control(size, Validators.required)))
        value.price[i].forEach(price => this.formArray('price', { index: i }).push(this.fb.control(price, Validators.required)))
        value.weight[i].forEach(weight => this.formArray('weight', { index: i }).push(this.fb.control(weight, Validators.required)))
        value.quantity[i].forEach(quantity => this.formArray('quantity', { index: i }).push(this.fb.control(quantity, Validators.required)))
      });
    } else if (this.editing == "grossWeight") {
      this.grossWeightForm.patchValue(value)
    } else if (this.editing == "shippingRate") {
      this.shippingRateForm.patchValue(value)
    } else if (this.editing == "grossWeight") {
      this.grossWeightForm.patchValue(value)
    } else if (this.editing == "message") {

    }
  }

  formArray(type, { isNotDeep = false, index = -1 }): FormArray {
    if (isNotDeep) {
      return this.productForm.get(type) as FormArray
    }
    return (this.productForm.get('properties') as FormArray).controls[index].get(type) as FormArray
  }

  addField(fieldName, { isNotDeep = false, index = -1 }) {
    if (fieldName === 'properties') {
      this.formArray(fieldName, { isNotDeep: true }).push(this.addProperty(true))
      return
    }
    this.formArray(fieldName, { isNotDeep, index }).push(this.fb.control('', Validators.required))
  }

  removeField(fieldName, { isNotDeep = false, index = -1, index1 = -1 }) {
    if (index1 === -1) {
      this.formArray(fieldName, { isNotDeep: true }).removeAt(index)
      return
    }
    this.formArray(fieldName, { isNotDeep, index }).removeAt(index1)
  }

  addProperty(withInit): FormGroup {
    if (withInit) {
      return this.fb.group({
        size: this.fb.array([this.fb.control('', Validators.required)]),
        price: this.fb.array([this.fb.control('', Validators.required)]),
        weight: this.fb.array([this.fb.control('', Validators.required)]),
        quantity: this.fb.array([this.fb.control('', Validators.required)])
      })
    }
    return this.fb.group({
      size: this.fb.array([]),
      price: this.fb.array([]),
      weight: this.fb.array([]),
      quantity: this.fb.array([])
    })
  }

  filterShippingRates(value) {
    this.shippingRates$ = this.api.getShippingRates(value)
  }

}
