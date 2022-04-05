import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { DropdownWithSearchComponent } from './dropdown-with-search.component';

describe('DropdownWithSearchComponent', () => {
  let component: DropdownWithSearchComponent;
  let fixture: ComponentFixture<DropdownWithSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownWithSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownWithSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.options = [];
    component.inputStyles= '';
    component.name= '';
    component.dataSource= '';
    component.displayValue= '';
    component.code= '';
    component.label= '';
    component.group=new FormGroup({
        first: new FormControl(),
        last: new FormControl()
       });
   component.hooks= [];
   component.labelClass='';
   component.formGroupClass='';
   component.formGroupStyles='';
   component.hidden=true;
   component.defaultFilterValue='';
   component.defaultFilterKey='';
   component. required=true;
   component. actions=[];
   component. disabled=true;
   component.selectedDropdownName='';
   component.dropDownOptions=[];
   component.bank ={name:'content'};
  });

 

});
