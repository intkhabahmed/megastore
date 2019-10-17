import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {

  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {
  }

  goToProfile() {
    this.router.navigate(['/profile'], { replaceUrl: true })
  }

  goHome() {
    this.router.navigate(['/'], { replaceUrl: true })
  }
}
