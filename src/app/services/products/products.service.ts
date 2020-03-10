import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
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
        created: new Date().getTime(),
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
      }).then( () => {
        let type2 = ((backViewImage.type).split('/'))[1]
        firebase.storage().ref('products/'+productID + 'back' + '.' + type2).put(backViewImage).then(data => {
          data.ref.getDownloadURL().then(url => {
            backViewLink = url
          })
        }).then( () => {
          let type3 = ((sideViewImage.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'side' + '.' + type3).put(sideViewImage).then(data => {
            data.ref.getDownloadURL().then(url => {
              sideViewLink = url
            })
          }).then( () => {
          
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
      })
    })
  })
}

  getProducts(){
    return firebase.firestore().collection('Products').get().then(res => {
      let data : Array<any> = []
      for(let key in res.docs){
        console.log(key, res.docs[key].id);
        
        data.push({productID: res.docs[key].id, data: res.docs[key].data()})
      }
      console.log(data);
      
      return data
    })
  }
  getSales(){
    return firebase.firestore().collection('Sales').get().then(res => {
      let data : Array<any> = []
      for(let key in res.docs){
        data.push({orderID: res.docs[key].id, data: res.docs[key].data()})
      }
      return data
    })
  }
  deleteSpecialsItem(productID){
    return firebase.firestore().collection('Sales').doc(productID).delete().then(res => {
      return null
    })
  }
  getPendingOrders(){
    return firebase.firestore().collection('orders').get().then(res => {
      let data : Array<any> = []
      for(let key in res.docs){
        data.push({orderID: res.docs[key].id, data: res.docs[key].data()})
      }
      return data
    })
  }
  getClosedOrders(){
    return firebase.firestore().collection('orderHistory').get().then(res => {
      let data : Array<any> = []
      for(let key in res.docs){
        data.push({orderID: res.docs[key].id, data: res.docs[key].data()})
      }
      return data
    })
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
        modified: new Date().getTime()
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
  deleteProoduct(productID){
    return firebase.firestore().collection('Products').doc(productID).delete().then(res => {

    })
  }

  getOrdersList(query){
    console.log(query);
    return firebase.firestore().collection(query).get().then(res  => {
      let data : Array<any> = []
      if(res.docs.length > 0){
        for(let key in res.docs){
          data.push({orderID: res.docs[key].id, data: res.docs[key].data(), location: query})
        }
        this.getUserProfile(data).then((res : any) => {
          data = res
        })
      }
      return data
    })
  }
  getUserProfile(array){
    return new Promise( (resolve, reject) => {
      firebase.firestore().collection('UserProfile').get().then(res => {
        for(let key in array){
          for(let i in res.docs){
            if(array[key].data.userID === res.docs[i].id){
              array[key].user = res.docs[i].data()
            }
          }
        }
      })
      resolve(array)
    })
  }
  ////everything FAQ related

  getQuestions(){
    return firebase.firestore().collection('Questions').get().then(res => {
      let data : Array<any> = []
      for(let key in res.docs){
        data.push({data: res.docs[key].data(), questionID: res.docs[key].id})
      }
      return data
    })
  }
  getFAQs(){
    return firebase.firestore().collection('FAQs').get().then(res => {
      let data : Array<any> = []
      for(let key in res.docs){
        data.push({data: res.docs[key].data(), questionID: res.docs[key].id})
      }
      return data
    })
  }
}