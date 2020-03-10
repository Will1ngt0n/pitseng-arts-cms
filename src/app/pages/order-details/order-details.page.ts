import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';
import * as firebase from 'firebase'
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  constructor(private activatedRoute : ActivatedRoute, private productsService : ProductsService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(res => {
      console.log(JSON.parse(res.object));
      this.getOrderDetails(res['key'])
      
    })
  }
  getOrderDetails(orderID){
    return firebase.firestore().collection('Order').doc(orderID).get().then(res => {

    })
  }
}
