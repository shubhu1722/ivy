import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { LoggerService } from 'src/app/services/commonServices/loggerService/logger.service';

import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextareaComponent ],
      providers:[EventServiceService,ContextService,LoggerService,DatePipe],
      imports:[ HttpClientModule,BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule,MatAutocompleteModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaComponent);
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

  it('label field should have styles ', () => {
    component.labelstyles = "font-size:16px";
    fixture.detectChanges();
    expect(component.labelstyles).toEqual("font-size:16px");
  });
});
