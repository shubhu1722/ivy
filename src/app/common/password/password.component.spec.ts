import { trigger } from '@angular/animations';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasswordComponent } from './password.component';
import { DebugElement, ViewChild, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/commonServices/loggerService/logger.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  let testHostComponent: PwdTestHostComponent;
  let testHostFixture: ComponentFixture<PwdTestHostComponent>;

  let labelEl: DebugElement
  // let matIcon: DebugElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordComponent, PwdTestHostComponent],
      imports:[BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule],
      providers:[LoggerService,EventServiceService]
      // declarations: [PasswordComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(PwdTestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();

    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    labelEl = fixture.debugElement.query(By.css('label'));

    // matIcon = fixture.debugElement.query(By.css('mat-icon'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit focus event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onlocalfocus');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus',null))
    tick();
    fixture.detectChanges()
      expect(component.onlocalfocus).toHaveBeenCalled();
  }));

  it('should emit onchange event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onlocalChange');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('onchange',null))
    tick();
    fixture.detectChanges()
      expect(component.onlocalChange).toHaveBeenCalled();
  }));

  it('should emit blur event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onlocalBlur');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur',null))
    tick();
    fixture.detectChanges()
      expect(component.onlocalBlur).toHaveBeenCalled();
  }));

  it('should emit keyup event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onKeyup');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('keyup',null))
    tick();
    fixture.detectChanges()
      expect(component.onKeyup).toHaveBeenCalled();
  }));

  it('should emit focus event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onlocalFocusOut');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('onfocusout',null))
    tick();
    fixture.detectChanges()
      expect(component.onlocalFocusOut).toHaveBeenCalled();
  }));

  it('should emit keydown event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onKeyDown');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('keydown',null))
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

  // it('should TEST INPUT', () => {
  //   component.submitable = true;
  //   component.disabled = true;
  //   component.visibility = true;
  //   component.validations = [];
  //   component.labelstyles = 'color:blue';
  //   component.inputStyles = 'color:blue';
  //   component.hooks = [];
  //   component.actions = [];
  //   component.name = 'name';
  //   component.label = 'name';
  //   component.labelPosition = 'top';
  //   component.tooltip = 'name';
  //   component.TooltipPosition = 'right';
  //   component.defaultvalue = '';
  //   component.readonly = true;
  //   component.type = 'text';
  //   component.required = true;
  //   component.placeholder = 'name';
  //   component.value = 'name';
  //   component.errorStateMatcher = '';
  //   component.revealpassword = true;
  // });

  // it('label should have style', () => {
  //   component.labelstyles = "style";
  //   fixture.detectChanges();
  //   expect(labelEl.nativeElement.style).toBeDefined();
  // });

  // it('label should select by class and should have name', () => {
  //   testHostFixture.detectChanges();
  //   expect(testHostFixture.nativeElement.querySelector('.labelTest').innerText).toEqual('testpwd');
  // });

  // it('password field should have id ', () => {
  //   testHostFixture.detectChanges();
  //   expect(testHostFixture.nativeElement.querySelector('#testpwd').value).toEqual("password");
  // });

  // it('password field should have type ', () => {
  //   testHostFixture.detectChanges();
  //   expect(testHostFixture.nativeElement.querySelector('#testpwd').type).toEqual("text");
  // });

  // it('password field should have placeholder', () => {
  //   testHostFixture.detectChanges();
  //   expect(testHostFixture.nativeElement.querySelector('#testpwd').placeholder).toEqual("test password");
  // });

  // it('password field should have placeholder', () => {
  //   testHostFixture.detectChanges();
  //   expect(testHostFixture.nativeElement.querySelector('#testpwd').name).toEqual("testpwd");
  // });

  // it('password field should have read only property', () => {
  //   testHostComponent.passwordComponent.readonly = false;
  //   testHostFixture.detectChanges();
  //   expect(testHostComponent.passwordComponent.readonly).toBe(false);
  // });

  // it('password field should have required property', () => {
  //   testHostFixture.detectChanges();
  //   expect(testHostComponent.passwordComponent.required).toBeTruthy();
  // });

  // it('password field should have tooltip property', () => {
  //   testHostFixture.detectChanges();
  //   expect(testHostComponent.passwordComponent.tooltip).toEqual("test user password");
  // });

  // it('password field should have TooltipPosition property', () => {
  //   testHostFixture.detectChanges();
  //   expect(testHostComponent.passwordComponent.TooltipPosition).toEqual("top");
  // });

  // it('password field should have revealpassword property and innertext of mat-icon', () => {
  //   testHostComponent.passwordComponent.revealpassword = false;
  //   testHostFixture.detectChanges();
  //   expect(testHostComponent.passwordComponent.revealpassword).toBeFalse();
  //   if (testHostComponent.passwordComponent.revealpassword) {
  //     expect(testHostFixture.nativeElement.querySelector('mat-icon').innerText).toEqual("visibility_off");
  //   } else {
  //     expect(testHostFixture.nativeElement.querySelector('mat-icon').innerText).toEqual("visibility");
  //   }
  // });



  @Component({
    selector: `host-component`,
    template: `<app-password name = "testpwd" labelPosition="labelTest" value="password" placeholder="test password" 
    required=${true} tooltip="test user password" TooltipPosition="top"></app-password>`
  })
  class PwdTestHostComponent {
    @ViewChild(PasswordComponent)
    public passwordComponent: PasswordComponent;
  }
});
