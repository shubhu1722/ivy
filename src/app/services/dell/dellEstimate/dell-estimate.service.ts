import { Injectable } from '@angular/core';
import { ComponentService } from '../../commonServices/componentService/component.service';
import { ContextService } from '../../commonServices/contextService/context.service';
import { UtilityService } from '../../../utilities/utility.service';

@Injectable({
  providedIn: 'root'
})
export class DellEstimateService {

  constructor(private contextService: ContextService,
    private componentService: ComponentService,
    private utiliyService: UtilityService) { }

  handleDellEstimateActions(action: any, instance: any, actionService: any) {
    switch (action.methodType) {
      //   case 'handleDellEstimateProcessActions':
      //     this.handleDellEstimateProcessActions(action, instance, actionService)
      //     break;
      //   case 'onClickOfCompleteButton':
      //     this._onClickOfCompleteButton(action, instance, actionService)
      //     break;
      case 'createLopperTasks':
        this._createLopperTasks(action, instance, actionService)
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
      case 'updateReplaceIconStatus':
        this.updateReplaceIconStatus(action, instance, actionService)
        break;
        default: 
          //statements; 
          break;
    }
  }

  private _transactionsOnClickOfComplete(action: any, instance: any, actionService: any) {
    let taskPanelData;


    taskPanelData = {
      "actionCode": this.contextService.getDataByString("#dellEstimateActionCode"),
      "actionCodeName": this.contextService.getDataByString("#dellEstimateActionCodeName"),
      "defect": this.contextService.getDataByString("#dellEstimateDefectCode"),
      "defectName": this.contextService.getDataByString("#dellEstimateDefectCodeName"),
      "qty": this.contextService.getDataByString("#dellEstimatePartQty"),
      "part": this.contextService.getDataByString("#dellEstimatePart"),
      "damageType": this.contextService.getDataByString("#dellEstimateDamageType"),
      "damageTypeName": this.contextService.getDataByString("#dellEstimateDamageTypeName")
    };
    action.config["taskPanelData"] = taskPanelData;
    let transactions = [
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
            "ownerName": "#userSelectedClientName",
            "ConditionName": "Refurbish"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "getPartModelAndWarrentyDetails",
                  "requestMethod": "get",
                  "params": {
                    "locationId": "#discrepancyUnitInfo.LOCATION_ID",
                    "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                    "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                    "reforderId": "#ROByBCNForDiscrepancy",
                    "partNumber": action.config.taskPanelData.part,
                    "userName": "#userAccountInfo.PersonalDetails.USERID"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "condition",
                        "hookType": "afterInit",
                        "config": {
                          "operation": "isValid",
                          "lhs": "#getPartModelAndWarrentyDetails.PRODUCT_SUBCLASS"
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
                                              "value": action.config.taskPanelData.defect
                                            },
                                            "notes": action.config.taskPanelData.part,
                                            "actionCode": action.config.taskPanelData.actionCodeName,
                                            // "actionCode": "DRR",
                                            "operation": "Add"
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
                                    }
                                  ]
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "performRemovePartsRework",
                                          "requestMethod": "post",
                                          "body": {
                                            "removePartsRequest": {
                                              "bcn": "#repairUnitInfo.ITEM_BCN",
                                              "actionCodeChange": {
                                                "actionCode": action.config.taskPanelData.actionCodeName,
                                                "operation": "Add",
                                                "defectCode": {
                                                  "value": action.config.taskPanelData.defect
                                                }
                                              },
                                              "nonInventoryPartList": {
                                                "nonInventoryPart": [
                                                  {
                                                    "part": action.config.taskPanelData.part,
                                                    "quantity": action.config.taskPanelData.qty,
                                                    "flexFieldList": {
                                                      "flexField": [
                                                        {
                                                          "name": "DAMAGE TYPE",
                                                          "value": action.config.taskPanelData.damageType
                                                        }
                                                      ]
                                                    }
                                                  }
                                                ]
                                              }
                                            },
                                            "userPwd": {
                                              "username": "#loginUUID.username",
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
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "dellEstimationResultCodesUUID",
                                                  "properties": {
                                                    "disabled": true
                                                  }
                                                }
                                              },
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "dellEstimationTimeoutButtonUUID",
                                                  "properties": {
                                                    "disabled": true
                                                  }
                                                }
                                              },
                                              {
                                                "type": "updateComponent",
                                                "eventSource": "click",
                                                "config": {
                                                  "key": "dellEstimateReplaceTask",
                                                  "properties": {
                                                    "disabled": false
                                                  }
                                                }
                                              },
                                              {
                                                "type": "deleteComponent",
                                                "eventSource": "click",
                                                "config": {
                                                  "key": "dellEstimateTaskPanelUUID"
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
                                                      "svgIcon": "replace",
                                                      "iconClass": "active-header",
                                                      "headerclass": "replaceheaderclass",
                                                      "status": "",
                                                      "statusIcon": "info_outline",
                                                      "statusClass": "eco-icon"
                                                    },
                                                    "headerTitleLabels": [
                                                      "Required Estimate Information - ",
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
                                                    "hooks": [
                                                      {
                                                        "type": "handleDellEstimateActions",
                                                        "methodType": "updateReplaceIconStatus",
                                                        "hookType": "afterInit",
                                                        "iconStatus": true
                                                      }
                                                    ],
                                                    "validations": [],
                                                    "actions": [],
                                                    "items": [
                                                      {
                                                        "ctype": "flexFields",
                                                        "uuid": "dellDebugFailCodeTitleUUID",
                                                        "flexClass": "cisco-debug-label-container-30-50",
                                                        "items": [
                                                          {
                                                            "ctype": "label",
                                                            "text": "Action Code",
                                                            "labelClass": "greyish-black subtitle1-align-self"
                                                          },
                                                          {
                                                            "ctype": "label",
                                                            "text": action.config.taskPanelData.actionCodeName,
                                                            "labelClass": "greyish-black"
                                                          }
                                                        ]
                                                      },
                                                      {
                                                        "ctype": "flexFields",
                                                        "uuid": "dellDebugFailCodeTitleUUID",
                                                        "flexClass": "cisco-debug-label-container-30-50",
                                                        "items": [
                                                          {
                                                            "ctype": "label",
                                                            "text": "Defect",
                                                            "labelClass": "greyish-black subtitle1-align-self"
                                                          },
                                                          {
                                                            "ctype": "label",
                                                            "text": action.config.taskPanelData.defectName,
                                                            "labelClass": "greyish-black"
                                                          }
                                                        ]
                                                      },
                                                      {
                                                        "ctype": "flexFields",
                                                        "uuid": "dellDebugFailCodeTitleUUID",
                                                        "flexClass": "cisco-debug-label-container-30-50",
                                                        "items": [
                                                          {
                                                            "ctype": "label",
                                                            "text": "Part",
                                                            "labelClass": "greyish-black subtitle1-align-self"
                                                          },
                                                          {
                                                            "ctype": "label",
                                                            "text": action.config.taskPanelData.part,
                                                            "labelClass": "greyish-black"
                                                          }
                                                        ]
                                                      },
                                                      {
                                                        "ctype": "flexFields",
                                                        "uuid": "dellDebugFailCodeTitleUUID",
                                                        "flexClass": "cisco-debug-label-container-30-50",
                                                        "items": [
                                                          {
                                                            "ctype": "label",
                                                            "text": "Quantity",
                                                            "labelClass": "greyish-black subtitle1-align-self"
                                                          },
                                                          {
                                                            "ctype": "label",
                                                            "text": action.config.taskPanelData.qty,
                                                            "labelClass": "greyish-black"
                                                          }
                                                        ]
                                                      }
                                                    ],
                                                    "rightItems": [
                                                      {
                                                        "ctype": "flexFields",
                                                        "uuid": "dellDebugFailCodeTitleUUID",
                                                        "flexClass": "cisco-debug-label-container-30-50",
                                                        "items": [
                                                          {
                                                            "ctype": "label",
                                                            "text": "Damage Type",
                                                            "labelClass": "greyish-black subtitle1-align-self"
                                                          },
                                                          {
                                                            "ctype": "label",
                                                            "text": action.config.taskPanelData.damageType,
                                                            "labelClass": "greyish-black"
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
                                      },
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "dellEstimationResultCodesUUID",
                                          "properties": {
                                            "disabled": true
                                          }
                                        }
                                      },
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "dellEstimationTimeoutButtonUUID",
                                          "properties": {
                                            "disabled": true
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
                                  "key": "isPartData",
                                  "data": "Subclass is missing"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                    "titleValue": "#isPartData",
                                    "isShown": true
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
                      },
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "handleCommonServices",
                        "config": {
                          "type": "errorRenderTemplate",
                          "contextKey": "errorPartWarranty",
                          "updateKey": "searchCriteriaErrorTitleUUID"
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
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "isPartData",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#isPartData",
                    "isShown": true
                  }
                },
                "eventSource": "click"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellBlindReveivingPartNumberUUID",
                  "properties": {
                    "disabled": false,
                    "readonly": false
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
      
    ];

    /// Checking for the process type and filetering the services to
    /// be called


    this.executeActions(transactions, instance, actionService);
  }

  executeActions(actions, instance, actionService) {
    actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  addIndexesToDefectCodes(action, instance, actionService) {
    let defectCodes = this.contextService.getDataByKey(action.config.data)
    if (defectCodes !== null && defectCodes !== undefined) {
      defectCodes.forEach((element, index) => {
        defectCodes[index]["unqNumber"] = index;
      });
    }
    this.contextService.addToContext("getdellEstimateDefect", defectCodes);
    actionService.handleAction({
      "type": "updateComponent",
      "config": {
        "key": "dellEstimateDefectUUID",
        "dropDownProperties": {
          "options": defectCodes
        }
      }
    }, instance)
  }

  updateDefectBasedOnUnqNumber(action, instance, actionService) {
    let defects = this.contextService.getDataByString(action.config.defects);
    let unqNumber = this.contextService.getDataByString(action.config.selectedUnqNumber);
    defects.forEach((element) => {
      if (element.unqNumber.toString() === unqNumber) {
        this.contextService.addToContext("dellEstimateDefectCode", element.defectCode);
      }
    });
  }

  _createLopperTasks(action, instance, actionService) {
    let looperData = this.contextService.getDataByKey("getDellEstimateHPFAHistory");
    let actionCodes = this.contextService.getDataByKey("getdellEstimateActionCode");
    let estimateHistory = this.contextService.getDataByKey("estimateItemHistoryData");

    let flag = false;
    console.log(looperData, actionCodes);
    looperData && looperData.map((item) => {
      actionCodes && actionCodes.map((obj) => {
        item.qty = "1";
        if (item.actionCode == obj.actonCodesAbbreviation) {
        
          actionService.handleAction(
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
                    "svgIcon": "replace",
                    "iconClass": "active-header",
                    "headerclass": "replaceheaderclass",
                    "status": "",
                    "statusIcon": "info_outline",
                    "statusClass": "eco-icon"
                  },
                  "headerTitleLabels": [
                    "Required Estimate Information - ",
                    "",
                    "",
                    ""
                  ],
                  "headerTitleValues": [
                    item.defectCodeDesc,
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
                  "hooks": [],
                  "validations": [],
                  "actions": [],
                  "items": [
                    {
                      "ctype": "flexFields",
                      "uuid": "dellDebugFailCodeTitleUUID",
                      "flexClass": "cisco-debug-label-container-30-50",
                      "items": [
                        {
                          "ctype": "label",
                          "text": "Action Code",
                          "labelClass": "greyish-black subtitle1-align-self"
                        },
                        {
                          "ctype": "label",
                          "text": item.actionCodeDesc,
                          "labelClass": "greyish-black"
                        }
                      ]
                    },
                    {
                      "ctype": "flexFields",
                      "uuid": "dellDebugFailCodeTitleUUID",
                      "flexClass": "cisco-debug-label-container-30-50",
                      "items": [
                        {
                          "ctype": "label",
                          "text": "Defect",
                          "labelClass": "greyish-black subtitle1-align-self"
                        },
                        {
                          "ctype": "label",
                          "text": item.defectCodeDesc,
                          "labelClass": "greyish-black"
                        }
                      ]
                    },
                    {
                      "ctype": "flexFields",
                      "uuid": "dellDebugFailCodeTitleUUID",
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
                          "labelClass": "greyish-black"
                        }
                      ]
                    },
                    {
                      "ctype": "flexFields",
                      "uuid": "dellDebugFailCodeTitleUUID",
                      "flexClass": "cisco-debug-label-container-30-50",
                      "items": [
                        {
                          "ctype": "label",
                          "text": "Quantity",
                          "labelClass": "greyish-black subtitle1-align-self"
                        },
                        {
                          "ctype": "label",
                          "text": item.qty,
                          "labelClass": "greyish-black"
                        }
                      ]
                    }
                  ],
                  "rightItems": [
                    {
                      "ctype": "flexFields",
                      "uuid": "dellDebugFailCodeTitleUUID",
                      "flexClass": "cisco-debug-label-container-30-50",
                      "items": [
                        {
                          "ctype": "label",
                          "text": "Damage Type",
                          "labelClass": "greyish-black subtitle1-align-self"
                        },
                        {
                          "ctype": "label",
                          "text": item.damageType,
                          "labelClass": "greyish-black"
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
                  ]
                }
              },
              "eventSource": "click"
            }, instance)

          if (!flag) {
            // estimateHistory && estimateHistory.map((currentItem) => {
              flag = true;
            //   if (currentItem.workCenterName === 'DELL_AIO_ESTIMATE' && currentItem.orderItemOperName === "Place on hold") {
           let actions = [];
            if (this.contextService.estimateReplaceStatus) {
              actions = [
                {
                  "type": "updateComponent",
                  "config": {
                    "key": "dellEstimationTimeoutButtonUUID",
                    "properties": {
                      "disabled": this.contextService.estimateReplaceStatus
                    }
                  }
                },
                {
                  "type": "disableComponent",
                  "config": {
                    "key": "dellEstimationResultCodesUUID",
                    "property": "ResultCodes",
                    "isNotReset":true
                  }
                }
              ];
            }
            actions.push({
              "type": "updateComponent",
              "config": {
                "key": "dellEstimateReplaceTask",
                "properties": {
                  "disabled": !this.contextService.estimateReplaceStatus
                }
              }
            });
            actions.forEach((eachAction) => {
              actionService.handleAction(
                eachAction, instance
              );
            })

            //   }
            // })
          }
        }
      })
    })
  }

  updateReplaceIconStatus(action: any, instance: any, actionService: any) {
    this.contextService.estimateReplaceStatus = action.iconStatus;
  }
}