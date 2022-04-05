import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTreeComponent } from './menu-tree.component';

describe('MenuTreeComponent', () => {
  let component: MenuTreeComponent;
  let fixture: ComponentFixture<MenuTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.eventMap = [];
    component.hookMap = [];
    component.menu = 'MatMenuPanel<any>';
    component.restoreFocus = false;
    component.dir = 'color:blue';
    component.menuOpen = false;
    component.id = '';
    component.datasource = [];
    component.subProcessType = '';
    component.uuid = '';
    component.menuData = '';
    component.childIndex = 3;
   });

});
