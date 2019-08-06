import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    var pp_positionX = 0
    $('#pp_next_btn').on('click', function () {
      if (pp_positionX < $("#popular-product-slider div").width() * 10) {
        pp_positionX += $("#popular-product-slider div").width() + 10;
      } else {
        pp_positionX = 0
      }
      $('#popular-product-slider').css({ 'transform': 'translate(-' + pp_positionX + 'px, 0px)' });
    });
    $('#pp_prev_btn').on('click', function () {
      if (pp_positionX > 0) {
        pp_positionX -= $("#popular-product-slider div").width() + 10;
        if (pp_positionX < 0) {
          pp_positionX = 0;
        }
      } else {
        pp_positionX = $("#popular-product-slider div").width() * 10;
      }
      $('#popular-product-slider').css({ 'transform': 'translate(-' + pp_positionX + 'px, 0px)' });
    });

    var na_positionX = 0
    $('#na_next_btn').on('click', function () {
      if (na_positionX < $("#new-arrivals-slider img").width() * 3) {
        na_positionX += $("#new-arrivals-slider img").width() + 15;
      } else {
        na_positionX = 0
      }
      $('#new-arrivals-slider').css({ 'transform': 'translate(-' + na_positionX + 'px, 0px)' });
    });
    $('#na_prev_btn').on('click', function () {
      if (na_positionX > 0) {
        na_positionX -= $("#new-arrivals-slider img").width() + 15;
        if (na_positionX < 0) {
          na_positionX = 0;
        }
      } else {
        na_positionX = $("#new-arrivals-slider img").width() * 3;
      }
      console.log(na_positionX)
      $('#new-arrivals-slider').css({ 'transform': 'translate(-' + na_positionX + 'px, 0px)' });
    });
  }

}
