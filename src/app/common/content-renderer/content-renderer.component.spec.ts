import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActionService } from 'src/app/services/action/action.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';

import { ContentRendererComponent } from './content-renderer.component';

describe('ContentRendererComponent', () => {
  let component: ContentRendererComponent;
  let fixture: ComponentFixture<ContentRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRendererComponent ],
      imports: [HttpClientTestingModule,MatButtonToggleModule,MatSnackBarModule,BrowserDynamicTestingModule,MatDialogModule ],
      providers: [
        ContextService,
        EventServiceService,
        ActionService,
        HookService,
        DatePipe,
       { provide: ComponentFixtureAutoDetect, useValue: true }
      ]})

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.css = '';
    component.visibility = true;
    component.hooks = [];
    component.validations = [];
    component.action = [];
    component.header = [];
    component.footer = [];
    component.items = [];
    component.itemsData = '';
    component.rightsidenav='';
    component.contentClass='';
    component.errorTitle='';
    component.staticItem='';
 });
  

});
