import { DatePipe } from '@angular/common';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UtilityService } from 'src/app/utilities/utility.service';

import { ImageGridComponent } from './image-grid.component';

describe('ImageGridComponent', () => {
  let component: ImageGridComponent;
  let fixture: ComponentFixture<ImageGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageGridComponent ],
      imports:[MatSnackBarModule],
      providers:[UtilityService,DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit click event and execute the function.', fakeAsync(() => {
    spyOn(component, 'click');
    const input = fixture.debugElement.nativeElement.querySelector('a');
    input.dispatchEvent(new Event('click', null))
    tick();
    fixture.detectChanges()
    expect(component.click).toHaveBeenCalled();
  }));
  it('should TEST INPUT', () => {
    component.imglist= '';
    component.imgUrlParam = '';
    component. uuid = '';
    component.name= '';
    component.text = '';
    component. uuid = '';
    component.class= '';
    component.selectedImage = '';
    component. selectedImageIndex = '';
  });
});
