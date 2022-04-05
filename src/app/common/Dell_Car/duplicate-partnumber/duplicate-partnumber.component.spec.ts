import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatePartnumberComponent } from './duplicate-partnumber.component';

describe('DuplicatePartnumberComponent', () => {
  let component: DuplicatePartnumberComponent;
  let fixture: ComponentFixture<DuplicatePartnumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicatePartnumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatePartnumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
