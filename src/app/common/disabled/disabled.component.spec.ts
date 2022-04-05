import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';

import { DisabledComponent } from './disabled.component';

describe('DisabledComponent', () => {
  let component: DisabledComponent;
  let fixture: ComponentFixture<DisabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabledComponent ],
      providers: [
        ContextService,
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('div element should have class  ', () => {
    component.disabledClass = "font-size:16px";
    fixture.detectChanges();
    expect(component.disabledClass).toEqual("font-size:16px");
  });
  
   it('div element should have class  ', () => {
    component.uuid = " ";
    fixture.detectChanges();
    expect(component.uuid).toEqual(" ");
  });
});
