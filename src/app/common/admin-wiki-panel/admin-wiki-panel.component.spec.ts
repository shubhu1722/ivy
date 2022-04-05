import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWikiPanelComponent } from './admin-wiki-panel.component';

describe('AdminWikiPanelComponent', () => {
  let component: AdminWikiPanelComponent;
  let fixture: ComponentFixture<AdminWikiPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminWikiPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWikiPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
