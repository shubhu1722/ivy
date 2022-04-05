import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { MediaService } from '../video-cam/media-service';

import { IconbuttonComponent } from './iconbutton.component';

describe('IconbuttonComponent', () => {
  let component: IconbuttonComponent;
  let fixture: ComponentFixture<IconbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconbuttonComponent ],
      imports:[BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule],
      providers:[EventServiceService, ContextService ,MediaService, DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit click event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onClick');
    const input = fixture.debugElement.nativeElement.querySelector('button');
    input.dispatchEvent(new Event('click'))
    tick();
    fixture.detectChanges()
      expect(component.onClick).toHaveBeenCalled();
  }));

  // it('div field should have styles ', () => {
  //   component.css = "font-size:16px";
  //   fixture.detectChanges();
  //   expect(component.css).toEqual("font-size:16px");
  // });

  // it('label field should have styles ', () => {
  //   component.labelstyles = "font-size:16px";
  //   fixture.detectChanges();
  //   expect(component.labelstyles).toEqual("font-size:16px");
  // });

  
  it('should TEST INPUT', () => {
    component.eventMap = ['click'];
    component.hookMap = ['afterInit'];
    component.color = '';
    component.disableRipple = true;
    component.disabled = true;
    component.isIconButton = false;
    component.isRoundButton = false;
    component.text = '';
    component. css = '';
    component.submitable = true;
    component.visibility = true;
    component.validations = ' ';
    component.labelstyles = '';
    component.inputStyles = '';
    component. hooks = '';
    component.action = true;
    component.icon = '';
    component.iconcss = ' ';
    component.tooltip = '';
    component. tooltipPosition = '';
    component.rightsidenav = '';
    component.parentuuid = true;
    component.targetuuid = '';
    component. iconClass = '';
    component.iconButtonClass = '';
    component.jsontype= '';
    component.hidden = true;
    component.svgIcon = '';
    component.textValue= '';
    component.textValueClass = '';
  });

});
