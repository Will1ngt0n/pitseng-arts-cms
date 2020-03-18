import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as firebase from 'firebase'
import { CategoriesPopoverComponent } from 'src/app/components/categories-popover/categories-popover.component';
import { PopoverController, ModalController, LoadingController, NavController } from '@ionic/angular';
import { AddProductPage } from '../add-product/add-product.page';
import { UsersOrdersPageModule } from '../users-orders/users-orders.module';
import { UsersOrdersPage } from '../users-orders/users-orders.page';
import { ProfilePage } from '../profile/profile.page';
import { FaqsPage } from '../faqs/faqs.page'
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {
  products : Array<any> = []
  parameter : string = ''
  constructor(private activatedRoute: ActivatedRoute, private router : Router,
    public popoverController: PopoverController,public modalController: ModalController, private loadingCtrl: LoadingController, private navCtrl : NavController) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(result => {
      this.presentLoading()
      console.log(result);
      let parameter = result['key']
      console.log(parameter);
      this.parameter = parameter
      if(parameter === 'inventory'){
        this.getInventory()
      }else if(parameter === 'specials'){
        this.getSales()
      }
      else{
        this.getCategoryProducts(parameter)
      }

    })
  }
  getInventory(){
    return firebase.firestore().collection('Products').orderBy('created', 'desc').onSnapshot(res => {
      this.products = []
      for(let key in res.docs){
        this.products.push({productID: res.docs[key].id, data: res.docs[key].data()})
      }
      console.log(this.products);
      setTimeout( () => {
        try { this.loadingCtrl.dismiss() } catch (error) { }
      }, 300)
    })
  }
  getCategoryProducts(parameter){
    return firebase.firestore().collection('Products').where('category', '==', parameter).orderBy('created', 'desc').onSnapshot(res => {
      this.products = []
      for(let key in res.docs){
        this.products.push({productID: res.docs[key].id, data: res.docs[key].data()})
      }
      console.log(this.products);
      setTimeout( () => {
        try { this.loadingCtrl.dismiss() } catch (error) { }
      }, 300)
    })
  }
  getSales(){
    return firebase.firestore().collection('Products').where('onSale', '==', true).orderBy('created', 'desc').onSnapshot(res => {
      this.products = []
      for(let key in res.docs){
        this.products.push({productID: res.docs[key].id, data: res.docs[key].data()})
      }
      setTimeout( () => {
        try { this.loadingCtrl.dismiss() } catch (error) { }
      }, 300)
    })
  }
  viewDetails(item){
    console.log(item);

    let parameters : NavigationExtras = {queryParams :{page: 'items-list', query: this.parameter, name: item.data.name}}
    // this.navCtrl.navigateForward(['details', item.productID], parameters)
    this.router.navigate(['details', item.productID], parameters)
  }
  async  openAddProduct(){
    const modal = await this.modalController.create({
      component:AddProductPage,
      cssClass: 'add-product',
      
    
    });
    return await modal.present();

  }
  navigate(para){
    this.router.navigate([para])
  }
  openHome(){
    this.router.navigateByUrl('/landing')
  }
  openQueries(){
    this.router.navigateByUrl('/queries')
  }
  async openFAQRS(){
    // this.router.navigateByUrl('/faqs')
  const modal = await this.modalController.create({
    component:FaqsPage,
    cssClass: 'profile',
    
  
  });
  return await modal.present();
  }
  async openProfile(){
  const modal = await this.modalController.create({
    component:ProfilePage,
    cssClass: 'profile',
    
  
  });
  return await modal.present();
}
  async openOrders() {
    const modal = await this.modalController.create({
      component:UsersOrdersPage,
      cssClass: 'my-add-to-cart'
    });
    return await modal.present();
  }
  openAbout(){
    this.router.navigateByUrl('/about-us')
  }
  openAllCategories(){
    this.router.navigateByUrl('/')
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

    // const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  onRateChange(event){
    console.log(event);
    
  }

}
