import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';
import * as firebase from 'firebase'
import { Location } from '@angular/common';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  products : Array<any> = []
  status : string = ''
  price : number = 0

  constructor(private activatedRoute : ActivatedRoute, private productsService : ProductsService, private loc : Location, private route : Router) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(res => {
      try {
        console.log(JSON.parse(res.object));
        let parameters = JSON.parse(res.object)
        //this.getOrderDetails(res['key'])
  
        let currentLoc = (this.loc['_platformStrategy']['_platformLocation'].location.origin);
        let path = (this.loc['_platformStrategy']['_platformLocation'].location.pathname)
        let productID = parameters.orderID
        console.log(productID);
        
        console.log(currentLoc, path);
        this.loc.replaceState(path+'/'+productID)
        this.orderDetailsSnap(parameters.location, productID)
      } catch (error) {
        this.route.navigate(['landing'])
        
      }

    })
  }
//
orderDetailsSnap(parameter, productID){
  console.log(parameter);
  
  return firebase.firestore().collection(parameter).doc(productID).onSnapshot(res => {
    this.status = res.data().status
    console.log(this.status);
    
  })
}
}
