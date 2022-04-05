import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';


import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';



import { ButtonToggleComponent } from './button-toggle.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActionService } from 'src/app/services/action/action.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';



describe('ButtonToggleComponent', () => {
  let component: ButtonToggleComponent;
  let fixture: ComponentFixture<ButtonToggleComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,MatButtonToggleModule,MatSnackBarModule,BrowserDynamicTestingModule,MatDialogModule ],
      declarations: [ ButtonToggleComponent ],
      providers: [
        ContextService,
        EventServiceService,
        ActionService,
        HookService,
        DatePipe
      ]
    });
   }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should emit change event and execute the function.', fakeAsync(() => {
    spyOn(component, 'toggle');
    const input = fixture.debugElement.nativeElement.querySelector('mat-button-toggle-group');
    input.dispatchEvent(new Event('change'))
    tick();
    fixture.detectChanges()
    expect(component.toggle).toHaveBeenCalled();
  }));

  it('label field should have styles ', () => {
    component.labelstyles = "font-size:16px";
    fixture.detectChanges();
    expect(component.labelstyles).toEqual("font-size:16px");
  });

//   it(`should have as label'angular-unit-test'`, async(() => {
//     const fixture = TestBed.createComponent(ButtonToggleComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app.label).toEqual('angular-unit-test');
// }));

  
  
  // fit('check property values ', () => {
  //   component.attr.visibility= "true";
  //   fixture.detectChanges();
  //   expect(component.attr.visibility).toEqual("true");
  // });


  it('should TEST INPUT', () => {
    
    component.disabled = true;
    component.vertical = true;
    component.validations = [];
    component.labelstyles = 'color:blue';
    component.inputStyles = 'color:blue';
    component.hooks = [];
    component.actions = [];
    component.name = 'name';
    component.visibilty = true;
    component.label = 'name';
    component.labelPosition = 'top';
    component.required = true;
    component.value = 'name';
  });


});
