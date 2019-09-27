import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import * as $ from 'jQuery';
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
  constructor(private dataService: DataService, private authenticationService: AuthenticationService, private router: Router) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  cartItemCount: number;
  currentUser: User

  ngOnInit(): void {
    this.dataService.orderSummary.subscribe(summary => this.cartItemCount = summary.cartItems.size);
  }

  ngAfterViewInit(): void {
    if ($(window).width() < 992) {
      $('.nav-link, .nav-right-btn').on('click', () => {
        $('.navbar-collapse').removeClass('show');
      });
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
