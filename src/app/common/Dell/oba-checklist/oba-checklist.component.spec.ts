import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObaChecklistComponent } from './oba-checklist.component';

describe('ObaChecklistComponent', () => {
  let component: ObaChecklistComponent;
  let fixture: ComponentFixture<ObaChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObaChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObaChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
