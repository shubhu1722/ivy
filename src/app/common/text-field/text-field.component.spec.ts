import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { TextFieldComponent } from './text-field.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material//snack-bar';
import { RouterTestingModule } from "@angular/router/testing";
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ActionService } from 'src/app/services/action/action.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule,RouterTestingModule,BrowserDynamicTestingModule,MatDialogModule],
      declarations: [TextFieldComponent],
      providers:[
        DatePipe,
        ActionService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit focus event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onlocalfocus');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus', null))
    tick();
    fixture.detectChanges()
    expect(component.onlocalfocus).toHaveBeenCalled();
  }));

  // it('should emit click event and execute the function.', fakeAsync(() => {
  //   const fixture2 = TestBed.createComponent(TextFieldComponent);
  //   const component2 = fixture2.componentInstance;
  //   spyOn(component2, 'clickevent');
  //   const input = fixture2.debugElement.nativeElement.querySelector('button');
  //   input.dispatchEvent(new Event('click',null));
  //   tick();
  //   fixture2.detectChanges()
  //   expect(component2.clickevent).toHaveBeenCalled();
  // }));

  it('should emit onchange event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onlocalChange');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('onchange', null))
    tick();
    fixture.detectChanges()
    expect(component.onlocalChange).toHaveBeenCalled();
  }));

  it('should emit blur event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onlocalBlur');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur', null))
    tick();
    fixture.detectChanges()
    expect(component.onlocalBlur).toHaveBeenCalled();
  }));

  it('should emit keyup event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onKeyup');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('keyup', null))
    tick();
    fixture.detectChanges()
    expect(component.onKeyup).toHaveBeenCalled();
  }));

  it('should emit focus event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onlocalFocusOut');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('onfocusout', null))
    tick();
    fixture.detectChanges()
    expect(component.onlocalFocusOut).toHaveBeenCalled();
  }));

  

  it('label field should have styles ', () => {
    component.labelstyles = "font-size:16px";
    fixture.detectChanges();
    expect(component.labelstyles).toEqual("font-size:16px");
  });

  it('mat-form-field field should have styles ', () => {
    component.inputStyles = "display:inline";
    fixture.detectChanges();
    expect(component.inputStyles).toEqual("display:inline");
  });

  it('should TEST INPUT', () => {
    component.submitable = true;
    component.disabled = true;
    component.visibility = true;
    component.validations = [];
    component.labelstyles = 'color:blue';
    component.inputStyles = 'color:blue';
    component.hooks = [];
    component.actions = [];
    component.name = 'name';
    component.label = 'name';
    component.labelPosition = 'top';
    component.tooltip = 'name';
    component.TooltipPosition = 'right';
    component.defaultValue = '';
    component.readonly = true;
    component.type = 'text';
    component.required = true;
    component.placeholder = 'name';
    component.value = 'name';
  });

});
