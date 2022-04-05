import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';

import { RadioboxComponent } from './radiobox.component';

describe('RadioboxComponent', () => {
  let component: RadioboxComponent;
  let fixture: ComponentFixture<RadioboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioboxComponent ],
      imports:[ HttpClientModule,BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule,MatAutocompleteModule],
      providers:[ HookService,EventServiceService,DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should emit change event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onChangeClick');
    const input = fixture.debugElement.nativeElement.querySelector('mat-radio-button');
    input.dispatchEvent(new Event('change',null))
    tick();
    fixture.detectChanges()
      expect(component.onChangeClick).toHaveBeenCalled();
  }));
 
  it('should TEST INPUT', () => {
    
    component. eventMap= [];
    component.hookMap= [];
    component.color = 'primary';
    component.disableRipple = true;
    component.disabled = true;
    component.id = '';
    component.labelPosition= 'after';
    component.name = 'name';
    component.required = true;
    component.value = '';
    component.radioGroup = 'name';
    component.submitable = false;
    component.validations = [];
    component.labelstyles = '';
    component.inputStyles = 'name';
    component.hooks = [];
    component.action = [];
    component.tooltip = '';
    component.tooltipPosition = 'right';
    component.group = '';
  });
});
