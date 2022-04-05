import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ContextService } from '../../commonServices/contextService/context.service';
import { DELLAIOWORKCENTERS } from '../../../utilities/constants';

@Injectable({
  providedIn: 'root'
})
export class DellCarWCOperationsService {

  constructor(
    private contextService: ContextService
  ) { }

  handleDellTimeInActions(actionData, instance, actionService, responseData?: any) {
    /// Deep cloning so that old values are cleared
    const action = cloneDeep(actionData);
    let destinationWC = "";
    if (action.config.DESTINATIONWC !== undefined) {
      destinationWC = this.contextService.getDataByString(action.config.DESTINATIONWC);
    }
    if (destinationWC == "DELL_CAR_DEBUG") {
      let dellCarBTintrigger = {
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
                        "config": {
                          "microserviceId": "getCurrPrevRODetailsBySN",
                          "requestMethod": "get",
                          "isLocal": false,
                          "LocalService": "assets/getCurrPrevRODetailsBySN.json",
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
                            "actions": [
                              {
                                "type": "handleDellCarTimeInCalls",
                                "config": {
                                  "DESTINATIONWC": "#discrepancyUnitInfo.DESTINATIONWC"
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
                                  "key": "dellCarDpsUUID",
                                  "properties": {
                                    "titleValue": "--"
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
                  "type": "errorRenderTemplate",
                  "contextKey": "errorMsg",
                  "updateKey": "errorTitleUUID"
                }
              }
            ]
          }
        }
      };

      actionService.handleAction(dellCarBTintrigger, instance);


    } else {
      this.timeInMicroServices(action, instance, actionService);
    }

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
                      "type": "commonScreenLevelOperations"
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "handleCommonServices",
                      "config": {
                        "type": "errorRenderTemplate",
                        "contextKey": "discrepancyUnitInfo",
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
                "contextKey": "performTimeIn",
                "updateKey": "searchCriteriaErrorTitleUUID"
              }
            }
          ]
        }
      }
    };

    actionService.handleAction(timeInMicroServices, instance);

  }

  handleScreenLevelOperation(action, instance, actionService) {
    let dellScreenLevelOperation = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "dellCarStopProcessRCVTrigger",
          "isLocal": false,
          "LocalService": "assets/Responses/dellCarAssessmentMockData.json",
          "requestMethod": "post",
          "body": {
            "locId": "#userSelectedLocation",
            "clientId": "#discrepancyUnitInfo.CLIENT_ID",
            "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
            "bttName": "CR",
            "optName": "#discrepancyUnitInfo.ROUTE",
            "serialNo": "#discrepancyUnitInfo.SERIAL_NO",
            "partNo": "#discrepancyUnitInfo.PART_NO",
            "fat": "#discrepancyUnitInfo.FAT",
            "workCenter": "#discrepancyUnitInfo.WORKCENTER",
            "userName": "#userAccountInfo.PersonalDetails.USERID",
            "itemId": "#discrepancyUnitInfo.ITEM_ID",
            "actionType": "TIMEIN",
            "secResultCode": ""
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
                  "key": "dellCarStopProcessTimeOutData",
                  "data": "responseData"
                }
              },
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getRcvFfValueByCrc",
                  "requestMethod": "get",
                  "params": {
                    "clientId": "#discrepancyUnitInfo.CLIENT_ID",
                    "contractId": "#discrepancyUnitInfo.CONTRACT_ID",
                    "routeName": "IRMA",
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
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
                          "key": "getRcvFfValueByCrcNData",
                          "data": "responseData"
                        }
                      },
                      {
                        "type": "condition",
                        "hookType": "afterInit",
                        "config": {
                          "operation": "isValid",
                          "lhs": "#getRcvFfValueByCrcNData",
                          "lhsKeyName": "ffName",
                          "lhsKeyValue": "nr kuwety",
                          "lhsSecondKeyName": "ffValue"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "dellCarCuvetteNumber",
                                  "data": "#lhsValue"
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
                                                                                  "key": "dellCarHoldCodes",
                                                                                  "data": "responseData"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "getDellCarHoldSubcode",
                                                                                  "data": "responseArray"
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
                                                                                                                "type": "context",
                                                                                                                "config": {
                                                                                                                  "requestMethod": "add",
                                                                                                                  "key": "getTimeInDetailsResp",
                                                                                                                  "data": "responseData"
                                                                                                                }
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "microservice",
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
                                                                                                                  "LocalService": "assets/Responses/getProcessDellCar.json"
                                                                                                                },
                                                                                                                "responseDependents": {
                                                                                                                  "onSuccess": {
                                                                                                                    "actions": [
                                                                                                                      {
                                                                                                                        "type": "context",
                                                                                                                        "config": {
                                                                                                                          "requestMethod": "add",
                                                                                                                          "key": "getProcessWCData",
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
                                                                                                                                "type": "filterDellCarDebugSubmenuData",
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
                                                                                                                          "key": "dellCarwcSubprocess",
                                                                                                                          "compareWith": "#discrepancyUnitInfo.WORKCENTER",
                                                                                                                          "searchProperty": "wcName",
                                                                                                                          "returnProperty": "subProcess",
                                                                                                                          "data": "#getProcessWCData.subProcess.WCOperation"
                                                                                                                        }
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "dellCarWCRenderAction",
                                                                                                                        "config": {
                                                                                                                          "wc": "#discrepancyUnitInfo.WORKCENTER"
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
                                                                                                                          "contextKey": "getProcessWCData",
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
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "dellCarHoldCodes",
                                                                                  "data": []
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
                                              }
                                            ]
                                          }
                                        }
                                      },
                                      {
                                        "type": "getDataFromSaveAndExit"
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
                  "contextKey": "stopErrorMsg",
                  "updateKey": "searchCriteriaErrorTitleUUID"
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



  handleWcRenderActions(action, instance, actionService) {
    let renderAction = [];
    let templateId = "";
    let wc = "";
    if (action.config.wc && action.config.wc != undefined) {
      wc = this.contextService.getDataByString(action.config.wc);
    }
    switch (wc) {
      case 'DELL_CAR_PACKOUT':
        templateId = "dellCarPackoutPacking.json";
        break;
      case 'DELL_CAR_DEBUG':
        this.dellCarRenderCurrentScreenMenu(action, instance, actionService);
        break;
      case 'DELL_CAR_DEBUG_ARC':
        this.dellCarRenderCurrentScreenMenu(action, instance, actionService);
        break;
      // case 'DELL_CAR_2NDLVL_DEBUG':
      //   this.dellCarRenderCurrentScreenMenu(action, instance, actionService)
      //   break;
      default:
        templateId = "";
        break;
    }

    if (templateId !== "") {
      actionService.handleAction({
        "type": "renderTemplate",
        "config": {
          "templateId": templateId,
          "mode": "local"
        }
      }, instance);
    }
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
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "sourceStockLoc",
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
                        "bin": "2BProcessed",
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
                                        "type": "dellCarTimeInMicroServices",
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
                                                "type": "commonScreenLevelOperations",
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
                                                        "type": "dellCarTimeInMicroServices",
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
      }]

    let actions = commonActions;

    actions && actions.forEach((item) => {
      actionService.handleAction(item, instance);
    })
  }

  // Render correct dell Car Screen as per menu items
  dellCarRenderCurrentScreenMenu(action, instance, actionService) {
    let arr = this.contextService.getDataByKey("menuItems");
    let currentMenu = arr && arr.find(x => x.completed === false);
    let commonActions = [];
    if (currentMenu) {
      if (currentMenu.name == "ASSESSMENT") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dellCarRepairAssessment.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "ECN") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dellCarEcn.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "DEBUG") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dellCarDebug.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "DEBUG_ARC") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dellCarDebugArc.json",
            "mode": "local"
          }
        }]
      } else if (currentMenu.name == "2NDLVL_DEBUG") {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dellCar_2NDLVL_debug.json",
            "mode": "local"
          }
        }]
      } else {
        commonActions = [{
          "type": "renderTemplate",
          "config": {
            "templateId": "dellCarRepairAssessment.json",
            "mode": "local"
          }
        }]
      }
    } else {
      commonActions = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "dellCarRepairAssessment.json",
          "mode": "local"
        }
      }]
    }
    commonActions.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }

  filterDellCarDebugSubmenuData(action, instance, actionService) {
    let subprocessMenuData = this.contextService.getDataByKey(action.config.key);
    let unitData = this.contextService.getDataByKey(action.config.unitKey);
    let processData = this.contextService.getDataByKey(action.config.processDataKey);
    let wcName = unitData.WORKCENTER;
    let subprocessMenuDataFin = [];
    let activeWorkCenter = '';

    if (wcName.toUpperCase() === processData.dellCarDebugARCWorkCenterName.toUpperCase()) {
      subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
        if (celement.name.toUpperCase() != processData.dellCarDebugMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellCar2NDLVLDebugMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellCarDebugCIDMenuName.toUpperCase()) {
          subprocessMenuDataFin.push(celement);
        }
      });
    }

    if (wcName.toUpperCase() === processData.dellCarDebugWorkCenterName.toUpperCase()) {
      subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
        if (celement.name.toUpperCase() != processData.dellCarDebugArcMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellCar2NDLVLDebugMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellCarDebugCIDMenuName.toUpperCase()) {
          subprocessMenuDataFin.push(celement);
        }
      });
    }

    if (wcName.toUpperCase() === processData.dellCar2NDLVLDebugWorkCenterName.toUpperCase()) {
      subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
        if (celement.name.toUpperCase() != processData.dellCarDebugArcMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellCarDebugMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellCarDebugCIDMenuName.toUpperCase()) {
          subprocessMenuDataFin.push(celement);
        }
      });
    }

    if (wcName.toUpperCase() === processData.dellCarCIDDebugWorkCenterName.toUpperCase()) {
      subprocessMenuData[0].children.forEach((celement, cindex, cobject) => {
        if (celement.name.toUpperCase() != processData.dellCarDebugArcMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellCarDebugMenuName.toUpperCase() && celement.name.toUpperCase() != processData.dellCar2NDLVLDebugMenuName.toUpperCase()) {
          subprocessMenuDataFin.push(celement);
        }
      });
    }

    if (subprocessMenuDataFin && subprocessMenuDataFin.length > 0) {
      subprocessMenuData[0].children = subprocessMenuDataFin;
      activeWorkCenter = subprocessMenuDataFin[subprocessMenuDataFin.length - 1];
    }

    this.contextService.addToContext('dellCarDebugActiveMenu', activeWorkCenter);
    this.contextService.addToContext(action.config.key, subprocessMenuData);
  }

  checkDellCarDebugScreenRender(action, instance, actionService) {
    let activeMenuData = this.contextService.getDataByKey("dellCarDebugActiveMenu");
    let processData = this.contextService.getDataByKey(action.config.processDataKey);
    let renderAction = [];
    let templateId = '';
    if (activeMenuData && activeMenuData['name'].toUpperCase() === processData.dellCarDebugMenuName.toUpperCase()) {
      templateId = "dellCarDebug.json";
    } else if (activeMenuData && activeMenuData['name'].toUpperCase() === processData.dellCarDebugArcMenuName.toUpperCase()) {
      templateId = "dellCarDebugArc.json";
    } else if (activeMenuData && activeMenuData['name'].toUpperCase() === processData.dellCar2NDLVLDebugMenuName.toUpperCase()) {
      templateId = "dellCar_2NDLVL_debug.json";
    } else {
      templateId = "dellCarDebug.json";
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
}