import { DataService } from './services/data.service';
import { Component, Input } from '@angular/core';
import * as $ from 'jQuery';
import { CartItem } from './models/cart-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'maa-taluja-creations';
  constructor(private dataService: DataService) { }

  cartItemCount: number;

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
}
