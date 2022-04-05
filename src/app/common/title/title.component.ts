import { Component, OnInit, Input, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdComponent } from 'src/app/model';
import * as $ from 'jquery';

import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { EventServiceService } from '../../services/commonServices/eventService/event-service.service';
import { ActionService } from '../../services/action/action.service';
import { HookService } from '../../services/commonServices/hook-service/hook.service';
declare var $: any;
@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.sass'],
})
export class TitleComponent implements OnInit {
  eventMap = ['click'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() title: string;
  @Input() css: string;
  @Input() titleValue: any;
  @Input() titleValueContextKey: any;
  @Input() visibility: boolean;
  @Input() hidden: boolean;
  @Input() titleClass: string;
  @Input() hooks: any[];
  @Input() isShown: boolean;
  @Input() titleValueClass: string;
  @Input() verifoneLeftSidetooltip:string;
  @Input() tooltipId="tooltipId";
  @Input() isLeftSpan: boolean
  @Input() leftTitleValueClass: string;
  @Input() leftTitleValue: any;

  title1: any;


  constructor(private contextService: ContextService,
    private oElementRef: ElementRef,
    private _changeDetectionRef: ChangeDetectorRef, private translate: TranslateService,
    private eventprocessor: EventServiceService,
    private hookService: HookService ,private actionService:ActionService
  ) {
    let language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language)
  }

  ngOnInit(): void {
    // const list = this.titleValue.reverse();
    this.visibility = this.visibility !== undefined ? this.visibility : true;
    this.isShown = this.isShown !== undefined ? this.isShown : true;
    if (this.titleValue !== undefined) {
      if (this.titleValue && this.titleValue.startsWith('#')) {
        this.titleValue = this.contextService.getDataByString(this.titleValue);
        if (this.titleValue && typeof this.titleValue === 'object') {
          this.titleValue = this.titleValue[this.titleValueContextKey];
        }
      }
    }

    if (this.verifoneLeftSidetooltip) {
      // let ellipsisLength;
      // const clientWidth = document.getElementById(this.tooltipId).clientWidth;
      // if(clientWidth > 210) {
      //   ellipsisLength = clientWidth - 197;
      // } else {
      //   ellipsisLength = (clientWidth - 184) - 1;
      // }
      if (this.verifoneLeftSidetooltip.startsWith('#')) {
        this.verifoneLeftSidetooltip = this.contextService.getDataByString(this.verifoneLeftSidetooltip);
      }
      if (this.verifoneLeftSidetooltip.length < 18) {
        this.verifoneLeftSidetooltip = ""
      }
    }
    
    if (this.titleClass !== undefined) {
      if (this.titleClass.startsWith('#')) {
        this.titleClass = this.contextService.getDataByString(this.titleClass);
      }
    }
  }

//   ngAfterViewInit(){
//     $(document).ready(function(){
//       $("#tooltipId").click(function(){
//       $(this).hide();
//       });
//     });
// }

  ngAfterViewInit() {

    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
    const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
    if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
      this.hookService.handleHook(afterInitHooks, this);
    }
    }
  }
  onTextClick(event) {
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        this.eventprocessor.handleEvent(this, event);
      }
    });
  }


}
