import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPanelComponent } from './tab-panel.component';

describe('TabPanelComponent', () => {
  let component: TabPanelComponent;
  let fixture: ComponentFixture<TabPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should TEST INPUT', () => {
    component.animationDuration = '';
    component.backgroundColor = '';
    component.color = '';
    component.disablePagination = true;
    component.disableRipple = true;
    component.dynamicHeight = true;
    component.headerPosition = '';
    component.selectedIndex = 2;
    component.disabled = true;
    component.position = 2;
    component.tabstyle = '';
    component.tabcss = '';
    component.tabactive = '';
    component.label = '';
  });
});
