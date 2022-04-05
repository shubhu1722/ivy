import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingWikiComponent } from './pending-wiki.component';

describe('PendingWikiComponent', () => {
  let component: PendingWikiComponent;
  let fixture: ComponentFixture<PendingWikiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingWikiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
