import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

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
  constructor( public toastCtrl: ToastController
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
    this.active = i;
    this.userMessage.mail = m.email;
    this.userMessage.name = m.name;
    this.userMessage.subject = m.subject
    this.userMessage.date =m.date

    console.log('year',this. message);
   }

   sendReply(){
     this.db.collection("AdminReply").add({
      // date: moment().format('MMMM Do YYYY, h:mm:ss a'),
          message: this.msg,
          email : this.userMessage.mail,
          nameOfClient: this.userMessage.name,
          subject :this.userMessage.subject,
     }).then(() => {
      this.toastController('Message Sent!')
   }).catch(err => {
            console.error(err);
   });
      this.msg = '';
     console.log('ss',this.msg);
     
   }
   async toastController(message) {
    let toast = await this.toastCtrl.create({ message: message, duration: 2000 });
    return toast.present();
}
 
}
