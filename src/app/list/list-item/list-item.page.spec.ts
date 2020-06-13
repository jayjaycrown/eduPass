import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListItemPage } from './list-item.page';

describe('ListItemPage', () => {
  let component: ListItemPage;
  let fixture: ComponentFixture<ListItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
