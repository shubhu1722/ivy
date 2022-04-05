import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { LoggerService } from 'src/app/services/commonServices/loggerService/logger.service';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { FormGroup, FormControl } from '@angular/forms';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-panel',
  templateUrl: './form-panel.component.html',
  styleUrls: ['./form-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class FormPanelComponent implements OnInit {
  @Input() header: {};
  @Input() footer: any[];
  @Input() items: any = [];
  @Input() css: any;
  @Input() uuid: any;
  @Input() tileActions: any;
  @Input() footerStyles: string;
  @Input() footerClass: string;
  @Input() parentuuid: string;
  @Input() targetuuid: any;
  @Input() accessoryName: any;
  @Input() formPanelClass: string;
  @Input() formContainerClass: string;
  @Input() footerActions: any[];
  componentUUID: any;
  @ViewChild('formContent', { static: true, read: ViewContainerRef })
  formContent: ViewContainerRef;
  @ViewChild('footerContent', { static: true, read: ViewContainerRef })
  footerContent: ViewContainerRef;
  @ViewChild('formpanel', { static: true, read: ViewContainerRef })
  formpanel: ViewContainerRef;

  constructor(
    private componentLoaderService: ComponentLoaderService,
    private contextService: ContextService,translate: TranslateService
    ) { 
      let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
    }

  ngOnInit(): void {
    this.componentUUID = this.uuid;
    this.uuid = new FormGroup({});
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      this.uuid.addControl(
        this.items[i].name,
        new FormControl(this.items[i].value)
      );
    }
    this.items.forEach((item) => {
      item.group = this.uuid;
      item.parentuuid = this.componentUUID;
      item.targetuuid = this.componentUUID;
      /// Handling multiple nested panels case
      item.footerActions = this.footerActions !== undefined &&
        this.footerActions.length > 0 ? this.footerActions : (this.footer && this.footer.length > 0 ?
          this.footer[0].actions : []);
      this.componentLoaderService.parseData(item, this.formContent);
    });
    if (this.footer && this.footer.length > 0) {
      this.footer.forEach((item) => {
        item.group = this.uuid;
        this.componentLoaderService.parseData(item, this.footerContent);
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onExpanedTrue()
    }, 300)
  }

  onExpanedTrue() {
    let data = this.items.filter(ele => ele.ctype === "textField");
    data = data.filter(ele => ele.focus === undefined)
    if (data.length > 0) {
      let txtfield = this.contextService.getDataByKey(data[0].uuid + "ref")
      // console.log(txtfield);
      txtfield.instance.textFieldRef.nativeElement.focus()
      txtfield.instance.textFieldRef.nativeElement.autofocus = true;
    }
  }

}
