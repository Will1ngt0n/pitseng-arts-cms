import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements  CanActivate{ 
  constructor(
 
    private router: Router){}
  canActivate(
    next:ActivatedRouteSnapshot,
    state:RouterStateSnapshot
  ):boolean | Observable<boolean> |Promise<boolean>{
    return new Promise ((resolve,reject)=>{
      firebase.auth().onAuthStateChanged((user:firebase.User)=>{
        if (user) {
          resolve(true);
           } else{
            console.log('User is  not logged in');
            this.router.navigate(['/sign-in']);
            resolve(false);
          }
          // Partner is everything okay?
      });
     
      });
   
  }
  
  // canActivate() : Promise <boolean>{
  //   return new Promise( (resolve, reject) => {
  //     console.log('runnig');
      
  //     try {
  //       console.log(firebase.auth().currentUser);
  //       firebase.auth().currentUser.uid

        
  //       console.log(true);
        
  //       resolve (true)
  //     } catch (error) {
  //       console.log(false);
  //       this.router.navigate(['sign-in'])
  //       resolve (false)
  //     }

  //   })
  // }
}
