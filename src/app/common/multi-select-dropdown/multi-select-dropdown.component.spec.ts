import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MultiSelectDropdownComponent } from './multi-select-dropdown.component';

describe('MultipleDropdownComponent', () => {
  let component: MultiSelectDropdownComponent;
  let fixture: ComponentFixture<MultiSelectDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit keyup event and execute the function.',fakeAsync(() => {
    spyOn(component, 'selectedItem');
    const input = fixture.debugElement.nativeElement.querySelector('mat-select ');
    input.dispatchEvent(new Event('selectionChange',null))
    tick();
    fixture.detectChanges()
      expect(component.selectedItem).toHaveBeenCalled();
  }));
  it('should TEST INPUT', () => {
    
    component.multiple = 'true';
    component.disableRipple = 'true';
    component.id = '';
    component.panelClass = '';
    component.value = [];
    component.options = [];
    component.empty ='false';
    component.placeholder = 'Select Options';
    component.focused = 'true';
    component.required = 'true';
    component.datasoucre = {msid: '',
    code: 'id',
    text: 'name',
    root: 'data',
    params: [],};
  });
});
