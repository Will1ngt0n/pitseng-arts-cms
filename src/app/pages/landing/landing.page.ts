import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OrderDetailsPage } from '../order-details/order-details.page';
import { AddProductPage } from '../add-product/add-product.page';
import { ProfilePage } from '../profile/profile.page';


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
  vasesLength : number = 0
  decorationsLength : number = 0
  lampsLength : number = 0
  potteryLength : number = 0
  searchedItems : Array<any> = []

  constructor(private productsService : ProductsService, private router : Router, private modalController : ModalController) {
    this.categoryOptions = ['Deco', 'Lamps', 'Vases', 'Pottery']
  }

  ngOnInit() {
    this.getSales()
    this.getProducts()
    this.getPendingOrders()
    this.getClosedOrders()
  }
  navigateToItemsList(){
     
  }
  getProducts(){
    return this.productsService.getProducts().then( res => {
      this.inventory = res
      let sortedOrder : Array<any> = []
      for(let i in res){
        sortedOrder.push(res[i])
      }
      for(let key in this.inventory){
        if(this.inventory[key].data.category === 'Vases'){
          this.vasesLength = this.vasesLength + 1
        }else if(this.inventory[key].data.category === 'Deco'){
          this.decorationsLength = this.decorationsLength + 1
        }else if(this.inventory[key].data.category === 'Pottery'){
          this.potteryLength = this.potteryLength + 1
        }else{
          this.lampsLength = this.lampsLength + 1
        }
      }
      this.orderProducts(sortedOrder)
    })
  }
  orderProducts(sortedOrder){
    let order = sortedOrder.sort((a,b) => {
      return (b.data.timesOrdered) - (a.data.timesOrdered)
    });
    order.splice(6)
    this.bestSellers = order
    console.log(this.bestSellers);
    
  }
  getSales(){
    return this.productsService.getSales().then( res => {
      console.log(res);
      this.sales = res
      this.maxPercentage = Math.max(...this.sales.map(o=>o['data'].percentage), this.sales[0]['data'].percentage);
      console.log(this.maxPercentage);
      
    })
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

  //routing and navigation
  viewItems(item, para){
    console.log(item);
    this.router.navigate([para, item])
  }
  viewMore(para){
    this.router.navigate([para])
  }
  async openAddProduct(){

    
      //  console.log("My data ",value, "My id");
      const modal = await this.modalController.create({
        component: AddProductPage,
        cssClass: 'track-order',
        componentProps: {
         
        }
      });
      return await modal.present();
  }
  async openProfile(){
    console.log('open');
    const modal = await this.modalController.create({
      component: ProfilePage,
      cssClass: 'track-order',
      componentProps: {

      }
    })
    return await modal.present();
  }
  //searching and queries
  searchProducts(event){
    let query = event.target.value.trim()
    console.log(query);
    console.log(this.inventory);
    
    this.searchedItems = this.inventory.filter( item => item.data.name.toLowerCase().indexOf(query.toLowerCase()) >= 0 )
    console.log(this.searchedItems);
    
  }
}
