import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class HpWCOperationsService {

  constructor(private contextService: ContextService) { }

  handleHPTimeInActions(actionData, instance, actionService, responseData?: any) {
    /// Deep cloning so that old values are cleared
    const action = cloneDeep(actionData);
    let destinationWC = "";
    if (action.config.DESTINATIONWC !== undefined) {
      destinationWC = this.contextService.getDataByString(action.config.DESTINATIONWC);
    }

    if (destinationWC == "HP_DEBUG" ||
      destinationWC == "HP_BURN_IN" ||
      destinationWC == "HP_QUICK_RESTORE") {
      let getHptirtstrigger = {
        "type": "microservice",
        "config": {
          "microserviceId": "getHptirtstrigger",
          "requestMethod": "get",
          "params": {
            "userName": "#userAccountInfo.PersonalDetails.USERID",
            "clientId": "#repairUnitInfo.CLIENT_ID",
            "contractId": "#repairUnitInfo.CONTRACT_ID",
            "itemId": "#repairUnitInfo.ITEM_ID",
            "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
            "workCenterName": "#repairUnitInfo.WORKCENTER",
            "opt": "#repairUnitInfo.ROUTE",
            "serialNo": "#repairUnitInfo.SERIAL_NO",
            "workOrderId": "#repairUnitInfo.WORKORDER_ID",
            "partNo": "#repairUnitInfo.PART_NO",
            "locationId": "#repairUnitInfo.LOCATION_ID",
            "bcn": "#repairUnitInfo.ITEM_BCN"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "timeInMicroServices",
                "config": {
                  "DESTINATIONWC": "Rework"
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
                  "key": "getHptirtstriggerData",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "searchCriteriaErrorTitleUUID",
                  "properties": {
                    "titleValue": "#getHptirtstriggerData",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      };

      actionService.handleAction(getHptirtstrigger, instance);


    } else {
      this.timeInMicroServices(action, instance, actionService);
    }
  }

  // handleFindIdentificatorType(action, instance, actionService) {
  //   let unitIdentificationValue = action.config.unitIdentificationValue;
  //   let charRegex = /^[A-Za-z]+$/;
  //   let numberRegex = /^[0-9]+$/;
  //   let unitIdentificationType = "SerialNumber";  //Setting default value

  //   if(unitIdentificationValue && unitIdentificationValue != undefined){
  //     unitIdentificationValue = this.contextService.getDataByString(unitIdentificationValue);
  //     if(unitIdentificationValue.length >= 4){
  //       let firstThreeChar = unitIdentificationValue.substring(0,3);
  //       let firstFourChar = unitIdentificationValue.substring(0,4);
  //       if(firstThreeChar == "BCN"){
  //         unitIdentificationType = "BCN";
  //       } else if(charRegex.test(firstFourChar)){
  //         unitIdentificationType = "FixedAssetTag";
  //       } else if(numberRegex.test(unitIdentificationValue[3])){
  //         unitIdentificationType = "SerialNumber";
  //       }
  //     }
  //   }
  //   this.contextService.addToContext(action.config.key, unitIdentificationType);
  // }

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
              "type": "findIdentificatorType",
              "eventSource": "click",
              "config": {
                "key": "identificatorTypeValue",
                "unitIdentificationValue": "#discrepancyUserSearchCriteria.discrepancyunitIdentificationValue"
              }
            },
            {
              "type": "microservice",
              "config": {
                "microserviceId": "getUnitInfo",
                "requestMethod": "get",
                "params": {
                  "unitIdentificationValue": "#discrepancyUserSearchCriteria.discrepancyunitIdentificationValue",
                  "identificatorType": "#identificatorTypeValue",
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
                        "key": "isFromRelease",
                        "data": false
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
                      "type": "commonHPWCOperations",
                      "config": {
                        "discrepancyUnitInfo": "#discrepancyUnitInfo"
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

    // timeInMicroServices.forEach((element) => {
    actionService.handleAction(timeInMicroServices, instance);
    // });
  }
  handleAllHpCommonWCOperations(action, instance, actionService) {
    let AllHpCommonWCOperations = {
      "type": "microservice",
      "config": {
        "microserviceId": "receiptDate",
        "requestMethod": "get",
        "params": {
          "locationId": "#discrepancyUnitInfo.LOCATION_ID",
          "itemId": "#discrepancyUnitInfo.ITEM_ID",
          "userName": "#userAccountInfo.PersonalDetails.USERID",
          "bcn": "#discrepancyUnitInfo.ITEM_BCN",
          "orderId": "#ROByBCNForDiscrepancy"
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
                            },
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
                                }
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
                                                        }
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
                                                              "type": "microservice",
                                                              "eventSource": "input",
                                                              "config": {
                                                                "microserviceId": "getProcess",
                                                                "requestMethod": "get",
                                                                "parseJson": true,
                                                                "params": {
                                                                  "locationId": "#userSelectedLocation",
                                                                  "clientId": "#userSelectedClient",
                                                                  "contractId": "#userSelectedContract",
                                                                  "btt": 1,
                                                                  "optId": "#discrepancyUnitInfo.ROUTE_ID",
                                                                  "whId": -1,
                                                                  "userId": "#userAccountInfo.PersonalDetails.USERID",
                                                                  "wcId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                                                  "operationType": "#userSelectedSubProcessType",
                                                                  "workCenterName": ""
                                                                },
                                                                "isLocal": false,
                                                                "LocalService": "assets/Responses/getProcessHPData.json"
                                                              },
                                                              "responseDependents": {
                                                                "onSuccess": {
                                                                  "actions": [
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "getReferenceDataKeys",
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
                                                                        "data": "#getReferenceDataKeys.subProcess.WCOperation.HP"
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
                                                                              "type": "condition",
                                                                              "eventSource": "click",
                                                                              "config": {
                                                                                "operation": "isEqualTo",
                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                "rhs": "HP_DISCREPANCY"
                                                                              },
                                                                              "responseDependents": {
                                                                                "onSuccess": {
                                                                                  "actions": [
                                                                                    
                                                                                    {
                                                                                      "type": "renderTemplate",
                                                                                      "config": {
                                                                                        "templateId": "discrepancySubProcess.json",
                                                                                        "mode": "local"
                                                                                      }
                                                                                    }
                                                                                  ]
                                                                                },
                                                                                "onFailure": {
                                                                                  "actions": [
                                                                                    {
                                                                                      "type": "condition",
                                                                                      "config": {
                                                                                        "operation": "isEqualTo",
                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                        "rhs": "HP_DEBUG"
                                                                                      },
                                                                                      "eventSource": "click",
                                                                                      "responseDependents": {
                                                                                        "onSuccess": {
                                                                                          "actions": [
                                                                                            {
                                                                                              "type": "microservice",
                                                                                              "config": {
                                                                                                "microserviceId": "getAllItemHistory",
                                                                                                "requestMethod": "get",
                                                                                                "params": {
                                                                                                  "itemId": "#discrepancyUnitInfo.ITEM_ID",
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
                                                                                                        "key": "unitItemHistoryData",
                                                                                                        "data": "responseData"
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "type": "getArrayRecordByIndex",
                                                                                                      "config": {
                                                                                                        "contextKey": "lastTxnTypeData",
                                                                                                        "data": "#unitItemHistoryData",
                                                                                                        "index": 0,
                                                                                                        "propertyName": "orderItemOperName",
                                                                                                        "propertyContextKey": "lastTxnTypeName"
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "type": "condition",
                                                                                                      "config": {
                                                                                                        "operation": "isEqualTo",
                                                                                                        "lhs": "#lastTxnTypeData.note",
                                                                                                        "rhs": "Pass to assessment"
                                                                                                      },
                                                                                                      "responseDependents": {
                                                                                                        "onSuccess": {
                                                                                                          "actions": [
                                                                                                            {
                                                                                                              "type": "renderTemplate",
                                                                                                              "config": {
                                                                                                                "templateId": "repairAssessmentScreen.json",
                                                                                                                "mode": "local"
                                                                                                              }
                                                                                                            }
                                                                                                          ]
                                                                                                        },
                                                                                                        "onFailure": {
                                                                                                          "actions": [
                                                                                                            {
                                                                                                              "type": "condition",
                                                                                                              "config": {
                                                                                                                "operation": "isEqualTo",
                                                                                                                "lhs": "#lastTxnTypeName",
                                                                                                                "rhs": "Release"
                                                                                                              },
                                                                                                              "responseDependents": {
                                                                                                                "onSuccess": {
                                                                                                                  "actions": [
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
                                                                                                                                "data": ""
                                                                                                                              }
                                                                                                                            },
                                                                                                                            {
                                                                                                                              "type": "context",
                                                                                                                              "config": {
                                                                                                                                "requestMethod": "add",
                                                                                                                                "key": "getHoldReleaseDetailResp",
                                                                                                                                "data": "responseData"
                                                                                                                              }
                                                                                                                            },
                                                                                                                            {
                                                                                                                              "type": "condition",
                                                                                                                              "config": {
                                                                                                                                "operation": "isValid",
                                                                                                                                "lhs": "#getHoldReleaseDetailResp"
                                                                                                                              },
                                                                                                                              "responseDependents": {
                                                                                                                                "onSuccess": {
                                                                                                                                  "actions": [
                                                                                                                                    {
                                                                                                                                      "type": "condition",
                                                                                                                                      "config": {
                                                                                                                                        "operation": "isContains",
                                                                                                                                        "lhs": "#getHoldReleaseDetailResp.storateHoldSubCode",
                                                                                                                                        "rhs": "MR -"
                                                                                                                                      },
                                                                                                                                      "responseDependents": {
                                                                                                                                        "onSuccess": {
                                                                                                                                          "actions": [
                
                                                                                                                                            {
                                                                                                                                              "type": "renderTemplate",
                                                                                                                                              "config": {
                                                                                                                                                "templateId": "quoteResponse.json",
                                                                                                                                                "mode": "local"
                                                                                                                                              }
                                                                                                                                            }
                                                                                                                                          ]
                                                                                                                                        },
                                                                                                                                        "onFailure": {
                                                                                                                                          "actions": [
                                                                                                                                    
                                                                                                                                            {
                                                                                                                                              "type": "renderCurrentScreenMenu"
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
                                                                                                                                      "type": "renderCurrentScreenMenu"
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
                                                                                                                                "key": "errorHoldCodeDisp",
                                                                                                                                "data": "responseData"
                                                                                                                              }
                                                                                                                            },
                                                                                                                            {
                                                                                                                              "type": "updateComponent",
                                                                                                                              "config": {
                                                                                                                                "key": "searchCriteriaErrorTitleUUID",
                                                                                                                                "properties": {
                                                                                                                                  "titleValue": "#errorHoldCodeDisp",
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
                                                                                                                      "type": "renderCurrentScreenMenu"
                                                                                                                    }
                                                                                                                  ]
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
                                                                                                      "type": "context",
                                                                                                      "config": {
                                                                                                        "requestMethod": "add",
                                                                                                        "key": "errorAllItemHistory",
                                                                                                        "data": "responseData"
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "type": "updateComponent",
                                                                                                      "config": {
                                                                                                        "key": "searchCriteriaErrorTitleUUID",
                                                                                                        "properties": {
                                                                                                          "titleValue": "#errorAllItemHistory",
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
                                                                                              "type": "condition",
                                                                                              "config": {
                                                                                                "operation": "isEqualTo",
                                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                "rhs": "HP_FAILURE_ANALYSIS"
                                                                                              },
                                                                                              "eventSource": "click",
                                                                                              "responseDependents": {
                                                                                                "onSuccess": {
                                                                                                  "actions": [
                                                                                                    {
                                                                                                      "type": "renderTemplate",
                                                                                                      "config": {
                                                                                                        "templateId": "faAssessmentScreen.json",
                                                                                                        "mode": "local"
                                                                                                      }
                                                                                                    }
                                                                                                  ]
                                                                                                },
                                                                                                "onFailure": {
                                                                                                  "actions": [
                                                                                                    {
                                                                                                      "type": "condition",
                                                                                                      "config": {
                                                                                                        "operation": "isEqualTo",
                                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                        "rhs": "HP_REWORK"
                                                                                                      },
                                                                                                      "eventSource": "click",
                                                                                                      "responseDependents": {
                                                                                                        "onSuccess": {
                                                                                                          "actions": [
                                                                                                            
                                                                                                            {
                                                                                                              "type": "renderTemplate",
                                                                                                              "config": {
                                                                                                                "templateId": "repair_rework.json",
                                                                                                                "mode": "local"
                                                                                                              }
                                                                                                            }
                                                                                                          ]
                                                                                                        },
                                                                                                        "onFailure": {
                                                                                                          "actions": [
                                                                                                            {
                                                                                                              "type": "condition",
                                                                                                              "config": {
                                                                                                                "operation": "isEqualTo",
                                                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                "rhs": "HP_BURN_IN"
                                                                                                              },
                                                                                                              "eventSource": "click",
                                                                                                              "responseDependents": {
                                                                                                                "onSuccess": {
                                                                                                                  "actions": [
                                                                                                                    
                                                                                                                    {
                                                                                                                      "type": "renderTemplate",
                                                                                                                      "config": {
                                                                                                                        "templateId": "repair_burn-in.json",
                                                                                                                        "mode": "local"
                                                                                                                      }
                                                                                                                    }
                                                                                                                  ]
                                                                                                                },
                                                                                                                "onFailure": {
                                                                                                                  "actions": [
                                                                                                                    {
                                                                                                                      "type": "condition",
                                                                                                                      "config": {
                                                                                                                        "operation": "isEqualTo",
                                                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                        "rhs": "HP_QUICK_RESTORE"
                                                                                                                      },
                                                                                                                      "eventSource": "click",
                                                                                                                      "responseDependents": {
                                                                                                                        "onSuccess": {
                                                                                                                          "actions": [
                                                                                                                            
                                                                                                                            {
                                                                                                                              "type": "renderTemplate",
                                                                                                                              "config": {
                                                                                                                                "templateId": "quick_restore.json",
                                                                                                                                "mode": "local"
                                                                                                                              }
                                                                                                                            },
                                                                                                                          ]
                                                                                                                        },
                                                                                                                        "onFailure": {
                                                                                                                          "actions": [
                                                                                                                            {
                                                                                                                              "type": "condition",
                                                                                                                              "config": {
                                                                                                                                "operation": "isEqualTo",
                                                                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                                "rhs": "HP_MB_REPAIR"
                                                                                                                              },
                                                                                                                              "eventSource": "click",
                                                                                                                              "responseDependents": {
                                                                                                                                "onSuccess": {
                                                                                                                                  "actions": [
                                                                                                                                   
                                                                                                                                    {
                                                                                                                                      "type": "renderTemplate",
                                                                                                                                      "config": {
                                                                                                                                        "templateId": "hp_mb_repair.json",
                                                                                                                                        "mode": "local"
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  ]
                                                                                                                                },
                                                                                                                                "onFailure": {
                                                                                                                                  "actions": [
                                                                                                                                    {
                                                                                                                                      "type": "condition",
                                                                                                                                      "config": {
                                                                                                                                        "operation": "isEqualTo",
                                                                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                                        "rhs": "HP_PACKOUT"
                                                                                                                                      },
                                                                                                                                      "eventSource": "click",
                                                                                                                                      "responseDependents": {
                                                                                                                                        "onSuccess": {
                                                                                                                                          "actions": [
                                                                                                                                            
                                                                                                                                            {
                                                                                                                                              "type": "renderTemplate",
                                                                                                                                              "config": {
                                                                                                                                                "templateId": "packoutPacking.json",
                                                                                                                                                "mode": "local"
                                                                                                                                              }
                                                                                                                                            }
                                                                                                                                          ]
                                                                                                                                        },
                                                                                                                                        "onFailure": {
                                                                                                                                          "actions": [
                                                                                                                                            {
                                                                                                                                              "type": "condition",
                                                                                                                                              "config": {
                                                                                                                                                "operation": "isEqualTo",
                                                                                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                                                "rhs": "HP_OBA"
                                                                                                                                              },
                                                                                                                                              "eventSource": "click",
                                                                                                                                              "responseDependents": {
                                                                                                                                                "onSuccess": {
                                                                                                                                                  "actions": [
                                                                                                                                                    
                                                                                                                                                    {
                                                                                                                                                      "type": "renderTemplate",
                                                                                                                                                      "config": {
                                                                                                                                                        "templateId": "hp_OBA.json",
                                                                                                                                                        "mode": "local"
                                                                                                                                                      }
                                                                                                                                                    }
                                                                                                                                                  ]
                                                                                                                                                },
                                                                                                                                                "onFailure": {
                                                                                                                                                  "actions": [
                                                                                                                                                    {
                                                                                                                                                      "type": "condition",
                                                                                                                                                      "config": {
                                                                                                                                                        "operation": "isEqualTo",
                                                                                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                                                        "rhs": "HP_VISUAL_FINAL_TEST_RTV"
                                                                                                                                                      },
                                                                                                                                                      "eventSource": "click",
                                                                                                                                                      "responseDependents": {
                                                                                                                                                        "onSuccess": {
                                                                                                                                                          "actions": [
                                                                                                                                                            
                                                                                                                                                            {
                                                                                                                                                              "type": "renderTemplate",
                                                                                                                                                              "config": {
                                                                                                                                                                "templateId": "HP-VFT.json",
                                                                                                                                                                "mode": "local"
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
                                                                                                                                                                  "titleValue": "Item doesn't belongs to HP_Repair",
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
                                                                                "key": "getTimeInDetailsResp",
                                                                                "data": "responseData"
                                                                              }
                                                                            },
                                                                            {
                                                                              "type": "updateComponent",
                                                                              "config": {
                                                                                "key": "searchCriteriaErrorTitleUUID",
                                                                                "properties": {
                                                                                  "titleValue": "#getTimeInDetailsResp",
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
                                                                "key": "permission",
                                                                "data": "responseData"
                                                              }
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "searchCriteriaErrorTitleUUID",
                                                                "properties": {
                                                                  "titleValue": "#permission",
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
    };

    // timeInMicroServices.forEach((element) => {
    actionService.handleAction(AllHpCommonWCOperations, instance);
    // });
  }
  handleAllHpReleaseCommonWCOperations(action, instance, actionService) {
    let AllHpCommonWCOperations = {
      "type": "microservice",
      "config": {
        "microserviceId": "receiptDate",
        "requestMethod": "get",
        "params": {
          "locationId": "#discrepancyUnitInfo.LOCATION_ID",
          "itemId": "#discrepancyUnitInfo.ITEM_ID",
          "userName": "#userAccountInfo.PersonalDetails.USERID",
          "bcn": "#discrepancyUnitInfo.ITEM_BCN",
          "orderId": "#ROByBCNForDiscrepancy"
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
                            },
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
                                }
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
                                                        }
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
                                                              "type": "microservice",
                                                              "eventSource": "input",
                                                              "config": {
                                                                "microserviceId": "getProcess",
                                                                "requestMethod": "get",
                                                                "parseJson": true,
                                                                "params": {
                                                                  "locationId": "#userSelectedLocation",
                                                                  "clientId": "#userSelectedClient",
                                                                  "contractId": "#userSelectedContract",
                                                                  "btt": 1,
                                                                  "optId": "#discrepancyUnitInfo.ROUTE_ID",
                                                                  "whId": -1,
                                                                  "userId": "#userAccountInfo.PersonalDetails.USERID",
                                                                  "wcId": "#discrepancyUnitInfo.WORKCENTER_ID",
                                                                  "operationType": "#userSelectedSubProcessType",
                                                                  "workCenterName": ""
                                                                },
                                                                "isLocal": false,
                                                                "LocalService": "assets/Responses/getProcessHPData.json"
                                                              },
                                                              "responseDependents": {
                                                                "onSuccess": {
                                                                  "actions": [
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "getReferenceDataKeys",
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
                                                                        "data": "#getReferenceDataKeys.subProcess.WCOperation.HP"
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
                                                                              "type": "context",
                                                                              "config": {
                                                                                "requestMethod": "add",
                                                                                "key": "isFromRelease",
                                                                                "data": true
                                                                              }
                                                                            },
        
                                                                            {
                                                                              "type": "condition",
                                                                              "eventSource": "click",
                                                                              "config": {
                                                                                "operation": "isEqualTo",
                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                "rhs": "HP_DISCREPANCY"
                                                                              },
                                                                              "responseDependents": {
                                                                                "onSuccess": {
                                                                                  "actions": [
                                                                                    
                                                                                    {
                                                                                      "type": "renderTemplate",
                                                                                      "config": {
                                                                                        "templateId": "discrepancySubProcess.json",
                                                                                        "mode": "local"
                                                                                      }
                                                                                    }
                                                                                  ]
                                                                                },
                                                                                "onFailure": {
                                                                                  "actions": [
                                                                                    {
                                                                                      "type": "condition",
                                                                                      "config": {
                                                                                        "operation": "isEqualTo",
                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                        "rhs": "HP_DEBUG"
                                                                                      },
                                                                                      "eventSource": "click",
                                                                                      "responseDependents": {
                                                                                        "onSuccess": {
                                                                                          "actions": [
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
                                                                                                        "data": ""
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "type": "context",
                                                                                                      "config": {
                                                                                                        "requestMethod": "add",
                                                                                                        "key": "getHoldReleaseDetailResp",
                                                                                                        "data": "responseData"
                                                                                                      }
                                                                                                    },
        
                                                                                                    {
                                                                                                      "type": "condition",
                                                                                                      "config": {
                                                                                                        "operation": "isValid",
                                                                                                        "lhs": "#getHoldReleaseDetailResp"
                                                                                                      },
                                                                                                      "responseDependents": {
                                                                                                        "onSuccess": {
                                                                                                          "actions": [
                                                                                                            {
                                                                                                              "type": "condition",
                                                                                                              "config": {
                                                                                                                "operation": "isContains",
                                                                                                                "lhs": "#getHoldReleaseDetailResp.storateHoldSubCode",
                                                                                                                "rhs": "MR -"
                                                                                                              },
                                                                                                              "responseDependents": {
                                                                                                                "onSuccess": {
                                                                                                                  "actions": [
                                                                                                                    
                                                                                                                    {
                                                                                                                      "type": "renderTemplate",
                                                                                                                      "config": {
                                                                                                                        "templateId": "quoteResponse.json",
                                                                                                                        "mode": "local"
                                                                                                                      }
                                                                                                                    }
                                                                                                                  ]
                                                                                                                },
                                                                                                                "onFailure": {
                                                                                                                  "actions": [
                                                                                                                    
                                                                                                                    {
                                                                                                                      "type": "renderCurrentScreenMenu"
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
                                                                                                              "type": "renderCurrentScreenMenu"
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
                                                                                                        "key": "errorHoldCodeDisp",
                                                                                                        "data": "responseData"
                                                                                                      }
                                                                                                    },
                                                                                                    {
                                                                                                      "type": "updateComponent",
                                                                                                      "config": {
                                                                                                        "key": "searchCriteriaErrorTitleUUID",
                                                                                                        "properties": {
                                                                                                          "titleValue": "#errorHoldCodeDisp",
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
                                                                                              "type": "condition",
                                                                                              "config": {
                                                                                                "operation": "isEqualTo",
                                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                "rhs": "HP_FAILURE_ANALYSIS"
                                                                                              },
                                                                                              "eventSource": "click",
                                                                                              "responseDependents": {
                                                                                                "onSuccess": {
                                                                                                  "actions": [
                                                                                                    {
                                                                                                      "type": "renderTemplate",
                                                                                                      "config": {
                                                                                                        "templateId": "faAssessmentScreen.json",
                                                                                                        "mode": "local"
                                                                                                      }
                                                                                                    }
                                                                                                  ]
                                                                                                },
                                                                                                "onFailure": {
                                                                                                  "actions": [
                                                                                                    {
                                                                                                      "type": "condition",
                                                                                                      "config": {
                                                                                                        "operation": "isEqualTo",
                                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                        "rhs": "HP_REWORK"
                                                                                                      },
                                                                                                      "eventSource": "click",
                                                                                                      "responseDependents": {
                                                                                                        "onSuccess": {
                                                                                                          "actions": [
                                                                                                             {
                                                                                                              "type": "renderTemplate",
                                                                                                              "config": {
                                                                                                                "templateId": "repair_rework.json",
                                                                                                                "mode": "local"
                                                                                                              }
                                                                                                            }
                                                                                                          ]
                                                                                                        },
                                                                                                        "onFailure": {
                                                                                                          "actions": [
                                                                                                            {
                                                                                                              "type": "condition",
                                                                                                              "config": {
                                                                                                                "operation": "isEqualTo",
                                                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                "rhs": "HP_BURN_IN"
                                                                                                              },
                                                                                                              "eventSource": "click",
                                                                                                              "responseDependents": {
                                                                                                                "onSuccess": {
                                                                                                                  "actions": [
                                                                                                                    
                                                                                                                    {
                                                                                                                      "type": "renderTemplate",
                                                                                                                      "config": {
                                                                                                                        "templateId": "repair_burn-in.json",
                                                                                                                        "mode": "local"
                                                                                                                      }
                                                                                                                    }
                                                                                                                  ]
                                                                                                                },
                                                                                                                "onFailure": {
                                                                                                                  "actions": [
                                                                                                                    {
                                                                                                                      "type": "condition",
                                                                                                                      "config": {
                                                                                                                        "operation": "isEqualTo",
                                                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                        "rhs": "HP_QUICK_RESTORE"
                                                                                                                      },
                                                                                                                      "eventSource": "click",
                                                                                                                      "responseDependents": {
                                                                                                                        "onSuccess": {
                                                                                                                          "actions": [
                                                                                                                           
                                                                                                                            {
                                                                                                                              "type": "renderTemplate",
                                                                                                                              "config": {
                                                                                                                                "templateId": "quick_restore.json",
                                                                                                                                "mode": "local"
                                                                                                                              }
                                                                                                                            }
                                                                                                                          ]
                                                                                                                        },
                                                                                                                        "onFailure": {
                                                                                                                          "actions": [
                                                                                                                            {
                                                                                                                              "type": "condition",
                                                                                                                              "config": {
                                                                                                                                "operation": "isEqualTo",
                                                                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                                "rhs": "HP_MB_REPAIR"
                                                                                                                              },
                                                                                                                              "eventSource": "click",
                                                                                                                              "responseDependents": {
                                                                                                                                "onSuccess": {
                                                                                                                                  "actions": [
                                                                                                                                    
                                                                                                                                    {
                                                                                                                                      "type": "renderTemplate",
                                                                                                                                      "config": {
                                                                                                                                        "templateId": "hp_mb_repair.json",
                                                                                                                                        "mode": "local"
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  ]
                                                                                                                                },
                                                                                                                                "onFailure": {
                                                                                                                                  "actions": [
                                                                                                                                    {
                                                                                                                                      "type": "condition",
                                                                                                                                      "config": {
                                                                                                                                        "operation": "isEqualTo",
                                                                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                                        "rhs": "HP_PACKOUT"
                                                                                                                                      },
                                                                                                                                      "eventSource": "click",
                                                                                                                                      "responseDependents": {
                                                                                                                                        "onSuccess": {
                                                                                                                                          "actions": [
                                                                                                                                            
                                                                                                                                            {
                                                                                                                                              "type": "renderTemplate",
                                                                                                                                              "config": {
                                                                                                                                                "templateId": "packoutPacking.json",
                                                                                                                                                "mode": "local"
                                                                                                                                              }
                                                                                                                                            }
                                                                                                                                          ]
                                                                                                                                        },
                                                                                                                                        "onFailure": {
                                                                                                                                          "actions": [
                                                                                                                                            {
                                                                                                                                              "type": "condition",
                                                                                                                                              "config": {
                                                                                                                                                "operation": "isEqualTo",
                                                                                                                                                "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                                                "rhs": "HP_OBA"
                                                                                                                                              },
                                                                                                                                              "eventSource": "click",
                                                                                                                                              "responseDependents": {
                                                                                                                                                "onSuccess": {
                                                                                                                                                  "actions": [
                                                                                                                                                   
                                                                                                                                                    {
                                                                                                                                                      "type": "renderTemplate",
                                                                                                                                                      "config": {
                                                                                                                                                        "templateId": "hp_OBA.json",
                                                                                                                                                        "mode": "local"
                                                                                                                                                      }
                                                                                                                                                    }
                                                                                                                                                  ]
                                                                                                                                                },
                                                                                                                                                "onFailure": {
                                                                                                                                                  "actions": [
                                                                                                                                                    {
                                                                                                                                                      "type": "condition",
                                                                                                                                                      "config": {
                                                                                                                                                        "operation": "isEqualTo",
                                                                                                                                                        "lhs": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                                                        "rhs": "HP_VISUAL_FINAL_TEST_RTV"
                                                                                                                                                      },
                                                                                                                                                      "eventSource": "click",
                                                                                                                                                      "responseDependents": {
                                                                                                                                                        "onSuccess": {
                                                                                                                                                          "actions": [
        
                                                                                                                                                            {
                                                                                                                                                              "type": "renderTemplate",
                                                                                                                                                              "config": {
                                                                                                                                                                "templateId": "HP-VFT.json",
                                                                                                                                                                "mode": "local"
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
                                                                                                                                                                  "titleValue": "Item doesn't belongs to HP_Repair",
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
                                                                                "key": "getTimeInDetailsResp",
                                                                                "data": "responseData"
                                                                              }
                                                                            },
                                                                            {
                                                                              "type": "updateComponent",
                                                                              "config": {
                                                                                "key": "searchCriteriaErrorTitleUUID",
                                                                                "properties": {
                                                                                  "titleValue": "#getTimeInDetailsResp",
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
                                                                "key": "permission",
                                                                "data": "responseData"
                                                              }
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "searchCriteriaErrorTitleUUID",
                                                                "properties": {
                                                                  "titleValue": "#permission",
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
    };

    // timeInMicroServices.forEach((element) => {
    actionService.handleAction(AllHpCommonWCOperations, instance);
    // });
  }
  commonActions(action, instance, actionService) {
    // let isHoldRelease = false;
    // if (action.config.isHoldRelease !== undefined && action.config.isHoldRelease) {
    //   isHoldRelease = action.config.isHoldRelease;
    // }
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
                          "key": "getJsonReponse",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "getDataFromSaveAndExit"
                      },
                      {
                        "type": "handleAllHpCommonWCOperations"
                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "handleAllHpCommonWCOperations"
                      },
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
                            "isShown": true
                          }
                        }
                      }
                    ]
                  }
                }
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "ROByBCNForDiscrepancy",
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

    commonActions.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }

  renderCurrentScreenMenu(action, instance, actionService) {
    let arr = this.contextService.getDataByKey("menuItems");
    let discrepancyWC = this.contextService.getDataByString("#discrepancyUnitInfo.WORKCENTER")
    let currentMenu = arr && arr.find(x => x.completed === false);
    if (currentMenu &&
      (currentMenu.slWcName || currentMenu.name) != discrepancyWC) {
      this.changingMenuItemActiveStatus(arr);
    }
    currentMenu = arr && arr.find(x => x.completed === false);
    let commonActions = [];
    if (currentMenu) {
      if (currentMenu.name == "DEBUG") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "repair_debug.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "QUOTE MESSAGE") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "quoteMessage.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "ASSESSMENT") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "repairAssessmentScreen.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "QUOTE RESPONSE") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "quoteResponse.json",
            "mode": "local"
          }
        }]
      }
    } else {
      commonActions = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "repairAssessmentScreen.json",
          "mode": "local"
        }
      }]
    }
    commonActions.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }
  changingMenuItemActiveStatus(menuItem) {
    let discrepancyWC = this.contextService.getDataByString("#discrepancyUnitInfo.WORKCENTER");
    let parentChildrenMenuitems = this.contextService.getDataByKey("parentChildrenMenuitems");
    menuItem.forEach((obj) => {
      if (obj &&
        (obj.slWcName || obj.name) != discrepancyWC) {
        obj.completed = true;
        obj.isActive = false;
        obj.isVisited = true;
      }
    });
    //Updating the parentChildrenMenuitems 
    parentChildrenMenuitems && parentChildrenMenuitems.forEach((element: any) => {
      if (element.children && element.children.length > 0) {
        element.children && element.children.forEach((childrenElement: any) => {
          if (childrenElement.name != discrepancyWC) {
            childrenElement["completed"] = true;
            childrenElement["isVisited"] = true;
            childrenElement["isActive"] = false;
          }
        });
      }
      else if (element.name != discrepancyWC) {
        element["completed"] = true;
        element["isVisited"] = true;
        element["isActive"] = false;
      }
    });
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
                        "key": "getJsonReponse",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "getDataFromSaveAndExit"
                    },
                    {
                      "type": "handleAllHpReleaseCommonWCOperations"
                    }
                  ]
                }, "onFailure": {
                  "actions": [
                    {
                      "type": "handleAllHpReleaseCommonWCOperations"
                    },
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

  menuItemAction(action, instance, actionService) {
    let menuItem =
      [
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
                    "key": "getJsonReponse",
                    "data": "responseData"
                  }
                },
                {
                  "type": "getDataFromSaveAndExit"
                },
                {
                  "type": "microservice",
                  "hookType": "beforeInit",
                  "config": {
                    "microserviceId": "getSubProcessPageBody",
                    "requestMethod": "get",
                    "params": {
                      "subProcessId": instance.id,
                      "userName": "#userAccountInfo.PersonalDetails.USERID"
                    },
                    "isLocal": false,
                    "LocalService": "assets/Responses/SubProcess/HP/repairAssessmentSubProcess.json"
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "renderTemplate",
                          "config": {
                            "mode": "remote",
                            "targetId": "mainPageContentBodysp",
                            "templateId": "getSubProcessPageBody"
                          }
                        }
                      ]
                    },
                    "onFailure": {
                      "actions": [
                        {
                          "type": "toast",
                          "message": "Failed to fetch JSON"
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
        }]
    menuItem.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }
}
