import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleActionsComponentComponent } from './toggle-actions-component.component';

describe('ToggleActionsComponentComponent', () => {
  let component: ToggleActionsComponentComponent;
  let fixture: ComponentFixture<ToggleActionsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleActionsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleActionsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
