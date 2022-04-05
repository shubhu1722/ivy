import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownWithMultiSelectComponent } from './drop-down-with-multi-select.component';

describe('DropDownWithMultiSelectComponent', () => {
  let component: DropDownWithMultiSelectComponent;
  let fixture: ComponentFixture<DropDownWithMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDownWithMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownWithMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
