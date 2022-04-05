import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqListButtonComponent } from './req-list-button.component';

describe('ReqListButtonComponent', () => {
  let component: ReqListButtonComponent;
  let fixture: ComponentFixture<ReqListButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqListButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqListButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
