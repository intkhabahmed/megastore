import { Component } from '@angular/core';
import * as $ from 'jQuery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'maa-taluja-creations';

  ngAfterViewInit(): void {
    if ($(window).width() < 992) {
      $('.nav-link, .nav-right-btn').on('click', () => {
        $('.navbar-collapse').removeClass('show');
      });
    }
  }
}
