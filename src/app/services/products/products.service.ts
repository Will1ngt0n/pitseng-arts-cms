import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import * as moment from 'moment'
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
        timesOrdered: 0,
        price: Number(productPrice),
        category: productCategory,
        description: productDescription,
        quantity: Number(productQuantity),
        sizes: productSizes,
        item: item,
        created: new Date().getTime(),
        salePrice: Number(productPrice),
        onSale: false,
        avgRating: 0,
        productCode: this.autoGenerate(8)
      }).then(res => {
        productID = res.id
        firebase.storage()
      }).then( () => {
      let type = ((mainViewImage.type).split('/'))[1]
      firebase.storage().ref('products/'+productID + 'main').put(mainViewImage).then(data => {
        data.ref.getDownloadURL().then(url => {
          mainViewLink = url
        })
      }).then( () => {
        let type2 = ((backViewImage.type).split('/'))[1]
        firebase.storage().ref('products/'+productID + 'back').put(backViewImage).then(data => {
          data.ref.getDownloadURL().then(url => {
            backViewLink = url
          })
        
        }).then( () => {
          let type3 = ((sideViewImage.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'side').put(sideViewImage).then(data => {
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
            firebase.storage().ref('products/'+productID + 'top').put(topViewImage).then(data => {
              data.ref.getDownloadURL().then(url => {
                topViewLink = url
                // console.log('inside fourth picture');
                // console.log(mainViewLink);
                // console.log(backViewLink);
                // console.log(sideViewLink);
                // console.log(topViewLink);
                firebase.firestore().collection('Products').doc(productID).update({
                  image : mainViewLink,
                  imageBack : backViewLink,
                  imageSide : sideViewLink,
                  imageTop: topViewLink
                }).then( () => {
                  resolve('success')
                })

              })
            })

          })
        
        })
      })
    })
  })
}

  getProducts(){
    return firebase.firestore().collection('Products').orderBy('created', 'desc').get().then(res => {
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

  getPendingOrders(){
    return firebase.firestore().collection('Order').get().then(res => {
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
    console.log(imageSide, imageBack, imageTop, imageMain);
    
    return new Promise( (resolve, reject) => {
      firebase.firestore().collection('Products').doc(productID).update({
        name: name,
        price: Number(price),
        description: description,
        quantity: Number(quantity),
        sizes: sizes,
        item: item,
        modified: new Date().getTime()
      }).then( () => {
        if(imageSide !== undefined){
          let type = ((imageSide.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'side').put(imageSide).then(data => {
            data.ref.getDownloadURL().then(url => {
              //mainViewLink = url
            })
          }).catch(() => {
            
          })
        }
        if(imageBack !== undefined){
          let type = ((imageBack.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'back').put(imageBack).then(data => {
            data.ref.getDownloadURL().then(url => {
              //mainViewLink = url
            })
          }).catch(() => {
            
          })
        }
        if(imageTop !== undefined){
          let type = ((imageTop.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'main').put(imageTop).then(data => {
            data.ref.getDownloadURL().then(url => {
              //mainViewLink = url
            })
          }).catch(() => {

          })
        }
        if(imageMain !== undefined){
          let type = ((imageMain.type).split('/'))[1]
          firebase.storage().ref('products/'+productID + 'main').put(imageMain).then(data => {
            data.ref.getDownloadURL().then(url => {
              //mainViewLink = url
            })
          }).catch(() => {
            
          })
        }
      }).then( () => {
        return 'success'
      })
      resolve ('success')
    })
  }
  promoteProduct( productDetails, startDate, endDate, percentage, salePrice, productID){
    //console.log(startDate, endDate, percentage, salePrice, productID);
    
    return firebase.firestore().collection('Products').doc(productID).update({
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      percentage: percentage,
      salePrice: Number(salePrice),
      onSale: true
    }).then( () => {
      return 'success'
    })
  }
  removePromo(productDetails){
    return firebase.firestore().collection('Products').doc(productDetails.productID).update({
      onSale: false,
      salePrice: Number(productDetails.data.price),
      startDate: firebase.firestore.FieldValue.delete(),
      endDate: firebase.firestore.FieldValue.delete(),
      percentage: firebase.firestore.FieldValue.delete()
    }).then( () => {
      return 'success'
    })
  }
  deleteProduct(productID){
    return firebase.firestore().collection('Products').doc(productID).delete().then(res => {
      console.log(productID);
      try { firebase.storage().ref('products/').child(productID + 'side').delete() } catch (error) { }
      try { firebase.storage().ref('products/').child(productID + 'back').delete() } catch (error) { }
      try { firebase.storage().ref('products/').child(productID + 'main').delete() } catch (error) { }
      try { firebase.storage().ref('products/').child(productID + 'top').delete() } catch (error) { }
    }).then( () => {
        return 'success'
    })
  }

  //orders
  getOrdersList(query){
    console.log(query);
    return firebase.firestore().collection(query).orderBy('timestamp', 'desc').get().then(res  => {
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

  processOrder(orderID, status){
    console.log(orderID, status);
    return new Promise( (resolve, reject) => {
      if(status === 'processed'){
        return firebase.firestore().collection('Order').doc(orderID).update({
          status : status,
          dateProcessed: new Date().getTime()
        })
      }else if(status === 'ready'){
        return firebase.firestore().collection('Order').doc(orderID).update({
          status : status,
          datePrepared: new Date().getTime()
        })
      }
    })
  }
  
  closeOrder(orderID, status, order, pdfLink){
    return new Promise( (resolve , reject) => {
      let object  = {
        date: new Date().getTime(),
        product: order.data.product,
        status: status,
        totalPrice: order.data.totalPrice,
        userID: order.data.userID
      }
      console.log(orderID)
      console.log(object)
     // orderID = 'false'
        if(status === 'cancelled'){
          return firebase.firestore().collection('orderHistory').doc(orderID).set({
            dateOrdered: order.data.timestamp,
            timestamp: new Date().getTime(),
            product: order.data.product,
            status: status,
            totalPrice: order.data.totalPrice,
            userID: order.data.userID,
            dateClosed: new Date().getTime(),
            pdfLink: pdfLink
          }).then( () => {
            return firebase.firestore().collection('Order').doc(orderID).delete().then(res => {
            
            })
          })
        }else if(status === 'collected' || status === 'delivered'){
          return firebase.firestore().collection('orderHistory').doc(orderID).set({
            dateOrdered: order.data.timestamp,
            timestamp: new Date().getTime(),
            product: order.data.product,
            status: status,
            totalPrice: order.data.totalPrice,
            userID: order.data.userID,
            datePrepared: order.data.datePrepared,
            dateProcessed: order.data.dateProcessed,
            dateClosed: new Date().getTime(),
            pdfLink : pdfLink
          }).then( () => {
            return firebase.firestore().collection('Order').doc(orderID).delete().then(res => {
            
            })
          })
        }
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