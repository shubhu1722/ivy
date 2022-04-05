import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DropdownComponent } from './dropdown.component';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { ActionService } from 'src/app/services/action/action.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup} from '@angular/forms';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule,MatDialogModule],
      declarations: [DropdownComponent],
      providers:[ContextService,ActionService,UtilityService,HookService,EventServiceService,DatePipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit openedChange event and execute the function.', fakeAsync(() => {
    spyOn(component, 'openedChangedHandler');
    const input = fixture.debugElement.nativeElement.querySelector('select');
    input.dispatchEvent(new Event('openedChange', null))
    tick();
    fixture.detectChanges()
    expect(component.openedChangedHandler).toHaveBeenCalled();
  }));

  it('should emit openedChange event and execute the function.', fakeAsync(() => {
    spyOn(component, 'changeDropdown');
    const input = fixture.debugElement.nativeElement.querySelector('select');
    input.dispatchEvent(new Event('change', null))
    tick();
    fixture.detectChanges()
    expect(component.changeDropdown).toHaveBeenCalled();
  }));


  it('should TEST INPUT', () => {
    component.options = [];
    component.inputStyles = 'color:blue';
    component.name = 'name';
    component.dataSource = '';
    component.displayValue = '';
    component.defaultValue = '';
    component.code = '';
    component.label = 'name';
    component.group=new FormGroup({
      first: new FormControl(),
      last: new FormControl()
    });
    component.hooks = [];
    component.labelClass = '';
    component.formGroupClass = 'name';
    component.formGroupStyles = 'top';
    component.disabled = true;
    component.visibility=true;
    component.actions = [];
    component.hidden = true;
    component.defaultFilterValue = '';
    component.defaultFilterKey = '';
    component.required = true;
    component. actions =[];
    component.disabled = true;
    component. visibility = true;
    component. hideDisabledSelect = true;
    component. setDisabled = true;
    
});
});
