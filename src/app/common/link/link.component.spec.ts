import {HttpClientModule } from '@angular/common/http';
import {HttpClientTestingModule } from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkComponent ],
      imports:[HttpClientModule,BrowserDynamicTestingModule,HttpClientTestingModule],
      providers:[]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit click event and execute the function.',fakeAsync(() => {
    spyOn(component, 'onLinkClick');
    const input = fixture.debugElement.nativeElement.querySelector('a');
    input.dispatchEvent(new Event('click',null))
    tick();
    fixture.detectChanges()
      expect(component.onLinkClick).toHaveBeenCalled();
  }));

  it('label field should have styles ', () => {
    component.linkcss = "font-size:16px";
    fixture.detectChanges();
    expect(component.linkcss).toEqual("font-size:16px");
  });
 it('should TEST INPUT', () => {
    component.eventMap = [];
    component. hookMap= [];
    component.href =[];
    component.linkstyle= '';
    component.linkcss= '';
  });

});
