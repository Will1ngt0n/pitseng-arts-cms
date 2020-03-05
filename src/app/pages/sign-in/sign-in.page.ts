import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  db = firebase.firestore();
  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  storage = firebase.storage().ref();
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
   
    private router: Router,
    public modalController:ModalController,
    private formBuilder: FormBuilder,
    // private profileService: ProfileService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }
  email="";
  message: any = "";
  loader: boolean = true;
  ionViewWillEnter() {
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }

  ngOnInit() {
   
  }
  async loginAdmin(loginForm: FormGroup): Promise<void> {

      this.loading = await this.loadingCtrl.create();
      await this.loading.present();

      firebase.auth().signInWithEmailAndPassword(loginForm.get('email').value, loginForm.get('password').value).then(user => {
          this.loading.dismiss().then(res => {
            
            this.db.collection('admins').doc(firebase.auth().currentUser.uid).get().then(res =>{
                          if (res.exists){
                            this.router.navigateByUrl('/home')
                           
                          }else{
                           this.createProfile()
                          }
                        })
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
          });
        }
      );
      this.loader
  }
  forgotpassword(email) {
    firebase.auth().sendPasswordResetEmail(email).then(res => {
      console.log(res);
    });
  }
  // async resetPassword(){
  //   let modal = await this.modalController.create({
  //     component : ResetPasswordPage,
  //     cssClass: 'resetModal'
  //   })
    
  //   return await modal.present();
  //  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  async createProfile() {
    const modal = await this.modalController.create({
      component:ProfilePage,
      cssClass: 'profile',
      
    
    });
    return await modal.present();
  }
  

 
  
  googleSignin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().getRedirectResult().then( (result) => {
      if (!result.user) {
        
        firebase.auth().signInWithRedirect(provider);
      } else {
        this.router.navigateByUrl('home');
        
      }
  }).catch(function (error) {
    console.log(error)
    // ...
  });
    
  }
  

}
