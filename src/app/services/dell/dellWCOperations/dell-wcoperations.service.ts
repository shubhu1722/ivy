import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/utilities/utility.service';
import { cloneDeep } from 'lodash';
import { ContextService } from '../../commonServices/contextService/context.service';
import { DELLAIOWORKCENTERS } from '../../../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class DellWCOperationsService {

  constructor(
    private contextService: ContextService,
    private utilityService: UtilityService
  ) { }

  handleDellTimeInActions(actionData, instance, actionService, responseData?: any) {
    /// Deep cloning so that old values are cleared
    const action = cloneDeep(actionData);

    this.timeInMicroServices(action, instance, actionService);

  }

  timeInMicroServices(action, instance, actionService) {
    let timeInMicroServices = {
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
              "config": {
                "microserviceId": "getUnitInfo",
                "requestMethod": "get",
                "params": {
                  "unitIdentificationValue": "#dellSearchCriteriaData.unitIdentificationValue",
                  "identificatorType": "#dellSearchCriteriaData.identificatorTypeForUnit",
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
                      "config": {
                        "requestMethod": "add",
                        "key": "discrepancyUnitInfo",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "repairUnitInfo",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "condition",
                      "config": {
                          "operation": "isEqualTo",
                          "lhs": "#discrepancyUnitInfo.ONHOLD",
                          "rhs": "0"
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions":[
                            {
                              "type": "microservice",
                              "hookType": "afterInit",
                              "config": {
                                  "microserviceId": "stopProcessClientReceiving",
                                  "requestMethod": "post",
                                  "body": {
                                  "actionType": "PwcPerformTimeOut",
                                  "subActionTypeName": "addBcnLabel",
                                  "geoId": "#discrepancyUnitInfo.LOCATION_ID",
                                  "partNumber": "#discrepancyUnitInfo.PART_NO",
                                  "userLoginId": "#userAccountInfo.PersonalDetails.USERID",
                                  "locationId": "#discrepancyUnitInfo.LOCATION_ID",
                                  "clientId": "#userSelectedClient",
                                  "contractId": "#userSelectedContract",
                                  "orderProcessType": "#repairUnitInfo.ROUTE",
                                  "clientName": "#repairUnitInfo.CLIENTNAME",
                                  "serialNo": "#repairUnitInfo.SERIAL_NO",
                                  "contractName": "#repairUnitInfo.CONTRACTNAME",
                                  "revisionLevel": "",
                                  "selectedResultCode": "[ALL]",
                                  "workCenter": "#discrepancyUnitInfo.WORKCENTER",
                                  "timeOutTab": "",
                                  "geographyNumber": "#userSelectedLocationName",
                                  "loaderName": "#locationDependentFFIDDetails.loaderName",
                                  "pwcXml": {
                                      "timeOutTab": {
                                      "selectedResultCode": "[ALL]"
                                      },
                                      "flexFieldDefinitionList": [
                                      {
                                          "ffName": "msgRead",
                                          "ffId": "#locationDependentFFIDDetails.msgRead",
                                          "ffValue": "No"
                                      }
                                      ],
                                      "ffvalueList": [
                                      {
                                          "ffName": "msgRead",
                                          "ffId": "#locationDependentFFIDDetails.msgRead",
                                          "ffValue": "No"
                                      }
                                      ]
                                  },
                                  "referenceOrderNumber": "#refId",
                                  "outboundOrderId": "",
                                  "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                  "workOrderId": "#repairUnitInfo.WORKORDER_ID",
                                  "itemId": "#repairUnitInfo.ITEM_ID",
                                  "flexFieldList": [
                                      {
                                      "ffId": "#locationDependentFFIDDetails.msgRead",
                                      "ffName": "msgRead",
                                      "ffValue": "No"
                                      }
                                  ],
                                  "wcOperation": "WC Operation"
                                  },
                                  "toBeStringified": true
                              },
                              "responseDependents":{
                                "onSuccess": {
                                  "actions":[
                                      {
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "specialMessageData",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "commonDellWCOperations",
                                        "config": {
                                          "discrepancyUnitInfo": "#discrepancyUnitInfo"
                                        }
                                      }
                                  ]
                                },
                                "onFailure": {
                                  "actions":[
                                    {
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "stopErrorMsg",
                                          "data": "responseData"
                                        }
                                    },
                                    {
                                    "type": "handleCommonServices",
                                    "config": {
                                        "type": "errorRenderTemplate",
                                        "contextKey": "stopErrorMsg",
                                        "updateKey": "searchCriteriaErrorTitleUUID"
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
                                "key": "titleError",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "searchCriteriaErrorTitleUUID",
                                "properties": {
                                  "titleValue": "#titleError",
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
                        "key": "titleError",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "searchCriteriaErrorTitleUUID",
                        "properties": {
                          "titleValue": "#titleError",
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
                "key": "timeinError",
                "data": "responseData"
              }
            },
            {
              "type": "updateComponent",
              "config": {
                "key": "searchCriteriaErrorTitleUUID",
                "properties": {
                  "titleValue": "#timeinError",
                  "isShown": true
                }
              }
            }
          ]
        }
      }
    };

    actionService.handleAction(timeInMicroServices, instance);

  }

  commonActions(action, instance, actionService) {

    let commonActions = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "getROByBCN",
          "requestMethod": "get",
          "params": {
            "userName": "#userAccountInfo.PersonalDetails.USERID",
            "itemBCN": "#discrepancyUnitInfo.ITEM_BCN"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "ROByBCNForDiscrepancy",
                  "data": "responseData"
                }
              },
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getJsonReponse",
                  "requestMethod": "get",
                  "isLocal": false,
                  "LocalService": "assets/Responses/getsaveAndExitData.json",
                  "params": {
                    "itemId": "#discrepancyUnitInfo.ITEM_ID"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "getSaveAndExitData",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "getDataFromSaveAndExit"
                      },
                      {
                        "type": "screenLevelOperation"
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
                          "key": "searchCriteriaErrorTitleUUID",
                          "properties": {
                            "titleValue": "#errorDisp",
                            "isShown": false
                          }
                        }
                      },
                      {
                        "type": "screenLevelOperation"
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
                "type": "updateComponent",
                "config": {
                  "key": "searchCriteriaErrorTitleUUID",
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
    ];

    commonActions.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }

  releaseActions(action, instance, actionService) {    
    let releaseActions = [{
      "type": "microservice",
      "config": {
        "microserviceId": "getROByBCN",
        "requestMethod": "get",
        "params": {
          "userName": "#userAccountInfo.PersonalDetails.USERID",
          "itemBCN": "#discrepancyUnitInfo.ITEM_BCN"
        }
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "ROByBCNForDiscrepancy",
                "data": "responseData"
              }
            },
            {

              "type": "microservice",
              "hookType": "afterInit",
              "config": {
                "microserviceId": "getJsonReponse",
                "requestMethod": "get",
                "isLocal": false,
                "LocalService": "assets/Responses/getsaveAndExitData.json",
                "params": {
                  "itemId": "#discrepancyUnitInfo.ITEM_ID"
                }
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "getSaveAndExitData",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "getDataFromSaveAndExit"
                    },
                    {
                      "type": "screenLevelOperation"
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
                        "key": "searchCriteriaErrorTitleUUID",
                        "properties": {
                          "titleValue": "#errorDisp",
                          "isShown": false
                        }
                      }
                    },
                    {
                      "type": "screenLevelOperation"
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
              "type": "updateComponent",
              "config": {
                "key": "searchCriteriaErrorTitleUUID",
                "properties": {
                  "titleValue": "#errorDisp",
                  "isShown": true
                }
              }
            }
          ]
        }
      }
    }];

    releaseActions.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }

   // Menifest Dell Screens 
  async dellRenderCurrentScreenMenu(action, instance, actionService) {
    let arr = this.contextService.getDataByKey("menuItems");
    let currentMenu = arr && arr.find(x => x.completed === false);
    let commonActions = [];
    let isPrDebug = await this.checkIfPrDebug();
    if (currentMenu) {
      if (currentMenu.name == "ASSESSMENT") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dellRepairAssessment.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "ECN") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dell-repairECNScreen.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "DEBUG") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": isPrDebug ? "dell_debug_pr.json" : "dell_debug.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "DEBUG_ARC") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": isPrDebug ? "dell_debug_arc_pr.json" : "dell_debug_arc.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "L2_DEBUG") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": isPrDebug ? "dell_L2_debug_pr.json" : "L2_Debug.json",
            "mode": "local"
          }
        }]
      } else {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dellRepairAssessment.json",
            "mode": "local"
          }
        }]
      }
    } else {
      commonActions = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "dellRepairAssessment.json",
          "mode": "local"
        }
      }]
    }
    commonActions.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }

  handleScreenLevelOperation(action, instance, actionService) {
    let dellScreenLevelOperation = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "getRoffByRo",
          "isLocal": false,
          "LocalService": "assets/Responses/dellROLeftNavData.json",
          "requestMethod": "get",
          "params": {
            "userName": "#loginUUID.username",
            "refernceOrderById": "#ROByBCNForDiscrepancy"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "topLeftHeaderData",
                  "data": "responseData"
                }
              },
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "dellReceiptDate",
                  "isLocal": false,
                  "LocalService": "assets/Responses/dellReceiptDateData.json",
                  "requestMethod": "get",
                  "params": {
                    "locationId": "#discrepancyUnitInfo.LOCATION_ID",
                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                    "referenceOrderId": "#ROByBCNForDiscrepancy"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "receiptDateForDiscrepancy",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "dateFormat",
                        "config": {
                          "format": "dd MMM, yyy",
                          "dateKey": "localDateTime",
                          "targetKey": "tat",
                          "source": "#receiptDateForDiscrepancy"
                        }
                      },
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
                                  "key": "discrepancyPartAndWarrantyDetails",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "microservice",
                                "config": {
                                  "microserviceId": "getResultCodeForDiscrepancy",
                                  "requestMethod": "get",
                                  "params": {
                                    "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                    "validateResult": 0
                                  },
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/dellResultCodeSample.json"
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
                                      },
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs" : "#discrepancyUnitInfo.WORKCENTER",
                                          "rhs" : "DELL_AIO_VMI"
                                        },
                                        "eventSource": "onblur",
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": []
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "microservice",
                                                "config": {
                                                  "microserviceId": "getstorageholdsubcode",
                                                  "requestMethod": "get",
                                                  "params": {
                                                    "locationId": "#discrepancyUnitInfo.LOCATION_ID",
                                                    "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                                                    "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                                                    "route": "#discrepancyUnitInfo.ROUTE",
                                                    "username": "#userAccountInfo.PersonalDetails.USERID",
                                                    "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                                    "operationType": "HOLD"
                                                  },
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
                                                          "key": "holdCodesForDiscrepancy",
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
                                                          "key": "holdCodesForDiscrepancy",
                                                          "data": []
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
                                          "lhs": "#discrepancyUnitInfo.ROUTE_ID"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "condition",
                                                "config": {
                                                  "operation": "isValid",
                                                  "lhs": "#discrepancyUnitInfo.WORKCENTER_ID"
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "microservice",
                                                        "config": {
                                                          "microserviceId": "getSubProcessMenu",
                                                          "requestMethod": "get",
                                                          "params": {
                                                            "userId": "#loginUUID.username",
                                                            "locationId": "#userSelectedLocation",
                                                            "clientId": "#userSelectedClient",
                                                            "contractId": "#userSelectedContract",
                                                            "wcId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                                            "optId": "#discrepancyUnitInfo.ROUTE_ID",
                                                            "btt": "",
                                                            "whId": "#discrepancyUnitInfo.WAREHOUSE_ID",
                                                            "operationType": "#userSelectedSubProcessType",
                                                            "workCenterName": "#discrepancyUnitInfo.WORKCENTER"
                                                          },
                                                          "isLocal": false,
                                                          "LocalService": "assets/Responses/getSubProcessMenu.json"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "SubprocessMenu",
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "condition",
                                                                "config": {
                                                                  "operation": "isEqualTo",
                                                                  "lhs": "#SubprocessMenu.0.name",
                                                                  "rhs": "REPAIR"
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions":[
                                                                      {
                                                                        "type": "filterDellDebugSubmenuData",
                                                                        "config": {
                                                                          "key": "SubprocessMenu",
                                                                          "unitKey": "discrepancyUnitInfo",
                                                                          "processDataKey":"getProcessWCData"
                                                                        }
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                "type": "findMatchingElement",
                                                                "config": {
                                                                  "key": "wcSubprocess",
                                                                  "compareWith": "#discrepancyUnitInfo.WORKCENTER",
                                                                  "searchProperty": "wcName",
                                                                  "returnProperty": "subProcess",
                                                                  "data": "#getProcessWCData.subProcess.WCOperation"
                                                                }
                                                              },
                                                              {
                                                                "type": "microservice",
                                                                "config": {
                                                                  "microserviceId": "getTimeInDetails",
                                                                  "requestMethod": "get",
                                                                  "params": {
                                                                    "workCenterName": "#discrepancyUnitInfo.WORKCENTER",
                                                                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                                    "locationId": "#discrepancyUnitInfo.LOCATION_ID"
                                                                  }
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "updateComponent",
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
                                                                          "key": "getTimeInDetailsResp",
                                                                          "data": "responseData"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "microservice",
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "microserviceId": "getLastNote",
                                                                          "requestMethod": "get",
                                                                          "params": {
                                                                            "username": "#loginUUID.username",
                                                                            "workcenter-id": "#repairUnitInfo.WORKCENTER_ID",
                                                                            "itemId": "#repairUnitInfo.ITEM_ID"
                                                                          }
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "lastNoteForBCN",
                                                                                  "data": "responseData"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "wcRenderAction",
                                                                                "config": {
                                                                                  "wc": "#discrepancyUnitInfo.WORKCENTER"
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
                                                                                  "key": "lastNoteForBCN",
                                                                                  "data": ""
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "wcRenderAction",
                                                                                "config": {
                                                                                  "wc": "#discrepancyUnitInfo.WORKCENTER"
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
                                                                          "contextKey": "getTimeInDetailsResp",
                                                                          "updateKey": "searchCriteriaErrorTitleUUID"
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
                                                                  "contextKey": "errorSubProcessMenu",
                                                                  "updateKey": "searchCriteriaErrorTitleUUID"
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
                                                          "key": "searchCriteriaErrorTitleUUID",
                                                          "properties": {
                                                            "titleValue": "WorkCenter Is Not Assigned",
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
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "Order Process Type Is Empty",
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
                                          "contextKey": "errorResultCode",
                                          "updateKey": "searchCriteriaErrorTitleUUID"
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
                                  "contextKey": "errorPartWarranty",
                                  "updateKey": "searchCriteriaErrorTitleUUID"
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
                          "contextKey": "errorDellReceipt",
                          "updateKey": "searchCriteriaErrorTitleUUID"
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
                  "key": "topLeftHeaderData",
                  "data": "responseData"
                }
              },
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "dellReceiptDate",
                  "isLocal": false,
                  "LocalService": "assets/Responses/dellReceiptDateData.json",
                  "requestMethod": "get",
                  "params": {
                    "locationId": "#discrepancyUnitInfo.LOCATION_ID",
                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                    "referenceOrderId": "#ROByBCNForDiscrepancy"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "receiptDateForDiscrepancy",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "dateFormat",
                        "config": {
                          "format": "dd MMM, yyy",
                          "dateKey": "localDateTime",
                          "targetKey": "tat",
                          "source": "#receiptDateForDiscrepancy"
                        }
                      },
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
                                  "key": "discrepancyPartAndWarrantyDetails",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "microservice",
                                "config": {
                                  "microserviceId": "getResultCodeForDiscrepancy",
                                  "requestMethod": "get",
                                  "params": {
                                    "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                    "validateResult": 0
                                  },
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/dellResultCodeSample.json"
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
                                      },
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs" : "#discrepancyUnitInfo.WORKCENTER",
                                          "rhs" : "DELL_AIO_VMI"
                                        },
                                        "eventSource": "onblur",
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": []
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "microservice",
                                                "config": {
                                                  "microserviceId": "getstorageholdsubcode",
                                                  "requestMethod": "get",
                                                  "params": {
                                                    "locationId": "#discrepancyUnitInfo.LOCATION_ID",
                                                    "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                                                    "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                                                    "route": "#discrepancyUnitInfo.ROUTE",
                                                    "username": "#userAccountInfo.PersonalDetails.USERID",
                                                    "workCenterId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                                    "operationType": "HOLD"
                                                  },
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
                                                          "key": "holdCodesForDiscrepancy",
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "arraySetMethod",
                                                        "config": {
                                                          "data": "#holdCodesForDiscrepancy",
                                                          "contextKey": "filteredHoldTypes"
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
                                                          "key": "holdCodesForDiscrepancy",
                                                          "data": []
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
                                          "lhs": "#discrepancyUnitInfo.ROUTE_ID"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "condition",
                                                "config": {
                                                  "operation": "isValid",
                                                  "lhs": "#discrepancyUnitInfo.WORKCENTER_ID"
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "microservice",
                                                        "config": {
                                                          "microserviceId": "getSubProcessMenu",
                                                          "requestMethod": "get",
                                                          "params": {
                                                            "userId": "#loginUUID.username",
                                                            "locationId": "#userSelectedLocation",
                                                            "clientId": "#userSelectedClient",
                                                            "contractId": "#userSelectedContract",
                                                            "wcId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                                            "optId": "#discrepancyUnitInfo.ROUTE_ID",
                                                            "btt": "",
                                                            "whId": "#discrepancyUnitInfo.WAREHOUSE_ID",
                                                            "operationType": "#userSelectedSubProcessType",
                                                            "workCenterName": "#discrepancyUnitInfo.WORKCENTER"
                                                          },
                                                          "isLocal": false,
                                                          "LocalService": "assets/Responses/getSubProcessMenu.json"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "SubprocessMenu",
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "findMatchingElement",
                                                                "config": {
                                                                  "key": "wcSubprocess",
                                                                  "compareWith": "#discrepancyUnitInfo.WORKCENTER",
                                                                  "searchProperty": "wcName",
                                                                  "returnProperty": "subProcess",
                                                                  "data": "#getProcessWCData.subProcess.WCOperation"
                                                                }
                                                              },
                                                              {
                                                                "type": "microservice",
                                                                "config": {
                                                                  "microserviceId": "getTimeInDetails",
                                                                  "requestMethod": "get",
                                                                  "params": {
                                                                    "workCenterName": "#discrepancyUnitInfo.WORKCENTER",
                                                                    "itemId": "#discrepancyUnitInfo.ITEM_ID",
                                                                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                                    "locationId": "#discrepancyUnitInfo.LOCATION_ID"
                                                                  }
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "updateComponent",
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
                                                                          "key": "getTimeInDetailsResp",
                                                                          "data": "responseData"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "microservice",
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "microserviceId": "lastNote",
                                                                          "requestMethod": "get",
                                                                          "params": {
                                                                            "username": "#loginUUID.username",
                                                                            "workcenter-id": "#repairUnitInfo.WORKCENTER_ID",
                                                                            "itemId": "#repairUnitInfo.ITEM_ID"
                                                                          }
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "lastNoteForBCN",
                                                                                  "data": "responseData"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "wcRenderAction",
                                                                                "config": {
                                                                                  "wc": "#discrepancyUnitInfo.WORKCENTER"
                                                                                }
                                                                              }
                                                                            ]
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "wcRenderAction",
                                                                                "config": {
                                                                                  "wc": "#discrepancyUnitInfo.WORKCENTER"
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
                                                                          "contextKey": "getTimeInDetailsResp",
                                                                          "updateKey": "searchCriteriaErrorTitleUUID"
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
                                                                  "contextKey": "errorSubProcessMenu",
                                                                  "updateKey": "searchCriteriaErrorTitleUUID"
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
                                                          "key": "searchCriteriaErrorTitleUUID",
                                                          "properties": {
                                                            "titleValue": "WorkCenter Is Not Assigned",
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
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "Order Process Type Is Empty",
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
                                          "contextKey": "errorResultCode",
                                          "updateKey": "searchCriteriaErrorTitleUUID"
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
                                  "contextKey": "errorPartWarranty",
                                  "updateKey": "searchCriteriaErrorTitleUUID"
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
                          "contextKey": "errorDellReceipt",
                          "updateKey": "searchCriteriaErrorTitleUUID"
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

    dellScreenLevelOperation.forEach((element) => {
      actionService.handleAction(element, instance)
    });
  }

  handleGetLocationSpecificFFID(action, instance, actionService) {
    let discrepancyUnitInfo = this.contextService.getDataByString("#discrepancyUnitInfo");
    let wc = discrepancyUnitInfo.WORKCENTER;
    let route = discrepancyUnitInfo.ROUTE;
    let contractName = discrepancyUnitInfo.CONTRACTNAME;
    let isDellAio = false;
    if (contractName && DELLAIOWORKCENTERS.CONTRACTNAMES[contractName]) {
      isDellAio = true;
    }
    if (this.utilityService.isString(action.config.data) && action.config.data.startsWith('#')) {
      let processData = this.contextService.getDataByString(action.config.data);
      let locationName;
      let foundObj;
      let extractedObj = {};
      if (action.config.location !== undefined) {
        locationName = this.contextService.getDataByString(action.config.location);
      }
      if (processData) {
        foundObj = processData[locationName];
        if (isDellAio) {
          if (route && DELLAIOWORKCENTERS.ROUTES[route] && foundObj[route]) {
            foundObj = foundObj[route];
            if (typeof foundObj === "object") {
              Object.keys(foundObj).forEach((foundObjKey) => {
                // let isLoopNotExecuted = true;
                if (typeof foundObj[foundObjKey] === "object") {
                  let foundObjKeyKeys = Object.keys(foundObj[foundObjKey]);
                  foundObjKeyKeys.forEach((key) => {
                    if (key === wc) {
                      // isLoopNotExecuted = false;
                      extractedObj[foundObjKey] = foundObj[foundObjKey][key];
                    }
                  });
                  // if (isLoopNotExecuted) {
                  //   let firstValue = foundObj[foundObjKey][foundObjKeyKeys[0]];
                  //   if (firstValue) {
                  //     extractedObj[foundObjKey] = firstValue;
                  //   }
                  // }
                } else if (typeof foundObjKey === "string") {
                  extractedObj[foundObjKey] = foundObj[foundObjKey];
                }
              });
            }
          }
        } else {
          extractedObj = foundObj;
        }
      }

      if (wc && wc.toLowerCase() === "grief") {
        let obj = {};
        if (locationName && locationName.toLowerCase() === "louisville") {
          obj = { "financialCode": "DELLAIO" }
        } else {
          obj = { "financialCode": "DELLAIONBD" }
        }
        this.contextService.addToContext(action.config.key, obj);
      } else {
        this.contextService.addToContext(action.config.key, extractedObj);
      }
    }
  }

  handleWcRenderActions(action, instance, actionService) {
    this.contextService.deleteDataByKey("isTimeOutFromFTestOrPackout");
    let renderAction = [];
    let templateId = "";
    let wc = "";
    if (action.config.wc && action.config.wc != undefined) {
      wc = this.contextService.getDataByString(action.config.wc);
    }

    switch (wc) {
      case 'DELL_AIO_VMI':
        templateId = "dell_vmi.json";
        break;
      case 'DELL_AIO_VALIDATION':
        templateId = "dell_Validation.json";
        break;
      case "DELL_AIO_EXT_TEST":
        templateId = "dell_ext_test.json";
        break;
      case 'DELL_AIO_DEBUG':
        this.dellRenderCurrentScreenMenu(action, instance, actionService)
        break;
      case 'Grief':
        templateId = "dell_grief.json";
        break;
      case 'DELL_AIO_QR':
        templateId = "dell_qr.json";
        break;
        case 'DELL_AIO_REWORK':
        templateId = "dellRework.json";
        break;
      case 'DELL_AIO_PA':
        templateId = "dell_pa.json";
        break;
      case 'DELL_AIO_OBA':
        templateId = "dell_oba.json";
        break;
      case 'DELL_AIO_FTEST':
        templateId = "dellFinalTest.json";
        break;
      case 'DELL_AIO_ESTIMATE':
        templateId = "dellEstimate.json";
        break;
      case 'DELL_AIO_DEBUG_ARC':       
        this.dellRenderCurrentScreenMenu(action, instance, actionService)
        break;
      case 'L2_DEBUG':
        this.dellRenderCurrentScreenMenu(action, instance, actionService)
        break;
      case 'DELL_AIO_ASSEMBLY':
        templateId = "dell_assembly.json";
        break;
      case 'DELL_AIO_PACKOUT':
        templateId = "dell_packout_repaired.json";
        break;
      default:
        templateId = "";
        break;
    }

    if(templateId !== ""){
      actionService.handleAction({
        "type": "renderTemplate",
        "config": {
          "templateId": templateId,
          "mode": "local"
        }
      }, instance);
    }
  }

  filterDellDebugSubmenuData(action, instance, actionService) {
    let subprocessMenuData =  this.contextService.getDataByKey(action.config.key);
    let unitData = this.contextService.getDataByKey(action.config.unitKey);
    let processData = this.contextService.getDataByKey(action.config.processDataKey);
    let wcName = unitData.WORKCENTER;
    let route = unitData.ROUTE;
    let subprocessMenuDataFin = [];
    let activeWorkCenter = '';

    if (wcName.toUpperCase() === processData.dellDebugARCWorkCenterName.toUpperCase()) {
      if(route.toUpperCase() === processData.dellWRP3RouteName.toUpperCase()) {
        subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
          if(celement.name.toUpperCase() != processData.dellDebugMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellL2DebugMenuName.toUpperCase() && !celement.name.includes('PR')) {
            subprocessMenuDataFin.push(celement);
          }
        });
      } else if (route.toUpperCase() === processData.dellWRPRouteName.toUpperCase()) {
        subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
          if(celement.name.toUpperCase() != processData.dellDebugArcMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellL2DebugMenuName.toUpperCase() && !celement.name.includes('PR')) {
            subprocessMenuDataFin.push(celement);
          }
        });
      }
    }

    if (wcName.toUpperCase() === processData.dellDebugWorkCenterName.toUpperCase()) {
      if(route.toUpperCase() === processData.dellWRP3RouteName.toUpperCase()) {
        subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
          if(celement.name.toUpperCase() != processData.dellDebugMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellL2DebugMenuName.toUpperCase() && !celement.name.includes('PR')) {
            subprocessMenuDataFin.push(celement);
          }
        });
      } else if (route.toUpperCase() === processData.dellWRPRouteName.toUpperCase()) {
        subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
          if(celement.name.toUpperCase() != processData.dellDebugArcMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellL2DebugMenuName.toUpperCase() && !celement.name.includes('PR')) {
            subprocessMenuDataFin.push(celement);
          }
        });
      }
    }

    if (wcName.toUpperCase() === processData.dellL2DebugWorkCenterName.toUpperCase()) {
      subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
        if(celement.name.toUpperCase() != processData.dellDebugArcMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellDebugMenuName.toUpperCase() && !celement.name.includes('PR')) {
          subprocessMenuDataFin.push(celement);
        }
      });
    }

    if(subprocessMenuDataFin && subprocessMenuDataFin.length > 0) {
      subprocessMenuData[0].children = subprocessMenuDataFin;
      activeWorkCenter = subprocessMenuDataFin[subprocessMenuDataFin.length-1];
    }

    this.contextService.addToContext('dellDebugActiveMenu', activeWorkCenter);
    this.contextService.addToContext(action.config.key, subprocessMenuData);
  }

  async checkDebugScreenRender(action, instance, actionService) {
    let activeMenuData = this.contextService.getDataByKey("dellDebugActiveMenu");
    let processData = this.contextService.getDataByKey(action.config.processDataKey);
    let commonActions = [];
    let isPrDebug = await this.checkIfPrDebug();
    let renderAction=[];
    let templateId = '';
    if (activeMenuData && activeMenuData['name'].toUpperCase() === processData.dellDebugMenuName.toUpperCase()) {
      templateId = isPrDebug ? "dell_debug_pr.json" : "dell_debug.json";
    } else if (activeMenuData && activeMenuData['name'].toUpperCase() === processData.dellDebugArcMenuName.toUpperCase()) {
      templateId = isPrDebug ? "dell_debug_arc_pr.json" : "dell_debug_arc.json";
    } else if (activeMenuData && activeMenuData['name'].toUpperCase() === processData.dellL2DebugMenuName.toUpperCase()) {
      templateId = isPrDebug ? "dell_L2_debug_pr.json" : "L2_Debug.json";
    } else {
      templateId = isPrDebug ? "dell_debug_pr.json" : "dell_debug.json";
    }
      renderAction = [
        {
          "type": "renderTemplate",
          "config": {
            "templateId": templateId,
            "mode": "local"
          }
        }
      ];

    renderAction.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }

  /// Check if the role for the user contains access for pr debug or not
  async checkIfPrDebug() {
    let isPrDebug = false;
    let getProcessWCData = this.contextService.getDataByKey("getProcessWCData");
    let getSLUserRoles = this.contextService.getDataByKey("getSLUserRole");
    let body = {
      "userName": "#userAccountInfo.PersonalDetails.USERID"
    };
    let res = await this.utilityService.getApiCallUsingPromise(body, "getSLUserRole");
    if (res && res['status']) {
      if(!!res['data']){
        let filteredRole = res['data'].filter((x) => x.roleName === getProcessWCData.predictionAccessRole);
        if(!!filteredRole && filteredRole.length > 0){
          isPrDebug = true;
        }
      }
    }

    return isPrDebug;
  }

  holdReleaseActions(action, instance, actionService) {
    let wc = this.contextService.getDataByString("#discrepancyUnitInfo.WORKCENTER");
    let commonActions = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "getHoldReleaseDetailService",
          "requestMethod": "get",
          "params": {
            "itemId": "#discrepancyUnitInfo.ITEM_ID",
            "operationType": "RELEASE",
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
                  "key": "getHoldReleaseDetailResp",
                  "data": "responseData"
                }
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "destinationBin",
                  "data": "#getHoldReleaseDetailResp.bin"
                }
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "destinationStockLoc",
                  "data": "#getHoldReleaseDetailResp.destStkLocationName"
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#discrepancyUnitInfo.WORKCENTER",
                  "rhs": "Grief"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "sourceStockLoc",
                          "data": "#getHoldReleaseDetailResp.destStkLocationName"
                        }
                      },
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "destinationStockLoc",
                          "data": "#getHoldReleaseDetailResp.srcStkLocationName"
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
                                "comments": "Unit released from Storage Hold",
                                "fixedAssetTag": "#discrepancyUnitInfo.FAT",
                                "storageHoldCode": "#getHoldReleaseDetailResp.storateHoldCode",
                                "storageHoldSubCode": "#getHoldReleaseDetailResp.storateHoldSubCode"
                              },
                              "destinationLocation": {
                                "bin": "#destinationBin",
                                "geography": "#discrepancyUnitInfo.GEONAME",
                                "stockingLocation": "#destinationStockLoc",
                                "warehouse": "#getHoldReleaseDetailResp.wareHouseName"
                              },
                              "item": [
                                {
                                  "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                  "owner": "#discrepancyUnitInfo.CLIENTNAME",
                                  "partNo": "#discrepancyUnitInfo.PART_NO",
                                  "serialNo": "#discrepancyUnitInfo.SERIAL_NO"
                                }
                              ],
                              "notes": "Unit released from Storage Hold",
                              "sourceLocation": {
                                "bin": "#sourceBin",
                                "geography": "#discrepancyUnitInfo.GEONAME",
                                "stockingLocation": "#sourceStockLoc",
                                "warehouse": "#getHoldReleaseDetailResp.wareHouseName"
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
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#discrepancyUnitInfo.STATUS",
                                  "rhs": "Time Out"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isValid",
                                          "lhs": "#discrepancyUnitInfo.DESTINATIONWC"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "dellTimeInMicroServices",
                                                "config": {
                                                  "DESTINATIONWC": "#discrepancyUnitInfo.DESTINATIONWC"
                                                }
                                              }
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "errorPrepareAndRender",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "Item- {0} Reached to it's Destination Workcenter: {1}",
                                                    "isShown": true
                                                  },
                                                  "valueArray": [
                                                    "#discrepancyUnitInfo.ITEM_BCN",
                                                    "#discrepancyUnitInfo.WORKCENTER"
                                                  ]
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
                                          "microserviceId": "releaseFromHold",
                                          "LocalService": "assets/Responses/performFA.json",
                                          "isLocal": false,
                                          "requestMethod": "post",
                                          "body": {
                                            "unitBCN": "#repairUnitInfo.ITEM_BCN",
                                            "releaseNotes": "RELEASE",
                                            "userPwd": {
                                              "userName": "#userAccountInfo.PersonalDetails.USERID",
                                              "password": "#loginUUID.password"
                                            }
                                          }
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "condition",
                                                "config": {
                                                  "operation": "isValid",
                                                  "lhs": "#discrepancyUnitInfo.STATUS"
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "dellReleaseActions",
                                                        "config": {
                                                          "discrepancyUnitInfo": "#discrepancyUnitInfo"
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
                                                          "lhs": "#discrepancyUnitInfo.DESTINATIONWC"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "dellTimeInMicroServices",
                                                                "config": {
                                                                  "DESTINATIONWC": "#discrepancyUnitInfo.DESTINATIONWC"
                                                                }
                                                              }
                                                            ]
                                                          },
                                                          "onFailure": {
                                                            "actions": [
                                                              {
                                                                "type": "errorPrepareAndRender",
                                                                "config": {
                                                                  "key": "searchCriteriaErrorTitleUUID",
                                                                  "properties": {
                                                                    "titleValue": "Item- {0} Reached to it's Destination Workcenter: {1}",
                                                                    "isShown": true
                                                                  },
                                                                  "valueArray": [
                                                                    "#discrepancyUnitInfo.ITEM_BCN",
                                                                    "#discrepancyUnitInfo.WORKCENTER"
                                                                  ]
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
                                                  "key": "errorDisp",
                                                  "data": "responseData"
                                                }
                                              },
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
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
                                  "key": "errorDisp",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "searchCriteriaErrorTitleUUID",
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
                  },
                  "onFailure": {
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
                                "comments": "Unit released from Storage Hold",
                                "fixedAssetTag": "#discrepancyUnitInfo.FAT",
                                "storageHoldCode": "#getHoldReleaseDetailResp.storateHoldCode",
                                "storageHoldSubCode": "#getHoldReleaseDetailResp.storateHoldSubCode"
                              },
                              "destinationLocation": {
                                "bin": "#destinationBin",
                                "geography": "#discrepancyUnitInfo.GEONAME",
                                "stockingLocation": "#destinationStockLoc",
                                "warehouse": "#getHoldReleaseDetailResp.wareHouseName"
                              },
                              "item": [
                                {
                                  "bcn": "#discrepancyUnitInfo.ITEM_BCN",
                                  "owner": "#discrepancyUnitInfo.CLIENTNAME",
                                  "partNo": "#discrepancyUnitInfo.PART_NO",
                                  "serialNo": "#discrepancyUnitInfo.SERIAL_NO"
                                }
                              ],
                              "notes": "Unit released from Storage Hold"
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
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#discrepancyUnitInfo.STATUS",
                                  "rhs": "Time Out"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isValid",
                                          "lhs": "#discrepancyUnitInfo.DESTINATIONWC"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "dellTimeInMicroServices",
                                                "config": {
                                                  "DESTINATIONWC": "#discrepancyUnitInfo.DESTINATIONWC"
                                                }
                                              }
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "errorPrepareAndRender",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
                                                  "properties": {
                                                    "titleValue": "Item- {0} Reached to it's Destination Workcenter: {1}",
                                                    "isShown": true
                                                  },
                                                  "valueArray": [
                                                    "#discrepancyUnitInfo.ITEM_BCN",
                                                    "#discrepancyUnitInfo.WORKCENTER"
                                                  ]
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
                                          "microserviceId": "releaseFromHold",
                                          "LocalService": "assets/Responses/performFA.json",
                                          "isLocal": false,
                                          "requestMethod": "post",
                                          "body": {
                                            "unitBCN": "#repairUnitInfo.ITEM_BCN",
                                            "releaseNotes": "RELEASE",
                                            "userPwd": {
                                              "userName": "#userAccountInfo.PersonalDetails.USERID",
                                              "password": "#loginUUID.password"
                                            }
                                          }
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "condition",
                                                "config": {
                                                  "operation": "isValid",
                                                  "lhs": "#discrepancyUnitInfo.STATUS"
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "dellReleaseActions",
                                                        "config": {
                                                          "discrepancyUnitInfo": "#discrepancyUnitInfo"
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
                                                          "lhs": "#discrepancyUnitInfo.DESTINATIONWC"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "dellTimeInMicroServices",
                                                                "config": {
                                                                  "DESTINATIONWC": "#discrepancyUnitInfo.DESTINATIONWC"
                                                                }
                                                              }
                                                            ]
                                                          },
                                                          "onFailure": {
                                                            "actions": [
                                                              {
                                                                "type": "errorPrepareAndRender",
                                                                "config": {
                                                                  "key": "searchCriteriaErrorTitleUUID",
                                                                  "properties": {
                                                                    "titleValue": "Item- {0} Reached to it's Destination Workcenter: {1}",
                                                                    "isShown": true
                                                                  },
                                                                  "valueArray": [
                                                                    "#discrepancyUnitInfo.ITEM_BCN",
                                                                    "#discrepancyUnitInfo.WORKCENTER"
                                                                  ]
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
                                                  "key": "errorDisp",
                                                  "data": "responseData"
                                                }
                                              },
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "searchCriteriaErrorTitleUUID",
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
                                  "key": "errorDisp",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "searchCriteriaErrorTitleUUID",
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
                  "key": "errorDisp",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "searchCriteriaErrorTitleUUID",
                  "properties": {
                    "titleValue": "#errorDisp",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      }];
    let actions = [];
    let estimateTrigger = {
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
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "microservice",
              "config": {
                "microserviceId": "getDellEstimategetROByBCN",
                "LocalService": "assets/Responses/performFA.json",
                "isLocal": false,
                "requestMethod": "get",
                "params": {
                  "itemBCN": "#repairUnitInfo.ITEM_BCN",
                  "userName": "#loginUUID.username"
                }
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "microservice",
                      "config": {
                        "microserviceId": "getDellEstimategetROByRo",
                        "LocalService": "assets/Responses/performFA.json",
                        "isLocal": false,
                        "requestMethod": "get",
                        "params": {
                          "refernceOrderById": "#getDellEstimategetROByBCN",
                          "userName": "#loginUUID.username"
                        }
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "extractValueBasedOnKey",
                              "config": {
                                "data": "getDellEstimategetROByRo",
                                "reqKey": "ffName",
                                "reqValue": "DPS Type",
                                "key": "dellEstimateDpsType"
                              }
                            },
                            {
                              "type": "microservice",
                              "config": {
                                "microserviceId": "getdellEstimateROHFFValueByRO",
                                "LocalService": "assets/Responses/performFA.json",
                                "isLocal": false,
                                "requestMethod": "get",
                                "params": {
                                  "referanceOrderId": "#getDellEstimategetROByBCN",
                                  "clientId": "#userSelectedClient",
                                  "contractId": "#userSelectedContract",
                                  "businessTransactionType": "#getCurrPrevRODetailsBySN.bussinessTrxTypeId",
                                  "ffName": "WI disposition",
                                  "userName": "#loginUUID.username",
                                  "DPSType": "#dellEstimateDpsType.ffValue",
                                  "serialNo": "#repairUnitInfo.SERIAL_NO",
                                  "locationId": "#userSelectedLocation"
                                }
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": commonActions
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
                                        "key": "estimateErrorTitleUUID",
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
                                "key": "estimateErrorTitleUUID",
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
                        "key": "estimateErrorTitleUUID",
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
                "key": "estimateErrorTitleUUID",
                "properties": {
                  "titleValue": "#errorDisp",
                  "isShown": true
                }
              }
            }
          ]
        }
      }
    };

    /// Estimate CR related code 1402
    if (wc && wc === "DELL_AIO_ESTIMATE") {
       actions.push(estimateTrigger);
     } else {
      actions = commonActions;
     }

    actions && actions.forEach((item) => {
      actionService.handleAction(item, instance);
    })
  }
}