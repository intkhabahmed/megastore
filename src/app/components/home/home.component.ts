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
  productJson: string = '[{"productStatus":true,"_id":"5d739f7f6613391d9cdac9ef","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","weight":1,"price":100,"quantity":2,"createdAt":"2019-09-07T12:15:59.666Z","__v":0},{"productStatus":true,"_id":"5d739f806613391d9cdac9f0","name":"Wool","productCode":"12345","description":"Dummy description","category":"Firbre","price":200,"quantity":3,"weight":2,"createdAt":"2019-09-07T12:16:00.489Z","__v":0},{"productStatus":true,"_id":"5d73a24d1d711425642638b3","name":"Cotton","productCode":"12347","description":"Dummy description","category":"Firbre","price":150, "weight":0.5, "quantity":5,"createdAt":"2019-09-07T12:27:57.128Z","__v":0},{"productStatus":true,"_id":"5d73a24d1d711425642638b4","name":"Nylon","productCode":"12345","description":"Dummy description","category":"Firbre","price":100, "weight":1.5, "quantity":2,"createdAt":"2019-09-07T12:27:57.550Z","__v":0},{"productStatus":true,"_id":"5d73a24e1d711425642638b5","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T12:27:58.277Z","__v":0},{"productStatus":true,"_id":"5d73a24f1d711425642638b6","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T12:27:59.113Z","__v":0},{"productStatus":true,"_id":"5d73b3d883581e1ea023e4ab","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:48.250Z","__v":0},{"productStatus":true,"_id":"5d73b3d883581e1ea023e4ac","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:48.593Z","__v":0},{"productStatus":true,"_id":"5d73b3da83581e1ea023e4ad","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:50.696Z","__v":0},{"productStatus":true,"_id":"5d73b3db83581e1ea023e4ae","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:51.797Z","__v":0},{"productStatus":true,"_id":"5d73b3dc83581e1ea023e4af","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:52.885Z","__v":0},{"productStatus":true,"_id":"5d73b3de83581e1ea023e4b0","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:54.035Z","__v":0},{"productStatus":true,"_id":"5d73b3df83581e1ea023e4b1","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:55.068Z","__v":0},{"productStatus":true,"_id":"5d73b3df83581e1ea023e4b2","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:55.990Z","__v":0},{"productStatus":true,"_id":"5d73b3e083581e1ea023e4b3","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:56.989Z","__v":0},{"productStatus":true,"_id":"5d73b3e183581e1ea023e4b4","name":"Silk Fibre","productCode":"12345","description":"Dummy description","category":"Firbre","price":100,"quantity":2,"createdAt":"2019-09-07T13:42:57.866Z","__v":0}]';
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
