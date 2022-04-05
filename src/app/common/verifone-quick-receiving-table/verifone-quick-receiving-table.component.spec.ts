import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifoneQuickReceivingTableComponent } from './verifone-quick-receiving-table.component';

describe('VerifoneQuickReceivingTableComponent', () => {
  let component: VerifoneQuickReceivingTableComponent;
  let fixture: ComponentFixture<VerifoneQuickReceivingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifoneQuickReceivingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifoneQuickReceivingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
