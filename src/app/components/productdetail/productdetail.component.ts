import { DataService } from './../../services/data.service';
import { Product } from './../../models/product';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {

  product$: Observable<Product>

  constructor(private route: ActivatedRoute, private router: Router, private service: ApiService) { }

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.service.getProduct(params.get('id')))
    )
  }

}
