import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';
import * as firebase from 'firebase'
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PrivateService } from 'src/app/services/private-service/private.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  dbUser = firebase.firestore().collection('UserProfile');
  dbProfile = firebase.firestore().collection('admins');
  dbHistory = firebase.firestore().collection('orderHistory');
   uid = firebase.auth().currentUser.uid;
   //uid= ''
  userUid;
  user
  purchaseDate
  letterObj = {
    to: '',
    from: '',
    text: '' 
  };
  profile = {
    image: '',
    name: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    code: '',
  email: firebase.auth().currentUser.email,
  uid: firebase.auth().currentUser.uid,

  }
  Userprofile = {
   
    name: '',
    number:'',
    address: '',
   
    uid: '',
    
  }
  dateOrdered
  pdfObj = null;
  pdfLink :any;
  products : Array<any> = []
  order = {}
  status : string = ''
  price : number = 0
  collection : string = ''
  item  
  orderID : string = ''
  fullOrder : object = {}
  userDetails : object = {}
  res 
  key: string;
  selectedItem 
  constructor(private activatedRoute : ActivatedRoute, private productsService : ProductsService, private loc : Location, private route : Router, private modalController: ModalController, private privateService : PrivateService) { }
  @Input() parameter : object;
  ngOnInit() {
    console.log(this.parameter);
      console.log(this.parameter);
      try {
        // console.log(JSON.parse(this.parameter.object));
        let parameters = this.parameter
console.log(this.parameter);
        this.item = this.parameter
        //this.getOrderDetails(this.item['key'])
        //let currentLoc = (this.loc['_platformStrategy']['_platformLocation'].location.origin);
        //let path = (this.loc['_platformStrategy']['_platformLocation'].location.pathname)
        let orderID = parameters['orderID']
        this.orderID = orderID
        console.log(this.orderID);
        
        this.products = parameters['data'].product
        console.log(this.products);
        
       this.selectedItem = Object(this.products[0])
        this.order = parameters
        console.log(orderID);
        this.collection = parameters['location']
        this.userDetails = parameters['user']
       // console.log(currentLoc, path);
        // this.loc.replaceState(path+'/'+orderID)
        this.orderDetailsSnap(parameters['location'], orderID)
      } catch (error) {
        this.route.navigate(['landing'])
      }
      this.getProfile()
    // this.getClientInfo()
    
  }
//
orderDetailsSnap(parameter, orderID){
  console.log(parameter);
  return firebase.firestore().collection(parameter).doc(orderID).onSnapshot(res => {
    console.log(res.exists);
    if(res.exists){
      this.status = res.data().status
      console.log(this.status);
      this.item['data'] = res.data()
      this.fullOrder = {orderID: res.id, data: res.data(), user: this.userDetails}
      console.log(this.item);
      this.products = this.item['data'].product
      console.log(this.products);
  }else if (!res.exists && parameter ==='Order'){
    this.collection = 'orderHistory'
    this.item['location'] = 'orderHistory'
    this.orderDetailsSnap('orderHistory', orderID)
  }else{
    console.log('item has been deleted from history');
    
  }
  

  })
}
viewItem(item){
  this.selectedItem = item
  console.log(this.selectedItem);
}
processOrder(status){
  return this.productsService.processOrder(this.orderID, status).then(res => {
    
  })
}
closeOrder(status, pdfLink){
  return this.productsService.closeOrder(this.item['orderID'], status, this.fullOrder, pdfLink).then(res => {
    console.log(res);
    
  })
}

// using this variable as a temporary set, please replace with correct order status variable
tempStatus = "received";
cancelOrder(){
  console.log("cancel clicked");
  this.tempStatus = "cancelled";
  //console.log(this.item['data'].deliveryType);
  this.closeOrder('cancelled', null)
  document.getElementById("one").style.background = "red";
  document.getElementById("one").style.color = "white";

  document.getElementById("two").style.background = "red";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "red";
  document.getElementById("three").style.color = "white";

  document.getElementById("four").style.background = "red";
  document.getElementById("four").style.color = "white";
}
approveOrder(){
  console.log("clicked");
  this.tempStatus = "approved";
  this.processOrder('processed')

  document.getElementById("two").style.background = "green";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "transparent";
  document.getElementById("three").style.color = "black";

  document.getElementById("four").style.background = "transparent";
  document.getElementById("four").style.color = "black";
}
prepareOrder(){
  console.log("clicked");
  this.tempStatus = "prepared";
  this.processOrder('ready')
  

  document.getElementById("two").style.background = "green";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "green";
  document.getElementById("three").style.color = "white";

  document.getElementById("four").style.background = "transparent";
  document.getElementById("four").style.color = "black";

}
concludeOrder(){
  console.log("clicked");
  this.tempStatus = "concluded";
  console.log(this.item);
  
  this.goToPDF();
console.log(this.item['data'].deliveryType);

  

  document.getElementById("two").style.background = "green";
  document.getElementById("two").style.color = "white";

  document.getElementById("three").style.background = "green";
  document.getElementById("three").style.color = "white";

  document.getElementById("four").style.background = "green";
  document.getElementById("four").style.color = "white";
 
}
//profile for Admin
getProfile() {
  this.dbProfile.doc(this.uid).onSnapshot((res)=>{
  this.profile.phoneNumber = res.data().phoneNumber;
  this.profile.addressLine1 = res.data().addressLine1;
  this.profile.addressLine2 =res.data().addressLine2;
  this.profile.city =res .data().city;
  this.profile.code = res.data().code;
 })
}

