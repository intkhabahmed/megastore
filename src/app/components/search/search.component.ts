import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from './../../models/product';
import { ApiService } from './../../services/api.service';
import { Utility } from './../../utils/utils';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private api: ApiService, private route: ActivatedRoute, public utility: Utility) { }
  results$: Observable<Product[]>
  count = 0
  loading = false
  ngOnInit() {
    if (this.route.snapshot.queryParams['query']) {
      this.loading = true
      this.results$ = this.api.getProducts({ $text: { $search: this.route.snapshot.queryParams['query'] }, productStatus: true })
      this.results$.subscribe(products => {
        this.count = products.length
        this.loading = false
      })
    }
  }

  search(value) {
    this.loading = true
    this.results$ = this.api.getProducts({ $text: { $search: value } })
    this.results$.subscribe(products => {
      this.count = products.length
      this.loading = false
    })
  }

}
