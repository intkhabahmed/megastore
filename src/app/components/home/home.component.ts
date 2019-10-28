import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ApiService } from './../../services/api.service';
import { DataService } from './../../services/data.service';
import { Utility } from './../../utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private service: ApiService, public dataService: DataService, public utility: Utility) { }
  products: Observable<Product[]>
  productsLength: number
  newArrivals$: Observable<Product[]>
  banners$: Observable<any[]>
  loading = false
  newArrivalsLength
  na_positionX = 0

  ngOnInit() {
    this.loading = true
    this.banners$ = this.service.getBanners()
    this.products = this.service.getProducts({ productStatus: true })
    this.products.subscribe(products => {
      this.loading = false
      this.productsLength = products.length
    })
    this.newArrivals$ = this.service.getNewArrivals()
    this.newArrivals$.subscribe(newArrivals => this.newArrivalsLength = newArrivals.length)
  }

  ngAfterViewInit(): void {
    var pp_positionX = 0
    $('#pp_next_btn').on('click', () => {
      if ($('#popular-product-slider').width() > $("#popular-product-slider div").width() * (this.productsLength + 0.5)) {
        return;
      }
      if (Math.abs($('#popular-product-slider').width() - $("#popular-product-slider div").width() * (this.productsLength + 0.5)) < 100) {
        if (pp_positionX < $("#popular-product-slider div").width()) {
          pp_positionX += $("#popular-product-slider div").width() + 20;
        } else {
          pp_positionX = 0
        }
      } else {
        if (pp_positionX < $("#popular-product-slider div").width() * (this.productsLength - 1)) {
          pp_positionX += $("#popular-product-slider div").width() + 20;
        } else {
          pp_positionX = 0
        }
      }
      $('#popular-product-slider').css({ 'transform': 'translate(-' + pp_positionX + 'px, 0px)' });
    });
    $('#pp_prev_btn').on('click', () => {
      if ($('#popular-product-slider').width() > $("#popular-product-slider div").width() * (this.productsLength + 0.5)) {
        return;
      }
      if (pp_positionX > 0) {
        pp_positionX -= $("#popular-product-slider div").width() + 20;
        if (pp_positionX < 0) {
          pp_positionX = 0;
        }
      } else {
        if (Math.abs($('#popular-product-slider').width() - $("#popular-product-slider div").width() * (this.productsLength + 1)) < 50) {
          pp_positionX = $("#popular-product-slider div").width()
        } else {
          pp_positionX = $("#popular-product-slider div").width() * (this.productsLength - 1)
        }

      }
      $('#popular-product-slider').css({ 'transform': 'translate(-' + pp_positionX + 'px, 0px)' });
    });
  }

  next() {
    if ($('#new-arrivals-slider').width() > $("#new-arrivals-slider div").width() * (this.newArrivalsLength + 0.5)) {
      return;
    }
    if (Math.abs($('#new-arrivals-slider').width() - $("#new-arrivals-slider div").width() * (this.newArrivalsLength + 0.5)) < 100) {
      if (this.na_positionX < $("#new-arrivals-slider div").width()) {
        this.na_positionX += $("#new-arrivals-slider div").width() + 20;
      } else {
        this.na_positionX = 0
      }
    } else {
      if (this.na_positionX < $("#new-arrivals-slider div").width() * (this.newArrivalsLength - 1)) {
        this.na_positionX += $("#new-arrivals-slider div").width() + 20;
      } else {
        this.na_positionX = 0
      }
    }
    $('#new-arrivals-slider').css({ 'transform': 'translate(-' + this.na_positionX + 'px, 0px)' });
  }

  prev() {
    if ($('#new-arrivals-slider').width() > $("#new-arrivals-slider div").width() * (this.newArrivalsLength + 0.5)) {
      return;
    }
    if (this.na_positionX > 0) {
      this.na_positionX -= $("#new-arrivals-slider div").width() + 20;
      if (this.na_positionX < 0) {
        this.na_positionX = 0;
      }
    } else {
      if (Math.abs($('#new-arrivals-slider').width() - $("#new-arrivals-slider div").width() * (this.newArrivalsLength + 1)) < 50) {
        this.na_positionX = $("#new-arrivals-slider div").width()
      } else {
        this.na_positionX = $("#new-arrivals-slider div").width() * (this.newArrivalsLength - 1);
      }

    }
    $('#new-arrivals-slider').css({ 'transform': 'translate(-' + this.na_positionX + 'px, 0px)' });
  }
}
