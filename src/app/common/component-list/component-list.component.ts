import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { Component, OnInit, Input, ViewChild, ViewContainerRef, ChangeDetectionStrategy, ViewEncapsulation, ComponentFactoryResolver, ViewChildren, QueryList } from '@angular/core';
import { FlexFieldsComponent } from '../flex-fields/flex-fields.component';
import { FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})

export class ComponentListComponent implements OnInit {
  eventMap = ['selectionChange', 'itemclick'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];


  @ViewChild('gridData', { static: true, read: ViewContainerRef }) gridData: ViewContainerRef;
  // @ViewChildren('gridData', { read: ViewContainerRef }) gridData: QueryList<ViewContainerRef>


  @Input() dataGrid: any[];
  @Input() class: string;
  @Input() flexCount: any = 0;
  @Input() componentUUID: any;
  @Input() uuid: any;
  @Input() contaxtArray: string[];
  @Input() disableFields: boolean;
  @Input() flexClass: string;
  @Input() footerButtonUUID: any;
  @Input() group: FormGroup;
  @Input() fieldData: any;

  constructor(
    private contextService: ContextService,
    private componentLoaderService: ComponentLoaderService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _changeDetectionRef: ChangeDetectorRef,
    private translate: TranslateService
  ) { 
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void {
    if (this.flexCount && this.flexCount != undefined) {
      if (this.flexCount.startsWith('#')) {
        this.flexCount = this.contextService.getDataByString(this.flexCount);
      }
    }
    if (this.fieldData && this.fieldData != undefined) {
      if (this.fieldData.startsWith('#')) {
        this.fieldData = this.contextService.getDataByString(this.fieldData);
      }
    }
    if (this.contaxtArray instanceof Array && this.contaxtArray.length > 0) {
      this.contaxtArray.forEach(element => {
        this.contextService.addToContext(element, []);
      });
    }
  }

  counter(flexCount) {
    if (flexCount instanceof Array) {
      return flexCount;
    } else {
      return new Array(flexCount);
    }
  }

  getuuid(i) {
    return i;
  }

  getIndexData(index) {
    if (this.fieldData && this.fieldData[index] !== undefined) {
      return this.fieldData[index];
    } else {
      return null;
    }
  }
}
