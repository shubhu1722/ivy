import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { TransactionService } from '../../commonServices/transaction/transaction.service';
import { UtilityService } from '../../../utilities/utility.service';
import { cloneDeep } from 'lodash';
// import { DELL_DEBUG_WC_NAMES } from '../../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class DellCarDebugService {

  constructor(private contextService: ContextService,
    private utilityService: UtilityService,
    private transactionService: TransactionService) {

  }


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
      case 'getAllActionCodes':
        this.getAllActionCodes(action, instance, actionService)
        break;
      case 'createLooperControlPanels':
        this._createLooperControlPanels(action, instance, actionService)
        break;
      case 'transactionsOnClickOfComplete':
        this._transactionsOnClickOfComplete(action, instance, actionService)
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
      case 'checkStateOfReqNotes':
        this.checkStateOfReqNotes(action, instance, actionService)
        break;
      case 'checkForNewlyAddedItem':
        this.checkForNewlyAddedItem(action, instance, actionService)
        break;
      case 'updateHPFAHistory':
        this.updateHPFAHistory(action, instance, actionService)
        break;
      case 'resetData':
        this.resetData(action, instance, actionService)
        break;
      case 'createRplTask':
        this._createRplTask(action, instance, actionService);
        break;
      case 'checkForNewlyAddedRPLItem':
        this.checkForNewlyAddedRPLItem(action, instance, actionService);
        break
      case 'primaryFaultCompleteActions':
        this.primaryFaultCompleteActions(action, instance, actionService);
        break
      case 'TimeOutPrimaryFaultArraydata':
        this.TimeOutPrimaryFaultArraydata(action, instance, actionService);
        break
      case 'triggerDataFormation':
        this.triggerDataFormation(action);
        break
      case 'duplicatePartNumberSelected':
        this.duplicatePartNumberSelected(action, instance, actionService);
        break
      case 'deleteParentElement':
        this.deleteParentElement(action, instance, actionService);
        break
      case 'isReplacePart':
        this.isReplacePart(action, instance, actionService);
        break
      case 'getComputerTestedData':
        this.getComputerTestedData(action, instance, actionService);
        break
      case 'cnlTypeCheck':
        this.cnlTypeCheck();
        break
      case 'cnlNextTriggers':
        this.cnlNextTriggers(actionService);
        break
      case 'dellCarTimeoutAction':
        this.dellCarTimeoutAction(action, instance, actionService);
        break
      case 'dellCarTimeoutNotes':
        this.dellCarTimeoutNotes(action, instance, actionService);
        break
      case 'dellCarAlternetPart':
        this.dellCarAlternetPart(action, instance, actionService);
        break
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
          "key": "dellCarDebugTaskPanelUUID"
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
        "type": "dellCarDebugService",
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
            "uuid": "dellCarDebugTaskPanelUUID",
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
            "panelClass": "top-margin overflow-show",
            "collapsedHeight": "40px",
            "expandedHeight": "40px",
            "bodyclass": "splitView",
            "leftDivclass": "width:50%",
            "rightDivclass": "width:50%",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "hooks": [
              {
                "type": "condition",
                "hookType": "afterInit",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": action.config.processType,
                  "rhs": "replace"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "condition",
                        "config": {
                          "operation": "isValid",
                          "lhs": "#dellDebug" + action.config.processType + "Part"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "dellCarDebugPartUUID",
                                  "isAutoComplete": true,
                                  "dropDownProperties": {
                                    "options": "#getPartsFromDellBoms"
                                  }
                                }
                              },
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "dellCarDebugPartUUID",
                                  "isAutoComplete": true,
                                  "dropDownProperties": {
                                    "options": []
                                  }
                                }
                              }
                            ]
                          }
                        }
                      },
                      {
                        "type": "condition",
                        "hookType": "afterInit",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#dellDebug" + action.config.processType + "commodity",
                          "rhs": "MB"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "setDefaultValue",
                                "config": {
                                  "key": "mbPPIDUUID",
                                  "defaultValue": "#dellCarDebugMbPPID"
                                }
                              },
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
                                    "disabled": true,
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
                  "key": "dellCarDebugTaskPanelUUID"
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
                "type": "dellCarDebugService",
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
                      "key": "dellCarDebugDefectUUID",
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
                      "key": "dellDebug" + action.config.processType + "commodity",
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
                      "key": "dellCarDebugStockQty",
                      "properties": {
                        "text": ""
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "dellCarDebugTableContentUUID",
                      "properties": {
                        "flexClass": "hide"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "dellCarDebugTableContentUUIDHeading",
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
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "mbPPIDUUID",
                      "data": ""
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "mbPPIDUUID",
                      "properties": {
                        "hidden": true,
                        "disabled": true,
                      }
                    }
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
                "checkGroupValidity": true,
                "type": "submit",
                "tooltip": "",
                "hooks": [],
                "validations": [],
                "actions":
                  [
                    {
                      "type": "context",
                      "eventSource": "click",
                      "config": {
                        "requestMethod": "add",
                        "key": "replacePartFormData",
                        "data": "formData"
                      }
                    },
                    {
                      "type": "dellCarDebugService",
                      "methodType": "transactionsOnClickOfComplete",
                      "eventSource": "click",
                      "config": {
                        "action": action
                      }
                    },
                    {
                      "type": "dellCarDebugService",
                      "methodType": "disableOrEnableAllIcons",
                      "eventSource": "click",
                      "config": {
                        "currentProcess": action.config.processType,
                        "isDisable": false
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
      "dellCarDebugReplaceIconUUID",
      "dellCarDebugSoftwareIconUUID",
      "dellCarDebugReseatIconUUID",
      "dellCarDebugOtherIconUUID"
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
        "ctype": "dropdownWithSearch",
        "uuid": "dellCarDebugActionCodeUUID",
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
        "code": "actonCodesAbbreviation",
        "displayValue": "actonCodesAbbreviation",
        "dataSource": "#dellDebugActionCodeRes",
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
          }
        ]
      },
      {
        "ctype": "dropdownWithSearch",
        "uuid": "dellCarDebugDefectCodeGroupUUID",
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
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "dellCarDebugDefectUUID",
              "dropDownProperties": {
                "options": []
              },
              "properties": {
                "isReset": true,
                "name": action.config.processType + "Defect"
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
                              "key": "dellCarDebugDefectUUID",
                              "dropDownProperties": {
                                "options": "#getdellDebug" + action.config.processType + "Defects"
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
                              "key": "dellCarDebugDefectUUID",
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
                      "key": "dellCarDebugDefectUUID",
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
      {
        "ctype": "dropdownWithSearch",
        "uuid": "dellCarDebugDefectUUID",
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
          }
        ]
      }
    ];

    if (action.config.processType === "replace") {
      let userSelectedLocation = this.contextService.getDataByKey("userSelectedLocation");
      let commodityField = {
        "ctype": "dropdownWithSearch",
        "uuid": "dellCarDebugCommodityUUID",
        "name": action.config.processType + "commodity",
        "hooks": this.commodityHooks(action),
        "actions": [
          {
            "type": "setDefaultValue",
            "config": {
              "key": "dellCarDebugPartUUID",
              "defaultValue": ""
            },
            "eventSource": "change"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "commodity",
              "data": "elementControlValue"
            },
            "eventSource": "change"
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "commodity",
              "data": "elementControlName"
            },
            "eventSource": "change"
          },
          {
            "type": "updateComponent",
            "eventSource": "change",
            "config": {
              "key": "dellCarDebugTableContentUUIDHeading",
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
              "key": "dellCarDebugTableContentUUID",
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
              "requestMethod": "get",
              "params": {
                "locationName": "#userSelectedLocationName",
                "serialNumber": "#discrepancyUnitInfo.SERIAL_NO",
                "commodityName": "#dellDebug" + action.config.processType + "commodity",
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
                      "key": "dellCarDebugPartUUID",
                      "isAutoComplete": true,
                      "properties": {
                        "placeholder": "Scan"
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dellCarDebugPartUUID",
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
                    "type": "updateComponent",
                    "config": {
                      "key": "dellCarDebugPartUUID",
                      "isAutoComplete": true,
                      "properties": {
                        "placeholder": "No Parts Found"
                      }
                    }
                  },
                  {
                    "type": "setDefaultValue",
                    "config": {
                      "key": "dellCarDebugPartUUID",
                      "defaultValue": ""
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "dellCarDebugPartUUID",
                      "isAutoComplete": true,
                      "dropDownProperties": {
                        "options": []
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            "type": "condition",
            "eventSource": "change",
            "config": {
              "operation": "isEqualTo",
              "lhs": "#dellDebug" + action.config.processType + "commodity",
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
        "dropdownClass": "dropdown-container textfield-container",
        "labelClass": "subtitle1-align-self greyish-black",
      };
      leftSideItems.push(commodityField);
      let selectedPart = this.contextService.getDataByString("#dellDebug" + action.config.processType + "Part");
      let partField = {
        "ctype": "autoComplete",
        "uuid": "dellCarDebugPartUUID",
        "name": action.config.processType + "Part",
        "hooks": this.returnPartHooks(action),
        "isUpperCase": true,
        "validateGroup": false,
        "isTrimRequired": false,
        "dataSource": "#getPartsFromDellBoms",
        "placeholder": "Scan #",
        "actions": [
          {
            "type": "searchToAddContext",
            "config": [
              {
                "type": "updateComponent",
                "eventSource": "selectionChanged",
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
                "eventSource": "selectionChanged",
                "config": {
                  "key": "dellCarDebugPartUUID",
                  "properties": {
                    "maxLength": ""
                  }
                }
              },
              {
                "requestMethod": "add",
                "key": "dellDebug" + action.config.processType + "Part",
                "event": true
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
                "type": "updateComponent",
                "eventSource": "selectionChanged",
                "config": {
                  "key": "dellCarDebugTableContentUUIDHeading",
                  "properties": {
                    "visibility": true,
                    "flexClass": "label-container-radio-group-parent-heading"
                  }
                }
              },
              {
                "type": "microservice",
                "eventSource": "change",
                "config": {
                  "microserviceId": "getDellCarPartQuantity",
                  "requestMethod": "get",
                  "isLocal": false,
                  "LocalService": "assets/Responses/dellReplaceActionCodes.json",
                  "params": {
                    "partNumber": "#dellDebug" + action.config.processType + "Part",
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                  },
                  "toBeStringified": true
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "condition",
                        "eventSource": "click",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#getDellCarPartQuantity.stockQty",
                          "rhs": null
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "microservice",
                                "config": {
                                  "microserviceId": "getAlternatePartsDellCarDebug",
                                  "requestMethod": "get",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/dellReplaceActionCodes.json",
                                  "params": {
                                    "partNumber": "#dellDebug" + action.config.processType + "Part",
                                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                                  },
                                  "toBeStringified": true
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "dellCarDebugService",
                                        "methodType": "dellCarAlternetPart",
                                        "config": {
                                          "partKey": "dellDebug" + action.config.processType + "Part",
                                          "altPartResp": "#getAlternatePartsDellCarDebug",
                                          "selectedPartQty": "#getDellCarPartQuantity"
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
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "eventSource": "change",
                                "config": {
                                  "key": "dellCarDebugTableContentUUID",
                                  "properties": {
                                    "visibility": true,
                                    "flexClass": "label-container-radio-group-parent"
                                  }
                                }
                              },
                              {
                                "type": "dellCarDebugService",
                                "methodType": "updateStockQty",
                                "config": {
                                  "data": "#getDellCarPartQuantity",
                                  "keyToUpdate": "dellCarDebugStockQty",
                                  "isDisable": false
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
            ],
            "eventSource": "selectionChanged"
          },
          {
            "type": "searchToAddContext",
            "config": [
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
                "type": "updateComponent",
                "eventSource": "input",
                "config": {
                  "key": "dellCarDebugPartUUID",
                  "properties": {
                    "maxLength": "5"
                  }
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "input",
                "config": {
                  "key": "dellCarDebugTableContentUUIDHeading",
                  "properties": {
                    "visibility": true,
                    "flexClass": "label-container-radio-group-parent-heading"
                  }
                }
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "dellDebug" + action.config.processType + "partDescription",
                  "data": ""
                }
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
                      "operation": "isEqualTo",
                      "lhs": "#partLength",
                      "rhs": 5
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
                          "key": "dellCarDebugTableContentUUIDHeading",
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
                          "key": "dellCarDebugTableContentUUID",
                          "properties": {
                            "visibility": true,
                            "flexClass": "label-container-radio-group-parent"
                          }
                        }
                      },
                      {
                        "type": "microservice",
                        "eventSource": "change",
                        "config": {
                          "microserviceId": "getDellCarPartQuantity",
                          "requestMethod": "get",
                          "isLocal": false,
                          "LocalService": "assets/Responses/dellReplaceActionCodes.json",
                          "params": {
                            "partNumber": "#dellDebug" + action.config.processType + "Part",
                            "userName": "#userAccountInfo.PersonalDetails.USERID",
                          },
                          "toBeStringified": true
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "condition",
                                "eventSource": "click",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#getDellCarPartQuantity.stockQty",
                                  "rhs": null
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "getAlternatePartsDellCarDebug",
                                          "requestMethod": "get",
                                          "isLocal": false,
                                          "LocalService": "assets/Responses/dellReplaceActionCodes.json",
                                          "params": {
                                            "partNumber": "#dellDebug" + action.config.processType + "Part",
                                            "userName": "#userAccountInfo.PersonalDetails.USERID",
                                          },
                                          "toBeStringified": true
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "dellCarDebugService",
                                                "methodType": "dellCarAlternetPart",
                                                "config": {
                                                  "partKey": "dellDebug" + action.config.processType + "Part",
                                                  "altPartResp": "#getAlternatePartsDellCarDebug",
                                                  "selectedPartQty": "#getDellCarPartQuantity"
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
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "eventSource": "change",
                                        "config": {
                                          "key": "dellCarDebugTableContentUUID",
                                          "properties": {
                                            "visibility": true,
                                            "flexClass": "label-container-radio-group-parent"
                                          }
                                        }
                                      },
                                      {
                                        "type": "dellCarDebugService",
                                        "methodType": "updateStockQty",
                                        "config": {
                                          "data": "#getDellCarPartQuantity",
                                          "keyToUpdate": "dellCarDebugStockQty",
                                          "isDisable": false
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
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "eventSource": "input",
                        "config": {
                          "key": "dellCarDebugTableContentUUIDHeading",
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
                          "key": "dellCarDebugTableContentUUID",
                          "properties": {
                            "visibility": false,
                            "flexClass": "hide"
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
                      }
                    ]
                  }
                }
              }
            ],
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
        "autocompleteClass": "autocomplete_part",
      };

      if (selectedPart && selectedPart != "") { } else {
        partField["focus"] = false;
      }
      leftSideItems.push(partField);
    }
    if (action.config.processType === "manual") {
      let userSelectedLocation = this.contextService.getDataByKey("userSelectedLocation");
      let commodityField = {
        "ctype": "dropdownWithSearch",
        "uuid": "dellCarDebugCommodityUUID",
        "name": action.config.processType + "commodity",
        "hooks": this.commodityHooks(action),
        "actions": [
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": "dellDebug" + action.config.processType + "commodity",
              "data": "elementControlValue"
            },
            "eventSource": "change"
          },

        ],
        "type": "text",
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
        "dropdownClass": "dropdown-container textfield-container",
        "labelClass": "subtitle1-align-self greyish-black",
      };
      leftSideItems.push(commodityField);
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
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarDebugActionCodeUUID",
                  "dropDownProperties": {
                    "options": "#getDellDebug" + action.config.processType + "ActionCodes"
                  }
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellDebugRepairActionUUID",
                  "properties": {
                    "hidden": true
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
                          "key": "dellCarDebugActionCodeUUID",
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
      },
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#dellDebug" + action.config.processType + "ActionCode",
        },
        "eventSource": "click",
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "setDefaultValue",
                "config": {
                  "key": "dellCarDebugActionCodeUUID",
                  "defaultValue": "#dellDebug" + action.config.processType + "ActionCode"
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "click",
                "hookType": "beforeInit",
                "config": {
                  "key": "dellCarDebugActionCodeUUID",
                  "isDropDownWithSearch": true,
                  "name": action.config.processType + "ActionCode",
                  "properties": {
                    "defaultValue": "#dellDebug" + action.config.processType + "ActionCode"
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

  returnDefectGroupHooks(action: any) {
    // let camelCaseProcessType = action.config.text.split(" ")[0];
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#getdellDebug" + action.config.processType + "DefectGroups"
        },
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarDebugDefectCodeGroupUUID",
                  "dropDownProperties": {
                    "options": "#getdellDebug" + action.config.processType + "DefectGroups"
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
                          "key": "dellCarDebugDefectCodeGroupUUID",
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
      },
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#dellDebug" + action.config.processType + "DefectGroupName",
        },
        "eventSource": "click",
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "setDefaultValue",
                "config": {
                  "key": "dellCarDebugDefectCodeGroupUUID",
                  "defaultValue": "#dellDebug" + action.config.processType + "DefectGroupName"
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "click",
                "hookType": "beforeInit",
                "config": {
                  "key": "dellCarDebugDefectCodeGroupUUID",
                  "isDropDownWithSearch": true,
                  "name": action.config.processType + "DefectCodeGroup",
                  "properties": {
                    "defaultValue": "#dellDebug" + action.config.processType + "DefectGroupName"
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

  commodityHooks(action: any) {
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#getfaffvalue"
        },
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarDebugCommodityUUID",
                  "dropDownProperties": {
                    "options": "#getfaffvalue"
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
                  "microserviceId": "getfaffvalue",
                  "requestMethod": "get",
                  "hookType": "beforeInit",
                  "params": {
                    "faffId": "893",
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
                          "key": "dellCarDebugCommodityUUID",
                          "dropDownProperties": {
                            "options": "#getfaffvalue"
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
          "lhs": "#dellDebug" + action.config.processType + "commodity",
        },
        "eventSource": "click",
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "setDefaultValue",
                "config": {
                  "key": "dellCarDebugCommodityUUID",
                  "defaultValue": "#dellDebug" + action.config.processType + "commodity"
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "click",
                "hookType": "beforeInit",
                "config": {
                  "key": "dellCarDebugCommodityUUID",
                  "isDropDownWithSearch": true,
                  "name": action.config.processType + "commodity",
                  "properties": {
                    "defaultValue": "#dellDebug" + action.config.processType + "commodity",
                  }
                }
              },
              {
                "type": "condition",
                "eventSource": "change",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": action.config.processType,
                  "rhs": "manual"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "hookType": "beforeInit",
                        "config": {
                          "key": "CompleteButtonUUID",
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
                "type": "condition",
                "eventSource": "change",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": action.config.processType,
                  "rhs": "manual"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "hookType": "beforeInit",
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
                    "actions": []
                  }
                }
              }
            ]
          }
        }
      }
    ]
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
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarDebugDefectUUID",
                  "dropDownProperties": {
                    "options": "#getdellDebug" + action.config.processType + "Defects"
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
                  "key": "dellCarDebugDefectUUID",
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
          "operation": "isValid",
          "lhs": "#dellDebug" + action.config.processType + "DC",
        },
        "eventSource": "click",
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "setDefaultValue",
                "config": {
                  "key": "dellCarDebugDefectUUID",
                  "defaultValue": "#dellDebug" + action.config.processType + "DC"
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "click",
                "hookType": "beforeInit",
                "config": {
                  "key": "dellCarDebugDefectUUID",
                  "isDropDownWithSearch": true,
                  "name": action.config.processType + "Defect",
                  "properties": {
                    "defaultValue": "#dellDebug" + action.config.processType + "DC",
                  }
                }
              },
              {
                "type": "updateComponent",
                "hookType": "beforeInit",
                "config": {
                  "key": "CompleteButtonUUID",
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

  /**
   * 
   * @param action 
   * this method returns the hooks that are to be performed
   * for Part
   */
  returnPartHooks(action: any) {
    let options = this.contextService.getDataByString("#getProcessWCData.parts")
    return [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#getPartsFromDellBoms"
        },
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarDebugPartUUID",
                  "dropDownProperties": {
                    "options": "#getPartsFromDellBoms"
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
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#dellDebug" + action.config.processType + "Part",
        },
        "eventSource": "click",
        "hookType": "beforeInit",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "setDefaultValue",
                "config": {
                  "key": "dellCarDebugPartUUID",
                  "defaultValue": "#dellDebug" + action.config.processType + "Part"
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "click",
                "hookType": "beforeInit",
                "config": {
                  "key": "dellCarDebugPartUUID",
                  "isDropDownWithSearch": true,
                  "name": action.config.processType + "Part",
                  "properties": {
                    "defaultValue": "#dellDebug" + action.config.processType + "Part"
                  }
                }
              },
              {
                "type": "updateComponent",
                "eventSource": "selectionChanged",
                "config": {
                  "key": "dellCarDebugTableContentUUIDHeading",
                  "properties": {
                    "visibility": true,
                    "flexClass": "label-container-radio-group-parent-heading"
                  }
                }
              },
              {
                "type": "microservice",
                "eventSource": "change",
                "config": {
                  "microserviceId": "getDellCarPartQuantity",
                  "requestMethod": "get",
                  "isLocal": false,
                  "LocalService": "assets/Responses/dellReplaceActionCodes.json",
                  "params": {
                    "partNumber": "#dellDebug" + action.config.processType + "Part",
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                  },
                  "toBeStringified": true
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "eventSource": "change",
                        "config": {
                          "key": "dellCarDebugTableContentUUID",
                          "properties": {
                            "visibility": true,
                            "flexClass": "label-container-radio-group-parent"
                          }
                        }
                      },
                      {
                        "type": "dellCarDebugService",
                        "methodType": "updateStockQty",
                        "config": {
                          "data": "#getDellCarPartQuantity",
                          "keyToUpdate": "dellCarDebugStockQty",
                          "isDisable": false
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
          },
          "onFailure": {
            "actions": [
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
   * This method returns the right side items
   * Repair action, source table data and primary flag
   */
  private _rightSideItems(action: any, instance: any, actionService: any, isNewPanel: boolean) {
    let rightSideItems = [];

    if (action.config.processType === "replace") {
      /// Table headers
      rightSideItems.push({
        "ctype": "flexFields",
        "uuid": "dellCarDebugTableContentUUIDHeading",
        "visibility": isNewPanel ? false : true,
        "flexClass": "label-container-radio-group-parent-heading",
        "items": [{
          "ctype": "flexFields",
          "uuid": "dellCarDebugTableUUID",
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
        "uuid": "dellCarDebugTableContentUUID",
        "visibility": isNewPanel ? false : true,
        "flexClass": "label-container-radio-group-parent",
        "items": this._sourceTable(action, instance, actionService, isNewPanel)
      })
      rightSideItems.push(
        {
          "ctype": "textField",
          "uuid": "mbPPIDUUID",
          "label": "MB PPID",
          "name": "mbppid",
          "type": "text",
          "validations": [
            {
              "type": "regex",
              "script": "^([a-zA-Z0-9]{20}|[a-zA-Z0-9]{23})$"
            }
          ],
          "placeholder": "Enter Value",
          "focus": false,
          "hidden": true,
          "maxLength": "23",
          "required": true,
          "submitable": true,
          "disabled": true,
          "formGroupClass": "flex-container-full-width form-group-margin",
          "labelClass": "subtitle1-align-self greyish-black",
          "textfieldClass": "dropdown-container textfield-container",
          "value": "",
          "actions": [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "dellCarDebugMbPPID",
                "data": "elementControlValue"
              },
              "eventSource": "input"
            }
          ]
        },
      );
    }
    return rightSideItems;
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
      "uuid": "dellCarDebugQtyTableUUID#@",
      "flexClass": "label-container-radio-group-grid-3",
      "items": [
        {
          "ctype": "iconText",
          "uuid": "sourceIconUUID#@",
          "icon": 'shopping_cart',
          "text": 'LDC',
          "iconPosition": "after",
          "textClass": "body greyish-black",
          "inLine": true,
          "iconClass": "dell-debug-source-icon"
        },
        {
          "ctype": "dropdownWithSearch",
          "uuid": "dellDebugQTYUUID",
          "hooks": [
          ],
          "submitable": true,
          "required": false,
          "disabled": true,
          "label": "",
          "labelPosition": "left",
          "name": action.config.processType + "QTY",
          "formGroupClass": "form-group-margin qty-width",
          "dropdownClass": "qty-dropdwn textfield-container",
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
          "uuid": isNewPanel ? "dellCarDebugStockQty" : "dellCarDebugStockQty#@",
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
      "defectGroup": this.contextService.getDataByString("#dellDebug" + action.config.processType + "DefectGroupName"),
      "qty": this.contextService.getDataByString("#dellDebug" + action.config.processType + "AvailableQuantity"),
      "part": this.contextService.getDataByString("#dellDebug" + action.config.processType + "Part"),
      "partDetails": this.contextService.getDataByString("#getDellDebugStockQty"),
      "repairAction": this.contextService.getDataByString("#dellDebug" + action.config.processType + "RepairAction"),
      "repairActionName": this.contextService.getDataByString("#dellDebug" + action.config.processType + "RepairActionName"),
      "commodity": this.contextService.getDataByString("#dellDebug" + action.config.processType + "commodity"),
      "partDescription": this.contextService.getDataByString("#dellDebug" + action.config.processType + "partDescription"),
      "ppid": this.contextService.getDataByString("#dellCarDebugMbPPID")
    };
    action.config["taskPanelData"] = taskPanelData;
    let transactions = [];

    /// Checking for the process type and filetering the services to
    /// be called
    // if (action.config.processType === "replace") {
    //   transactions.push(
    //     {
    //       "type": "microservice",
    //       "hookType": "afterInit",
    //       "config": {
    //         "microserviceId": "getDellDebugStockQty",
    //         "requestMethod": "get",
    //         "params": {
    //           "pCompPartNo": action.config.taskPanelData.part,
    //           "pLocationId": "#userSelectedLocation",
    //           "pClientId": "#userSelectedClient",
    //           "pContractId": "#userSelectedContract",
    //           "pWarehouseId": "#discrepancyUnitInfo.WAREHOUSE_ID",
    //           "pZoneId": "55345",
    //           "pWorkcenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
    //           "pOrderProcessTypeCode": "#discrepancyUnitInfo.ROUTE",
    //           "pUserName": "#userAccountInfo.PersonalDetails.USERID"
    //         },
    //         "isLocal": false,
    //         "LocalService": "assets/Responses/availableQuantity.json"
    //       },
    //       "responseDependents": {
    //         "onSuccess": {
    //           "actions": this._commonTransactions(action)
    //         },
    //         "onFailure": {
    //           "actions": []
    //         }
    //       }
    //     }
    //   );
    //   // transactions = this._commonTransactions(action);
    // } else {
    transactions = this._commonTransactions(action);
    // }
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
    if (action.config.processType === "replace") {
      commonTransaction = [
        {
          "type": "microservice",
          "eventSource": "click",
          "config": {
            "microserviceId": "isPartNumberPresent",
            "requestMethod": "get",
            "params": {
              "partNo": action.config.taskPanelData.part,
              "userName": "#userAccountInfo.PersonalDetails.USERID",
              "locationName": "#userSelectedLocationName",
              "ownerName": "#discrepancyUnitInfo.CLIENTNAME",
              "ConditionName": "Defective"
            }
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "microservice",
                  "eventSource": "click",
                  "config": {
                    "microserviceId": "globalBomMatrix",
                    "isLocal": false,
                    "LocalService": "assets/Responses/mockgetPartsDetailsBomsMatrix.json",
                    "requestMethod": "post",
                    "body": {
                      "partNo": action.config.taskPanelData.part,
                      "userName": "#userAccountInfo.PersonalDetails.USERID",
                      "serialNo": "#repairUnitInfo.SERIAL_NO",
                      "fat": "#discrepancyUnitInfo.FAT",
                      "locationName": "#userSelectedLocationName",
                      "commodityName": action.config.taskPanelData.commodity
                    }
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "microservice",
                          "eventSource": "click",
                          "config": {
                            "microserviceId": "doaTrigger",
                            "requestMethod": "post",
                            "isLocal": false,
                            "LocalService": "assets/Responses/performFA.json",
                            "body": {
                              "itemId": "#discrepancyUnitInfo.ITEM_ID",
                              "userName": "#userAccountInfo.PersonalDetails.USERID",
                              "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                              "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                              "locationId": "#userSelectedLocation",
                              "actionCode": action.config.taskPanelData.actionCodeName,
                              "commodity": action.config.taskPanelData.commodity,
                              "defectCode": action.config.taskPanelData.defect
                            }
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "microservice",
                                  "eventSource": "click",
                                  "config": {
                                    "microserviceId": "rcSurTrigger",
                                    "requestMethod": "post",
                                    "isLocal": false,
                                    "LocalService": "assets/Responses/performFA.json",
                                    "body": {
                                      "partNumber": action.config.taskPanelData.part,
                                      "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                      "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                                      "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                                      "locationId": "#userSelectedLocation",
                                      "resultCode": "",
                                      "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                      "identificatorType": "WIP_QTY",
                                      "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                                      "ip": "::1",
                                      "callSource": "FrontEnd",
                                      "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                                      "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME",
                                      "ppId": action.config.taskPanelData.ppid,
                                      "commodity": action.config.taskPanelData.commodity,
                                      "userName": "#userAccountInfo.PersonalDetails.USERID",
                                      "password": "#loginUUID.password"
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
                                            "key": "rcSurTrigger",
                                            "data": "responseData"
                                          }
                                        },
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
                                                      "actionCode": action.config.taskPanelData.actionCodeName,
                                                      "operation": "Add",
                                                      "notes": action.config.taskPanelData.part,
                                                      // "actionCode": "DRR",
                                                      "flexFieldList": {
                                                        "flexField": [
                                                          {
                                                            "name": "Commodity",
                                                            "codePath": "/-1/-1/",
                                                            "value": action.config.taskPanelData.commodity
                                                          }
                                                        ]
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
                                                            "name": "Glowna Usterka",
                                                            "codePath": "/-1/-1/",
                                                            "value": "No"
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
                                              {
                                                "identifier": "flexField",
                                                "valueField": "value",
                                                "keyToBeRemoved": "flexFieldList"
                                              }

                                            ]
                                          },
                                          "responseDependents": {
                                            "onSuccess": {
                                              "actions": [
                                                {
                                                  "type": "microservice",
                                                  "config": {
                                                    "microserviceId": "performRemoveParts",
                                                    "requestMethod": "post",
                                                    "isLocal": false,
                                                    "LocalService": "assets/Responses/getHPFAHistory.json",
                                                    "body": {
                                                      "removePartsRequest": {
                                                        "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                                        "actionCodeChange": {
                                                          "actionCode": action.config.taskPanelData.actionCodeName,
                                                          "operation": "Add",
                                                          "defectCode": {
                                                            "value": action.config.taskPanelData.defect,
                                                          }
                                                        },
                                                        "nonInventoryPartList": {
                                                          "nonInventoryPart": [
                                                            {
                                                              "componentLocationDescription": "Atyrr567",
                                                              "part": action.config.taskPanelData.part,
                                                              "quantity": "1",
                                                              "flexFieldList": {
                                                                "flexField": [
                                                                  {
                                                                    "name": "Warranty",
                                                                    "value": "IW"
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      "userPwd": {
                                                        "username": "#userAccountInfo.PersonalDetails.USERID",
                                                        "password": "#loginUUID.password"
                                                      },
                                                      "ip": "::1",
                                                      "callSource": "FrontEnd",
                                                      "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                                                      "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
                                                    }
                                                  },
                                                  "responseDependents": {
                                                    "onSuccess": {
                                                      "actions": [
                                                        {
                                                          "type": "context",
                                                          "config": {
                                                            "requestMethod": "add",
                                                            "key": "performRemovePart",
                                                            "data": "responseData"
                                                          }
                                                        },
                                                        {
                                                          "type": "microservice",
                                                          "config": {
                                                            "microserviceId": "getDellCarDebugHPFAHistory",
                                                            "requestMethod": "get",
                                                            "params": {
                                                              "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                              "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                              "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                                                              "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                                                              "locationId": "#userSelectedLocation"
                                                            },
                                                            "toBeStringified": true,
                                                            "isLocal": false,
                                                            "LocalService": "assets/Responses/mockHoldSubCode.json"
                                                          },
                                                          "responseDependents": {
                                                            "onSuccess": {
                                                              "actions": [
                                                                {
                                                                  "type": "dellCarDebugService",
                                                                  "methodType": "checkForNewlyAddedItem",
                                                                  "config": {
                                                                    "data": "getDellCarDebugHPFAHistory",
                                                                    "action": action,
                                                                    "isLooperControlTask": false
                                                                  }
                                                                },
                                                                {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                    "key": "PrimaryFaultPanelTableUUID",
                                                                    "fieldProperties": {
                                                                      "datasource": "#getDellCarDebugHPFAHistory"
                                                                    }
                                                                  }
                                                                },
                                                                {
                                                                  "type": "updatePrimaryFault",
                                                                  "config": {}
                                                                },
                                                                {
                                                                  "type": "context",
                                                                  "config": {
                                                                    "requestMethod": "add",
                                                                    "key": "dellCarDebugMbPPID",
                                                                    "data": ""
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
                                                                    "key": "getDellCarDebugHPFAHistory",
                                                                    "data": "responseData"
                                                                  }
                                                                },
                                                                {
                                                                  "type": "updatePrimaryFault",
                                                                  "config": {}
                                                                },
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
    else {
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
                      "actionCode": action.config.taskPanelData.actionCodeName,
                      "operation": "Add",
                      "notes": action.config.taskPanelData.part,
                      // "actionCode": "DRR",
                      "flexFieldList": {
                        "flexField": [
                          {
                            "name": "Commodity",
                            "codePath": "/-1/-1/",
                            "value": action.config.taskPanelData.commodity
                          }
                        ]
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
                            "name": "Glowna Usterka",
                            "codePath": "/-1/-1/",
                            "value": "No"
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
              {
                "identifier": "flexField",
                "valueField": "value",
                "keyToBeRemoved": "flexFieldList"
              }

            ]
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "microservice",
                  "config": {
                    "microserviceId": "getDellCarDebugHPFAHistory",
                    "requestMethod": "get",
                    "params": {
                      "itemId": "#discrepancyUnitInfo.ITEM_ID",
                      "userName": "#userAccountInfo.PersonalDetails.USERID",
                      "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                      "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                      "locationId": "#userSelectedLocation"
                    },
                    "toBeStringified": true,
                    "isLocal": false,
                    "LocalService": "assets/Responses/mockHoldSubCode.json"
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "dellCarDebugService",
                          "methodType": "checkForNewlyAddedItem",
                          "config": {
                            "data": "getDellCarDebugHPFAHistory",
                            "action": action,
                            "isLooperControlTask": false
                          }
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "PrimaryFaultPanelTableUUID",
                            "fieldProperties": {
                              "datasource": "#getDellCarDebugHPFAHistory"
                            }
                          }
                        },
                        {
                          "type": "updatePrimaryFault",
                          "config": {}
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "getDellCarDebugHPFAHistory",
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "updatePrimaryFault",
                          "config": {}
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

    }
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
    let addItemToReqList = true;

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
    let partNo, commodity = "";
    let defect = action.config.taskPanelData && action.config.taskPanelData.defect ? action.config.taskPanelData.defect : ""
    if (action.config.processType == "replace") {
      partNo = action.config.taskPanelData && action.config.taskPanelData.part ? action.config.taskPanelData.part : "";
      // commodity = action.config.taskPanelData && action.config.taskPanelData.commodity  ? action.config.taskPanelData.commodity : action.config.action.config.taskPanelData.commodity;
    }
    else if (action.config.processType == "replace") {
      partNo = action.config.taskPanelData.part;
      commodity = action.config.taskPanelData.commodity;
    }
    else if (action.config.processType == "manual") {
      commodity = action.config.taskPanelData.commodity;
    }
    let actionDet = action.config.taskPanelData && action.config.taskPanelData.actionCodeName ? action.config.taskPanelData.actionCodeName : "";
    let modHead = defect + " " + actionDet
    if (commodity) {
      modHead = commodity + " " + modHead;
    }
    if (partNo) {
      modHead = partNo + " " + modHead;
    }
    let existingOuterPanel = this.contextService.getDataByKey(defect + "uuid" + 'ref');

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

    if (isTaskcompleted) {
      addItemToReqList = false;
    }

    let parentPanel = [
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data": {
            "ctype": "addDefectTaskPanel",
            "uuid": defect + "uuid",
            "actions": [
              {
                "eventSource": "prDelete",
                "config": {
                  "parentUUID": "PredictionTaskPanelUUID#@",
                  "defectGroup": "#_predidcted_class",
                  "defect": "#_defectCode"
                }
              }
            ],
            "hooks": [],
            "header": {
              "title": defect
            },
            "expanded": false,
            "hideToggle": "true",
            "isKeepExpanded": false,
            "containerId": "prebodysection",
            "isBasedOnApiData": true,
            "visibility": true,
            "Togglehidden": true,
            "validations": [],
            "predictiveClass": "change-position-toolbar",
            "toolBarItems": [],
            "items": []
          },
        }
      }
    ]
    if (!existingOuterPanel) {
      this.executeActions(parentPanel, instance, actionService);
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
          "key": "delCarDebugTaskPanelUUID"
        }
      },
      {
        "type": "createComponent",
        "config": {
          "targetId": defect + "uuid",
          "containerId": "expansionpanelcontent",
          "data": {
            "ctype": "taskPanel",
            "uuid": "dellCarDebugCreatedTaskPanelUUID",
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
              modHead,
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
            "panelClass": "top-margin top-padding",
            "leftDivclass": "width:50%",
            "rightDivclass": "width:50%",
            "taskPanelHeaderClass": "task-panel-header-color-light-grey",
            "visibility": false,
            "disabled": false,
            "hooks": this._createdTaskHooks(action, addItemToReqList),
            "validations": [],
            "actions": [
              {
                "type": "dellCarDebugService",
                "methodType": "disableOrEnableAllIcons",
                "eventSource": "click",
                "config": {
                  "currentProcess": action.config.processType,
                  "isDisable": false
                }
              }
            ],
            "items": this._getItems(action, addItemToReqList),
            // "rightItems": action.config.processType === "replace" ? [
            //   {
            //     "ctype": "flexFields",
            //     "uuid": "dellCarDebugLooperTableContentUUIDHeading",
            //     "visibility": true,
            //     "flexClass": "label-container-radio-group-parent-heading",
            //     "items": [{
            //       "ctype": "flexFields",
            //       "uuid": "dellCarDebugTableUUID",
            //       "visibility": true,
            //       "flexClass": "label-container-radio-group-grid-3",
            //       "items": [
            //         {
            //           "ctype": "label",
            //           "text": "Source",
            //           "labelClass": "greyish-black"
            //         },
            //         {
            //           "ctype": "iconText",
            //           "uuid": "sourceIconUUID#@",
            //           "icon": 'shopping_cart',
            //           "text": 'LDC',
            //           "iconPosition": "after",
            //           "textClass": "body greyish-black",
            //           "inLine": true,
            //           "iconClass": "dell-debug-source-icon"
            //         }
            //       ]
            //     }]
            //   }
            // ] : [],
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
                          "text": "PartDescription : ",
                          "textValue": action.config.taskPanelData.partDescription ? action.config.taskPanelData.partDescription[0] ? action.config.taskPanelData.partDescription[0].partDescription : "" : "",
                          "class": "subtitle1-align-self greyish-black width-200"
                        }
                      ],
                      "Qty": [
                        {
                          "ctype": "block-text",
                          "uuid": "dellCarDebugReqlistQtyUUID",
                          "text": '1'
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
              "count": "#dellDebugReqListLength"
            }
          },
          "hookType": "afterInit"
        },
        {
          "type": "microservice",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "getDellCarPartQuantity",
            "requestMethod": "get",
            "params": {
              "partNumber": action.config.taskPanelData.part,
              "userName": "#userAccountInfo.PersonalDetails.USERID",
            },
            "toBeStringified": true,
            "isLocal": false,
            "LocalService": "assets/Responses/availableQuantity.json"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "dellCargetDellDebugStockQty#@",
                    "data": "responseData"
                  }
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "getDellDebugStockQty#@",
                    "data": "responseData"
                  }
                },
                {
                  "type": "dellCarDebugService",
                  "methodType": "updateStockQty",
                  "config": {
                    "data": "#getDellDebugStockQty#@",
                    "keyToUpdate": "dellCarDebugStockQty#@",
                    "isDisable": false
                  },
                  "hookType": "afterInit"
                }
              ]
            },
            "onFailure": {
              "actions": []
            }
          }
        },
        {
          "type": "dellCarDebugService",
          "hookType": "afterInit",
          "methodType": "updateStockQty",
          "config": {
            "data": "#getDellCarPartQuantity",
            "keyToUpdate": "dellCarDebugStockQty#@",
            "isDisable": false
          }
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
      "type": "dellCarDebugService",
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
    if (stock && stock[0].stockQty === "0") {
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
      "defectGroup": "",
      "defect": ""
    };

    if (currentItem.config.processType === "replace") {
      data["commodity"] = "";
      data["part"] = "";
    }
    else if (currentItem.config.processType === "manual") {
      data["commodity"] = "";
    }


    for (let currentKey in data) {
      if (currentData[currentKey] !== undefined && currentData[currentKey] !== null) {
        data[currentKey] = currentData[currentKey];
      }
    }
    currentData = data;

    for (let currentKey in currentData) {
      if (currentKey === "actionCodeName" ||
        currentKey === "defect" ||
        currentKey === "commodity" ||
        currentKey === "part" ||
        currentKey === "reqNotes" || currentKey === "defectGroup") {

        let label = currentKey === "actionCodeName" ? "Action Code"
          : currentKey === "defect" ? "Defect"
            : currentKey === "commodity" ? "Commodity"
              : currentKey === "defectGroup" ? "Defect Group" :
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
      "uuid": "dellCarDebugFailCodeTitleUUID",
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
    // let primaryFaultCheckboxValue = this.contextService.getDataByKey("dellDebug" + action.config.processType + "PrimaryFault");
    // let primaryFaultStatus;
    // if (action.config.isLooperControlTask) {
    //   primaryFaultStatus = action.config.taskPanelData.mainIssue2 === "Yes" ? true : false;
    // } else {
    //   primaryFaultStatus = primaryFaultCheckboxValue ? primaryFaultCheckboxValue : false;
    // }

    // if (primaryFaultStatus) {
    //   actionService.handleAction(
    //     {
    //       "type": "context",
    //       "config": {
    //         "requestMethod": "add",
    //         "key": "isPrimaryFaultExists",
    //         "data": primaryFaultStatus
    //       }
    //     }, instance)
    // }

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
      "uuid": "dellCarDebugcreatedDeleteUUID#@",
      "parentuuid": "#@",
      "visibility": true,
      "disabled": false,
      "isIcon": true,
      "type": "submit",
      "actions": this._deleteButtonActions(action)
    };
    // if (action.config.processType === "replace" && isTaskcompleted) {
    //   deleteButton.class = "primary-btn dell-debug-delete-button-disable",
    //     deleteButton.disabled = true;
    // }
    if (!isTaskcompleted) {
      footerItems.push(deleteButton);
    }

    footerItems.push(
      {
        "ctype": "button",
        "color": "primary",
        "text": "Complete",
        "class": "primary-btn",
        "uuid": "dellCarDebugCreatedCompleteUUID#@",
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
      },
      {
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
                    "occurrence": "#currentOccurenceData#@.defectCodeOccurence",
                    "flexFieldCodeList": {
                      "flexFieldCode": [
                        {
                          "name": "Glowna Usterka",
                          "codePath": "/-1/-1/",
                          "value": "No"
                        }
                      ]
                    }
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
          "toBeStringified": true,
          "spliceIfEmptyValueObject": [
            // {
            //   "identifier": "actionCodeChange",
            //   "valueField": "notes"
            // },
            {
              "identifier": "defectCodeChange",
              "valueField": "notes"
            },
            // {
            //   "identifier": "flexField",
            //   "valueField": "value",
            //   "keyToBeRemoved": "flexFieldList"
            // }
          ]
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
                        "type": "dellCarDebugService",
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
                        "type": "updateComponent",
                        "config": {
                          "key": "dellDebugReqListButtonUUID",
                          "properties": {
                            "count": "#dellDebugReqListLength"
                          }
                        },
                        "hookType": "afterInit"
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": []
                  }
                }
              },
              {
                "type": "dellCarDebugService",
                "methodType": "deleteParentElement",
                "config": {
                  "taskPanelData": action.config.taskPanelData
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
        }
      }
    ];

    // This is for cancelFA code
    actions.push(
      {
        "type": "updateComponent",
        "config": {
          "key": "errorTitleUUID",
          "properties": {
            "titleValue": "",
            "isShown": true
          }
        }
      }
    );

    return actions;
  }

  deleteParentElement(action, instance, actionService) {
    let taskPanelData = action.config.taskPanelData;
    actionService.handleAction({
      "type": "microservice",
      "config": {
        "microserviceId": "getDellCarDebugHPFAHistory",
        "requestMethod": "get",
        "params": {
          "itemId": "#discrepancyUnitInfo.ITEM_ID",
          "userName": "#userAccountInfo.PersonalDetails.USERID",
          "clientId": "#discrepancyUnitInfo.CLIENT_ID",
          "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
          "locationId": "#userSelectedLocation"
        },
        "toBeStringified": true,
        "isLocal": false,
        "LocalService": "assets/Responses/mockHoldSubCode.json"
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "getDellCarDebugHPFAHistory",
                "data": "responseData"
              }
            },
            {
              "type": "updatePrimaryFault",
              "config": {}
            },
            {
              "type": "filterAndGetIndex",
              "hookType": "afterInit",
              "config": {
                "data": "#getDellCarDebugHPFAHistory",
                "objectKey": "glownaUsterka",
                "getValueBy": "Yes",
                "contextKey": "checkedData",
                "operation": "getIndex"
              }
            },
            {
              "type": "condition",
              "hookType": "afterInit",
              "config": {
                "operation": "isValid",
                "lhs": "#checkedData.glownaUsterka"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "dellCarDebugPrimaryFaultPanelUUID",
                        "properties": {
                          "expanded": false,
                          "disabled": false,
                          "taskPanelHeaderClass": "background-white",
                          "header": {
                            "title": "Primary Fault",
                            "svgIcon": "description_icon",
                            "statusIcon": "check_circle",
                            "statusClass": "complete-status",
                            "class": "complete-task",
                            "iconClass": "complete-task"
                          }
                        }
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "eventSource": "click",
                      "config": {
                        "key": "dellCarDebugPrimaryFaultPanelUUID",
                        "properties": {
                          "expanded": false,
                          "disabled": false,
                          "header": {
                            "title": "Primary Fault",
                            "svgIcon": "description_icon",
                            "iconClass": "active-header",
                            "statusIcon": "hourglass_empty",
                            "statusClass": "incomplete-status"
                          }
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
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "getDellCarDebugHPFAHistory",
                "data": "responseData"
              }
            },
            {
              "type": "updatePrimaryFault",
              "config": {}
            }
          ]
        }
      }
    }, instance);
    let getDellCarDebugHPFAHistory = this.contextService.getDataByKey("getDellCarDebugHPFAHistory");
    let values = getDellCarDebugHPFAHistory && getDellCarDebugHPFAHistory.filter(item => item.defectCode == taskPanelData.defect);
    if (values.length < 2) {
      let comp = this.contextService.getDataByKey(taskPanelData.defect + "uuid" + 'ref');
      actionService.handleAction(
        {
          "type": "deleteComponent",
          "eventSource": "click",
          "config": {
            "key": taskPanelData.defect + "uuid"
          }
        }, instance);
    }
  }

  updateTableAfterDeletion() {

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
    let data;
    let classToApply = "saved-green body";
    let stock;

    if (action.config.data && typeof(action.config.data) =='string' && action.config.data.startsWith('#')) {
      data = this.contextService.getDataByString(action.config.data);
    } else {
      data = action.config.data;
    }

    if (data) {
      if (!data.stockQty) {
        classToApply = "light-red heading1 padding-left-10";
        stock = "0"
      } else {
        stock = data.stockQty + " Available";
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
        "key": "dellCarDebugDefectUUID",
        "dropDownProperties": {
          "options": defectCodes
        }
      }
    }, instance)
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
      "manual",
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
                "type": "dellCarDebugService",
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
    let existingHPFAHistory = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
    let looperControlData = existingHPFAHistory;
    let actionCodes = this.contextService.getDataByKey("getDellDebug" + action.config.processType + "ActionCodes");
    // actionCodes = [
    //   {
    //     "resellercode": "RPL",
    //     "resellerValue": "RPL"
    //   }
    // ]
    let itemsAdded = [];
    this.currentitem = 0;
    this.itemCount = 0;

    this.resetData(action, instance, actionService);

    let processType = action.config.processType;
    if (looperControlData && looperControlData !== undefined && looperControlData.length > 0) {
      // looperControlData.sort((a, b) => a.actionId.localeCompare(b.actionId));
      looperControlData && looperControlData.forEach((item, index) => {
        actionCodes && actionCodes.forEach((element) => {
          if (element.actonCodesAbbreviation === item.actioncodename) {
            itemsAdded.push(item);
          }
        });
      });
    }
    let getStockQty = [];
    let compActions = [];
    itemsAdded && itemsAdded.forEach((item, index) => {
      let taskPanelData = {
        "actionCode": item.actionId,
        "actionCodeName": item.actioncodename,
        "defect": item.defectCode,
        "defectName": item.defectCodeDesc,
        "qty": "1",
        "part": item.partNo,
        "partDetails": [{
          "partDescription": item.partDesc
        }],
        "partDescription": [{
          "partDescription": item.partDesc
        }],
        "commodity": item.commodity,
        "repairAction": item.repairAction,
        "repairActionName": item.repairAction,
        "primaryFaultStatus": item.mainIssue2 === "Yes" ? true : false,
        "actionId": item.actionId,
        "mainIssue2": item.mainIssue2
      };

      item["index"] = index;
      item["length"] = itemsAdded.length;

      let svgIcon = processType && processType === "manual" ? "manual" :
        processType === "other" ? "description_icon" : processType;
      if (processType === "replace") {
        let apisToCall = [];
        let getStock = {
          "type": "microservice",
          "hookType": "afterInit",
          "config": {
            "microserviceId": "getDellCarPartQuantity",
            "requestMethod": "get",
            "params": {
              "partNumber": taskPanelData.part,
              "userName": "#userAccountInfo.PersonalDetails.USERID",
            },
            "toBeStringified": true,
            "isLocal": false,
            "LocalService": "assets/Responses/availableQuantity.json"
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "dellCargetDellDebugStockQty",
                    "data": "responseData"
                  }
                },
                {
                  "type": "context",
                  "config": {
                    "requestMethod": "add",
                    "key": "getDellDebugStockQty",
                    "data": "responseData"
                  }
                },
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
        // apisToCall.push(getStock);
        apisToCall.push(componentStatus);
        this.contextService.addToContext("isReplaceTaskExits", true);
        this.combinelatestApirequest(apisToCall, this.afterCombineLatest, item, actionService, instance);
      } else {
        actionService.handleAction(
          {
            "type": "dellCarDebugService",
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

  private _createRplTask(action, instance, actionService) {
    let existingHPFAHistory = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
    let data = this.contextService.getDataByKey("predictiveDebugTrigger");

    // data = data.rplData;

    let arr = cloneDeep(data);
    if (existingHPFAHistory) {
      data && Array.isArray(data) && data.map((element, index) => {
        existingHPFAHistory && existingHPFAHistory.map((ele) => {
          if (element.partNo == ele.partNo) {
            arr.splice(index, 1);
          }
        })
      })
      data = arr;
    }
    else {
      arr = data;
    }
    if (arr) {
      const ids = arr && arr.map(o => o.defectCode)
      const filtered = arr && arr.filter(({ defectCode }, index) => !ids.includes(defectCode, index + 1))
      data = filtered;
    }
    let rplPanel = [
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data": {
            "ctype": "addDefectTaskPanel",
            "uuid": "rpluuid",
            "actions": [
              {
                "eventSource": "prDelete",
                "config": {
                  "parentUUID": "PredictionTaskPanelUUID#@",
                  "defectGroup": "#_predidcted_class",
                  "defect": "#_defectCode"
                }
              }
            ],
            "hooks": [],
            "header": {
              "title": "DELL PREDICTIVE PARTS"
            },
            "expanded": false,
            "hideToggle": "true",
            "isKeepExpanded": false,
            "containerId": "prebodysection",
            "isBasedOnApiData": true,
            "visibility": true,
            "Togglehidden": true,
            "validations": [],
            "predictiveClass": "change-position-toolbar",
            "toolBarItems": [],
            "items": []
          },
        }
      }
    ]
    if (data && data.length) {
      this.executeActions(rplPanel, instance, actionService);
    }


    let actions = []
    if (data && data.length) {
      data && data.map((item) => {
        let title = "Replace Part - " + item.partNo;
        actions.push(
          {
            "type": "createComponent",
            "config": {
              "targetId": "rpluuid",
              "containerId": "expansionpanelcontent",
              "data": {
                "ctype": "taskPanel",
                "uuid": "dellCarDebugRplUUID#@",
                "uniqueUUID": true,
                "updateUUID": true,
                "title": "",
                "header": {
                  "svgIcon": "replace",
                  "title": title,
                  "iconClass": "active-header",
                  "headerclass": "replaceheaderclass",
                  "status": "",
                  "statusIcon": "info_outline",
                  "statusClass": "eco-icon"
                },
                "headerTitleValues": [
                  item.defectCode,
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
                "leftDivclass": "width:50%",
                "rightDivclass": "width:50%",
                "taskPanelHeaderClass": "task-panel-header-color-light-grey",
                "visibility": false,
                "panelClass": "top-margin overflow-show",
                "hooks": [
                  {
                    "type": "microservice",
                    "hookType": "afterInit",
                    "config": {
                      "microserviceId": "getDellCarPartQuantity",
                      "requestMethod": "get",
                      "params": {
                        "partNumber": item.partNo,
                        "userName": "#userAccountInfo.PersonalDetails.USERID",
                      },
                      "toBeStringified": true,
                      "isLocal": false,
                      "LocalService": "assets/Responses/availableQuantity.json"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "dellCargetDellDebugRplStockQty",
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "getDellDebugStockQty",
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "dellCarDebugService",
                            "methodType": "updateStockQty",
                            "config": {
                              "data": "#dellCargetDellDebugRplStockQty",
                              "keyToUpdate": "dellCarDebugRplStockQty#@",
                              "isDisable": false
                            },
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
                "actions": [],
                "items": [
                  {
                    "ctype": "dropdownWithSearch",
                    "uuid": "dellCarDebugRplActionCodeUUID#@",
                    "hooks": [],
                    "submitable": true,
                    "visibility": true,
                    "required": true,
                    "label": "Action Code",
                    "labelPosition": "left",
                    "name": "rplActionCode",
                    "formGroupClass": "flex-container-full-width form-group-margin",
                    "dropdownClass": "dropdown-container textfield-container",
                    "labelClass": "subtitle1-align-self greyish-black",
                    "code": "actonCodesAbbreviation",
                    "displayValue": "actonCodesAbbreviation",
                    "dataSource": "#getDellCarRplActionCode",
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
                          "key": "dellDebugRpl" + "ActionCode",
                          "data": "elementControlValue"
                        },
                        "eventSource": "change"
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "dellDebugRpl" + "ActionCodeName",
                          "data": "elementControlName"
                        },
                        "eventSource": "change"
                      }
                    ]
                  },
                  {
                    "ctype": "dropdownWithSearch",
                    "uuid": "dellCarDebugRplDefectCodeGroupUUID#@",
                    "hooks": [
                      {
                        "type": "microservice",
                        "hookType": "beforeInit",
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
                                  "key": "rplDefectGroups",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "dellCarDebugRplDefectCodeGroupUUID#@",
                                  "dropDownProperties": {
                                    "options": "#rplDefectGroups"
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
                    ],
                    "submitable": true,
                    "visibility": true,
                    "required": true,
                    "label": "Defect Group",
                    "labelPosition": "left",
                    "name": "rplDefectCodeGroup",
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
                          "key": "dellDebugRpl" + "DefectGroupValue",
                          "data": "elementControlValue"
                        },
                        "eventSource": "change"
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "dellDebugRpl" + "DefectGroupName",
                          "data": "elementControlName"
                        },
                        "eventSource": "change"
                      },
                      {
                        "type": "updateComponent",
                        "eventSource": "change",
                        "config": {
                          "key": "dellCarDebugRPLDefectUUID#@",
                          "dropDownProperties": {
                            "options": []
                          },
                          "properties": {
                            "isReset": true,
                            "name": "defectRpl"
                          }
                        }
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
                            "path": "#dellDebugRpl" + "DefectGroupValue",
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
                                  "key": "getdellRplDebugDefects",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "condition",
                                "config": {
                                  "operation": "isValid",
                                  "lhs": "#getdellRplDebugDefects"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "dellCarDebugRPLDefectUUID#@",
                                          "dropDownProperties": {
                                            "options": "#getdellRplDebugDefects"
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
                                          "key": "dellCarDebugDefectUUID",
                                          "dropDownProperties": {
                                            "options": []
                                          },
                                          "properties": {
                                            "isReset": true,
                                            "name": "Defect#@"
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
                        }
                      }
                    ]
                  },
                  {
                    "ctype": "dropdownWithSearch",
                    "uuid": "dellCarDebugRPLDefectUUID#@",
                    "hooks": [],
                    "submitable": true,
                    "visibility": true,
                    "required": true,
                    "label": "Defect",
                    "labelPosition": "left",
                    "name": "defectRpl",
                    "formGroupClass": "flex-container-full-width form-group-margin",
                    "dropdownClass": "dropdown-container textfield-container",
                    "labelClass": "subtitle1-align-self greyish-black",
                    "code": "name",
                    "displayValue": "name",
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
                          "key": "dellDebugRpl" + "DC",
                          "data": "elementControlValue"
                        },
                        "eventSource": "change"
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "dellDebugRpl" + "DefectName",
                          "data": "elementControlName"
                        },
                        "eventSource": "change"
                      }
                    ]
                  },
                  {
                    "ctype": "dropdownWithSearch",
                    "uuid": "dellCarDebugRPLDefectCommodityUUID#@",
                    "hooks": [],
                    "submitable": true,
                    "visibility": true,
                    "required": true,
                    "label": "Commodity",
                    "labelPosition": "left",
                    "name": "defectRp7",
                    "formGroupClass": "flex-container-full-width form-group-margin",
                    "dropdownClass": "dropdown-container textfield-container",
                    "labelClass": "subtitle1-align-self greyish-black",
                    "code": "",
                    "displayValue": "",
                    "dataSource": "#getfaffvalue",
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
                          "key": "dellDebugRplcommodity",
                          "data": "elementControlValue"
                        },
                        "eventSource": "change"
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "dellDebugRplCommodityName",
                          "data": "elementControlName"
                        },
                        "eventSource": "change"
                      },
                    ]
                  },
                  {
                    "ctype": "flexFields",
                    "uuid": "dellCarDebugRplPartTitleUUID",
                    "flexClass": "cisco-debug-label-container-30-50",
                    "items": [
                      {
                        "ctype": "label",
                        "text": "Part",
                        "labelClass": "greyish-black subtitle1-align-self"
                      },
                      {
                        "ctype": "label",
                        "text": item.partNo,
                        "labelClass": "greyish-black change-lable-position"
                      }
                    ]
                  }
                ],
                "rightItems": [
                  {
                    "ctype": "flexFields",
                    "uuid": "dellCarDebugRplTableContentUUIDHeading",
                    "visibility": true,
                    "flexClass": "label-container-radio-group-parent-heading",
                    "items": [
                      {
                        "ctype": "flexFields",
                        "uuid": "dellCarDebugRplTableUUID",
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
                  },
                  {
                    "ctype": "flexFields",
                    "uuid": "dellCarDebugRplTableContentUUID",
                    "visibility": true,
                    "flexClass": "label-container-radio-group-parent",
                    "items": [
                      {
                        "ctype": "flexFields",
                        "uuid": "dellCarDebugRplQtyTableUUID#@",
                        "flexClass": "label-container-radio-group-grid-3",
                        "items": [
                          {
                            "ctype": "iconText",
                            "uuid": "sourceIconUUID#@",
                            "icon": 'shopping_cart',
                            "text": 'LDC',
                            "iconPosition": "after",
                            "textClass": "body greyish-black",
                            "inLine": true,
                            "iconClass": "dell-debug-source-icon"
                          },
                          {
                            "ctype": "dropdownWithSearch",
                            "uuid": "dellDebugQTYUUID",
                            "hooks": [
                            ],
                            "submitable": true,
                            "required": false,
                            "disabled": true,
                            "label": "",
                            "labelPosition": "left",
                            "name": "rplReplace" + "QTY",
                            "formGroupClass": "form-group-margin qty-width",
                            "dropdownClass": "qty-dropdwn textfield-container",
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
                            "uuid": "dellCarDebugRplStockQty#@",
                            "text": "",
                            "labelClass": "greyish-black cisco-stock"
                          }
                        ]
                      }
                    ]
                  }
                ],
                "footer": [
                  {
                    "ctype": "button",
                    "text": "Delete",
                    "class": "primary-btn dell-debug-delete-button",
                    "icon": "delete",
                    "iconClass": "iconbtn",
                    "textClass": "body2",
                    "uuid": "dellCarDebugRPLcreatedDeleteUUID#@",
                    "parentuuid": "#@",
                    "visibility": true,
                    "disabled": false,
                    "isIcon": true,
                    "type": "submit",
                    "actions": [
                      {
                        "type": "microservice",
                        "eventSource": "click",
                        "config": {
                          "microserviceId": "getRPLmoveinventoryconfig",
                          "requestMethod": "get",
                          "isLocal": false,
                          "LocalService": "assets/Responses/dellDebugDefects.json",
                          "params": {
                            "locationId": "#userSelectedLocation",
                            "clientId": "#userSelectedClient",
                            "contractId": "#userSelectedContract",
                            "route": "#repairUnitInfo.ROUTE",
                            "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                            "operationType": "MOVEINVENTORY",
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
                                  "key": "moveInventoryConfig",
                                  "data": "responseArray"
                                }
                              },
                              {
                                "type": "microservice",
                                "config": {
                                  "microserviceId": "getBCNinfo",
                                  "requestMethod": "get",
                                  "LocalService": "assets/Responses/getRequisitionStatus.json",
                                  "isLocal": false,
                                  "params": {
                                    "indicatorValue": item.serialNo,
                                    "indicatorType": "SerialNumber",
                                    "userName": "#loginUUID.username"
                                  }
                                },
                                "eventSource": "click",
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "getDellCarpredictiveUnitInfo",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "moveinventory",
                                          "requestMethod": "post",
                                          "body": {
                                            "apiUsageClientName": "#repairUnitInfo.CLIENTNAME",
                                            "apiUsageLocationName": "#repairUnitInfo.GEONAME",
                                            "callSource": "FrontEnd",
                                            "ip": "::1",
                                            "items": {
                                              "addtionalDetails": {
                                              },
                                              "destinationLocation": {
                                                "bin": "#moveInventoryConfig.bin",
                                                "geography": "#repairUnitInfo.GEONAME",
                                                "stockingLocation": "#moveInventoryConfig.destStkLocationName",
                                                "warehouse": "#moveInventoryConfig.wareHouseName"
                                              },
                                              "item": [
                                                {
                                                  "owner": "#repairUnitInfo.CLIENTNAME",
                                                  "partNo": item.partNo,
                                                  "quantity": "1",
                                                  "bcn": "#getDellCarpredictiveUnitInfo.0.itemBcn",
                                                  "serialNo": item.serialNo,
                                                  "condition": "Defective"
                                                }
                                              ],
                                              "notes": "#repairUnitInfo.ITEM_BCN",
                                              "sourceLocation": {
                                                "bin": "2BProcessed",
                                                "geography": "#discrepancyUnitInfo.GEONAME",
                                                "stockingLocation": "#moveInventoryConfig.srcStkLocationName",
                                                "warehouse": "#moveInventoryConfig.wareHouseName"
                                              }
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
                                                "type": "deleteComponent",
                                                "eventSource": "click",
                                                "config": {
                                                  "key": "#@"
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
                  },
                  {
                    "ctype": "button",
                    "color": "primary",
                    "text": "Complete",
                    "class": "primary-btn",
                    "uuid": "CompleteButtonUUID#@",
                    "parentuuid": "dellCarDebugRplUUID",
                    "visibility": true,
                    "disabled": true,
                    "type": "submit",
                    "tooltip": "",
                    "hooks": [],
                    "validations": [],
                    "actions": [
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
                              "bcn": "#repairUnitInfo.ITEM_BCN",
                              "actionCodeChangeList": {
                                "actionCodeChange": [
                                  {
                                    "defectCode": {
                                      "value": "#dellDebugRplDC"
                                    },
                                    "notes": item.partNo,
                                    "actionCode": "#dellDebugRplActionCode",
                                    "operation": "Add",
                                    "flexFieldList": {
                                      "flexField": [
                                        {
                                          "name": "Commodity",
                                          "codePath": "/-1/-1/",
                                          "value": "#dellDebugRplcommodity"
                                        }
                                      ]
                                    }
                                  }
                                ],
                              },
                              "defectCodeChangeList": {
                                "defectCodeChange": [
                                  {
                                    "defectCode": "#dellDebugRplDC",
                                    "operation": "Add",
                                    "notes": item.partNo,
                                    "flexFieldCodeList": {
                                      "flexFieldCode": [
                                        {
                                          "name": "Glowna Usterka",
                                          "codePath": "/-1/-1/",
                                          "value": "No"
                                        }
                                      ]
                                    }
                                  }
                                ],
                              },
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
                            {
                              "identifier": "flexField",
                              "valueField": "value",
                              "keyToBeRemoved": "flexFieldList"
                            }
                          ]
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "microservice",
                                "config": {
                                  "microserviceId": "performRemoveParts",
                                  "requestMethod": "post",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/getHPFAHistory.json",
                                  "body": {
                                    "removePartsRequest": {
                                      "bcn": "#repairUnitInfo.ITEM_BCN",
                                      "actionCodeChange": {
                                        "actionCode": "#dellDebugRplActionCode",
                                        "operation": "Add",
                                        "defectCode": {
                                          "value": "#dellDebugRplDC"
                                        }
                                      },
                                      "nonInventoryPartList": {
                                        "nonInventoryPart": [
                                          {
                                            "componentLocationDescription": "Atyrr567",
                                            "part": item.partNo,
                                            "quantity": "1",
                                            "flexFieldList": {
                                              "flexField": [
                                                {
                                                  "name": "Warranty",
                                                  "value": "IW"
                                                }
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    },
                                    "userPwd": {
                                      "password": "#loginUUID.password",
                                      "username": "#userAccountInfo.PersonalDetails.USERID"
                                    },
                                    "ip": "::1",
                                    "callSource": "FrontEnd",
                                    "apiUsage_LocationName": "#repairUnitInfo.GEONAME",
                                    "apiUsage_ClientName": "#repairUnitInfo.CLIENTNAME"
                                  },
                                  "toBeStringified": true
                                },
                                "eventSource": "click",
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "getBCNinfo",
                                          "requestMethod": "get",
                                          "LocalService": "assets/Responses/getRequisitionStatus.json",
                                          "isLocal": false,
                                          "params": {
                                            "indicatorValue": item.serialNo,
                                            "indicatorType": "SerialNumber",
                                            "userName": "#loginUUID.username"
                                          }
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "context",
                                                "config": {
                                                  "requestMethod": "add",
                                                  "key": "snInfo",
                                                  "data": "responseData"
                                                }
                                              },
                                              {
                                                "type": "microservice",
                                                "config": {
                                                  "microserviceId": "performIssueParts",
                                                  "requestMethod": "post",
                                                  "isLocal": false,
                                                  "LocalService": "assets/Responses/getHPFAHistory.json",
                                                  "body": {
                                                    "issuePartsRequest": {
                                                      "bcn": "#repairUnitInfo.ITEM_BCN",
                                                      "actionCodeChange": {
                                                        "actionCode": "#dellDebugRplActionCode",
                                                        "operation": "Add",
                                                        "defectCode": {
                                                          "value": "#dellDebugRplDC",
                                                        }
                                                      },
                                                      "bcnPartList": {
                                                        "bcnPart": [
                                                          {
                                                            "part": item.partNo,
                                                            "bcn": "#snInfo.0.itemBcn",
                                                            "serialNumber": item.serialNo,
                                                            "flexFieldList": {
                                                              "flexField": [
                                                                {
                                                                  "name": "Warranty",
                                                                  "value": "IW"
                                                                }
                                                              ]
                                                            }
                                                          }
                                                        ]
                                                      }
                                                    },
                                                    "userPwd": {
                                                      "username": "#userAccountInfo.PersonalDetails.USERID",
                                                      "password": "#loginUUID.password"
                                                    },
                                                    "ip": "::1",
                                                    "callSource": "FrontEnd",
                                                    "apiUsage_LocationName": "#discrepancyUnitInfo.GEONAME",
                                                    "apiUsage_ClientName": "#discrepancyUnitInfo.CLIENTNAME"
                                                  },
                                                  "toBeStringified": true,
                                                  "removeUndefinedFields": [
                                                    {
                                                      "KeyName": "serialNumber",
                                                      "KeyValue": item.serialNo
                                                    }
                                                  ]
                                                },
                                                "eventSource": "click",
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "microservice",
                                                        "config": {
                                                          "microserviceId": "getDellCarDebugHPFAHistory",
                                                          "requestMethod": "get",
                                                          "params": {
                                                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                            "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                            "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                                                            "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                                                            "locationId": "#userSelectedLocation"
                                                          },
                                                          "toBeStringified": true,
                                                          "isLocal": false,
                                                          "LocalService": "assets/Responses/mockHoldSubCode.json"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "key": "rplData",
                                                                  "data": "formData",
                                                                  "requestMethod": "add"
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "dellCarDebugService",
                                                                "methodType": "checkForNewlyAddedRPLItem",
                                                                "eventSource": "click",
                                                                "config": {
                                                                  "data": "getDellCarDebugHPFAHistory",
                                                                  "item": item,
                                                                  "action": action,
                                                                  "rplData": "rplData"
                                                                }
                                                              },
                                                              {
                                                                "type": "updatePrimaryFault",
                                                                "config": {}
                                                              },
                                                              {
                                                                "type": "deleteComponent",
                                                                "eventSource": "click",
                                                                "config": {
                                                                  "key": "dellCarDebugRplUUID#@"
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
                                                        "type": "context",
                                                        "config": {
                                                          "requestMethod": "add",
                                                          "key": "errorDisp",
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "condition",
                                                        "config": {
                                                          "operation": "isEqualTo",
                                                          "lhs": "#errorDisp",
                                                          "rhs": "No Record Found"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "updateComponent",
                                                                "config": {
                                                                  "key": "errorTitleUUID",
                                                                  "properties": {
                                                                    "titleValue": "#errorDisp",
                                                                    "isShown": false
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
                                                                  "key": "errorTitleUUID",
                                                                  "properties": {
                                                                    "titleValue": "#errorDisp",
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
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "context",
                                                "config": {
                                                  "requestMethod": "add",
                                                  "key": "performFAError",
                                                  "data": "responseData"
                                                }
                                              },
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "errorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#performFAError",
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
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "errorDisp",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#errorDisp",
                                          "rhs": "No Record Found"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "errorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorDisp",
                                                    "isShown": false
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
                                                  "key": "errorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "#errorDisp",
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
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "performFAError",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                    "titleValue": "#performFAError",
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
                ]
              }
            },
            "eventSource": "click"
          }
        )
      })
    }
    this.executeActions(actions, instance, actionService);
  }

  private checkForNewlyAddedRPLItem(action, instance, actionService) {
    let item = action.config.item;
    let x = this.contextService.getDataByKey(action.config.rplData);
    let actionCode = x.rplActionCode.displayValue;
    let defect = x.defectRpl.displayValue;
    let part = item.partNo;
    let existingOuterPanel = this.contextService.getDataByKey(defect + "uuid" + 'ref');
    let header = part + " " + defect + " " + actionCode
    let parentPanel = [
      {
        "type": "createComponent",
        "config": {
          "targetId": "pageUUID",
          "containerId": "prebodysectiontwo",
          "data": {
            "ctype": "addDefectTaskPanel",
            "uuid": defect + "uuid",
            "actions": [],
            "hooks": [],
            "header": {
              "title": defect
            },
            "expanded": false,
            "hideToggle": "true",
            "isKeepExpanded": false,
            "containerId": "prebodysection",
            "isBasedOnApiData": true,
            "visibility": true,
            "Togglehidden": true,
            "validations": [],
            "predictiveClass": "change-position-toolbar",
            "toolBarItems": [],
            "items": []
          },
        }
      }
    ]
    if (!existingOuterPanel) {
      this.executeActions(parentPanel, instance, actionService);
    }
    let actions = [
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
        "type": "createComponent",
        "config": {
          "targetId": defect + "uuid",
          "containerId": "expansionpanelcontent",
          "data": {
            "ctype": "taskPanel",
            "uuid": "dellCarDebugCreatedRPLTaskPanelUUID",
            "isyellowBorder": true,
            "uniqueUUID": true,
            "updateUUID": true,
            "title": "",
            "columnWiseTitle": true,
            "header": {
              "svgIcon": "replace",
              "iconClass": "active-header",
              "headerclass": "replaceheaderclass",
              "status": "",
              "statusIcon": "info_outline",
              "statusClass": "eco-icon"
            },
            "headerTitleLabels": [
              "Replace",
              "",
              "",
              ""
            ],
            "headerTitleValues": [
              header,
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
            "hooks": [
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getDellCarPartQuantity",
                  "requestMethod": "get",
                  "params": {
                    "partNumber": item.partNo,
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                  },
                  "toBeStringified": true,
                  "isLocal": false,
                  "LocalService": "assets/Responses/availableQuantity.json"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "dellCargetDellDebugRplStockQty",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "getDellDebugStockQty",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "dellCarDebugService",
                        "methodType": "updateStockQty",
                        "config": {
                          "data": "#dellCargetDellDebugRplStockQty",
                          "keyToUpdate": "dellCarDebugRplStockQty#@",
                          "isDisable": false
                        },
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
            "actions": [],
            "items": this.getRplItems(item, x),
            "rightItems": [
              {
                "ctype": "flexFields",
                "uuid": "dellCarDebugRplTableContentUUIDHeading",
                "visibility": true,
                "flexClass": "label-container-radio-group-parent-heading",
                "items": [
                  {
                    "ctype": "flexFields",
                    "uuid": "dellCarDebugRplTableUUID",
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
              },
              {
                "ctype": "flexFields",
                "uuid": "dellCarDebugRplTableContentUUID",
                "visibility": true,
                "flexClass": "label-container-radio-group-parent",
                "items": [
                  {
                    "ctype": "flexFields",
                    "uuid": "dellCarDebugRplQtyTableUUID#@",
                    "flexClass": "label-container-radio-group-grid-3",
                    "items": [
                      {
                        "ctype": "iconText",
                        "uuid": "sourceIconUUID#@",
                        "icon": 'shopping_cart',
                        "text": 'LDC',
                        "iconPosition": "after",
                        "textClass": "body greyish-black",
                        "inLine": true,
                        "iconClass": "dell-debug-source-icon"
                      },
                      {
                        "ctype": "dropdownWithSearch",
                        "uuid": "dellDebugQTYUUID",
                        "hooks": [
                        ],
                        "submitable": true,
                        "required": false,
                        "disabled": true,
                        "label": "",
                        "labelPosition": "left",
                        "name": "rplReplace" + "QTY",
                        "formGroupClass": "form-group-margin qty-width",
                        "dropdownClass": "qty-dropdwn textfield-container",
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
                        "uuid": "dellCarDebugRplStockQty#@",
                        "text": "",
                        "labelClass": "greyish-black cisco-stock"
                      }
                    ]
                  }
                ]
              }
            ],
            "footer": [
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
                "actions": []
              }
            ]
          }
        },
        "eventSource": "click"
      }
    ];

    this.executeActions(actions, instance, actionService);
  }

  getRplItems(item, x) {
    let currentData = {
      "actionCodeName": x.rplActionCode.displayValue,
      "defect": x.rplDefectCodeGroup.displayValue,
      "defectGroup": x.defectRpl.displayValue,
      "commodity": x.defectRp7.displayValue,
      "part": item.partNo
    }
    currentData["reqNotes"] = this.contextService.getDataByString("#dellDebugreplaceReqNotes");
    let items = [];
    let data = {
      "actionCodeName": "",
      "defect": "",
      "defectGroup": "",
      "commodity": "",
      "part": ""
    };
    for (let currentKey in data) {
      if (currentData[currentKey] !== undefined && currentData[currentKey] !== null) {
        data[currentKey] = currentData[currentKey];
      }
    }
    currentData = data;

    for (let currentKey in currentData) {
      if (currentKey === "actionCodeName" ||
        currentKey === "defect" ||
        currentKey === "commodity" ||
        currentKey === "part" ||
        currentKey === "reqNotes" || currentKey === "defectGroup") {

        let label = currentKey === "actionCodeName" ? "Action Code"
          : currentKey === "defect" ? "Defect"
            : currentKey === "commodity" ? "Commodity"
              : currentKey === "defectGroup" ? "Defect Group" :
                currentKey === "reqNotes" ? "Requisition Notes" : "Part";

        if (currentData[currentKey] !== undefined && currentData[currentKey] !== "") {
          items.push(this._addItem(label, currentData[currentKey]));

        }
      }
    }

    return items;
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
      "actionCode": item.actionId,
      "actionCodeName": item.actioncodename,
      "defect": item.defectCode,
      "defectName": item.defectCodeDesc,
      "qty": "1",
      "part": item.partNo,
      "partDetails": [{
        "partDescription": item.partDesc
      }],
      "partDescription": [{
        "partDescription": item.partDesc
      }],
      "commodity": item.commodity,
      "repairAction": item.repairAction,
      "repairActionName": item.repairAction,
      "primaryFaultStatus": item.mainIssue2 === "Yes" ? true : false,
      "actionId": item.actionId,
      "mainIssue2": item.mainIssue2
    };
    actionService.handleAction({
      "type": "dellCarDebugService",
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
    let getDellCarDebugHPFAHistory = this.contextService.getDataByKey(currentAction.config.data);
    let newlyCreatedItemActionId = "";
    let newlyCreatedItempartDesc;
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
    if (getDellCarDebugHPFAHistory && getDellCarDebugHPFAHistory.length > 0) {
      getDellCarDebugHPFAHistory.forEach((item) => {
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

      newlyCreatedItempartDesc = [{
        "partDescription": newItem.partDesc
      }]
    }
    this.contextService.addToContext("newHPFAHistory", newHPFAHistory);
    action.config.taskPanelData["actionId"] = newlyCreatedItemActionId;
    action.config.taskPanelData["partDescription"] = newlyCreatedItempartDesc;
    actionService.handleAction({
      "type": "dellCarDebugService",
      "methodType": "onClickOfCompleteButton",
      "config": {
        "action": action,
        "isLooperControlTask": false
      }
    }, instance);

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
        "microserviceId": "getDellCarDebugHPFAHistory",
        "requestMethod": "get",
        "params": {
          "itemId": "#discrepancyUnitInfo.ITEM_ID",
          "userName": "#userAccountInfo.PersonalDetails.USERID",
          "clientId": "#discrepancyUnitInfo.CLIENT_ID",
          "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
          "locationId": "#userSelectedLocation"
        },
        "toBeStringified": true,
        "isLocal": false,
        "LocalService": "assets/Responses/mockHoldSubCode.json"
      },
      "responseDependents": {
        "onSuccess": {
          "actions": []
        },
        "onFailure": {
          "actions": []
        }
      }
    }, instance);
  }

  primaryFaultCompleteActions(action, instance, actionService) {
    let currentPrimaryDetails = this.contextService.getDataByKey("currentPrimaryDetails");
    let existingFA = this.contextService.getDataByKey("existingFA");
    let getDellCarDebugHPFAHistory = this.contextService.getDataByKey("getDellCarDebugHPFAHistory");
    let existingLooperFA = false
    let actions;
    let partOcIndex
    let partOccurance;
    let filterData = []

    let exiPartOcIndex
    let exiPartOccurance;
    let exiFilterData = []

    getDellCarDebugHPFAHistory && getDellCarDebugHPFAHistory.map((item) => {
      if (item.glownaUsterka && item.glownaUsterka.toLowerCase() == "yes") {
        existingLooperFA = true;
        existingFA = item;
      }
    })

    //filter data by defect code (code to get the occurance);
    filterData = getDellCarDebugHPFAHistory.filter(e => e.defectCode === currentPrimaryDetails.defectCode);
    filterData = filterData && filterData.length == 1 ? filterData : filterData.sort((a, b) => a.actionId - b.actionId);
    partOcIndex = filterData.findIndex(e => e.actionId === currentPrimaryDetails.actionId);
    partOccurance = partOcIndex + 1;

    if (existingLooperFA) {

      exiFilterData = getDellCarDebugHPFAHistory.filter(e => e.defectCode === existingFA.defectCode);
      exiFilterData = exiFilterData && exiFilterData.length == 1 ? exiFilterData : exiFilterData.sort((a, b) => a.actionId - b.actionId);
      exiPartOcIndex = exiFilterData.findIndex(e => e.actionId === existingFA.actionId);
      exiPartOccurance = exiPartOcIndex + 1;

      actions = [
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
                        "occurrence": exiPartOccurance,
                        "value": existingFA.defectCode
                      },
                      "notes": existingFA.partNo,
                      "actionCode": existingFA.actioncodename,
                      "operation": "Update",
                      "flexFieldList": {
                        "flexField": [
                          {
                            "name": "Commodity",
                            "codePath": "/-1/-1/",
                            "value": existingFA.commodity
                          }
                        ]
                      }
                    }
                  ],
                },
                "defectCodeChangeList": {
                  "defectCodeChange": [
                    {
                      "defectCode": existingFA.defectCode,
                      "operation": "Update",
                      "occurrence": exiPartOccurance,
                      "notes": existingFA.partNo,
                      "flexFieldCodeList": {
                        "flexFieldCode": [
                          {
                            "name": "Glowna Usterka",
                            "codePath": "/-1/-1/",
                            "value": "No"
                          }
                        ]
                      }
                    }
                  ],
                },
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
              {
                "identifier": "flexField",
                "valueField": "value",
                "keyToBeRemoved": "flexFieldList"
              }
            ]
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
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
                                "occurrence": partOccurance,
                                "value": currentPrimaryDetails.defectCode
                              },
                              "notes": currentPrimaryDetails.partNo,
                              "actionCode": currentPrimaryDetails.actioncodename,
                              "operation": "Update",
                              "flexFieldList": {
                                "flexField": [
                                  {
                                    "name": "Commodity",
                                    "codePath": "/-1/-1/",
                                    "value": currentPrimaryDetails.commodity
                                  }
                                ]
                              }
                            }
                          ],
                        },
                        "defectCodeChangeList": {
                          "defectCodeChange": [
                            {
                              "defectCode": currentPrimaryDetails.defectCode,
                              "operation": "Update",
                              "occurrence": partOccurance,
                              "notes": currentPrimaryDetails.partNo,
                              "flexFieldCodeList": {
                                "flexFieldCode": [
                                  {
                                    "name": "Glowna Usterka",
                                    "codePath": "/-1/-1/",
                                    "value": "Yes"
                                  }
                                ]
                              }
                            }
                          ],
                        },
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
                      {
                        "identifier": "flexField",
                        "valueField": "value",
                        "keyToBeRemoved": "flexFieldList"
                      }
                    ]
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "microservice",
                          "config": {
                            "microserviceId": "getDellCarDebugHPFAHistory",
                            "requestMethod": "get",
                            "isLocal": false,
                            "LocalService": "assets/getCurrPrevRODetailsBySN.json",
                            "params": {
                              "itemId": "#discrepancyUnitInfo.ITEM_ID",
                              "userName": "#userAccountInfo.PersonalDetails.USERID",
                              "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                              "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                              "locationId": "#userSelectedLocation"
                            }
                          },
                          "hookType": "afterInit",
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "filterAndGetIndex",
                                  "hookType": "afterInit",
                                  "config": {
                                    "data": "#getDellCarDebugHPFAHistory",
                                    "objectKey": "glownaUsterka",
                                    "getValueBy": "Yes",
                                    "contextKey": "checkedData",
                                    "operation": "getIndex"
                                  }
                                },
                                {
                                  "type": "condition",
                                  "hookType": "afterInit",
                                  "config": {
                                    "operation": "isValid",
                                    "lhs": "#checkedData.glownaUsterka"
                                  },
                                  "responseDependents": {
                                    "onSuccess": {
                                      "actions": [
                                        {
                                          "type": "updateComponent",
                                          "eventSource": "click",
                                          "config": {
                                            "key": "dellCarDebugPrimaryFaultPanelUUID",
                                            "properties": {
                                              "expanded": false,
                                              "disabled": false,
                                              "taskPanelHeaderClass": "background-white",
                                              "header": {
                                                "title": "Primary Fault",
                                                "svgIcon": "description_icon",
                                                "statusIcon": "check_circle",
                                                "statusClass": "complete-status",
                                                "class": "complete-task",
                                                "iconClass": "complete-task"
                                              }
                                            }
                                          }
                                        }
                                      ]
                                    },
                                    "onFailure": {
                                      "actions": [
                                        {
                                          "type": "updateComponent",
                                          "eventSource": "click",
                                          "config": {
                                            "key": "dellCarDebugPrimaryFaultPanelUUID",
                                            "properties": {
                                              "expanded": false,
                                              "disabled": false,
                                              "header": {
                                                "title": "Primary Fault",
                                                "svgIcon": "description_icon",
                                                "iconClass": "active-header",
                                                "statusIcon": "hourglass_empty",
                                                "statusClass": "incomplete-status"
                                              }
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
                          "eventSource": "click",
                          "config": {
                            "key": "dellCarDebugPrimaryFaultPanelUUID",
                            "properties": {
                              "expanded": false,
                              "disabled": false,
                              "taskPanelHeaderClass": "background-white",
                              "header": {
                                "title": "Primary Fault",
                                "svgIcon": "description_icon",
                                "statusIcon": "check_circle",
                                "statusClass": "complete-status",
                                "class": "complete-task",
                                "iconClass": "complete-task"
                              }
                            }
                          }
                        },
                        {
                          "type": "updateComponent",
                          "eventSource": "click",
                          "config": {
                            "key": "dellCarPrimaryFaultCompleteUUID",
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
    }
    else {
      actions = [
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
                        "occurrence": partOccurance,
                        "value": currentPrimaryDetails.defectCode
                      },
                      "notes": currentPrimaryDetails.partNo,
                      "actionCode": currentPrimaryDetails.actioncodename,
                      "operation": "Update",
                      "flexFieldList": {
                        "flexField": [
                          {
                            "name": "Commodity",
                            "codePath": "/-1/-1/",
                            "value": currentPrimaryDetails.commodity
                          }
                        ]
                      }
                    }
                  ],
                },
                "defectCodeChangeList": {
                  "defectCodeChange": [
                    {
                      "defectCode": currentPrimaryDetails.defectCode,
                      "operation": "Update",
                      "occurrence": partOccurance,
                      "notes": currentPrimaryDetails.partNo,
                      "flexFieldCodeList": {
                        "flexFieldCode": [
                          {
                            "name": "Glowna Usterka",
                            "codePath": "/-1/-1/",
                            "value": "Yes"
                          }
                        ]
                      }
                    }
                  ],
                },
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
              {
                "identifier": "flexField",
                "valueField": "value",
                "keyToBeRemoved": "flexFieldList"
              }
            ]
          },
          "responseDependents": {
            "onSuccess": {
              "actions": [
                {
                  "type": "microservice",
                  "config": {
                    "microserviceId": "getDellCarDebugHPFAHistory",
                    "requestMethod": "get",
                    "isLocal": false,
                    "LocalService": "assets/getCurrPrevRODetailsBySN.json",
                    "params": {
                      "itemId": "#discrepancyUnitInfo.ITEM_ID",
                      "userName": "#userAccountInfo.PersonalDetails.USERID",
                      "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                      "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                      "locationId": "#userSelectedLocation"
                    }
                  },
                  "hookType": "afterInit",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "filterAndGetIndex",
                          "hookType": "afterInit",
                          "config": {
                            "data": "#getDellCarDebugHPFAHistory",
                            "objectKey": "glownaUsterka",
                            "getValueBy": "Yes",
                            "contextKey": "checkedData",
                            "operation": "getIndex"
                          }
                        },
                        {
                          "type": "condition",
                          "hookType": "afterInit",
                          "config": {
                            "operation": "isValid",
                            "lhs": "#checkedData.glownaUsterka"
                          },
                          "responseDependents": {
                            "onSuccess": {
                              "actions": [
                                {
                                  "type": "updateComponent",
                                  "eventSource": "click",
                                  "config": {
                                    "key": "dellCarDebugPrimaryFaultPanelUUID",
                                    "properties": {
                                      "expanded": false,
                                      "disabled": false,
                                      "taskPanelHeaderClass": "background-white",
                                      "header": {
                                        "title": "Primary Fault",
                                        "svgIcon": "description_icon",
                                        "statusIcon": "check_circle",
                                        "statusClass": "complete-status",
                                        "class": "complete-task",
                                        "iconClass": "complete-task"
                                      }
                                    }
                                  }
                                }
                              ]
                            },
                            "onFailure": {
                              "actions": [
                                {
                                  "type": "updateComponent",
                                  "eventSource": "click",
                                  "config": {
                                    "key": "dellCarDebugPrimaryFaultPanelUUID",
                                    "properties": {
                                      "expanded": false,
                                      "disabled": false,
                                      "header": {
                                        "title": "Primary Fault",
                                        "svgIcon": "description_icon",
                                        "iconClass": "active-header",
                                        "statusIcon": "hourglass_empty",
                                        "statusClass": "incomplete-status"
                                      }
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
                  "eventSource": "click",
                  "config": {
                    "key": "dellCarDebugPrimaryFaultPanelUUID",
                    "properties": {
                      "expanded": false,
                      "disabled": false,
                      "taskPanelHeaderClass": "background-white",
                      "header": {
                        "title": "Primary Fault",
                        "svgIcon": "description_icon",
                        "statusIcon": "check_circle",
                        "statusClass": "complete-status",
                        "class": "complete-task",
                        "iconClass": "complete-task"
                      }
                    }
                  }
                },
                {
                  "type": "updateComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "dellCarPrimaryFaultCompleteUUID",
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
    this.executeActions(actions, instance, actionService);
  }

  TimeOutPrimaryFaultArraydata(action, instance, actionService) {
    let primaryFaultdata = this.contextService.getDataByKey("getDellCarDebugHPFAHistory");
    let arrayempty = [];
    primaryFaultdata && primaryFaultdata.map(item => {
      let obj = {
        "defectCode": item.defectCode,
        "primaryFault": item.glownaUsterka?.toUpperCase()
      }
      arrayempty.push(obj);
    })
    this.contextService.addToContext("arrayempty", arrayempty);
  }
  triggerDataFormation(action) {
    let data = this.contextService.getDataByKey("getDellCarDebugHPFAHistory");
    let key = action.config.key;
    let arr = [];
    data && data.map((item) => {
      arr.push(item[key]);
    })
    this.contextService.addToContext(key + "Array", arr);
  }
  //For Duplicate pop-up
  duplicatePartNumberSelected(action, instance, actionService) {
    let partNumber = this.contextService.getDataByKey("getDellCarDebugHPFAHistory");

    partNumber && partNumber.forEach((ele, index) => {
      let dupCount = partNumber && partNumber.filter((ele1) => ele1.partNo === ele.partNo).length;
      ele["status"] = (!ele.partNo || dupCount < 2) ? false : true;
    });
    let dupData = partNumber && partNumber.filter((ele1) => ele1.status == true);
    if (dupData && dupData.length) {
      actionService.handleAction({
        "type": "dialog",
        "uuid": "primaryFaultDialogUUID",
        "config": {
          "minimumWidth": false,
          "maximumwidth": false,
          "width": "45vw",
          "title": "Duplicate Part Numbers Selected",
          "items": [
            {
              "ctype": "label",
              "text": "Confirm that the duplicate parts listed bellow are needed before timeout.",
              "labelClass": " greyish-black body-italic p-0"
            },
            {
              "type": "updateDuplicatePartPopup",
              "config": {}
            },
            {
              "ctype": "duplicatePartNumberSelected",
              "uuid": "dellCarDuplicatePartNumbers",
              "dataSource": dupData,
              "actions": []
            }
          ],
          "footer": [
            {
              "ctype": "button",
              "color": "primary",
              "text": "Close",
              "uuid": "closeButtonUUID",
              "closeType": "close",
              "inputClass": "close-button primary-close",
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
              "uuid": "donePrimaryFaultUUID",
              "dialogButton": true,
              "visibility": true,
              "disabled": false,
              "type": "submit",
              "closeType": "success",
              "hooks": [],
              "validations": [],
              "actions": []
            }
          ]
        },
        "eventSource": "click",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "dellCarPrimaryFaultRoFormData",
                  "data": "formData"
                }
              },
              {
                "type": "condition",
                "eventSource": "click",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#selectedResultcode",
                  "rhs": "PASS"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "dellCarDebugService",
                        "methodType": "isReplacePart",
                        "eventSource": "click"
                      },
                      {
                        "type": "condition",
                        "eventSource": "click",
                        "config": {
                          "operation": "isValid",
                          "lhs": "#isReplacePartValid"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "getStockQuantity",
                                "eventSource": "click",
                                "config": {
                                  "data": "#getDellCarDebugHPFAHistory"
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
                                  "key": "errorDisp",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                    "titleValue": "No Replace Part Available",
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
                              "notes": "#timoutNotesFormat",
                              "resultCode": "#selectedResultcode",
                              "workCenterFlexFieldList": {
                                "flexField": [
                                  {
                                    "name": "User Password",
                                    "value": "#dellCarCustomerPswFormData.customerPsw"
                                  },
                                  {
                                    "name": "RAM No.1",
                                    "value": "#submittableRamCapacityFormData"
                                  },
                                  {
                                    "name": "HDD No.1 CAP",
                                    "value": "#submittableHddCapacityFormData"
                                  },
                                  {
                                    "name": "HDD SN No.1",
                                    "value": "#submittableHddSerialNumberFormData"
                                  },
                                  {
                                    "name": "KB backlight",
                                    "value": "#dellCarKeyBoardFormdata.dellCarKeyboardToggle"
                                  },
                                  {
                                    "name": "Chassis Opened?",
                                    "value": "#dellCarChassisFormdata.dellCarChassisToggle"
                                  },
                                  {
                                    "name": "Computer Tested",
                                    "value": "#computerTestedSubmittableData"
                                  },
                                  {
                                    "name": "DEBUG CID IW",
                                    "value": "#dellCarCIDWarrantyFormData.DamageInwarranty"
                                  },
                                  {
                                    "name": "RTC Reset",
                                    "value": "#dellCarRTCFormData.wasRTCReset"
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
                          "removeUndefinedFields": [
                            {
                              "KeyName": "notes",
                              "KeyValue": "#timoutNotesFormat"
                            }
                          ],
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
                                "type": "dellCarDebugService",
                                "methodType": "dellCarTimeoutAction",
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
      })
    }
    else {
      actionService.handleAction({

        "type": "condition",
        "eventSource": "click",
        "config": {
          "operation": "isEqualTo",
          "lhs": "#selectedResultcode",
          "rhs": "PASS"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "dellCarDebugService",
                "methodType": "isReplacePart",
                "eventSource": "click"
              },
              {
                "type": "condition",
                "eventSource": "click",
                "config": {
                  "operation": "isValid",
                  "lhs": "#isReplacePartValid"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "getStockQuantity",
                        "eventSource": "click",
                        "config": {
                          "data": "#getDellCarDebugHPFAHistory"
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
                          "key": "errorDisp",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "No Replace Part Available",
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
                      "notes": "#timoutNotesFormat",
                      "resultCode": "#selectedResultcode",
                      "workCenterFlexFieldList": {
                        "flexField": [
                          {
                            "name": "User Password",
                            "value": "#dellCarCustomerPswFormData.customerPsw"
                          },
                          {
                            "name": "RAM No.1",
                            "value": "#submittableRamCapacityFormData"
                          },
                          {
                            "name": "HDD No.1 CAP",
                            "value": "#submittableHddCapacityFormData"
                          },
                          {
                            "name": "HDD SN No.1",
                            "value": "#submittableHddSerialNumberFormData"
                          },
                          {
                            "name": "KB backlight",
                            "value": "#dellCarKeyBoardFormdata.dellCarKeyboardToggle"
                          },
                          {
                            "name": "Chassis Opened?",
                            "value": "#dellCarChassisFormdata.dellCarChassisToggle"
                          },
                          {
                            "name": "Computer Tested",
                            "value": "#computerTestedSubmittableData"
                          },
                          {
                            "name": "DEBUG CID IW",
                            "value": "#dellCarCIDWarrantyFormData.DamageInwarranty"
                          },
                          {
                            "name": "RTC Reset",
                            "value": "#dellCarRTCFormData.wasRTCReset"
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
                  "removeUndefinedFields": [
                    {
                      "KeyName": "notes",
                      "KeyValue": "#timoutNotesFormat"
                    }
                  ],
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
                        "type": "dellCarDebugService",
                        "methodType": "dellCarTimeoutAction",
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
      })
    }
    this.contextService.addToContext("dupCount", dupData);
  }

  //For PA Popup StockQuantity APi
  getStockQuantity(action: any, instance: any, actionService: any) {
    let stockQty = [];
    let unitHpFaData = this.contextService.getDataByString(action.config.data);
    let unitData = unitHpFaData.filter(ele => ele.partNo);
    unitData && unitData.forEach(element => {
      let part = element.partNo;
      let obj = {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "getDellCarPartQuantity",
          "isLocal": false,
          "requestMethod": "get",
          "params": {
            "partNumber": part,
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
                  "key": "getDellCarPartQuantity",
                  "data": "responseData"
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
                  "key": "errorDisp",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#errorDisp",
                    "isShown": false
                  }
                }
              }
            ]
          }
        }
      }
      stockQty.push(obj);
    });
    this.combinelatestApirequestPAPopup(stockQty, actionService, instance);
  }

  afterCombineStockQuantity(action, actionService, instance) {
    let Actions = [];
    Actions = [{
      "type": "updatePaPopup",
      "config": {}
    },
    {
      "type": "dialog",
      "uuid": "dellDebugPADialogUUID",
      "config": {
        "minimumWidth": false,
        "width": "600px",
        "title": "Timeout to PA",
        "items": [
          {
            "ctype": "label",
            "text": "PA result code selected, unit placed on Awaiting part Hold.",
            "labelClass": "pb-3 body-italic text-secondary"
          },
          {
            "ctype": "dellCarPATable",
            "eventSource": "click",
            "afterAction": []
          },
          {
            "ctype": "flexFields",
            "uuid": "ciscoDescriptiontextFlexUUID",
            "flexClass": "d-flex mt-4",
            "items": [
              {
                "ctype": "label",
                "text": "Hold Location",
                "labelClass": "pb-3 font-bold"
              },
              {
                "ctype": "label",
                "text": "Local Hold -",
                "labelClass": "pb-3 ml-5"
              },
              {
                "ctype": "label",
                "text": "#dellMsg.text",
                "labelClass": "#dellMsg.class"
              }
            ]
          }
        ],
        "footer": [
          {
            "ctype": "button",
            "color": "primary",
            "text": "Close",
            "uuid": "cancelHoldUUID",
            "closeType": "close",
            "inputClass": "close-button",
            "disableClose": true,
            "visibility": true,
            "disabled": false,
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
            "uuid": "doneaddnoteUUID",
            "disableClose": true,
            "dialogButton": true,
            "visibility": true,
            "disabled": true,
            "type": "submit",
            "closeType": "success",
            "hooks": [],
            "validations": [],
            "actions": []
          }
        ]
      },
      "eventSource": "click",
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "context",
              "config": {
                "key": "timeoutNotes",
                "data": "formData",
                "requestMethod": "add",
                "value": "addNote"
              },
              "eventSource": "click"
            },
            {
              "type": "microservice",
              "eventSource": "click",
              "config": {
                "microserviceId": "performTimeOut",
                "requestMethod": "post",
                "isLocal": false,
                "LocalService": "assets/Responses/mockHoldSubCode.json",
                "body": {
                  "timeOutRequest": {
                    "location": "#discrepancyUnitInfo.GEONAME",
                    "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                    "workCenter": "#discrepancyUnitInfo.WORKCENTER",
                    "password": "#loginUUID.password",
                    "notes": "#timoutNotesFormat",
                    "resultCode": "#selectedResultcode",
                    "workCenterFlexFieldList": {
                      "flexField": [
                        {
                          "name": "User Password",
                          "value": "#dellCarCustomerPswFormData.customerPsw"
                        },
                        {
                          "name": "RAM No.1",
                          "value": "#submittableRamCapacityFormData"
                        },
                        {
                          "name": "HDD No.1 CAP",
                          "value": "#submittableHddCapacityFormData"
                        },
                        {
                          "name": "HDD SN No.1",
                          "value": "#submittableHddSerialNumberFormData"
                        },
                        {
                          "name": "KB backlight",
                          "value": "#dellCarKeyBoardFormdata.dellCarKeyboardToggle"
                        },
                        {
                          "name": "Chassis Opened?",
                          "value": "#dellCarChassisFormdata.dellCarChassisToggle"
                        },
                        {
                          "name": "Computer Tested",
                          "value": "#computerTestedSubmittableData"
                        },
                        {
                          "name": "DEBUG CID IW",
                          "value": "#dellCarCIDWarrantyFormData.DamageInwarranty"
                        },
                        {
                          "name": "RTC Reset",
                          "value": "#dellCarRTCFormData.wasRTCReset"
                        }
                      ]
                    }
                  },
                  "timeOutType": "ProcessImmediate",
                  "clientName": "#discrepancyUnitInfo.CLIENTNAME",
                  "contractName": "#discrepancyUnitInfo.CONTRACTNAME",
                  "userName": "#userAccountInfo.PersonalDetails.USERID",
                  "userPass": "#loginUUID.password",
                  "ip": "::1",
                  "callSource": "FrontEnd",
                  "apiUsage_LocationName": "#discrepancyUnitInfo.GEONAME",
                  "apiUsage_ClientName": "#discrepancyUnitInfo.CLIENTNAME"
                },
                "toBeStringified": true,
                "removeUndefinedFields": [
                  {
                    "KeyName": "notes",
                    "KeyValue": "#timoutNotesFormat"
                  }
                ],
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
                      "type": "microservice",
                      "config": {
                        "microserviceId": "getUnitInfo",
                        "isLocal": false,
                        "LocalService": "./assets/Responses/getUnitInfo.json",
                        "requestMethod": "get",
                        "params": {
                          "unitIdentificationValue": "#dellCarSearchCriteriaData.unitIdentificationValue",
                          "identificatorType": "#dellCarSearchCriteriaData.identificatorType",
                          "locationId": "#userSelectedLocation",
                          "clientId": "#userSelectedClient",
                          "contractId": "#userSelectedContract"
                        }
                      },
                      "eventSource": "click",
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "context",
                              "eventSource": "click",
                              "config": {
                                "requestMethod": "add",
                                "key": "getUnitInfoData",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "condition",
                              "eventSource": "click",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#getUnitInfoData.STATUS",
                                "rhs": "Time Out"
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "microservice",
                                      "config": {
                                        "microserviceId": "performTimeIn",
                                        "requestMethod": "post",
                                        "body": {
                                          "timeInRequest": {
                                            "workCenter": "#discrepancyUnitInfo.DESTINATIONWC",
                                            "location": "#discrepancyUnitInfo.GEONAME",
                                            "part": "#discrepancyUnitInfo.PART_NO",
                                            "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                            "serialNumber": "#discrepancyUnitInfo.SERIAL_NO",
                                            "password": "#loginUUID.password"
                                          },
                                          "SesCustomer": 1,
                                          "userName": "#loginUUID.username",
                                          "userPass": "#loginUUID.password",
                                          "ip": "::1",
                                          "callSource": "FrontEnd",
                                          "apiUsage_LocationName": "#discrepancyUnitInfo.GEONAME",
                                          "apiUsage_ClientName": "#discrepancyUnitInfo.CLIENTNAME"
                                        },
                                        "toBeStringified": true
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "microservice",
                                              "eventSource": "click",
                                              "config": {
                                                "microserviceId": "getDellCARCustomDetails",
                                                "requestMethod": "get",
                                                "isLocal": false,
                                                "LocalService": "assets/Responses/last-note.json",
                                                "params": {
                                                  "identificatorType": "BINBYLOGIN",
                                                  "userName": "#userAccountInfo.PersonalDetails.USERID"
                                                }
                                              },
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
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
                                                              "comments": "AWAITING_PARTS",
                                                              "fixedAssetTag": "#discrepancyUnitInfo.FAT",
                                                              "storageHoldCode": "Awaiting Part",
                                                              "storageHoldSubCode": "#submittablePartNumberData"
                                                            },
                                                            "destinationLocation": {
                                                              "bin": "#getDellCARCustomDetails.0",
                                                              "geography": "#discrepancyUnitInfo.GEONAME",
                                                              "stockingLocation": "#getDellCarHoldSubcode.destStkLocationName",
                                                              "warehouse": "#getDellCarHoldSubcode.wareHouseName"
                                                            },
                                                            "item": [
                                                              {
                                                                "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                                                "owner": "#discrepancyUnitInfo.CLIENTNAME",
                                                                "partNo": "#discrepancyUnitInfo.PART_NO",
                                                                "quantity": "1",
                                                                "serialNo": "#discrepancyUnitInfo.SERIAL_NO",
                                                                "condition": "Defective"
                                                              }
                                                            ],
                                                            "notes": "#getUnitInfoData.ITEM_BCN",
                                                            "sourceLocation": {
                                                              "bin": "#getDellCarHoldSubcode.bin",
                                                              "geography": "#discrepancyUnitInfo.GEONAME",
                                                              "stockingLocation": "#getDellCarHoldSubcode.srcStkLocationName",
                                                              "warehouse": "#getDellCarHoldSubcode.wareHouseName"
                                                            }
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
                                                              "type": "dellCarDebugService",
                                                              "methodType": "dellCarTimeoutAction",
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
                                                                "key": "errorTitleUUID",
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
                                },
                                "onFailure": {
                                  "actions": [
                                    {
                                      "type": "microservice",
                                      "eventSource": "click",
                                      "config": {
                                        "microserviceId": "getDellCARCustomDetails",
                                        "requestMethod": "get",
                                        "isLocal": false,
                                        "LocalService": "assets/Responses/last-note.json",
                                        "params": {
                                          "identificatorType": "BINBYLOGIN",
                                          "userName": "#userAccountInfo.PersonalDetails.USERID"
                                        }
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
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
                                                      "comments": "AWAITING_PARTS",
                                                      "fixedAssetTag": "#discrepancyUnitInfo.FAT",
                                                      "storageHoldCode": "Awaiting Part",
                                                      "storageHoldSubCode": "#submittablePartNumberData"
                                                    },
                                                    "destinationLocation": {
                                                      "bin": "#getDellCARCustomDetails.0",
                                                      "geography": "#discrepancyUnitInfo.GEONAME",
                                                      "stockingLocation": "#getDellCarHoldSubcode.destStkLocationName",
                                                      "warehouse": "#getDellCarHoldSubcode.wareHouseName"
                                                    },
                                                    "item": [
                                                      {
                                                        "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                                        "owner": "#discrepancyUnitInfo.CLIENTNAME",
                                                        "partNo": "#discrepancyUnitInfo.PART_NO",
                                                        "quantity": "1",
                                                        "serialNo": "#discrepancyUnitInfo.SERIAL_NO",
                                                        "condition": "Defective"
                                                      }
                                                    ],
                                                    "notes": "#getUnitInfoData.ITEM_BCN",
                                                    "sourceLocation": {
                                                      "bin": "#getDellCarHoldSubcode.bin",
                                                      "geography": "#discrepancyUnitInfo.GEONAME",
                                                      "stockingLocation": "#getDellCarHoldSubcode.srcStkLocationName",
                                                      "warehouse": "#getDellCarHoldSubcode.wareHouseName"
                                                    }
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
                                                      "type": "dellCarDebugService",
                                                      "methodType": "dellCarTimeoutAction",
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
                                                        "key": "errorTitleUUID",
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
                        "type": "errorRenderTemplate"
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
          "actions": []
        }
      }
    }
    ]
    Actions.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }
  //For PA Popup 
  combinelatestApirequestPAPopup(apiList, actionService, instance) {
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
    let stockData = [];
    let UpdatedHpFaHistoryData = [];
    let responseCount = 0;

    forkJoin(microServiceList).subscribe((response) => {
      response.map((result: any, index) => {
        if (result.status) {
          let stockQtyData = result.data.stockQty;
          stockData.push(stockQtyData);
          let hpFAData = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
          let hpFAHistoryData = hpFAData && hpFAData.filter(ele => ele.partNo);
          let hpFACount = 0;
          hpFAHistoryData && hpFAHistoryData.map(item => {
            if (responseCount == hpFACount) {
              item.stockQty = stockData[responseCount];
              UpdatedHpFaHistoryData.push(item);
            }
            hpFACount = hpFACount + 1;
          })
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
        responseCount = responseCount + 1;
      })
      this.contextService.addToContext("dellCarItemData", UpdatedHpFaHistoryData);
      this.afterCombineStockQuantity(null, actionService, instance);
    });
  }

  isReplacePart(action, instance, actionService) {
    let getDebugHPFAHistory = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");

    if (getDebugHPFAHistory == null) {
      getDebugHPFAHistory = [];
    }
    let partNumberData = [];

    // part Number Array
    getDebugHPFAHistory?.forEach((element) => {
      if (element.partNo) {
        partNumberData.push(element.partNo);
      }
    });
    this.contextService.addToContext('partNumberSeperatedSemicolon', partNumberData.join(';'));

    // is part number is valid or not
    let isReplacePartValid = getDebugHPFAHistory.find(element => {
      if (element.partNo) {
        return true; // stop searching
      }
    });
    this.contextService.addToContext("isReplacePartValid", isReplacePartValid);
  }

  getComputerTestedData(action, instance, actionService) {
    let computerTestedData = this.contextService.getDataByString("#dellCarTestType.testType");
    if (computerTestedData && computerTestedData.code) {
      computerTestedData = computerTestedData.code;
    }
    this.contextService.addToContext('computerTestedSubmittableData', computerTestedData);
  }

  cnlTypeCheck() {
    let dellCARCNLTimeOut = this.contextService.getDataByKey("dellCARCNLTimeOut");
    let cnlType = typeof dellCARCNLTimeOut
    console.log(cnlType);
    this.contextService.addToContext("cnlType", cnlType);
  }

  cnlNextTriggers(actionService) {
    actionService.handleAction(
      {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "rpidtrigger",
          "isLocal": false,
          "LocalService": "assets/Responses/stopProcessReceivingMockData.json",
          "requestMethod": "post",
          "body": {
            "locationId": "#userSelectedLocation",
            "clientId": "#discrepancyUnitInfo.CLIENT_ID",
            "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
            "itemId": "#discrepancyUnitInfo.ITEM_ID",
            "userName": "#userAccountInfo.PersonalDetails.USERID",
            "partNo": "#discrepancyUnitInfo.PART_NO"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "rpidtrigger",
                  "data": "responseData"
                }
              },
              {
                "type": "microservice",
                "eventSource": "click",
                "config": {
                  "microserviceId": "rcSurTimeOutTrigger",
                  "isLocal": false,
                  "LocalService": "assets/Responses/mockHoldSubCode.json",
                  "requestMethod": "post",
                  "body": {
                    "resultCode": "#selectedResultcode",
                    "identificatorType": "WIP_QTY",
                    "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                    "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                    "surMbStatus": "#rcSurTrigger.SUR_MB_STATUS"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "rcSurTimeOutTrigger",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "microservice",
                        "eventSource": "click",
                        "config": {
                          "microserviceId": "dellCARTrigger3Seq",
                          "requestMethod": "get",
                          "params": {
                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                            "username": "#userAccountInfo.PersonalDetails.USERID"
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "dellCARTrigger3Seq",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "microservice",
                                "eventSource": "click",
                                "config": {
                                  "microserviceId": "surUniversalTimeOut",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/stopProcessReceivingMockData.json",
                                  "requestMethod": "post",
                                  "body": {
                                    "resultCode": "#selectedResultcode",
                                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                                    "triggerName": "Trigger_SUR_Universal",
                                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                    "locationId": "#userSelectedLocation",
                                    "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                                    "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                                    "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                    "routeName": "IRMA",
                                    "partNumber": "#discrepancyUnitInfo.PART_NO"
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
                                          "key": "surUniversalTimeOut",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "microservice",
                                        "eventSource": "click",
                                        "config": {
                                          "microserviceId": "blankDcTrigger",
                                          "requestMethod": "post",
                                          "body": {
                                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                            "userName": "#userAccountInfo.PersonalDetails.USERID",
                                            "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                            "locationId": "#userSelectedLocation",
                                            "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                                            "contractId": "#discrepancyUnitInfo.CONTRACT_ID"
                                          }
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "microservice",
                                                "eventSource": "click",
                                                "config": {
                                                  "microserviceId": "gradeTimeOutTrigger",
                                                  "requestMethod": "post",
                                                  "body": {
                                                    "partNumber": "#discrepancyUnitInfo.PART_NO",
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
                                                          "key": "gradeTimeOutTrigger",
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "microservice",
                                                        "eventSource": "click",
                                                        "config": {
                                                          "microserviceId": "partsTrigger",
                                                          "isLocal": false,
                                                          "LocalService": "assets/Responses/stopProcessReceivingMockData.json",
                                                          "requestMethod": "post",
                                                          "body": {
                                                            "locationId": "#userSelectedLocation",
                                                            "triggerName": "Trigger_PARTS",
                                                            "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                                                            "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                                                            "partNumber": "#discrepancyUnitInfo.PART_NO",
                                                            "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                                            "routeName": "#discrepancyUnitInfo.ROUTE",
                                                            "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                            "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                            "resultCode": "#selectedResultcode"
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
                                                                  "key": "partsTrigger",
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "dellCarDebugService",
                                                                "methodType": "duplicatePartNumberSelected",
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
    );

  }

  dellCarTimeoutAction(action: any, instance: any, actionService: any) {
    let partNumberData = [];
    let getDebugHPFAHistory = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");

    let commonAction = [
      {
        "type": "clearScreenData",
        "eventSource": "click"
      },
      {
        "type": "renderTemplate",
        "config": {
          "templateId": "dashboard.json",
          "mode": "local"
        }
      }
    ];
    let updatePartQtyInDellCarDebugApi;

    if (getDebugHPFAHistory == null) {
      getDebugHPFAHistory = [];
    }

    getDebugHPFAHistory?.forEach((element) => {
      if (element.partNo) {
        partNumberData.push(element.partNo);
      }
    });

    this.contextService.addToContext('partNumberSeperatedComma', partNumberData.join(','));

    updatePartQtyInDellCarDebugApi = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "updatePartQtyInDellCarDebug",
          "requestMethod": "post",
          "body": {
            "partNo": "#partNumberSeperatedComma",
            "userName": "#loginUUID.username"
          },
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": commonAction
          },
          "onFailure": {
            "actions": commonAction
          }
        },
        "eventSource": "click"
      }
    ];

    if (partNumberData.length > 0) {
      updatePartQtyInDellCarDebugApi.forEach((element) => {
        actionService.handleAction(element, instance)
      })
    } else {
      commonAction.forEach((element) => {
        actionService.handleAction(element, instance)
      })
    }
  }

  private dellCarTimeoutNotes(action: any, instance: any, actionService: any) {
    let getDebugHPFAHistory = this.contextService.getDataByString("#getDellCarDebugHPFAHistory");
    let userNotes = this.contextService.getDataByString("#repairAssessmentimeoutNotes.addNote");
    let timeoutNoteStr = "";

    if (getDebugHPFAHistory == null) {
      getDebugHPFAHistory = [];
    }
    let partNumberData = [];
    if (userNotes) {
      userNotes = userNotes;
    } else {
      userNotes = "";
    }

    getDebugHPFAHistory?.forEach((element) => {
      if (element.partNo) {
        let loc, partno, commodity, dftcode, entry;
        loc = "IW";
        partno = element.partNo;
        commodity = element.commodity;
        dftcode = element.defectCode;

        entry = loc + ": " + partno + " - " + commodity + " (" + dftcode + ")";
        partNumberData.push(entry);
      }
    });

    console.log(partNumberData);

    if (partNumberData && partNumberData.length > 0) {
      timeoutNoteStr = partNumberData.join("; ") + "; || " + userNotes;
    } else {
      timeoutNoteStr = userNotes;
    }
    console.log(timeoutNoteStr);

    this.contextService.addToContext('timoutNotesFormat', timeoutNoteStr);
  }

  private dellCarAlternetPart(action: any, instance: any, actionService: any) {
    let getPartQty, getAltPart, partKey;

    partKey = action.config.partKey;
    getPartQty = this.contextService.getDataByString(action.config.selectedPartQty);
    getAltPart = this.contextService.getDataByString(action.config.altPartResp);
    // getAltPart = {stockValue: "15", partNumber: "08D3F"}; // just for testing the functionality. 
    let updateQtyAction = [
      {
        "type": "updateComponent",
        "eventSource": "change",
        "config": {
          "key": "dellCarDebugTableContentUUID",
          "properties": {
            "visibility": true,
            "flexClass": "label-container-radio-group-parent"
          }
        }
      },
      {
        "type": "dellCarDebugService",
        "methodType": "updateStockQty",
        "config": {
          "data": "#getDellCarPartQuantity",
          "keyToUpdate": "dellCarDebugStockQty",
          "isDisable": false
        }
      }
    ]

    if (getAltPart?.stockValue
      && getAltPart?.partNumber
      && getAltPart?.stockValue != null
      && getAltPart?.partNumber != null
      && getAltPart?.stockValue != 0) {
      console.log(action, partKey, getPartQty, getAltPart);
      let updteAltPartAndQty = [
        {
          "type": "context",
          "config": {
            "requestMethod": "add",
            "key": partKey,
            "data": getAltPart?.partNumber
          }
        },
        {
          "type": "updateComponent",
          "eventSource": "change",
          "config": {
            "key": "dellCarDebugTableContentUUID",
            "properties": {
              "visibility": true,
              "flexClass": "label-container-radio-group-parent"
            }
          }
        },
        {
          "type": "dellCarDebugService",
          "methodType": "updateStockQty",
          "config": {
            "data": { "stockQty": getAltPart?.stockValue + " Alt"},
            "keyToUpdate": "dellCarDebugStockQty",
            "isDisable": false
          }
        }
      ];
      updteAltPartAndQty.forEach(element => {
        actionService.handleAction(element);
      });

    } else {
      updateQtyAction.forEach(element => {
        actionService.handleAction(element);
      });
    }
  }
}