import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActionService } from 'src/app/services/action/action.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';

import { MatGridComponent } from './mat-grid.component';

describe('MatGridComponent', () => {
  let component: MatGridComponent;
  let fixture: ComponentFixture<MatGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatGridComponent ],
      imports:[HttpClientModule,BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule],
      providers:[EventServiceService,ContextService, ActionService,HookService,DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.cols = 6;
    component.rowHeight= '';
    component.colspan =9;
    component.rowspan =9;
    component.tiles= '';
   component. hooks= [];
    component.actions =[];
    component.validations= [];
    component.FlexFieldName= '';
    component.footerActions= [];
    component.imageClass= '';
    component.selectedvalue= '';
    component.screenWidth= 500;
    component.colsNo= 6;
    component.count= 4;
    component. eventMap = [];
    component. hookMap = [];
    // component.forEach = {};
      
    }); 
          
  });


