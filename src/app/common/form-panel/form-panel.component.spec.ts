import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPanelComponent } from './form-panel.component';

describe('FormPanelComponent', () => {
  let component: FormPanelComponent;
  let fixture: ComponentFixture<FormPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.header = {};
    // component.footer = {};
    // component.Items = [];
  });

  it('mat-card field should have styles ', () => {
    component.css = "font-size:16px";
    fixture.detectChanges();
    expect(component.css).toEqual("font-size:16px");
  });
});
