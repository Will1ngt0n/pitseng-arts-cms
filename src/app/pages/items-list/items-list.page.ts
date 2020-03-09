import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase'
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {
  products : Array<any> = []
  constructor(private activatedRoute: ActivatedRoute, private router : Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(result => {
      console.log(result);
      let parameter = result['key']
      console.log(parameter);
      if(parameter === 'inventory'){
        this.getInventory()
      }else{
        this.getCategoryProducts(parameter)
      }

    })
  }
  getInventory(){
    return firebase.firestore().collection('Products').onSnapshot(res => {
      this.products = []
      for(let key in res.docs){
        this.products.push({productID: res.docs[key].id, data: res.docs[key].data()})
      }
      console.log(this.products);
      
    })
  }
  getCategoryProducts(parameter){
    return firebase.firestore().collection('Products').where('category', '==', parameter).onSnapshot(res => {
      this.products = []
      for(let key in res.docs){
        this.products.push({productID: res.docs[key].id, data: res.docs[key].data()})
      }
      console.log(this.products);
      
    })
  }
  viewDetails(item){
    console.log(item);
    this.router.navigate(['details', item.productID])
    
  }
}
