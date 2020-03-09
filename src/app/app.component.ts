import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router,NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  showHead: boolean = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private routes: Router
  ) {
    this.initializeApp();
    // this.getAuth();
  }
//   ionViewWillEnter(){
//     this.initializeApp();
// this.getAuth(); 
//  // on route change to '/login', set the variable showHead to false
//  this.routes.events.forEach((event) => {
//   if (event instanceof NavigationStart) {
//     if (event['url'] == '/login') {
//       this.showHead = false;
//     } else if ( event['url'] == '/pro' || event['url'] == '/details'||
//     event['url'] == '/categorylist' || event['url'] == '/aobut-us' || event['url'] == '/quries' ||
//     event['url'] == '/spacials' 

//     ){
//       // console.log("NU")
//       this.showHead = true;
//     }
//   }
// });
// }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  getAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        this.routes.navigateByUrl('/sign-in')
      }
    })
  }
}
