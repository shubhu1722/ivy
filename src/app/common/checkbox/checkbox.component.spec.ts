import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change event and execute the function.', fakeAsync(() => {
    spyOn(component, 'CheckFucntion');
    const input = fixture.debugElement.nativeElement.querySelector('mat-checkbox');
    input.dispatchEvent(new Event('change', null))
    tick();
    fixture.detectChanges()
    expect(component.CheckFucntion).toHaveBeenCalled();
  }));

});
