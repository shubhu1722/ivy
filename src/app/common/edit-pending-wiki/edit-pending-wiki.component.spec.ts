import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPendingWikiComponent } from './edit-pending-wiki.component';

describe('EditPendingWikiComponent', () => {
  let component: EditPendingWikiComponent;
  let fixture: ComponentFixture<EditPendingWikiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPendingWikiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPendingWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
