import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectDropdownWithChipsComponent } from './multi-select-dropdown-with-chips.component';

describe('MultiSelectDropdownWithChipsComponent', () => {
  let component: MultiSelectDropdownWithChipsComponent;
  let fixture: ComponentFixture<MultiSelectDropdownWithChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectDropdownWithChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectDropdownWithChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
