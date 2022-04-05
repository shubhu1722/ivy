import { ActionService } from 'src/app/services/action/action.service';
import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, ViewChild, ViewContainerRef, ElementRef, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { ComponentLoaderService } from 'src/app/services/commonServices/component-loader/component-loader.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { ComponentService } from 'src/app/services/commonServices/componentService/component.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { EventServiceService } from 'src/app/services/commonServices/eventService/event-service.service';
import { HookService } from 'src/app/services/commonServices/hook-service/hook.service';
import { TranslateService } from '@ngx-translate/core';
import { VFTService } from 'src/app/services/hp/VFTService/vft.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-task-panel',
  templateUrl: './task-panel.component.html',
  styleUrls: ['./task-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TaskPanelComponent implements OnInit {
  @Input() header: any = {};
  @Input() footer: any = [];
  @Input() items: any[];
  @Input() hooks: any;
  @Input() disabled: any;
  @Input() expanded: any;
  @Input() hideToggle: boolean;
  @Input() togglePosition: string;
  @Input() collapsedHeight: string;
  @Input() expandedHeight: string;
  @Input() displayMode: string;
  @Input() multi: boolean;
  @Input() uuid: FormGroup;
  @Input() name: string
  @Input() isEditable: boolean = false;
  @Input() isMandatory: boolean = false;
  @Input() hidden: any;
  @Input() bodyCss: string;
  @Input() errorMessage: string;
  @Input() iconClass: string;
  @Input() leftDivclass: string;
  @Input() rightDivclass: string;
  @Input() topItemsClass: string;
  @Input() ItemsClass: string;
  @Input() columnWiseTitle: any;
  @Input() splitView: any;
  @Input() verticalsplitView: any;
  @Input() spaceView: any;
  @Input() rightItems: any[];
  @Input() topItems: any[];
  @Input() headerTitleLabels: string[];
  @Input() headerTitleValues: string[];
  @Input() inputClasses: string[];
  @Input() isblueBorder: boolean;
  @Input() isyellowBorder: boolean;
  @Input() taskPanelHeaderClass: string;
  @Input() bodyClass;
  @Input() intialTaskpanel: boolean;
  @Input() contentSecondHalfClass: string;
  nestedFormGroup: FormGroup;
  @Input() headerClasses: string[];
  @Input() panelClass: string;
  @Input() headerStatusClass;
  @Input() ignoreFocus: boolean = false;
  @Input() setDisabled: any;
  @Input() isKeepExpanded: any;
  @Input() reworkClass: string;
  @Input() isReworkClass: boolean;
  @Input() actions:any;
  @Input() forceDisabled: boolean = false;
  @ViewChild('expansionpanelcontent', { static: true, read: ViewContainerRef }) expansionpanelcontent: ViewContainerRef;
  @ViewChild('expansionpanelfooter', { static: true, read: ViewContainerRef }) expansionpanelfooter: ViewContainerRef;
  @ViewChild('expansionPanelContentFirstHalf', { static: true, read: ViewContainerRef }) expansionPanelContentFirstHalf: ViewContainerRef;
  @ViewChild('expansionPanelContentSecondHalf', { static: true, read: ViewContainerRef }) expansionPanelContentSecondHalf: ViewContainerRef;
  @ViewChild('expansionPanelContentTopHalf', { static: true, read: ViewContainerRef }) expansionPanelContentTopHalf: ViewContainerRef;

  @ViewChildren("head") public head: QueryList<ElementRef>;

  @ViewChild('matPanel') matPanel;
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  eventMap = [
    'beforePanelOpened',
    'beforePanelClosed',
    'afterPanelClosed',
    'afterPanelOpened',
    'click'
  ];

  UUID: any;


  constructor(private componentLoaderService: ComponentLoaderService,
    private eventProcessor: EventServiceService,
    private _changeDetectionRef: ChangeDetectorRef,
    private contextService: ContextService, private hookService: HookService,
    private oElementRef: ElementRef,
    private actionService: ActionService,
    private componentService: ComponentService,
    private utiliyService: UtilityService,
    private translate: TranslateService,
    private vftService: VFTService
  ) {
    let language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language)
  }

  ngOnInit(): void {
    if (this.expanded === 'true') {
      this.expanded = true;
    }
    if (this.verticalsplitView == undefined || this.verticalsplitView == "") {
      this.verticalsplitView = false;
    }
    if (this.header.title && this.header.title.startsWith('#')) {
      this.header.title = this.contextService.getDataByString(this.header.title);
    }
    this.UUID = this.uuid;
    this.uuid = new FormGroup({});
    if (!this.splitView) {
      this.bodyClass = 'padding-top-15 content-padding';
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      this.uuid.addControl(this.items[i].name, new FormControl(this.items[i].value));
      if (this.items[i].nestedFormGroup !== undefined) {
        this.nestedFormGroup = new FormGroup({});
        let bomCount;
        if (this.items[i].boms && this.items[i].boms !== undefined) {
          bomCount = this.contextService.getDataByString(this.items[i].boms);
          bomCount = this.sortArry(bomCount);
        }
        for (let j = 0; j < bomCount; j++) {
          for (let k = 0; k < this.items[i].names.length; k++) {
            this.nestedFormGroup.addControl(this.items[i].names[k] + j, new FormControl());
          }
        }
      }
    }
    this.contextService.addToContext('expansionpanelcontent', this.expansionpanelcontent);
    this.contextService.addToContext('expansionPanelContentFirstHalf', this.expansionPanelContentFirstHalf);
    this.contextService.addToContext('expansionPanelContentTopHalf', this.expansionPanelContentTopHalf);
    this.items.forEach((item) => {

      if (this.nestedFormGroup && this.nestedFormGroup !== undefined) {
        item.group = this.nestedFormGroup;
      } else {
        item.group = this.uuid;
      }
      if (this.footer !== undefined && this.footer.length > 0) {
        let footerIndex = 0;
        if (this.footer.length > 1) {
          footerIndex = 1;
        }
        item.footerActions = this.footer[footerIndex].actions;
        item.footerButtonUUID = this.footer[footerIndex].uuid;
      }
      if (item.targetId !== undefined) {
        const targetRef = this.contextService.getDataByKey(item.targetId + 'ref').instance[item.targetViewChild];
        this.componentLoaderService.parseData(item, targetRef);
      } else {
        this.componentLoaderService.parseData(item, this.expansionpanelcontent);
      }
    });

    if (this.rightItems !== undefined) {
      for (let i = 0; i < this.rightItems.length; i++) {
        if (this.rightItems[i].items !== undefined && this.rightItems[i].items.length > 0) {
          this.addControls(this.rightItems[i]);
        } else {
          this.uuid.addControl(
            this.rightItems[i].name,
            new FormControl(this.rightItems[i].value)
          );
        }


        if (this.rightItems[i].ctype === 'table') {
          this.rightItems[i].datasource.forEach((x) => {
            Object.keys(x).forEach((key) => {
              if (Array.isArray(x[key])) {
                x[key].forEach((y) => {
                  if (y.name !== undefined) {
                    this.uuid.addControl(
                      y.name,
                      new FormControl(y.value)
                    );
                  }
                })
              } else {
                this.uuid.addControl(
                  x[key].name,
                  new FormControl(x[key].value)
                );
              }
            });
          });
        }
      }

      /// clear the existing
      this.rightItems.forEach((item) => {
        item.group = this.uuid;
        this.componentLoaderService.parseData(
          item, this.expansionPanelContentFirstHalf
        );
      });

    }

    if (this.topItems !== undefined) {
      for (let i = 0; i < this.topItems.length; i++) {
        if (this.topItems[i].items !== undefined && this.topItems[i].items.length > 0) {
          this.addControls(this.topItems[i]);
        } else {
          this.uuid.addControl(
            this.topItems[i].name,
            new FormControl(this.topItems[i].value)
          );
        }
      }

      this.topItems.forEach((item) => {
        item.group = this.uuid;
        this.componentLoaderService.parseData(
          item, this.expansionPanelContentTopHalf
        );
      });
    }

    this.footer.forEach((item) => {
      if (this.nestedFormGroup && this.nestedFormGroup != undefined) {
        item.group = this.nestedFormGroup;
        if (item.ctype === "button") {
          item.parentuuid = this.UUID;
        }
        this.componentLoaderService.parseData(item, this.expansionpanelfooter);
      } else {
        item.group = this.uuid;
        if (item.ctype === "button") {
          item.parentuuid = this.UUID;
        }
        this.componentLoaderService.parseData(item, this.expansionpanelfooter);
      }
      if (item.name) {
        item.group.addControl(
          item.name,
          new FormControl(null)
        );
      }
    });

    if (this.setDisabled) {
      const setDisabled = this.setDisabled;
      let data: any = this.actionService.getContextorNormalData(setDisabled.lhs, "");
      let isConditionValid = this.actionService.isConditionValid({ lhs: data, rhs: setDisabled.rhs, operation: setDisabled.operation }, this);

      if (isConditionValid) {
        this.disabled = false;
      }
    }
    //cisco-Rework
    if (this.isReworkClass == undefined) {
      this.isReworkClass = false
    } else if (this.isReworkClass) {
      if (this.reworkClass != undefined) {
        this.reworkClass = "body " + this.reworkClass;
      }
      else {
        this.reworkClass = "body greyish-black"
      }
    } else {
      this.reworkClass = "body greyish-black"
    }

    if (this.expanded && this.intialTaskpanel) {
      this.items.forEach((item) => {
        if (item.name) {
          let isItemNameExisting = this.contextService.getDataByKey(item.name);
          if (item.name && isItemNameExisting == undefined) {
            let uuid = {
              "name": item.name,
              "ctype": item.ctype,
              "uuid": item.uuid,
              "value": item.group.controls[item.name].value
            }
            this.contextService.addToContext(item.name, uuid);
          }
        }
      })
      this.rightItems && this.rightItems.forEach((item) => {
        if (item.name) {
          let isItemNameExisting = this.contextService.getDataByKey(item.name);
          if (item.name && isItemNameExisting == undefined) {
            let uuid = {
              "name": item.name,
              "ctype": item.ctype,
              "uuid": item.uuid,
              "value": item.group.controls[item.name].value
            }
            this.contextService.addToContext(item.name, uuid);
          }
        }
      })
      this.footer !== undefined && this.footer.length && this.footer.forEach((item) => {
        if (item.name) {
          let uuid = {
            "name": item.name,
            "ctype": item.ctype,
            "uuid": item.uuid
          }
          this.contextService.addToContext(item.name, uuid);
        }
      })
    }

  }

  addControls(currentRightSideItem) {
    let ScreenMenuObj = this.contextService.getDataByKey("ScreenMenuObj");
    currentRightSideItem.items.forEach((item) => {
      if (item.name !== undefined) {
        this.uuid.addControl(
          item.name,
          new FormControl(item.value)
        );
      }
      if (ScreenMenuObj && ScreenMenuObj.completed) {
        item["disabled"] = true;
      }
      if (item.items != undefined && item.items.length > 0) {
        this.addControls(item);
      }
    })
  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }
    if (this.expanded === true && this.ignoreFocus === false) {
      this.onExpanedTrue()
    }

  }

  statusIconClick(event) {
    this.eventMap.forEach((ele) => {
      if (ele === event.type) {
        this.eventProcessor.handleEvent(this, event);
      }
    });
  }



  onHeaderClicktaskpanelexpandfalse() {

    if(this.forceDisabled) {
      // Do nothing if task is force disabled, exit from this method
      return;
    }
    
    if (this.expanded === false) {
      //let refData = this.contextService.getDataByKey("pageUUIDref");
      if (this.header && this.header.statusClass) {
        if (this.header.statusClass === "complete-status" && this.isEditable === true) {
          this.disabled = false;
          this.expanded = true;
          this.contextService.collapseAllfromContext(this.header);
          this._changeDetectionRef.detectChanges();
        } else if (this.header.statusClass === "complete-status") {
          if( this.disabled ){
            this.expanded = false;
            this.matPanel.close();
            this._changeDetectionRef.detectChanges();
          }else{
          this.expanded = true;
          this.contextService.collapseAllfromContext(this.header);
          this._changeDetectionRef.detectChanges();
          }
        } else if (this.header.statusClass === "eco-icon") {
          this.expanded = true;
          this.contextService.collapseAllfromContext(this.header);
          this._changeDetectionRef.detectChanges();
        } else if (this.header.statusClass === "incomplete-status") {
          let currenttaskpanel = this.contextService.getDataByKey("currentTaskPanelUUID");
          let refData = this.contextService.getDataByKey("pageUUIDref");
          let taskpanels = refData.instance.items.filter(({ ctype }) => ctype == "taskPanel");
          let nothiddentaskpanels = [];//not hidden task panels filter
          for (let i = 0; i < taskpanels.length; i++) {
            let pageitemsstatus = this.contextService.getDataByKey(taskpanels[i].uuid + "ref");
            if ( pageitemsstatus && pageitemsstatus.instance && pageitemsstatus.instance.hidden !== true) { // filtering taskpanels that are not in hidden state
              nothiddentaskpanels.push(taskpanels[i]);
            }
          }
          let index = nothiddentaskpanels.findIndex(itemObj => itemObj.uuid === this.UUID);//index
          let canExpand = false;
          if (currenttaskpanel && currenttaskpanel !== undefined && currenttaskpanel !== null) {
            let currenttaskpanelref = this.contextService.getDataByKey(currenttaskpanel + "ref");
            if (currenttaskpanelref && currenttaskpanelref !== null && currenttaskpanelref !== undefined) {
              if (currenttaskpanelref.instance.isMandatory === false && currenttaskpanelref.instance.header.statusClass === undefined) {
                //added null check for element
                if(nothiddentaskpanels[index - 1]){
                  if (nothiddentaskpanels[index - 1].uuid === currenttaskpanelref.instance.UUID) {
                    canExpand = true;
                  }
                  //as exception for rework screen as dynamic task panel not getting filtered above as part of taskpanel we are using below code.
                  else if((this.UUID == "reworkrecordRamDetailsUUID" || this.UUID == "repairhddDetailsTaskPanelUUID" || this.UUID == "customerDesNumberUUID") && currenttaskpanelref.instance.UUID.startsWith("reworkPartTaskPanelUUID")){
                    canExpand = true;
                  }
                }
              } else {
                if (currenttaskpanelref.instance.UUID === this.UUID || this.disabled === false) {
                  canExpand = true;
                }
              }
            }
          } else if (currenttaskpanel === undefined && this.disabled !== true) {
            canExpand = true;
          }
          if (canExpand) {
            this.expanded = true;
            this.contextService.collapseAllfromContext(this.header);
          } else {
            this.expanded = false;
            this.matPanel.close();
          }
          this._changeDetectionRef.detectChanges();
        }
      } else {
        // For ECO's we dont have this.header.statusClass
        // If the task panel has disabled true, do not expand it
        if (this.disabled == false || this.disabled == undefined) {
          this.expanded = true;
          this.contextService.collapseAllfromContext(this.header);
          this._changeDetectionRef.detectChanges();
        }
      }
    }
    else if (this.disabled == false && this.expanded === true) {
      this.contextService.collapseTaskPanel();
      if (this.isKeepExpanded != undefined && this.isKeepExpanded != null) {
        if (this.isKeepExpanded == true || this.isKeepExpanded == "true") {

        } else {
          this.expanded = false;
          this._changeDetectionRef.detectChanges();
        }
      } else {
        this.expanded = false;
        this._changeDetectionRef.detectChanges();
      }
    }
    else if (this.disabled == undefined && this.expanded === true) {
      this.contextService.collapseTaskPanel();
      if (this.isKeepExpanded != undefined && this.isKeepExpanded != null) {
        if (this.isKeepExpanded == true || this.isKeepExpanded == "true") {

        } else {
          this.expanded = false;
          this._changeDetectionRef.detectChanges();
        }
      } else {
        this.expanded = false;
        this._changeDetectionRef.detectChanges();
      }
    }

   this.actions && this.actions.length && this.actions.forEach((ele) => {
      if (ele.eventSource === "onHeaderClick") {
        this.actionService.handleAction(ele, this);
      }
    })
  }

  afterPanelExpand() {
    if (!!this.oElementRef && !!this.oElementRef.nativeElement)
      this.oElementRef.nativeElement.scrollIntoView();
    this.items.forEach((item) => {
      let isItemNameExisting = this.contextService.getDataByKey(item.name);
      if (item.name && isItemNameExisting == undefined) {
        let uuid = {
          "name": item.name,
          "ctype": item.ctype,
          "uuid": item.uuid,
          "value": item.group.controls[item.name].value
        }
        this.contextService.addToContext(item.name, uuid);
      }
    })
    this.rightItems && this.rightItems.forEach((item) => {
      if (item.name) {
        let isItemNameExisting = this.contextService.getDataByKey(item.name);
        if (item.name && isItemNameExisting == undefined) {
          let uuid = {
            "name": item.name,
            "ctype": item.ctype,
            "uuid": item.uuid,
            "value": item.group.controls[item.name].value
          }
          this.contextService.addToContext(item.name, uuid);
        }
      }
    })
    this.footer !== undefined && this.footer.length && this.footer.forEach((item) => {
      if (item.name) {
        let uuid = {
          "name": item.name,
          "ctype": item.ctype,
          "uuid": item.uuid
        }
        this.contextService.addToContext(item.name, uuid);
      }
    })
    if (this.expanded === true && this.ignoreFocus === false) {
      this.onExpanedTrue()

      // specific for IQA and ECO booking
      let instance = this.contextService.getDataByKey('defectsOrActionsUUIDref');
      // if (instance && instance !== undefined) {
      //   if (this.name && this.name === "revisedBarcode") {
      //     let disabledComponent = [
      //       {
      //         "type": "updateComponent",
      //         "config": {
      //           "key": "defectsOrActionsUUID",
      //           "properties": {
      //             "expanded": true,
      //             "disabled": false
      //           }
      //         }
      //       }
      //     ]
      //     disabledComponent.forEach((ele) => {
      //       this.actionService.handleAction(ele, instance);
      //     });
      //   } else {
      //     if (this.name !== "defectsOrActionsUUID") {
      //       let enabledComponent = [
      //         {
      //           "type": "updateComponent",
      //           "config": {
      //             "key": "defectsOrActionsUUID",
      //             "properties": {
      //               "expanded": false,
      //               "disabled": false
      //             }
      //           }
      //         }
      //       ]
      //       enabledComponent.forEach((ele) => {
      //         this.actionService.handleAction(ele, instance);
      //       });
      //     }
      //   }
      // }
      if (this.header.title == "Mother Board part number" || this.header.title == "Confirm Accessories (required for VFT)") {
        // this.onHeaderClicktaskpanelexpandfalse();
      }
    }

  }

  // below function is only used for recorunitPartInformation(CISCO).
  sortArry(item) {
    let previosData = "";
    let margedData = item.TAN_IN.concat(item.BOMLIST);
    let dataArray = [];
    margedData = margedData.sort(function (a, b) {
      var nameA = a.assemblyCode;
      var nameB = b.assemblyCode;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    });
    margedData.forEach(element => {
      let compairStr = element.assemblyCode.substring(0, element.assemblyCode.length - 1);
      if (compairStr !== previosData) {
        previosData = compairStr;
        let temp = margedData.filter((ele) => ele.assemblyCode.includes(compairStr));
        dataArray.push(temp);
      }
    });
    return dataArray.length;
  }

  onExpanedTrue() {
    let data;
    // just for VFT Screen ----Start
    let vftAutoComplete = this.vftService.vftAutoCompletefocusDetails(this.header.title);
    if(vftAutoComplete){
      data = this.items.filter(ele => ele.ctype === "textField" || ele.ctype === "autoComplete");
    } else{
      data = this.items.filter(ele => ele.ctype === "textField");
    }
    // just for VFT Screen ----End
    let currenttaskUUID = this.contextService.getDataByKey('currentTaskPanelUUID');

    data = data.filter(ele => ele.focus == undefined || ele.focus == false);
    data = data.filter(ele => ele.readonly == undefined);
    data = data.filter(ele => ele.hidden == undefined || ele.hidden == false);

    setTimeout(() => {
      if (data.length > 0 && data[0].ctype == "autoComplete") {
        let uuid = data[0].uuid;
        uuid = uuid.replace("DDUUID", "TxtUUID");
        this.contextService.getDataByKey(`${uuid}ref`).instance?.textFieldRef?.nativeElement.focus();
        if(this.contextService.getDataByKey(`${uuid}ref`).instance?.textFieldRef){
        this.contextService.getDataByKey(`${uuid}ref`).instance.textFieldRef.nativeElement.autofocus = true;
        }
      } else {
        if (data.length > 0 && data[0].uuid == currenttaskUUID) {
          let txtfield = this.contextService.getDataByKey(data[0].uuid + "ref");
          txtfield.instance.textFieldRef.nativeElement.focus();
          txtfield.instance.textFieldRef.nativeElement.autofocus = true;
        } else if (data && data.length > 0) {
          let txtfield = this.contextService.getDataByKey(data[0].uuid + "ref");
          if(txtfield.instance.focus != false){
            txtfield.instance.textFieldRef.nativeElement.focus();
            txtfield.instance.textFieldRef.nativeElement.autofocus = true;
          }
        }
      }
    }, 300);
  }
}
