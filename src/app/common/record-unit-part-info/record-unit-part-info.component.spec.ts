import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordUnitPartInfoComponent } from './record-unit-part-info.component';

describe('RecordUnitPartInfoComponent', () => {
  let component: RecordUnitPartInfoComponent;
  let fixture: ComponentFixture<RecordUnitPartInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordUnitPartInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordUnitPartInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
