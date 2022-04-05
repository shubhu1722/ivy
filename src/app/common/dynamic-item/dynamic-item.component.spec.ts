import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { UtilityService } from 'src/app/utilities/utility.service';

import { DynamicItemRender } from './dynamic-item.component';

describe('DynamicItemRender', () => {
	let component: DynamicItemRender;
	let fixture: ComponentFixture<DynamicItemRender>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DynamicItemRender],
			imports:[BrowserDynamicTestingModule,HttpClientTestingModule,MatSnackBarModule,MatDialogModule],
			providers:[ComponentLoaderService, ContextService,UtilityService,HookService,DatePipe]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DynamicItemRender);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should TEST INPUT', () => {
    component.data = [];
    component. contentTitle= [];
    component.contentTextLabel =[];
    component.contentServerLabel= '';
    component.hookMap= [];
  });


});
