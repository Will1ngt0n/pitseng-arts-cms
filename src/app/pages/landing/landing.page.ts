import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  categoryOptions : Array<string>
  inventory : Array<any> = []
  sales : Array<any> = []
  pendingOrders : Array<any> = []
  orderHistory : Array<any> = []
  maxPercentage : number = 0
  bestSellers : Array<any> = []
  constructor(private productsService : ProductsService, private router : Router) {
    this.categoryOptions = ['Deco', 'Lamps', 'Vases', 'Pottery']
  }

  ngOnInit() {
    // this.getSales()
    // this.getProducts()
    // this.getPendingOrders()
    // this.getClosedOrders()
  }
  // navigateToItemsList(){
     
  // }
  // getProducts(){
  //   return this.productsService.getProducts().then( res => {
  //     console.log(res);
  //     this.inventory = res
  //     let order = this.inventory.sort((a,b) => {
  //       let c = a.data.timesOrdered
  //       let d = b.data.timesOrdered
  //       return d - c
  //     });
  //     order.splice(6)
  //     this.bestSellers = order
  //     console.log(order);
  //     console.log(this.bestSellers);
      
  //   })
  // }
  // getSales(){
  //   return this.productsService.getSales().then( res => {
  //     console.log(res);
  //     this.sales = res
  //     this.maxPercentage = Math.max(...this.sales.map(o=>o['data'].percentage), this.sales[0]['data'].percentage);
  //     console.log(this.maxPercentage);
      
  //   })
  // }
  // getPendingOrders(){
  //   return this.productsService.getPendingOrders().then( res => {
  //     console.log(res);
  //     this.pendingOrders = res
  //   })
  // }
  // getClosedOrders(){
  //   return this.productsService.getClosedOrders().then( res => {
  //     console.log(res);
  //     this.orderHistory = res
  //   })
  // }
  // viewItems(item){
  //   console.log(item);
  //   this.router.navigate(['items-list', item])
  // }
  // viewMore(para){
  //   if(para === 'specials'){
  //     this.router.navigate(['specials'])
  //   }
  // }
}
