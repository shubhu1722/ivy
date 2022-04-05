import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryfaultPopupTableComponent } from './primaryfault-popup-table.component';

describe('PrimaryfaultPopupTableComponent', () => {
  let component: PrimaryfaultPopupTableComponent;
  let fixture: ComponentFixture<PrimaryfaultPopupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryfaultPopupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryfaultPopupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
