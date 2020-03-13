import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase'
import { resolve } from 'url';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  productDetails : object = {}
  constructor(private activatedRoute : ActivatedRoute, private productsService : ProductsService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(result => {
      console.log(result);
      this.getDetails(result.productID)
    })
  }
  getDetails(productID){
    return firebase.firestore().collection('Products').doc(productID).onSnapshot( res => {
      this.productDetails = ({productID: res.id, data: res.data()})
      console.log(this.productDetails);
      this.updateName = res.data().name
      this.updateDescription = res.data().description
      this.updatePrice = res.data().price
      this.updateSize = res .data().sizes
      this.updateQuantity = res.data().quantity
      this.updateItem = res.data().item
      this.productID = res.id
      this.productCode = res.data().productCode
      this.image = res.data().image
      this.imageBack = res.data().imageBack
      this.imageSide = res.data().imageSide
      this.imageTop = res.data().imageTop
      
    })
  }

  image
  imageSide
  imageBack
  imageTop

  productID
  productCode
  updateName
  updateDescription 
  updatePrice : number
  updateSize : Array<any>
  updateQuantity
  updateItem

  promoPercentage : number
  promoSalePrice : number
  promoStartDate
  promoEndDate

  updateImageSide
  updateImageTop
  updateImageBack
  updateImageMain
  uploadImage(event, image){
    if(image === 'imageSide'){
      this.updateImageSide = event.target.files[0]
    }else if(image === 'imageBack'){
      this.updateImageBack = event.target.files[0]
    }else if(image === 'imageTop'){
      this.updateImageTop = event.target.files[0]
    }else{
      this.updateImageMain = event.target.files[0]
    }
    console.log(this.updateImageSide);
    console.log(this.updateImageTop);
    console.log(this.updateImageBack);
    console.log(this.updateImageMain);
    
  }
  calculateSalePrice(){
    
    if(this.promoPercentage > 99){
      this.promoPercentage = 99 
      
    this.promoSalePrice = this.productDetails['data'].price - this.productDetails['data'].price * this.promoPercentage / 100
    console.log(this.promoSalePrice);
    }
    else{
      
    this.promoSalePrice = this.productDetails['data'].price - this.productDetails['data'].price * this.promoPercentage / 100
    console.log(this.promoSalePrice);
    }
    if(this.promoPercentage < 1){

      this.promoPercentage = 0
    }
    
    if(this.promoSalePrice > this.updatePrice){
      this.promoSalePrice = this.updatePrice
    }
  }
  saveEdit(){
    return this.productsService.saveEdit(this.productID, this.updateName, this.updatePrice, this.updateDescription, this.updateQuantity, this.updateItem, this.updateSize, this.updateImageSide, this.updateImageBack, this.updateImageTop, this.updateImageMain).then( res => {

    })
  }
  // salePrice : number
  // percentage : number
  // endDate
  // startDate
  promoteProduct(){
    return this.productsService.promoteProduct(this.productDetails, this.promoStartDate, this.promoEndDate, this.promoPercentage, this.promoSalePrice).then(res => {

    })
  }
  deleteProduct(productID){
    return this.productsService.deleteProduct(productID).then(res => {

    })
  }
  toggleCombo(value){
    // alert(value);
    let isPack = document.getElementById("perPack");
    let isItem = document.getElementById("perItem");
    if(value == "pack"){
      // selected
      isPack.style.background =  "rgb(124, 124, 124)";
      isPack.style.color = "white";
      // deselected
      isItem.style.background =  "white";
      isItem.style.color = "black"
    }
    else{
      // deselected
      isPack.style.background =  "white";
      isPack.style.color = "black";
      // selected
      isItem.style.background =  "rgb(124, 124, 124)";
      isItem.style.color = "white"
    }
  }
  
  addQuantity(){
    this.updateQuantity++
  }
  minusQuantity(){
    this.updateQuantity--
    if(this.updateQuantity < 0){
      this.updateQuantity = 0
    }
  }
}
