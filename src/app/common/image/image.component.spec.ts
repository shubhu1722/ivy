import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageComponent } from './image.component';

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('img field should have styles ', () => {
    component.css = "width:30px";
    fixture.detectChanges();
    expect(component.css).toEqual("width:30px");
  });


it('should TEST INPUT', () => {
  component. eventMap= [];
  component.hookMap = ['beforeAction'];
  component. css= '';
  component.imageSrc= '';
  component.imageClass = '';
});


});
