import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule, FormsModule, ReactiveFormsModule],
      declarations: [CheckboxGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onchange event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onCheckboxChange');
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('change', null))
    tick();
    fixture.detectChanges()
    expect(component.onCheckboxChange).toHaveBeenCalled();
  }));

  it('should TEST INPUT', () => {
    
    component. eventMap = [];
    component.hookMap = [];
    component.items = [];
    component.direction = 'vertical';
    component.rows= '';
    // component.value = 'item.name';
  });

});
