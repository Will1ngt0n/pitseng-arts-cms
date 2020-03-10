import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-specials',
  templateUrl: './specials.page.html',
  styleUrls: ['./specials.page.scss'],
})
export class SpecialsPage implements OnInit {
  sales : Array<any> = []
  maxPercentage : number = 0
  constructor(private productsService : ProductsService) { }

  ngOnInit() {
    this.getSales()
  }
  getSales(){
    return this.productsService.getSales().then( res => {
      console.log(res);
      this.sales = res
      this.maxPercentage = Math.max(...this.sales.map(o=>o['data'].percentage), this.sales[0]['data'].percentage);
      console.log(this.maxPercentage);
      
    })
  }
}
