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
    private fb: FormBuilder) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  cartItemCount: number;
  currentUser: User
  searchForm: FormGroup

  ngOnInit(): void {
    this.dataService.orderSummary.subscribe(summary => this.cartItemCount = summary.cartItems.size);
    this.searchForm = this.fb.group({
      keyword: ['', Validators.required]
    })
  }

  ngAfterViewInit(): void {
    if ($(window).width() < 992) {
      $('.nav-link, .nav-right-btn').on('click', () => {
        $('.navbar-collapse').removeClass('show');
      });
    }
  }

  search() {
    if (this.searchForm.invalid) {
      return
    }
    this.router.navigate(["/search"], { queryParams: { query: this.searchForm.controls.keyword.value } })
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
