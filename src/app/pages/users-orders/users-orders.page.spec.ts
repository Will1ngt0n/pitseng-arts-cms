import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsersOrdersPage } from './users-orders.page';

describe('UsersOrdersPage', () => {
  let component: UsersOrdersPage;
  let fixture: ComponentFixture<UsersOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
