import { AdminTab } from './../../utils/enums';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentTab: AdminTab
  constructor() { }

  get adminTab() {
    return AdminTab
  }

  ngOnInit() {
    this.currentTab = this.adminTab.NEW_PRODUCT_UPLOAD
  }

  showTab(selectedTab) {
    switch (selectedTab) {
      case this.adminTab.NEW_PRODUCT_UPLOAD:
        this.currentTab = this.adminTab.NEW_PRODUCT_UPLOAD
        break;
      case this.adminTab.PRODUCT_LIST:
        this.currentTab = this.adminTab.PRODUCT_LIST
        break;
      case this.adminTab.POPULAR_PRODUCTS:
        this.currentTab = this.adminTab.POPULAR_PRODUCTS
        break;
      case this.adminTab.NEW_ARRIVALS:
        this.currentTab = this.adminTab.NEW_ARRIVALS
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
        this.currentTab = this.adminTab.REGISTERED_USERS
        break;
      case this.adminTab.MESSAGES:
        this.currentTab = this.adminTab.MESSAGES
        break;
      default:
        break;
    }
  }

}
