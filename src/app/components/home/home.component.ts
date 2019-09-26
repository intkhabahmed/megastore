import { Utility } from './../../utils/utils';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartItem } from './../../models/cart-item';
import { OrderSummary } from './../../models/order-summary';
import { ApiService } from './../../services/api.service';
import { DataService } from './../../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private service: ApiService, public dataService: DataService, public utility: Utility) { }
  products: Observable<Product[]>;
  orderSummary: OrderSummary
  productsLength: number

  ngOnInit() {
    this.products = this.service.getProducts()
    this.products.subscribe(products => this.productsLength = products.length)
    this.dataService.orderSummary.subscribe(summary => this.orderSummary = summary)
  }

  addProductToCart(product: Product) {
    var item = new CartItem();
    item.product = product
    item.noOfItems = 1
    item.itemsWeight = product.weight
    item.itemsCost = product.price
    this.orderSummary.cartItems.set(product._id, item)
    this.orderSummary.productNetWeight += product.weight
    this.orderSummary.totalProductCost += product.price
    this.dataService.changeOrderDetails(this.orderSummary);
  }

  ngAfterViewInit(): void {
    var pp_positionX = 0
    $('#pp_next_btn').on('click', () => {
      if (pp_positionX < $("#popular-product-slider div").width() * this.productsLength) {
        pp_positionX += $("#popular-product-slider div").width() + 10;
      } else {
        pp_positionX = 0
      }
      $('#popular-product-slider').css({ 'transform': 'translate(-' + pp_positionX + 'px, 0px)' });
    });
    $('#pp_prev_btn').on('click', () => {
      if (pp_positionX > 0) {
        pp_positionX -= $("#popular-product-slider div").width() + 10;
        if (pp_positionX < 0) {
          pp_positionX = 0;
        }
      } else {
        pp_positionX = $("#popular-product-slider div").width() * this.productsLength;
      }
      $('#popular-product-slider').css({ 'transform': 'translate(-' + pp_positionX + 'px, 0px)' });
    });

    var na_positionX = 0
    $('#na_next_btn').on('click', function () {
      if (na_positionX < $("#new-arrivals-slider img").width() * 3) {
        na_positionX += $("#new-arrivals-slider img").width() + 15;
      } else {
        na_positionX = 0
      }
      $('#new-arrivals-slider').css({ 'transform': 'translate(-' + na_positionX + 'px, 0px)' });
    });
    $('#na_prev_btn').on('click', function () {
      if (na_positionX > 0) {
        na_positionX -= $("#new-arrivals-slider img").width() + 15;
        if (na_positionX < 0) {
          na_positionX = 0;
        }
      } else {
        na_positionX = $("#new-arrivals-slider img").width() * 3;
      }
      console.log(na_positionX)
      $('#new-arrivals-slider').css({ 'transform': 'translate(-' + na_positionX + 'px, 0px)' });
    });
  }
}
