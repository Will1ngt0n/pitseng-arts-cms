import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
  technicalQuestions : Array<any> = []
  orderQuestions : Array<any> = []
  productQuestions : Array<any> = []
  returnsQuestions : Array<any> = []
  refundsQuestions : Array<any> = []
  constructor(private productsService : ProductsService) { }

  ngOnInit() {
    console.log('treew');
    
    this.getFAQs()
  }
  getQuestions(){
    return this.productsService.getQuestions().then(res => {

    })
  }
  getFAQs(){
    return this.productsService.getFAQs().then(res => {
      this.technicalQuestions = []
      this.orderQuestions = []
      for(let key in res){
        let category = res[key].data.category
        if(category === 'Technical'){
          this.technicalQuestions.push(res[key])
        }else if(category === 'Orders'){
          this.orderQuestions.push(res[key])
        }else if(category === 'Product'){
          this.productQuestions.push(res[key])
        }else if(category === 'Returns'){
          this.returnsQuestions.push(res[key])
        }else{
          this.refundsQuestions.push(res[key])
        }
      }
      console.log(this.technicalQuestions);
      console.log(this.orderQuestions);
      console.log(this.productQuestions);
      console.log(this.returnsQuestions);
      console.log(this.refundsQuestions);
    })
  }
}
