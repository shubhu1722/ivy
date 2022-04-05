import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActionService } from 'src/app/services/action/action.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { FormGroup } from '@angular/forms';


import { ComponentListComponent } from './component-list.component';

describe('ComponentListComponent', () => {
  let component: ComponentListComponent;
  let fixture: ComponentFixture<ComponentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentListComponent ],
      imports: [HttpClientTestingModule,MatButtonToggleModule,MatSnackBarModule,BrowserDynamicTestingModule,MatDialogModule,ReactiveFormsModule ],
      providers: [
        ContextService,
        EventServiceService,
        ActionService,
        HookService,
        DatePipe,
      { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
     component.dataGrid = [];
     component.class= '';
     component.flexCount= '';
    component.componentUUID= '';
    component.uuid= '';
    component.contaxtArray= [];
    component.disableFields= true;
    component.flexClass= '';
    component.footerButtonUUID= '';
    // component.group='{}' ;
    // component.fieldData= '';
    component.eventMap=[];
    component.hookMap=[];

    
  });


});
