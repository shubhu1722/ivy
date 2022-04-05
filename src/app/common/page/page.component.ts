import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewContainerRef, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Key } from 'protractor';
import { ActionService } from '../../services/action/action.service';
import { ComponentLoaderService } from '../../services/commonServices/component-loader/component-loader.service';
import { ContextService } from '../../services/commonServices/contextService/context.service';
import { HookService } from '../../services/commonServices/hook-service/hook.service';
import { TransactionService } from '../../services/commonServices/transaction/transaction.service';
import { CustomeService } from '../../services/commonServices/customeService/custome.service';
import { DELL_BIN_BTN_CONFIGS } from '../../utilities/constants';
import { UtilityService } from '../../utilities/utility.service';
import { IdleTimeoutService } from '../../services/commonServices/idleTimeoutServices/idle-timeout.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.sass']
})
export class PageComponent implements OnInit, AfterViewInit {
  @ViewChild('bodypage', { static: true, read: ViewContainerRef }) bodypage: ViewContainerRef;
  @ViewChild('bodyheader', { static: true, read: ViewContainerRef }) bodyheader: ViewContainerRef;
  @ViewChild('bodyfooter', { static: true, read: ViewContainerRef }) bodyfooter: ViewContainerRef;
  @ViewChild('prebodysectionone', { static: true, read: ViewContainerRef }) prebodysectionone: ViewContainerRef;
  @ViewChild('prebodysection', { static: true, read: ViewContainerRef }) prebodysection: ViewContainerRef;
  @ViewChild('prebodysectiontwo', { static: true, read: ViewContainerRef }) prebodysectiontwo: ViewContainerRef;
  @Input() css: string;
  @Input() visibility: true;
  @Input() hooks: any;
  @Input() validations: any;
  @Input() action: any;
  @Input() header: any = [];
  @Input() items: any = [];
  @Input() itemsData: any;
  @Input() footer: any = [];
  @Input() rightsidenav: any;
  @Input() contentClass: any;
  @Input() errorTitle: any;
  @Input() staticItem: any;
  @Input() onLoadActions: any = [];
  @Input() componentActionList: any = [];
  @Input() uuid: any;

