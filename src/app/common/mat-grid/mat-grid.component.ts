import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { ActionService } from 'src/app/services/action/action.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from 'src/app/utilities/utility.service';

@Component({
  selector: 'app-mat-grid',
  templateUrl: './mat-grid.component.html',
  styleUrls: ['./mat-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class MatGridComponent implements OnInit, AfterViewInit {
  @Input() cols: number;
  @Input() rowHeight: string;
  @Input() gutterSize: string;
  @Input() colspan: number;
  @Input() rowspan: number;
  @Input() tiles: any;
  @Input() hooks: string[] = [];
  @Input() actions: any;
  @Input() validations: string[];
  @Input() FlexFieldName: string;
  @Input() footerActions: any[];
  @Input() className:any;
  @Input() dynamicCols: string;
  @Input() disabled: any;
  @Input() tileClass : any;
  // @ViewChild('expansionpanelcontent', { static: true, read: ViewContainerRef }) expansionpanelcontent: ViewContainerRef;
  imageClass:String
  selectedvalue: any;
  screenWidth: number;
  colsNo: number;
  count: number = 1;
  eventMap = ['click', 'onLoad'];
  hookMap = ['beforeInit', 'afterInit', 'beforeAction', 'afterAction'];
  // forEach: any;

  constructor(
    private eventprocessor: EventServiceService,
    private contextService: ContextService,
    private actionservice: ActionService,
    private utilityService: UtilityService,
    private _changeDetectionRef: ChangeDetectorRef,
    translate: TranslateService
  ) { 
    let language = localStorage.getItem('language');
      translate.setDefaultLang(language);
      translate.use(language)
  }

  ngOnInit(): void { 
    if (this.utilityService.isString(this.tiles) && this.tiles.startsWith("#")){
      this.tiles = this.contextService.getDataByString(this.tiles)
     
    }
    this.tiles.forEach(tile => {
      tile.isDellScreen  = (tile.dellReceiving || tile.dellCarReceiving) ? true : false;
    });
    if(this.dynamicCols == "dynamic"){
      this.cols =  this.tiles.length;
    }
  }
  ngAfterViewInit() {
    this.tiles.forEach(tile => {
      if (tile.isDefault === 'true') {
        var isComponentThere = this.contextService.getDataByKey(tile.targetuuid + 'ref');
        if (isComponentThere === undefined) {
          tile.template.config.data.footerActions = this.footerActions;
          this.actionservice.handleAction(tile.template, this);
        } else {
          isComponentThere.destroy();
          this.contextService.deleteDataByKey(tile.targetuuid + 'ref');
          this.actionservice.handleAction(tile.template, this);
        }
      }
    });
    const event = { type: 'onLoad' };
    this.gridActionProcessor(event);
  }
  clickEvent(tile, event) {
    if (tile.isDefault !== 'true') {
      var isComponentThere = this.contextService.getDataByKey(tile.targetuuid + 'ref');
      if (tile?.prechecks && Array.isArray(tile.prechecks)){
        tile.prechecks.forEach((ele) => {
          this.actionservice.handleAction(ele, this);
        });
      }
      if (tile.precondition !== undefined && tile.precondition !== null) {
        let isFlexField = this.actionservice.handleCustomecode(tile.precondition, tile, tile.precondition.type)
        if (isFlexField) {
          this.renderTempelate(tile);
          if(tile.actions !== undefined){
            tile.actions.forEach((ele) => {
              this.actionservice.handleAction(ele, this);
            });
          }
          /// We need to allow multiple accessories of same type - CR #26
          // if (isComponentThere === undefined) {
          //   this.actionservice.handleAction(tile.template, this);
          // } else {
          //   isComponentThere.destroy();
          //   this.contextService.deleteDataByKey(tile.targetuuid + 'ref');
          //   this.actionservice.handleAction(tile.template, this);
          // }
        }
      } else {
        if (isComponentThere === undefined) {
          this.renderTempelate(tile)
          
        } else {
          isComponentThere.destroy();
          this.contextService.deleteDataByKey(tile.targetuuid + 'ref');
         
          this.renderTempelate(tile)
        }
      }

      if(tile.executePlainActions == true){
        let isFlexField = this.actionservice.handleCustomecode(tile.precondition, tile, tile.precondition.type)
        // console.log(isFlexField)
        if(isFlexField){
          tile.actions.map((x)=>{
            this.actionservice.handleAction(x, this);
          })
        }
      }
      this.gridActionProcessor(event);
    }
  }
  renderTempelate(tile){
    if (Array.isArray(tile.template)) {
      tile.template.forEach((template) => {
        this.actionservice.handleAction(template, this);
      });
    }
    else {
      this.actionservice.handleAction(tile.template, this);
    }
  }
  gridActionProcessor(event) {
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        this.eventprocessor.handleEvent(this, event);
      }
    });
  }

  getWidth() {
    // getting screen width.
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };

    if (this.screenWidth <= 1024) {
      this.colsNo = this.cols - 4;
    } else if (this.screenWidth <= 1260) {
      this.colsNo = this.cols - 2;
    } else if (this.screenWidth < 1360) {
      this.colsNo = this.cols - 1;
    } else if (this.screenWidth == 1360) {
      this.colsNo = this.cols;
    } else if (this.screenWidth <= 1600) {
      this.colsNo = this.cols + 1;
    } else if (this.screenWidth <= 1920) {
      this.colsNo = this.cols + 2;
    } else if (this.screenWidth <= 2560) {
      this.colsNo = this.cols + 3;
    } else if (this.screenWidth <= 3840) {
      this.colsNo = this.cols + 4;
    } else {
      this.colsNo = 2;
    }
    return this.colsNo;
  }
}
