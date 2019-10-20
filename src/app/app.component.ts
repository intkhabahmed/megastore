import { ApiService } from './services/api.service';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'maa-taluja-creations';
  constructor(private dataService: DataService, private authenticationService: AuthenticationService, public router: Router,
    private fb: FormBuilder, private api: ApiService) {
  }

  cartItemCount: number;
  currentToken: any
  searchForm: FormGroup
  currentUser$: Observable<User>
  categories$: Observable<any[]>

  ngOnInit(): void {
    this.dataService.orderSummary.subscribe(summary => this.cartItemCount = summary.cartItems.size);
    this.searchForm = this.fb.group({
      keyword: ['', Validators.required]
    })
    this.authenticationService.currentToken.subscribe(x => {
      this.currentToken = x
      if (x) {
        this.currentUser$ = this.api.getUserById()
      }
    });
    this.categories$ = this.api.getCategories()
  }

  ngAfterViewInit(): void {
    if ($(window).width() < 992) {
      $('.linkc').on('click', () => {
        $('.collapse.navbar-collapse').removeClass('show');
      });
    }
  }

  isActive(path) {
    return location.pathname == path
  }

  search() {
    if (this.searchForm.invalid) {
      return
    }
    this.router.navigate(["/search"], { queryParams: { query: this.searchForm.controls.keyword.value } })
    this.searchForm.reset()
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

  openProductsWithQuery(query?) {
    this.router.navigate(['/products'], { queryParams: { 'category': query } })
  }
}
