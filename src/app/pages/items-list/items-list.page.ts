import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase'
import { CategoriesPopoverComponent } from 'src/app/components/categories-popover/categories-popover.component';
import { PopoverController, ModalController } from '@ionic/angular';
import { AddProductPage } from '../add-product/add-product.page';
import { UsersOrdersPageModule } from '../users-orders/users-orders.module';
import { UsersOrdersPage } from '../users-orders/users-orders.page';
import { ProfilePage } from '../profile/profile.page';
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {
  products : Array<any> = []
  constructor(private activatedRoute: ActivatedRoute, private router : Router,
    public popoverController: PopoverController,public modalController: ModalController,) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(result => {
      console.log(result);
      let parameter = result['key']
      console.log(parameter);
      if(parameter === 'inventory'){
        this.getInventory()
      }else{
        this.getCategoryProducts(parameter)
      }

    })
  }
  getInventory(){
    return firebase.firestore().collection('Products').onSnapshot(res => {
      this.products = []
      for(let key in res.docs){
        this.products.push({productID: res.docs[key].id, data: res.docs[key].data()})
      }
      console.log(this.products);
      
    })
  }
  getCategoryProducts(parameter){
    return firebase.firestore().collection('Products').where('category', '==', parameter).onSnapshot(res => {
      this.products = []
      for(let key in res.docs){
        this.products.push({productID: res.docs[key].id, data: res.docs[key].data()})
      }
      console.log(this.products);
      
    })
  }
  viewDetails(item){
    console.log(item);
    this.router.navigate(['details', item.productID])
    
  }
  async  openAddProduct(){
    const modal = await this.modalController.create({
      component:AddProductPage,
      cssClass: 'add-product',
      
    
    });
    return await modal.present();

  }
  openHome(){
    this.router.navigateByUrl('/landing')
  }
  openQueries(){
    this.router.navigateByUrl('/queries')
  }
  openFAQRS(){
    this.router.navigateByUrl('/faqs')
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

}
