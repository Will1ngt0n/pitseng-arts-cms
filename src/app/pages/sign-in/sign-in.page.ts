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
    public modalController: ModalController,
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
  email = "";
  message: any = "";
  loader: boolean = true;
  ionViewWillEnter() {
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }

  ngOnInit() {

  }
  async loginAdmin(){

    this.loading = await this.loadingCtrl.create();
    await this.loading.present();

    firebase.auth().signInWithEmailAndPassword((this.email), (this.password)).then(user => {
      this.loading.dismiss().then(res => {

        this.db.collection('admins').doc(firebase.auth().currentUser.uid).get().then(res => {
          if (res.exists) {
            this.router.navigateByUrl('/landing')

          } else {
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
  password;
  inputs: boolean = true;
  validateInputs() {
    console.log(this.password);
    if (this.password.length > 6) {
      this.inputs = false
    }
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
      component: ProfilePage,
      cssClass: 'profile',


    });
    return await modal.present();
  }




  googleSignin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().getRedirectResult().then((result) => {
      if (!result.user) {

        firebase.auth().signInWithRedirect(provider);
      } else {
        this.router.navigateByUrl('landing');

      }
    }).catch(function (error) {
      console.log(error)
      // ...
    });

  }

  presentErrorAlert() {

  }




  // added email and password validations from here

  errorMessage;
  emailValid: boolean = false;
  validateEmail() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // alert("email correct")
    return re.test(this.email);
  }

  submitDetails() {
    if (this.email == "" || this.email == " ") {
      this.errorMessage = "Please enter a valid email before you continue."
      this.presentAlert();

    }
    else {
      console.log("logging in");
      this.validateEmail();

      var result = ("#result");
      result;

      if (this.validateEmail()) {
        this.emailValid = true;
        this.loginAdmin();
        
      } else {
        this.errorMessage = "Please enter a valid email address.";
        this.presentAlert()
        this.emailValid = false;
      }

      return false;
      this.newMethod();
    }


  }

  private newMethod() {
    alert("email valid: " + this.emailValid);
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Hold on.',
      // subHeader: 'Subtitle',
      message: this.errorMessage,
      buttons: [
        {
          text: 'Okay',
          handler: (blah) => {
            this.errorMessage = '';
          }
        }
      ]
    });

    await alert.present();
  }

}
