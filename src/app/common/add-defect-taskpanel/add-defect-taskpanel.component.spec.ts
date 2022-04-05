import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefectTaskpanelComponent } from './add-defect-taskpanel.component';

describe('AddDefectTaskpanelComponent', () => {
  let component: AddDefectTaskpanelComponent;
  let fixture: ComponentFixture<AddDefectTaskpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDefectTaskpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefectTaskpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
