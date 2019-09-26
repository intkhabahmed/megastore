import { User } from './../../models/user';
import { AlertService } from './../../services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from './../../models/product';
import { ApiService } from './../../services/api.service';
import { AdminTab } from './../../utils/enums';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentTab: AdminTab
  row: number
  isEditing = false
  products: Observable<Product[]>
  users: Observable<User[]>
  newProductForm: FormGroup
  updateProductForm: FormGroup
  grossWeightForm: FormGroup
  loading = false
  submitted = false;
  editing: string

  constructor(private api: ApiService, private formBuilder: FormBuilder, private alertService: AlertService) { }

  get adminTab() {
    return AdminTab
  }

  ngOnInit() {
    this.currentTab = this.adminTab.NEW_PRODUCT_UPLOAD

    this.newProductForm = this.formBuilder.group({
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
      name: ['', Validators.required],
      productCode: ['', Validators.required],
      description: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      price: ['', Validators.required],
      weight: ['', Validators.required],
      quantity: ['', Validators.required],
      productStatus: [true]
    })

    this.updateProductForm = this.formBuilder.group({
      _id: [],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
      name: ['', Validators.required],
      productCode: ['', Validators.required],
      description: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      price: ['', Validators.required],
      weight: ['', Validators.required],
      quantity: ['', Validators.required],
      productStatus: [true]
    })

    this.grossWeightForm = this.formBuilder.group({
      _id: [],
      minWeight: ['', Validators.required],
      maxWeight: ['', Validators.required],
      toBeAdded: ['', Validators.required]
    })
  }

  get f() {
    if (this.isEditing && this.editing == 'product') {
      return this.updateProductForm.controls
    }
    if (this.isEditing && this.editing == 'grossWeight') {

    }
    return this.newProductForm.controls
  }

  showTab(selectedTab) {
    switch (selectedTab) {
      case this.adminTab.NEW_PRODUCT_UPLOAD:
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
        this.currentTab = this.adminTab.SHIPPING_RATES
        break;
      case this.adminTab.GROSS_WEIGHT_CALCULATOR:
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

  addProduct() {
    this.alertService.clear()
    this.submitted = true

    if (this.newProductForm.invalid) {
      this.loading = false
      return
    }
    this.loading = true
    this.api.addProduct(this.newProductForm.value).pipe().subscribe(
      product => {
        this.alertService.success("Product added", true)
        this.loading = false
        this.submitted = false
        this.newProductForm.reset({
          category: '',
          imageUrl: '',
          name: '',
          productCode: '',
          description: '',
          color: '',
          size: '',
          price: '',
          weight: '',
          quantity: '',
          productStatus: true
        })
      },
      error => {
        this.alertService.error("Some error occurred while adding product", true)
        this.loading = false
      }
    )
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
    debugger;
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

  populateEditForm(value: any) {
    if (this.editing == "product") {
      this.updateProductForm.setValue(
        value
      )
    } else if (this.editing == "grossWeight") {
      this.grossWeightForm.setValue(
        value
      )
    }
  }

}
