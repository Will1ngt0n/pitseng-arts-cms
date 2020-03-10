import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-users-orders',
  templateUrl: './users-orders.page.html',
  styleUrls: ['./users-orders.page.scss'],
})
export class UsersOrdersPage implements OnInit {
  dbOrder = firebase.firestore().collection('Order');
  dbUser = firebase.firestore().collection("UserProfile");
  dbHistory = firebase.firestore().collection('orderHistory');
  ordersPlaced = [];
  orderHistory = [];
  myProfile = [];
  Allorders = [];
  users = []
  myProduct = false;

  constructor() { }

  ngOnInit() {
    this.GetOrders();
    this.viewDetails();
    this.getOrderHistory()
    let obj = { name: '', uid: '' };
    this.dbUser.onSnapshot(data => {
      data.forEach(item => {
        this.myProfile.push({data:item.data().name, id : item.id});
        obj.name = item.data().email;
        obj.uid = item.data().uid
        this.users.push(obj);
        obj = { name: '', uid: '' };
        // console.log("users ",  this.users);
      })
    })
  }
  viewDetails() {
   
    this.dbOrder.onSnapshot(data => {
      this.ordersPlaced = [];
    data.forEach(item => {
        
      })
   


    })


  }
  userProfiles() {
    this.ordersPlaced.forEach((i) => {

    })
  }
  GetOrders() {

    this.dbOrder.onSnapshot((data) => {
      // console.log("olx", data);
      if (this.Allorders = []) {
        this.myProduct = true
        data.forEach((item) => {
          this.Allorders.push({ ref: item.id, info: item.data(), total: item.data() })
        })
        // console.log("ccc", this.Allorders);
        // 
      } else {
        this.myProduct = false
      }

    })
  }
  getOrderHistory() {
    this.dbHistory.onSnapshot((res) => {
      this.orderHistory = [];
      res.forEach((doc) => {
        this.dbUser.doc(doc.data().userID).onSnapshot((item)=>{
          this.orderHistory.push({info:doc.data(), user: item.data().name, ref: doc.id});
        })
      })
    })
  }

}
