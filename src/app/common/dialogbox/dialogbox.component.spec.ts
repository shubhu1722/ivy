import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';


import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';

import { DialogboxComponent } from './dialogbox.component';

describe('DialogboxComponent', () => {
  let component: DialogboxComponent;
  let fixture: ComponentFixture<DialogboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogboxComponent ],
      imports: [BrowserDynamicTestingModule,MatDialogModule,MatDialogRef,MAT_DIALOG_DATA,MatDialog],
      providers: [
        ContextService,
        ComponentLoaderService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('set placeholder some default value', () => {
    component.data = {title:'title'};
    expect(component.data).toContain({title:'title'});
  });
  it('set placeholder some default value', () => {
    component.data = {message:'message'};
    expect(component.data).toContain({message:'message'});
  });
});
