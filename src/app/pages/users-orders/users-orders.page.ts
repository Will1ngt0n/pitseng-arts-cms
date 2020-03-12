import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalController } from '@ionic/angular';
import { OrderDetailsPage } from '../order-details/order-details.page';

@Component({
  selector: 'app-users-orders',
  templateUrl: './users-orders.page.html',
  styleUrls: ['./users-orders.page.scss'],
})
export class UsersOrdersPage implements OnInit {
  pendingOrders : Array<any> = []
  orderHistory : Array<any> = []
  searchedOrders : Array<any> = []
  orders : Array<any> = []

  constructor(private productsService : ProductsService,
    public modalController: ModalController) { }

  ngOnInit() {
    this.getPendingOrders();
    this.getClosedOrders();
  }
  getPendingOrders(){
    return this.productsService.getOrdersList("Order").then( res => {

      console.log(res);
      this.pendingOrders = res
    })
  }
  getClosedOrders(){
    return this.productsService.getOrdersList("orderHistory").then( res => {
      console.log(res);
      this.orderHistory = res
    })
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  searchProducts(event){
    let query = event.target.value.trim()
    console.log(query);
    this.searchedOrders = this.orders.filter( item => item.data.name.toLowerCase().indexOf(query.toLowerCase()) >= 0 )
    console.log(this.searchedOrders);
    
  }
  async viewDetail(value) {
    //  console.log("My data ",value, "My id");
    const modal = await this.modalController.create({
      component: OrderDetailsPage,
      cssClass: 'track-order',
      componentProps: {
        item : value
       
      }

    });
    return await modal.present();
  }


}
