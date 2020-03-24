import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  frontViewImage : File; frontViewLink = ''
  sideViewImage : File; sideViewLink = ''
  backViewImage : File; backViewLink = ''
  topViewImage : File; topViewLink = ''
  productName
  productPrice
  categoryOptions : Array<any> = []
  productCategory : string = 'Select Category'
  productDescription
  productQuantity : number = 1
  productSizes : Array<string> = []
  item : string = 'item'
  buttonActive: boolean = true;
  formValid : boolean = false

  @ViewChild('checkboxS', { static: true }) checkboxS: ElementRef; blnCheckS : boolean
  @ViewChild('checkboxM', { static: true }) checkboxM: ElementRef; blnCheckM : boolean
  @ViewChild('checkboxL', { static: true }) checkboxL: ElementRef; blnCheckL : boolean
  @ViewChild('departmentCombo', { static: true }) departmentCombo: ElementRef;
  constructor(private productsService : ProductsService, private loadingCtrl: LoadingController, private alertController: AlertController) {
    this.categoryOptions = ['Select Category', 'Deco', 'Lamps', 'Vases', 'Pottery']
  }

  ngOnInit() {
  }
  addProduct(){
    // return this.productsService.addProduct(this.frontViewImage, this.sideViewImage, this.backViewImage, this.topViewImage, this.productName, this.productPrice, this.productCategory, this.productDescription, this.productQuantity, this.productSizes).then(result => {

    // })
  }
  validatePrice(event){
    if(!(event.target.value > 0)){
      event.target.value = 1
      this.productPrice = 1
    }
    if(this.productPrice > 99999){
      this.productPrice = 99999
    }
  }
  changeCategory(event){
    console.log(event);
    this.productCategory = event.target.value
    this.validateForm()
  }
  picture3
  changeFrontImage(event, name){
    let picture = <File>event.target.files[0]
    this.frontViewImage = picture
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.frontViewLink = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    this.validateForm()
  }

  changeSideImage(event, name){
    let picture = <File>event.target.files[0]
    this.sideViewImage = picture
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.sideViewLink = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    this.validateForm()
  }

  changeBackImage(event, name){
    let picture = <File>event.target.files[0]
    this.backViewImage = picture
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.backViewLink = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    this.validateForm()
  }
  changeTopImage(event, name){
    let picture = <File>event.target.files[0]
    this.topViewImage = picture
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.topViewLink = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    this.validateForm()
  }

  changeProductSize(event, size){
    if (event.target.checked === true) {
      this.productSizes.push(size)
      console.log(this.productSizes);
    } else if (event.target.checked === false) {
      let index = this.productSizes.indexOf(size)
      console.log(index);
      this.productSizes.splice(index, 1)
      console.log(this.productSizes);
    }
    this.validateForm()
  }
  enableItem(){
    this.item ='item'
    this.validateForm()
  }
  enablePack(){
    this.item = 'package'
    this.validateForm()
  }
  validateQty(event){
    if(!(event.target.value > 1)){
      this.productQuantity = 1
      event.target.value = 1
      console.log(this.productQuantity);
      
    }else if(event.target.value > 100000){
      this.productQuantity = 100000
    }
  }
  subtractQty(){
    if(this.productQuantity > 1){
      this.productQuantity = this.productQuantity - 1
    }else{}
    this.validateForm()
  }
  addQty(){
    if(this.productQuantity < 100000){
      this.productQuantity = this.productQuantity + 1
    }else{}
    this.validateForm()
  }
  validateForm(){
    if(this.productCategory === 'Select Category' || this.productQuantity === 0 || this.frontViewImage === undefined || this.sideViewImage === undefined || this.backViewImage === undefined || this.topViewImage === undefined || this.productName === '' || this.productPrice === '' || this.productCategory === '' || this.productDescription === '' || this.productSizes.length === 0){
      this.formValid = false
      console.log(this.formValid);
      
    } else {
      this.formValid = true
      console.log('this form is valid');
      
    }
  }
  saveProduct(){
    this.presentLoading()
    console.log(this.frontViewImage, this.sideViewImage, this.backViewImage, this.topViewImage, this.productName, this.productPrice, this.productCategory, this.productDescription, this.productQuantity, this.productSizes);
    return this.productsService.addProduct(this.frontViewImage, this.sideViewImage, this.backViewImage, this.topViewImage, this.productName, this.productPrice, this.productCategory, this.productDescription, this.productQuantity, this.productSizes, this.item).then(result => {
      console.log(result);
      
      if(result === 'success'){
        this.clearForm()
        this.loadingCtrl.dismiss()
        this.productAlert('Item has been successfully added', 'Success')
      }else{

      }
    })
  }
 clearForm(){
  this.frontViewImage = undefined; this.frontViewLink = ''
  this.sideViewImage = undefined; this.sideViewLink = ''
  this.backViewImage = undefined; this.backViewLink = ''
  this.topViewImage = undefined; this.topViewLink = ''
  this.productName = ''
  this.productPrice = ''
  this.productCategory = 'Select Category'
  this.productDescription = ''
  this.productQuantity = 1
  this.productSizes = []
  this.item = 'item'
  
  this.checkboxM.nativeElement.checked = false
  this.checkboxS.nativeElement.checked = false
  this.checkboxL.nativeElement.checked = false
  this.departmentCombo.nativeElement.selectedIndex = 0
  this.formValid = false
  
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
  switchView(state) {
    switch (state) {
      case 'd':
        this.buttonActive = true;
        console.log(this.item);
        
        
        break;
      case 'c':
        this.buttonActive = false;
        console.log(this.item);
        
        break;
    }
  }
}
