import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActionService } from 'src/app/services/action/action.service';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ComponentService } from 'src/app/services/commonServices/componentService/component.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { CustomeService } from 'src/app/services/commonServices/customeService/custome.service';
import { UtilityService } from 'src/app/utilities/utility.service';

import { FlexFieldsComponent } from './flex-fields.component';

describe('FlexFieldsComponent', () => {
  let component: FlexFieldsComponent;
  let fixture: ComponentFixture<FlexFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexFieldsComponent ],
      imports:[BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule],
      providers:[ActionService,CustomeService,UtilityService,ComponentService,ContextService,ComponentLoaderService,DatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
