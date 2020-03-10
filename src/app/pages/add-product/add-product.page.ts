import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  frontViewImage : File
  sideViewImage : File
  backViewImage : File
  topViewImage : File
  productName
  productPrice
  categoryOptions : Array<any> = []
  productCategory
  productDescription
  productQuantity : number = 0
  productSizes : Array<string> = []
  item : string
  buttonActive: boolean = true;
  constructor(private productsService : ProductsService) {
    this.categoryOptions = ['Select Category', 'Deco', 'Lamps', 'Vases', 'Pottery']
    this.item = ''
  }

  ngOnInit() {
  }
  addProduct(){
    // return this.productsService.addProduct(this.frontViewImage, this.sideViewImage, this.backViewImage, this.topViewImage, this.productName, this.productPrice, this.productCategory, this.productDescription, this.productQuantity, this.productSizes).then(result => {

    // })
  }
  changeCategory(event){
    console.log(event);
    this.productCategory = event.target.value
  }
  changeImage(event, parameter){
    console.log('yadaya');
    //this.frontViewImage = <File>event.target.files[0]
    console.log(this.frontViewImage);
    
    console.log(event.target.files[0]);
    let picture : File = <File>event.target.files[0]
    if(parameter === this.frontViewImage){
      console.log('front view');
      this.frontViewImage = picture
    }else if(parameter === this.sideViewImage){
      console.log('side view');
      this.sideViewImage = picture
    }else if(parameter === this.backViewImage){
      console.log('back view');
      this.backViewImage = picture
    }else{
      console.log('top view');
      this.topViewImage = picture
    }
    console.log(this.frontViewImage);
    let type = ((this.frontViewImage.type).split('/'))[1]
    console.log(type);
    
    console.log(this.backViewImage);
    console.log(this.sideViewImage);
    console.log(this.topViewImage);
    
    
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
  }
  enableItem(){
    this.item ='item'
  }
  enablePack(){
    this.item = 'per package'
  }
  subtractQty(){
    if(this.productQuantity > 0){
      this.productQuantity = this.productQuantity - 1
    }
  }
  addQty(){
    if(this.productQuantity < 10000){
      this.productQuantity = this.productQuantity + 1
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
  
        break;
      case 'c':
        this.buttonActive = false;

        break;
    }
  }
}
