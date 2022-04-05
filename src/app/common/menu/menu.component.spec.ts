import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';

import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports:[MatMenuModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.eventMap = [];
    component. hookMap= [];
    component.backdropClass ='';
    component.hasBackdrop =false;
    component.overlapTrigger= true;
    component. xPosition= 'after';
    component.yPosition ='above';
    component.direction= 'Direction';
    component.panelId= '';
    component.parentMenu= 'MatMenuPanel';
    component.disableRipple = true;
    component.disabled= false;
    component.role= 'menuitem';
    component.items= [];
      
    }); 

 });
