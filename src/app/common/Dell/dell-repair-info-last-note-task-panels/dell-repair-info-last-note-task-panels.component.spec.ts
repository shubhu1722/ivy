import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DellRepairInfoLastNoteTaskPanelsComponent } from './dell-repair-info-last-note-task-panels.component';

describe('DellRepairInfoLastNoteTaskPanelsComponent', () => {
  let component: DellRepairInfoLastNoteTaskPanelsComponent;
  let fixture: ComponentFixture<DellRepairInfoLastNoteTaskPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DellRepairInfoLastNoteTaskPanelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DellRepairInfoLastNoteTaskPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
