import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';

import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  db = firebase.firestore();
  storage = firebase.storage().ref();
  uid

  profile = {
    image: '',
    name: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    code: '',
    surname: '',
    email: '',

    uid: '',

  }
  uploadprogress = 0;
  errtext = '';
  isuploading = false;
  isuploaded = false;

  isprofile = false;

  admin = {
    uid: '',
    email: ''
  }
  loader: boolean = true;

  constructor(public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private router: Router,
    public modalController: ModalController) {
    if (firebase.auth().currentUser) {
      this.profile.email = firebase.auth().currentUser.email;
      this.uid = firebase.auth().currentUser.uid;
    } else {
      console.log('error user not logged in');

    }


  }
  ionViewWillEnter() {
    setTimeout(() => {
      this.loader = false;
    }, 20000000);
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Got admin', user);
        this.admin.uid = user.uid
        this.admin.email = user.email;
        this.loader = false;
        this.getProfile();
      } else {
        console.log('no admin');

      }
    })
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  // async getImage(image){
  //   let imagetosend = image.item(0);
  //   if (!imagetosend) {
  //     const imgalert = await this.alertCtrl.create({
  //       message: 'Select image to upload',
  //       buttons: [{
  //         text: 'Okay',
  //         role: 'cancel'
  //       }]
  //     });
  //     imgalert.present();
  //   } else {
  //     if (imagetosend.type.split('/')[0] !== 'image') {
  //       const imgalert = await this.alertCtrl.create({
  //         message: 'Unsupported file type.',
  //         buttons: [{
  //           text: 'Okay',
  //           role: 'cancel'
  //         }]
  //       });
  //       imgalert.present();
  //       imagetosend = '';
  //       return;
  //      } else {
  //       const upload = this.storage.child(image.item(0).name).put(imagetosend);

  //       upload.on('state_changed', snapshot => {
  //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         this.uploadprogress = progress;
  //         this.isuploading = true;
  //         if (progress==100){
  //           this.isuploading = false;
  //         } 
  //       }, error => {

  //       }, () => {
  //         upload.snapshot.ref.getDownloadURL().then(downUrl => {this.ngOnInit
  //           this.profile.image = downUrl;
  //           this.uploadprogress = 0;
  //           this.isuploaded = true;
  //         });
  //       });
  //      }
  //   }
  // }
  changeListener(event): void {

    const i = event.target.files[0];
    console.log(i);
    const upload = this.storage.child(i.name).put(i);
    upload.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('upload is: ', progress, '% done.');
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(dwnURL => {
        console.log('File avail at: ', dwnURL);
        this.profile.image = dwnURL;
      });
    });


  }
  createAccount() {
    if (!this.profile.addressLine1 || !this.profile.name || !this.profile.surname || !this.profile.phoneNumber || !this.profile.addressLine2 || !this.profile.city || !this.profile.code) {
      this.errtext = 'Fields should not be empty'
    } else {
      if (!this.profile.image) {
        this.errtext = 'Profile image still uploading or not selected';
      } else {
        this.profile.uid = this.admin.uid;
        this.db.collection('admins').doc(firebase.auth().currentUser.uid).set(this.profile).then(res => {
          console.log('Profile created');

          this.getProfile();
          this.loadingCtrl.dismiss()
        }).catch(error => {
          console.log('Error');
        });
      }
    }
  }
  getProfile() {
    this.db.collection('admins').where('uid', '==', this.admin.uid).get().then(snapshot => {
      if (snapshot.empty) {
        this.isprofile = false;
      } else {
        this.isprofile = true;
        snapshot.forEach(doc => {
          this.profile.addressLine1 = doc.data().addressLine1;
          this.profile.image = doc.data().image;
          this.profile.name = doc.data().name;
          this.profile.surname = doc.data().surname;
          this.profile.phoneNumber = doc.data().phoneNumber;
          this.profile.email = doc.data().email;
          this.profile.addressLine2 = doc.data().addressLine2;
          this.profile.city = doc.data().city;
          this.profile.code = doc.data().code

        })
      }
    })
    ////


    //////
  }
  edit() {
    this.isprofile = false;
  }
  openPro() {
    this.router.navigateByUrl('/landing');
  }
  openProfile() {
    this.router.navigateByUrl('/profile');
  }
  openInvoice() {
    this.router.navigateByUrl('/user-invoices');
  }
  logOut() {
    this.presentAlertConfirm()
  }
  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'You are about to sign out, continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.dismiss();
            firebase.auth().signOut().then(() => {
              // Sign-out successful.
              this.router.navigateByUrl('/sign-in');
            }).catch((error) => {
              // An error happened.
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  profileStatus = "read";
  enableInputs: boolean = true;
  prof = "Profile"
  marginValue = "0 auto";
  editProfile() {
    document.getElementById("theButton")
    this.profileStatus = "write";
    this.enableInputs = false
  }
  submitChanges() {
    this.profileStatus = "read";
    this.enableInputs = true;
    this.createAccount();
    this.presentLoading()

  }
  cancelChanges() {
    this.profileStatus = "read";
    this.enableInputs = true;

  }
}




