import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { UtilityService } from 'src/app/utilities/utility.service';

import { DynamicTaskComponent } from './dynamic-task.component';

describe('DynamicTaskComponent', () => {
  let component: DynamicTaskComponent;
  let fixture: ComponentFixture<DynamicTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicTaskComponent ],
      imports:[BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule],
			providers:[ComponentLoaderService, ContextService,UtilityService,HookService,DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });
  afterEach(() => {
    fixture.destroy();
  });



  it('should create', () => {
    component.config ={'filterValue':[]};
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.data = [];
    component. hooks= [];
    component.config ={'filterValue':[]};
    component.firstPanelExpand= '';
    component.hookMap= [];
    // component.dynamictask= { static: true, read: ViewContainerRef };
  });

});
