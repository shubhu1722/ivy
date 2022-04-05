import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifoneRmaReceivingTableComponent } from './verifone-rma-receiving-table.component';

describe('VerifoneRmaReceivingTableComponent', () => {
  let component: VerifoneRmaReceivingTableComponent;
  let fixture: ComponentFixture<VerifoneRmaReceivingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifoneRmaReceivingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifoneRmaReceivingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
