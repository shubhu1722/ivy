import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithSearchAndSortComponent } from './table-with-search-and-sort.component';

describe('TableWithSearchAndSortComponent', () => {
  let component: TableWithSearchAndSortComponent;
  let fixture: ComponentFixture<TableWithSearchAndSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableWithSearchAndSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableWithSearchAndSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
