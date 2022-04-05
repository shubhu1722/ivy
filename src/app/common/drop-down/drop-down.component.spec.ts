import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { DropDownComponent } from './drop-down.component';

describe('DropDownComponent', () => {
  let component: DropDownComponent;
  let fixture: ComponentFixture<DropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDownComponent ],
      imports:[MatSnackBarModule,MatDialogModule],
      providers:[UtilityService,DatePipe,ContextService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selectionChange event and execute the function.',fakeAsync(() => {
    spyOn(component, 'selectedItem');
    const input = fixture.debugElement.nativeElement.querySelector('mat-select');
    input.dispatchEvent(new Event('selectionChange',null))
    tick();
    fixture.detectChanges()
      expect(component.selectedItem).toHaveBeenCalled();
  }));

  it('should emit openedChange event and execute the function.',fakeAsync(() => {
    spyOn(component, 'openedChangedHandler');
    const input = fixture.debugElement.nativeElement.querySelector('mat-select');
    input.dispatchEvent(new Event('openedChange',null))
    tick();
    fixture.detectChanges()
      expect(component.openedChangedHandler).toHaveBeenCalled();
  }));

  it('mat-options field should have styles ', () => {
    component.css = "display:inline";
    fixture.detectChanges();
    expect(component.css).toEqual("display:inline");
  });

  it('should TEST INPUT', () => {
    component.disableRipple = true;
    component.disabled = true;
    component.id = ' ';
    component.panelClass = '';
    component.displayValue = '';
    component.value = '';
    component.options = '';
    component. empty = true;
    component.focused = true;
    component.placeholder = '';
    component.required = true;
    component.dataSource = 'top';
    component.code= '';
    component.displayValue='';
    component.defaultValue = '';
    component.css = '';
    
    
});

});
