import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-users-orders',
  templateUrl: './users-orders.page.html',
  styleUrls: ['./users-orders.page.scss'],
})
export class UsersOrdersPage implements OnInit {
  pendingOrders : Array<any> = []
  orderHistory : Array<any> = []

  constructor(private productsService : ProductsService,
    public modalController: ModalController) { }

  ngOnInit() {
  }
  getPendingOrders(){
    return this.productsService.getPendingOrders().then( res => {
      console.log(res);
      this.pendingOrders = res
    })
  }
  getClosedOrders(){
    return this.productsService.getClosedOrders().then( res => {
      console.log(res);
      this.orderHistory = res
    })
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}
