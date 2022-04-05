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
  selector: 'app-iconbutton',
  templateUrl: './iconbutton.component.html',
  styleUrls: ['./iconbutton.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class IconbuttonComponent implements OnInit {
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
  @Input() clickInterceptor!: (event) => void;
  @ViewChild('iconbutton', { static: true, read: ElementRef }) iconbutton: ElementRef;
  constructor(
    private eventprocessor: EventServiceService,
    private _changeDetectionRef: ChangeDetectorRef,
    private contextService: ContextService,
    private contextActionSevice: ContextActionService,
    private mediaService: MediaService,
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
    let discrepancyUnitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    let subProcessMenuData = this.contextService.getDataByKey("SubprocessMenu");
    if (this.parentuuid !== undefined) {
      if (this.parentuuid.startsWith('#')) {
        this.parentuuid = this.contextService.getDataByString(this.parentuuid);
      }
    }
   if(subProcessMenuData && subProcessMenuData[0].name == "RECEIVING"  &&  this.action !== undefined && this.action.ctype !== "iconbutton"){
    this.text = "Exit";
   } else {
    let isClientAndScreenValid = this.contextService.handleClientAndScreenValidation();
    if(isClientAndScreenValid){
    if (this.text == "Exit" && discrepancyUnitInfo && (discrepancyUnitInfo.CLIENTNAME == "HP" || discrepancyUnitInfo.CLIENTNAME == "DELL")) {
      this.text = "Save & Exit";
      this.icon="save";
    }
   }
  }
  }

  onClick(event) {
    if (this.clickInterceptor) {
      return this.clickInterceptor(event);
    }
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        if (this.text == "Save & Exit" || this.text == "Exit" || this.text == "Exit ") {
          this.contextActionSevice.pauseScreenData(this.actionService);
          // this.contextService.deleteScreenContext();
          // let arr = this.contextService.getDataByKey("menuItems")
          // let ele = arr && arr[arr.length - 1];
          // if (ele) {
          //   ele["completed"] = false;
          // }
          // this.contextService.contextSubjectData("menuItems", arr);
          // if (WC == "BURN_IN" || WC=="OBA" || WC=="MB REPAIR" || WC=="REWORK"|| WC=="DISCREPANCY" || WC=="ASSESSMENT" ||WC=="DEBUG" || WC=="FA-ASSESSMENT" || WC=="QUICK_RESTORE" || WC=="QUOTE MESSAGE" || WC=="QUOTE RESPONSE" || WC=="VFT") {
          //   this.utilityService._saveAndExitApiCall(this.actionService);
          // }
          // this.contextService.deleteDataByKey("menuItems");
          // this.contextService.deleteDataByKey(WC);
        }
        this.eventprocessor.handleEvent(this, event);
      }
    });

    if (this.iconButtonClass === "headeropen-button") {
      this.searchSpecialCharAndScroll();
    }
  }

  searchSpecialCharAndScroll() {
    let aTags = document.querySelectorAll("pdf-viewer .textLayer span");
    const searchText = "";
    let found;
    for (var i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent.includes(searchText)) {
        if (aTags[i + 1].textContent.includes("")) {
          if (aTags[i + 2].textContent.includes("")) {
            found = aTags[i];
            break;
          }
        }
      }
    }
    // found && found.scrollIntoView();
    if (found) {
      const scrollingEle = document.querySelector('pdf-viewer .ng2-pdf-viewer-container');
      let scrollingHeight = found.style.top ? this.getNumber(found.style.top) : 0;
      if (this.getPostionValue(found) === 'absolute') {
        if (this.getPostionValue(found.parentElement) === 'absolute') {
          scrollingHeight += found.parentElement.style.top ? this.getNumber(found.parentElement.style.top) : 0;
          if (this.getPostionValue(found.parentElement.parentElement) === 'absolute') {
            scrollingHeight += found.parentElement.parentElement.style.top ? this.getNumber(found.parentElement.parentElement.style.top) : 0;
          } else {
            scrollingHeight += found.parentElement.parentElement.offsetTop;
          }
        } else {
          scrollingHeight += found.parentElement.offsetTop;
        }
      }
      if (scrollingEle) {
        scrollingEle.scrollTop = scrollingHeight;
      }
    }
  }
  getPostionValue(ele) {
    const style = window.getComputedStyle(ele);
    return style.position;
  }
  getNumber(value: string) {
    return Number(value.slice(0, (value.length - 2)));
  }
}
