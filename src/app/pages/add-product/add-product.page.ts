import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  frontViewImage
  sideViewImage
  backViewImage
  topViewImage
  productName
  productPrice
  categoryOptions : Array<any> = []
  constructor(private productsService : ProductsService) {
    this.categoryOptions = ['Select Category', 'Deco', 'Lamps', 'Vases', 'Pottery']
  }

  ngOnInit() {
  }
  addProduct(){
    
  }
  changeCategory(event){
    console.log(event);
    
  }

}
