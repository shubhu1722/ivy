import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';


import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { BreadcrumbComponent } from './breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { DatePipe } from '@angular/common';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule,BrowserDynamicTestingModule,MatDialogModule ,RouterTestingModule],
      providers: [
        ContextService,
        UtilityService,
        DatePipe
     ],
      declarations: [BreadcrumbComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('span element should have styles ', () => {
    component.style = "font-size:16px";
    fixture.detectChanges();
    expect(component.style).toEqual("font-size:16px");
  });

  it('should TEST INPUT', () => {
    component.style = '';
    component.class = '';
    component.breadcrumbs = [];
    
  });
});
