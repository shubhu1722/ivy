import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiTableSearchAndSortComponent } from './wiki-table-search-and-sort.component';

describe('WikiTableSearchAndSortComponent', () => {
  let component: WikiTableSearchAndSortComponent;
  let fixture: ComponentFixture<WikiTableSearchAndSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiTableSearchAndSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiTableSearchAndSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
