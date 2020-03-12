import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';
import * as firebase from 'firebase'
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  products : Array<any> = []
  order = {}
  status : string = ''
  price : number = 0
  collection : string = ''
  orderID : string = ''
  fullOrder : object = {}
  userDetails : object = {}
  res 
  selectedItem : object = {}
  constructor(private activatedRoute : ActivatedRoute, private productsService : ProductsService, private loc : Location, private route : Router, private modalController: ModalController) { }
  @Input() item : object;
  ngOnInit() {
    console.log(this.item);
      console.log(this.item);
      try {
        // console.log(JSON.parse(this.item.object));
        let parameters = this.item
console.log(this.item);

        //this.getOrderDetails(this.item['key'])
        //let currentLoc = (this.loc['_platformStrategy']['_platformLocation'].location.origin);
        //let path = (this.loc['_platformStrategy']['_platformLocation'].location.pathname)
        let orderID = parameters['orderID']
        this.orderID = orderID
        this.products = parameters['data'].product
        console.log(this.products);
        
       this.selectedItem = this.products[0]
        this.order = parameters
        console.log(orderID);
        this.collection = parameters['location']
        this.userDetails = parameters['user']
       // console.log(currentLoc, path);
        // this.loc.replaceState(path+'/'+orderID)
        this.orderDetailsSnap(parameters['location'], orderID)
      } catch (error) {
        this.route.navigate(['landing'])
      }
    
  }
//
orderDetailsSnap(parameter, orderID){
  console.log(parameter);
  return firebase.firestore().collection(parameter).doc(orderID).onSnapshot(res => {
    this.status = res.data().status
    console.log(this.status);
    this.item['data'] = res.data()
    this.fullOrder = {orderID: res.id, data: res.data(), user: this.userDetails}
    console.log(this.item);
    this.products = this.item['data'].product
    console.log(this.products);
    
  })
}
viewItem(item){
  this.selectedItem = item
  console.log(this.selectedItem);
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
  //console.log(this.item['data'].deliveryType);
  this.processOrder('cancelled')
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
  this.processOrder('processed')

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
  this.processOrder('ready')
  

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

console.log(this.item['data'].deliveryType);
  if(this.item['data'].deliveryType === 'Collection'){
    this.closeOrder('collected')
  }else if(this.item['data'].deliveryType === 'Delivery'){
    this.closeOrder('delivered')
  }
  

  document.getElementById("two").style.background = "green";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "green";
  document.getElementById("three").style.color = "white";

  document.getElementById("four").style.background = "green";
  document.getElementById("four").style.color = "white";

}
}
