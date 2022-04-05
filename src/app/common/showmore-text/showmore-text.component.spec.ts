import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';

import { ShowmoreTextComponent } from './showmore-text.component';

describe('ShowmoreTextComponent', () => {
  let component: ShowmoreTextComponent;
  let fixture: ComponentFixture<ShowmoreTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowmoreTextComponent ],
      providers:[ContextService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowmoreTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should TEST INPUT', () => {
    component.showMore = true;
    component.text = '';
    component.isShown = true;
    });
});
