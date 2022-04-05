import { Injectable } from '@angular/core';
import { ContextService } from '../commonServices/contextService/context.service';
import { combineLatest, Observable } from 'rxjs'
import { TransactionService } from '../commonServices/transaction/transaction.service';
import { UtilityService } from '../../utilities/utility.service';
import { DELL_DEBUG_WC_NAMES } from '../../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class DellDebugService {
  constructor(
    private contextService: ContextService,
    private utilityService: UtilityService,
    private transactionService: TransactionService
  ) { }

  currentitem = 0;
  itemCount = 0;

  handleDellDebugActions(action: any, instance: any, actionService: any) {
    switch (action.methodType) {
      case 'handleDellProcessActions':
        this.handleDellProcessActions(action, instance, actionService)
        break;
      case 'onClickOfCompleteButton':
        this._onClickOfCompleteButton(action, instance, actionService)
        break;
      case 'removeValueFromTable':
        this._removeValueFromTable(action, instance, actionService)
        break;
      case 'disableOrEnableAllIcons':
        this._disableOrEnableAllIcons(action, instance, actionService)
        break;
      case 'updateStockQty':
        this.updateStockQty(action, instance, actionService)
        break;
      case 'dellDebugHoldActions':
        this._dellDebugHoldActions(action, instance, actionService)
        break;
      case 'getAllActionCodes':
        this.getAllActionCodes(action, instance, actionService)
        break;
      case 'createLooperControlPanels':
        this._createLooperControlPanels(action, instance, actionService)
        break;
      case 'transactionsOnClickOfComplete':
        this._transactionsOnClickOfComplete(action, instance, actionService)
        break;
      case 'reqSaveButtonActions':
        this.reqSaveButtonActions(action, instance, actionService)
        break;
      case 'deleteItemFromReqPopUp':
        this.deleteItemFromReqPopUp(action, instance, actionService)
        break;
      case 'addIndexesToDefectCodes':
        this.addIndexesToDefectCodes(action, instance, actionService)
        break;
      case 'updateDefectBasedOnUnqNumber':
        this.updateDefectBasedOnUnqNumber(action, instance, actionService)
        break;
      case 'checkforValidPart':
        this.checkforValidPart(action, instance, actionService)
        break;
      case 'checkForMainIssue':
        this.checkForMainIssue(action, instance, actionService)
        break;
      case 'checkStateOfReqNotes':
        this.checkStateOfReqNotes(action, instance, actionService)
        break;
      case 'checkForNewlyAddedItem':
        this.checkForNewlyAddedItem(action, instance, actionService)
        break;
      case 'updateHPFAHistory':
        this.updateHPFAHistory(action, instance, actionService)
        break;
      case 'handleReqNotes':
        this.handleReqNotes(action)
        break;
      case 'resetData':
        this.resetData(action, instance, actionService)
        break;
      case 'checkForReplaceTask':
        this.checkForReplaceTask(instance, actionService)
        break;
      case 'handle2ndVisit':
        this.handle2ndVisit(action, instance, actionService)
        break;

      default:
        //statements; 
        break;
    }
  }

  /**
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * This method is called when ever any icon is clicked from toolbar
   * Based on the process, the task panel will be created
   * Replace, Software, Reseat, Other are process types
   */
  handleDellProcessActions(action: any, instance: any, actionService: any) {
    let reqStatus = this.contextService.getDataByString("#dellDebugReqListStatus");
    let processActions = [];
    // if (reqStatus && reqStatus === "- Unsaved" && action.config.processType !== "replace") {
    // } else {
    processActions = [
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "dellDebugTaskPanelUUID"
        }
      },
      {
        "type": "context",
        "eventSource": "click",
        "config": {
          "requestMethod": "add",
          "key": "dellDebugSelectedProcess",
          "data": action.config.processType
        }
      },
      {
        "type": "handleDellDebugActions",
        "methodType": "disableOrEnableAllIcons",
        "eventSource": "click",
        "config": {
          "currentProcess": action.config.processType,
          "isDisable": true
        }
      },
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data": {
            "ctype": "taskPanel",
            "uuid": "dellDebugTaskPanelUUID",
            "title": "",
            "header": {
              "title": action.config.text,
              "svgIcon": action.config.svgIcon,
              "iconClass": "active-header",
              "status": "",
              "statusIcon": "close",
              "statusClass": "header-icon"
            },
            "expanded": true,
            "hideToggle": true,
            "splitView": true,
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "bodyclass": "splitView",
            "panelClass": "top-margin-overflow-visible",
            "leftDivclass": "width:50%",
            "rightDivclass": "width:50%",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "hooks": [
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                    "microserviceId": "getSubProcessPageBody",
                    "requestMethod": "get",
                    "isLocal": true,
                    "LocalService": "assets/replacedropdown.json",
                    "params": {}
                },
                "responseDependents": {
                    "onSuccess": {
                        "actions": [
                            {
                                "type": "context",
                                "config": {
                                    "requestMethod": "add",
                                    "key": "TesttypeDropData",
                                    "data": "responseData"
                                }
                            },
                            {
                                "type": "updateComponent",
                                "config": {
                                    "key": "dellDebugActionCodeUUID",
                                    "dropDownProperties": {
                                        "options": "#TesttypeDropData"
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
            ],
            "validations": [],
            "actions": [
              {
                "type": "updateComponent",
                "eventSource": "click",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "",
                    "isShown": false
                  }
                }
              },
              {
                "type": "deleteComponent",
                "eventSource": "click",
                "config": {
                  "key": "dellDebugTaskPanelUUID"
                }
              },
              {
                "type": "context",
                "eventSource": "click",
                "config": {
                  "requestMethod": "add",
                  "key": "currentTaskUUID",
                  "data": ""
                }
              },
              {
                "type": "handleDellDebugActions",
                "methodType": "disableOrEnableAllIcons",
                "eventSource": "click",
                "config": {
                  "currentProcess": action.config.processType,
                  "isDisable": false
                }
              }
            ],
            "items": this._leftSideItems(action, instance, actionService),
            "rightItems": this._rightSideItems(action, instance, actionService, true),
            "footer": [
              {
                "ctype": "iconbutton",
                "text": "Reset Form",
                "parentuuid": "replaceTaskUUID",
                "uuid": "ReplaceresetUUID",
                "visibility": true,
                "disabled": false,
                "type": "submit",
                "hooks": [],
                "validations": [],
                "icon": "not_interested",
                "iconClass": "resetIcon",
                "actions": [
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "errorTitleUUID",
                      "properties": {
                        "titleValue": "",
                        "isShown": false
                      }
                    }
                  },
                  {
                    "type": "resetData",
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "dellDebugDefectUUID",
                      "dropDownProperties": {
                        "options": []
                      }
                    }
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebugreplacePart",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "ActionCode",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "DefectGroupValue",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "DefectGroupName",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "PrimaryFault",
                      "data": false
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "ActionCodeName",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "getdellDebug" + action.config.processType + "Defects",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "DC",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "DefectName",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "RepairAction",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "RepairActionName",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "Commodity",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": 'dellDebugPrimaryFaultUUID',
                      "properties": {
                        "checked": false
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": 'dellDebugQtyUUID',
                      "properties": {
                        "text": "0"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "dellDebugStockQty",
                      "properties": {
                        "text": ""
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "dellDebugTableContentUUID",
                      "properties": {
                        "flexClass": "hide"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "dellDebugTableContentUUIDHeading",
                      "properties": {
                        "flexClass": "hide"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "dellDebugRepairActionUUID",
                      "properties": {
                        "visibility": false
                      }
                    }
                  },
                  {
                    "type": "handleDellDebugActions",
                    "methodType": "checkStateOfReqNotes",
                    "config": {
                      "processType": "replace",
                      "isReset": true
                    },
                    "eventSource": "click"
                  }
                ]
              },
              {
                "ctype": "button",
                "color": "primary",
                "text": "Complete",
                "class": "primary-btn",
                "uuid": "CompleteButtonUUID",
                "parentuuid": "replaceTaskUUID",
                "visibility": true,
                "disabled": true,
                "type": "submit",
                "tooltip": "",
                "hooks": [],
                "validations": [],
                "actions":
                  [
                    {
                      "type": "handleDellDebugActions",
                      "methodType": "transactionsOnClickOfComplete",
                      "eventSource": "click",
                      "config": {
                        "action": action
                      }
                    }
                  ]
              }
            ]
          }
        },
        "eventSource": "click"
      }
    ];
    // }

    this.executeActions(processActions, instance, actionService);
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * This will enable or disable the icons
   * Suppose if click on replace icon from tool bar, 
   * Then the other icons will be in disabled state till it is completed
   * or closed
   */
  private _disableOrEnableAllIcons(action: any, instance: any, actionService: any) {
    let iconsList = [
      "dellDebugReplaceIconUUID",
      "dellDebugSoftwareIconUUID",
      "dellDebugReseatIconUUID",
      "dellDebugOtherIconUUID"
    ];

    iconsList.forEach((currentIcon) => {
      if (action.config.currentProcess !== undefined &&
        !currentIcon.includes(action.config.currentProcess)) {
        if (action.config.isDisable !== undefined) {
          actionService.handleAction({
            "type": "updateComponent",
            "config": {
              "key": currentIcon,
              "properties": {
                "disabled": action.config.isDisable
              }
            }
          });
        }
      }
    });
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * @param arg3 
   * @returns List of items
   * 
   * This method will return the left side items of the task panel
   * It contains Action code, Defect, commodity and Part fields
   * Based on the process type, the fields will be displayed/added or hidden/removed
   */
  private _leftSideItems(action: any, instance: any, actionService: any) {
    let leftSideItems = [];
    leftSideItems = [
      {
        "ctype": "nativeDropdown",
        "uuid": "dellDebugActionCodeUUID",
        "hooks": this.returnActionCodeHooks(action),
        "submitable": true,
        "visibility": true,
        "required": true,
        "label": "Action Code",
        "labelPosition": "left",
        "name": action.config.processType + "ActionCode",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "dropdownClass": "dropdown-container textfield-container",
        "labelClass": "subtitle1-align-self greyish-black",
        "code": "value",
        "displayValue": "Value",
        "dataSource": "#TesttypeDropData",
        "actions": [
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "errorTitleUUID",
              "properties": {
                "titleValue": "",
                "isShown": false
              }
            }
          },
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "CompleteButtonUUID",
              "properties": {
                "disabled": true
              }
            }
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "ActionCode",
              "data": "elementControlValue"
            },
            "eventSource": "change"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "ActionCodeName",
              "data": "elementControlName"
            },
            "eventSource": "change"
          },
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "dellDebugRepairActionUUID",
              "properties": {
                "visibility": true
              }
            }
          },
          {
            "eventSource": "change",
            "type": "handleDellDebugActions",
            "methodType": "checkforValidPart"
          }
        ]
      },
      {
        "ctype": "nativeDropdown",
        "uuid": "dellDebugDefectCodeGroupUUID",
        "hooks": this.returnDefectGroupHooks(action),
        "submitable": true,
        "visibility": true,
        "required": true,
        "label": "Defect Group",
        "labelPosition": "left",
        "name": action.config.processType + "DefectCodeGroup",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "dropdownClass": "dropdown-container textfield-container",
        "labelClass": "subtitle1-align-self greyish-black",
        "code": "path",
        "displayValue": "name",
        "dataSource": "#getDellDebugDefectGroupRes",
        "actions": [
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "errorTitleUUID",
              "properties": {
                "titleValue": "",
                "isShown": false
              }
            }
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "DefectGroupValue",
              "data": "elementControlValue"
            },
            "eventSource": "change"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "DefectGroupName",
              "data": "elementControlName"
            },
            "eventSource": "change"
          },
          {
            "type": "microservice",
            "eventSource": "change",
            "config": {
              "microserviceId": "getDellDebugDefectByDefectGroup",
              "requestMethod": "post",
              "isLocal": false,
              "LocalService": "assets/Responses/dellDebugDefects.json",
              "body": {
                "locationId": "#userSelectedLocation",
                "clientId": "#userSelectedClient",
                "contractId": "#userSelectedContract",
                "orderProcessType": "#discrepancyUnitInfo.ROUTE",
                "path": "#dellDebug" + action.config.processType + "DefectGroupValue",
                "userName": "#userAccountInfo.PersonalDetails.USERID"
              },
              "toBeStringified": true
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "getdellDebug" + action.config.processType + "Defects",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isValid",
                      "lhs": "#getdellDebug" + action.config.processType + "Defects"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "dellDebugDefectUUID",
                              "dropDownProperties": {
                                "options": "#getdellDebug" + action.config.processType + "Defects"
                              },
                              "properties": {
                                "isReset": true,
                                "name": action.config.processType + "Defect"
                              },
                              "concat": true
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "dellDebug" + action.config.processType + "DC",
                              "data": ""
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "dellDebug" + action.config.processType + "DefectName",
                              "data": ""
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "dellDebugDefectUUID",
                              "dropDownProperties": {
                                "options": []
                              },
                              "properties": {
                                "isReset": true,
                                "name": action.config.processType + "Defect"
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
                "actions": [
                  {
                    "type": "handleCommonServices",
                    "config": {
                      "type": "errorRenderTemplate",
                      "contextKey": "errorMsg",
                      "updateKey": "errorTitleUUID"
                    }
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "getdellDebug" + action.config.processType + "Defects",
                      "data": ""
                    },
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dellDebugDefectUUID",
                      "dropDownProperties": {
                        "options": []
                      },
                      "properties": {
                        "isReset": true,
                        "name": action.config.processType + "Defect"
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            "eventSource": "change",
            "type": "handleDellDebugActions",
            "methodType": "checkforValidPart"
          }
        ]
      },
      {
        "ctype": "nativeDropdown",
        "uuid": "dellDebugDefectUUID",
        "hooks": this.returnDefectHooks(action),
        "submitable": true,
        "visibility": true,
        "required": true,
        "label": "Defect",
        "labelPosition": "left",
        "name": action.config.processType + "Defect",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "dropdownClass": "dropdown-container textfield-container",
        "labelClass": "subtitle1-align-self greyish-black",
        "code": "name",
        "displayValue": "name",
        "displayConcatValue": "description",
        "dataSource": "#dellDebugDefectRes",
        "actions": [
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "errorTitleUUID",
              "properties": {
                "titleValue": "",
                "isShown": false
              }
            }
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "DC",
              "data": "elementControlValue"
            },
            "eventSource": "change"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "DefectName",
              "data": "elementControlName"
            },
            "eventSource": "change"
          },
          {
            "eventSource": "change",
            "type": "handleDellDebugActions",
            "methodType": "checkforValidPart"
          }
        ]
      }
    ];

    if (action.config.processType === "replace") {
      let commodityField = {
        "ctype": "dropdownWithSearch",
        "uuid": "dellDebugCommodityUUID",
        "name": action.config.processType + "commodity",
        "hooks": this.commodityHooks(action),
        "actions": [
          {
            "type": "setDefaultValue",
            "config": {
              "key": "dellDebugPartUUID",
              "defaultValue": ""
            },
            "eventSource": "change"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "Commodity",
              "data": "elementControlValue"
            },
            "eventSource": "change"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "Commodity",
              "data": "elementControlName"
            },
            "eventSource": "change"
          },
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "dellDebugTableContentUUIDHeading",
              "properties": {
                "visibility": false,
                "flexClass": "hide"
              }
            }
          },
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "dellDebugTableContentUUID",
              "properties": {
                "visibility": false,
                "flexClass": "hide"
              }
            }
          },
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "CompleteButtonUUID",
              "properties": {
                "disabled": true
              }
            }
          },
          {
            "type": "microservice",
            "eventSource": "change",
            "config": {
              "microserviceId": "getPartsFromDellBoms",
              "isLocal": false,
              "LocalService": "assets/Responses/getCompByActionRes.json",
              "requestMethod": "get",
              "params": {
                "locationName": "#userSelectedLocationName",
                "serialNumber": "#discrepancyUnitInfo.SERIAL_NO",
                "commodityName": "#dellDebug" + action.config.processType + "Commodity",
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
                      "key": "getPartsFromDellBoms",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dellDebugPartUUID",
                      "isAutoComplete": true,
                      "properties":{
                        "placeholder" : "Scan"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dellDebugPartUUID",
                      "isAutoComplete": true,
                      "dropDownProperties": {
                        "options": "#getPartsFromDellBoms"
                      }
                    }
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "dellDebug" + action.config.processType + "partDescription",
                      "data": "#getPartsFromDellBoms"
                    }
                  },
                ]
              },
              "onFailure": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "errorDisp",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "setDefaultValue",
                    "config": {
                      "key": "dellDebugPartUUID",
                      "defaultValue": ""
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dellDebugPartUUID",
                      "isAutoComplete": true,
                      "dropDownProperties": {
                        "options": []
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dellDebugPartUUID",
                      "isAutoComplete": true,
                      "properties":{
                        "placeholder" : "No Parts Found"
                      }
                    }
                  },
                ]
              }
            }
          },
          {
            "type": "condition",
            "eventSource": "change",
            "config": {
              "operation": "isEqualTo",
              "lhs": "#dellDebug" + action.config.processType + "Commodity",
              "rhs": "MB"
            },
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "mbPPIDUUID",
                      "properties": {
                        "hidden": false,
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
                      "key": "mbPPIDUUID",
                      "properties": {
                        "hidden": true,
                        "disabled": true
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
        "required": true,
        "stopBlurEvent": true,
        "validateGroup": false,
        "code": "",
        "displayValue": "",
        "dataSource": "#getfaffvalue",
        "submitable": true,
        "visibility": true,
        "label": "Commodity",
        "readonly": false,
        "labelPosition": "left",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "dropdownClass": "dropdown-container-dell-debug-commodity textfield-container",
        "labelClass": "subtitle1-align-self greyish-black"
      };
      leftSideItems.push(commodityField);
      let selectedPart = this.contextService.getDataByString("#dellDebug" + action.config.processType + "Part");
      let partField = {
        "ctype": "autoComplete",
        "uuid": "dellDebugPartUUID",
        "name": action.config.processType + "Part",
        "hooks": this.returnPartHooks(action),
        "isUpperCase": true,
        "validateGroup": false,
        "isTrimRequired": false,
        "dataSource" : "#getPartsFromDellBoms",
        "actions": [
          {
            "type": "searchToAddContext",
            "config": this.selectedPartActions(action),
            "eventSource": "selectionChanged"
          },
          {
            "type": "searchToAddContext",
            "config": this.selectedPartActions(action),
            "eventSource": "input"
          }
        ],
        "required": true,
        "submitable": true,
        "label": "Part",
        "labelPosition": "left",
        "code": "partNumber",
        "displayValue": "completePart",
        "isSearchToAddContext": true,
        "maxLength": "",
        "minLength": "",
        "formGroupClass": "flex-container-full-width form-group-margin",
        "dropdownClass": "dropdown-container textfield-container",
        "labelClass": "subtitle1-align-self greyish-black",
        "autocompleteClass": "autocomplete_part_dell_debug",
      };

      if (selectedPart && selectedPart != "") { } else {
        partField["focus"] = false;
      }
      leftSideItems.push(partField);
      let userSelectedLocation = this.contextService.getDataByKey("userSelectedLocation");
      let reqNotesField = {
        "ctype": "textField",
        "uuid": "dellDebugReqNotesUUID",
        "name": "dellDebugReqNotes",
        "hooks": [
          {
            "type": "handleDellDebugActions",
            "methodType": "checkStateOfReqNotes",
            "config": {
              "processType": "replace"
            },
            "hookType": "afterInit"
          }
        ],
        "actions": [
          {
            "type": "updateComponent",
            "eventSource": "input",
            "config": {
              "key": "CompleteButtonUUID",
              "properties": {
                "disabled": true
              }
            }
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "ReqNotesEntered",
              "data": "elementControlValue"
            },
            "eventSource": "blur"
          },
          {
            "eventSource": "input",
            "type": "handleDellDebugActions",
            "methodType": "checkforValidPart"
          },
          {
            "eventSource": "blur",
            "type": "handleDellDebugActions",
            "methodType": "checkforValidPart"
          }
        ],
        "validations": [
          {
            "type": "regex",
            "script": ""
          }
        ],
        "type": "text",
        "required": false,
        "validateGroup": false,
        "placeholder": "Enter Value",
        "submitable": true,
        "visibility": true,
        "label": "Requisition Notes",
        "readonly": false,
        "labelPosition": "left",
        "labelClass": "greyish-black subtitle1-align-self",
        "textfieldClass": "textfield-container",
        "formGroupClass": "dell-debug-label-container-30-50"
      };
      reqNotesField.required = userSelectedLocation === "1807" ? false : true;
      leftSideItems.push(reqNotesField);
    }

    return leftSideItems;
  }

  /**
   * 
   * @param action 
   * this method returns the hooks that are to be performed
   * for action code
   */
  returnActionCodeHooks(action: any) {
    let camelCaseProcessType = action.config.text.split(" ")[0];
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#dellDebug" + action.config.processType + "ActionCodeName"
        },
        "hookType": "afterInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugActionCodeUUID",
                  "dropDownProperties": {
                    "options": "#getDellDebug" + action.config.processType + "ActionCodes"
                  }
                }
              },
              {
                "type": "setDefaultValue",
                "config": {
                  "key": "dellDebugActionCodeUUID",
                  "defaultValue": "#dellDebug" + action.config.processType + "ActionCode"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugRepairActionUUID",
                  "properties": {
                    "visibility": true
                  }
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "getDellDebugActionCode",
                  "requestMethod": "get",
                  "isLocal": false,
                  "LocalService": "assets/Responses/dellReplaceActionCodes.json",
                  "params": {
                    "locationId": "#userSelectedLocation",
                    "clientId": "#userSelectedClient",
                    "contractId": "#userSelectedContract",
                    "orderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
                    "workcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                    "actionTypes": camelCaseProcessType,
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugActionCodeUUID",
                          "dropDownProperties": {
                            "options": "#getDellDebugActionCode"
                          }
                        }
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "getDellDebug" + action.config.processType + "ActionCodes",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": action.config.processType,
                          "rhs": "replace"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "setDefaultValue",
                                "config": {
                                  "key": "dellDebugActionCodeUUID",
                                  "defaultValue": "#getProcessWCData.dellDebugDefaultActionCodeId"
                                }
                              },
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "dellDebug" + action.config.processType + "ActionCode",
                                  "data": "#getProcessWCData.dellDebugDefaultActionCodeId"
                                }
                              },
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "dellDebug" + action.config.processType + "ActionCodeName",
                                  "data": "#getProcessWCData.dellDebugDefaultActionCode"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "dellDebugRepairActionUUID",
                                  "properties": {
                                    "visibility": true
                                  }
                                }
                              },
                              {
                                "type": "handleDellDebugActions",
                                "methodType": "checkforValidPart"
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": []
                          }
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
    ];
  }

  returnDefectGroupHooks(action: any) {
    let camelCaseProcessType = action.config.text.split(" ")[0];
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#getdellDebug" + action.config.processType + "DefectGroups"
        },
        "hookType": "afterInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugDefectCodeGroupUUID",
                  "dropDownProperties": {
                    "options": "#getdellDebug" + action.config.processType + "DefectGroups"
                  }
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isValid",
                  "lhs": "#dellDebug" + action.config.processType + "DefectGroupValue"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "setDefaultValue",
                        "config": {
                          "key": "dellDebugDefectCodeGroupUUID",
                          "defaultValue": "#dellDebug" + action.config.processType + "DefectGroupValue"
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": []
                  }
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "getDellDebugDefectGroup",
                  "requestMethod": "post",
                  "isLocal": false,
                  "LocalService": "assets/Responses/dellReplaceActionCodes.json",
                  "body": {
                    "clientId": "#userSelectedClient",
                    "contractId": "#userSelectedContract",
                    "locationId": "#userSelectedLocation",
                    "orderProcessType": "#discrepancyUnitInfo.ROUTE",
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                  },
                  "toBeStringified": true
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "getdellDebug" + action.config.processType + "DefectGroups",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugDefectCodeGroupUUID",
                          "dropDownProperties": {
                            "options": "#getdellDebug" + action.config.processType + "DefectGroups"
                          }
                        }
                      },
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
    ];
  }

  /**
   * 
   * @param action 
   * this method returns the hooks that are to be performed
   * for defect
   */
  returnDefectHooks(action: any) {
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#getdellDebug" + action.config.processType + "Defects"
        },
        "hookType": "afterInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugDefectUUID",
                  "dropDownProperties": {
                    "options": "#getdellDebug" + action.config.processType + "Defects"
                  },
                  "concat": true
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isValid",
                  "lhs": "#dellDebug" + action.config.processType + "DC"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "setDefaultValue",
                        "config": {
                          "key": "dellDebugDefectUUID",
                          "defaultValue": "#dellDebug" + action.config.processType + "DC"
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": []
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
                  "key": "dellDebugDefectUUID",
                  "dropDownProperties": {
                    "options": []
                  },
                  "properties": {
                    "isReset": true,
                    "name": action.config.processType + "Defect"
                  }
                }
              }
            ]
          }
        }
      },
      {
        "type": "condition",
        "config": {
          "operation": "isEqualTo",
          "lhs": "#isPrimaryFaultExists",
          "rhs": true
        },
        "hookType": "afterInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": 'dellDebugPrimaryFaultUUID',
                  "properties": {
                    "checked": false
                  }
                }
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "dellDebug" + action.config.processType + "PrimaryFault",
                  "data": false
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "condition",
                "config": {
                  "operation": "isValid",
                  "lhs": "#dellDebug" + action.config.processType + "PrimaryFault"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#dellDebug" + action.config.processType + "PrimaryFault",
                          "rhs": true
                        },
                        "eventSource": "click",
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": 'dellDebugPrimaryFaultUUID',
                                  "properties": {
                                    "checked": true
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
                                  "key": 'dellDebugPrimaryFaultUUID',
                                  "properties": {
                                    "checked": false
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
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": 'dellDebugPrimaryFaultUUID',
                          "properties": {
                            "checked": false
                          }
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
    ];
  }

  /**
  * 
  * @param action 
  * this method returns the hooks that are to be performed
  * for commodity
  */
  commodityHooks(action: any) {
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#getdellDebugCommodities"
        },
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugCommodityUUID",
                  "dropDownProperties": {
                    "options": "#getdellDebugCommodities"
                  }
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "getdellDebugCommodities",
                  "requestMethod": "get",
                  "hookType": "beforeInit",
                  "params": {
                    "faffId": "#locationDependentFFIDDetails.commodityFFID",
                    "userName": "#userAccountInfo.PersonalDetails.USERID"
                  },
                  "toBeStringified": true,
                  "isLocal": false,
                  "LocalService": "assets/Responses/mockHoldSubCode.json"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugCommodityUUID",
                          "dropDownProperties": {
                            "options": "#getdellDebugCommodities"
                          }
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
      },
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#dellDebug" + action.config.processType + "Commodity",
        },
        "eventSource": "click",
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "setDefaultValue",
                "config": {
                  "key": "dellDebugCommodityUUID",
                  "defaultValue": "#dellDebug" + action.config.processType + "Commodity"
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "click",
                "hookType": "beforeInit",
                "config": {
                  "key": "dellDebugCommodityUUID",
                  "isDropDownWithSearch": true,
                  "name": action.config.processType + "commodity",
                  "properties": {
                    "defaultValue": "#dellDebug" + action.config.processType + "Commodity",
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
    ]
  }

  /**
   * 
   * @param action 
   * this method returns the hooks that are to be performed
   * for Part
   */
  returnPartHooks(action: any) {
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#getPartsFromDellBoms"
        },
        "hookType": "afterInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugPartUUID",
                  "isAutoComplete": true,
                  "dropDownProperties": {
                    "options": "#getPartsFromDellBoms"
                  }
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isValid",
                  "lhs": "#dellDebug" + action.config.processType + "Part"
                },
                "hookType": "afterInit",
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "extractValueBasedOnKey",
                        "hookType": "afterInit",
                        "config": {
                            "data": "getPartsFromDellBoms",
                            "reqKey": "partNumber",
                            "reqValue": "#dellDebug" + action.config.processType + "Part",
                            "key": "filteredPartObj"
                        }
                    },
                      {
                        "type": "setDefaultValue",
                        "config": {
                          "key": "dellDebugPartUUID",
                          "defaultValue": "#filteredPartObj.completePart"
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
                "type": "multipleCondition",
                "hookType": "afterInit",
                "config": {
                  "multi": true,
                  "operator": "AND",
                  "conditions": [
                    {
                      "operation": "isValid",
                      "lhs": "#dellDebug" + action.config.processType + "Part"
                    },
                    {
                      "operation": "isGreaterThan",
                      "lhs": "#partLength",
                      "rhs": 4
                    }
                  ]
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "eventSource": "input",
                        "config": {
                          "key": "dellDebugTableContentUUIDHeading",
                          "properties": {
                            "visibility": true,
                            "flexClass": "label-container-radio-group-parent-heading"
                          }
                        }
                      },
                      {
                        "type": "updateComponent",
                        "eventSource": "input",
                        "config": {
                          "key": "dellDebugTableContentUUID",
                          "properties": {
                            "visibility": true,
                            "flexClass": "label-container-radio-group-parent"
                          }
                        }
                      },
                      {
                        "type": "microservice",
                        "eventSource": "input",
                        "config": {
                          "microserviceId": "getDellDebugStockQty",
                          "requestMethod": "get",
                          "params": {
                            "pCompPartNo": "#dellDebug" + action.config.processType + "Part",
                            "pLocationId": "#userSelectedLocation",
                            "pClientId": "#userSelectedClient",
                            "pContractId": "#userSelectedContract",
                            "pWarehouseId": "#discrepancyUnitInfo.WAREHOUSE_ID",
                            "pZoneId": "55345",
                            "pWorkcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                            "pOrderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
                            "pUserName": "#userAccountInfo.PersonalDetails.USERID"
                          },
                          "isLocal": false,
                          "LocalService": "assets/Responses/availableQuantity.json"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "handleDellDebugActions",
                                "methodType": "updateStockQty",
                                "config": {
                                  "data": "#getDellDebugStockQty",
                                  "keyToUpdate": "dellDebugStockQty",
                                  "isDisable": false
                                }
                              },
                              {
                                "type": "context",
                                "config": {
                                  "data": false,
                                  "requestMethod": "add",
                                  "key": "isInvalidPart"
                                }
                              },
                              {
                                "type": "handleDellDebugActions",
                                "methodType": "checkforValidPart"
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "dellDebugStockQty",
                                  "properties": {
                                    "text": ""
                                  }
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "CompleteButtonUUID",
                                  "properties": {
                                    "disabled": true
                                  }
                                }
                              },
                              {
                                "type": "context",
                                "config": {
                                  "data": true,
                                  "requestMethod": "add",
                                  "key": "isInvalidPart"
                                }
                              },
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
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "eventSource": "input",
                        "config": {
                          "key": "dellDebugTableContentUUIDHeading",
                          "properties": {
                            "visibility": false,
                            "flexClass": "hide"
                          }
                        }
                      },
                      {
                        "type": "updateComponent",
                        "eventSource": "input",
                        "config": {
                          "key": "dellDebugTableContentUUID",
                          "properties": {
                            "visibility": false,
                            "flexClass": "hide"
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
      }
    ];
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * @param isNewPanel 
   * @returns 
   * 
   * This method returns the right side items
   * Repair action, source table data and primary flag
   */
  private _rightSideItems(action: any, instance: any, actionService: any, isNewPanel: boolean) {
    let rightSideItems = [];

    if (isNewPanel) {
      rightSideItems = [
        {
          "ctype": "nativeDropdown",
          "uuid": "dellDebugRepairActionUUID",
          "hooks": this.repairActionHooks(action),
          "submitable": true,
          "visibility": false,
          "required": true,
          "label": "Repair Action",
          "labelPosition": "left",
          "name": action.config.processType + "RepairAction",
          "formGroupClass": "flex-container-full-width form-group-margin",
          "dropdownClass": "dropdown-container textfield-container",
          "labelClass": "subtitle1-align-self greyish-black",
          "dataSource": "#dellDebugRepairActionRes",
          "actions": [
            {
              "type": "updateComponent",
              "eventSource": "change",
              "config": {
                "key": "errorTitleUUID",
                "properties": {
                  "titleValue": "",
                  "isShown": false
                }
              }
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "dellDebug" + action.config.processType + "RepairAction",
                "data": "elementControlValue"
              },
              "eventSource": "change"
            },
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "dellDebug" + action.config.processType + "RepairActionName",
                "data": "elementControlName"
              },
              "eventSource": "change"
            },
            {
              "eventSource": "change",
              "type": "handleDellDebugActions",
              "methodType": "checkforValidPart"
            }
          ]
        }
      ];
    } else {
      rightSideItems.push(this._addItem("Repair Action", action.config.taskPanelData.repairActionName));
    }

    if (action.config.processType !== "other" && isNewPanel) {
      let isPrimaryFaultExists = this.contextService.getDataByKey('isPrimaryFaultExists');
      rightSideItems.push(
        {
          "ctype": "checkbox",
          "uuid": "dellDebugPrimaryFaultUUID",
          "name": "dellDebugPrimaryFault",
          "isIcon": true,
          "icon": "primary_fault",
          "hooks": [
            {
              "type": "updateComponent",
              "hookType": "afterAction",
              "config": {
                "key": "dellDebugPrimaryFaultUUID",
                "properties": {
                  "disabled": true
                }
              }
            },
            {
              "type": "handleDellDebugActions",
              "methodType": "checkForMainIssue",
              "config": {
                "data": "#getDellDebugHPFAHistory",
              },
              "hookType": "afterAction"
            }
          ],
          "validations": [],
          "required": false,
          "disabled": isPrimaryFaultExists,
          "submitable": true,
          "label": "Primary Fault",
          "iconClass": "primary-fault-checkbox",
          "labelPosition": "after",
          "actions": [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "dellDebug" + action.config.processType + "PrimaryFault",
                "data": "elementControlValue"
              },
              "eventSource": "click"
            },
            {
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#dellDebug" + action.config.processType + "PrimaryFault",
                "rhs": true
              },
              "eventSource": "click",
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": 'dellDebugPrimaryFaultUUID',
                        "properties": {
                          "checked": true
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
                        "key": 'dellDebugPrimaryFaultUUID',
                        "properties": {
                          "checked": false
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "eventSource": "click",
              "type": "handleDellDebugActions",
              "methodType": "checkforValidPart"
            }
          ]
        }
      );
    }

    if (action.config.processType === "replace") {
      /// Table headers
      rightSideItems.push({
        "ctype": "flexFields",
        "uuid": "dellDebugTableContentUUIDHeading",
        "visibility": isNewPanel ? false : true,
        "flexClass": "label-container-radio-group-parent-heading",
        "items": [{
          "ctype": "flexFields",
          "uuid": "dellDebugTableUUID",
          "visibility": true,
          "flexClass": "label-container-radio-group-grid-3",
          "items": [
            {
              "ctype": "label",
              "text": "Source",
              "labelClass": "greyish-black"
            },
            {
              "ctype": "label",
              "text": "Qty",
              "labelClass": "greyish-black"
            },
            {
              "ctype": "label",
              "text": "Stock",
              "labelClass": "greyish-black"
            }
          ]
        }]
      });

      rightSideItems.push({
        "ctype": "flexFields",
        "uuid": "dellDebugTableContentUUID",
        "visibility": isNewPanel ? false : true,
        "flexClass": "label-container-radio-group-parent",
        "items": this._sourceTable(action, instance, actionService, isNewPanel)
      })
    }

    return rightSideItems;
  }

  /**
   * 
   * @param action 
   * @returns Returns repair action hooks
   */
  repairActionHooks(action: any) {
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#dellDebug" + action.config.processType + "RepairAction"
        },
        "hookType": "afterInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugRepairActionUUID",
                  "dropDownProperties": {
                    "options": "#getDellDebug" + action.config.processType + "RepairActions"
                  }
                }
              },
              {
                "type": "setDefaultValue",
                "config": {
                  "key": "dellDebugRepairActionUUID",
                  "defaultValue": "#dellDebug" + action.config.processType + "RepairAction"
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getDellDebugRepairActions",
                  "isLocal": false,
                  "LocalService": "assets/Responses/getQRStatus.json",
                  "requestMethod": "get",
                  "params": {
                    "faffId": "#locationDependentFFIDDetails.Repair_Action",
                    "userName": "#userAccountInfo.PersonalDetails.USERID"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugRepairActionUUID",
                          "dropDownProperties": {
                            "options": "#getDellDebugRepairActions"
                          }
                        }
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "getDellDebug" + action.config.processType + "RepairActions",
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
    ];
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * @param isNewPanel 
   * @returns 
   * 
   * This will return the table, containing the source, QTY and Stock
   */
  private _sourceTable(action: any, instance: any, actionService: any, isNewPanel: boolean): any {
    let source = [{
      "ctype": "flexFields",
      "uuid": "dellDebugQtyTableUUID#@",
      "flexClass": "label-container-radio-group-grid-3",
      "items": [
        {
          "ctype": "iconText",
          "uuid": "sourceIconUUID#@",
          "icon": 'shopping_cart',
          "text": 'LDC/FGI',
          "iconPosition": "after",
          "textClass": "body greyish-black",
          "inLine": true,
          "iconClass": "dell-debug-source-icon"
        },
        {
          "ctype": "nativeDropdown",
          "uuid": "dellDebugQTYUUID",
          "hooks": [
          ],
          "submitable": true,
          "required": false,
          "disabled": true,
          "label": "",
          "labelPosition": "left",
          "name": action.config.processType + "QTY",
          "formGroupClass": "form-group-margin",
          "dropdownClass": "dropdown-container qty-dropdwn textfield-container",
          "labelClass": "subtitle1-align-self greyish-black",
          "defaultValue": "1",
          "dataSource": ['1'],
          "actions": [
            {
              "type": "updateComponent",
              "eventSource": "change",
              "config": {
                "key": "errorTitleUUID",
                "properties": {
                  "titleValue": "",
                  "isShown": false
                }
              }
            }
          ]
        },
        {
          "ctype": "label",
          "uuid": isNewPanel ? "dellDebugStockQty" : "dellDebugStockQty#@",
          "text": "",
          "labelClass": "greyish-black cisco-stock"
        }
      ]
    }];

    return source;
  }

  /**
   * 
   * @param action 
   * @returns Actions for a selected part
   * This method is called, Whenever a part is selected from part dropdown
   */
  selectedPartActions(action: any) {
    let actions = [
      {
        "type": "context",
        "eventSource": "input",
        "config": {
          "data": true,
          "requestMethod": "add",
          "key": "isInvalidPart"
        }
      },
      {
        "type": "updateComponent",
        "eventSource": "change",
        "config": {
          "key": "CompleteButtonUUID",
          "properties": {
            "disabled": true
          }
        }
      },
      {
        "type": "updateComponent",
        "eventSource": "input",
        "config": {
          "key": "CompleteButtonUUID",
          "properties": {
            "disabled": true
          }
        }
      },
      {
        "type": "updateComponent",
        "eventSource": "input",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "",
            "isShown": false
          }
        }
      },
      {
        "requestMethod": "add",
        "key": "dellDebug" + action.config.processType + "Part",
        "event": true
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "dellDebug" + action.config.processType + "PartName",
          "data": "elementControlName"
        },
        "eventSource": "selectionChanged"
      },
      {
        "type": "context",
        "eventSource": "input",
        "config": {
          "requestMethod": "add",
          "key": "partLength",
          "data": "contextLength",
          "sourceContext": "dellDebug" + action.config.processType + "Part"
        }
      },
      {
        "type": "updateComponent",
        "eventSource": "input",
        "config": {
          "key": "dellDebugStockQty",
          "properties": {
            "text": ""
          }
        }
      },
      {
        "type": "multipleCondition",
        "eventSource": "input",
        "config": {
          "multi": true,
          "operator": "AND",
          "conditions": [
            {
              "operation": "isValid",
              "lhs": "#dellDebug" + action.config.processType + "Part"
            },
            {
              "operation": "isGreaterThan",
              "lhs": "#partLength",
              "rhs": 4
            }
          ]
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "eventSource": "input",
                "config": {
                  "key": "dellDebugTableContentUUIDHeading",
                  "properties": {
                    "visibility": true,
                    "flexClass": "label-container-radio-group-parent-heading"
                  }
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "input",
                "config": {
                  "key": "dellDebugTableContentUUID",
                  "properties": {
                    "visibility": true,
                    "flexClass": "label-container-radio-group-parent"
                  }
                }
              },
              {
                "type": "microservice",
                "eventSource": "input",
                "config": {
                  "microserviceId": "getDellDebugStockQty",
                  "requestMethod": "get",
                  "params": {
                    "pCompPartNo": "#dellDebug" + action.config.processType + "Part",
                    "pLocationId": "#userSelectedLocation",
                    "pClientId": "#userSelectedClient",
                    "pContractId": "#userSelectedContract",
                    "pWarehouseId": "#discrepancyUnitInfo.WAREHOUSE_ID",
                    "pZoneId": "55345",
                    "pWorkcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                    "pOrderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
                    "pUserName": "#userAccountInfo.PersonalDetails.USERID"
                  },
                  "isLocal": false,
                  "LocalService": "assets/Responses/availableQuantity.json"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "handleDellDebugActions",
                        "methodType": "updateStockQty",
                        "config": {
                          "data": "#getDellDebugStockQty",
                          "keyToUpdate": "dellDebugStockQty",
                          "isDisable": false
                        }
                      },
                      {
                        "type": "context",
                        "config": {
                          "data": false,
                          "requestMethod": "add",
                          "key": "isInvalidPart"
                        }
                      },
                      {
                        "type": "handleDellDebugActions",
                        "methodType": "checkforValidPart"
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugStockQty",
                          "properties": {
                            "text": ""
                          }
                        }
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "CompleteButtonUUID",
                          "properties": {
                            "disabled": true
                          }
                        }
                      },
                      {
                        "type": "context",
                        "config": {
                          "data": true,
                          "requestMethod": "add",
                          "key": "isInvalidPart"
                        }
                      },
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
          },
          "onFailure": {
            "actions": [
              {
                "type": "updateComponent",
                "eventSource": "input",
                "config": {
                  "key": "dellDebugTableContentUUIDHeading",
                  "properties": {
                    "visibility": false,
                    "flexClass": "hide"
                  }
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "input",
                "config": {
                  "key": "dellDebugTableContentUUID",
                  "properties": {
                    "visibility": false,
                    "flexClass": "hide"
                  }
                }
              }
            ]
          }
        }
      },
      {
        "eventSource": "blur",
        "type": "handleDellDebugActions",
        "methodType": "checkforValidPart"
      }
    ];

    return actions;
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * These are the transactions that are to be performed on click of 
   * complete button.
   */
  private _transactionsOnClickOfComplete(action: any, instance: any, actionService: any) {
    let taskPanelData;
    action = action.config.action;
    let dellDebugPrimaryFault = this.contextService.getDataByKey("dellDebug" + action.config.processType + "PrimaryFault");
    let primaryFaultStatus;
    let enteredReqNotes = this.contextService.getDataByKey("dellDebug" + action.config.processType + "ReqNotesEntered");
    if (action.config.isLooperControlTask) {
      primaryFaultStatus = action.config.taskPanelData.primaryFault;
    } else {
      primaryFaultStatus = dellDebugPrimaryFault && dellDebugPrimaryFault === true ? dellDebugPrimaryFault : false;
    }
    if (enteredReqNotes && enteredReqNotes !== "") {
      this.contextService.addToContext("dellDebug" + action.config.processType + "ReqNotes", enteredReqNotes);
    } else {
      let reqNotes = this.contextService.getDataByKey("dellDebugreplaceReqNotes");
      if (reqNotes && reqNotes !== "") {
        this.contextService.addToContext("dellDebug" + action.config.processType + "ReqNotes", reqNotes);
      } else {
        this.contextService.addToContext("dellDebug" + action.config.processType + "ReqNotes", "");
      }
    }
    taskPanelData = {
      "actionCode": this.contextService.getDataByString("#dellDebug" + action.config.processType + "ActionCode"),
      "actionCodeName": this.contextService.getDataByString("#dellDebug" + action.config.processType + "ActionCodeName"),
      "defect": this.contextService.getDataByString("#dellDebug" + action.config.processType + "DC"),
      "defectName": this.contextService.getDataByString("#dellDebug" + action.config.processType + "DefectName"),
      "qty": this.contextService.getDataByString("#dellDebug" + action.config.processType + "AvailableQuantity"),
      "part": this.contextService.getDataByString("#dellDebug" + action.config.processType + "Part"),
      "partDetails": this.contextService.getDataByString("#getDellDebugStockQty"),
      "repairAction": this.contextService.getDataByString("#dellDebug" + action.config.processType + "RepairAction"),
      "repairActionName": this.contextService.getDataByString("#dellDebug" + action.config.processType + "RepairActionName"),
      "primaryFaultStatus": primaryFaultStatus,
      "commodity": this.contextService.getDataByString("#dellDebug" + action.config.processType + "Commodity")
    };
    action.config["taskPanelData"] = taskPanelData;
    let transactions = [];

    /// Checking for the process type and filetering the services to
    /// be called
    if (action.config.processType === "replace") {
      transactions.push(
        {
          "type": "microservice",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "getDellDebugStockQty",
            "requestMethod": "get",
            "params": {
              "pCompPartNo": action.config.taskPanelData.part,
              "pLocationId": "#userSelectedLocation",
              "pClientId": "#userSelectedClient",
              "pContractId": "#userSelectedContract",
              "pWarehouseId": "#discrepancyUnitInfo.WAREHOUSE_ID",
              "pZoneId": "55345",
              "pWorkcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
              "pOrderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
              "pUserName": "#userAccountInfo.PersonalDetails.USERID"
            },
            "isLocal": false,
            "LocalService": "assets/Responses/availableQuantity.json"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": this._commonTransactions(action)
            },
            "onFailure": {
              "actions": []
            }
          }
        }
      );
    } else {
      transactions = this._commonTransactions(action);
    }

    this.executeActions(transactions, instance, actionService);
  }

  /**
   * 
   * @param action 
   * @param primaryFaultStatus 
   * @returns 
   * 
   * The common transaction returns the actions which are common
   * for all the tasks i.e.. replace, software, reseat and other
   */
  private _commonTransactions(action: any) {
    let commonTransaction = [];
    let flexField: any[];
    flexField = [
      {
        "name": "Repair_Action",
        "value": action.config.taskPanelData.repairAction
      }];

    if (action.config.processType === "replace") {
      flexField.push({
        "name": "Commodity",
        "value": action.config.taskPanelData.commodity,
        "codePath": "/-1/-1/"
      });
    }

    commonTransaction = [
      {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "performFA",
          "requestMethod": "post",
          "isLocal": false,
          "LocalService": "assets/Responses/performFA.json",
          "body": {
            "updateFailureAnalysisRequest": {
              "bcn": "#discrepancyUnitInfo.ITEM_BCN",
              "actionCodeChangeList": {
                "actionCodeChange": [
                  {
                    "defectCode": {
                      "value": action.config.taskPanelData.defect
                    },
                    "notes": action.config.taskPanelData.part,
                    "actionCode": action.config.taskPanelData.actionCodeName,
                    // "actionCode": "DRR",
                    "operation": "Add",
                    "flexFieldList": {
                      "flexField": flexField
                    }
                  }
                ],
              },
              "defectCodeChangeList": {
                "defectCodeChange": [
                  {
                    "defectCode": action.config.taskPanelData.defect,
                    "operation": "Add",
                    "notes": action.config.taskPanelData.part,
                    "flexFieldCodeList": {
                      "flexFieldCode": [
                        {
                          "name": "Main Issue2",
                          "codePath": "/-1/-1/",
                          "value": action.config.taskPanelData.primaryFaultStatus ? "Yes" : "No"
                        }
                      ]
                    }
                  }
                ],
              }
            },
            "userPwd": {
              "username": "#userAccountInfo.PersonalDetails.USERID",
              "password": "#loginUUID.password"
            },
            "operationTypes": "ProcessImmediate",
            "ip": "::1",
            "callSource": "FrontEnd",
            "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
            "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
          },
          "toBeStringified": true,
          "spliceIfEmptyValueObject": [
            {
              "identifier": "actionCodeChange",
              "valueField": "notes"
            },
            {
              "identifier": "defectCodeChange",
              "valueField": "notes"
            },
          ]
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "getDellDebugHPFAHistory",
                  "requestMethod": "get",
                  "params": {
                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                    "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                    "userName": "#userAccountInfo.PersonalDetails.USERID"
                  },
                  "toBeStringified": true,
                  "isLocal": false,
                  "LocalService": "assets/Responses/mockHoldSubCode.json"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "handleDellDebugActions",
                        "methodType": "checkForNewlyAddedItem",
                        "config": {
                          "data": "getDellDebugHPFAHistory",
                          "action": action,
                          "isLooperControlTask": false
                        }
                      },
                      {
                        "type": "handleDellDebugActions",
                        "methodType": "checkForReplaceTask"
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
    return commonTransaction;
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * This method will be called
   * When user clicks on complete button of the task panel,
   * When some tasks are coming from looper control task
   */
  private _onClickOfCompleteButton(action: any, instance: any, actionService: any) {
    let actions = [];
    let isTaskcompleted = false;
    let addItemToReqList = false;
    
    if (!action.config.isLooperControlTask) {
      action = action.config.action;
    } else {
      this.addItemToActionIdList(action.config.taskPanelData);
      if (action.config.taskStatus) {
        let taskStatus = action.config.taskStatus;
        if (taskStatus.startsWith('#')) {
          taskStatus = this.contextService.getDataByString(taskStatus);
        }
        if (taskStatus && taskStatus.length != 0) {
          taskStatus.map((item) => {
            if (item["TRX_TYPE"] === "Issued") {
              isTaskcompleted = true;
            }
          });
        }
      }
    }

    /// If the task is not completed,then we are adding it to
    /// New hpfaHistory.
    let newHPFAHistory = this.contextService.getDataByKey("newHPFAHistory");
    if (newHPFAHistory && newHPFAHistory !== "" && newHPFAHistory.length > 0) {
      newHPFAHistory.forEach((item) => {
        if (action.config.processType === "replace" && item.actionId === action.config.taskPanelData.actionId) {
          addItemToReqList = true;
        }
      })
    }

    actions = [
      {
        "type": "updateComponent",
        "eventSource": "click",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "",
            "isShown": false
          }
        }
      },
      {
        "type": "deleteComponent",
        "eventSource": "click",
        "config": {
          "key": "dellDebugTaskPanelUUID"
        }
      },
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data": {
            "ctype": "taskPanel",
            "uuid": "dellDebugCreatedTaskPanelUUID",
            "isyellowBorder": true,
            "uniqueUUID": true,
            "updateUUID": true,
            "title": "",
            "columnWiseTitle": true,
            "header": {
              "svgIcon": action.config.svgIcon,
              "iconClass": "active-header",
              "headerclass": "replaceheaderclass",
              "status": "",
              "statusIcon": "info_outline",
              "statusClass": "eco-icon"
            },
            "headerTitleLabels": [
              this._getHeader(action),
              "",
              "",
              ""
            ],
            "headerTitleValues": [
              action.config.taskPanelData.defectName,
              "",
              "",
              "",
              "Diagnosis"
            ],
            "inputClasses": [
              "parent1-width",
              "parent2"
            ],
            "expanded": false,
            "hideToggle": true,
            "splitView": true,
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "bodyclass": "splitView",
            "panelClass": "top-margin",
            "leftDivclass": "width:50%",
            "rightDivclass": "width:50%",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "disabled": false,
            "hooks": this._createdTaskHooks(action, addItemToReqList),
            "validations": [],
            "actions": [
              {
                "type": "handleDellDebugActions",
                "methodType": "disableOrEnableAllIcons",
                "eventSource": "click",
                "config": {
                  "currentProcess": action.config.processType,
                  "isDisable": false
                }
              }
            ],
            "items": this._getItems(action, addItemToReqList),
            "rightItems": this._rightSideItems(action, instance, actionService, false),
            "footer": this._getFooter(action, instance, actionService, isTaskcompleted)
          }
        },
        "eventSource": "click"
      }
    ];

    this.executeActions(actions, instance, actionService);

    if (action.config.processType === "replace" && !action.config.isLooperControlTask) {
      actionService.handleAction({
        "type": "triggerreqclick",
        "eventSource": "click",
        "config": {
          "key": "dellDebugReqListButtonUUID"
        }
      }, this);
    }

  }

  /**
   * 
   * @param action 
   * @returns 
   * 
   * Returns the header for created task panel
   */
  private _getHeader(action: any) {
    return action.config.processType === "replace" ? "Replace Part - " :
      action.config.processType.substring(0, 1).toUpperCase() + action.config.processType.substring(1) + ' - ';
  }

  /**
   * 
   * @param action 
   * 
   * The hooks that are to be called after the creation of new panel
   */
  private _createdTaskHooks(action: any, addItemToReqList) {
    let hooks = [];
    let getDellDebugStockQty = action.config.isLooperControlTask ? action.config.getDellDebugStockQty : "#getDellDebugStockQty";
    if (action.config.processType === "replace") {
      hooks = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "defectCodeList",
            "sourceData": {
              "defectCode": action.config.taskPanelData.defect
            }
          },
          "hookType": "afterInit"
        },
        {
          "type": "addOccurenceToContext",
          "hookType": "afterInit",
          "config": {
            "target": "occurenceList",
            "taskUuid": "#@",
            "currentDefectCode": action.config.taskPanelData.defect
          },
          "eventSource": "click"
        },
        {
          "type": "condition",
          "hookType": "afterInit",
          "config": {
            "operation": "isEqualTo",
            "lhs": addItemToReqList,
            "rhs": true
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "addToExistingContext",
                    "target": "dellDebugReqList",
                    "sourceData": {
                      "Part Details": [
                        {
                          "ctype": "block-text",
                          "uuid": "StockUUID",
                          "text": "Part : ",
                          "textValue": action.config.taskPanelData.part,
                          "class": "subtitle1-align-self greyish-black width-200"
                        },
                        {
                          "ctype": "block-text",
                          "uuid": "StockUUID",
                          "textValue": action.config.taskPanelData.partDetails[0].partDescription,
                          "class": "subtitle1-align-self greyish-black overflow-wrap width-200"
                        }
                      ],
                      "Qty": [
                        {
                          "ctype": "block-text",
                          "uuid": "dellDebugReqlistQtyUUID",
                          "text": '1'
                        },
                        {
                          "ctype": "block-text",
                          "uuid": "displayQuantityUUID",
                          "class": "light-red body margin-top-10",
                          "text": this._stocktoDisplay(getDellDebugStockQty)
                        }
                      ],
                      "parentUUID": "#createdComponentUUID"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "context",
                  "hookType": "afterInit",
                  "config": {
                    "requestMethod": "add",
                    "key": "dellDebugReqListLength",
                    "data": "contextLength",
                    "sourceContext": "dellDebugReqList"
                  }
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "addToExistingContext",
                    "target": "dellDebugTableData",
                    "sourceData": {
                      "parentUUID": "#@",
                      "flexFields": this._getTableFlexData(action)
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "addToExistingContext",
                    "target": "dltRecRefArray",
                    "sourceData": {
                      "uuid": "#@",
                      "defect": action.config.taskPanelData.defect
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "condition",
                  "hookType": "afterInit",
                  "config": {
                    "operation": "isValid",
                    "lhs": "#dellDebugReqListStatus"
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "hookType": "afterInit",
                          "config": {
                            "requestMethod": "add",
                            "key": "dellDebugReqListStatus",
                            "data": action.config.isLooperControlTask ? "#dellDebugReqListStatus" : "- Unsaved"
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "context",
                          "hookType": "afterInit",
                          "config": {
                            "requestMethod": "add",
                            "key": "dellDebugReqListStatus",
                            "data": "- Unsaved"
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "addToExistingContext",
                    "target": "dellDebugLineList",
                    "sourceData": {
                      "compLocation": "#repairUnitInfo.GEONAME",
                      "partNumber": action.config.taskPanelData.part,
                      "defectName": action.config.taskPanelData.defect,
                      "itemBCN": "#repairUnitInfo.ITEM_BCN",
                      "quantity": "1",
                      "owner": "Dell",
                      "condition": "Refurbished",
                      "priority": "Medium"
                    }
                  },
                  "hookType": "afterInit"
                },
                {
                  "type": "condition",
                  "hookType": "afterInit",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": action.config.isLooperControlTask,
                    "rhs": true,
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "condition",
                          "config": {
                            "operation": "isEqualTo",
                            "lhs": action.config.isLastItem,
                            "rhs": true,
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "triggerreqclick",
                                  "hookType": "afterInit",
                                  "config": {
                                    "key": "dellDebugReqListButtonUUID"
                                  }
                                }
                              ]
                            },
                            "onFailure": {
                              "actions": []
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
            "key": "dellDebugReqListButtonUUID",
            "properties": {
              "textValue": "#dellDebugReqListStatus",
              "textValueClass": "light-red body",
              "count": "#dellDebugReqListLength"
            }
          },
          "hookType": "afterInit"
        },
        {
          "type": "handleDellDebugActions",
          "methodType": "updateStockQty",
          "config": {
            "data": getDellDebugStockQty,
            "keyToUpdate": "dellDebugStockQty#@",
            "isDisable": false
          },
          "hookType": "afterInit"
        }
      ];
      // if (action.config.isLooperControlTask) {
      //   hooks.push({
      //     "type": "condition",
      //     "hookType": "afterInit",
      //     "config": {
      //       "operation": "isEqualTo",
      //       "lhs": "#dellDebugReqListStatus",
      //       "rhs": "- Saved",
      //     },
      //     "responseDependents": {
      //       "onSuccess": {
      //         "actions": this.saveReqActions(false)
      //       },
      //       "onFailure": {
      //         "actions": []
      //       }
      //     }
      //   });
      // }
    } else {
      hooks = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "defectCodeList",
            "sourceData": {
              "defectCode": action.config.taskPanelData.defect
            }
          },
          "hookType": "afterInit"
        },
        {
          "type": "addOccurenceToContext",
          "hookType": "afterInit",
          "config": {
            "target": "occurenceList",
            "taskUuid": "#@",
            "currentDefectCode": action.config.taskPanelData.defect
          },
          "eventSource": "click"
        },
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "dellDebugTableData",
            "sourceData": {
              "parentUUID": "#@",
              "flexFields": this._getTableFlexData(action)
            }
          },
          "hookType": "afterInit"
        },
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "dltRecRefArray",
            "sourceData": {
              "uuid": "#@",
              "defect": action.config.taskPanelData.defect
            }
          },
          "hookType": "afterInit"
        }
      ]
    }

    hooks.push({
      "type": "handleDellDebugActions",
      "methodType": "checkForReplaceTask",
      "hookType": "afterInit"
    });
    hooks.push({
      "type": "handleDellDebugActions",
      "methodType": "disableOrEnableAllIcons",
      "hookType": "afterInit",
      "config": {
        "currentProcess": action.config.processType,
        "isDisable": false
      }
    })

    return hooks;
  }

  /**
* 
* @param stockToDisplay 
* @returns Stock quantity
*/
  private _stocktoDisplay(stockToDisplay: string) {
    let stock = this.contextService.getDataByString(stockToDisplay);
    if (stock && stock[0].availableQty === "0") {
      return "Out of stock";
    } else {
      return "";
    }
  }

  /**
   * 
   * @param action 
   * @returns 
   * 
   * Returns the current flex field data
   */
  private _getTableFlexData(action: any) {
    let flexData = [];
    flexData.push(action.config.taskPanelData);
    return flexData;
  }

  /**
   * 
   * @param currentItem 
   * @returns 
   * 
   * This will return the items for the created task panel
   */
  _getItems(currentItem: any, addItemToReqList) {
    let currentData = currentItem.config.taskPanelData;
    currentData["reqNotes"] = this.contextService.getDataByString("#dellDebugreplaceReqNotes");
    let items = [];
    let data = {
      "actionCodeName": "",
      "defectName": ""
    };

    if (currentItem.config.processType === "replace") {
      data["commodity"] = "";
      data["part"] = "";
      if (addItemToReqList && currentData["reqNotes"] !== undefined && currentData["reqNotes"] !== "") {
        data["reqNotes"] = this.contextService.getDataByString("#dellDebugreplaceReqNotes");
      }
    }


    for (let currentKey in data) {
      if (currentData[currentKey] !== undefined && currentData[currentKey] !== null) {
        data[currentKey] = currentData[currentKey];
      }
    }
    currentData = data;

    for (let currentKey in currentData) {
      if (currentKey === "actionCodeName" ||
        currentKey === "defectName" ||
        currentKey === "commodity" ||
        currentKey === "part" ||
        currentKey === "reqNotes") {

        let label = currentKey === "actionCodeName" ? "Action Code"
          : currentKey === "defectName" ? "Defect"
            : currentKey === "commodity" ? "Commodity" :
              currentKey === "reqNotes" ? "Requisition Notes" : "Part";

              if (currentData[currentKey] !== undefined && currentData[currentKey] !== "") {
                items.push(this._addItem(label, currentData[currentKey]));

        }
      }
    }

    return items;
  }

  /**
   * 
   * @param label 
   * @param currentData 
   * @returns 
   * 
   * This will be called for each field and displays the selected values
   */
  _addItem(label: string, currentData: any): any {
    let data = currentData;
    return {
      "ctype": "flexFields",
      "uuid": "dellDebugFailCodeTitleUUID",
      "flexClass": "cisco-debug-label-container-30-50",
      "items": [
        {
          "ctype": "label",
          "text": label,
          "labelClass": "greyish-black subtitle1-align-self"
        },
        {
          "ctype": "label",
          "text": data,
          "labelClass": "greyish-black"
        }
      ]
    };
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * This will return the footer for created task panel and looper
   * control tasks
   */
  private _getFooter(action: any, instance: any, actionService: any, isTaskcompleted: boolean) {
    let footerItems = [];
    let primaryFaultCheckboxValue = this.contextService.getDataByKey("dellDebug" + action.config.processType + "PrimaryFault");
    let primaryFaultStatus;
    if (action.config.isLooperControlTask) {
      primaryFaultStatus = action.config.taskPanelData.mainIssue2 === "Yes" ? true : false;
    } else {
      primaryFaultStatus = primaryFaultCheckboxValue ? primaryFaultCheckboxValue : false;
    }

    if (primaryFaultStatus) {
      actionService.handleAction(
        {
          "type": "context",
          "config": {
            "requestMethod": "add",
            "key": "isPrimaryFaultExists",
            "data": primaryFaultStatus
          }
        }, instance)
    }

    if (action.config.processType !== "other") {
      footerItems.push(
        {
          "ctype": "checkbox",
          "uuid": "dellDebugPrimaryFaultUUID#@",
          "name": "dellDebugPrimaryFault",
          "checked": primaryFaultStatus,
          "isIcon": true,
          "icon": "primary_fault",
          "hooks": [],
          "validations": [],
          "iconClass": "primary-fault-checkbox",
          "required": false,
          "disabled": true,
          "submitable": true,
          "label": "Primary Fault",
          "labelPosition": "after",
          "actions": []
        }
      );
    }

    footerItems.push(
      {
        "ctype": "spacer",
        "uuid": "emptySpaceUUID",
        "class": "empty-space"
      });

    let deleteButton = {
      "ctype": "button",
      "text": "Delete",
      "class": "primary-btn dell-debug-delete-button",
      "icon": "delete",
      "iconClass": "iconbtn",
      "textClass": "body2",
      "uuid": "dellDebugcreatedDeleteUUID#@",
      "parentuuid": "#@",
      "visibility": true,
      "disabled": false,
      "isIcon": true,
      "type": "submit",
      "actions": this._deleteButtonActions(action)
    };
    if (action.config.processType === "replace" && isTaskcompleted) {
      deleteButton.class = "primary-btn dell-debug-delete-button-disable",
        deleteButton.disabled = true;
    }
    footerItems.push(deleteButton);

    footerItems.push({
      "ctype": "button",
      "color": "primary",
      "text": "Complete",
      "class": "primary-btn",
      "uuid": "dellDebugCreatedCompleteUUID#@",
      "parentuuid": "#@",
      "checkGroupValidity": false,
      "visibility": true,
      "disabled": true,
      "type": "submit",
      "tooltip": "",
      "hooks": [],
      "validations": [],
      "actions": []
    }
    );
    return footerItems;
  }

  /**
   * 
   * @param action 
   * @returns 
   * 
   * Returns the delete button actions
   */
  _deleteButtonActions(action: any) {
    let actions = [];
    actions = [
      {
        "type": "getFilteredFromContext",
        "config": {
          "target": "#occurenceList",
          "key": "currentOccurenceData#@",
          "properties": {
            "key": "#@"
          }
        },
        "eventSource": "click"
      }
    ];

    /// This is for cancelFA code
    actions.push({
      "type": "microservice",
      "eventSource": "click",
      "config": {
        "microserviceId": "cancelFA",
        "requestMethod": "post",
        "isLocal": false,
        "LocalService": "assets/Responses/performFA.json",
        "body": {
          "updateFailureAnalysisRequest": {
            "bcn": "#repairUnitInfo.ITEM_BCN",
            "defectCodeChangeList": {
              "defectCodeChange": [
                {
                  "defectCode": action.config.taskPanelData.defect,
                  "operation": "Delete",
                  "occurrence": "#currentOccurenceData#@.defectCodeOccurence"
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
        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "deleteComponent",
              "eventSource": "click",
              "config": {
                "key": "#@"
              }
            },
            {
              "type": "deleteAndUpdateOccurence",
              "config": {
                "target": "#occurenceList",
                "key": "#@",
                "currentTaskData": "#currentOccurenceData#@"
              },
              "eventSource": "click"
            },
            {
              "type": "handleDellDebugActions",
              "methodType": "updateHPFAHistory",
              "config": {
                "actionId": action.config.taskPanelData.actionId
              }
            },
            {
              "type": "condition",
              "eventSource": "click",
              "config": {
                "operation": "isEqualTo",
                "lhs": action.config.processType,
                "rhs": "replace"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "handleDellDebugActions",
                      "methodType": "removeValueFromTable",
                      "config": {
                        "arrayData": "#dellDebugTableData",
                        "PullValue": "#@",
                        "key": "parentUUID",
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
                "lhs": action.config.taskPanelData.primaryFaultStatus,
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
    });

    return actions;
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * This method is used to remove an item from requistion list
   */
  _removeValueFromTable(action: any, instance: any, actionService: any) {
    let getvaluefromArray;
    let indexOfArray;
    let parentuuidName;

    if (instance.parentuuid !== undefined && instance.parentuuid != null && instance.parentuuid.startsWith('#')) {
      parentuuidName = this.contextService.getDataByString(
        instance.parentuuid
      );
    } else {
      parentuuidName = instance.parentuuid;
    }

    if (action.config.arrayData.startsWith('#')) {
      let contextArray = this.contextService.getDataByString(
        action.config.arrayData
      );

      if (action.config.key !== undefined) {
        getvaluefromArray = contextArray.find((x) => x[action.config.key] === parentuuidName)[action.config.property][0];

        if (action.config.splice !== undefined && action.config.splice) {
          indexOfArray = contextArray.findIndex((x) => x[action.config.key] == parentuuidName);
          // getvaluefromArray = contextArray.splice(indexOfArray, 1);
          /// To Do : make this generic
          /// Delete from linelist context too
          contextArray.splice(indexOfArray, 1);
          this.contextService.addToContext(action.config.arrayData, contextArray);

          /// Delete from requistionList context
          let requisitionList = [];
          requisitionList = this.contextService.getDataByKey(action.config.keyToFind);
          const reqListIndex = requisitionList.findIndex((x) => x[action.config.key] === parentuuidName);
          requisitionList.splice(reqListIndex, 1);
          this.contextService.addToContext(action.config.keyToFind, requisitionList);

          /// splice the same index as above from linelist too
          if (action.config.lineList != undefined && action.config.lineList) {
            let lineList = [];
            lineList = this.contextService.getDataByKey(action.config.lineList);
            lineList.splice(reqListIndex, 1);
            this.contextService.addToContext(action.config.lineList, lineList);
          }
          let requisitionLength;
          requisitionLength = requisitionList.length;
          this.contextService.addToContext(action.config.keyToFind + 'Length', requisitionLength);

          if (action.config.deleteTableData !== undefined) {
            /// Update mat table -- This will be moved to seperate action later
            const matTableRef = this.contextService.getDataByKey(action.config.tableUUID + 'ref');
            matTableRef.instance.matTableDataSource.data = requisitionList;
            matTableRef.instance.matTableDataSource._updateChangeSubscription();
            matTableRef.instance._changeDetectionRef.detectChanges();
          }
        }
      }
      else {
        contextArray.forEach((ele) => {
          if (
            ele.storageHoldSubCode == instance.group.controls[instance.name].value
          ) {
            getvaluefromArray = ele[action.config.PullValue];
            return;
          }
        });
      }
    }
    this.contextService.addToContext(
      action.config.PullValue,
      getvaluefromArray
    );
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * Updates the stock quantity
   */
  updateStockQty(action, instance, actionService) {
    let data = this.contextService.getDataByString(action.config.data);
    let classToApply = "saved-green body";
    let stock;
    if (data) {
      if (data[0].availableQty === "0") {
        classToApply = "light-red heading1 padding-left-10";
        stock = data[0].availableQty;
      } else {
        stock = data[0].availableQty + " Available";
      }
    } else {
      stock = "";
    }

    actionService.handleAction(
      {
        "type": "updateComponent",
        "config": {
          "key": action.config.keyToUpdate,
          "properties": {
            "labelClass": classToApply,
            "text": stock
          }
        }
      }, instance)
  }

  /**
   * @param action 
   * @param instance 
   * @param actionService 
   * It will loop all the defects and add a unique index to each defect
   */
  addIndexesToDefectCodes(action, instance, actionService) {
    let defectCodes = this.contextService.getDataByKey(action.config.data)
    if (defectCodes !== null && defectCodes !== undefined) {
      defectCodes.forEach((element, index) => {
        defectCodes[index]["unqNumber"] = index;
      });
    }
    this.contextService.addToContext("getDellDebug" + action.config.processType + "Defects", defectCodes);
    actionService.handleAction({
      "type": "updateComponent",
      "config": {
        "key": "dellDebugDefectUUID",
        "dropDownProperties": {
          "options": defectCodes
        },
        "concat": true
      }
    }, instance)
  }

  _dellDebugHoldActions(action, instance, actionService) {
    let holdActions = [{
      "type": "dialog",
      "uuid": "dellPauseDialogUUID",
      "config": {
        "title": "Hold",
        "disableClose": true,
        "items": [
          {
            "ctype": "title",
            "uuid": "holdBinErrorUUID",
            "titleClass": "error-title-holdbin",
            "isShown": false
          },
          {
            "ctype": "nativeDropdown",
            "formGroupClass": "discrepancy-holddrpdwn",
            "uuid": "dellDebugHoldTypeUUID",
            "label": "Hold Type",
            "name": "dellDebugHoldType",
            "dataSource": "#filteredHoldTypes",
            "code": "storageHoldCode",
            "displayValue": "storageHoldCode",
            "required": true,
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "storageHoldCode",
                  "data": "elementControlValue"
                },
                "eventSource": "change"
              },
              {
                "type": "condition",
                "eventSource": "change",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#storageHoldCode",
                  "rhs": "Awaiting Part"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugHoldPartUUID",
                          "properties": {
                            "hidden": false,
                            "required": true
                          }
                        }
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "holdCodeUUID",
                          "properties": {
                            "hidden": true,
                            "required": false
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
                          "key": "dellDebugHoldPartUUID",
                          "properties": {
                            "hidden": true,
                            "required": false
                          }
                        }
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "holdCodeUUID",
                          "properties": {
                            "hidden": false,
                            "required": true
                          }
                        }
                      }
                    ]
                  }
                }
              },
              {
                "type": "conditionalFilterData",
                "config": {
                  "data": "#holdCodesForDiscrepancy",
                  "targetContextKey": "holdSubCodeData",
                  "keyName": "#storageHoldCode",
                  "filterRefValue": "storageHoldCode",
                  "targetUUID": "holdCodeUUID",
                  "name": "holdCodes"
                },
                "eventSource": "change"
              },
              {
                "type": "conditionalDestinationLocationData",
                "config": {
                  "data": "#holdSubCodeData",
                  "filterRefValue": "destStkLocationName"
                },
                "eventSource": "change"
              },
            ]
          },
          {
            "ctype": "nativeDropdown",
            "formGroupClass": "discrepancy-holddrpdwn",
            "uuid": "holdCodeUUID",
            "label": "Hold Code",
            "name": "holdCodes",
            "dataSource": "#holdSubCodeData",
            "code": "storageHoldSubCode",
            "displayValue": "storageHoldSubCode",
            "required": true,
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "storageHoldCode",
                  "data": "elementControlValue"
                },
                "eventSource": "change"
              }
            ]
          },
          {
            "ctype": "textField",
            "uuid": "dellDebugHoldPartUUID",
            "submitable": false,
            "disabled": false,
            "validations": [],
            "hidden": true,
            "inLine": true,
            "formGroupClass": "flex-container",
            "textfieldClass": "hold-textfield-container",
            "labelClass": "hold-tf-label",
            "hooks": [],
            "name": "storageHoldSubCodeValue",
            "label": "Part Number(s)",
            "labelPosition": "left",
            "tooltip": "",
            "TooltipPosition": "",
            "defaultValue": "",
            "readonly": false,
            "type": "text",
            "required": false,
            "placeholder": "Enter Value",
            "value": "",
            "prefix": false,
            "prefixIcon": "",
            "suffix": false,
            "suffixIcon": "",
            "actions": []
          },
          {
            "ctype": "textField",
            "uuid": "dellAssessmentBinUUID",
            "submitable": false,
            "disabled": false,
            "validations": [],
            "hidden": false,
            "inLine": true,
            "formGroupClass": "flex-container required-note",
            "textfieldClass": "hold-textfield-container",
            "labelClass": "hold-tf-label",
            "hooks": [],
            "name": "storageBin",
            "label": "Hold Bin",
            "labelPosition": "left",
            "tooltip": "",
            "TooltipPosition": "",
            "defaultValue": "",
            "readonly": false,
            "type": "text",
            "required": true,
            "placeholder": "Enter Value",
            "value": "",
            "prefix": false,
            "prefixIcon": "",
            "suffix": false,
            "suffixIcon": "",
            "actions": []
          },
          {
            "ctype": "textarea",
            "label": "Add note",
            "name": "holdAddNote",
            "value": "",
            "textareaContainer": "timeout-class required-note",
            "uuid": "holdNodeUUID",
            "required": true,
            "submitable": true,
            "actions": []
          }
        ],
        "footer": [
          {
            "ctype": "button",
            "color": "primary",
            "text": "Cancel",
            "uuid": "cancelHoldUUID",
            "closeType": "close",
            "disableClose": true,
            "visibility": true,
            "dialogButton": true,
            "type": "",
            "hooks": [],
            "validations": [],
            "actions": []
          },
          {
            "ctype": "button",
            "color": "primary",
            "text": "Done",
            "uuid": "doneHoldUUID",
            "dialogBoxHoldBinErrorMessage": true,
            "dialogButton": true,
            "visibility": true,
            "disabled": true,
            "type": "submit",
            "closeType": "success",
            "hooks": [],
            "validations": [],
            "actions": [
              {
                "type": "context",
                "config": {
                  "key": "holdAddNote",
                  "data": "formData",
                  "requestMethod": "add",
                  "value": "holdAddNote"
                },
                "eventSource": "click"
              },
              {
                "eventSource": "click",
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "key": "holdDialogData",
                          "data": "formData",
                          "requestMethod": "add"
                        }
                      },
                      {
                        "type": "condition",
                        "config": {
                          "operation": "isValid",
                          "lhs": "#storageHoldCode"
                        },
                        "eventSource": "click",
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "subHoldCode",
                                  "data": "#storageHoldCode"
                                }
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "subHoldCode",
                                  "data": "#holdDialogData.storageHoldSubCodeValue"
                                }
                              }
                            ]
                          }
                        }
                      },
                      {
                        "type": "microservice",
                        "config": {
                          "microserviceId": "validateBin",
                          "requestMethod": "get",
                          "params": {
                            "locationId": "#repairUnitInfo.LOCATION_ID",
                            "wareHouseId": "#repairUnitInfo.WAREHOUSE_ID",
                            "binName": "#holdDialogData.storageBin",
                            "userName": "#loginUUID.username"
                          },
                          "toBeStringified": true,
                          "isLocal": false,
                          "LocalService": "assets/Responses/mockHoldSubCode.json"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "microservice",
                                "config": {
                                  "microserviceId": "addInfoCodes",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/performFA.json",
                                  "requestMethod": "post",
                                  "body": {
                                    "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                    "notes": "#holdDialogData.holdAddNote",
                                    "workCenter": "#discrepancyUnitInfo.WORKCENTER",
                                    "geography": "#discrepancyUnitInfo.GEONAME",
                                    "part": "#discrepancyUnitInfo.PART_NO",
                                    "woTimeLoggedInHours": "1",
                                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                                    "password": "#loginUUID.password",
                                    "flexFields": [
                                      {
                                        "name": "msgRead",
                                        "value": "#submitablemsgRead"
                                      },
                                      {
                                        "name": "Beep Code",
                                        "value": "#submittablebeepCode"
                                      },
                                      {
                                        "name": "Test_Step",
                                        "value": "#submitabletestStep"
                                      },
                                      {
                                        "name": "EPSA Code",
                                        "value": "#submitableEspaCode"
                                      },
                                      {
                                        "name": "PCDR Code",
                                        "value": "#submitablepcDr"
                                      },
                                      {
                                        "name": "HDD1",
                                        "value": "#submitablehdd1ppid"
                                      },
                                      {
                                        "name": "HDD2",
                                        "value": "#submitablehdd2ppid"
                                      },
                                      {
                                        "name": "HDD3",
                                        "value": "#submitablehdd3ppid"
                                      },
                                      {
                                        "name": "HDD4",
                                        "value": "#submitablehdd4ppid"
                                      },
                                      {
                                        "name": "RAM",
                                        "value": "#recordRamSelectedDropDown"
                                      },
                                      {
                                        "name": "Fail Code",
                                        "value": "#TestFailCodeValue"
                                      }
                                    ]
                                  },
                                  "toBeStringified": true,
                                  "spliceIfEmptyValueObject": [
                                    {
                                      "identifier": "flexFields",
                                      "valueField": "value",
                                      "keyToBeRemoved": "flexFields"
                                    }
                                  ]
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "addInfoRespData",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "moveinventory",
                                          "requestMethod": "post",
                                          "body": {
                                            "apiUsageClientName": "#discrepancyUnitInfo.CLIENTNAME",
                                            "apiUsageLocationName": "#discrepancyUnitInfo.GEONAME",
                                            "callSource": "FrontEnd",
                                            "ip": "::1",
                                            "items": {
                                              "addtionalDetails": {
                                                "comments": "#holdDialogData.holdAddNote",
                                                "storageHoldCode": "#holdDialogData.dellDebugHoldType",
                                                "storageHoldSubCode": "#subHoldCode"
                                              },
                                              "destinationLocation": {
                                                "bin": "#locationDependentFFIDDetails.moveInventoryBin",
                                                "geography": "#discrepancyUnitInfo.GEONAME",
                                                "stockingLocation": "#destStkLocationName",
                                                "warehouse": "#discrepancyUnitInfo.WAREHOUSE_NAME"
                                              },
                                              "item": [
                                                {
                                                  "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                                  "owner": "#discrepancyUnitInfo.CLIENTNAME",
                                                  "partNo": "#discrepancyUnitInfo.PART_NO",
                                                  "serialNo": "#discrepancyUnitInfo.SERIAL_NO"
                                                }
                                              ],
                                              "notes": "#holdDialogData.holdAddNote"
                                            },
                                            "usrPwd": {
                                              "userName": "#loginUUID.username",
                                              "password": "#loginUUID.password"
                                            }
                                          },
                                          "toBeStringified": true
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "renderTemplate",
                                                "config": {
                                                  "templateId": "dashboard.json",
                                                  "mode": "local"
                                                }
                                              },
                                              {
                                                "type": "pauseScreenData"
                                              },
                                              {
                                                "type": "context",
                                                "config": {
                                                  "key": "dellDebugholdDialogData",
                                                  "data": "formData",
                                                  "requestMethod": "add"
                                                }
                                              },
                                              {
                                                "type": "clearScreenData",
                                                "eventSource": "click"
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
                                        },
                                        "eventSource": "click"
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
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "closeAllDialogs"
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "moveinventoryForDiscrepancy",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "holdBinErrorUUID",
                                  "properties": {
                                    "titleValue": "#moveinventoryForDiscrepancy",
                                    "isShown": true
                                  }
                                }
                              }
                            ]
                          }
                        },
                        "eventSource": "click"
                      }
                    ]
                  },
                  "onFailure": {}
                }
              }
            ]
          }
        ]
      },
      "eventSource": "click"
    }];

    this.executeActions(holdActions, instance, actionService)
  }

  /**
 * This will be called initially when the page is fully loaded
 * will return all the actioncodes for all the four processes
 * 
 */
  getAllActionCodes(action, instance, actionService) {
    let actionCodes = [];
    let processTypes = [
      "replace",
      "software",
      "reseat",
      "other"
    ];
    this.resetData(action, instance, actionService);

    actionCodes = [
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "getRequisitionNotes",
          "data": "responseData"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "getDekkDebugReqStatus",
          "data": "responseData"
        }
      },
      {
        "type": "handleDellDebugActions",
        "methodType": "handleReqNotes",
        "config": {
          "data": "getRequisitionNotes"
        }
      }
    ];

    processTypes.forEach((item, index) => {
      let camelCaseProcessType = item.substring(0, 1).toUpperCase() + item.substring(1);
      actionCodes.push({
        "type": "microservice",
        "config": {
          "microserviceId": "getDellDebugActionCode",
          "requestMethod": "get",
          "isLocal": false,
          "LocalService": "assets/Responses/dellReplaceActionCodes.json",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "orderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
            "workcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
            "actionTypes": camelCaseProcessType,
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
                  "key": "getDellDebug" + item + "ActionCodes",
                  "data": "responseData"
                }
              },
              {
                "type": "handleDellDebugActions",
                "methodType": "createLooperControlPanels",
                "config": {
                  "processType": item
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
      });
    });

    let getReqByBcn = {
      "type": "microservice",
      "config": {
        "microserviceId": "getCurrPrevRODetailsBySN",
        "requestMethod": "get",
        "params": {
          "serialNo": "#repairUnitInfo.SERIAL_NO",
          "locationId": "#userSelectedLocation",
          "clientId": "#userSelectedClient",
          "contractId": "#userSelectedContract",
          "userName": "#loginUUID.username"
        }
      },
      "hookType": "afterInit",
      "responseDependents": {
        "onSuccess": {
          "actions": actionCodes
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

    actionService.handleAction(getReqByBcn, instance);
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * This is a looper control method.
   * It generates the replace, software, reseat, other tasks which are 
   * existing while entering into debug screen
   */
  private _createLooperControlPanels(action: any, instance: any, actionService: any) {
    let newHPFAHistory = this.contextService.getDataByString("#newHPFAHistory");
    let existingHPFAHistory = this.contextService.getDataByString("#getDellDebugHPFAHistory");
    let looperControlData = existingHPFAHistory;
    let actionCodes = this.contextService.getDataByKey("getDellDebug" + action.config.processType + "ActionCodes");
    let itemsAdded = [];
    this.currentitem = 0;
    this.itemCount = 0;

    this.resetData(action, instance, actionService);

    let processType = action.config.processType;;
    if (looperControlData && looperControlData !== undefined && looperControlData.length > 0) {
      // looperControlData.sort((a, b) => a.actionId.localeCompare(b.actionId));
      looperControlData && looperControlData.forEach((item, index) => {
        actionCodes && actionCodes.forEach((element) => {
          if (element.actonCodesAbbreviation === item.actionCode) {
            itemsAdded.push(item);
          }
        });
      });
    }
    let getStockQty = [];
    let compActions = [];
    itemsAdded && itemsAdded.forEach((item, index) => {
      let taskPanelData = {
        "actionCode": item.actionCode,
        "actionCodeName": item.actionCodeDesc,
        "defect": item.defectCode,
        "defectName": item.defectCodeDesc,
        "qty": "1",
        "part": item.partNo,
        "partDetails": [{
          "partDescription": item.partDesc
        }],
        "repairAction": item.repairAction,
        "repairActionName": item.repairAction,
        "primaryFaultStatus": item.mainIssue2 === "Yes" ? true : false,
        "actionId": item.actionId,
        "mainIssue2": item.mainIssue2
      };

      item["index"] = index;
      item["length"] = itemsAdded.length;

      let svgIcon = processType && processType === "reseat" ? "manual" :
        processType === "other" ? "description_icon" : processType;
      if (processType === "replace") {
        taskPanelData["commodity"] = !!item.commodity ? item.commodity : "";
        let apisToCall = [];
        let getStock = {
          "type": "microservice",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "getDellDebugStockQty",
            "requestMethod": "get",
            "params": {
              "pCompPartNo": taskPanelData.part,
              "pLocationId": "#userSelectedLocation",
              "pClientId": "#userSelectedClient",
              "pContractId": "#userSelectedContract",
              "pWarehouseId": "#discrepancyUnitInfo.WAREHOUSE_ID",
              "pZoneId": "55345",
              "pWorkcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
              "pOrderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
              "pUserName": "#userAccountInfo.PersonalDetails.USERID"
            },
            "isLocal": false,
            "LocalService": "assets/Responses/availableQuantity.json"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
              ]
            },
            "onFailure": {
              "actions": []
            }
          }
        };
        let componentStatus = {
          "type": "microservice",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "getCompByAction",
            "requestMethod": "get",
            "params": {
              "actionId": taskPanelData.actionId,
              "userName": "#userAccountInfo.PersonalDetails.USERID"
            },
            "isLocal": false,
            "LocalService": "assets/Responses/getCompByActionRes.json"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": []
            },
            "onFailure": {
              "actions": []
            }
          }
        };
        apisToCall.push(getStock);
        apisToCall.push(componentStatus);
        this.contextService.addToContext("isReplaceTaskExits", true);
        this.combinelatestApirequest(apisToCall, this.afterCombineLatest, item, actionService, instance);
      } else {
        actionService.handleAction(
          {
            "type": "handleDellDebugActions",
            "methodType": "onClickOfCompleteButton",
            "config": {
              "svgIcon": svgIcon,
              "processType": processType,
              "taskPanelData": taskPanelData,
              "isLooperControlTask": true
            }
          }, instance)
      }
    });

    // if (processType === "replace") {
    // this.combinelatestApirequest(compActions, "compActions");
    // this.combinelatestApirequest(getStockQty, "getStockQty", this.afterCombineLatest, itemsAdded, actionService, instance);
    // }
  }

  /**
   * Tis will clear the data before looper control
   * @param action 
   * @param instance 
   * @param actionService 
   */
  resetData(action: any, instance: any, actionService: any) {
    let actionsBeforeLooper = [
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "occurenceList",
          "data": []
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "defectCodeList",
          "data": []
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "dellDebugReqList",
          "data": []
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "dellDebugLineList",
          "data": []
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "actionIdList",
          "data": []
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "dellDebugReqListLength",
          "data": 0
        }
      },
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
          "key": "isInvalidPart",
          "data": true
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "isPrimaryFaultExists",
          "data": false
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "isReplaceTaskExits",
          "data": false
        }
      }
    ];

    actionsBeforeLooper.forEach((eachAction) => {
      actionService.handleAction(eachAction, instance);
    });
  }

  /**
   * This method will add the item to action id list
   * @param item 
   */
  addItemToActionIdList(item: any) {
    let actionIdList = this.contextService.getDataByKey("actionIdList");
    if (actionIdList === undefined) {
      actionIdList = [];
    }
    actionIdList.push(item.actionId);
    this.contextService.addToContext("actionIdList", actionIdList);
  }

  afterCombineLatest(itemsAdded, actionService, instance) {
    // itemsAdded.forEach((item, index) => {
    let item = itemsAdded;
    let taskPanelData = {
      "actionCode": item.actionCode,
      "actionCodeName": item.actionCodeDesc,
      "defect": item.defectCode,
      "defectName": item.defectCodeDesc,
      "qty": "1",
      "part": item.partNo,
      "partDetails": [{
        "partDescription": item.partDesc
      }],
      "repairAction": item.repairAction,
      "repairActionName": item.repairAction,
      "primaryFaultStatus": item.mainIssue2 === "Yes" ? true : false,
      "actionId": item.actionId,
      "mainIssue2": item.mainIssue2,
      "commodity": !!item.commodity ? item.commodity : ""
    };
    actionService.handleAction({
      "type": "handleDellDebugActions",
      "methodType": "onClickOfCompleteButton",
      "config": {
        "svgIcon": "replace",
        "processType": "replace",
        "taskPanelData": taskPanelData,
        "isLooperControlTask": true,
        "isLastItem": item.itemCount === item.length ? true : false,
        "getDellDebugStockQty": "#getDellDebugStockQty" + item.index,
        "taskStatus": "#getCompByAction" + item.index
      }
    }, instance)
    // })
  }

  /**
   * Calling the sequesnce of apis and saving the response in the sequence
   * @param apiList 
   * @param keyToSave 
   * @param callback 
   * @param data 
   * @param actionService 
   * @param instance 
   */
  combinelatestApirequest(apiList, callback?, data?, actionService?, instance?) {
    let microServiceList: Array<Observable<any>> = [];
    let apiIds = [], componentActionList = [];

    apiList.map(
      (n: any) => {
        const paramsObj = Object.assign({}, n.config.params);
        let bodyObj = this.contextService.getParsedObject(paramsObj, this.utilityService);
        apiIds.push(n.config.microserviceId)
        if (n.config.requestMethod == "get") {
          microServiceList.push(
            this.transactionService.get(n.config.microserviceId, bodyObj, n.config.isLocal)
          );
        } else if (n.config.requestMethod == "post") {
          microServiceList.push(
            this.transactionService.post(n.config.microserviceId, bodyObj)
          );
        } else {
          componentActionList.push(n)
        }
      });

    let count = 0;
    combineLatest(microServiceList).subscribe((response) => {
      response.map((result: any, index) => {
        if (result.status) {
          this.contextService.addToContext(apiIds[count] + data.index, result.data);
          if (count === microServiceList.length - 1) {
            this.itemCount = this.itemCount + 1;
            data.itemCount = this.itemCount;
            callback && callback(data, actionService, instance);
          }
          count = count + 1;
        } else {
          let errorMsg = {
            "type": "updateComponent",
            "hookType": "afterInit",
            "config": {
              "key": "errorTitleUUID",
              "properties": {
                "titleValue": result.message,
                "isShown": true
              }
            }
          };
          count = count + 1;
        }
      })
    });
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * 
   * It will handle the actions of save button in requisition
   * popup
   */
  reqSaveButtonActions(action, instance, actionService) {
    let saveButtonActions = [];
    let config = {
      "microserviceId": "createReqOrder",
      "isLocal": false,
      "requestMethod": "post",
      "body": {
        "apiUsageClientName": "#repairUnitInfo.CLIENTNAME",
        "callSource": "FrontEnd",
        "clientRefNo1": "#getCurrPrevRODetailsBySN.clientReferenceNo1",
        "clientRefNo2": "#repairUnitInfo.SERIAL_NO",
        "orderStatus": "Released",
        "lines": "#dellDebugLineList",
        "templateName": "#locationDependentFFIDDetails.templateId",
        "usrPw": {
          "username": "#loginUUID.username",
          "password": "#loginUUID.password"
        }
      },
      "toBeStringified": true
    };
    let reqNotes = this.contextService.getDataByKey("dellDebugreplaceReqNotes");
    if (reqNotes !== undefined && reqNotes !== "" && reqNotes !== null) {
      config.body["notes"] = reqNotes;
    }
    let createreqOrderApi = [
      {
        "type": "condition",
        "eventSource": "click",
        "config": {
          "operation": "isValid",
          "lhs": "#dellDebugReqListLength"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "config": config,
                "responseDependents": {
                  "onSuccess": {
                    "actions":
                      [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "createReqOrder",
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "microservice",
                          "eventSource": "click",
                          "config": {
                            "microserviceId": "performTimeOut",
                            "requestMethod": "post",
                            "body": {
                              "timeOutRequest": {
                                "location": "#repairUnitInfo.GEONAME",
                                "bcn": "#repairUnitInfo.ITEM_BCN",
                                "workCenter": "#repairUnitInfo.WORKCENTER",
                                "password": "#loginUUID.password",
                                "notes": "#timeoutNotes.addNote",
                                "resultCode": "#selectedResultcode",
                                "workCenterFlexFieldList": {
                                  "flexField": [
                                    {
                                      "name": "Beep Code",
                                      "value": "#submittablebeepCode"
                                    },
                                    {
                                      "name": "Test_Step",
                                      "value": "#submitabletestStep"
                                    },
                                    {
                                      "name": "EPSA Code",
                                      "value": "#submitableEspaCode"
                                    },
                                    {
                                      "name": "PCDR Code",
                                      "value": "#submitablepcDr"
                                    },
                                    {
                                      "name": "HDD1",
                                      "value": "#submitablehdd1ppid"
                                    },
                                    {
                                      "name": "HDD2",
                                      "value": "#submitablehdd2ppid"
                                    },
                                    {
                                      "name": "HDD3",
                                      "value": "#submitablehdd3ppid"
                                    },
                                    {
                                      "name": "HDD4",
                                      "value": "#submitablehdd4ppid"
                                    },
                                    {
                                      "name": "RAM",
                                      "value": "#recordRamSelectedDropDown"
                                    },
                                    {
                                      "name": "Fail Code",
                                      "value": "#TestFailCodeValue"
                                    }
                                  ]
                                }
                              },
                              "timeOutType": "ProcessImmediate",
                              "clientName": "#repairUnitInfo.CLIENTNAME",
                              "contractName": "#repairUnitInfo.CONTRACTNAME",
                              "userName": "#loginUUID.username",
                              "userPass": "#loginUUID.password",
                              "ip": "::1",
                              "callSource": "FrontEnd",
                              "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                              "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
                            },
                            "toBeStringified": true,
                            "spliceIfEmptyValueObject": [
                              {
                                "identifier": "flexField",
                                "valueField": "value",
                                "keyToBeRemoved": "workCenterFlexFieldList"
                              }
                            ]
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "condition",
                                  "eventSource": "click",
                                  "config": {
                                    "operation": "isEqualTo",
                                    "lhs": "1",
                                    "rhs": "1"
                                  },
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": this.saveReqActions(true)
                                    },
                                    "onFailure": {
                                      "actions": []
                                    }
                                  }
                                },
                                {
                                  "type": "context",
                                  "config": {
                                    "requestMethod": "add",
                                    "key": "newHPFAHistory",
                                    "data": []
                                  }
                                },
                                {
                                  "type": "clearScreenData"
                                },
                                {
                                  "type": "renderTemplate",
                                  "config": {
                                    "templateId": "dashboard.json",
                                    "mode": "local"
                                  }
                                }
                              ]
                            },
                            "onFailure": {
                              "actions": [
                                {
                                  "type": "context",
                                  "config": {
                                    "requestMethod": "add",
                                    "key": "performTimeoutData",
                                    "data": "responseData"
                                  }
                                },
                                {
                                  "type": "updateComponent",
                                  "config": {
                                    "key": "errorTitleUUID",
                                    "properties": {
                                      "titleValue": "#performTimeoutData",
                                      "isShown": true
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
                },
                "eventSource": "click"
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "microservice",
                "eventSource": "click",
                "config": {
                  "microserviceId": "performTimeOut",
                  "requestMethod": "post",
                  "body": {
                    "timeOutRequest": {
                      "location": "#repairUnitInfo.GEONAME",
                      "bcn": "#repairUnitInfo.ITEM_BCN",
                      "workCenter": "#repairUnitInfo.WORKCENTER",
                      "password": "#loginUUID.password",
                      "notes": "#timeoutNotes.addNote",
                      "resultCode": "#selectedResultcode",
                      "workCenterFlexFieldList": {
                        "flexField": [
                          {
                            "name": "Beep Code",
                            "value": "#submittablebeepCode"
                          },
                          {
                            "name": "Test_Step",
                            "value": "#submitabletestStep"
                          },
                          {
                            "name": "EPSA Code",
                            "value": "#submitableEspaCode"
                          },
                          {
                            "name": "PCDR Code",
                            "value": "#submitablepcDr"
                          },
                          {
                            "name": "HDD1",
                            "value": "#submitablehdd1ppid"
                          },
                          {
                            "name": "HDD2",
                            "value": "#submitablehdd2ppid"
                          },
                          {
                            "name": "HDD3",
                            "value": "#submitablehdd3ppid"
                          },
                          {
                            "name": "HDD4",
                            "value": "#submitablehdd4ppid"
                          },
                          {
                            "name": "RAM",
                            "value": "#recordRamSelectedDropDown"
                          },
                          {
                            "name": "Fail Code",
                            "value": "#TestFailCodeValue"
                          }
                        ]
                      }
                    },
                    "timeOutType": "ProcessImmediate",
                    "clientName": "#repairUnitInfo.CLIENTNAME",
                    "contractName": "#repairUnitInfo.CONTRACTNAME",
                    "userName": "#loginUUID.username",
                    "userPass": "#loginUUID.password",
                    "ip": "::1",
                    "callSource": "FrontEnd",
                    "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                    "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
                  },
                  "toBeStringified": true,
                  "spliceIfEmptyValueObject": [
                    {
                      "identifier": "flexField",
                      "valueField": "value",
                      "keyToBeRemoved": "workCenterFlexFieldList"
                    }
                  ]
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "clearScreenData"
                      },
                      {
                        "type": "renderTemplate",
                        "config": {
                          "templateId": "dashboard.json",
                          "mode": "local"
                        }
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "performTimeoutData",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "#performTimeoutData",
                            "isShown": true
                          }
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
    ];
    // saveButtonActions = [
    //   {
    //     "type": "updateComponent",
    //     "eventSource": "click",
    //     "config": {
    //       "key": "errorTitleUUID",
    //       "properties": {
    //         "titleValue": "",
    //         "isShown": false
    //       }
    //     }
    //   },
    //   {
    //     "type": "microservice",
    //     "eventSource": "click",
    //     "config": {
    //       "microserviceId": "getRequisitionByBCN",
    //       "requestMethod": "get",
    //       "params": {
    //         "bcn": "#getCurrPrevRODetailsBySN.clientReferenceNo1",
    //         "userName": "#userAccountInfo.PersonalDetails.USERID"
    //       }
    //     },
    //     "responseDependents": {
    //       "onSuccess": {
    //         "actions": [
    //           {
    //             "type": "condition",
    //             "eventSource": "click",
    //             "config": {
    //               "operation": "isValid",
    //               "lhs": "#getRequisitionByBCN.requisitionId"
    //             },
    //             "responseDependents": {
    //               "onSuccess": {
    //                 "actions": [
    //                   {
    //                     "type": "microservice",
    //                     "config": {
    //                       "microserviceId": "cancelReqOrder",
    //                       "requestMethod": "post",
    //                       "body": {
    //                         "reqOrderId": "#getRequisitionByBCN.requisitionId",
    //                         "canceledBy": "#userAccountInfo.PersonalDetails.USERID",
    //                         "notes": "Cancel Requisition Order"
    //                       },
    //                       "toBeStringified": true
    //                     },
    //                     "responseDependents": {
    //                       "onSuccess": {
    //                         "actions": [
    //                           {
    //                             "type": "microservice",
    //                             "config": {
    //                               "microserviceId": "dellDebugUpdateOutBoundOrder",
    //                               "requestMethod": "post",
    //                               "body": {
    //                                 "apiUsageClientName": "#repairUnitInfo.CLIENTNAME",
    //                                 "apiUsageLocationName": "#discrepancyUnitInfo.GEONAME",
    //                                 "callSource": "FrontEnd",
    //                                 "ip": "::1",
    //                                 "outboundOrderRequest": {
    //                                   "outboundOrderData": {
    //                                     "id": "#getRequisitionByBCN.requisitionId",
    //                                     "orderStatus": "Cancelled"
    //                                   }
    //                                 },
    //                                 "userName": "#userAccountInfo.PersonalDetails.USERID",
    //                                 "password": "#loginUUID.password"
    //                               },
    //                               "toBeStringified": true
    //                             },
    //                             "responseDependents": {
    //                               "onSuccess": {
    //                                 "actions": createreqOrderApi
    //                               },
    //                               "onFailure": {
    //                                 "actions": [
    //                                   {
    //                                     "type": "handleCommonServices",
    //                                     "config": {
    //                                       "type": "errorRenderTemplate",
    //                                       "contextKey": "errorMsg",
    //                                       "updateKey": "errorTitleUUID"
    //                                     }
    //                                   }
    //                                 ]
    //                               }
    //                             }
    //                           }
    //                         ]
    //                       },
    //                       "onFailure": {
    //                         "actions": [
    //                           {
    //                             "type": "handleCommonServices",
    //                             "config": {
    //                               "type": "errorRenderTemplate",
    //                               "contextKey": "errorMsg",
    //                               "updateKey": "errorTitleUUID"
    //                             }
    //                           }
    //                         ]
    //                       }
    //                     }
    //                   }
    //                 ]
    //               },
    //               "onFailure": {
    //                 "actions": createreqOrderApi
    //               }
    //             }
    //           }
    //         ]
    //       },
    //       "onFailure": {
    //         "actions": [
    //           {
    //             "type": "context",
    //             "config": {
    //               "requestMethod": "add",
    //               "key": "errorResp",
    //               "data": "responseData"
    //             }
    //           },
    //           {
    //             "type": "updateComponent",
    //             "config": {
    //               "key": "errorTitleUUID",
    //               "properties": {
    //                 "titleValue": "#errorResp",
    //                 "isShown": true
    //               }
    //             }
    //           }
    //         ]
    //       }
    //     }
    //   }
    // ];
    this.executeActions(createreqOrderApi, instance, actionService);
  }

  /**
   * 
   * @returns returns the actions that are to be performed when the req is saved
   */
  saveReqActions(isreqSaveButton) {
    let actions = [];
    actions = [
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "dellDebugReqListStatus",
          "data": "- Saved"
        }
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellDebugReqListButtonUUID",
          "properties": {
            "textValue": "#dellDebugReqListStatus",
            "textValueClass": "saved-green",
            "disabled": false
          }
        }
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellDebugSoftwareIconUUID",
          "properties": {
            "disabled": false
          }
        }
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellDebugReseatIconUUID",
          "properties": {
            "disabled": false
          }
        }
      },
      {
        "type": "updateComponent",
        "config": {
          "key": "dellDebugOtherIconUUID",
          "properties": {
            "disabled": false
          }
        }
      }
    ];

    return actions;
  }

  /***Thismethodiscalledwhenwedeleteanitemfromreq*listpopup.*@paramaction*@paraminstance*@paramactionService*/
  deleteItemFromReqPopUp(action, instance, actionService) {
    let actions = [];
    actions = [
      {
        "type": "handleDellDebugActions",
        "methodType": "removeValueFromTable",
        "config": {
          "arrayData": "#dellDebugTableData",
          "PullValue": "currentTaskPanelData",
          "key": "parentUUID",
          "property": "flexFields",
          "keyToFind": "dellDebugReqList",
          "tableUUID": "dellDebugReqListTableUUID",
          "lineList": "dellDebugLineList"
        }
      },
      {
        "type": "getFilteredFromContext",
        "config": {
          "target": "#occurenceList",
          "key": "currentOccurenceData",
          "properties": {
            "key": "parentUUID"
          }
        }
      }
    ];

    ///ThisisforcancelFAcode
    actions.push({
      "type": "microservice",
      "eventSource": "click",
      "config": {
        "microserviceId": "cancelFA",
        "requestMethod": "post",
        "isLocal": false,
        "LocalService": "assets/Responses/performFA.json",
        "body": {
          "updateFailureAnalysisRequest": {
            "bcn": "#repairUnitInfo.ITEM_BCN",
            "defectCodeChangeList": {
              "defectCodeChange": [
                {
                  "defectCode": "#currentTaskPanelData.defect",
                  "operation": "Delete",
                  "occurrence": "#currentOccurenceData.defectCodeOccurence"
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
        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "deleteComponent",
              "eventSource": "click",
              "config": {
                "key": instance.parentuuid
              }
            },
            {
              "type": "deleteAndUpdateOccurence",
              "config": {
                "target": "#occurenceList",
                "key": instance.parentuuid,
                "currentTaskData": "#currentOccurenceData"
              },
              "eventSource": "click"
            },
            {
              "type": "handleDellDebugActions",
              "methodType": "updateHPFAHistory",
              "config": {
                "actionId": "#currentTaskPanelData.actionId"
              }
            },
            {
              "type": "handleDellDebugActions",
              "methodType": "removeValueFromTable",
              "config": {
                "arrayData": "#dellDebugTableData",
                "PullValue": "currentTaskPanelData",
                "key": "parentUUID",
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
                "lhs": "#currentTaskPanelData.primaryFaultStatus",
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
    })
    this.executeActions(actions, instance, actionService);
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * Returns the unique record selected in defect codes list
   */
  updateDefectBasedOnUnqNumber(action, instance, actionService) {
    let defects = this.contextService.getDataByString(action.config.defects);
    let unqNumber = this.contextService.getDataByString(action.config.selectedUnqNumber);
    defects.forEach((element) => {
      if (element.unqNumber.toString() === unqNumber) {
        this.contextService.addToContext("dellDebug" + action.config.processType + "Defect", element.defectCode);
      }
    });
  }

  /**
   * 
   * @param action 
   * @param instance 
   * @param actionService 
   * Checks whether the entered part is valid or not and
   * Performs theactions according to that
   */
  checkforValidPart(action, instance, actionService) {
    let formStatus = instance.group.status;
    let isFormValid = false
    isFormValid = formStatus === "INVALID" ? false : true;
    let actions = {
      "type": "multipleCondition",
      "config": {
        "multi": true,
        "operator": "AND",
        "conditions": [
          {
            "operation": "isValid",
            "lhs": "#dellDebugreplacePart"
          },
          {
            "operation": "isEqualTo",
            "lhs": true,
            "rhs": isFormValid
          }
        ]
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "condition",
              "eventSource": "change",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#isInvalidPart",
                "rhs": true
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "CompleteButtonUUID",
                        "properties": {
                          "disabled": true
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
                        "key": "CompleteButtonUUID",
                        "properties": {
                          "disabled": false
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
          "actions": [
          ]
        }
      }
    };
    actionService.handleAction(actions, instance);
  }

  executeActions(actions, instance, actionService) {
    actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  /**
   * this will check whether there are any main issue type tasks and 
   * updates the check box value accordingly.
   * @param action 
   * @param instance 
   * @param actionService 
   */
  checkForMainIssue(action, instance, actionService) {
    let data = this.contextService.getDataByString(action.config.data);
    let primaryFault = false;
    if (data && data.length > 0) {
      data.forEach((element) => {
        if (element.mainIssue2 !== undefined && element.mainIssue2 === "Yes") {
          primaryFault = true;
        }
      });
    }

    if (primaryFault) {
      actionService.handleAction({
        "type": "updateComponent",
        "config": {
          "key": "dellDebugPrimaryFaultUUID",
          "properties": {
            "disabled": true,
            "checked": false
          }
        }
      });
    } else {
      actionService.handleAction({
        "type": "updateComponent",
        "config": {
          "key": "dellDebugPrimaryFaultUUID",
          "properties": {
            "disabled": false
          }
        }
      });
    }
  }

  /**
   * functionalities that are to be performed on req notes
   * @param action 
   * @param instance 
   * @param actionService 
   */
  checkStateOfReqNotes(action: any, instance: any, actionService: any) {
    let reqNotes = this.contextService.getDataByKey("dellDebugreplaceReqNotes");
    let reqNotesRef = this.contextService.getDataByKey("dellDebugReqNotesUUIDref");
    let userSelectedLocation = this.contextService.getDataByKey("userSelectedLocation");
    let reqListLength = this.contextService.getDataByKey("dellDebugReqListLength");
    let isReplaceTaskExits = this.contextService.getDataByKey("isReplaceTaskExits");
    // if (reqNotes != undefined && reqNotes !== "") {
    if (reqNotesRef != undefined && reqNotesRef !== "") {
      if (reqNotes != undefined && reqNotes !== "" && reqListLength > 0) {
        reqNotesRef.instance.group.controls[reqNotesRef.instance.name].setValue(reqNotes);
      } else {
        reqNotesRef.instance.group.controls[reqNotesRef.instance.name].setValue(null);
        this.contextService.addToContext("dellDebugreplaceReqNotesEntered", "");
        this.contextService.addToContext("dellDebugreplaceReqNotes", "");
      }
      if (isReplaceTaskExits !== undefined && isReplaceTaskExits && reqListLength > 0) {
        reqNotesRef.instance.group.controls[reqNotesRef.instance.name].disable();
      } else {
        if (action.config.isReset !== undefined && action.config.isReset) {
          reqNotesRef.instance.group.controls[reqNotesRef.instance.name].setValue(null);
          this.contextService.addToContext("dellDebugreplaceReqNotesEntered", "");
          this.contextService.addToContext("dellDebugreplaceReqNotes", "");
        }
        reqNotesRef.instance.group.controls[reqNotesRef.instance.name].enable();
      }
    }
    // } 

    if (reqNotesRef != undefined && reqNotesRef !== "") {
      reqNotesRef.instance._changeDetectionRef.detectChanges();
    }
  }

  checkForNewlyAddedItem(action, instance, actionService) {
    let currentAction = action;
    action = action.config.action;
    let getDellDebugHPFAHistory = this.contextService.getDataByKey(currentAction.config.data);
    let newlyCreatedItemActionId = "";
    let newHPFAHistory = this.contextService.getDataByKey("newHPFAHistory");
    let actionIdList = this.contextService.getDataByKey("actionIdList");
    if (newHPFAHistory === undefined) {
      newHPFAHistory = [];
    }
    if (actionIdList === undefined) {
      actionIdList = [];
    }
    let isNewItemExists = false;
    let newItem;
    if (getDellDebugHPFAHistory && getDellDebugHPFAHistory.length > 0) {
      getDellDebugHPFAHistory.forEach((item) => {
        let isNewItem = false;
        if (!actionIdList.includes(item.actionId)) {
          isNewItem = true;
        }
        if (isNewItem) {
          isNewItemExists = true;
          newItem = item;
        }
      });
    }
    if (isNewItemExists) {
      newHPFAHistory.push(newItem);
      this.addItemToActionIdList(newItem);
      newlyCreatedItemActionId = newItem.actionId;
    }
    this.contextService.addToContext("newHPFAHistory", newHPFAHistory);
    action.config.taskPanelData["actionId"] = newlyCreatedItemActionId;
    actionService.handleAction({
      "type": "handleDellDebugActions",
      "methodType": "onClickOfCompleteButton",
      "config": {
        "action": action,
        "isLooperControlTask": false
      }
    }, instance)
  }

  /**
   * This method will update the hpfa history
   * @param action 
   * @param instance 
   * @param actionService 
   */
  updateHPFAHistory(action, instance, actionService) {
    let actionId = action.config.actionId;
    if (actionId.startsWith('#')) {
      actionId = this.contextService.getDataByString(actionId);
    }
    let newHPFAHistory = this.contextService.getDataByKey("newHPFAHistory");
    if (newHPFAHistory) {
      if (newHPFAHistory.length > 0) {
        for (let i = newHPFAHistory.length - 1; i >= 0; i--) {
          let item = newHPFAHistory[i];
          if (item.actionId === actionId) {
            newHPFAHistory.splice(i, 1);
          }
        }
      }
    }
    this.contextService.addToContext("newHPFAHistory", newHPFAHistory);
    actionService.handleAction({
      "type": "microservice",
      "config": {
        "microserviceId": "getDellDebugHPFAHistory",
        "requestMethod": "get",
        "params": {
          "itemId": "#discrepancyUnitInfo.ITEM_ID",
          "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
          "userName": "#userAccountInfo.PersonalDetails.USERID"
        },
        "toBeStringified": true,
        "isLocal": false,
        "LocalService": "assets/Responses/mockHoldSubCode.json"
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "handleDellDebugActions",
              "methodType": "checkForReplaceTask"
            },
            {
              "type": "handleDellDebugActions",
              "methodType": "checkStateOfReqNotes",
              "config": {
                "processType": "replace"
              },
              "eventSource": "clcik"
            }
          ]
        },
        "onFailure": {
          "actions": []
        }
      }
    }, instance);
  }

  /**
   * Function to check if we have any replace task
   */
  checkForReplaceTask(instance, actionService) {
    let actions = [];
    let replaceActionCodes = this.contextService.getDataByKey("getDellDebugreplaceActionCodes");
    let getDellDebugHPFAHistory = this.contextService.getDataByKey("getDellDebugHPFAHistory");
    let isAllReqCompleted = this.contextService.getDataByKey("isAllReqCompleted");
    let wc = this.contextService.getDataByKey("currentWC");
    if (DELL_DEBUG_WC_NAMES.includes(wc)) {
      actions = [
        {
          "type": "enableComponent",
          "config": {
            "key": "dellDebugResultCodesUUID",
            "property": "ResultCodes"
          }
        },
        {
          "type": "condition",
          "config": {
            "operation": "isValid",
            "lhs": "#selectedResultcode"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "dellDebugTimeOutUUID",
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
                    "key": "dellDebugTimeOutUUID",
                    "properties": {
                      "disabled": true
                    }
                  }
                }
              ]
            }
          }
        }
      ];
      if (getDellDebugHPFAHistory && getDellDebugHPFAHistory.length > 0) {
        let isReplaceTaskExits = false;
        let flag = false;
        getDellDebugHPFAHistory.forEach((item) => {
          if (replaceActionCodes && replaceActionCodes.length > 0) {
            replaceActionCodes.forEach((actionCode) => {
              if (item.actionCode === actionCode.actonCodesAbbreviation) {
                isReplaceTaskExits = true;
              }
            })
          }
        })

        /// Checking if all the requisitions are completed and a replace task exists or not
        /// Else if any one requisition is not completed, then making the flag to true
        if (isReplaceTaskExits) {
          let reqListLength = this.contextService.getDataByKey("dellDebugReqListLength");
          if (reqListLength && reqListLength > 0) {
            flag = true;
          }
        }
        if (flag) {
          let resultCodesForDiscrepancy = this.contextService.getDataByKey("resultCodesForDiscrepancy");
          let defaultResultCode = this.contextService.getDataByString("#getProcessWCData.dellDebugDefaultReplaceResultCode");
          if (resultCodesForDiscrepancy && resultCodesForDiscrepancy.length > 0) {
            resultCodesForDiscrepancy.forEach((resultCodeObj) => {
              if (resultCodeObj.resultCode === defaultResultCode) {
                actions = [
                  {
                    "type": "setDefaultValue",
                    "config": {
                      "key": "dellDebugResultCodesUUID",
                      "defaultValue": defaultResultCode
                    }
                  },
                  {
                    "type": "context",
                    "hookType": "afterInit",
                    "config": {
                      "requestMethod": "add",
                      "key": "selectedResultcode",
                      "data": defaultResultCode
                    }
                  },
                  {
                    "type": "disableComponent",
                    "config": {
                      "key": "dellDebugResultCodesUUID",
                      "property": "ResultCodes",
                      "isNotReset": true
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dellDebugTimeOutUUID",
                      "properties": {
                        "disabled": false
                      }
                    }
                  }
                ];
              }
            });
          }
        }
        this.executeActions(actions, instance, actionService);
        this.contextService.addToContext("isReplaceTaskExits", isReplaceTaskExits);
      } else {
        this.executeActions(actions, instance, actionService);
        this.contextService.addToContext("isReplaceTaskExits", false);
      }
    }

  }

  /**
   * This method will handle notes and sort the data based on req ID
   * @param action
   */
  handleReqNotes(action) {
    let data = this.contextService.getDataByKey(action.config.data);
    if (data && data.length > 0) {
      data.sort((a, b) => a.requisitionId.localeCompare(b.requisitionId));
      let reqNotes = data[data.length - 1].note;
      if (reqNotes && reqNotes !== undefined && reqNotes !== null) {
        this.contextService.addToContext("dellDebugreplaceReqNotes", reqNotes);
      }
    }

    /// For checking req 
    this.checkIfAllTheReqCompleted();
  }

  /// Checking whether all the requisitions are completed or not
  checkIfAllTheReqCompleted() {
    let reqStatus = this.contextService.getDataByKey("getDekkDebugReqStatus");
    let isAllReqCompleted = true;
    /// For checking req 
    if (reqStatus && reqStatus.length > 0) {
      reqStatus.forEach((element) => {
        if (element.orderStatusName !== "Complete") {
          isAllReqCompleted = false;
        }
      })
    }

    this.contextService.addToContext("isAllReqCompleted", isAllReqCompleted);
  }

  handle2ndVisit(action: any, instance: any, actionService: any) {
    let previousWCHistory = this.contextService.getDataByKey("getPreviousHistory");
    let unitInfo = this.contextService.getDataByKey("discrepancyUnitInfo");
    let currentWCName = unitInfo.WORKCENTER;
    // let menuItems = this.contextService.getDataByKey("menuItems");
    // let currentWC = this.contextService.getDataByKey("currentWC");
    let currentWCCount = previousWCHistory && previousWCHistory.filter(element => element == currentWCName);
    if (previousWCHistory && previousWCHistory.length > 0) {
      if (currentWCCount && currentWCCount.length > 0) {
        this.contextService.addToContext("is2ndVisit", true)
      } else {
        this.contextService.addToContext("is2ndVisit", false)
      }
    } else {
      this.contextService.addToContext("is2ndVisit", false)
    }


    //let menuItems;
    //if (saveAndExitData && saveAndExitData != null && saveAndExitData != undefined) {
      // saveAndExitData && saveAndExitData.find(function (element) {
      //   Object.keys(element).forEach((key) => {
      //     if (key === "menuItems") {
      //       return menuItems = element[key];
      //     }
      //   })
      // });
      //console.log(menuItems);
      
      //let wc = menuItems && menuItems.filter(({ name }) => name == currentWC);
      //console.log(wc);
      // if (wc && wc.length > 0) {
      //   for (let i = 0; i < wc.length; i++) {
      //     if (wc[i].isTimedOut && wc[i].name == currentWC) {
      //       this.contextService.addToContext("is2ndVisit", true)
      //     } else {
      //       this.contextService.addToContext("is2ndVisit", false)
      //     }
      //   }
      // } else {
      //   this.contextService.addToContext("is2ndVisit", false)
      // }
    //} else {
      //this.contextService.addToContext("is2ndVisit", false)
    //}
  }
}
