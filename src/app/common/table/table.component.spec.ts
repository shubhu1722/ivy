import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { UtilityService } from 'src/app/utilities/utility.service';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      imports:[],
      providers:[UtilityService,EventServiceService,ContextService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
