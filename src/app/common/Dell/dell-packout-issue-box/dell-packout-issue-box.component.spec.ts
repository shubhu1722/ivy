import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DellPackoutIssueBoxComponent } from './dell-packout-issue-box.component';

describe('DellPackoutIssueBoxComponent', () => {
  let component: DellPackoutIssueBoxComponent;
  let fixture: ComponentFixture<DellPackoutIssueBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DellPackoutIssueBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DellPackoutIssueBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
