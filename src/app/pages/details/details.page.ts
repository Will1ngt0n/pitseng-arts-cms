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
    this.promoSalePrice = this.productDetails['data'].price - this.productDetails['data'].price * this.promoPercentage / 100
    console.log(this.promoSalePrice);
    
    
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
}
