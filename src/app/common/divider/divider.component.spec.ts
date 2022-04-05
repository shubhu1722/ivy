import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DividerComponent } from './divider.component';

describe('DividerComponent', () => {
  let component: DividerComponent;
  let fixture: ComponentFixture<DividerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DividerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('divider field should have styles ', () => {
    component.css = "font-size:16px";
    fixture.detectChanges();
    expect(component.css).toEqual("font-size:16px");
  });

  it('should TEST INPUT', () => {
    component.inset = true;
    component.vertical = true;
    component.css = '';
    component.dividerClass = '';
    component.eventMap = [];
    component.hookMap = [];
    
  });
});
