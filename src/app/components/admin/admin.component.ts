import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GrossWeight } from 'src/app/models/gross-weight';
import { Message } from 'src/app/models/message';
import { Order } from 'src/app/models/order';
import { ShippingRate } from 'src/app/models/shipping-rate';
import { Product } from './../../models/product';
import { User } from './../../models/user';
import { AlertService } from './../../services/alert.service';
import { ApiService } from './../../services/api.service';
import { PdfGeneratorService } from './../../services/pdf-generator.service';
import { AdminTab, ShippingMethod } from './../../utils/enums';
import { JsonUtils } from './../../utils/json-utils';

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
  categoryForm: FormGroup
  orderForm: FormGroup
  messageForm: FormGroup
  bannerForm: FormGroup
  newArrivalForm: FormGroup
  loading = false
  submitted = false;
  editing: string
  orders$: Observable<Order[]>
  shippingRates$: Observable<ShippingRate[]>
  grossWeights$: Observable<GrossWeight[]>
  messages$: Observable<Message[]>
  showOverlay = false
  id: string
  categories$: Observable<any[]>
  banners$: Observable<any[]>;
  newArrivals$: Observable<any[]>;
  subCategories$: Observable<any[]>;

  constructor(private api: ApiService, private fb: FormBuilder, private alertService: AlertService, private jsonUtils: JsonUtils,
    public pdf: PdfGeneratorService, private router: Router) {
    api.getUserById().subscribe(user => {
      if (!user.isAdmin) {
        router.navigate(['/'])
        alertService.error("Forbidden", true)
      }
    })
  }

  get adminTab() {
    return AdminTab
  }

  ngOnInit() {
    this.currentTab = this.adminTab.NEW_PRODUCT_UPLOAD
    this.categories$ = this.api.getCategories()
    this.initializeFormGroups()
  }

  cancel() {
    this.isEditing = false
    this.showOverlay = false
    this.editing = ""
    this.submitted = false
    this.initializeFormGroups()
  }

  initializeFormGroups() {
    this.productForm = this.fb.group({
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
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

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      subCategories: this.fb.array([])
    })
    this.addField('subCategories', {}, 'category')

    this.orderForm = this.fb.group({
      trackingNo: ['', Validators.required]
    })

    this.messageForm = this.fb.group({
      reply: ['', Validators.required]
    })

    this.bannerForm = this.fb.group({
      imageUrl: ['', Validators.required],
      title: [''],
      subTitle: ['']
    })

    this.newArrivalForm = this.fb.group({
      imageUrl: ['', Validators.required],
      name: ['']
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
    if (this.editing == 'category') {
      return this.categoryForm.controls
    }
    if (this.editing == 'order') {
      return this.orderForm.controls
    }
    if (this.editing == 'message') {
      return this.messageForm.controls
    }
    if (this.editing == 'banner') {
      return this.bannerForm.controls
    }
    if (this.editing == 'newArrival') {
      return this.newArrivalForm.controls
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
        this.categories$ = this.api.getCategories()
        this.currentTab = this.adminTab.NEW_PRODUCT_UPLOAD
        break;
      case this.adminTab.PRODUCT_LIST:
        this.products$ = this.api.getProducts()
        this.categories$ = this.api.getCategories()
        this.currentTab = this.adminTab.PRODUCT_LIST
        break;
      case this.adminTab.CATEGORIES:
        this.categories$ = this.api.getCategories()
        this.currentTab = this.adminTab.CATEGORIES
        break;
      case this.adminTab.ORDER_INVOICE:
        this.getAndParseOrders()
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
        this.messages$ = this.api.getMessages()
        this.currentTab = this.adminTab.MESSAGES
        break;
      case this.adminTab.BANNERS:
        this.banners$ = this.api.getBanners()
        this.currentTab = this.adminTab.BANNERS
        break;
      case this.adminTab.NEW_ARRIVALS:
        this.newArrivals$ = this.api.getNewArrivals()
        this.currentTab = this.adminTab.NEW_ARRIVALS
        break;
      default:
        break;
    }
  }

  getAndParseOrders() {
    this.api.getOrders().subscribe(orders => {
      orders.forEach(order => {
        order.orderSummary = this.jsonUtils.parseJson(order.orderSummary)
        order.payment = this.jsonUtils.parseJson(order.payment)
        order.address = this.jsonUtils.parseJson(order.address)
      })
      this.orders$ = of(orders)
    })
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
    this.formArray('properties', { isNotDeep: true }).disable()
    if (!this.isEditing) {
      this.api.addProduct(this.productForm.value).pipe().subscribe(
        product => {
          this.alertService.success("Product added", true)
          this.loading = false
          this.cancel()
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
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while updating product", true)
          this.loading = false
          this.submitted = false
        }
      )
    }
  }

  delete(id, type) {
    this.alertService.clear()
    switch (type) {
      case 'product':
        this.api.deleteProduct(id).subscribe(
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
        this.api.deleteShippingRate(id).subscribe(
          data => {
            this.alertService.success("Shipping Rate Deleted", true)
            this.shippingRates$ = this.api.getShippingRates('')
          },
          error => {
            this.alertService.error("Error deleting Shipping Rate", true)
          }
        )
        break;
      case 'grossWeight':
        this.api.deleteGrossWeight(id).subscribe(
          data => {
            this.alertService.success("Grossweight Deleted", true)
            this.grossWeights$ = this.api.getGrossWeights()
          },
          error => {
            this.alertService.error("Error deleting gross weight", true)
          }
        )
        break;
      case 'category':
        this.api.deleteCategory(id).subscribe(
          data => {
            this.alertService.success("Category Deleted", true)
            this.categories$ = this.api.getCategories()
          },
          error => {
            this.alertService.error("Error deleting category", true)
          }
        )
        break;
      case 'banner':
        this.api.deleteBanner(id).subscribe(
          data => {
            this.alertService.success("Banner Deleted", true)
            this.banners$ = this.api.getBanners()
          },
          error => {
            this.alertService.error("Error deleting banner", true)
          }
        )
        break;
      case 'newArrival':
        this.api.deleteNewArrival(id).subscribe(
          data => {
            this.alertService.success("Offer Deleted", true)
            this.newArrivals$ = this.api.getNewArrivals()
          },
          error => {
            this.alertService.error("Error deleting offer", true)
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
      this.api.insertGrossWeight(this.grossWeightForm.value).subscribe(
        grossWeight => {
          this.alertService.success("Gross Weight added")
          this.grossWeights$ = this.api.getGrossWeights()
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while adding gross weight", true)
          this.loading = false
          this.submitted = false
        }
      )
    } else {
      this.api.updateGrossWeight(this.id, this.grossWeightForm.value).subscribe(
        data => {
          this.alertService.success("Gross Weight updated")
          this.grossWeights$ = this.api.getGrossWeights()
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while updating gross weight", true)
          this.loading = false
          this.submitted = false
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
      this.api.insertShippingRate(this.shippingRateForm.value).subscribe(
        shippingRate => {
          this.alertService.success("Shipping Rate added")
          this.shippingRates$ = this.api.getShippingRates("")
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while adding shipping rate", true)
          this.loading = false
          this.submitted = false
        }
      )
    } else {
      this.api.updateShippingRate(this.id, this.shippingRateForm.value).subscribe(
        data => {
          this.alertService.success("Shipping Rate updated")
          this.shippingRates$ = this.api.getShippingRates("")
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while updating shipping rate", true)
          this.loading = false
          this.submitted = false
        }
      )
    }
  }

  addOrUpdateCategory() {
    this.alertService.clear()
    this.submitted = true
    if (this.categoryForm.invalid) {
      this.loading = false;
      return
    }
    this.loading = true
    if (!this.isEditing) {
      this.api.insertCategory(this.categoryForm.value).subscribe(
        category => {
          this.alertService.success("Category added")
          this.categories$ = this.api.getCategories()
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while adding category", true)
          this.loading = false
          this.submitted = false
        }
      )
    } else {
      this.api.updateCategory(this.id, this.categoryForm.value).subscribe(
        data => {
          this.alertService.success("Category updated")
          this.categories$ = this.api.getCategories()
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while updating category", true)
          this.loading = false
          this.submitted = false
        }
      )
    }
  }

  updateOrder() {
    this.alertService.clear()
    this.submitted = true
    if (this.orderForm.invalid) {
      this.loading = false;
      return
    }
    this.loading = true
    this.api.updateOrder(this.id, this.orderForm.value).subscribe(
      data => {
        this.alertService.success("Order updated")
        this.getAndParseOrders()
        this.loading = false
        this.cancel()
      },
      error => {
        this.alertService.error("Some error occurred while updating order", true)
        this.loading = false
        this.submitted = false
      }
    )
  }

  updateMessage() {
    this.alertService.clear()
    this.submitted = true
    if (this.messageForm.invalid) {
      this.loading = false;
      return
    }
    this.loading = true
    this.api.updateMessage(this.id, this.messageForm.value).subscribe(
      data => {
        this.alertService.success("Reply sent")
        this.messages$ = this.api.getMessages()
        this.loading = false
        this.cancel()
      },
      error => {
        this.alertService.error("Some error occurred while updating message", true)
        this.loading = false
        this.submitted = false
      }
    )
  }

  addOrUpdateBanner() {
    this.alertService.clear()
    this.submitted = true
    if (this.bannerForm.invalid) {
      this.loading = false;
      return
    }
    this.loading = true
    if (!this.isEditing) {
      this.api.insertBanner(this.bannerForm.value).subscribe(
        banner => {
          this.alertService.success("Banner added")
          this.banners$ = this.api.getBanners()
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while adding banner", true)
          this.loading = false
          this.submitted = false
        }
      )
    } else {
      this.api.updateBanner(this.id, this.bannerForm.value).subscribe(
        data => {
          this.alertService.success("Banner updated")
          this.banners$ = this.api.getBanners()
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while updating banner", true)
          this.loading = false
          this.submitted = false
        }
      )
    }
  }

  addOrUpdateNewArrival() {
    this.alertService.clear()
    this.submitted = true
    if (this.newArrivalForm.invalid) {
      this.loading = false;
      return
    }
    this.loading = true
    if (!this.isEditing) {
      this.api.insertNewArrival(this.newArrivalForm.value).subscribe(
        offer => {
          this.alertService.success("Offer added")
          this.newArrivals$ = this.api.getNewArrivals()
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while adding offer", true)
          this.loading = false
          this.submitted = false
        }
      )
    } else {
      this.api.updateNewArrival(this.id, this.newArrivalForm.value).subscribe(
        data => {
          this.alertService.success("Offer updated")
          this.newArrivals$ = this.api.getNewArrivals()
          this.loading = false
          this.cancel()
        },
        error => {
          this.alertService.error("Some error occurred while updating offer", true)
          this.loading = false
          this.submitted = false
        }
      )
    }
  }

  populateEditForm(value: any) {
    this.id = value._id
    if (this.editing == "product") {
      this.loadSubCategories(value.category)
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
      this.messageForm.patchValue(value)
    } else if (this.editing == 'category') {
      this.categoryForm.patchValue(value)
      this.formArray('subCategories', {}, 'category').clear()
      value.subCategories.map(subCategory => this.formArray('subCategories', {}, 'category').push(this.fb.control(subCategory, Validators.required)))
    } else if (this.editing == 'order') {
      this.orderForm.patchValue(value)
    } else if (this.editing == 'banner') {
      this.bannerForm.patchValue(value)
    } else if (this.editing == 'newArrival') {
      this.newArrivalForm.patchValue(value)
    }
  }

  formArray(type, { isNotDeep = false, index = -1 }, formType?): FormArray {
    if (formType) {
      return this.categoryForm.get(type) as FormArray
    }
    if (isNotDeep) {
      return this.productForm.get(type) as FormArray
    }
    return (this.productForm.get('properties') as FormArray).controls[index].get(type) as FormArray
  }

  addField(fieldName, { isNotDeep = false, index = -1 }, formType?) {
    if (formType) {
      this.formArray(fieldName, {}, formType).push(this.fb.control('', Validators.required))
      return
    }
    if (fieldName === 'properties') {
      this.formArray(fieldName, { isNotDeep: true }).push(this.addProperty(true))
      return
    }
    this.formArray(fieldName, { isNotDeep, index }).push(this.fb.control('', Validators.required))
  }

  removeField(fieldName, { isNotDeep = false, index = -1, index1 = -1 }, formType?) {
    if (formType) {
      this.formArray(fieldName, {}, formType).removeAt(index)
      return
    }
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

  loadSubCategories(value) {
    this.categories$.subscribe(categories => {
      categories.forEach(category => {
        if (category.name === value) {
          this.subCategories$ = of(category.subCategories)
          return;
        }
      })
    })
  }

}
