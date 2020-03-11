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
  collection : string = ''
  orderID : string = ''
  fullOrder : object = {}
  userDetails : object = {}
  res 
  constructor(private activatedRoute : ActivatedRoute, private productsService : ProductsService, private loc : Location, private route : Router) { }

  ngOnInit() {
    console.log(this.res);
    this.activatedRoute.queryParams.subscribe(res => {
      console.log(res);
      this.res = res
      try {
        console.log(JSON.parse(res.object));
        let parameters = JSON.parse(res.object)
        //this.getOrderDetails(res['key'])
        let currentLoc = (this.loc['_platformStrategy']['_platformLocation'].location.origin);
        let path = (this.loc['_platformStrategy']['_platformLocation'].location.pathname)
        let orderID = parameters.orderID
        this.orderID = orderID
        console.log(orderID);
        this.collection = parameters.location
        this.userDetails = parameters.user
        console.log(currentLoc, path);
        // this.loc.replaceState(path+'/'+orderID)
        this.orderDetailsSnap(parameters.location, orderID)
      } catch (error) {
        this.route.navigate(['landing'])
      }
    })
  }
//
orderDetailsSnap(parameter, orderID){
  console.log(parameter);
  return firebase.firestore().collection(parameter).doc(orderID).onSnapshot(res => {
    this.status = res.data().status
    console.log(this.status);
    this.fullOrder = {orderID: res.id, data: res.data(), user: this.userDetails}
  })
}

processOrder(status){
  return this.productsService.processOrder(this.orderID, status).then(res => {
    
  })
}
closeOrder(status){
  return this.productsService.closeOrder(this.orderID, status, this.fullOrder).then(res => {
    console.log(res);
    
  })
}

// using this variable as a temporary set, please replace with correct order status variable
tempStatus = "received";
cancelOrder(){
  console.log("cancel clicked");
  this.tempStatus = "cancelled";
  
  document.getElementById("one").style.background = "red";
  document.getElementById("one").style.color = "white";

  document.getElementById("two").style.background = "red";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "red";
  document.getElementById("three").style.color = "white";

  document.getElementById("four").style.background = "red";
  document.getElementById("four").style.color = "white";
}
approveOrder(){
  console.log("clicked");
  this.tempStatus = "approved";


  document.getElementById("two").style.background = "green";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "transparent";
  document.getElementById("three").style.color = "black";

  document.getElementById("four").style.background = "transparent";
  document.getElementById("four").style.color = "black";
}
prepareOrder(){
  console.log("clicked");
  this.tempStatus = "prepared";

  

  document.getElementById("two").style.background = "green";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "green";
  document.getElementById("three").style.color = "white";

  document.getElementById("four").style.background = "transparent";
  document.getElementById("four").style.color = "black";

}
concludeOrder(){
  console.log("clicked");
  this.tempStatus = "concluded";


  

  document.getElementById("two").style.background = "green";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "green";
  document.getElementById("three").style.color = "white";

  document.getElementById("four").style.background = "green";
  document.getElementById("four").style.color = "white";

}
}
