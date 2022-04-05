import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveTaskpanelComponent } from './predictive-taskpanel.component';

describe('PredictiveTaskpanelComponent', () => {
  let component: PredictiveTaskpanelComponent;
  let fixture: ComponentFixture<PredictiveTaskpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictiveTaskpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveTaskpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
