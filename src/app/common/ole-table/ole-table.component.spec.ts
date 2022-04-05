import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OleTableComponent } from './ole-table.component';

describe('OleTableComponent', () => {
  let component: OleTableComponent;
  let fixture: ComponentFixture<OleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
