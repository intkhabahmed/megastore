import { logging } from 'protractor';
import { Utility } from './../../utils/utils';
import { ApiService } from './../../services/api.service';
import { Product } from './../../models/product';
import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products$: Observable<Product[]>
  categories$: Observable<any[]>
  currentCategory = 'All'
  loading = false
  constructor(private api: ApiService, public utility: Utility) { }

  ngOnInit() {
    this.loading = true
    this.api.getProducts({ productStatus: true }).subscribe(products => {
      this.loading = false
      this.products$ = of(products)
    })
    this.categories$ = this.api.getCategories()
  }

  filterProduct(categoryName?) {
    this.loading = true
    this.products$ = of([])
    this.api.getProducts({ category: categoryName, productStatus: true }).subscribe(products => {
      this.loading = false
      this.products$ = of(products)
    })
  }

}
