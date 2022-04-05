import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ContextService } from 'src/app/services/commonServices/contextService/context.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { TransactionService } from 'src/app/services/commonServices/transaction/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { ActionService } from '../../services/action/action.service';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ],
})
export class MenuListItemComponent implements OnInit {
  isActive: string = '';
  expanded: boolean = false;
  selectedItem = 'Home';
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item;
  @Input() dataSource;
  @Input() option;
  @Input() options: any;
  @Input() hidden: boolean;
  @Input() items: any;
  @Input() depth: number;
  @Input() iconList: any;
  @Input() childrenIcon: any;
  @Input() style: string;
  @Input() menuListClass: string;
  @Input() isVisible: boolean;
  @Input() defaultMenu = 'Home';
  Isloaded: boolean = false;

  constructor(
    private contextService: ContextService,
    private utilityService: UtilityService,
    private transactionService: TransactionService,
    translate: TranslateService,
    private actionService: ActionService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {
    let language = localStorage.getItem('language');
    translate.setDefaultLang(language);
    translate.use(language);
    this.selectedItem = this.defaultMenu;
    console.log("defaultMenu", this.defaultMenu);
  }

  ngOnInit(): void {

    this.hidden = true;
    if (this.dataSource != undefined) {
      if (this.utilityService.isString(this.dataSource) && this.dataSource.startsWith('#')) {
        this.items = this.contextService.getDataByString(this.dataSource);
      } else {
        this.items = this.dataSource;
      }
      this.items &&
        this.items != '' &&
        this.items.sort((a, b) => {
          return Number(a.id) - Number(b.id);
        });
      if (this.items && this.items != undefined) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].icon = this.iconList[i];
          if (this.items[i].children !== null && this.items[i].children.length !== 0) {
            this.items[i].children.forEach((element) => {
              element.icon = this.childrenIcon[0];
            });
          }
        }
      }
    }
  }

  onItemSelected(item) {
    // window.location.reload();
    this.isActive = item.displayName;
    if (!item.children || !item.children.length) {
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    
    let deleteActions = [
      {
        "type": "toggle",
        "eventSource": "click",
        "name": "subProcessRightNavref",
        "actionType":"close"
      }
    ]
    deleteActions.forEach(element => {
      this.actionService.handleAction(element,this);
    });

    this.contextService.deleteDataByKey("WIKI");
    this.contextService.deleteDataByKey("dashboardWC")
    this.contextService.deleteDataByKey("subProcessRightNavref")

    if (item.name.toLowerCase() === 'batch processes') {
      let filterBatchProcessOption= this.contextService.getDataByString("#getBatchWC");

      let filteredoptions = filterBatchProcessOption.filter((currentWorkCenter)=> {
          return currentWorkCenter.workcenterName !=="COBRA_KEYING";
      });
       item.options=filteredoptions;
      
      if (this.hidden && this.hidden == true) {
        this.hidden = false;
      } else {
        this.hidden = true;
      }
    } else {
      this.hidden = true;
    }

    this.selectedItem = item.name;
    let clientName = this.contextService.getDataByString('#userSelectedClientName');
    if (item.name.toLowerCase() === 'home') {
      let subProcessType = this.contextService.getDataByString("#userSelectedSubProcessType");
      let clientName = this.contextService.getDataByString("#userSelectedClientName");
      let contractName = this.contextService.getDataByString("#userSelectedContractName");
      let searchJson;
      this.contextService.addToContext('selectedHomeMenuId', item.id);
      searchJson = [{
        "type": "microservice",
        "config": {
          "microserviceId": "getSearchCriteria",
          "isLocal": false,
          "LocalService": "assets/verifoneBlankPage.json",
          "requestMethod": "get",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "searchType": "#userSelectedSubProcessType",
            "userName": "#userAccountInfo.PersonalDetails.USERID"
          }
        },
        "eventSource": "change",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "getSearchCriteriaData",
                  "data": "responseData"
                }
              },
              {
                "type": "renderTemplate",
                "config": {
                  "mode": "remote",
                  "targetId": "mainPageContentBody",
                  "templateId": "getSearchCriteriaData"
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dashboardErrorTitleUUID",
                  "properties": {
                    "titleValue": "Search Criteria is not configured",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      }];

      if (subProcessType == "RECEIVING") {
        if (clientName && contractName && clientName === "VeriFone" && contractName === "Repair Hungary") {
          searchJson = [{
            "type": "microservice",
            "config": {
              "microserviceId": "getSearchCriteria",
              "isLocal": false,
              "LocalService": "assets/verifoneBlankPage.json",
              "requestMethod": "get",
              "params": {
                "locationId": "#userSelectedLocation",
                "clientId": "#userSelectedClient",
                "contractId": "#userSelectedContract",
                "searchType": "#userSelectedSubProcessType",
                "userName": "#userAccountInfo.PersonalDetails.USERID"
              }
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "getSearchCriteriaData",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "renderTemplate",
                    "config": {
                      "mode": "remote",
                      "targetId": "mainPageContentBody",
                      "templateId": "getSearchCriteriaData"
                    }
                  }
                ]
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dashboardErrorTitleUUID",
                      "properties": {
                        "titleValue": "Search Criteria is not configured",
                        "isShown": true
                      }
                    }
                  }
                ]
              }
            }
          }
          ];
        } else if (clientName && contractName && clientName === "VeriFone" && contractName === "Problem Shelf") {
          searchJson = [{
            "type": "microservice",
            "config": {
              "microserviceId": "getSearchCriteria",
              "isLocal": false,
              "LocalService": "assets/verifoneBlankPage.json",
              "requestMethod": "get",
              "params": {
                "locationId": "#userSelectedLocation",
                "clientId": "#userSelectedClient",
                "contractId": "#userSelectedContract",
                "searchType": "#userSelectedSubProcessType",
                "userName": "#userAccountInfo.PersonalDetails.USERID"
              }
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "getSearchCriteriaData",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "renderTemplate",
                    "config": {
                      "mode": "remote",
                      "targetId": "mainPageContentBody",
                      "templateId": "getSearchCriteriaData"
                    }
                  }
                ]
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dashboardErrorTitleUUID",
                      "properties": {
                        "titleValue": "Search Criteria is not configured",
                        "isShown": true
                      }
                    }
                  }
                ]
              }
            }
          }
          ];
        }
      }

      searchJson.forEach((currentAction) => {
        this.actionService.handleAction(currentAction, '');
      });

    } else if (item.name.toLowerCase() === 'batch processes') {
      this.contextService.addToContext('selectedHomeMenuId', item.id);
    } else if (
      item &&
      clientName &&
      clientName != undefined &&
      clientName == 'CISCO' &&
      item.name.toLowerCase() === 'my_units'
    ) {
      this.contextService.addToContext('myUnitProcessJson', item.processJsonString);
      let renderMyUnitSubprocess = {
        type: 'microservice',
        eventSource: 'click',
        config: {
          microserviceId: 'getMyUnits',
          isLocal: false,
          LocalService: 'assets/Responses/mockBGA.json',
          requestMethod: 'get',
          params: {
            locationId: '#userSelectedLocation',
            clientId: '#userSelectedClient',
            logIn: '#userAccountInfo.PersonalDetails.USERID',
          },
        },
        responseDependents: {
          onSuccess: {
            actions: [
              {
                type: 'context',
                config: {
                  requestMethod: 'add',
                  key: 'getMyUnitsData',
                  data: 'responseData',
                },
              },
              {
                type: 'renderTemplate',
                config: {
                  mode: 'remote',
                  targetId: 'mainPageContentBody',
                  templateId: 'myUnitProcessJson',
                },
              },
              // For MyUnit Screen Load Locally
              // {
              //   "type": "renderTemplate",
              //   "config": {
              //     "templateId": "cisco-OLE-MyUnit.json",
              //     "mode": "local"
              //   }
              // }
            ],
          },
          onFailure: {
            actions: [
              {
                type: 'context',
                config: {
                  requestMethod: 'add',
                  key: 'errorDisp',
                  data: 'responseData',
                },
              },
              {
                type: 'condition',
                config: {
                  operation: 'isEqualTo',
                  lhs: '#errorDisp',
                  rhs: 'No Record Found',
                },
                responseDependents: {
                  onSuccess: {
                    actions: [
                      {
                        type: 'updateComponent',
                        config: {
                          key: 'errorTitleUUID',
                          properties: {
                            titleValue: '#errorDisp',
                            isShown: false,
                          },
                        },
                      },
                      {
                        type: 'context',
                        config: {
                          requestMethod: 'add',
                          key: 'getMyUnitsData',
                          data: [],
                        },
                      },
                    ],
                  },
                  onFailure: {
                    actions: [
                      {
                        type: 'updateComponent',
                        config: {
                          key: 'errorTitleUUID',
                          properties: {
                            titleValue: '#errorDisp',
                            isShown: true,
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                type: 'renderTemplate',
                config: {
                  mode: 'remote',
                  targetId: 'mainPageContentBody',
                  templateId: 'myUnitProcessJson',
                },
              },
              // {
              //   "type": "renderTemplate",
              //   "config": {
              //     "templateId": "cisco-OLE-MyUnit.json",
              //     "mode": "local"
              //   }
              // }
            ],
          },
        },
      };

      this.actionService.handleAction(renderMyUnitSubprocess, this);
    } else if (item.name.toLowerCase().trim() === 'box_ship_only') {
      let actionData = {
        type: 'handleDellCarShippingActions',
        methodType: 'displayBoxShippingPage',
      };
      this.contextService.addToContext('selectedHomeMenuId', item.id);
      this.actionService.handleAction(actionData, '', '');
    } else if (item.name.toLowerCase().includes('kardex')) {
      let actionData = { type: 'handleKardexPageRendering' };
      this.contextService.addToContext('selectedHomeMenuId', item.id);
      this.actionService.handleAction(actionData, '', '');
    } else if (item.name.toLowerCase().includes('wiki')) {
      let actionData = { type: 'handleWikiPageRendering' };
      this.contextService.addToContext('selectedHomeMenuId', item.id);
      this.actionService.handleAction(actionData, '', '');
    } else if (item.name.toLowerCase().trim() == 'view etraveller') {
        let subProcessType = this.contextService.getDataByString("#userSelectedSubProcessType");
        let clientName = this.contextService.getDataByString("#userSelectedClientName");
        let contractName = this.contextService.getDataByString("#userSelectedContractName");
        let searchJson;
        this.contextService.addToContext('selectedHomeMenuId', item.id);
          searchJson = [{
          "type": "microservice",
          "config": {
            "microserviceId": "getSearchCriteria",
            "isLocal": true,
            "LocalService": "assets/e-traveller-common-search.json",
            "requestMethod": "get",
            "params": {
              "locationId": "#userSelectedLocation",
              "clientId": "#userSelectedClient",
              "contractId": "#userSelectedContract",
              "searchType": "#userSelectedSubProcessType",
              "userName": "#userAccountInfo.PersonalDetails.USERID"
            }
          },
          "eventSource": "change",
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "getSearchCriteriaData",
                    "data": "responseData"
                  }
                },
                {
                  "type": "renderTemplate",
                  "config": {
                    "mode": "remote",
                    "targetId": "mainPageContentBody",
                    "templateId": "getSearchCriteriaData"
                  }
                }
              ]
            },
            "onFailure": {
              "actions": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "dashboardErrorTitleUUID",
                    "properties": {
                      "titleValue": "Search Criteria is not configured",
                      "isShown": true
                    }
                  }
                }
              ]
            }
          }
        }];
  
        searchJson.forEach((currentAction) => {
          this.actionService.handleAction(currentAction, '');
        });
  
      

    } else {
      if (item && clientName && clientName != undefined && clientName == 'CISCO') {
        let backtoMainDashborad = {
          type: 'renderTemplate',
          config: {
            templateId: 'dashboard.json',
            mode: 'local',
          },
          eventSource: 'click',
        };
        this.actionService.handleAction(backtoMainDashborad, this);
      }
      let actionData = { type: 'resetVerifoneSearchPageRendering' };
      this.contextService.addToContext('selectedHomeMenuId', item.id);
      this.actionService.handleAction(actionData, '', '');
    }
  }

  onOptionSelected(item) {
    let actionData = {
      type: 'handleVerifoneSearchPageRendering',
      menu: item.workcenterName,
      data: item
    };
    console.log(item);
    this.contextService.addToContext("currentWCName", item.workcenterName);
    this.contextService.addToContext("verifoneWCResultData", item.workcenterId);
    this.contextService.addToContext("verifoneWCResultValue", item.workcenterName);
    // this.contextService.addToContext('selectedHomeMenuId', item.id);
    this.actionService.handleAction(actionData, '', '');
  }

  getBatchOptions(optList) {
    this.selectedItem = 'Home';
    let optionList;
    if (optList && optList instanceof Array) {
      optionList = optList;
    } else if (optList && optList.startsWith("#")) {
      let data = optList;
      optionList = this.contextService.getDataByString(data);
      console.log(optionList);
    } else {
      optionList = []
    }

    return optionList
  }
}
