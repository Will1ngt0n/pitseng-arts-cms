import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.page.html',
  styleUrls: ['./queries.page.scss'],
})
export class QueriesPage implements OnInit {

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
    email: firebase.auth().currentUser.email
  }
  msg 
  subject
  constructor( public toastCtrl: ToastController
  ) { }

  ngOnInit() {
   
    this.getMessage()
    setTimeout(() => {
      // this.showList(0, this.message[0]);
      console.log(firebase.auth().currentUser.email);
      
      console.log('index', this.userMessage )
    }, 1000);
  }
  //   this.userMessage.mail = m.email; this.selectedValueIndex = p
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
