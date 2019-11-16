import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
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

  constructor(private api: ApiService, public utility: Utility, private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.loading = true
        this.results$ = this.api.getProducts({ $text: { $search: event.snapshot.queryParams['query'] }, productStatus: true })
        this.results$.subscribe(products => {
          this.count = products.length
          this.loading = false
        })
      }
    })
  }
  results$: Observable<Product[]>
  count = 0
  loading = false
  ngOnInit() {
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
