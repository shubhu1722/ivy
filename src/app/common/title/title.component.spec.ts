import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';

import { TitleComponent } from './title.component';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleComponent ],
      imports:[],
      providers:[ContextService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('p field should have styles ', () => {
    component.css = "font-size:16px";
    fixture.detectChanges();
    expect(component.css).toEqual("font-size:16px");
  });

  it('should TEST INPUT', () => {
    component.title = '';
    component.css = '';
    component.titleValue = '';
    component.visibility = true;
    component.hidden = false;
    component.titleClass = '';
    component.isShown = true;
    component.titleValueClass = '';
    
  });
});
