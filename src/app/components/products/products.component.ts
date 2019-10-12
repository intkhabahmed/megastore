import { Utility } from './../../utils/utils';
import { ApiService } from './../../services/api.service';
import { Product } from './../../models/product';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products$: Observable<Product[]>
  constructor(private api: ApiService, public utility: Utility) {
    this.products$ = api.getProducts({ productStatus: true })
  }

  ngOnInit() {
  }

}
