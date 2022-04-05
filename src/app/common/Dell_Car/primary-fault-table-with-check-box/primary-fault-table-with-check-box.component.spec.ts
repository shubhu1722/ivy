import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryFaultTableWithCheckBoxComponent } from './primary-fault-table-with-check-box.component';

describe('PrimaryFaultTableWithCheckBoxComponent', () => {
  let component: PrimaryFaultTableWithCheckBoxComponent;
  let fixture: ComponentFixture<PrimaryFaultTableWithCheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryFaultTableWithCheckBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryFaultTableWithCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