goToPDF(){
  console.log(new Date(this.item['data'].timestamp));
  let date = new Date(this.item['data'].timestamp)
  let dates = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
  let name = [];
  let quantity = [];
  let cost = [];
  let items = this.products.map((item) => {
    //console.log('Extras in table...', item);
    if (this.products.length >= 0) {

      return [item.product_name, item.quantity, 'R' + item.cost + '.00'];
    } else {
      return ['*********', 0, 'R0.00']
    }
  });
  this.products.forEach((item) => {
    name.push(item.product_name);
    cost.push(item.cost);
    quantity.push(item.quantity);
   
  
  })
 
  var docDefinition = {
    watermark: { text: 'Pitseng Arts and Crafts', color: '#000', opacity: 0.1, bold: true, italics: false },
    content: [
      {
        canvas: [
            {
                type: 'rect',
                x: 0,
                y: 0,
                w: 600,
                h: 150,
                r: 0,
              
                color: '#ebcebf'
            }
                           ]
          },
      {
        alignment: 'justify',
        widths: ["50%", "50%"],
        columns: [
          { text: '', style: 'header', color: "#000", bold: true, alignment: "center", margin: [ 5, 2, 10, 20 ],  absolutePosition: { x: -100, y: 70 } },
          {
            image: this.privateService.getPictureLink(),
            fit: [100, 100], alignment: "right", margin:[ 0, 0 , 30, 0 ], absolutePosition: { x: 30, y: 30 }, width: 20,
          },
        ]
      },
      { text: this.letterObj.text, style: 'story', margin: [ 5, 2, 10, 10] },
    
      { text: 'Pitseng Arts and Crafts', style: 'subheader',fontFamily: 'Roboto', fontSize: 12, absolutePosition: { x: 30, y: 40 }},
      {text: this.profile.addressLine1, fontSize: 11, absolutePosition: { x: 30, y: 60 }},
      {text: this.profile.addressLine2, fontSize: 11, absolutePosition: { x: 30, y: 70 }},
      {text: this.profile.city, fontSize: 11, absolutePosition: { x: 30, y: 80 }},
      {text: this.profile.code, fontSize: 11, absolutePosition: { x: 30, y: 90 }},
      {text: this.profile.phoneNumber, fontSize: 11, absolutePosition: { x: 30, y: 120 }},
     


      // { text: 'Client Info', style: 'subheader',fontFamily: 'Roboto', fontSize: 11,},
      // this.profile.name,
      // this.profile.address,
      //  this.profile.phoneNumber,

      {
        columns: [
            {   
                text: '',
            },
            [
                {
                    text: '',
                    alignment: 'right' // Aligns 'Column 2' text to right
                },
                {
                    columns: [
                        {
                            text:'',
                            width: '*'
                        },
                        {
                          layout:  {

                                        fillColor: function (rowIndex) {
                            
                                          return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                                        },
                                      
                                        hLineColor: function () {
                                          return '#ddd';
                                        },
                                        vLineColor: function () {
                                          return '#ddd';
                                        },
                                  
                                      },
                          style: 'invoice',
                            table: {
                                body: [
                                    ['Invoice No:', this.orderID ],
                                    [' PurchaseDate:', dates],
                                    ['Customer Name:',  this.item['user'].name],
                                ]
                            }, 
                            alignment: 'right', // Optional, for body texts
                            width: 'auto' // Changes width of the table
                        }
                    ]
                }
            ]
        ]
    },
{ text: 'Order Status: Delivered', style: 'story', margin: [30, 10, 10, 5  ], color: "gray", italic: true, alignment: "left", fontFamily: 'Roboto', fontSize: 13, },
      {
        style: 'itemsTable',
        table: {
            widths: [100, '*', 200, '*'], body: [
                [  
                    { text: 'Name', style: 'itemsTableHeader' },
                    { text: 'Quantity', style: 'itemsTableHeader' },
                    { text: 'Price', style: 'itemsTableHeader' },
                    
                    
                ]
            ].concat(items)
         }, 
         layout:  {

                      fillColor: function (rowIndex) {
          
                        return (rowIndex === 0) ? '#CCCCCC' : null;
                      },
                    
                      hLineColor: function () {
                        return '#333';
                      },
                      vLineColor: function () {
                        return '#333';
                      },
                
                    }
    },
    {
      columns: [
          {   
              text: '',
          },
          [
              {
                  text: '',
                  alignment: 'right' // Aligns 'Column 2' text to right
              },
              {
                  columns: [
                      {
                          text:'',
                          width: '*'
                      },
                      {
                        layout:  {

                                      fillColor: function (rowIndex) {
                          
                                        return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                                      },
                                    
                                      hLineColor: function () {
                                        return '#ddd';
                                      },
                                      vLineColor: function () {
                                        return '#ddd';
                                      },
                                
                                    },
                        style: 'totalsTable',
                          table: {
                              body: [
                                  ['Subtotal:','R'+ this.item['data'].totalPrice+ '.00' ],
                                  ['Total:','R' + this.item['data'].totalPrice + '.00'],
                                  // ['customer name:',  this.Userprofile.name]
                              ]
                          }, 
                          alignment: 'right', // Optional, for body texts
                          width: 'auto' // Changes width of the table
                      }
                  ]
              }
          ]
      ]
  },

 
],
    styles: {
      header: {
        fontFamily: 'Roboto',
        fontSize: 20,
        bold: true,
         color: "#333",
        margin: [0, 0, 0, 30],
        alignment: 'right'
    },
    invoice: {
      fontFamily: 'Roboto',
      fontSize: 12,
      bold: true,
      color: "gray",
      margin: [30, 0, 30, 10],
     
  },
      // header: {
      //   fontSize: 18,
      //   bold: true,
      // },
      subheader: {
        fontFamily: 'Roboto',
        fontSize: 16,
        bold: true,
        margin: [0, 20, 0, 5]
    },
    
      // subheader: {
      //   fontSize: 14,
      //   bold: true,
      //   margin: [0, 15, 0, 0]
      // },
      itemsTable: {
      margin: [30, 0, 30, 10],
    },
    itemsTableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
    },
    totalsTable: {
      fontFamily: 'Roboto',
      color: "gray",
        bold: true,
        margin: [30, 0, 30, 10],
    }
      
    },

    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [0 , 0, 0, 0]

  };
  this.pdfObj = pdfMake.createPdf(docDefinition);
  console.log("End of pdf make ", this.pdfObj);
 this.downloadUrl();
}
downloadUrl() {
  this.pdfObj.getBuffer((buffer) => {
    var blob = new Blob([buffer], { type: 'application/pdf' });
    let date = Date();
    this.orderID=this.key
    let user = firebase.auth().currentUser.email;
    let num = 'Reciept' + Math.floor(Math.random() * 10000000)
    // Save the PDF to the data Directory of our App
    firebase.storage().ref('Receipt/').child(num + '.pdf').put(blob).then((results) => {
      console.log('results url: ', results);
      // results.downloadURL
      firebase.storage().ref('Receipt/').child(results.metadata.name).getDownloadURL().then((url) => {
        // console.log(results);
       // this.pdfDoc = url;
         this.pdfLink = url;
        //  this.saveData();
        this.saveData();
        console.log('pdf link from storage............:', this.pdfLink);
      })
    })
    // this.file.writeFile(this.file.dataDirectory, 'receipt.pdf', blob, { replace: true }).then(fileEntry => {
    // this.fileOpener.open(this.file.dataDirectory + 'receipt.pdf', 'application/pdf');
    // })
  });
  // this.navCtrl.setRoot(SuccessPage);
  this.pdfObj.download();
}
saveData() {
//  console.log("Your key ", this.orderID);
//  this.dbHistory.doc(this.orderID).update({
//     pdfLink : this.pdfLink })
  if(this.item['data'].deliveryType === 'Collection'){
    this.closeOrder('collected', this.pdfLink)
  }else if(this.item['data'].deliveryType === 'Delivery'){
    this.closeOrder('delivered', this.pdfLink)
  }
  }
}
