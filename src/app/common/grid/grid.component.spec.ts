import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';

import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComponent ],
      imports:[BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule],
      providers:[EventServiceService, ContextService ,ComponentLoaderService, DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit click event and execute the function.', fakeAsync(() => {
    spyOn(component, 'clickEvent');
    const input = fixture.debugElement.nativeElement.querySelector('mat-grid-tile');
    input.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges()
    expect(component.clickEvent).toHaveBeenCalled();
  }));

  it('should TEST INPUT', () => {
    component.cols = '2';
    component.rowHeight = '20px';
    component.gutterSize = '';
    component.colspan = 1;
    component.rowspan = 1;
    component. tiles= '';
    component.hooks= [];
    component.actions= [];
    component.validations= [];
    component.FlexFieldName='';
    component.selectedvalue='';
    component.count=5;
    component.eventMap=['click'];
    component.hookMap=['afterInit'];
 });


});
