import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeAlertDialogComponent } from './sme-alert-dialog.component';

describe('SmeAlertDialogComponent', () => {
  let component: SmeAlertDialogComponent;
  let fixture: ComponentFixture<SmeAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
