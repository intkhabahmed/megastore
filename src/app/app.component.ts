import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Observable, of } from 'rxjs';
import { User } from './models/user';
import { ApiService } from './services/api.service';
import { AuthenticationService } from './services/authentication.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private dataService: DataService, private authenticationService: AuthenticationService, public router: Router,
    private fb: FormBuilder, private api: ApiService) {
  }

  cartItemCount: number;
  currentToken: any
  searchForm: FormGroup
  currentUser$: Observable<User>
  categories$: Observable<any[][]>
  showDropdown = false
  homeIcon = "homeicon.png"
  shoppingIcon = "shoppingicon.png"
  fbIcon = "fbicon.png"
  instaIcon = "instaicon.png"
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
    this.api.getCategories().subscribe(categories => {
      var slicedCategories = []
      for (var i = 0; i < categories.length; i += 4) {
        slicedCategories.push(categories.slice(i, i + 4))
      }
      this.categories$ = of(slicedCategories)
    })
  }

  collapseNavBar() {
    if ($(window).width() < 992) {
      $('.collapse.navbar-collapse').removeClass('show');
    }
  }

  scrollToBottom() {
    $('html, body').animate({
      scrollTop: $('footer').offset().top - 120
    }, 1500);
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

  openProductsWithQuery(query?, subCategory?) {
    this.router.navigate(['/products'], { queryParams: { 'category': query, 'subCategory': subCategory } })
  }
}
