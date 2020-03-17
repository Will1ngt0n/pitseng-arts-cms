import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
  searchArray = []
  allQuestions: Array<any> = []
  technicalQuestions: Array<any> = []
  orderQuestions: Array<any> = []
  productQuestions: Array<any> = []
  returnsQuestions: Array<any> = []
  refundsQuestions: Array<any> = []
  constructor(private productsService: ProductsService, public modalController: ModalController) { }

  ngOnInit() {
    this.getFAQs()
  }
  getQuestions() {
    return this.productsService.getQuestions().then(res => {

    })
  }
  getFAQs() {
    return this.productsService.getFAQs().then(res => {
      this.technicalQuestions = []
      this.orderQuestions = []
      this.allQuestions = res
      for (let key in res) {
        let category = res[key].data.category
        if(category === 'Technical'){
          this.technicalQuestions.push(res[key])
        }else if(category === 'Orders'){
          this.orderQuestions.push(res[key])
        }else if(category === 'Product'){
          this.productQuestions.push(res[key])
        }else if(category === 'Returns'){
          this.returnsQuestions.push(res[key])
        } else {
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

  searchFAQs(event){
    let value = event.target.value
    if(value === ''){
      this.searchArray = []
    }else{
      console.log(this.searchArray);
      
      let questionSearch = this.allQuestions.filter(item => item.data.question.toLowerCase().indexOf(value) >= 0)
      let answerSearch = this.allQuestions.filter(item => item.data.answer.toLowerCase().indexOf(value) >= 0)
      console.log(questionSearch);
      console.log(answerSearch);
      this.searchArray = questionSearch
      for(let i in answerSearch){
        if(this.searchArray.indexOf(answerSearch[i]) === -1){
          this.searchArray.push(answerSearch[i])
        }
      }
      console.log(questionSearch);
      console.log(answerSearch);
      
      
      console.log(this.searchArray);
      
    }
  }

  num1 = 0;
  num2 = 0;
  num3 = 0;
  num4 = 0;

  toggleAnswers1() {
    if (this.num1 == 0) {
      document.getElementById("one").style.height = "unset";
      document.getElementById("two").style.height = "0";
      document.getElementById("three").style.height = "0";
      document.getElementById("four").style.height = "0";
      this.num1 = 1
      this.num2 = 0
      this.num3 = 0
      this.num4 = 0
      document.getElementById("arrow-default1").style.transform = "rotateZ(180deg)";
      document.getElementById("arrow-default2").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default3").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default4").style.transform = "rotateZ(0deg)";

    }
    else {

      document.getElementById("one").style.height = "0";
      document.getElementById("two").style.height = "0";
      document.getElementById("three").style.height = "0";
      document.getElementById("four").style.height = "0";
      this.num1 = 0;
      this.num2 = 0
      this.num3 = 0
      this.num4 = 0
      document.getElementById("arrow-default1").style.transform = "rotateZ(0deg)"
    }
    console.log();
  }
  toggleAnswers2() {
    console.log();
    if (this.num2 == 0) {
      this.num2 = 1
      this.num1 = 0
      this.num3 = 0
      this.num4 = 0
      document.getElementById("one").style.height = "0";
      document.getElementById("two").style.height = "unset";
      document.getElementById("three").style.height = "0";
      document.getElementById("four").style.height = "0";
      document.getElementById("arrow-default1").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default2").style.transform = "rotateZ(180deg)";
      document.getElementById("arrow-default3").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default4").style.transform = "rotateZ(0deg)";
    }
    else {

      document.getElementById("one").style.height = "0";
      document.getElementById("two").style.height = "0";
      document.getElementById("three").style.height = "0";
      document.getElementById("four").style.height = "0";
      this.num1 = 0;
      this.num2 = 0
      this.num3 = 0
      this.num4 = 0
      document.getElementById("arrow-default2").style.transform = "rotateZ(0deg)"
    }
  }
  toggleAnswers3() {
    if (this.num3 == 0) {
      this.num3 = 1
      this.num1 = 0
      this.num2 = 0
      this.num4 = 0
      console.log();
      document.getElementById("one").style.height = "0";
      document.getElementById("two").style.height = "0";
      document.getElementById("three").style.height = "unset";
      document.getElementById("four").style.height = "0";
      document.getElementById("arrow-default1").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default2").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default3").style.transform = "rotateZ(180deg)";
      document.getElementById("arrow-default4").style.transform = "rotateZ(0deg)";

    }
    else {

      document.getElementById("one").style.height = "0";
      document.getElementById("two").style.height = "0";
      document.getElementById("three").style.height = "0";
      document.getElementById("four").style.height = "0";
      this.num1 = 0;
      this.num2 = 0
      this.num3 = 0
      this.num4 = 0
      document.getElementById("arrow-default3").style.transform = "rotateZ(0deg)"
    }

  }
  toggleAnswers4() {
    console.log();
    if (this.num4 == 0) {

      document.getElementById("one").style.height = "0";
      document.getElementById("two").style.height = "0";
      document.getElementById("three").style.height = "0";
      document.getElementById("four").style.height = "auto";
      this.num4 = 1
      this.num1 = 0
      this.num2 = 0
      this.num3 = 0
      document.getElementById("arrow-default1").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default2").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default3").style.transform = "rotateZ(0deg)";
      document.getElementById("arrow-default4").style.transform = "rotateZ(180deg)";
    }
    else {

      document.getElementById("one").style.height = "0";
      document.getElementById("two").style.height = "0";
      document.getElementById("three").style.height = "0";
      document.getElementById("four").style.height = "0";
      this.num1 = 0;
      this.num2 = 0
      this.num3 = 0
      this.num4 = 0
      document.getElementById("arrow-default4").style.transform = "rotateZ(0deg)"
    }

  }
  
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  querying(){

  }
}
