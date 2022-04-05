import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TransactionService } from 'src/app/services/commonServices/transaction/transaction.service';
import { UtilityService } from 'src/app/utilities/utility.service';

import { MenuListItemComponent } from './menu-list-item.component';

describe('MenuListItemComponent', () => {
  let component: MenuListItemComponent;
  let fixture: ComponentFixture<MenuListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuListItemComponent ],
      imports:[BrowserDynamicTestingModule,MatSnackBarModule, HttpClientModule],
      providers:[ ContextService,UtilityService,TransactionService, DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.isActive = '';
    component. expanded= false;
    component. item ='';
    component.dataSource =false;
    component.items= true;
    component.depth= 50;
    component.iconList ='above';
    component.childrenIcon= 'Direction';
    component.style= '';
    component.menuListClass= 'MatMenuPanel';
    component.Isloaded = false;
    }); 
  });
