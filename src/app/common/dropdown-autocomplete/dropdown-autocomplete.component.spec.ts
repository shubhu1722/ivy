import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActionService } from 'src/app/services/action/action.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { DropdownAutocompleteComponent } from './dropdown-autocomplete.component';
import { FormControl, FormGroup } from '@angular/forms';

describe('DropdownAutocompleteComponent', () => {
  let component: DropdownAutocompleteComponent;
  let fixture: ComponentFixture<DropdownAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownAutocompleteComponent ],
      providers:[ActionService,EventServiceService,UtilityService,HookService,ContextService,DatePipe],
      imports:[ HttpClientModule,BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule,MatAutocompleteModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit keydown event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onKeyDown');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('keydown', null))
    tick();
    fixture.detectChanges()
    expect(component.onKeyDown).toHaveBeenCalled();
  }));

   
  it('should emit change event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onSelectionChanged');
    const input = fixture.debugElement.nativeElement.querySelector('mat-autocomplete');
    input.dispatchEvent(new Event('optionSelected'))
    tick();
    fixture.detectChanges()
    expect(component.onSelectionChanged).toHaveBeenCalled();
  }));

  it('should emit change event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onInput');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('input'))
    tick();
    fixture.detectChanges()
    expect(component.onInput).toHaveBeenCalled();
  }));


  it('should TEST INPUT', () => {
    component.options = [];
    component.inputStyles = 'color:blue';
    component.name = 'name';
    component.dataSource = '';
    component.displayValue = '';
    component.defaultValue = '';
    component.code = '';
    component.label = 'name';
    component.group=new FormGroup({
          first: new FormControl(),
          last: new FormControl()
         });
    component.hooks = [];
    component.labelClass = '';
    component.formGroupClass = 'name';
    component.formGroupStyles = 'top';
    component.hidden = true;
    component.defaultFilterValue = '';
    component.defaultFilterKey = '';
    component.required = true;
    component. actions =[];
    component.disabled = true;
    component.isSearchToAddContext=true;
    component.isUpperCase = true;
    component.selectedDropdownName = '';
    component. dropDownOptions = '';
    component. splitArray = [];
    component. contextKey = '';
    component. eventMap = [];
    component. hookMap = [];
    component. beforeInitHooks = [];
    component. afterInitHooks= [];
    component. beforeActionHooks = [];
    component. afterActionHooks = [];
    component. dropdownClass = '';
    
});

});
