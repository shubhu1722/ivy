import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActionService } from 'src/app/services/action/action.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { UtilityService } from 'src/app/utilities/utility.service';

import { DropdownWithSearchTwoComponent } from './dropdown-with-search-two.component';

describe('DropdownWithSearchTwoComponent', () => {
  let component: DropdownWithSearchTwoComponent;
  let fixture: ComponentFixture<DropdownWithSearchTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownWithSearchTwoComponent ],
      imports:[BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule],
      providers:[ActionService,EventServiceService ,HookService ,UtilityService,ContextService,DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownWithSearchTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit keydown event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onKeyDown');
    const input = fixture.debugElement.nativeElement.querySelector('ngx-select-dropdown');
    input.dispatchEvent(new Event('keydown'))
    tick();
    fixture.detectChanges()
    expect(component.onKeyDown).toHaveBeenCalled();
  }));

   
  it('should emit change event and execute the function.', fakeAsync(() => {
    spyOn(component, 'changeDropdown');
    const input = fixture.debugElement.nativeElement.querySelector('ngx-select-dropdown');
    input.dispatchEvent(new Event('change'))
    tick();
    fixture.detectChanges()
    expect(component.changeDropdown).toHaveBeenCalled();
  }));
  it('should emit searchchange event and execute the function.', fakeAsync(() => {
    spyOn(component, 'searchChange');
    const input = fixture.debugElement.nativeElement.querySelector('ngx-select-dropdown');
    input.dispatchEvent(new Event('searchChange'))
    tick();
    fixture.detectChanges()
    expect(component.searchChange).toHaveBeenCalled();
  }));

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
   component.isSearchToAddContext=true;
   component.inputConfig=[];
   component.splitArray=[];
   component.contextKey='';
   component.eventMap=[];
   component.hookMap=[];
   component.beforeInitHooks=[];
   component.afterInitHooks=[];
   component. beforeActionHooks=[];
   component.afterActionHooks=[];
   component.dropdownClass='';
   
  });

});
