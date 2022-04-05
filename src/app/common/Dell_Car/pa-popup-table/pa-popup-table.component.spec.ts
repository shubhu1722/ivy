import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaPopupTableComponent } from './pa-popup-table.component';

describe('PaPopupTableComponent', () => {
  let component: PaPopupTableComponent;
  let fixture: ComponentFixture<PaPopupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaPopupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaPopupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
