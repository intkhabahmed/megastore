import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Product } from './../../models/product';
import { ApiService } from './../../services/api.service';
import { Utility } from './../../utils/utils';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products$: Observable<Product[]>
  categories$: Observable<any[]>
  currentCategory
  currentSubCategory
  loading = false
  constructor(private api: ApiService, public utility: Utility, private route: ActivatedRoute) { }

  ngOnInit() {
    this.categories$ = this.api.getCategories()
    this.currentCategory = this.route.snapshot.queryParams['category'] || 'All'
    this.currentSubCategory = this.route.snapshot.queryParams['subCategory']
    this.filterProduct(this.route.snapshot.queryParams['category'] || undefined, this.route.snapshot.queryParams['subCategory'] || undefined)
  }

  filterProduct(categoryName?, subCategoryName?) {
    this.loading = true
    this.products$ = of([])
    this.api.getProducts({ category: categoryName, subCategory: subCategoryName, productStatus: true }).subscribe(products => {
      this.loading = false
      this.products$ = of(products)
    })
  }

}
