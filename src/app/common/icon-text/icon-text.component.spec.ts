import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTextComponent } from './icon-text.component';

describe('IconTextComponent', () => {
  let component: IconTextComponent;
  let fixture: ComponentFixture<IconTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('span field should have styles ', () => {
    component.textCSS = "font-size:16px";
    fixture.detectChanges();
    expect(component.textCSS).toEqual("font-size:16px");
  });

  it('image div field should have styles ', () => {
    component.css = "font-size:16px";
    fixture.detectChanges();
    expect(component.css).toEqual("font-size:16px");
  });
});
