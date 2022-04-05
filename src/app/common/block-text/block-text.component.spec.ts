import { DatePipe } from '@angular/common';
import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ExpectedConditions } from 'protractor';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';

import { BlockTextComponent } from './block-text.component';

describe('BlockTextComponent', () => {
  let component: BlockTextComponent;
  let fixture: ComponentFixture<BlockTextComponent>;
  let MockContextService:any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTextComponent ],
      imports: [BrowserDynamicTestingModule,MatSnackBarModule ],
      providers: [
        ContextService,
        UtilityService,
        DatePipe,
        { provide:  ContextService, useValue:  MockContextService },
     ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('should TEST INPUT', () => {
    
    component.text = '';
    component.textValue = '';
    component.class = '';
  });

  it('div element should have class  ', () => {
    component.class = "font-size:16px";
    fixture.detectChanges();
    expect(component.class).toEqual("font-size:16px");
  });

  it("it should  check for text" , ()=>{
    component.text = '#text';
    expect(MockContextService.getDataByString).toHaveBeenCalledWith(component.text);

  });
  


});
