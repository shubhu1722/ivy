import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';

import { PassiveLinkComponent } from './passive-link.component';

describe('PassiveLinkComponent', () => {
  let component: PassiveLinkComponent;
  let fixture: ComponentFixture<PassiveLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassiveLinkComponent ],
      imports:[BrowserDynamicTestingModule,HttpClientTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule,MatAutocompleteModule],
      providers:[EventServiceService, DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassiveLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit keydown event and execute the function.', fakeAsync(() => {
    spyOn(component, 'onLinkClick');
    const input = fixture.debugElement.nativeElement.querySelector('a');
    input.dispatchEvent(new Event('click', null))
    tick();
    fixture.detectChanges()
    expect(component.onLinkClick).toHaveBeenCalled();
  }));
  it('should TEST INPUT', () => {
    
    component.linkClass = '';
    component.actions = [];
    component. name = '';
    component.visibility = true;
    component.eventMap = [];
    component. hookMap = [];
  });
});
