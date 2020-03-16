import { Component, OnInit,Input } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OrderDetailsPage } from '../order-details/order-details.page';
import { Location } from '@angular/common';
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit {
  //orders : Array<any> = []
  constructor(private productsService : ProductsService, private activatedRoute : ActivatedRoute, private router : Router, private modalController : ModalController,) { }
  @Input() collection : string
  @Input() orders : object
  ngOnInit() {
    console.log(this.collection);
    console.log(this.orders);
    
    this.activatedRoute.params.subscribe(res => {
      console.log(res);
      if(res['key'] === 'orders'){
        this.getOrders('Order')
      }else if(res['key'] === 'order history'){
        this.getOrders('orderHistory')
      }

      
      //this.loc.replaceState(this.loc.path)
    })
  }

  getOrders(query){
    console.log(query);
    
    return this.productsService.getOrdersList(query).then(res => {
      console.log(res);
      this.orders = res
    })
  }

  // viewOrderDetails(item){
  //   let extras : NavigationExtras = {queryParams : {object : JSON.stringify(item)} }
  //   this.router.navigate(['order-details'], extras)
  // }
  async viewOrderDetails(value) {
    const modal = await this.modalController.create({
      component: OrderDetailsPage,
      cssClass: 'order-details',
      componentProps: {
        item : value
       
      }

    });
    return await modal.present();
  }

  orderStat = 'Check'
}
