import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { LoggerService } from 'src/app/services/commonServices/loggerService/logger.service';

import { NumberFieldComponent } from './number-field.component';

describe('NumberFieldComponent', () => {
  let component: NumberFieldComponent;
  let fixture: ComponentFixture<NumberFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NumberFieldComponent],
      imports:[],
      providers:[LoggerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    component.defaultvalue = '';
    component.readonly = true;
    component.type = 'text';
    component.required = true;
    component.placeholder = 'name';
    component.value = 'name';
    component.errorStateMatcher = '';
  });

  it('should emit focus event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onlocalfocus');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus', null))
    tick();
    fixture.detectChanges()
    expect(component.onlocalfocus).toHaveBeenCalled();
  }));

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

  it('should emit keydown event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onKeyDown');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('keydown', null))
    tick();
    fixture.detectChanges()
    expect(component.onKeyDown).toHaveBeenCalled();
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
});
