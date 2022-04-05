import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActionService } from 'src/app/services/action/action.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { UtilityService } from 'src/app/utilities/utility.service';

import { RadioboxGroupComponent } from './radiobox-group.component';

describe('RadioboxGroupComponent', () => {
  let component: RadioboxGroupComponent;
  let fixture: ComponentFixture<RadioboxGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RadioboxGroupComponent],
      imports:[BrowserDynamicTestingModule,MatSnackBarModule,,MatDialogModule,HttpClientModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule,MatAutocompleteModule],
      providers:[ContextService,UtilityService,HookService,EventServiceService,ActionService,DatePipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onChange');
    const input = fixture.debugElement.nativeElement.querySelector('mat-radio-group');
    input.dispatchEvent(new Event('change', null))
    tick();
    fixture.detectChanges()
    expect(component.onChange).toHaveBeenCalled();
  }));
});
