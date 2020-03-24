import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router, NavigationExtras } from '@angular/router';
import { ModalController, PopoverController, LoadingController, AlertController } from '@ionic/angular';
import { OrderDetailsPage } from '../order-details/order-details.page';
import { AddProductPage } from '../add-product/add-product.page';
import { ProfilePage } from '../profile/profile.page';
import { OrdersListPage } from '../orders-list/orders-list.page';
import { CategoriesPopoverComponent } from 'src/app/components/categories-popover/categories-popover.component';
import * as firebase from 'firebase'
import { FaqsPage } from '../faqs/faqs.page';

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
  searchedItems : Array<any> = [];
  loadingData: boolean = true;

  constructor(private productsService : ProductsService, 
    private router : Router, 
    private modalController : ModalController,
    public popoverController: PopoverController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController) {
    this.categoryOptions = ['Deco', 'Lamps', 'Vases', 'Pottery']

    
  }

  ngOnInit() {
    
    return new Promise( (resolve, reject) => {
      this.presentLoading()
      this.getProducts().then(res => {
        console.log(res);
        
      })
      this.getPendingOrders().then(res => {
        console.log(res);
      })
      this.getClosedOrders().then(res => {
        console.log(res);
        setTimeout( () => {
          this.loadingCtrl.dismiss();
          this.loadingData = false
        }, 600)
      })
      this.checkUsers().then(res => {
        console.log(res);
        
      })
      setTimeout( () => {
        this.getProductsSnap()
        this.getPendingOrdersSnap()
        this.getClosedOrdersSnap()
      }, 1500)
      console.log('hehehe');
    })
  }
  navigateToItemsList(){
     
  }
  checkUsers(){
    return new Promise( (resolve, reject) => {
      try {
        firebase.auth().currentUser.uid
        resolve (true)
      } catch (error) {
        resolve (false)
      }

    })
    
  }
  getProducts(){
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('Products').orderBy('created', 'desc').onSnapshot( result => {
        let data : Array<any> = []
  for(let key in result.docs){
    console.log(key, result.docs[key].id);
    
    data.push({productID: result.docs[key].id, data: result.docs[key].data()})
  }
  try {
    this.inventory = data
    this.sales = []
    this.vasesLength = 0
    this.potteryLength = 0
    this.lampsLength = 0
    this.decorationsLength = 0
    let sortedOrder : Array<any> = []
    for(let i in data){
      sortedOrder.push(data[i])
    }
    for(let key in this.inventory){
      if(this.inventory[key].data.onSale === true){  if(this.sales.length < 6){this.sales.push(this.inventory[key])} }
      if(this.inventory[key].data.category === 'Vases'){ this.vasesLength = this.vasesLength + 1 }
      else if(this.inventory[key].data.category === 'Deco'){ this.decorationsLength = this.decorationsLength + 1 }
      else if(this.inventory[key].data.category === 'Pottery'){ this.potteryLength = this.potteryLength + 1 }
      else{ this.lampsLength = this.lampsLength + 1 }
    }
    console.log(this.sales);
    
    console.log('still running ', data.length);
    try { this.maxPercentage = Math.max(...this.sales.map(o=>o['data'].percentage), this.sales[0]['data'].percentage); } catch (error) { console.log('sales :', error); }
    console.log(this.maxPercentage);
    this.orderProducts(sortedOrder)
  } catch (error) { }
  resolve ('success')
})
    })

  }
  orderProducts(sortedOrder){
    console.log(sortedOrder);
    
    let order = sortedOrder.sort((a,b) => { return (b.data.timesOrdered) - (a.data.timesOrdered) });
    order.splice(6)
    this.bestSellers = order
  }
  getProductsSnap(){
    return firebase.firestore().collection('Products').orderBy('created', 'desc').onSnapshot(res => {
      //this.getProducts()
      // let data
      // for(let key in res.docs){
      //   console.log(key, res.docs[key].id);
        
      //   data.push({productID: res.docs[key].id, data: res.docs[key].data()})
      // }
    })
  }
  getPendingOrders(){
    return this.productsService.getOrdersList('Order').then(res => {
      this.pendingOrders = res
    }).then( () => {
      return 'pendingOrdersFetched'
    })
  }
  getPendingOrdersSnap(){
    return firebase.firestore().collection('Order').onSnapshot(res => {
      this.getPendingOrders()
    })
  }
  getClosedOrders(){
    return this.productsService.getOrdersList('orderHistory').then(res => {
      this.orderHistory = res
    }).then( () => {
      return 'closedOrdersFetched'
    })
  }
  getClosedOrdersSnap(){
    return firebase.firestore().collection('orderHistory').onSnapshot(res => {
      this.getClosedOrders()
    })
  }
  viewDetails(item){
    let parameters : NavigationExtras = {queryParams :{page: 'landing', query: null, name: item.data.name}}
    this.router.navigate(['details', item.productID], parameters) 
  }
  viewItems(item, para, length){
    if(length === 0){
      this.productAlert('There\'s nothing to display in ' + item, 'Notice')
    }else{
      this.router.navigate([para, item])
    }
    
  }
  navigate(para){
    this.router.navigate([para])
  }
  async viewOrders(collection, orders){
      //  console.log("My data ",value, "My id");
      const modal = await this.modalController.create({
        component: OrdersListPage,
        cssClass: 'order-details',
        componentProps: {
          collection : collection,
          orders : orders
        }
      });
      return await modal.present();
  }
  async openAddProduct(){
    const modal = await this.modalController.create({
      component: AddProductPage,
      cssClass: 'track-order',
      componentProps: {  }
    });
    return await modal.present();
  }
  async openFAQRS(){
    const modal = await this.modalController.create({
      component:FaqsPage,
      cssClass: 'profile',
    });
    return await modal.present();
  }
  async openProfile(){
    console.log('open');
    const modal = await this.modalController.create({
      component: ProfilePage,
      cssClass: 'profile',
      componentProps: {  }
    })
    return await modal.present();
  }
  //searching and queries
  searchResults = ""
  searchProducts(event){
    let query = event.target.value.trim()
    this.searchedItems = this.inventory.filter( item => item.data.name.toLowerCase().indexOf(query.toLowerCase()) >= 0 )
    
    this.searchResults = event.target.value;
    console.log(this.searchedItems);
  }
  openHome(){
    this.router.navigateByUrl('/landing')
  }
  openQueries(){
    this.router.navigateByUrl('/queries')
  }
  openAboutUs(){
    this.router.navigateByUrl('/about-us')
  }
  async Categories(ev) {
    const popover = await this.popoverController.create({
      component:CategoriesPopoverComponent,
      event: ev,
      // cssClass: 'pop-over-style',
      translucent: true,
    });
    return await popover.present();
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present(); 
   }
     async productAlert(message, header) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Okay',
          handler: (okay) => {
            console.log('User clicked "okay"');
          }
        }
      ]
    });
    await alert.present();
  }
  
}
