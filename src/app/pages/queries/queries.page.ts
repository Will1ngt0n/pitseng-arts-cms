import { Component, OnInit } from '@angular/core';
import { ToastController, PopoverController, ModalController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AddProductPage } from '../add-product/add-product.page';
import { ProfilePage } from '../profile/profile.page';
import { CategoriesPopoverComponent } from 'src/app/components/categories-popover/categories-popover.component';
import { FaqsPage } from '../faqs/faqs.page';
@Component({
  selector: 'app-queries',
  templateUrl: './queries.page.html',
  styleUrls: ['./queries.page.scss'],
})
export class QueriesPage implements OnInit {
uid
  db = firebase.firestore();
  message = [];
  myProduct = false;
  active: any;
  userMessage ={
    question: "",
    mail:"",
    name:"",
    subject:"",
    date :""
  }
  admin = {
    uid: '',
    email: ''
  }
  msg 
  subject
  categories = ['Select Category','Technical', 'Orders', 'Product', 'Returns', 'Refunds']
  saveToFAQs : boolean = false
  value = ''
  constructor( public toastCtrl: ToastController,
    private router : Router,
    public popoverController: PopoverController,
    public modalController: ModalController
  ) {
  
   }
  ngOnInit() {
   
    console.log("ssssss ", firebase.auth().currentUser.email);
    
    if(firebase.auth().currentUser) {
      this.admin.email = firebase.auth().currentUser.email;
      this.uid = firebase.auth().currentUser.uid;
     } else {
       console.log('error user not logged in');
       
     }
    this.getMessage()
    setTimeout(() => {
      // this.showList(0, this.message[0]);
      console.log('index', this.userMessage )
    }, 1000);
  }
 
  getMessage(){
   
    this.db.collection('ContactUs').get().then(snapshot => {
      console.log('messges', this.message);
      
      if( this.message = []){
      snapshot.forEach(doc => {
          this.message.push(doc.data());
          console.log('messges', doc.data());
        });
        this.myProduct = true
      }else{
        this.myProduct = false
      }
        
    })
      
  }
  showList(i, m) {
    console.log(i, m);
    
    this.active = i;
    this.userMessage.question = m.message
    this.userMessage.mail = m.email;
    this.userMessage.name = m.name;
    this.userMessage.subject = m.subject
    this.userMessage.date =m.date
    console.log('year',this.userMessage);
   }
   sendReply(){
     this.db.collection("AdminReply").add({
      // date: moment().format('MMMM Do YYYY, h:mm:ss a'),
          message: this.msg,
          email : this.userMessage.mail,
          nameOfClient: this.userMessage.name,
          subject :this.userMessage.subject,
     }).then(() => {
       console.log(this.userMessage.question);
       console.log(this.msg);
       console.log(this.value);
       
       
       this.db.collection('FAQs').add({
         question: this.userMessage.question,
         answer: this.msg,
         category: this.value
       })
      this.toastController('Message Sent!')
      this.msg = '';
      console.log('ss',this.msg);
   }).catch(err => {
            console.error(err);
   });
     
   }
   async toastController(message) {
    let toast = await this.toastCtrl.create({ message: message, duration: 2000 });
    return toast.present();
}
changeFAQsBoolean(event){
  let change = event.target.checked
  this.saveToFAQs = change
  console.log(this.saveToFAQs);
}
changeCategory(event){
  this.value = event.target.value
}
async  openAddProduct(){
  const modal = await this.modalController.create({
    component:AddProductPage,
    cssClass: 'add-product',
    
  
  });
  return await modal.present();
}
navigate(para){
  this.router.navigate([para])
}
openHome(){
  this.router.navigateByUrl('/landing')
}
openQueries(){
  this.router.navigateByUrl('/queries')
}
async openProfile(){
const modal = await this.modalController.create({
  component:ProfilePage,
  cssClass: 'profile',
  
});
return await modal.present();
}
openAbout(){
  this.router.navigateByUrl('/about-us')
}
openAllCategories(){
  this.router.navigateByUrl('/')
}
async Categories(ev) {
  const popover = await this.popoverController.create({
    component:CategoriesPopoverComponent,
    event: ev,
    // cssClass: 'pop-over-style',
    translucent: true,
  });
  return await popover.present();
  
}
async openFAQRS(){
  // this.router.navigateByUrl('/faqs')
const modal = await this.modalController.create({
  component:FaqsPage,
  cssClass: 'profile',
  
});
return await modal.present();
}
 
}
