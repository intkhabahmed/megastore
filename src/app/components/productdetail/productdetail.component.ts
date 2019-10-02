import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Product } from './../../models/product';
import { ApiService } from './../../services/api.service';
import { DataService } from './../../services/data.service';
import { Utility } from './../../utils/utils';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {

  product$: Observable<Product>
  colorValueChanged = false
  sizeValueChanged = false
  isEditing: boolean
  showUpdateButton: boolean

  constructor(private route: ActivatedRoute, private router: Router, private service: ApiService, public utility: Utility, private dataService: DataService) { }

  ngOnInit() {
    if (!this.utility.orderSummary.cartItems.has(this.route.snapshot.paramMap.get('id'))) {
      this.product$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) => this.service.getProduct(params.get('id')))
      )
      this.product$.subscribe(product => product.selectedIndex = -1)
    } else {
      this.product$ = of(this.utility.orderSummary.cartItems.get(this.route.snapshot.paramMap.get('id')).product)
      this.colorValueChanged = true;
    }
    this.isEditing = this.route.snapshot.queryParams['isEditing'] || false

  }

  redirectBack() {
    setTimeout(() => this.router.navigate([this.route.snapshot.queryParams['returnUrl']], { replaceUrl: true }), 1500)
  }
}
