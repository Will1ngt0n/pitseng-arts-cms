import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase'
import * as moment from 'moment'
import { ProductsService } from 'src/app/services/products/products.service';
import { LoadingController, AlertController, NavController, ModalController, PopoverController } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { CategoriesPopoverComponent } from 'src/app/components/categories-popover/categories-popover.component';
import { FaqsPage } from '../faqs/faqs.page';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  productDetails : object = {}
  today : string = ''
  promo_valid : boolean = false 
  save_valid : boolean = false
  price_invalid : boolean = false
  previous_page : string = ''
  previous_query : string = ''
  @ViewChild('checkboxS', { static: true }) checkboxS: ElementRef; blnCheckS : boolean
  @ViewChild('checkboxM', { static: true }) checkboxM: ElementRef; blnCheckM : boolean
  @ViewChild('checkboxL', { static: true }) checkboxL: ElementRef; blnCheckL : boolean
  // @ViewChild('promoPercentageChild', {static : true}) promoPercentageChild : ElementRef
  // @ViewChild('updatericeChild', {static : true}) updatePriceChild : ElementRef
  constructor(public popoverController: PopoverController, private activatedRoute : ActivatedRoute, private productsService : ProductsService, private router : Router, private loadingCtrl : LoadingController, private alertController: AlertController, public modalController: ModalController, private navCtrl : NavController) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(result => {
      this.presentLoading()
      console.log(result);
      this.activatedRoute.queryParams.subscribe(res => {
        console.log(res);
        this.previous_page = res.page
        this.previous_query = res.query
        console.log(this.previous_query);
        
        this.productName = res.name
        console.log(this.previous_page, this.previous_query);
        
      })
      this.getDetails(result.productID)
      this.today = moment(new Date).format('YYYY-MM-DD')
      console.log(this.today);
      let value = this.router
      console.log(value);
      
    })
  }
  getDetails(productID) {
    return firebase.firestore().collection('Products').doc(productID).onSnapshot(res => {
      if (res.exists) {
        this.productDetails = ({ productID: res.id, data: res.data() })
        console.log(this.productDetails);
        this.updateName = res.data().name
        this.productName = res.data().name
        this.updateDescription = res.data().description
        this.updatePrice = res.data().price
        this.updateSize = res.data().sizes
        this.updateQuantity = res.data().quantity
        this.updateItem = res.data().item
        this.changeItemColor(res.data().item)
        this.productID = res.id
        this.productCode = res.data().productCode
        this.image = res.data().image
        this.imageBack = res.data().imageBack
        this.imageSide = res.data().imageSide
        this.imageTop = res.data().imageTop
        let sale : boolean = res.data().onSale
          //try {
            //console.log('okay');
            
            if(sale === true){
              this.promoSalePrice = (res.data().salePrice).toFixed(2); this.promoPercentage = res.data().percentage; this.promoStartDate = moment(res.data().startDate).format('YYYY-MM-DD'); this.promoEndDate = moment(res.data().endDate).format('YYYY-MM-DD') 
              console.log(this.promoStartDate);
            }else{
              this.promoSalePrice = (res.data().salePrice).toFixed(2); this.promoPercentage = null; this.promoStartDate = undefined; this.promoEndDate = undefined
              console.log(this.promoStartDate);
            }
          //} catch (error) {  }
        
        console.log(this.promoStartDate);
        console.log(this.promoEndDate);


        console.log(this.promoSalePrice);

        console.log(this.updateSize);
        this.blnCheckM = false; this.blnCheckS = false; this.blnCheckL = false
        console.log(res.data().sizes);

        this.availableSizes = (res.data().sizes).join(', ')
        console.log(this.availableSizes);

        for (let key in this.updateSize) {
          if (this.updateSize[key] === 'S') {
            this.blnCheckS = true
          } else if (this.updateSize[key] === 'M') {
            this.blnCheckM = true
          } else if (this.updateSize[key] === 'L') {
            this.blnCheckL = true
          }
        }
        setTimeout(() => {
          try { this.loadingCtrl.dismiss() } catch (error) { }
        }, 300)

        console.log(this.blnCheckL, this.blnCheckM, this.blnCheckS);
      }else{
        this.navCtrl.pop()
      }
    })
  }

  image
  imageSide
  imageBack
  imageTop

  availableSizes
  productID
  productCode
  updateName
  productName
  updateDescription
  updatePrice: number = 0
  updateSize: Array<any>
  updateQuantity
  updateItem

  promoPercentage: number = 0
  promoSalePrice: string
  promoStartDate
  promoEndDate
  endDateLimit
  updateImageSide
  updateImageTop
  updateImageBack
  updateImageMain
  uploadImage(event, image) {
    if (image === 'imageSide') {
      this.updateImageSide = event.target.files[0]
    } else if (image === 'imageBack') {
      this.updateImageBack = event.target.files[0]
    } else if (image === 'imageTop') {
      this.updateImageTop = event.target.files[0]
    } else {
      this.updateImageMain = event.target.files[0]
    }
    console.log(this.updateImageSide);
    console.log(this.updateImageTop);
    console.log(this.updateImageBack);
    console.log(this.updateImageMain);

  }
  temporary_price
  temporary_percentage
  checknumberinput(event, parameter) {
    if (parameter === 'promo_percentage') {
      this.temporary_percentage = event.srcElement.value
    } else if (parameter === 'update_price') {
      this.temporary_price = event.srcElement.value
    }
  }
  calculateSalePrice(event) {

    let key = event.keyCode
    if (key === 109 || key === 107 || key === 189 || key === 187) {
      event.srcElement.value = this.temporary_percentage
      this.promoPercentage = this.temporary_percentage
    } else {
      event.srcElement.value = Number(event.srcElement.value)
    }
    if (this.promoPercentage > 99) {
      this.promoPercentage = 99
      this.promoSalePrice = String(Number(this.productDetails['data'].price - this.productDetails['data'].price * this.promoPercentage / 100).toFixed(2))
    } else {
      this.promoSalePrice = String(Number(this.productDetails['data'].price - this.productDetails['data'].price * this.promoPercentage / 100).toFixed(2))
    }
    if (this.promoPercentage < 0) {
      //this.promoPercentage = 0
    }
    if (Number(this.promoSalePrice) > this.updatePrice) {
      this.promoSalePrice = Number(this.updatePrice).toFixed(2)
    }
    console.log(this.promoPercentage);

    this.validatePromo()
  }
  saveEdit() {
    this.presentLoading()
    return this.productsService.saveEdit(this.productID, this.updateName, this.updatePrice, this.updateDescription, this.updateQuantity, this.updateItem, this.updateSize, this.updateImageSide, this.updateImageBack, this.updateImageTop, this.updateImageMain).then(res => {
      if (res === 'success') {
        setTimeout(() => {
          //try { this.loadingCtrl.dismiss() } catch (error) { }
          this.productAlert('Product has been successfully updated', 'Success')
          this.save_valid = false
        }, 300)
      }
    })
  }
  // salePrice : number
  // percentage : number
  // endDate
  // startDate
  promoteProduct() {
    this.presentLoading()
    return this.productsService.promoteProduct(this.productDetails, this.promoStartDate, this.promoEndDate, this.promoPercentage, this.promoSalePrice, this.productID).then(res => {
      console.log(res);
      console.log(this.loadingCtrl);

      if (res === 'success') {
        setTimeout(() => {
          //try { this.loadingCtrl.dismiss() } catch (error) { }
          this.productAlert('Product has been successfully promoted', 'Success')
          this.promo_valid = false
        }, 300)
      }
    })
  }
  removeFromPromo() {
    console.log(this.productDetails);
    this.presentLoading()
    return this.productsService.removePromo(this.productDetails).then(res => {
      if (res === 'success') {
        setTimeout(() => {
          //try { this.loadingCtrl.dismiss() } catch (error) { }
          this.productAlert('Product has been successfully removed from promotions', 'Success')
          this.promo_valid = false
        }, 300)
      }

    })
  }
  async deleteProduct() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('User clicked "cancel"');
          }
        }, {
          text: 'Delete',
          handler: (okay) => {
            console.log('User clicked "okay"');
            this.presentLoading()
            this.deleteItemConfirmed()
          }
        }
      ]
    });
    await alert.present();
  }
  deleteItemConfirmed() {

    return this.productsService.deleteProduct(this.productID).then(res => {
      if (res === 'success') {
        setTimeout(() => {
          try { this.loadingCtrl.dismiss() } catch (error) { }
          this.productAlert('Product has been successfully deleted', 'Success')
          
        }, 300)
      }
    })
  }
  toggleCombo(value) {
    // alert(value);
    this.updateItem = value
    this.validateEdit()
    this.changeItemColor(value)
  }
  changeItemColor(value){
    let isPack = document.getElementById("perPack");
    let isItem = document.getElementById("perItem");
    if (value == "pack") {
      // selected

      isPack.style.background = "rgb(124, 124, 124)";
      isPack.style.color = "white";
      // deselected
      isItem.style.background = "white";
      isItem.style.color = "black"
    }
    else {
      // deselected
      isPack.style.background = "white";
      isPack.style.color = "black";
      // selected
      isItem.style.background = "rgb(124, 124, 124)";
      isItem.style.color = "white"
    } 
  }
  addQuantity(){
    this.updateQuantity++
    console.log(this.updateQuantity);

  }
  minusQuantity() {
    this.updateQuantity--
    if (this.updateQuantity < 0) {
      this.updateQuantity = 0
    }
    console.log(this.updateQuantity);
  }
  changeSizes(event, size) {
    if (event.target.checked === true) {
      this.updateSize.push(size)
      console.log(this.updateSize);
    } else if (event.target.checked === false) {
      let index = this.updateSize.indexOf(size)
      console.log(index);
      this.updateSize.splice(index, 1)
      console.log(this.updateSize);
    }
    this.validateEdit()
  }
  changeStartDate(event) {
    console.log(event.target.value);
    this.endDateLimit = moment(this.promoStartDate).add('days', 1).format('YYYY-MM-DD')
    let full = new Date(this.promoStartDate).getTime()
    console.log(full);
    let newF = moment(full).format('YYYY-MM-DD')
    console.log(newF);
    let pro = new Date(newF).getTime()
    console.log(pro);
    let pro2 = moment(pro).format('YYYY-MM-DD')
    console.log(pro2);

    //let pic;
    this.validatePromo()
  }
  changeEndDate(event) {
    this.validatePromo()
  }
  changeName(event) {
    this.validateEdit()
  }
  saveCurrent(event) {
    //console.log(this.);
    console.log(this.updatePrice);

  }
  changePrice(event) {
    let key = event.keyCode
    if (key === 109 || key === 107 || key === 189 || key === 187) {
      event.srcElement.value = this.temporary_price
      this.updatePrice = Number(this.temporary_price)
    } else {
      event.srcElement.value = Number(event.srcElement.value)
    }
    console.log(this.updatePrice);

    this.validateEdit()
  }
  changeDescription(event) {
    this.validateEdit()
  }
  validatePromo() {
    if (this.promoStartDate === undefined || this.promoEndDate === undefined || this.promoPercentage === undefined || String(this.promoPercentage) === '') {
      this.promo_valid = false
    } else {
      this.promo_valid = true
    }
  }
  validateEdit() {
    if (this.updateName === '' || this.updateDescription === '' || this.updatePrice === 0 || this.updatePrice === null || this.updateSize.length === 0) {
      this.save_valid = false
    } else {
      this.save_valid = true
    }
    console.log(this.save_valid);

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
  goBack(){
    this.navCtrl.pop()
  }
  goHome(){
    this.router.navigate(['landing'])
  }

  navigate(para){
    this.router.navigate([para])
  }
  menuOpen: boolean = false;
  menuBtn = "menu"
  showMenu() {
    let myMenu = document.getElementById("options");
    var menu_items = document.getElementsByClassName("menu-item") as HTMLCollectionOf<HTMLElement>;
    if (this.menuOpen == false) {
      this.menuOpen = true;
      myMenu.style.top = "50px";
      this.menuBtn = "close"
    }
    else {
      menu_items[0].style.animation = "sliderOut 300ms"
      setTimeout(() => {
        myMenu.style.top = "-100vh"
        this.menuOpen = false;
        menu_items[0].style.animation = "sliderIn 300ms";
        this.menuBtn = "menu"
      }, 299);
    }
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
      componentProps: {

      }
    })
    return await modal.present();
  }
}
