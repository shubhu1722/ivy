import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { MediaService } from 'src/app/common/video-cam/media-service';
import { MatDialog } from '@angular/material/dialog';
import { ContextActionService } from 'src/app/services/commonServices/contextActionService/context-action.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from 'src/app/utilities/utility.service';
import { ActionService } from 'src/app/services/action/action.service';

@Component({
  selector: 'app-req-list-button',
  templateUrl: './req-list-button.component.html',
  styleUrls: ['./req-list-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ReqListButtonComponent implements OnInit {
  eventMap = ['click'];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  @Input() color: string;
  @Input() disableRipple: boolean;
  @Input() disabled: boolean;
  @Input() isIconButton: boolean;
  @Input() isRoundButton: boolean;
  @Input() text: string;
  @Input() css: string;
  @Input() submitable: boolean;
  @Input() visibility: boolean;
  @Input() validations: any;
  @Input() labelstyles: string;
  @Input() inputStyles: string;
  @Input() hooks: any;
  @Input() action: any;
  @Input() icon: string;
  @Input() iconcss: string;
  @Input() tooltip: string;
  @Input() tooltipPosition: string;
  @Input() rightsidenav: any;
  @Input() parentuuid: any;
  @Input() targetuuid: any;
  @Input() iconClass: string;
  @Input() iconButtonClass: string;
  @Input() jsontype: string;
  @Input() hidden: boolean;
  @Input() svgIcon: string;
  @Input() textValue: string;
  @Input() textValueClass: string;
  @Input() count: any;
  @ViewChild('iconbutton', { static: true, read: ElementRef }) iconbutton: ElementRef;
  constructor(
    private eventprocessor: EventServiceService,
    private contextService: ContextService,
    private _changeDetectionRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private translate: TranslateService,
    private utilityService: UtilityService,
    private actionService: ActionService
  ) {
    let language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language)
  }

  ngOnInit(): void {
    if(this.count !== undefined){
      if(this.count.startsWith("#")){
        this.count = this.contextService.getDataByString(this.count).toString();
        if(this.count === ""){
          this.count = 0;
        }
      }else{
        this.count = 0;
      }
    }

    this.textValue = "";
  }

  onClick(event) {
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        this.eventprocessor.handleEvent(this, event);
      }
    });
  }
}
