// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild, ViewContainerRef, Input, ChangeDetectorRef, AfterViewInit,ViewEncapsulation,ChangeDetectionStrategy, AfterContentInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentLoaderService } from '../../services/commonServices/component-loader/component-loader.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ContextService } from '../../services/commonServices/contextService/context.service';
// import { predictionData,dropdownData,buttonData } from '../../utilities/constants';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { TaskPanelComponent } from '../task-panel/task-panel.component';
import { ButtonComponent } from '../button/button.component';
import { HookService } from '../../services/commonServices/hook-service/hook.service';
import { ActionService } from '../../services/action/action.service';
import { DellDebugService } from '../../services/dell/dell-debug.service';
import { DellPredictiveService } from '../../services/dell/dellPredictive/dell-predictive.service';


@Component({
  selector: 'app-predictive-taskpanel',
  templateUrl: './predictive-taskpanel.component.html',
  styleUrls: ['./predictive-taskpanel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PredictiveTaskpanelComponent implements OnInit {
    panelOpenState;
    // flag: boolean;
    UUID: any;
  // @ViewChild('expansionpredictivepanel', { static: true, read: ViewContainerRef }) expansionpanelcontent: ViewContainerRef;
  @Input() dataSource : any =[];
  @Input() uuid : any = "";
  @Input() selectDisabled: any;
  @Input() footer: any = [];
  @Input() toolBarItems: any=[];
  @Input() hooks: any;
  @Input() name: any;
  @Input() predictiveClass: any;
  @Input() items: any;
  @Input() inputStyles: string;
  @Input() group: FormGroup;
  @Input() disabled: any;
  @Input() expanded: any;
  @Input() hideToggle: boolean;
  @Input() togglePosition: string;
  @Input() collapsedHeight: string;
  @Input() expandedHeight: string;
  @Input() displayMode: string;
  @Input() multi: boolean;
  @Input() isEditable: boolean = false;
  @Input() isMandatory: boolean = false;
  @Input() hidden:any;
  @Input()  hideexpansion:any;
  @Input() bodyCss: string;
  @Input() errorMessage: string;
  @Input() iconClass: string;
  @Input() leftDivclass: string;
  @Input() rightDivclass: string;
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
  @Input() header: any = {};
  @Input() toggleExpanded: any = {};
  @Input() Togglehidden:any;
  @Input() disableBulkDelete: any;
  @ViewChild('expansionpanelcontent', { static: true, read: ViewContainerRef }) expansionpanelcontent: ViewContainerRef;
  @ViewChild('expansionpanelfooter', { static: true, read: ViewContainerRef }) expansionpanelfooter: ViewContainerRef;
  @ViewChild('expansionPanelContenttaskpanel', { static: true, read: ViewContainerRef }) expansionPanelContenttaskpanel: ViewContainerRef;
  @ViewChild('expansionPanelContenttoolbar', { static: true, read: ViewContainerRef }) expansionPanelContenttoolbar: ViewContainerRef;

  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];

  constructor(
    private contextService: ContextService,
    private _changeDetectionRef: ChangeDetectorRef,
    private componentLoaderService: ComponentLoaderService,
    private hookService: HookService,
    private actionService: ActionService,
    private dellDebugService: DellDebugService,
    private dellPredictiveService: DellPredictiveService

  ) { }

  ngOnInit(): void {
    // this.dataSource = predictionData;
    this.UUID = this.uuid;
    this.uuid = new FormGroup({});
    if (this.disableBulkDelete === undefined || this.disableBulkDelete === null || this.disableBulkDelete === "") {
      this.disableBulkDelete = false;
    } else {
      if (this.disableBulkDelete === 'true') {
        this.disableBulkDelete = true;
      } else {
        this.disableBulkDelete = false;
      }
    }
    if (this.header.title && this.header.title.startsWith('#')) {
      this.header.title = this.contextService.getDataByString(this.header.title);
    }
    if (!this.splitView) {
      this.bodyClass = 'padding-top-15 content-padding';
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      this.uuid.addControl(this.items[i].name, new FormControl(this.items[i].value));
    }
    this.contextService.addToContext('expansionpanelcontent', this.expansionpanelcontent);
    this.contextService.addToContext('expansionpanelfooter', this.expansionpanelfooter);
    this.contextService.addToContext('expansionPanelContenttaskpanel', this.expansionPanelContenttaskpanel);
    this.contextService.addToContext('expansionPanelContenttoolbar', this.expansionPanelContenttoolbar);

    this.items.forEach((item) => {
      item.group = this.uuid;
      this.componentLoaderService.parseData(item, this.expansionpanelcontent);
    });

    this.footer.forEach((item) => {
      item.group = this.uuid;
      if (item.ctype === "button") {
        item.parentuuid = this.UUID;
      }
      if (item.ctype === "iconbutton") {
        item.parentuuid = this.UUID;
      }
      this.componentLoaderService.parseData(item, this.expansionpanelfooter);
      if (item.name) {
        item.group.addControl(
          item.name,
          new FormControl(null)
        );
      }
    });

    this.toolBarItems.map((eachItem,index)=>{
      this.componentLoaderService.parseData(eachItem, this.expansionPanelContenttoolbar);
    })
    this.panelOpenState = false;
   
  }
  dele(id:any){
    id.target.closest('mat-accordion').remove();
    
  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => x.hookType === this.hookMap[3]);
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
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

  async delete($event) {
    let predictiveData = this.contextService.getDataByString("#predictionData");
    console.log(predictiveData)
    for (let actionIndex = 0; actionIndex < this.actions.length; actionIndex++) {
      let currentAction = this.actions[actionIndex];
      if (currentAction.eventSource === "prDelete") {
        let parentUUID = currentAction.config.parentUUID;
        let parentref = this.contextService.getDataByKey(parentUUID + "ref");
        let defectGroup = currentAction.config.defectGroup;
        let defect = currentAction.config.defect;
        let i;
        let isDeleteFailed = false;
        for (let index = 0; index < predictiveData.length; index++) {
          let item = predictiveData[index];
          if (item.predidcted_class.toLowerCase() === defectGroup.toLowerCase() && item.defectCode === defect) {
            let childList = item.childList;
            for (let j = 0; j < childList.length; j++) {
              let eachItem = childList[j];
              let childRef = this.contextService.getDataByKey(eachItem.childUUID + "ref");
              let taskPanelData = {
                "defect": eachItem.defectCode,
                "primaryFaultStatus": eachItem.mainIssue2 === "Yes" ? true : false,
                "childUUID": eachItem.childUUID,
                "actionId": eachItem.actionId
              };
              let body = {
                "updateFailureAnalysisRequest": {
                  "bcn": "#repairUnitInfo.ITEM_BCN",
                  "defectCodeChangeList": {
                    "defectCodeChange": [
                      {
                        "defectCode": taskPanelData.defect,
                        "operation": "Delete",
                        "occurrence": 1
                      }
                    ]
                  }
                },
                "userPwd": {
                  "password": "#loginUUID.password",
                  "username": "#userAccountInfo.PersonalDetails.USERID"
                },
                "operationTypes": "ProcessImmediate",
                "ip": "::1",
                "callSource": "FrontEnd",
                "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
              };
              let res = await this.dellPredictiveService.postApiCallUsingPromise(body, "cancelFA");
              if (res["body"] && res["body"]['status']) {
               let actionsAfterEachDelete = this.actionsAfterEachDelete(eachItem.childUUID, eachItem.processType, taskPanelData);
               childRef?.instance && actionsAfterEachDelete.map((x) => {
                 this.actionService.handleAction(x, childRef.instance);
               })
              } else {
                isDeleteFailed = true;
              }
            }
            item.childList = [];
            i = index;
          }
        }
        if (i !== undefined && !isDeleteFailed) {
          this.actionService.handleAction({
            "type": "deleteComponent",
            "eventSource": "click",
            "config": {
              "key": parentUUID
            }
          }, parentref.instance);
          predictiveData.splice(i, 1);
        }
        this.contextService.addToContext("predictionData", predictiveData);
      }
    }
  }

  actionsAfterEachDelete(uuid, processType, taskPanelData) {
    let occurenceList = this.contextService.getDataByKey("occurenceList");
    let currentOccurenceData = occurenceList && occurenceList.filter((x) => x.taskUuid === uuid);
    return [
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": uuid
        }
      },
      {
        "type": "deleteAndUpdateOccurence",
        "config": {
          "target": "#occurenceList",
          "key": uuid,
          "currentTaskData": currentOccurenceData[0]
        },
        "eventSource": "click"
      },
      {
        "type": "handleDellDebugPRActions",
        "methodType": "updateHPFAHistory",
        "config": {
          "actionId": taskPanelData.actionId
        }
      },
      {
        "type": "condition",
        "eventSource": "click",
        "config": {
          "operation": "isEqualTo",
          "lhs": processType,
          "rhs": "replace"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "handleDellDebugPRActions",
                "methodType": "removeValueFromTable",
                "config": {
                  "arrayData": "#dellDebugTableData",
                  "PullValue": uuid,
                  "key": uuid,
                  "property": "flexFields",
                  "splice": true,
                  "deleteTableData": true,
                  "keyToFind": "dellDebugReqList",
                  "tableUUID": "dellDebugReqListTableUUID",
                  "lineList": "dellDebugLineList"
                },
                "eventSource": "click"
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "dellDebugReqListStatus",
                  "data": "- Unsaved"
                }
              },
              {
                "type": "updateComponent",
                "hookType": "afterInit",
                "config": {
                  "key": "dellDebugReplaceIconUUID",
                  "properties": {
                    "disabled": false
                  }
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isValid",
                  "lhs": "#dellDebugReqListLength"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugReqListButtonUUID",
                          "properties": {
                            "textValue": "- Unsaved",
                            "textValueClass": "light-red body",
                            "count": "#dellDebugReqListLength"
                          }
                        }
                      },
                      {
                        "type": "updateComponent",
                        "hookType": "afterInit",
                        "config": {
                          "key": "dellDebugReqSaveUUID",
                          "properties": {
                            "disabled": false
                          }
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugReqListButtonUUID",
                          "properties": {
                            "textValue": "",
                            "count": "#dellDebugReqListLength"
                          }
                        }
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "dellDebugReqListStatus",
                          "data": ""
                        }
                      },
                      {
                        "type": "updateComponent",
                        "hookType": "afterInit",
                        "config": {
                          "key": "dellDebugReqSaveUUID",
                          "properties": {
                            "disabled": true
                          }
                        }
                      },
                      {
                        "type": "microservice",
                        "config": {
                          "microserviceId": "getResultCodeByValidateResult",
                          "requestMethod": "get",
                          "params": {
                            "bcn": "#repairUnitInfo.ITEM_BCN",
                            "validateResult": 0
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "resultCodesForDiscrepancy",
                                  "data": "responseData"
                                }
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "handleCommonServices",
                                "config": {
                                  "type": "errorRenderTemplate",
                                  "contextKey": "errorMsg",
                                  "updateKey": "errorTitleUUID"
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ]
          },
          "onFailure": {
            "actions": []
          }
        }
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "",
            "isShown": true
          }
        }
      },
      {
        "type": "condition",
        "eventSource": "click",
        "config": {
          "operation": "isEqualTo",
          "lhs": taskPanelData.primaryFaultStatus,
          "rhs": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "isPrimaryFaultExists",
                  "data": false
                },
                "eventSource": "click"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugPrimaryFaultUUID",
                  "properties": {
                    "disabled": false
                  }
                }
              }
            ]
          },
          "onFailure": {
            "actions": []
          }
        }
      }
    ];
  }

}
