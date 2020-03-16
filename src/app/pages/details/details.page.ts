import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase'
import * as moment from 'moment'
import { ProductsService } from 'src/app/services/products/products.service';

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
  @ViewChild('checkboxS', { static: true }) checkboxXS: ElementRef; blnCheckS : boolean
  @ViewChild('checkboxM', { static: true }) checkboxS: ElementRef; blnCheckM : boolean
  @ViewChild('checkboxL', { static: true }) checkboxM: ElementRef; blnCheckL : boolean
  constructor(private activatedRoute : ActivatedRoute, private productsService : ProductsService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(result => {
      console.log(result);
      this.getDetails(result.productID)
      this.today = moment(new Date).format('YYYY-MM-DD')
      console.log(this.today);
      
    })

  }
  getDetails(productID){
    return firebase.firestore().collection('Products').doc(productID).onSnapshot( res => {
      if(res.exists){
        this.productDetails = ({productID: res.id, data: res.data()})
        console.log(this.productDetails);
        this.updateName = res.data().name
        this.productName = res.data().name
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
        try { this.promoSalePrice = (res.data().salePrice).toFixed(2) } catch (error) {  }

        console.log(this.promoSalePrice);
        
        console.log(this.updateSize);
        this.blnCheckM = false; this.blnCheckS = false; this.blnCheckL = false
        console.log(res.data().sizes);
        
        this.availableSizes = (res.data().sizes).join(', ')
        console.log(this.availableSizes);
        
        for(let key in this.updateSize){
          if(this.updateSize[key] === 'S'){
            this.blnCheckS = true
          }else if(this.updateSize[key] === 'M'){
            this.blnCheckM = true
          }else if(this.updateSize[key] === 'L'){
            this.blnCheckL = true
          }
        }
        console.log(this.blnCheckL, this.blnCheckM, this.blnCheckS);
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
  updatePrice : number = 0
  updateSize : Array<any>
  updateQuantity
  updateItem

  promoPercentage : number = 0
  promoSalePrice : number = 0
  promoStartDate
  promoEndDate
  endDateLimit
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
    if(this.promoPercentage < 0){
      this.promoPercentage = 0
    }
    
    if(this.promoSalePrice > this.updatePrice){
      this.promoSalePrice = Number(this.updatePrice.toFixed(2))
    }
    this.validatePromo()
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
    return this.productsService.promoteProduct(this.productDetails, this.promoStartDate, this.promoEndDate, this.promoPercentage, this.promoSalePrice, this.productID).then(res => {

    })
  }
  deleteProduct(){
    return this.productsService.deleteProduct(this.productID).then(res => {

    })
  }
  toggleCombo(value){
    // alert(value);
    this.updateItem = value
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
    console.log(this.updateQuantity);
    
  }
  minusQuantity(){
    this.updateQuantity--
    if(this.updateQuantity < 0){
      this.updateQuantity = 0
    }
    console.log(this.updateQuantity);
  }
  changeSizes(event, size){
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
  changeStartDate(event){
    console.log(event.target.value);
    this.endDateLimit = moment(this.promoStartDate).add('days', 1).format('YYYY-MM-DD')
    let full = new Date(this.promoStartDate).getTime()
    console.log(full);
    let newF  = moment(full).format('YYYY-MM-DD')
    console.log(newF);
    let pro = new Date(newF).getTime()
    console.log(pro);
    let pro2 = moment(pro).format('YYYY-MM-DD')
    console.log(pro2);
    
    //let pic;
    this.validatePromo()
  }
  changeEndDate(event){
    this.validatePromo()
  }
  changeName(event){
    this.validateEdit()
  }
  saveCurrent(event){
    //console.log(this.);
    console.log(this.updatePrice);
    
  }
  changePrice(event){
    //let number = event.target.value
    //console.log(event);
    if(this.updatePrice === null){
      this.price_invalid = true
    }else{
      this.price_invalid = false
    }
    console.log(this.updatePrice);
    
    this.validateEdit()
  }
  changeDescription(event){
    this.validateEdit()
  }
  validatePromo(){
    if(this.promoStartDate === undefined || this.promoEndDate === undefined || this.promoPercentage === undefined){
      this.promo_valid = false
    }else{
      this.promo_valid = true
    }
  }
  validateEdit(){
    if(this.updateName === '' || this.updateDescription === '' || this.updatePrice === 0 || this.updatePrice === null || this.updateSize.length === 0){
      this.save_valid = false
    }else{
      this.save_valid = true
    }
    console.log(this.save_valid);
    
  }
}
