import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { resolve } from 'url';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }
  autoGenerate(length){
      var text = " ";
      var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      for( var i=0; i < length; i++ )
          text += charset.charAt(Math.floor(Math.random() * charset.length));
      return text;
    }
  addProduct(mainViewImage, sideViewImage, backViewImage, topViewImage, productName, productPrice, productCategory, productDescription, productQuantity, productSizes, item){
    let productID : string = ''
    let mainViewLink : string
    let backViewLink : string
    let sideViewLink : string
    let topViewLink : string
    return new Promise( (resolve, reject) => {

      return firebase.firestore().collection('Products').add({
        name: productName,
        price: productPrice,
        category: productCategory,
        description: productDescription,
        quantity: productQuantity,
        sizes: productSizes,
        item: item,
        productCode: this.autoGenerate(8)
      }).then(res => {
        productID = res.id
        firebase.storage()
      }).then( () => {
      let type = ((mainViewImage.type).split('/'))[1]
      firebase.storage().ref('products/'+productID + 'main' + '.' + type).put(mainViewImage).then(data => {
        data.ref.getDownloadURL().then(url => {
          mainViewLink = url
        })
      })

      let type2 = ((backViewImage.type).split('/'))[1]
      firebase.storage().ref('products/'+productID + 'back' + '.' + type2).put(backViewImage).then(data => {
        data.ref.getDownloadURL().then(url => {
          backViewLink = url
        })
      })
    

      let type3 = ((sideViewImage.type).split('/'))[1]
      firebase.storage().ref('products/'+productID + 'side' + '.' + type3).put(sideViewImage).then(data => {
        data.ref.getDownloadURL().then(url => {
          sideViewLink = url
        })
      })
      
      console.log('outside fourth picture');
      
      console.log(mainViewLink);
      console.log(backViewLink);
      console.log(sideViewLink);
      console.log(topViewLink);
      
      
      
      let type4 = ((topViewImage.type).split('/'))[1]
      firebase.storage().ref('products/'+productID + 'top' + '.' + type4).put(topViewImage).then(data => {
        data.ref.getDownloadURL().then(url => {
          topViewLink = url
          console.log('inside fourth picture');
          console.log(mainViewLink);
          console.log(backViewLink);
          console.log(sideViewLink);
          console.log(topViewLink);
          firebase.firestore().collection('Products').doc(productID).update({
            image : mainViewLink,
            imageBack : backViewLink,
            imageSide : sideViewLink,
            imageTop: topViewLink
          })
        })
      })
      resolve('success')
    })

  })
}

  getProducts(){
    
  }
  saveEdit(productID, name, price, description, quantity, item, sizes, imageSide, imageBack, imageTop, imageMain){
    return new Promise( (resolve, reject) => {
      return firebase.firestore().collection('Products').doc(productID).update({
        name: name,
        price: price,
        description: description,
        quantity: quantity,
        sizes: sizes,
        item: item,
      }).then( () => {
        if(imageSide !== undefined){
          let type = ((imageSide.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'side' + '.' + type).put(imageSide).then(data => {
            data.ref.getDownloadURL().then(url => {
              //mainViewLink = url
            })
          })
        }
        if(imageBack !== undefined){
          let type = ((imageBack.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'back' + '.' + type).put(imageBack).then(data => {
            data.ref.getDownloadURL().then(url => {
              //mainViewLink = url
            })
          })
        }
        if(imageTop !== undefined){
          let type = ((imageTop.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'main' + '.' + type).put(imageTop).then(data => {
            data.ref.getDownloadURL().then(url => {
              //mainViewLink = url
            })
          })
        }
        if(imageMain !== undefined){
          let type = ((imageMain.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'main' + '.' + type).put(imageMain).then(data => {
            data.ref.getDownloadURL().then(url => {
              //mainViewLink = url
            })
          })
        }
      })
    })
  }
  promoteProduct( productDetails, startDate, endDate, percentage, salePrice){
    return firebase.firestore().collection('Sales').add({
      name: productDetails.data.name,
      price: productDetails.data.price,
      category: productDetails.data.category,
      description: productDetails.data.description,
      quantity: productDetails.data.quantity,
      sizes: productDetails.data.sizes,
      item: productDetails.data.item,
      productCode: productDetails.data.productCode,
      startDate: startDate,
      endDate: endDate,
      percentage: percentage,
      salePrice: salePrice,
      image: productDetails.data.image,
      imageSide: productDetails.data.imageSide,
      imageBack: productDetails.data.imageBack,
      imageTop: productDetails.data.imageTop
    })
  }
}