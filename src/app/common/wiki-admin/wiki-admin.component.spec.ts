import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiAdminComponent } from './wiki-admin.component';

describe('WikiAdminComponent', () => {
  let component: WikiAdminComponent;
  let fixture: ComponentFixture<WikiAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
