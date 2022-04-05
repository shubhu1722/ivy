import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccorditionPanelComponent } from './accordition-panel.component';

describe('AccorditionPanelComponent', () => {
  let component: AccorditionPanelComponent;
  let fixture: ComponentFixture<AccorditionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccorditionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccorditionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.header = {};
    component.footer = {};
    component.Items = [];
    component.expanded = true;
    component.hideToggle = true;
    component.togglePosition = '';
    component.collapsedHeight = '';
    component.expandedHeight = '';
    component.displayMode = '';
    component.multi = true;
  });
});
