import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  categoryOptions : Array<string>
  constructor(private productsService : ProductsService, private router : Router) {
    this.categoryOptions = ['Deco', 'Lamps', 'Vases', 'Pottery']
  }

  ngOnInit() {
  }
  navigateToItemsList(){
     
  }
  getProducts(){
    
  }
  viewItems(item){
    console.log(item);
    this.router.navigate(['items-list', item])
  }
}
