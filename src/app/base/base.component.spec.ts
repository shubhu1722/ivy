import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentLoaderService } from '../services/commonServices/component-loader/component-loader.service';
import { ContextService } from '../services/commonServices/contextService/context.service';
import { MetadataService } from '../services/commonServices/metadataService/metadata.service';

import { BaseComponent } from './base.component';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      
      declarations: [ BaseComponent ],
      imports: [BrowserDynamicTestingModule,HttpClientTestingModule,BrowserDynamicTestingModule ],
      providers: [
         ComponentLoaderService,
         ContextService,
         MetadataService,
     ]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
