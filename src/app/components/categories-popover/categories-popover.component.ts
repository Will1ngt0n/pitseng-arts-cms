import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-popover',
  templateUrl: './categories-popover.component.html',
  styleUrls: ['./categories-popover.component.scss'],
})
export class CategoriesPopoverComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {}
  viewItems(item, para){
    console.log(item);
    this.router.navigate([para, item])

  }

}