  errorUpdates = [];
  beforeInitHooks = [];
  hookMap = ['beforeAction', 'afterAction', 'beforeInit', 'afterInit'];
  constructor(
    private http: HttpClient,
    private componentLoaderService: ComponentLoaderService,
    private _changeDetectionRef: ChangeDetectorRef,
    private contextService: ContextService,
    private transactionService: TransactionService,
    private actionService: ActionService,
    private hookService: HookService,
    private custom: CustomeService,
    private utilityService: UtilityService,
    private idleTimeout: IdleTimeoutService
  ) { }
  ngOnDestroy(){
    this.idleTimeout.setUserLoggedIn(false);
  }
  ngOnInit(): void {
    this.idleTimeout.setUserLoggedIn(true);
    this.contextService.addToContext('prebodysectiononeRef', this.prebodysectionone);
    this.contextService.addToContext('prebodysectionRef', this.prebodysectionone);
    this.contextService.addToContext('prebodysectiontwoRef', this.prebodysectiontwo);
    if (this.componentActionList.length) {
      this.componentActionList.map((componentAction) => {
        this.actionService.handleAction(componentAction, this);
      })
      this.loadPageOnInIt();
    } else {
      this.loadPageOnInIt();
    }
  }
  loadPageOnInIt() {
    let discrepancyUnitInfo = this.contextService.getDataByString("#discrepancyUnitInfo");
    let userSelectedSubProcessType = this.contextService.getDataByKey("userSelectedSubProcessType");
    if (this.itemsData !== undefined && this.itemsData.startsWith('#')) {
      this.itemsData = this.contextService.getDataByString(this.itemsData);
      if (this.itemsData.hasOwnProperty('ctype')) {
        /// Append the static item at the end
        if (this.staticItem !== undefined && this.staticItem.length > 0) {
          this.staticItem.forEach(element => {
            if (element.header.title == "Confirm Revised Barcode Labels" && this.itemsData.items.length < 3) {
              element.disabled = false;
            }
            if(element.header.title == "Preliminary Cosmetic Check"){
              this.itemsData.items.splice(1, 0, element);
              let cosmeticData = this.contextService.getDataByString("#UnitInfo.ROUTE");
           
              if(this.itemsData.items.length >= 2){
                this.itemsData.items[2].disabled = true;
                this.itemsData.items[2].expanded = false;
                // let ecoKey = this.itemsData.items[2].uuid;
                let ecoKey = this.custom.getNextTaskPannel(this.itemsData.items);
                let elementAction : any = element.footer[0].actions;
                elementAction.forEach(cosChkActions => {
                  if(cosChkActions.type == "condition"){
                    let targetAction = {
                          "type": "updateComponent",
                          "config": {
                              "key": ecoKey,
                              "properties": {
                                  "expanded": true,
                                  "disabled": false
                              }
                          }
                      };

                      let wrp2Condition = {
                        "type": "multipleCondition",
                        "config": {
                            "multi": true,
                            "operator": "AND",
                            "conditions": [
                                {
                                    "operation": "isEqualTo",
                                    "lhs": "#UnitInfo.ROUTE",
                                    "rhs": "WRP2"
                                },
                                {
                                    "operation": "isNotEqualTo",
                                    "lhs": "#defectsOrActions.cosmeticCheckToggle",
                                    "rhs": "NOK"
                                }
                            ]
                        },                      
                        "responseDependents": {
                            "onSuccess": {
                                "actions": [
                                {
                                  "type": "updateComponent",
                                  "config": {
                                    "key": ecoKey,
                                    "properties": {
                                      "expanded": true,
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
                    };
                    cosChkActions.responseDependents.onSuccess.actions.push(targetAction);
                    cosChkActions.responseDependents.onFailure.actions.push(wrp2Condition);
                  
                  }
                });
              }
            }else{
              this.itemsData.items.push(element);
            }
          });
        }

        let imCompleteEcoPanel = [];
        this.itemsData.items.forEach(eachItem => {
          if (eachItem.ctype === "taskPanel") {
            if (eachItem && eachItem.header != undefined && eachItem.header.status === "") {
              imCompleteEcoPanel.push(eachItem);
            }
          }
        });
        let lastItem = imCompleteEcoPanel[imCompleteEcoPanel.length - 1];
        if (lastItem && lastItem != undefined) {
          let lastItemAction: any = lastItem.footer[0].actions;
          let targetAction = {
            "type": "updateComponent",
            "config": {
              "key": "revisedBarcodeUUID",
              "properties": {
                "expanded": true,
                "disabled": false
              }
            },
            "eventSource":"click"
          };  
          lastItemAction.push(targetAction);
        }
        this.items.push(this.itemsData);
      } else {
        this.items.push({
          "ctype": "title",
          "uuid": "errorTitleUUID",
          "titleClass": "error-title",
          "titleValue": "",
          "isShown": true
        });
        
          let eco = {
          "ctype": "taskPanel",
          "title": "",
          "header": {
            "title": this.errorTitle,
            "icon": "description",
            "css": "",
            "status": ""
          },
          "expanded": true,
          "isKeepExpanded": true,
          "hideToggle": true,
          "hidden": false,
          "disabled": false,
          "uuid": "ErrorTask",
          "hooks": [],
          "validations": [],
          "actions": [],
          "items": [{
            "ctype": "title",
            "uuid": "errorTitleECOUUID",
            "titleClass": "error-title",
            "titleValue": "No ECO's FOUND.",
            "isShown": true
          }]
        };
        let HouLoc = false;
        this.contentClass = "noECOContect"
        /// Append the static item at the end
        if (this.staticItem !== undefined && this.staticItem.length > 0) {
          this.staticItem.forEach(element => {
            if(element.header.title == "Preliminary Cosmetic Check") {
            element.disabled = false;
            element.expanded = true;
            HouLoc = true
            this.items.push(element);
          } else {
            if (HouLoc == true) {
              element.disabled = true;
              element.expanded = false;
            } else if (element.header.title == "Confirm Revised Barcode Labels") {
              element.disabled = false;
              element.expanded = true;
            }
            this.items.push(element);
          }
          });
          if (HouLoc && HouLoc == true) {
            this.items.splice(2, 0, eco);
          }
          else {
            this.items.splice(1, 0, eco);
          }
        }
      }
    }
    this.header.forEach((item) => {
      item.rightsidenav = this.rightsidenav;
      item["isHeader"] = true;
      this.componentLoaderService.parseData(item, this.bodyheader);
    });
    /// Adds the last note panel based on the add notes entered by user in previous WC
    if (!!discrepancyUnitInfo && discrepancyUnitInfo != ""&& this.uuid === "pageUUID") {
      this.items = this.utilityService.addLastNotePanel(this.items, discrepancyUnitInfo.CONTRACTNAME, discrepancyUnitInfo.WORKCENTER);
    }
    this.items.forEach((item) => {
      if (item.containerId !== undefined) {
        this.componentLoaderService.parseData(item, this[item.containerId]);
      } else {
        this.componentLoaderService.parseData(item, this.bodypage);
      }
    });
    if(discrepancyUnitInfo &&
      DELL_BIN_BTN_CONFIGS.CONTRACTNAMES[discrepancyUnitInfo.CONTRACTNAME] &&
      DELL_BIN_BTN_CONFIGS.SEARCH_TYPES[userSelectedSubProcessType] && DELL_BIN_BTN_CONFIGS.CLIENTNAME[discrepancyUnitInfo.CLIENTNAME]) {
      if (!DELL_BIN_BTN_CONFIGS.ALLOW_EXIT_BTN[discrepancyUnitInfo.WORKCENTER]) {
        this.footer = this.utilityService.addExitButton(this.footer, discrepancyUnitInfo);
      }
      if (!DELL_BIN_BTN_CONFIGS.WC_NAMES[discrepancyUnitInfo.WORKCENTER]) {
        this.addDataToBinNotes(discrepancyUnitInfo, true);
        this.footer = this.utilityService.addBinButton(this.footer, discrepancyUnitInfo);
      }
    }
    
    this.footer.forEach((item) => {
      this.componentLoaderService.parseData(item, this.bodyfooter);
    });
  }

  /// Adds the bin notes to context
  addDataToBinNotes(discrepancyUnitInfo, isFirstIteration) {
    let wcFfService = {
      "type": "microservice",
      "config": {
        "microserviceId": "getFFByWcPageComponent",
        "isLocal": false,
        "LocalService": "assets/Responses/repairMockRamResponse.json",
        "requestMethod": "get",
        "params": {
          "clientId": "#discrepancyUnitInfo.CLIENT_ID",
          "routeName": "#discrepancyUnitInfo.ROUTE",
          "contrId": "#discrepancyUnitInfo.CONTRACT_ID",
          "wcId": "#locationDependentFFIDDetails.VMI_WC_ID",
          "itemId": "#discrepancyUnitInfo.ITEM_ID",
          "userName": "#loginUUID.username"
        }
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "updateBinNotes",
              "discrepancyUnitInfo": discrepancyUnitInfo
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
    };

    this.actionService.handleAction(wcFfService, this);
  }

  ngAfterViewInit() {
    if (this.hooks !== undefined && this.hooks != null && this.hooks.length > 0) {
      const afterInitHooks = this.hooks.filter((x: any) => {        
        if(x.hookType === this.hookMap[3]){
          return x;
        }
      });
      if (afterInitHooks !== undefined && afterInitHooks.length > 0) {
        this.hookService.handleHook(afterInitHooks, this);
      }
    }

    /// Thia code is, If the hooks to be executed after the save and exit pre-populating hooks
    const hooksToBeExecutedAtLast = this.hooks.filter((x: any) => {
      if (x.config && x.config.addHookAtLast) {
        return x;
      }
    });
    if (hooksToBeExecutedAtLast !== undefined && hooksToBeExecutedAtLast.length > 0) {
      this.hookService.handleHook(hooksToBeExecutedAtLast, this);
    }
      
    // let currenttaskref = this.contextService.getDataByKey("currentTaskPanelUUID");
    // if(currenttaskref){
    //   let refData = this.contextService.getDataByKey(currenttaskref + 'ref');
    //   if (currenttaskref && refData &&
    //     refData != undefined && refData.instance &&
    //     refData.instance != undefined && refData.instance.oElementRef != undefined) {
    //     refData.instance.oElementRef.nativeElement.scrollIntoView();
    //   }
    // }else{
      let refData = this.contextService.getDataByKey("pageUUIDref");
      let timeOutAlert = 500;
      if(refData&&refData.instance&&refData.instance.items){
      let pageItemData = refData.instance.items.filter(eachItem => eachItem.ctype == "taskPanel");
      let dynamicTaskItemData = refData.instance.items.filter(eachItem => eachItem.ctype == "dynamicTaskRender");
      pageItemData.map((data)=>{
        
        let refData = this.contextService.getDataByKey(data.uuid + 'ref');
        if (refData &&
          refData != undefined && refData.instance && refData.instance.expanded !== "false" && refData.instance.expanded &&
          refData.instance != undefined && refData.instance.oElementRef != undefined) {
          refData.instance.oElementRef.nativeElement.scrollIntoView();
        }
      });
      if (dynamicTaskItemData && dynamicTaskItemData.length > 0) {
        timeOutAlert = 1000;
      }
      //If the alert message is visible then the scrolling should be at alert task panel 
        setTimeout(() => {
          let alertData = this.contextService.getDataByKey("getAlertDetailsAssessment")
          if (alertData) {
            let refComDataAlert = this.contextService.getDataByKey('alertPanelUUIDref');
            // let refComDataError = this.contextService.getDataByKey('errorTitleUUIDref');
            // if (refComDataError &&
            //   refComDataError != undefined && refComDataError.instance &&
            //   refComDataError.instance != undefined && refComDataError.instance.oElementRef != undefined && refComDataError.instance.isShown) {
            //   refComDataError.instance.oElementRef.nativeElement.scrollIntoView();
            // }
             if (refComDataAlert &&
              refComDataAlert != undefined && refComDataAlert.instance &&
              refComDataAlert.instance != undefined && refComDataAlert.instance.oElementRef != undefined) {
              // refComDataAlert.instance.oElementRef.nativeElement.scrollIntoView();
              // Scroll to top always
              const element = document.querySelector('.page-content');
              element.scrollTop = 0;
            }
          }
        }, timeOutAlert);
    //   let top = document.getElementById('top');
    // if (top !== null) {
    //   top.scrollIntoView();
    //   top = null;
    // }
    }
  }
}
