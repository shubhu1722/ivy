import { style } from '@angular/animations';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { async, ComponentFixture, TestBed, fakeAsync, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { DebugElement, Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { ActionService } from 'src/app/services/action/action.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MetadataService } from 'src/app/services/commonServices/metadataService/metadata.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let submitEl: DebugElement
  let submitLableEl: DebugElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,MatSnackBarModule,BrowserDynamicTestingModule ,MatDialog],
      declarations: [ButtonComponent],
      providers: [
        EventServiceService,
        ActionService,
        HookService,
        DatePipe,
        MetadataService
    ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit click event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onClickButton');
    const input = fixture.debugElement.nativeElement.querySelector('button');
    input.dispatchEvent(new Event('click', null))
    tick();
    fixture.detectChanges()
    expect(component.onClickButton).toHaveBeenCalled();
  }));

  it('label field should have styles ', () => {
    component.labelstyles = "font-size:16px";
    fixture.detectChanges();
    expect(component.labelstyles).toEqual("font-size:16px");
  });

}); 
