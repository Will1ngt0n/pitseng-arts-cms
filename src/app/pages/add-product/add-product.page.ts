import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  frontViewImage : File; frontViewLink
  sideViewImage : File; sideViewLink
  backViewImage : File; backViewLink
  topViewImage : File; topViewLink
  productName
  productPrice
  categoryOptions : Array<any> = []
  productCategory
  productDescription
  productQuantity : number = 1
  productSizes : Array<string> = []
  item : string = 'item'
  buttonActive: boolean = true;
  formValid : boolean = false
  constructor(private productsService : ProductsService) {
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
  changeImage(event, parameter){
    console.log('yadaya');
    //this.frontViewImage = <File>event.target.files[0]
    console.log(this.frontViewImage);
    
    console.log(event.target.files[0]);
    let picture : File = <File>event.target.files[0]

    ////
    // let reader = new FileReader();


    //console.log(reader);
    //console.log(this.picture3);
    
    ////


    if(parameter === this.frontViewImage){
      console.log('front view');
      this.frontViewImage = picture
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.frontViewLink = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }else if(parameter === this.sideViewImage){
      console.log('side view');
      this.sideViewImage = picture
      let reader2 = new FileReader();
      reader2.onload = (event: any) => {
        this.sideViewLink = event.target.result;
      };
      reader2.readAsDataURL(event.target.files[0]);
    }else if(parameter === this.backViewImage){
      console.log('back view');
      this.backViewImage = picture
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.backViewLink = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }else{
      console.log('top view');
      this.topViewImage = picture
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.topViewLink = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    //reader.readAsDataURL(event.target.files[0]);
    console.log(this.frontViewImage);







    console.log(this.topViewLink);
    console.log(this.topViewImage);
    
    console.log(this.sideViewLink);
    console.log(this.sideViewImage);
    
    console.log(this.backViewLink);
    console.log(this.backViewImage);
    
    console.log(this.frontViewLink);
    console.log(this.frontViewImage);

    ///////


    /////
    let type = ((this.frontViewImage.type).split('/'))[1]
    console.log(type);
    
    console.log(this.backViewImage);
    console.log(this.sideViewImage);
    console.log(this.topViewImage);
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
    if(this.productQuantity === 0 || this.frontViewImage === undefined || this.sideViewImage === undefined || this.backViewImage === undefined || this.topViewImage === undefined || this.productName === '' || this.productPrice === '' || this.productCategory === '' || this.productDescription === '' || this.productSizes.length === 0){
      this.formValid = false
      console.log(this.formValid);
      
    } else {
      this.formValid = true
      console.log('this form is valid');
      
    }
  }
  saveProduct(){
    console.log(this.frontViewImage, this.sideViewImage, this.backViewImage, this.topViewImage, this.productName, this.productPrice, this.productCategory, this.productDescription, this.productQuantity, this.productSizes);
    return this.productsService.addProduct(this.frontViewImage, this.sideViewImage, this.backViewImage, this.topViewImage, this.productName, this.productPrice, this.productCategory, this.productDescription, this.productQuantity, this.productSizes, this.item).then(result => {

    })
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
