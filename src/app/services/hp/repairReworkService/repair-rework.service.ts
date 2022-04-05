import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RepairReworkService {

  constructor(
    private contextService: ContextService
  ) { }
  handleCountAction(action, instance) {
    let inc;
    if (action.config && action.config.source.startsWith('#')) {
      inc = this.contextService.getDataByString(action.config.source);
    }
    let incValue = action.config.value;
    if (incValue) {
      incValue = incValue;
    } else {
      incValue = 1;
    }
    // let data;
    inc = parseInt(inc);
    if (action.config.type === "inc") {
      this.contextService.addToContext(action.config.key, inc + incValue);
      // data = inc + incValue
    } else if (action.config.type === "dec") {
      this.contextService.addToContext(action.config.key, inc - incValue);
      // data = inc - incValue
    }
  }

  /// Handle Triggers before timeout
  handleTimeOutAction(action, instance, actionService) {
    let timeOutActions = [{
      "type": "microservice",
      "config": {
        "microserviceId": "hpcommtmooctopus",
        "requestMethod": "post",
        "body": {
          "locationId": "#repairUnitInfo.LOCATION_ID",
          "clientId": "#repairUnitInfo.CLIENT_ID",
          "contractId": "#repairUnitInfo.CONTRACT_ID",
          "serialnumber": "#repairUnitInfo.SERIAL_NO",
          "workOrderId": "#repairUnitInfo.WORKORDER_ID",
          "itemId": "#repairUnitInfo.ITEM_ID",
          "triggerType": "TIMEOUT",
          "username": "#userAccountInfo.PersonalDetails.USERID",
          "resultCode": "PASS_FT"
        },
        "toBeStringified": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "microservice",
              "config": {
                "microserviceId": "getHpCommTmoHddCheck",
                "isLocal": false,
                "LocalService": "assets/Responses/trigger.json",
                "requestMethod": "post",
                "body": {
                  "username": "#userAccountInfo.PersonalDetails.USERID",
                  "processType": "TIMEOUT",
                  "locationId": "#repairUnitInfo.LOCATION_ID",
                  "clientId": "#repairUnitInfo.CLIENT_ID",
                  "contractId": "#repairUnitInfo.CONTRACT_ID",
                  "orderProcessType": "#repairUnitInfo.ROUTE",
                  "workcenterId": "#repairUnitInfo.WORKCENTER_ID",
                  "partnumber": "#repairUnitInfo.PART_NO",
                  "resultCode": "#SelectedDescripencyResultcode",
                  "itemId": "#repairUnitInfo.ITEM_ID",
                  "workcentername": "#discrepancyUnitInfo.WORKCENTER",
                  "serialnumber": "#repairUnitInfo.SERIAL_NO",
                  "ffName": "HDD SERIAL",
                  "ffValue": "#HddSerialOne",
                  "customField1": "octopus",
                  "customField2": "DSN",
                  "customField3": "HP_REWORK"
                },
                "toBeStringified": true
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "handleReworkTimeOut",
                      "eventSource": "click"
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "getHpCommTmoHddCheckData",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "#getHpCommTmoHddCheckData",
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
                "key": "hpcommtmooctopusData",
                "data": "responseData"
              }
            },
            {
              "type": "updateComponent",
              "config": {
                "key": "errorTitleUUID",
                "properties": {
                  "titleValue": "#hpcommtmooctopusData",
                  "isShown": true
                }
              }
            }
          ]
        }
      }
    }];

    if (timeOutActions) {
      timeOutActions.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }

  }

  /// Handle Rework Timeout API
  handleReworkTimeOut(action, instance, actionService) {
    let reworkTimeOutActions = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getCheckAcdcCodes",
          "isLocal": false,
          "LocalService": "assets/Responses/repairMockBIOSResponse.json",
          "requestMethod": "get",
          "params": {
          "itemId": "#repairUnitInfo.ITEM_ID",
          "username": "#userAccountInfo.PersonalDetails.USERID",
          "resultCode": "#SelectedDescripencyResultcode",
          "triggerType": "TIMEOUT"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "performTimeOut",
                  "requestMethod": "post",
                  "body": {
                    "timeOutRequest": {
                      "location": "#repairUnitInfo.GEONAME",
                      "bcn": "#repairUnitInfo.ITEM_BCN",
                      "workCenter": "#repairUnitInfo.WORKCENTER",
                      "password": "#loginUUID.password",
                      "warrantyInd": "false",
                      "notes": "#reworktimeoutNotes.addNote",
                      "resultCode": "#SelectedDescripencyResultcode",
                      "workCenterFlexFieldList": {
                        "flexField": [
                          {
                            "name": "RAM",
                            "value": "#userSelectedRam"
                          },
                          {
                            "name": "UNUSED_PARTS",
                            "value": "#unUsedPartsData"
                          },
                          {
                            "name": "HDD SERIAL",
                            "value": "#HddSerialOne"
                          },
                          {
                            "name": "HDD SERIAL 2",
                            "value": "#HddSerialTwo"
                          },
                          {
                            "name": "HDD SERIAL 3",
                            "value": "#HddSerialThree"
                          },
                          {
                            "name": "HDD SERIAL 4",
                            "value": "#HddSerialFour"
                          },
                          {
                            "name": "DESCRIPTION QUALITY",
                            "value": "#selectedCondition"
                          },
                          {
                            "name": "CT_REW",
                            "value": "#ctSelectedDropDown"
                          },
                          {
                            "name": "Print label",
                            "value": "#printLabelSelectionValue"
                          },
                          {
                            "name": "Product Nr",
                            "value": "#printlabelFormData.productValue"
                          },
                          {
                            "name": "Serial Nr",
                            "value": "#printlabelFormData.serialValue"
                          },
                          {
                            "name": "MODEL NR",
                            "value": "#printlabelFormData.modelNr"
                          },
                          {
                            "name": "MB_PN",
                            "value": "#reworkmb_pnFieldValue"
                          }
                        ]
                      }
                    },
                    "modifyWarranty": 0,
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
                            "config": {
                                "operation": "isEqualTo",
                                "lhs": "#isPartRemovedStatus",
                                "rhs": "YES"
                            },
                            "eventSource": "click",
                            "responseDependents": {
                                "onSuccess": {
                                    "actions": [
                                        {
                                            "type": "microservice",
                                            "config": {
                                              "microserviceId": "onePrint",
                                              "requestMethod": "post",
                                              "body": {
                                                "locationId": "#userSelectedLocation",
                                                "clientId": "#userSelectedClient",
                                                "contractId": "#userSelectedContract",
                                                "warehouseId": "#repairUnitInfo.WAREHOUSE_ID",
                                                "routeCode": "#repairUnitInfo.ROUTE",
                                                "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                                                "eventName": "BYD_1CLICK_GN_COMM_VFT",
                                                "hostName": "#getHostNameResponse.hostName",
                                                "ip": "#getHostNameResponse.ip",
                                                "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                "params": {
                                                  "ITEM_ID": "#repairUnitInfo.ITEM_ID"
                                                }
                                              },
                                              "toBeStringified": true
                                            },
                                            "responseDependents": {
                                              "onSuccess": {
                                                "actions": [
                                                    // make context null again
                                                    {
                                                        "type": "context",
                                                        "config": {
                                                          "requestMethod": "add",
                                                          "key": "isPartRemovedStatus",
                                                          "data": ""
                                                        }
                                                    },
                                                    {
                                                        "type": "condition",
                                                        "config": {
                                                            "operation": "isEqualTo",
                                                            "lhs": "#printLabelSelectionValue",
                                                            "rhs": "YES"
                                                        },
                                                        "eventSource": "click",
                                                        "responseDependents": {
                                                            "onSuccess": {
                                                                "actions": [
                                                                    {
                                                                        "type": "microservice",
                                                                        "config": {
                                                                            "microserviceId": "onePrint",
                                                                            "requestMethod": "post",
                                                                            "body": {
                                                                                "locationId": "#userSelectedLocation",
                                                                                "clientId": "#userSelectedClient",
                                                                                "contractId": "#userSelectedContract",
                                                                                "warehouseId": "#repairUnitInfo.WAREHOUSE_ID",
                                                                                "routeCode": "#repairUnitInfo.ROUTE",
                                                                                "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                                                                                "eventName": "BYD_GN_REWORK_REPRINT",
                                                                                "hostName": "#getHostNameResponse.hostName",
                                                                                "ip": "#getHostNameResponse.ip",
                                                                                "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                                                "params": {
                                                                                    "ITEM_ID": "#repairUnitInfo.ITEM_ID"
                                                                                }
                                                                            },
                                                                            "toBeStringified": true
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
                                                                                        },
                                                                                        "eventSource": "click"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            "onFailure": {
                                                                                "actions": [
                                                                                    {
                                                                                        "type": "context",
                                                                                        "config": {
                                                                                            "requestMethod": "add",
                                                                                            "key": "onePrintResponse",
                                                                                            "data": "responseData"
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                            "key": "errorTitleUUID",
                                                                                            "properties": {
                                                                                                "titleValue": "#onePrintResponse",
                                                                                                "isShown": true
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "clearScreenData"
                                                                                    },
                                                                                    {
                                                                                        "type": "context",
                                                                                        "config": {
                                                                                            "requestMethod": "addToGlobalContext",
                                                                                            "key": "isOnePrintAPIFailed",
                                                                                            "data": true
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
                                                      "key": "onePrintResponse",
                                                      "data": "responseData"
                                                    }
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "errorTitleUUID",
                                                      "properties": {
                                                        "titleValue": "#onePrintResponse",
                                                        "isShown": true
                                                      }
                                                    }
                                                  },
                                                  {
                                                    "type": "context",
                                                    "config": {
                                                      "requestMethod": "addToGlobalContext",
                                                      "key": "isOnePrintAPIFailed",
                                                      "data": true
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
                                                "lhs": "#printLabelSelectionValue",
                                                "rhs": "YES"
                                            },
                                            "eventSource": "click",
                                            "responseDependents": {
                                                "onSuccess": {
                                                    "actions": [
                                                        {
                                                            "type": "microservice",
                                                            "config": {
                                                                "microserviceId": "onePrint",
                                                                "requestMethod": "post",
                                                                "body": {
                                                                    "locationId": "#userSelectedLocation",
                                                                    "clientId": "#userSelectedClient",
                                                                    "contractId": "#userSelectedContract",
                                                                    "warehouseId": "#repairUnitInfo.WAREHOUSE_ID",
                                                                    "routeCode": "#repairUnitInfo.ROUTE",
                                                                    "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                                                                    "eventName": "BYD_GN_REWORK_REPRINT",
                                                                    "hostName": "#getHostNameResponse.hostName",
                                                                    "ip": "#getHostNameResponse.ip",
                                                                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                                    "params": {
                                                                        "ITEM_ID": "#repairUnitInfo.ITEM_ID"
                                                                    }
                                                                },
                                                                "toBeStringified": true
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
                                                                            },
                                                                            "eventSource": "click"
                                                                        }
                                                                    ]
                                                                },
                                                                "onFailure": {
                                                                    "actions": [
                                                                        {
                                                                            "type": "context",
                                                                            "config": {
                                                                                "requestMethod": "add",
                                                                                "key": "onePrintResponse",
                                                                                "data": "responseData"
                                                                            }
                                                                        },
                                                                        {
                                                                            "type": "updateComponent",
                                                                            "config": {
                                                                                "key": "errorTitleUUID",
                                                                                "properties": {
                                                                                    "titleValue": "#onePrintResponse",
                                                                                    "isShown": true
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            "type": "clearScreenData"
                                                                        },
                                                                        {
                                                                            "type": "context",
                                                                            "config": {
                                                                                "requestMethod": "addToGlobalContext",
                                                                                "key": "isOnePrintAPIFailed",
                                                                                "data": true
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
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "getCheckAcdcCodesReworkData",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#getCheckAcdcCodesReworkData",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      }      
    ];

    if (reworkTimeOutActions) {
      reworkTimeOutActions.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }

  getCountdefectCodeOccurance(action, instance, actionService){
    let countDefectcodeData= this.contextService.getDataByKey("defectCodeoccuranceData");
    let countnum;
    let dCodeName;
    let currentTaskdCodeName = action.config.data;
    countDefectcodeData.forEach((obj) => {
        countnum = obj.count;
        dCodeName = obj.DEFECT_CODE_NAME;
        if (countnum == 1 && currentTaskdCodeName == dCodeName) {
            this.contextService.getDataByKey("currentOccurenceData")["defectCodeOccurence"] = 0;
        };
     });
  }

  reworkOccuranceFilter(action, instance, actionService) {
    let getHPFAHistoryData = this.contextService.getDataByKey("getHPFAHistoryResp") || [];
    let occuranceData;
    let indexValue = 0;
    let defectCodeOccurCount="";
    const defectCodeoccuranceData = (getHPFAHistoryData) => {        
        const res = {};
        getHPFAHistoryData.forEach((obj) => {
           const key = `${obj.DEFECT_CODE_NAME}`;
           if (!res[key]) {
              res[key] = { ...obj, count: 0 };
           };
           res[key].count += 1;
           defectCodeOccurCount = res[key].count;
        });
     return Object.values(res);
  };
  this.contextService.addToContext("defectCodeoccuranceData", defectCodeoccuranceData(getHPFAHistoryData));
    getHPFAHistoryData && getHPFAHistoryData.length && getHPFAHistoryData.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID));
    getHPFAHistoryData.length && getHPFAHistoryData.map((item, i) => {
      occuranceData = [{
        "type": "context",
        "config": {
          "requestMethod": "addToExistingContext",
          "target": "defectCodeList",
          "sourceData": {
            "defectCode": item.DEFECT_CODE_NAME
          }
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "addToExistingContext",
          "target": "assemblyCodeList",
          "sourceData": {
            "assemblyCode": item.ASSEMBLY_CODE_NAME
          }
        }
      },

      ]

      if (item.ACTION_CODE_NAME == "29" || item.ACTION_CODE_NAME == "77") {
        let occ = {
          "type": "addOccurenceToContext",
          "hookType": "afterInit",
          "config": {
            "target": "occurenceList",
            "taskUuid": "reworkPartTaskPanelUUID" + indexValue,
            "currentDefectCode": item.DEFECT_CODE_NAME,
            "currentAssemblyCode": item.ASSEMBLY_CODE_NAME
          }
        }
        indexValue++
        occuranceData.push(occ)
      } else {
        let occ = {
          "type": "addOccurenceToContext",
          "hookType": "afterInit",
          "config": {
            "target": "occurenceList",
            "taskUuid": "",
            "currentDefectCode": item.DEFECT_CODE_NAME,
            "currentAssemblyCode": item.ASSEMBLY_CODE_NAME
          }
        }
        occuranceData.push(occ)
      }
      occuranceData.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    });
  }

  handleRemovePartTaskOperation(action, instance, actionService) {
    let hpfaHistoryData;
    let removePartTaskJson= [];
    let dynamicRemovePartUUID = "dynamicRemovePartUUID";
    let dynamicTaskIndex = "";
    let occData = {};
    let undoButtonUUID = "";
    let defRtvDropdownUUID="";
    let actionIDValue = "";
    
    if(action.config.occData && action.config.occData.startsWith('#')){
        occData = this.contextService.getDataByString(action.config.occData);
    }

    if(action.config.actionIDValue){
        actionIDValue = action.config.actionIDValue;
    }

    if(action.config.undoIconUUID){
        undoButtonUUID = action.config.undoIconUUID;
    }
    if(action.config.rtvDrDwnStatusUuid){
        defRtvDropdownUUID = action.config.rtvDrDwnStatusUuid;
    }
    if(action.config.hpfaData && action.config.hpfaData.startsWith('#')){
      hpfaHistoryData = this.contextService.getDataByString(action.config.hpfaData);
    }

    if(action.config.dynamicTaskIndex && action.config.dynamicTaskIndex != "#@"){
      dynamicRemovePartUUID = dynamicRemovePartUUID + action.config.dynamicTaskIndex
      dynamicTaskIndex = action.config.dynamicTaskIndex;
    }

    let removePartTaskData = "removePartTaskData"+dynamicTaskIndex;

    //Below array will contains json structure and config for remove parts
    removePartTaskJson= [
        {
              "type": "microservice",
              "config": {
                  "microserviceId": "getIssuedPartsDetailsRequest",
                  "requestMethod": "get",
                  "isLocal": false,
                  "LocalService": "assets/Responses/IssuedPartsDetails.json",
                  "params": {
                      "locationId": "#repairUnitInfo.LOCATION_ID",
                      "clientId": "#repairUnitInfo.CLIENT_ID",
                      "contractId": "#repairUnitInfo.CONTRACT_ID",
                      "partNo": "#repairUnitInfo.PART_NO",
                      "itemId": "#repairUnitInfo.ITEM_ID",
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
                                  "key": "issuedPartsDetailsRespData",
                                  "data": "responseData"
                              }
                          },
                          {
                              "type" : "specificIssuePartDetails",
                              "config": {
                                  "partNumber": action.config.removePartNumber,
                                  "actionId": actionIDValue,
                                  "hpfaHistory": hpfaHistoryData,
                                  "data": "#issuedPartsDetailsRespData",
                                  "key": removePartTaskData,
                                  "removeTaskTitle": "removeAssemblyCodeName"+dynamicTaskIndex,
                                  "previousIssuedActionIdKey": "previousIssuedPartActionId"+dynamicTaskIndex
                              }
                          },
                          {
                              "type": "microservice",
                              "hookType": "afterInit",
                              "config": {
                                  "microserviceId": "getValuesforFaff",
                                  "requestMethod": "get",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/RemovePartStatus.json",
                                  "params": {
                                      "faffId": "#getReferenceDataKeys.faffId",
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
                                                  "key": "valuesForFaffRespData",
                                                  "data": "responseData"
                                              }
                                          },
                                          {
                                              "type": "createComponent",
                                              "config": {
                                                "targetId": "pageUUID",
                                                "containerId": "bodypage",
                                                "data": {
                                                  "ctype": "taskPanel",
                                                  "title": "",
                                                  "panelClass": "margin-top-10",
                                                  "header": {
                                                      // "title": "Remove - #_assemblyCodeName",
                                                      "title": "#removeAssemblyCodeName"+dynamicTaskIndex,
                                                      "icon": "description",
                                                      "iconClass": "active-header",
                                                      "class": "bold-font"
                                                  },
                                                  // "expanded": true,
                                                  "expanded": false,
                                                  "hideToggle": true,
                                                  "isblueBorder": false,
                                                  "hidden": false,
                                                  "uuid": dynamicRemovePartUUID,
                                                  "visibility": true,
                                                  // "disabled": true,
                                                  "disabled": false,
                                                  "hooks": [
                                                      {
                                                          "type": "microservice",
                                                          "hookType": "afterInit",
                                                          "config": {
                                                              "microserviceId": "getCompByAction",
                                                              "requestMethod": "get",
                                                              "isLocal": false,
                                                              "LocalService": "assets/Responses/compActionDetails.json",
                                                              "params": {
                                                                  "actionId": "#"+removePartTaskData+".actionId",
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
                                                                              "key": "compActionData",
                                                                              "data": "responseData"
                                                                          }
                                                                      },
                                                                      {
                                                                          "type": "prefillComponentSN_PN",
                                                                          "config": {
                                                                              "compActionData": "#compActionData",
                                                                              "txtMode": "Removed",
                                                                              "txtModeContextKey": "txtTypeValue"+dynamicTaskIndex,
                                                                              "removePartFieldUUID" : "removedPartTxtUUID"+dynamicTaskIndex,
                                                                              "removePartFieldName": "removedPartTxt"+dynamicTaskIndex,
                                                                              "removePartContextKey": "removePartNo"+dynamicTaskIndex,
                                                                              "removeNewPartSNFieldUUID": "serailNumTxtUUID"+dynamicTaskIndex,
                                                                              "removeNewPartSNFieldName" : "serailNumTxt"+dynamicTaskIndex,
                                                                              "removeNewPartSNContextKey": "ctPartNo"+dynamicTaskIndex,
                                                                              "removePartDDFieldUUID" : "removedPartDDUUID"+dynamicTaskIndex,
                                                                              "removePartDDFieldName": "removedPartDD"+dynamicTaskIndex
                                                                          }
                                                                      },
                                                                      {
                                                                        "type": "condition",
                                                                        "eventSource": "click",
                                                                        "config": {
                                                                            "operation": "isEqualTo",
                                                                            "lhs": "#txtTypeValue"+dynamicTaskIndex,
                                                                            "rhs": "Removed"
                                                                        },
                                                                        "responseDependents": {
                                                                            "onSuccess": {
                                                                                "actions": [
                                                                                    {
                                                                                        "type": "multipleCondition",
                                                                                        "hookType": "afterInit",
                                                                                        "config": {
                                                                                            "multi": true,
                                                                                            "operator": "OR",
                                                                                            "conditions": [
                                                                                                {
                                                                                                    "operation": "isEqualTo",
                                                                                                    "lhs": "#"+removePartTaskData+".partStatus",
                                                                                                    "rhs": "DOA_in Process"
                                                                                                },
                                                                                                {
                                                                                                    "operation": "isEqualTo",
                                                                                                    "lhs": "#"+removePartTaskData+".partStatus",
                                                                                                    "rhs": "DOA_C1"
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        "responseDependents": {
                                                                                            "onSuccess": {
                                                                                                "actions": [
                                                                                                    {
                                                                                                        "type": "updateComponent",
                                                                                                        "eventSource": "change",
                                                                                                        "config": {
                                                                                                            // "key": "receiptIdUUID#@",
                                                                                                            "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                            "properties": {
                                                                                                                "required": true
                                                                                                            },
                                                                                                            "fieldProperties": {
                                                                                                                // "receiptId#@": ""
                                                                                                                ["receiptId"+dynamicTaskIndex]: "#"+removePartTaskData+".receiptNo"
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
                                                                                                            // "key": "receiptIdUUID#@",
                                                                                                            "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                            "properties": {
                                                                                                                "required": false
                                                                                                            },
                                                                                                            "fieldProperties": {
                                                                                                                // "receiptId#@": ""
                                                                                                                ["receiptId"+dynamicTaskIndex]: ""
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
                                                                                            "key": undoButtonUUID,
                                                                                            "properties": {
                                                                                                "disabled": true
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                            "key": defRtvDropdownUUID,
                                                                                            "properties": {
                                                                                                "disabled": true
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "dynamicRemovePartTaskOrder",
                                                                                        "config": {
                                                                                          "key": "RemovePartTaskSequance",
                                                                                          "mode": "completed",
                                                                                          "uuidKey": dynamicRemovePartUUID
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
                                                                                            "lhs": "#previousIssuedPartActionId"+dynamicTaskIndex
                                                                                        },
                                                                                        "responseDependents": {
                                                                                            "onSuccess": {
                                                                                                "actions": [
                                                                                                    {
                                                                                                        "type": "microservice",
                                                                                                        "config": {
                                                                                                            "microserviceId": "getCompByAction",
                                                                                                            "requestMethod": "get",
                                                                                                            "isLocal": false,
                                                                                                            "LocalService": "assets/Responses/compActionDetails.json",
                                                                                                            "params": {
                                                                                                                "actionId": "#previousIssuedPartActionId"+dynamicTaskIndex,
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
                                                                                                                            "key": "compActionData",
                                                                                                                            "data": "responseData"
                                                                                                                        }
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "type": "prefillComponentSN_PN",
                                                                                                                        "config": {
                                                                                                                            "compActionData": "#compActionData",
                                                                                                                            "txtMode": "Issued",
                                                                                                                            "removePartFieldUUID" : "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                                                            "removePartFieldName": "removedPartTxt"+dynamicTaskIndex,
                                                                                                                            "removePartContextKey": "removePartNo"+dynamicTaskIndex,
                                                                                                                            "removeNewPartSNFieldUUID": "serailNumTxtUUID"+dynamicTaskIndex,
                                                                                                                            "removeNewPartSNFieldName" : "serailNumTxt"+dynamicTaskIndex,
                                                                                                                            "removeNewPartSNContextKey": "ctPartNo"+dynamicTaskIndex,
                                                                                                                            "removePartDDFieldUUID" : "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                                            "removePartDDFieldName": "removedPartDD"+dynamicTaskIndex,
                                                                                                                            "issuePartRecord": "#issuedPartsDetailsRespData"
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
                                                                                                        "type": "checkforSameAssemblyCode",
                                                                                                        "config": {
                                                                                                            "key": "isSameAssemblyPresent"+ dynamicTaskIndex,
                                                                                                            "removePartTaskDetails" : removePartTaskData,
                                                                                                            "issuedPartsData": "#issuedPartsDetailsRespData",
                                                                                                            "removePartTaskPartKey": "removePartTaskPartVal"+ dynamicTaskIndex,
                                                                                                            "sameAssemblyPartKey": "sameAssemblyPartVal"+ dynamicTaskIndex,
                                                                                                            "sameAssemblyActionIDKey": "sameAssemblyActionIDval"+ dynamicTaskIndex
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "type": "condition",
                                                                                                        "config": {
                                                                                                            "operation": "isEqualTo",
                                                                                                            "lhs": "#isSameAssemblyPresent"+ dynamicTaskIndex,
                                                                                                            "rhs": true
                                                                                                        },
                                                                                                        "responseDependents": {
                                                                                                            "onSuccess": {
                                                                                                                "actions": [
                                                                                                                    {
                                                                                                                        "type": "microservice",
                                                                                                                        "config": {
                                                                                                                            "microserviceId": "getProductClassandSubClass",
                                                                                                                            "requestMethod": "get",
                                                                                                                            "isLocal": false,
                                                                                                                            "LocalService": "assets/Responses/getProductClassandSubClass.json",
                                                                                                                            "params": {
                                                                                                                                "partNo": "#sameAssemblyPartVal"+ dynamicTaskIndex
                                                                                                                            }
                                                                                                                        },
                                                                                                                        "responseDependents": {
                                                                                                                            "onSuccess": {
                                                                                                                                "actions": [
                                                                                                                                    {
                                                                                                                                        "type": "context",
                                                                                                                                        "config": {
                                                                                                                                            "requestMethod": "add",
                                                                                                                                            "key": "productClassSameAssemplyVal"+dynamicTaskIndex,
                                                                                                                                            "data": "responseData"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "type": "context",
                                                                                                                                        "config": {
                                                                                                                                            "requestMethod": "add",
                                                                                                                                            // "key": "productClass#@",
                                                                                                                                            "key": "productClassSameAssemply"+dynamicTaskIndex,
                                                                                                                                            "data": "splitData",
                                                                                                                                            "splitKey": "+",
                                                                                                                                            "lKey": "pclass",
                                                                                                                                            "rKey": "subClass"
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "type": "microservice",
                                                                                                                                        "hookType": "afterInit",
                                                                                                                                        "config": {
                                                                                                                                            "microserviceId": "getProductClassandSubClass",
                                                                                                                                            "requestMethod": "get",
                                                                                                                                            "isLocal": false,
                                                                                                                                            "LocalService": "assets/Responses/getProductClassandSubClass.json",
                                                                                                                                            "params": {
                                                                                                                                                "partNo": "#removePartTaskPartVal"+ dynamicTaskIndex
                                                                                                                                            }
                                                                                                                                        },
                                                                                                                                        "responseDependents": {
                                                                                                                                            "onSuccess": {
                                                                                                                                                "actions": [
                                                                                                                                                    {
                                                                                                                                                        "type": "context",
                                                                                                                                                        "config": {
                                                                                                                                                            "requestMethod": "add",
                                                                                                                                                            "key": "productClassRemovePartVal"+dynamicTaskIndex,
                                                                                                                                                            "data": "responseData"
                                                                                                                                                        }
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        "type": "context",
                                                                                                                                                        "config": {
                                                                                                                                                            "requestMethod": "add",
                                                                                                                                                            // "key": "productClass#@",
                                                                                                                                                            "key": "productClassRemovePart"+dynamicTaskIndex,
                                                                                                                                                            "data": "splitData",
                                                                                                                                                            "splitKey": "+",
                                                                                                                                                            "lKey": "pclass",
                                                                                                                                                            "rKey": "subClass"
                                                                                                                                                        }
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        "type": "condition",
                                                                                                                                                        "config": {
                                                                                                                                                            "operation": "isEqualTo",
                                                                                                                                                            "lhs": "#productClassRemovePartVal"+dynamicTaskIndex,
                                                                                                                                                            "rhs": "#productClassSameAssemplyVal"+dynamicTaskIndex
                                                                                                                                                        },
                                                                                                                                                        "eventSource": "click",
                                                                                                                                                        "responseDependents": {
                                                                                                                                                            "onSuccess": {
                                                                                                                                                                "actions": [
                                                                                                                                                                    {
                                                                                                                                                                        "type": "microservice",
                                                                                                                                                                        "config": {
                                                                                                                                                                            "microserviceId": "getCompByAction",
                                                                                                                                                                            "requestMethod": "get",
                                                                                                                                                                            "isLocal": false,
                                                                                                                                                                            "LocalService": "assets/Responses/compActionDetails.json",
                                                                                                                                                                            "params": {
                                                                                                                                                                                "actionId": "#sameAssemblyActionIDval"+ dynamicTaskIndex,
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
                                                                                                                                                                                            "key": "compActionDataProductSub"+dynamicTaskIndex,
                                                                                                                                                                                            "data": "responseData"
                                                                                                                                                                                        }
                                                                                                                                                                                    },
                                                                                                                                                                                    {
                                                                                                                                                                                        "type": "prefillComponentSN_PN",
                                                                                                                                                                                        "config": {
                                                                                                                                                                                            "compActionData": "#compActionDataProductSub"+dynamicTaskIndex,
                                                                                                                                                                                            "txtMode": "Issued",
                                                                                                                                                                                            "removePartFieldUUID" : "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                                                                                                                            "removePartFieldName": "removedPartTxt"+dynamicTaskIndex,
                                                                                                                                                                                            "removePartContextKey": "removePartNo"+dynamicTaskIndex,
                                                                                                                                                                                            "removeNewPartSNFieldUUID": "serailNumTxtUUID"+dynamicTaskIndex,
                                                                                                                                                                                            "removeNewPartSNFieldName" : "serailNumTxt"+dynamicTaskIndex,
                                                                                                                                                                                            "removeNewPartSNContextKey": "ctPartNo"+dynamicTaskIndex,
                                                                                                                                                                                            "removePartDDFieldUUID" : "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                                                                                                            "removePartDDFieldName": "removedPartDD"+dynamicTaskIndex,
                                                                                                                                                                                            "issuePartRecord": "#issuedPartsDetailsRespData"
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
                                                      {
                                                          "type": "microservice",
                                                          "hookType": "afterInit",
                                                          "config": {
                                                              "microserviceId": "getProductClassandSubClass",
                                                              "requestMethod": "get",
                                                              "isLocal": false,
                                                              "LocalService": "assets/Responses/getProductClassandSubClass.json",
                                                              "params": {
                                                                  "partNo": "#"+removePartTaskData+".partNo"
                                                              }
                                                          },
                                                          "responseDependents": {
                                                              "onSuccess": {
                                                                  "actions": [
                                                                      {
                                                                          "type": "context",
                                                                          "config": {
                                                                              "requestMethod": "add",
                                                                              // "key": "productClass#@",
                                                                              "key": "productClass"+dynamicTaskIndex,
                                                                              "data": "splitData",
                                                                              "splitKey": "+",
                                                                              "lKey": "pclass",
                                                                              "rKey": "subClass"
                                                                          }
                                                                      },
                                                                      {
                                                                          "type": "multipleCondition",
                                                                          "config": {
                                                                              "operation": "isEqualToIgnoreCase",
                                                                              "lhs": "MOTHER BOARD",
                                                                              // "rhs": "#productClass#@.subClass"
                                                                              "rhs": "#productClass"+dynamicTaskIndex+".subClass"
                                                                          },
                                                                          "hookType": "afterInit",
                                                                          "responseDependents": {
                                                                              "onSuccess": {
                                                                                  "actions": [
                                                                                      {
                                                                                          "type": "updateComponent",
                                                                                          "config": {
                                                                                              // "key": "removedPartDDUUID#@",
                                                                                              "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                              "properties": {
                                                                                                  "hidden": false,
                                                                                                  "required": true
                                                                                              }
                                                                                          }
                                                                                      },
                                                                                      {
                                                                                          "type": "updateComponent",
                                                                                          "config": {
                                                                                              // "key": "removedPartTxtUUID#@",
                                                                                              "key": "removedPartTxtUUID"+dynamicTaskIndex,
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
                                                                                              // "key": "removedPartDDUUID#@",
                                                                                              "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                              "properties": {
                                                                                                  "hidden": true,
                                                                                                  "required": false
                                                                                              }
                                                                                          }
                                                                                      },
                                                                                      {
                                                                                          "type": "updateComponent",
                                                                                          "config": {
                                                                                              // "key": "removedPartTxtUUID#@",
                                                                                              "key": "removedPartTxtUUID"+dynamicTaskIndex,
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
                                                                        "type": "condition",
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "operation": "isEqualTo",
                                                                          "lhs": "#"+removePartTaskData + ".ownerName",
                                                                          "rhs": "HP"
                                                                        },
                                                                        "eventSource": "click",
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                                {
                                                                                    "type": "condition",
                                                                                    "hookType": "afterInit",
                                                                                    "config": {
                                                                                      "operation": "isEqualTo",
                                                                                      "lhs": "#"+removePartTaskData + ".kitPart",
                                                                                      "rhs": "#"+removePartTaskData + ".partNo"
                                                                                    },
                                                                                    "eventSource": "click",
                                                                                    "responseDependents": {
                                                                                      "onSuccess": {
                                                                                        "actions": [
                                                                                            {
                                                                                                "type": "updateComponent",
                                                                                                "config": {
                                                                                                    "key": "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                                    "fieldProperties": {
                                                                                                        ["removedPartTxt"+dynamicTaskIndex]: "#"+removePartTaskData + ".partNo"
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "updateComponent",
                                                                                                "config": {
                                                                                                    "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                    "isDropDownWithSearch": true,
                                                                                                    "name": "removedPartDD"+dynamicTaskIndex,
                                                                                                    "properties": {
                                                                                                        "defaultValue": "#"+removePartTaskData + ".partNo"
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "context",
                                                                                                "config": {
                                                                                                    "requestMethod": "add",
                                                                                                    "key": "removePartNo"+dynamicTaskIndex,
                                                                                                    "data": "#"+removePartTaskData + ".partNo"
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                      },
                                                                                      "onFailure": {
                                                                                        "actions": [
                                                                                            {
                                                                                                "type": "updateComponent",
                                                                                                "config": {
                                                                                                    "key": "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                                    "fieldProperties": {
                                                                                                        ["removedPartTxt"+dynamicTaskIndex]: "#"+removePartTaskData + ".kitPart"
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "updateComponent",
                                                                                                "config": {
                                                                                                    "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                    "isDropDownWithSearch": true,
                                                                                                    "name": "removedPartDD"+dynamicTaskIndex,
                                                                                                    "properties": {
                                                                                                        "defaultValue": "#"+removePartTaskData + ".kitPart"
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "context",
                                                                                                "config": {
                                                                                                    "requestMethod": "add",
                                                                                                    "key": "removePartNo"+dynamicTaskIndex,
                                                                                                    "data": "#"+removePartTaskData + ".kitPart"
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                      }
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "multipleCondition",
                                                                                    "config": {
                                                                                        "multi": true,
                                                                                        "conditions": [
                                                                                            {
                                                                                                "operation": "isValid",
                                                                                                "lhs": "#removePartNo"+dynamicTaskIndex
                                                                                            },
                                                                                            {
                                                                                                "operation": "isNotValid",
                                                                                                "lhs": "#ctPartNo"+dynamicTaskIndex
                                                                                            }
                                                                                        ]
                                                                                    },
                                                                                    "responseDependents": {
                                                                                        "onSuccess": {
                                                                                            "actions": [
                                                                                                {
                                                                                                    "type": "updateComponent",
                                                                                                    "config": {
                                                                                                        "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                                        "properties": {
                                                                                                            "disabled": false
                                                                                                        }
                                                                                                    },
                                                                                                    "eventSource": "input"
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        "onFailure": {
                                                                                            "actions": [
                                                                                                {
                                                                                                    "type": "updateComponent",
                                                                                                    "config": {
                                                                                                        "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                                        "properties": {
                                                                                                            "disabled": true
                                                                                                        }
                                                                                                    },
                                                                                                    "eventSource": "input"
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
                                                                          "type": "multipleCondition",
                                                                          "config": {
                                                                              "multi": true,
                                                                              "operator": "OR",
                                                                              "conditions": [
                                                                                  {
                                                                                      "operation": "isEqualTo",
                                                                                      "lhs": "#"+removePartTaskData+".transactionType",
                                                                                      "rhs": "Removed"
                                                                                  },
                                                                                  {
                                                                                      "operation": "isEqualCompareArrToIgnoreCase",
                                                                                      // "lhs": "#productClass#@.pclass",
                                                                                      "lhs": "#productClass"+dynamicTaskIndex+".pclass",
                                                                                      "rhs": [
                                                                                          "DRIVE",
                                                                                          "MEMORY",
                                                                                          "KEYPAD",
                                                                                          "NETWORK",
                                                                                          "MODULE",
                                                                                          "BATTERY"
                                                                                      ]
                                                                                  }
                                                                              ]
                                                                          },
                                                                          "hookType": "afterInit",
                                                                          "responseDependents": {
                                                                              "onSuccess": {
                                                                                  "actions": [
                                                                                      {
                                                                                          "type": "updateComponent",
                                                                                          "config": {
                                                                                              // "key": "ctGenerateBtnUUID#@",
                                                                                              "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                              "properties": {
                                                                                                  "visibility": false
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
                                                                                              // "key": "ctGenerateBtnUUID#@",
                                                                                              "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                              "properties": {
                                                                                                  "visibility": true
                                                                                              }
                                                                                          }
                                                                                      }
                                                                                  ]
                                                                              }
                                                                          }
                                                                      },
                                                                      {
                                                                        "type": "multipleCondition",
                                                                        "config": {
                                                                            "operation": "isEqualTo",
                                                                            // "lhs": "#_transactionType",
                                                                            "lhs": "#"+removePartTaskData+".transactionType",
                                                                            "rhs": "Removed"
                                                                        },
                                                                        "responseDependents": {
                                                                            "onSuccess": {
                                                                                "actions": [
                                                                                    {
                                                                                        "type": "disableComponent",
                                                                                        "config": {
                                                                                            // "key": "removedPartDDUUID#@",
                                                                                            // "property": "removedPartDD#@",
                                                                                            "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                            "property": "removedPartDD"+dynamicTaskIndex,
                                                                                            "isNotReset": true
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "disableComponent",
                                                                                        "config": {
                                                                                            // "key": "removedPartTxtUUID#@",
                                                                                            // "property": "removedPartTxt#@",
                                                                                            "key": "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                            "property": "removedPartTxt"+dynamicTaskIndex,
                                                                                            "isNotReset": true
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "disableComponent",
                                                                                        "config": {
                                                                                            // "key": "serailNumTxtUUID#@",
                                                                                            // "property": "serailNumTxt#@",
                                                                                            "key": "serailNumTxtUUID"+dynamicTaskIndex,
                                                                                            "property": "serailNumTxt"+dynamicTaskIndex,
                                                                                            "isNotReset": true
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                            // "key": "ctGenerateBtnUUID#@",
                                                                                            "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                            "properties": {
                                                                                                "visibility": false
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "disableComponent",
                                                                                        "config": {
                                                                                            // "key": "statusDropdownUUID#@",
                                                                                            // "property": "statusDropdown",
                                                                                            "key": "statusDropdownUUID"+dynamicTaskIndex,
                                                                                            "property": "statusDropdownName"+dynamicTaskIndex,
                                                                                            "isNotReset": true
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "disableComponent",
                                                                                        "config": {
                                                                                            // "key": "receiptIdUUID#@",
                                                                                            // "property": "receiptId#@",
                                                                                            "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                            "property": "receiptId"+dynamicTaskIndex,
                                                                                            "isNotReset": true
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "updateComponent",
                                                                                        "config": {
                                                                                            // "key": "removeresetUUID#@",
                                                                                            "key": "removeresetUUID"+dynamicTaskIndex,
                                                                                            "properties": {
                                                                                                "disabled": true
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        "type": "multipleCondition",
                                                                                        "config": {
                                                                                            "operation": "isEqualCompareArrToIgnoreCase",
                                                                                            // "lhs": "#_partStatus",
                                                                                            "lhs": "#"+removePartTaskData+".partStatus",
                                                                                            "rhs": [
                                                                                                "DOA_C1",
                                                                                                "DOA_in Process"
                                                                                            ]
                                                                                        },
                                                                                        "responseDependents": {
                                                                                            "onSuccess": {
                                                                                                "actions": [
                                                                                                    {
                                                                                                        "type": "context",
                                                                                                        "config": {
                                                                                                            "requestMethod": "add",
                                                                                                            // "key": "headerStatus#@",
                                                                                                            "key": "headerStatus"+dynamicTaskIndex,
                                                                                                            "data": "DOA"
                                                                                                        }
                                                                                                    }
                                                                                                ]
                                                                                            },
                                                                                            "onFailure": {
                                                                                                "actions": [
                                                                                                    {
                                                                                                        "type": "multipleCondition",
                                                                                                        "config": {
                                                                                                            "multi": true,
                                                                                                            "operator": "OR",
                                                                                                            "conditions": [
                                                                                                                {
                                                                                                                    "operation": "isEqualCompareArrToIgnoreCase",
                                                                                                                    // "lhs": "#productClass#@.pclass",
                                                                                                                    "lhs": "#productClass"+dynamicTaskIndex+".pclass",
                                                                                                                    "rhs": [
                                                                                                                        "DISPLAY",
                                                                                                                        "DRIVE",
                                                                                                                        "MEMORY",
                                                                                                                        "KEYPAD",
                                                                                                                        "NETWORK",
                                                                                                                        "MODULE"
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    "operation": "isEqualToIgnoreCase",
                                                                                                                    "lhs": "MOTHER BOARD",
                                                                                                                    // "rhs": "#productClass#@.subClass"
                                                                                                                    "rhs": "#productClass"+dynamicTaskIndex+".subClass"
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
                                                                                                                            // "key": "headerStatus#@",
                                                                                                                            "key": "headerStatus"+dynamicTaskIndex,
                                                                                                                            "data": "RTV"
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
                                                                                                                            // "key": "headerStatus#@",
                                                                                                                            "key": "headerStatus"+dynamicTaskIndex,
                                                                                                                            "data": "SCRAP"
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
                                                                                            // "key": "dynamicPanelUUID#@",
                                                                                            "key": dynamicRemovePartUUID,
                                                                                            "properties": {
                                                                                                "expanded": false,
                                                                                                "header": {
                                                                                                    // "title": "Remove - #_assemblyCodeName",
                                                                                                    "title": "#removeAssemblyCodeName"+dynamicTaskIndex,
                                                                                                    "icon": "description",
                                                                                                    // "status": "#headerStatus#@",
                                                                                                    "status": "#headerStatus"+dynamicTaskIndex,
                                                                                                    "statusIcon": "check_circle",
                                                                                                    "statusClass": "complete-status"
                                                                                                }
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
                                                      },
                                                      {
                                                        "type": "updateComponent",
                                                        "hookType": "afterInit",
                                                        "config": {
                                                            "key": "statusDropdownUUID"+dynamicTaskIndex,
                                                            "fieldProperties": {
                                                                ["statusDropdownName"+dynamicTaskIndex]: "#"+removePartTaskData+".partStatus"
                                                            }
                                                        }
                                                      },
                                                      {
                                                        "type": "context",
                                                        "hookType": "afterInit",
                                                        "config": {
                                                            "requestMethod": "add",
                                                            "key": "statusDropdown"+dynamicTaskIndex,
                                                            "data": "#"+removePartTaskData+".partStatus"
                                                        }
                                                      },
                                                      {
                                                        "type": "multipleCondition",
                                                        "hookType": "afterInit",
                                                        "config": {
                                                            "multi": true,
                                                            "operator": "OR",
                                                            "conditions": [
                                                                {
                                                                    "operation": "isEqualTo",
                                                                    "lhs": "#"+removePartTaskData+".partStatus",
                                                                    "rhs": "DOA_in Process"
                                                                },
                                                                {
                                                                    "operation": "isEqualTo",
                                                                    "lhs": "#"+removePartTaskData+".partStatus",
                                                                    "rhs": "DOA_C1"
                                                                }
                                                            ]
                                                        },
                                                        "responseDependents": {
                                                            "onSuccess": {
                                                                "actions": [
                                                                    {
                                                                        "type": "updateComponent",
                                                                        "eventSource": "change",
                                                                        "config": {
                                                                            // "key": "receiptIdUUID#@",
                                                                            "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                            "properties": {
                                                                                "required": true
                                                                            },
                                                                            "fieldProperties": {
                                                                                // "receiptId#@": ""
                                                                                ["receiptId"+dynamicTaskIndex]: ""
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
                                                                                    "operation": "isEqualTo",
                                                                                    "lhs": "#"+removePartTaskData + ".ownerName",
                                                                                    "rhs": "HP"
                                                                                },
                                                                                {
                                                                                    "operation": "isEqualTo",
                                                                                    "lhs": "#"+removePartTaskData+".conditionName",
                                                                                    "rhs": "New"
                                                                                }
                                                                            ]
                                                                        },
                                                                        "responseDependents": {
                                                                            "onSuccess": {
                                                                                "actions": [
                                                                                    {
                                                                                        "type": "disableComponent",
                                                                                        "eventSource": "change",
                                                                                        "config": {
                                                                                            // "key": "receiptIdUUID#@",
                                                                                            // "property": "receiptId#@"
                                                                                            "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                            "property": "receiptId"+dynamicTaskIndex
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            },
                                                                            "onFailure": {
                                                                                "actions": [
                                                                                    {
                                                                                        "type": "enableComponent",
                                                                                        "eventSource": "change",
                                                                                        "config": {
                                                                                            // "key": "receiptIdUUID#@",
                                                                                            // "property": "receiptId#@"
                                                                                            "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                            "property": "receiptId"+dynamicTaskIndex
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
                                                                            // "key": "receiptIdUUID#@",
                                                                            "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                            "properties": {
                                                                                "required": false
                                                                            },
                                                                            "fieldProperties": {
                                                                                // "receiptId#@": ""
                                                                                ["receiptId"+dynamicTaskIndex]: ""
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "disableComponent",
                                                                        "eventSource": "change",
                                                                        "config": {
                                                                            // "key": "receiptIdUUID#@",
                                                                            // "property": "receiptId#@"
                                                                            "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                            "property": "receiptId"+dynamicTaskIndex
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                      }
                                                  ],
                                                  "validations": [],
                                                  "actions": [],
                                                  "items": [
                                                      {
                                                          "ctype": "textField",
                                                          // "uuid": "newPartTxtUUID#@",
                                                          "uuid": "newPartTxtUUID"+dynamicTaskIndex,
                                                          "hooks": [],
                                                          "validations": [],
                                                          "actions": [],
                                                          "type": "text",
                                                          "textfieldClass": "textfield-container body2",
                                                          "formGroupClass": "tan-flexContainer damage-txt-cls noborder-txtfld-cls",
                                                          "labelClass": "subtitle1",
                                                          "submitable": true,
                                                          "readonly": true,
                                                          "label": "New Part",
                                                          "labelPosition": "left",
                                                          // "name": "newPartTxt#@",
                                                          "name": "newPartTxt"+dynamicTaskIndex,
                                                          "defaultValue": "#"+removePartTaskData+".partNo"
                                                          // "defaultValue": "123456-789"
                                                      },
                                                      {
                                                          "ctype": "autoComplete",
                                                          // "uuid": "removedPartDDUUID#@",
                                                          "uuid": "removedPartDDUUID"+dynamicTaskIndex,
                                                          "hooks": [],
                                                          "submitable": true,
                                                          "hidden": false,
                                                          "isUpperCase": true,
                                                          "label": "Removed Part Number",
                                                          "labelPosition": "left",
                                                          // "name": "removedPartDD#@",
                                                          "name": "removedPartDD"+dynamicTaskIndex,
                                                          "formGroupClass": "form-group-margin tan-flexContainer damage-txt-cls",
                                                          "dropdownClass": "textfield-container body2",
                                                          "labelClass": "subtitle1",
                                                          "code": "partNo",
                                                          "displayValue": "completePart",
                                                          "dataSource": "",
                                                          "isSearchToAddContext": true,
                                                          "actions": [
                                                              {
                                                                  "type": "searchToAddContext",
                                                                  "config": [
                                                                      {
                                                                          "requestMethod": "add",
                                                                          // "key": "removePartNo#@",
                                                                          "key": "removePartNo"+dynamicTaskIndex,
                                                                          "event": true
                                                                      },
                                                                      {
                                                                          "type": "multipleCondition",
                                                                          "config": {
                                                                              "operation": "isGreaterThan",
                                                                              // "lhs": "#removePartNo#@.length",
                                                                              "lhs": "#removePartNo"+dynamicTaskIndex+".length",
                                                                              "rhs": 9
                                                                          },
                                                                          "responseDependents": {
                                                                              "onSuccess": {
                                                                                  "actions": [
                                                                                      {
                                                                                          "type": "updateComponent",
                                                                                          "config": {
                                                                                              // "key": "ctGenerateBtnUUID#@",
                                                                                              "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
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
                                                                                              // "key": "ctGenerateBtnUUID#@",
                                                                                              "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
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
                                                              },
                                                              {
                                                                  "type": "searchToAddContext",
                                                                  "config": [
                                                                      {
                                                                          "requestMethod": "add",
                                                                          // "key": "removePartNo#@",
                                                                          "key": "removePartNo"+dynamicTaskIndex,
                                                                          "event": true
                                                                      },
                                                                      {
                                                                          "type": "updateComponent",
                                                                          "config": {
                                                                              // "key": "removedPartDDUUID#@",
                                                                              "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                              "isDropDownWithSearch": true,
                                                                              // "name": "removedPartDD#@",
                                                                              "name": "removedPartDD"+dynamicTaskIndex,
                                                                              "properties": {
                                                                                  // "defaultValue": "#removePartNo#@"
                                                                                  "defaultValue": "#removePartNo"+dynamicTaskIndex
                                                                              }
                                                                          }
                                                                      },
                                                                      {
                                                                          "type": "setFocus",
                                                                          "config": {
                                                                              // "targetId": "serailNumTxtUUID#@"
                                                                              "targetId": "serailNumTxtUUID"+dynamicTaskIndex
                                                                          }
                                                                      },
                                                                      {
                                                                          "type": "multipleCondition",
                                                                          "config": {
                                                                              "operation": "isGreaterThan",
                                                                              // "lhs": "#removePartNo#@.length",
                                                                              "lhs": "#removePartNo"+dynamicTaskIndex+".length",
                                                                              "rhs": 9
                                                                          },
                                                                          "responseDependents": {
                                                                              "onSuccess": {
                                                                                  "actions": [
                                                                                      {
                                                                                          "type": "updateComponent",
                                                                                          "config": {
                                                                                              // "key": "ctGenerateBtnUUID#@",
                                                                                              "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
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
                                                                                              // "key": "ctGenerateBtnUUID#@",
                                                                                              "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
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
                                                                  "eventSource": "selectionChanged"
                                                              },
                                                              {
                                                                  "type": "searchToAddContext",
                                                                  "config": [
                                                                      {
                                                                          "requestMethod": "add",
                                                                          // "key": "removePartNo#@",
                                                                          "key": "removePartNo"+dynamicTaskIndex,
                                                                          "event": true
                                                                      },
                                                                      {
                                                                          "type": "setFocus",
                                                                          "config": {
                                                                              // "targetId": "serailNumTxtUUID#@"
                                                                              "targetId": "serailNumTxtUUID"+dynamicTaskIndex
                                                                          }
                                                                      },
                                                                      {
                                                                        "type": "condition",
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "operation": "isEqualTo",
                                                                          "lhs": "#_ownerName",
                                                                          "rhs": "HP"
                                                                        },
                                                                        "eventSource": "click",
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": []
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                                {
                                                                                    "type": "multipleCondition",
                                                                                    "config": {
                                                                                        "operation": "isGreaterThan",
                                                                                        // "lhs": "#removePartNo#@.length",
                                                                                        "lhs": "#removePartNo"+dynamicTaskIndex+".length",
                                                                                        "rhs": 9
                                                                                    },
                                                                                    "responseDependents": {
                                                                                        "onSuccess": {
                                                                                            "actions": [
                                                                                                {
                                                                                                    "type": "updateComponent",
                                                                                                    "config": {
                                                                                                        // "key": "ctGenerateBtnUUID#@",
                                                                                                        "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                                        "properties": {
                                                                                                            "disabled": false
                                                                                                        }
                                                                                                    },
                                                                                                    "eventSource": "change"
                                                                                                },
                                                                                                {
                                                                                                    "type": "microservice",
                                                                                                    "config": {
                                                                                                        "microserviceId": "getMBPartNo",
                                                                                                        "requestMethod": "get",
                                                                                                        "isLocal": false,
                                                                                                        "LocalService": "assets/Responses/mockVFTMBParts.json",
                                                                                                        "params": {
                                                                                                            "locationId": "#repairUnitInfo.LOCATION_ID",
                                                                                                            "clientId": "#repairUnitInfo.CLIENT_ID",
                                                                                                            "contractId": "#repairUnitInfo.CONTRACT_ID",
                                                                                                            // "partNo": "#removePartNo#@",
                                                                                                            "partNo": "#removePartNo"+dynamicTaskIndex,
                                                                                                            "ownerId": "1835",
                                                                                                            "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                                                                                                                        "key": "removedPartNoValues",
                                                                                                                        "data": "responseData"
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    "type": "updateComponent",
                                                                                                                    "config": {
                                                                                                                        // "key": "removedPartDDUUID#@",
                                                                                                                        "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                                        "isAutoComplete": true,
                                                                                                                        "dropDownProperties": {
                                                                                                                            "options": "#removedPartNoValues"
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    "type": "updateComponent",
                                                                                                                    "config": {
                                                                                                                        // "key": "removedPartDDUUID#@",
                                                                                                                        "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                                        "isDropDownWithSearch": true,
                                                                                                                        // "name": "removedPartDD#@",
                                                                                                                        "name": "removedPartDD"+dynamicTaskIndex,
                                                                                                                        "properties": {
                                                                                                                            // "defaultValue": "#removePartNo#@"
                                                                                                                            "defaultValue": "#removePartNo"+dynamicTaskIndex
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
                                                                                                                        "key": "errorMsg",
                                                                                                                        "data": "responseData"
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    "type": "context",
                                                                                                                    "config": {
                                                                                                                        "requestMethod": "add",
                                                                                                                        "key": "removedPartNoValues",
                                                                                                                        "data": []
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    "type": "updateComponent",
                                                                                                                    "config": {
                                                                                                                        // "key": "removedPartDDUUID#@",
                                                                                                                        "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                                        "isAutoComplete": true,
                                                                                                                        "dropDownProperties": {
                                                                                                                            "options": "#removedPartNoValues"
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    "type": "updateComponent",
                                                                                                                    "config": {
                                                                                                                        // "key": "removedPartDDUUID#@",
                                                                                                                        "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                                        "isDropDownWithSearch": true,
                                                                                                                        // "name": "removedPartDD#@",
                                                                                                                        "name": "removedPartDD#@",
                                                                                                                        "properties": {
                                                                                                                            // "defaultValue": "#removePartNo#@"
                                                                                                                            "defaultValue": "#removePartNo"+dynamicTaskIndex
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    "type": "multipleCondition",
                                                                                                                    "config": {
                                                                                                                        "multi": true,
                                                                                                                        "conditions": [
                                                                                                                            {
                                                                                                                                "operation": "isValid",
                                                                                                                                "lhs": "#errorMsg"
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "operation": "isEqualTo",
                                                                                                                                "lhs": "No record found",
                                                                                                                                "rhs": "#errorMsg"
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    },
                                                                                                                    "responseDependents": {
                                                                                                                        "onSuccess": {
                                                                                                                            "actions": []
                                                                                                                        },
                                                                                                                        "onFailure": {
                                                                                                                            "actions": [
                                                                                                                                {
                                                                                                                                    "type": "updateComponent",
                                                                                                                                    "config": {
                                                                                                                                        "key": "errorTitleUUID",
                                                                                                                                        "properties": {
                                                                                                                                            "titleValue": "#errorMsg",
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
                                                                                                    "type": "updateComponent",
                                                                                                    "config": {
                                                                                                        // "key": "ctGenerateBtnUUID#@",
                                                                                                        "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                                        "properties": {
                                                                                                            "disabled": true
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    "type": "context",
                                                                                                    "config": {
                                                                                                        "requestMethod": "add",
                                                                                                        "key": "removedPartNoValues",
                                                                                                        "data": []
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    "type": "updateComponent",
                                                                                                    "config": {
                                                                                                        // "key": "removedPartDDUUID#@",
                                                                                                        "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                        "isAutoComplete": true,
                                                                                                        "dropDownProperties": {
                                                                                                            "options": "#removedPartNoValues"
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    "type": "updateComponent",
                                                                                                    "config": {
                                                                                                        // "key": "removedPartDDUUID#@",
                                                                                                        "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                        "isDropDownWithSearch": true,
                                                                                                        // "name": "removedPartDD#@",
                                                                                                        "name": "removedPartDD"+dynamicTaskIndex,
                                                                                                        "properties": {
                                                                                                            // "defaultValue": "#removePartNo#@"
                                                                                                            "defaultValue": "#removePartNo"+dynamicTaskIndex
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
                                                                  ],
                                                                  "eventSource": "keydown"
                                                              }
                                                          ]
                                                      },
                                                      {
                                                          "ctype": "textField",
                                                          // "uuid": "removedPartTxtUUID#@",
                                                          "uuid": "removedPartTxtUUID"+dynamicTaskIndex,
                                                          "validateGroup": false,
                                                          "isUpperCase": true,
                                                          "onlyEnterKeyPress": true,
                                                          "hooks": [],
                                                          "validations": [
                                                              {
                                                                  "type": "regex",
                                                                  "script": "^[a-zA-Z0-9_-]{10,}$"
                                                              }
                                                          ],
                                                          "type": "text",
                                                          "textfieldClass": "textfield-container body2",
                                                          "formGroupClass": "tan-flexContainer damage-txt-cls",
                                                          "labelClass": "subtitle1",
                                                          "placeholder": "Scan #",
                                                          "submitable": true,
                                                          "hidden": true,
                                                          "label": "Removed Part Number",
                                                          "labelPosition": "left",
                                                          // "name": "removedPartTxt#@",
                                                          "name": "removedPartTxt"+dynamicTaskIndex,
                                                          "value": "",
                                                          "actions": [
                                                              {
                                                                  "type": "setFocus",
                                                                  "eventSource": "keydown",
                                                                  "config": {
                                                                      // "targetId": "serailNumTxtUUID#@"
                                                                      "targetId": "serailNumTxtUUID"+dynamicTaskIndex
                                                                  }
                                                              },
                                                              {
                                                                  "type": "context",
                                                                  "config": {
                                                                      "requestMethod": "add",
                                                                      // "key": "removePartNo#@",
                                                                      "key": "removePartNo"+dynamicTaskIndex,
                                                                      "data": "elementControlValue"
                                                                  },
                                                                  "eventSource": "input"
                                                              },
                                                              {
                                                                  "type": "multipleCondition",
                                                                  "config": {
                                                                      "multi": true,
                                                                      "conditions": [
                                                                          {
                                                                              "operation": "isValid",
                                                                              // "lhs": "#removePartNo#@"
                                                                              "lhs": "#removePartNo"+dynamicTaskIndex
                                                                          },
                                                                          {
                                                                              "operation": "isNotValid",
                                                                              // "lhs": "#ctPartNo#@"
                                                                              "lhs": "#ctPartNo"+dynamicTaskIndex
                                                                          }
                                                                      ]
                                                                  },
                                                                  "eventSource": "input",
                                                                  "responseDependents": {
                                                                      "onSuccess": {
                                                                          "actions": [
                                                                              {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                      // "key": "ctGenerateBtnUUID#@",
                                                                                      "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                      "properties": {
                                                                                          "disabled": false
                                                                                      }
                                                                                  },
                                                                                  "eventSource": "input"
                                                                              }
                                                                          ]
                                                                      },
                                                                      "onFailure": {
                                                                          "actions": [
                                                                              {
                                                                                  "type": "updateComponent",
                                                                                  "config": {
                                                                                      // "key": "ctGenerateBtnUUID#@",
                                                                                      "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                      "properties": {
                                                                                          "disabled": true
                                                                                      }
                                                                                  },
                                                                                  "eventSource": "input"
                                                                              }
                                                                          ]
                                                                      }
                                                                  }
                                                              },
                                                              {
                                                                  "type": "lengthValidation",
                                                                  "config": {
                                                                      "type": "min",
                                                                      // "value": "#removePartNo#@",
                                                                      "value": "#removePartNo"+dynamicTaskIndex,
                                                                      "length": 30,
                                                                      // "buttonUUID": "removeCompleteBtnUUID#@"
                                                                      "buttonUUID": "removeCompleteBtnUUID"+dynamicTaskIndex
                                                                  },
                                                                  "eventSource": "input"
                                                              }
                                                          ]
                                                      },
                                                      {
                                                          "ctype": "textField",
                                                          // "uuid": "serailNumTxtUUID#@",
                                                          "uuid": "serailNumTxtUUID"+dynamicTaskIndex,
                                                          "hooks": [],
                                                          "validations": [],
                                                          "type": "text",
                                                          "validateGroup": false,
                                                          "onlyEnterKeyPress": true,
                                                          "textfieldClass": "textfield-container body2",
                                                          "formGroupClass": "tan-flexContainer damage-txt-cls",
                                                          "labelClass": "subtitle1",
                                                          "disableCompleteButtonEnterActions": true,
                                                          "placeholder": "Scan #",
                                                          "submitable": true,
                                                          "required": true,
                                                          "disabled": false,
                                                          "isUpperCase": true,
                                                          "label": "CT Number",
                                                          "labelPosition": "left",
                                                          // "name": "serailNumTxt#@",
                                                          "name": "serailNumTxt"+dynamicTaskIndex,
                                                          "value": "",
                                                          "actions": [
                                                              {
                                                                  "type": "context",
                                                                  "config": {
                                                                      "requestMethod": "add",
                                                                      // "key": "ctPartNo#@",
                                                                      "key": "ctPartNo"+dynamicTaskIndex,
                                                                      "data": "elementControlValue"
                                                                  },
                                                                  "eventSource": "input"
                                                              },
                                                              {
                                                                "type": "condition",
                                                                "hookType": "afterInit",
                                                                "config": {
                                                                  "operation": "isEqualTo",
                                                                  "lhs": "#_ownerName",
                                                                  "rhs": "HP"
                                                                },
                                                                "eventSource": "click",
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": []
                                                                  },
                                                                  "onFailure": {
                                                                    "actions": [
                                                                        {
                                                                            "type": "multipleCondition",
                                                                            "config": {
                                                                                "multi": true,
                                                                                "conditions": [
                                                                                    {
                                                                                        "operation": "isEqualCompareArrToIgnoreCase",
                                                                                        // "lhs": "#productClass#@.pclass",
                                                                                        "lhs": "#productClass"+dynamicTaskIndex+".pclass",
                                                                                        "rhs": [
                                                                                            "DISPLAY",
                                                                                            "DRIVE",
                                                                                            "MEMORY",
                                                                                            "KEYPAD",
                                                                                            "NETWORK",
                                                                                            "MODULE",
                                                                                            "BATTERY"
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        "operation": "isValid",
                                                                                        // "lhs": "#ctPartNo#@"
                                                                                        "lhs": "#ctPartNo"+dynamicTaskIndex
                                                                                    }
                                                                                ]
                                                                            },
                                                                            "eventSource": "keydown",
                                                                            "responseDependents": {
                                                                                "onSuccess": {
                                                                                    "actions": [
                                                                                        {
                                                                                            "type": "performOperation",
                                                                                            "eventSource": "keydown",
                                                                                            "config": {
                                                                                                "type": "slice",
                                                                                                // "lhs": "#ctPartNo#@",
                                                                                                // "contextKey": "ctPartAssemblyNo#@"
                                                                                                "lhs": "#ctPartNo"+dynamicTaskIndex,
                                                                                                "contextKey": "ctPartAssemblyNo"+dynamicTaskIndex
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            "type": "microservice",
                                                                                            "eventSource": "keydown",
                                                                                            "config": {
                                                                                                "microserviceId": "getCTDecoderCode",
                                                                                                "requestMethod": "get",
                                                                                                "isLocal": false,
                                                                                                "LocalService": "assets/Responses/mockBGA.json",
                                                                                                "params": {
                                                                                                    "locationId": "#repairUnitInfo.LOCATION_ID",
                                                                                                    "clientId": "#repairUnitInfo.CLIENT_ID",
                                                                                                    "contractId": "#repairUnitInfo.CONTRACT_ID",
                                                                                                    "orderProcessTypeCode": "#repairUnitInfo.ROUTE",
                                                                                                    "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                                                                                                    // "assemblyCode": "#ctPartAssemblyNo#@",
                                                                                                    "assemblyCode": "#ctPartAssemblyNo"+dynamicTaskIndex,
                                                                                                    "username": "#userAccountInfo.PersonalDetails.USERID"
                                                                                                }
                                                                                            },
                                                                                            "responseDependents": {
                                                                                                "onSuccess": {
                                                                                                    "actions": [
                                                                                                        {
                                                                                                            "type": "context",
                                                                                                            "eventSource": "keydown",
                                                                                                            "config": {
                                                                                                                "requestMethod": "add",
                                                                                                                // "key": "tempRemovePartNo#@",
                                                                                                                "key": "tempRemovePartNo"+dynamicTaskIndex,
                                                                                                                "data": "responseData"
                                                                                                            }
                                                                                                        },
                                                                                                        {
                                                                                                            "type": "multipleCondition",
                                                                                                            "eventSource": "keydown",
                                                                                                            "config": {
                                                                                                                "operation": "isValid",
                                                                                                                // "lhs": "#tempRemovePartNo#@"
                                                                                                                "lhs": "#tempRemovePartNo"+dynamicTaskIndex
                                                                                                            },
                                                                                                            "responseDependents": {
                                                                                                                "onSuccess": {
                                                                                                                    "actions": [
                                                                                                                        {
                                                                                                                            "type": "context",
                                                                                                                            "eventSource": "keydown",
                                                                                                                            "config": {
                                                                                                                                "requestMethod": "add",
                                                                                                                                // "key": "removePartNo#@",
                                                                                                                                // "data": "#tempRemovePartNo#@.partNumber"
                                                                                                                                "key": "removePartNo"+dynamicTaskIndex,
                                                                                                                                "data": "#tempRemovePartNo"+dynamicTaskIndex+".partNumber"
                                                                                                                            }
                                                                                                                        },
                                                                                                                        {
                                                                                                                            "type": "updateComponent",
                                                                                                                            "eventSource": "keydown",
                                                                                                                            "config": {
                                                                                                                                // "key": "removedPartTxtUUID#@",
                                                                                                                                "key": "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                                                                "fieldProperties": {
                                                                                                                                    // "removedPartTxt#@": "#removePartNo#@"
                                                                                                                                    ["removedPartTxt"+dynamicTaskIndex]: "#removePartNo"+dynamicTaskIndex
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                "onFailure": {
                                                                                                                    "actions": [
                                                                                                                        {
                                                                                                                            "type": "updateComponent",
                                                                                                                            "eventSource": "keydown",
                                                                                                                            "config": {
                                                                                                                                // "key": "removedPartTxtUUID#@",
                                                                                                                                "key": "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                                                                "fieldProperties": {
                                                                                                                                    // "removedPartTxt#@": ""
                                                                                                                                    ["removedPartTxt"+dynamicTaskIndex]: ""
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
                                                                                    "actions": []
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
                                                          "ctype": "iconText",
                                                          "icon": "",
                                                          "text": "CT Generator",
                                                          "disabled": true,
                                                          "textCss": "",
                                                          "css": "text-decoration: none;font-size:13px",
                                                          "iconPosition": "Before",
                                                          "iconTextClass": "body display-inline ct-generate-icon-btn-cls",
                                                          // "uuid": "ctGenerateBtnUUID#@",
                                                          "uuid": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                          "name": "ctGenerateBtn",
                                                          "hidden": false,
                                                          "setHidden": {
                                                              "operation": "isEqualTo",
                                                              "lhs": "#"+removePartTaskData+".transactionType",
                                                              "rhs": "Removed"
                                                          },
                                                          "actions": [
                                                              {
                                                                  "type": "context",
                                                                  "config": {
                                                                      "requestMethod": "add",
                                                                      // "key": "IQTicks#@",
                                                                      "key": "IQTicks"+dynamicTaskIndex,
                                                                      "data": "dateTimeIQ"
                                                                  },
                                                                  "eventSource": "click"
                                                              },
                                                              {
                                                                  "type": "context",
                                                                  "config": {
                                                                      "requestMethod": "add",
                                                                      // "key": "ctPartNo#@",
                                                                      // "data": "#IQTicks#@"
                                                                      "key": "ctPartNo"+dynamicTaskIndex,
                                                                      "data": "#IQTicks"+dynamicTaskIndex
                                                                  },
                                                                  "eventSource": "click"
                                                              },
                                                              {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                      // "key": "serailNumTxtUUID#@",
                                                                      "key": "serailNumTxtUUID"+dynamicTaskIndex,
                                                                      "fieldProperties": {
                                                                          // "serailNumTxt#@": "#ctPartNo#@"
                                                                          ["serailNumTxt"+dynamicTaskIndex]: "#ctPartNo"+dynamicTaskIndex
                                                                      }
                                                                  },
                                                                  "eventSource": "click"
                                                              },
                                                              {
                                                                  "type": "updateComponent",
                                                                  "config": {
                                                                      // "key": "ctGenerateBtnUUID#@",
                                                                      "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                      "properties": {
                                                                          "disabled": true
                                                                      }
                                                                  },
                                                                  "eventSource": "click"
                                                              }
                                                          ]
                                                      },
                                                      {
                                                          "ctype": "nativeDropdown",
                                                          // "uuid": "statusDropdownUUID#@",
                                                          "uuid": "statusDropdownUUID"+dynamicTaskIndex,
                                                          "label": "Status",
                                                          "hooks": [],
                                                          "required": true,
                                                          "submitable": true,
                                                          "visibility": true,
                                                          "name": "statusDropdownName"+dynamicTaskIndex,
                                                          "formGroupClass": "form-group-margin tan-flexContainer damage-txt-cls",
                                                          "defaultValue": "",
                                                          "dropdownClass": "textfield-container dropdown-container body2",
                                                          "labelClass": "subtitle1",
                                                          "dataSource": "#getValuesforFaff",
                                                          "actions": [
                                                              {
                                                                  "type": "context",
                                                                  "eventSource": "change",
                                                                  "config": {
                                                                      "requestMethod": "add",
                                                                      // "key": "tempStatusDropdown#@",
                                                                      "key": "tempStatusDropdown"+dynamicTaskIndex,
                                                                      "data": "elementControlValue"
                                                                  }
                                                              },
                                                              {
                                                                  "type": "multipleCondition",
                                                                  "eventSource": "change",
                                                                  "config": {
                                                                      "operation": "isEqualTo",
                                                                      // "lhs": "#tempStatusDropdown#@",
                                                                      "lhs": "#tempStatusDropdown"+dynamicTaskIndex,
                                                                      "rhs": "#"+removePartTaskData+".partStatus"
                                                                  },
                                                                  "responseDependents": {
                                                                      "onSuccess": {
                                                                          "actions": [
                                                                              {
                                                                                  "type": "context",
                                                                                  "eventSource": "change",
                                                                                  "config": {
                                                                                      "requestMethod": "add",
                                                                                      // "key": "statusDropdown#@",
                                                                                      // "data": "#tempStatusDropdown#@"
                                                                                      "key": "statusDropdown"+dynamicTaskIndex,
                                                                                      "data": "#tempStatusDropdown"+dynamicTaskIndex
                                                                                  }
                                                                              },
                                                                              {
                                                                                  "type": "multipleCondition",
                                                                                  "eventSource": "change",
                                                                                  "config": {
                                                                                      "multi": true,
                                                                                      "operator": "OR",
                                                                                      "conditions": [
                                                                                          {
                                                                                              "operation": "isEqualTo",
                                                                                              // "lhs": "#statusDropdown#@",
                                                                                              "lhs": "#statusDropdown"+dynamicTaskIndex,
                                                                                              "rhs": "DOA_in Process"
                                                                                          },
                                                                                          {
                                                                                              "operation": "isEqualTo",
                                                                                              // "lhs": "#statusDropdown#@",
                                                                                              "lhs": "#statusDropdown"+dynamicTaskIndex,
                                                                                              "rhs": "DOA_C1"
                                                                                          }
                                                                                      ]
                                                                                  },
                                                                                  "responseDependents": {
                                                                                      "onSuccess": {
                                                                                          "actions": [
                                                                                              {
                                                                                                  "type": "updateComponent",
                                                                                                  "eventSource": "change",
                                                                                                  "config": {
                                                                                                      // "key": "receiptIdUUID#@",
                                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                      "properties": {
                                                                                                          "required": true
                                                                                                      },
                                                                                                      "fieldProperties": {
                                                                                                          // "receiptId#@": ""
                                                                                                          ["receiptId"+dynamicTaskIndex]: ""
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
                                                                                                            "operation": "isEqualTo",
                                                                                                            "lhs": "#"+removePartTaskData + ".ownerName",
                                                                                                            "rhs": "HP"
                                                                                                        },
                                                                                                        {
                                                                                                            "operation": "isEqualTo",
                                                                                                            "lhs": "#"+removePartTaskData+".conditionName",
                                                                                                            "rhs": "New"
                                                                                                        }
                                                                                                    ]
                                                                                                },
                                                                                                "responseDependents": {
                                                                                                    "onSuccess": {
                                                                                                        "actions": [
                                                                                                            {
                                                                                                                "type": "disableComponent",
                                                                                                                "eventSource": "change",
                                                                                                                "config": {
                                                                                                                    // "key": "receiptIdUUID#@",
                                                                                                                    // "property": "receiptId#@"
                                                                                                                    "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                    "property": "receiptId"+dynamicTaskIndex
                                                                                                                }
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    "onFailure": {
                                                                                                        "actions": [
                                                                                                            {
                                                                                                                "type": "enableComponent",
                                                                                                                "eventSource": "change",
                                                                                                                "config": {
                                                                                                                    // "key": "receiptIdUUID#@",
                                                                                                                    // "property": "receiptId#@"
                                                                                                                    "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                    "property": "receiptId"+dynamicTaskIndex
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
                                                                                                      // "key": "receiptIdUUID#@",
                                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                      "properties": {
                                                                                                          "required": false
                                                                                                      },
                                                                                                      "fieldProperties": {
                                                                                                          // "receiptId#@": ""
                                                                                                          ["receiptId"+dynamicTaskIndex]: ""
                                                                                                      }
                                                                                                  }
                                                                                              },
                                                                                              {
                                                                                                  "type": "disableComponent",
                                                                                                  "eventSource": "change",
                                                                                                  "config": {
                                                                                                      // "key": "receiptIdUUID#@",
                                                                                                      // "property": "receiptId#@"
                                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                      "property": "receiptId"+dynamicTaskIndex
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
                                                                                  "type": "dialog",
                                                                                  "uuid": "confirmationDialogUUID",
                                                                                  "config": {
                                                                                      "title": "Part Status change",
                                                                                      "items": [
                                                                                          {
                                                                                              "ctype": "title",
                                                                                              "uuid": "confirmationTitleUUID",
                                                                                              "titleClass": "",
                                                                                              "title": "Do you want to change Part Status ?"
                                                                                          }
                                                                                      ],
                                                                                      "footer": [
                                                                                          {
                                                                                              "ctype": "button",
                                                                                              "color": "primary",
                                                                                              "text": "No",
                                                                                              "uuid": "closeButtonUUID",
                                                                                              "closeType": "close",
                                                                                              "inputClass": "close-button",
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
                                                                                              "text": "Yes",
                                                                                              "uuid": "doneUUID",
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
                                                                                  "eventSource": "change",
                                                                                  "responseDependents": {
                                                                                      "onSuccess": {
                                                                                          "actions": [
                                                                                              {
                                                                                                  "type": "context",
                                                                                                  "eventSource": "change",
                                                                                                  "config": {
                                                                                                      "requestMethod": "add",
                                                                                                      // "key": "statusDropdown#@",
                                                                                                      // "data": "#tempStatusDropdown#@"
                                                                                                      "key": "statusDropdown"+dynamicTaskIndex,
                                                                                                      "data": "#tempStatusDropdown"+dynamicTaskIndex
                                                                                                  }
                                                                                              },
                                                                                            //   {
                                                                                            //     "type": "context",
                                                                                            //     "config": {
                                                                                            //         "requestMethod": "add",
                                                                                            //         "key": "removePartStatusDDValue"+dynamicTaskIndex,
                                                                                            //         "data": "#tempStatusDropdown"+dynamicTaskIndex
                                                                                            //     }
                                                                                            //   },
                                                                                              {
                                                                                                  "type": "updateComponent",
                                                                                                  "eventSource": "change",
                                                                                                  "config": {
                                                                                                      // "key": "statusDropdownUUID#@",
                                                                                                      "key": "statusDropdownUUID"+dynamicTaskIndex,
                                                                                                      "fieldProperties": {
                                                                                                          // "statusDropdown": "#statusDropdown#@"
                                                                                                          ["statusDropdownName"+dynamicTaskIndex]: "#statusDropdown"+dynamicTaskIndex
                                                                                                      }
                                                                                                  }
                                                                                              },
                                                                                              {
                                                                                                  "type": "multipleCondition",
                                                                                                  "eventSource": "change",
                                                                                                  "config": {
                                                                                                      "multi": true,
                                                                                                      "operator": "OR",
                                                                                                      "conditions": [
                                                                                                          {
                                                                                                              "operation": "isEqualTo",
                                                                                                              // "lhs": "#statusDropdown#@",
                                                                                                              "lhs": "#statusDropdown"+dynamicTaskIndex,
                                                                                                              "rhs": "DOA_in Process"
                                                                                                          },
                                                                                                          {
                                                                                                              "operation": "isEqualTo",
                                                                                                              // "lhs": "#statusDropdown#@",
                                                                                                              "lhs": "#statusDropdown"+dynamicTaskIndex,
                                                                                                              "rhs": "DOA_C1"
                                                                                                          }
                                                                                                      ]
                                                                                                  },
                                                                                                  "responseDependents": {
                                                                                                      "onSuccess": {
                                                                                                          "actions": [
                                                                                                              {
                                                                                                                  "type": "updateComponent",
                                                                                                                  "eventSource": "change",
                                                                                                                  "config": {
                                                                                                                      // "key": "receiptIdUUID#@",
                                                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                      "properties": {
                                                                                                                          "required": true
                                                                                                                      },
                                                                                                                      "fieldProperties": {
                                                                                                                          // "receiptId#@": ""
                                                                                                                          ["receiptId"+dynamicTaskIndex]: ""
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
                                                                                                                            "operation": "isEqualTo",
                                                                                                                            "lhs": "#"+removePartTaskData + ".ownerName",
                                                                                                                            "rhs": "HP"
                                                                                                                        },
                                                                                                                        {
                                                                                                                            "operation": "isEqualTo",
                                                                                                                            "lhs": "#"+removePartTaskData+".conditionName",
                                                                                                                            "rhs": "New"
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                "responseDependents": {
                                                                                                                    "onSuccess": {
                                                                                                                        "actions": [
                                                                                                                            {
                                                                                                                                "type": "disableComponent",
                                                                                                                                "eventSource": "change",
                                                                                                                                "config": {
                                                                                                                                    // "key": "receiptIdUUID#@",
                                                                                                                                    // "property": "receiptId#@"
                                                                                                                                    "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                                    "property": "receiptId"+dynamicTaskIndex
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    },
                                                                                                                    "onFailure": {
                                                                                                                        "actions": [
                                                                                                                            {
                                                                                                                                "type": "enableComponent",
                                                                                                                                "eventSource": "change",
                                                                                                                                "config": {
                                                                                                                                    // "key": "receiptIdUUID#@",
                                                                                                                                    // "property": "receiptId#@"
                                                                                                                                    "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                                    "property": "receiptId"+dynamicTaskIndex
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
                                                                                                                      // "key": "receiptIdUUID#@",
                                                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                      "properties": {
                                                                                                                          "required": false
                                                                                                                      },
                                                                                                                      "fieldProperties": {
                                                                                                                          // "receiptId#@": ""
                                                                                                                          ["receiptId"+dynamicTaskIndex]: ""
                                                                                                                      }
                                                                                                                  }
                                                                                                              },
                                                                                                              {
                                                                                                                  "type": "disableComponent",
                                                                                                                  "eventSource": "change",
                                                                                                                  "config": {
                                                                                                                      // "key": "receiptIdUUID#@",
                                                                                                                      // "property": "receiptId#@"
                                                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                      "property": "receiptId"+dynamicTaskIndex
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
                                                                                                      // "key": "statusDropdownUUID#@",
                                                                                                      "key": "statusDropdownUUID"+dynamicTaskIndex,
                                                                                                      "fieldProperties": {
                                                                                                          // "statusDropdown": "#statusDropdown#@"
                                                                                                          ["statusDropdownName"+dynamicTaskIndex]: "#statusDropdown"+dynamicTaskIndex
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
                                                      {
                                                          "ctype": "textField",
                                                          // "uuid": "receiptIdUUID#@",
                                                          "uuid": "receiptIdUUID"+dynamicTaskIndex,
                                                          "hooks": [],
                                                          "validations": [
                                                              {
                                                                  "type": "regex",
                                                                  "script": "^[0-9]*$"
                                                              }
                                                          ],
                                                          "actions": [
                                                              {
                                                                  "type": "context",
                                                                  "config": {
                                                                      "requestMethod": "add",
                                                                      // "key": "receiptIdVal#@",
                                                                      "key": "receiptIdVal"+dynamicTaskIndex,
                                                                      "data": "elementControlValue"
                                                                  },
                                                                  "eventSource": "input"
                                                              }
                                                          ],
                                                          "type": "text",
                                                          "textfieldClass": "textfield-container body2",
                                                          "formGroupClass": "tan-flexContainer damage-txt-cls",
                                                          "labelClass": "subtitle1",
                                                          "placeholder": "Scan #",
                                                          "submitable": true,
                                                          "required": false,
                                                          "disabled": true,
                                                          "label": "Receipt ID",
                                                          "labelPosition": "left",
                                                          // "name": "receiptId#@",
                                                          "name": "receiptId"+dynamicTaskIndex,
                                                          "value": "",
                                                          "setDisabled": {
                                                              "operation": "isEqualTo",
                                                              "lhs": "#"+removePartTaskData+".transactionType",
                                                              "rhs": "Removed"
                                                          }
                                                      }
                                                  ],
                                                  "footer": [
                                                      {
                                                          "ctype": "iconbutton",
                                                          "text": "Reset Form",
                                                          // "uuid": "removeresetUUID#@",
                                                          "uuid": "removeresetUUID"+dynamicTaskIndex,
                                                          "visibility": true,
                                                          "disabled": false,
                                                          "type": "submit",
                                                          "hooks": [],
                                                          "validations": [],
                                                          "icon": "not_interested",
                                                          "iconClass": "resetIcon",
                                                          "actions": [
                                                              {
                                                                "type": "resetData",
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                  "type": "updateComponent",
                                                                  "eventSource": "click",
                                                                  "config": {
                                                                      // "key": "ctGenerateBtnUUID#@",
                                                                      "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                      "properties": {
                                                                          "disabled": true
                                                                      }
                                                                  }
                                                              },
                                                              {
                                                                  "type": "updateComponent",
                                                                  "eventSource": "click",
                                                                  "config": {
                                                                      // "key": "newPartTxtUUID#@",
                                                                      "key": "newPartTxtUUID"+dynamicTaskIndex,
                                                                      "fieldProperties": {
                                                                          // "newPartTxt#@": "#_partNo"
                                                                          ["newPartTxt"+dynamicTaskIndex]: "#"+removePartTaskData+".partNo"
                                                                      }
                                                                  }
                                                              },
                                                              {
                                                                  "type": "context",
                                                                  "eventSource": "click",
                                                                  "config": {
                                                                      "requestMethod": "add",
                                                                      // "key": "statusDropdown#@",
                                                                      "key": "statusDropdown"+dynamicTaskIndex,
                                                                      "data": "#"+removePartTaskData+".partStatus"
                                                                  }
                                                              },
                                                              {
                                                                  "type": "updateComponent",
                                                                  "eventSource": "click",
                                                                  "config": {
                                                                      // "key": "statusDropdownUUID#@",
                                                                      "key": "statusDropdownUUID"+dynamicTaskIndex,
                                                                      "fieldProperties": {
                                                                          // "statusDropdown": "#statusDropdown#@"
                                                                          ["statusDropdownName"+dynamicTaskIndex]: "#statusDropdown"+dynamicTaskIndex
                                                                      }
                                                                  }
                                                              },
                                                              {
                                                                  "type": "multipleCondition",
                                                                  "eventSource": "click",
                                                                  "config": {
                                                                      "multi": true,
                                                                      "operator": "OR",
                                                                      "conditions": [
                                                                          {
                                                                              "operation": "isEqualTo",
                                                                              // "lhs": "#statusDropdown#@",
                                                                              "lhs": "#statusDropdown"+dynamicTaskIndex,
                                                                              "rhs": "DOA_in Process"
                                                                          },
                                                                          {
                                                                              "operation": "isEqualTo",
                                                                              // "lhs": "#statusDropdown#@",
                                                                              "lhs": "#statusDropdown"+dynamicTaskIndex,
                                                                              "rhs": "DOA_C1"
                                                                          }
                                                                      ]
                                                                  },
                                                                  "responseDependents": {
                                                                      "onSuccess": {
                                                                          "actions": [
                                                                              {
                                                                                  "type": "updateComponent",
                                                                                  "eventSource": "change",
                                                                                  "config": {
                                                                                      // "key": "receiptIdUUID#@",
                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                      "properties": {
                                                                                          "required": true
                                                                                      },
                                                                                      "fieldProperties": {
                                                                                          "receiptId#@": ""
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
                                                                                            "operation": "isEqualTo",
                                                                                            "lhs": "#"+removePartTaskData + ".ownerName",
                                                                                            "rhs": "HP"
                                                                                        },
                                                                                        {
                                                                                            "operation": "isEqualTo",
                                                                                            "lhs": "#"+removePartTaskData+".conditionName",
                                                                                            "rhs": "New"
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                "responseDependents": {
                                                                                    "onSuccess": {
                                                                                        "actions": [
                                                                                            {
                                                                                                "type": "disableComponent",
                                                                                                "eventSource": "change",
                                                                                                "config": {
                                                                                                    // "key": "receiptIdUUID#@",
                                                                                                    // "property": "receiptId#@"
                                                                                                    "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                    "property": "receiptId"+dynamicTaskIndex
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    },
                                                                                    "onFailure": {
                                                                                        "actions": [
                                                                                            {
                                                                                                "type": "enableComponent",
                                                                                                "eventSource": "change",
                                                                                                "config": {
                                                                                                    // "key": "receiptIdUUID#@",
                                                                                                    // "property": "receiptId#@"
                                                                                                    "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                    "property": "receiptId"+dynamicTaskIndex
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
                                                                                      // "key": "receiptIdUUID#@",
                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                      "properties": {
                                                                                          "required": false
                                                                                      },
                                                                                      "fieldProperties": {
                                                                                          // "receiptId#@": ""
                                                                                          ["receiptId"+dynamicTaskIndex]: ""
                                                                                      }
                                                                                  }
                                                                              },
                                                                              {
                                                                                  "type": "disableComponent",
                                                                                  "eventSource": "change",
                                                                                  "config": {
                                                                                      // "key": "receiptIdUUID#@",
                                                                                      // "property": "receiptId#@"
                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                      "property": "receiptId"+dynamicTaskIndex
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
                                                          "checkGroupValidity": false,
                                                          "text": "Complete",
                                                          // "uuid": "removeDummyCompleteBtnUUID#@",
                                                          "uuid": "removeDummyCompleteBtnUUID"+dynamicTaskIndex,
                                                          "visibility": false
                                                      },
                                                      {
                                                          "ctype": "button",
                                                          "color": "primary",
                                                          "checkGroupValidity": true,
                                                          "text": "Complete",
                                                          // "uuid": "removeCompleteBtnUUID#@",
                                                          "uuid": "removeCompleteBtnUUID"+dynamicTaskIndex,
                                                          "class": "primary-btn",
                                                          "visibility": true,
                                                          "disabled": true,
                                                          "type": "submit",
                                                          "hooks": [],
                                                          "validations": [],
                                                          "setDisabled": {
                                                              "operation": "isEqualTo",
                                                              "lhs": "#"+removePartTaskData+".transactionType",
                                                              "rhs": "Removed"
                                                          },
                                                          "actions": [
                                                              {
                                                                  "type": "microservice",
                                                                  "eventSource": "click",
                                                                  "config": {
                                                                      "microserviceId": "isPartPresentReceiptTrigger",
                                                                      "requestMethod": "get",
                                                                      "isLocal": false,
                                                                      "LocalService": "assets/Responses/repairMockRamResponse.json",
                                                                      "params": {
                                                                        // "partNo": "#removePartNo#@",
                                                                          "partNo": "#removePartNo"+dynamicTaskIndex,
                                                                          "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                                                                                  "eventSource": "click",
                                                                                  "config": {
                                                                                      "requestMethod": "add",
                                                                                    //   "key": "isPartPresentResp#@",
                                                                                      "key": "isPartPresentResp"+dynamicTaskIndex,
                                                                                      "data": "responseData"
                                                                                  }
                                                                              },
                                                                              {
                                                                                  "type": "multipleCondition",
                                                                                  "config": {
                                                                                      "operation": "isValid",
                                                                                    //   "lhs": "#isPartPresentResp#@"
                                                                                      "lhs": "#isPartPresentResp"+dynamicTaskIndex
                                                                                        // "lhs": "1266"
                                                                                  },
                                                                                  "eventSource": "click",
                                                                                  "responseDependents": {
                                                                                      "onSuccess": {
                                                                                          "actions": [
                                                                                              {
                                                                                                  "type": "multipleCondition",
                                                                                                  "eventSource": "click",
                                                                                                  "config": {
                                                                                                      "operation": "isEqualCompareArrToIgnoreCase",
                                                                                                    //   "lhs": "#statusDropdown#@",
                                                                                                      "lhs": "#statusDropdown"+dynamicTaskIndex,
                                                                                                      "rhs": [
                                                                                                          "DOA_C1",
                                                                                                          "DOA_in Process"
                                                                                                      ]
                                                                                                  },
                                                                                                  "responseDependents": {
                                                                                                      "onSuccess": {
                                                                                                          "actions": [
                                                                                                              {
                                                                                                                  "type": "context",
                                                                                                                  "config": {
                                                                                                                      "requestMethod": "add",
                                                                                                                    //   "key": "headerStatus#@",
                                                                                                                      "key": "headerStatus"+dynamicTaskIndex,
                                                                                                                      "data": "DOA"
                                                                                                                  }
                                                                                                              },
                                                                                                              {
                                                                                                                  "type": "updateComponent",
                                                                                                                  "config": {
                                                                                                                    //   "key": "dynamicPanelUUID#@",
                                                                                                                      "key": dynamicRemovePartUUID,
                                                                                                                      "properties": {
                                                                                                                          "header": {
                                                                                                                            //   "title": "Remove - #_assemblyCodeName",
                                                                                                                            "title": "#removeAssemblyCodeName"+dynamicTaskIndex,
                                                                                                                            "icon": "description",
                                                                                                                            // "status": "#headerStatus#@",
                                                                                                                            "status": "#headerStatus"+dynamicTaskIndex,
                                                                                                                            "iconClass": "active-header",
                                                                                                                            "class": "bold-font"
                                                                                                                          }
                                                                                                                      }
                                                                                                                  }
                                                                                                              }
                                                                                                          ]
                                                                                                      },
                                                                                                      "onFailure": {
                                                                                                          "actions": [
                                                                                                              {
                                                                                                                  "type": "multipleCondition",
                                                                                                                  "config": {
                                                                                                                      "multi": true,
                                                                                                                      "operator": "OR",
                                                                                                                      "conditions": [
                                                                                                                          {
                                                                                                                              "operation": "isEqualCompareArrToIgnoreCase",
                                                                                                                            //   "lhs": "#productClass#@.pclass",
                                                                                                                              "lhs": "#productClass"+dynamicTaskIndex+".pclass",
                                                                                                                              "rhs": [
                                                                                                                                  "DISPLAY",
                                                                                                                                  "DRIVE",
                                                                                                                                  "MEMORY",
                                                                                                                                  "KEYPAD",
                                                                                                                                  "NETWORK",
                                                                                                                                  "MODULE"
                                                                                                                              ]
                                                                                                                          },
                                                                                                                          {
                                                                                                                              "operation": "isEqualToIgnoreCase",
                                                                                                                              "lhs": "MOTHER BOARD",
                                                                                                                            //   "rhs": "#productClass#@.subClass"
                                                                                                                              "rhs": "#productClass"+dynamicTaskIndex+".subClass"
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
                                                                                                                                    //   "key": "headerStatus#@",
                                                                                                                                      "key": "headerStatus"+dynamicTaskIndex,
                                                                                                                                      "data": "RTV"
                                                                                                                                  }
                                                                                                                              },
                                                                                                                              {
                                                                                                                                  "type": "updateComponent",
                                                                                                                                  "config": {
                                                                                                                                    //   "key": "dynamicPanelUUID#@",
                                                                                                                                      "key": dynamicRemovePartUUID,
                                                                                                                                      "properties": {
                                                                                                                                          "header": {
                                                                                                                                            //   "title": "Remove - #_assemblyCodeName",
                                                                                                                                            "title": "#removeAssemblyCodeName"+dynamicTaskIndex,
                                                                                                                                              "icon": "description",
                                                                                                                                            //   "status": "#headerStatus#@",
                                                                                                                                              "status": "#headerStatus"+dynamicTaskIndex,
                                                                                                                                              "iconClass": "active-header",
                                                                                                                                              "class": "bold-font"
                                                                                                                                          }
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
                                                                                                                                    //   "key": "headerStatus#@",
                                                                                                                                      "key": "headerStatus"+dynamicTaskIndex,
                                                                                                                                      "data": "SCRAP"
                                                                                                                                  }
                                                                                                                              },
                                                                                                                              {
                                                                                                                                  "type": "updateComponent",
                                                                                                                                  "config": {
                                                                                                                                    //   "key": "dynamicPanelUUID#@",
                                                                                                                                      "key": dynamicRemovePartUUID,
                                                                                                                                      "properties": {
                                                                                                                                          "header": {
                                                                                                                                            //   "title": "Remove - #_assemblyCodeName",
                                                                                                                                              "title": "#removeAssemblyCodeName"+dynamicTaskIndex,
                                                                                                                                              "icon": "description",
                                                                                                                                            //   "status": "#headerStatus#@",
                                                                                                                                              "status": "#headerStatus"+dynamicTaskIndex,
                                                                                                                                              "iconClass": "active-header",
                                                                                                                                              "class": "bold-font"
                                                                                                                                          }
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
                                                                                              },
                                                                                              {
                                                                                                  "type": "microservice",
                                                                                                  "eventSource": "click",
                                                                                                  "config": {
                                                                                                      "microserviceId": "glbHpRemCommRtv",
                                                                                                      "requestMethod": "post",
                                                                                                      "isLocal": false,
                                                                                                      "LocalService": "assets/Responses/repairMockRamResponse.json",
                                                                                                      "body": {
                                                                                                          "clientId": "#repairUnitInfo.CLIENT_ID",
                                                                                                          "contractId": "#repairUnitInfo.CONTRACT_ID",
                                                                                                          "itemId": "#repairUnitInfo.ITEM_ID",
                                                                                                        //   "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                                                                                                          "workCenterId": "23389", //Need to remove this hardcoded value to getProcessHp once ready.
                                                                                                          "workOrderId": "#repairUnitInfo.WORKORDER_ID",
                                                                                                          "locationId": "#repairUnitInfo.LOCATION_ID",
                                                                                                          "opt": "#repairUnitInfo.ROUTE",
                                                                                                          "userName": "#userAccountInfo.PersonalDetails.USERID",
                                                                                                          "serialNo": "#repairUnitInfo.SERIAL_NO",
                                                                                                          "partNo": "#repairUnitInfo.PART_NO",
                                                                                                          "workCenterName": "#repairUnitInfo.WORKCENTER",
                                                                                                        //   "strReceiptNo": "#receiptIdVal#@",
                                                                                                          "strReceiptNo": "#receiptIdVal"+dynamicTaskIndex,
                                                                                                          "owner": "#"+removePartTaskData+".ownerName",
                                                                                                          "condition": "#"+removePartTaskData+".conditionName",
                                                                                                          "defectCodeList": {
                                                                                                              "defectCode": [
                                                                                                                  {
                                                                                                                      "actioncodeList": {
                                                                                                                          "actionCode": [
                                                                                                                              {
                                                                                                                                  "actioncodeName": "#"+removePartTaskData+".actionCodeName",
                                                                                                                                  "actioncodevalueId": "#"+removePartTaskData+".actionId",
                                                                                                                                  "componentcodeList": {
                                                                                                                                      "defectiveList": [
                                                                                                                                          {
                                                                                                                                              "component": [
                                                                                                                                                  {
                                                                                                                                                      "faflexfieldList": {
                                                                                                                                                          "felxField": [
                                                                                                                                                              {
                                                                                                                                                                  "name": "PART_STATUS",
                                                                                                                                                                //   "value": "#statusDropdown#@"
                                                                                                                                                                "value": "#statusDropdown"+dynamicTaskIndex
                                                                                                                                                              },
                                                                                                                                                              {
                                                                                                                                                                  "name": "Receipt No",
                                                                                                                                                                //   "value": "#receiptIdVal#@"
                                                                                                                                                                  "value": "#receiptIdVal"+dynamicTaskIndex
                                                                                                                                                              }
                                                                                                                                                          ]
                                                                                                                                                      },
                                                                                                                                                    //   "componentSerialNo": "#ctPartNo#@",
                                                                                                                                                    //   "componentPartNo": "#removePartNo#@",
                                                                                                                                                      "componentSerialNo": "#ctPartNo"+dynamicTaskIndex,
                                                                                                                                                      "componentPartNo": "#removePartNo"+dynamicTaskIndex,
                                                                                                                                                      "serializedBulkIndicator": "BCN",
                                                                                                                                                      "owner": "#"+removePartTaskData+".ownerName",
                                                                                                                                                      "condition": "#"+removePartTaskData+".conditionName",
                                                                                                                                                      "sourceList": {
                                                                                                                                                          "source": [
                                                                                                                                                              {
                                                                                                                                                                  "stockingLoc": "RTV_WUR",
                                                                                                                                                                  "bin": "DEFMON"
                                                                                                                                                              }
                                                                                                                                                          ]
                                                                                                                                                      }
                                                                                                                                                  }
                                                                                                                                              ]
                                                                                                                                          }
                                                                                                                                      ]
                                                                                                                                  }
                                                                                                                              }
                                                                                                                          ]
                                                                                                                      }
                                                                                                                  }
                                                                                                              ]
                                                                                                          },
                                                                                                          "productPlatForm": "",
                                                                                                          "flexFields": {
                                                                                                              "flexFieldList": [
                                                                                                                  {
                                                                                                                      "name": "PART_STATUS",
                                                                                                                    //   "value": "#statusDropdown#@"
                                                                                                                      "value": "#statusDropdown"+dynamicTaskIndex
                                                                                                                  },
                                                                                                                  {
                                                                                                                      "name": "Receipt No",
                                                                                                                    //   "value": "#receiptIdVal#@"
                                                                                                                      "value": "#receiptIdVal"+dynamicTaskIndex
                                                                                                                  }
                                                                                                              ]
                                                                                                          }
                                                                                                      },
                                                                                                      "toBeStringified": true,
                                                                                                      "spliceIfEmptyValueObject": [
                                                                                                          {
                                                                                                              "identifier": "flexField",
                                                                                                              "valueField": "value",
                                                                                                              "keyToBeRemoved": "flexFields"
                                                                                                          },
                                                                                                          {
                                                                                                              "identifier": "flexField",
                                                                                                              "valueField": "value",
                                                                                                              "keyToBeRemoved": "faflexfieldList"
                                                                                                          }
                                                                                                      ]
                                                                                                  },
                                                                                                  "responseDependents": {
                                                                                                      "onSuccess": {
                                                                                                          "actions": [
                                                                                                              {
                                                                                                                  "type": "context",
                                                                                                                  "eventSource": "click",
                                                                                                                  "config": {
                                                                                                                      "requestMethod": "add",
                                                                                                                      "key": "removeCondition",
                                                                                                                      "data": "responseData"
                                                                                                                  }
                                                                                                              },
                                                                                                              {
                                                                                                                  "type": "multipleCondition",
                                                                                                                  "config": {
                                                                                                                      "operation": "isEqualTo",
                                                                                                                      "lhs": "#removeCondition.partStatus",
                                                                                                                      "rhs": "Different part status for issued and removed part"
                                                                                                                  },
                                                                                                                  "responseDependents": {
                                                                                                                      "onSuccess": {
                                                                                                                          "actions": [
                                                                                                                              {
                                                                                                                                  "type": "updateComponent",
                                                                                                                                  "config": {
                                                                                                                                      "key": "errorTitleUUID",
                                                                                                                                      "properties": {
                                                                                                                                          "titleValue": "#removeCondition.partStatus",
                                                                                                                                          "isShown": true
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
                                                                                                                  "type": "multipleCondition",
                                                                                                                  "eventSource": "click",
                                                                                                                  "config": {
                                                                                                                      "multi": true,
                                                                                                                      "operator": "OR",
                                                                                                                      "conditions": [
                                                                                                                          {
                                                                                                                              "operation": "isEqualToIgnoreCase",
                                                                                                                              "lhs": "#removeCondition.Condtion",
                                                                                                                              "rhs": "TBE"
                                                                                                                          },
                                                                                                                          {
                                                                                                                              "operation": "isEqualToIgnoreCase",
                                                                                                                              "lhs": "#removeCondition.Condtion",
                                                                                                                              "rhs": "Defective"
                                                                                                                          },
                                                                                                                          {
                                                                                                                              "operation": "isEqualToIgnoreCase",
                                                                                                                              "lhs": "#removeCondition.Condtion",
                                                                                                                              "rhs": "Scrap"
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
                                                                                                                                      "microserviceId": "performRemoveParts",
                                                                                                                                      "requestMethod": "post",
                                                                                                                                      "isLocal": false,
                                                                                                                                      "LocalService": "assets/Responses/repairMockRamResponse.json",
                                                                                                                                      "body": {
                                                                                                                                          "removePartsRequest": {
                                                                                                                                              "bcn": "#repairUnitInfo.ITEM_BCN",
                                                                                                                                              "actionCodeChange": {
                                                                                                                                                  "operation": "Add",
                                                                                                                                                  "actionCode": "#"+removePartTaskData+".actionCodeName",
                                                                                                                                                  "defectCode": {
                                                                                                                                                      "occurrence": occData["defectCodeOccurence"],
                                                                                                                                                      "value": "#"+removePartTaskData+".defectCodeName"
                                                                                                                                                  }
                                                                                                                                              },
                                                                                                                                              "bcnItemList": {
                                                                                                                                                  "item": [
                                                                                                                                                      {
                                                                                                                                                        //   "part": "#removePartNo#@",
                                                                                                                                                          "part": "#removePartNo"+dynamicTaskIndex,
                                                                                                                                                          "owner": "#"+removePartTaskData+".ownerName",
                                                                                                                                                          "condition": "#removeCondition.Condtion",
                                                                                                                                                        //   "serialNumber": "#ctPartNo#@",
                                                                                                                                                          "serialNumber": "#ctPartNo"+dynamicTaskIndex,
                                                                                                                                                          "quantity": "1",
                                                                                                                                                          "bin": {
                                                                                                                                                              "location": "#repairUnitInfo.GEONAME",
                                                                                                                                                              "warehouse": "HP LAPTOP WUR",
                                                                                                                                                              "zone": "#removeCondition.Zone",
                                                                                                                                                              "binName": "#removeCondition.Bin"
                                                                                                                                                          },
                                                                                                                                                          "flexFieldList": {
                                                                                                                                                              "flexField": [
                                                                                                                                                                  {
                                                                                                                                                                      "name": "PART_STATUS",
                                                                                                                                                                    //   "value": "#statusDropdown#@"
                                                                                                                                                                      "value": "#statusDropdown"+dynamicTaskIndex
                                                                                                                                                                  },
                                                                                                                                                                  {
                                                                                                                                                                      "name": "Receipt No",
                                                                                                                                                                    //   "value": "#receiptIdVal#@"
                                                                                                                                                                    "value": "#receiptIdVal"+dynamicTaskIndex
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
                                                                                                                                      "toBeStringified": true,
                                                                                                                                      "spliceIfEmptyValueObject": [
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
                                                                                                                                                "type": "context",
                                                                                                                                                "config": {
                                                                                                                                                  "requestMethod": "add",
                                                                                                                                                  "key": "isPartRemovedStatus",
                                                                                                                                                  "data": "YES"
                                                                                                                                                }
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removedPartDDUUID#@",
                                                                                                                                                    //   "property": "removedPartDD#@",
                                                                                                                                                      "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "removedPartDD"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removedPartTxtUUID#@",
                                                                                                                                                    //   "property": "removedPartTxt#@",
                                                                                                                                                      "key": "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "removedPartTxt"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "serailNumTxtUUID#@",
                                                                                                                                                    //   "property": "serailNumTxt#@",
                                                                                                                                                      "key": "serailNumTxtUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "serailNumTxt"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "ctGenerateBtnUUID#@",
                                                                                                                                                    "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                                                                                      "properties": {
                                                                                                                                                          "visibility": false
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "statusDropdownUUID#@",
                                                                                                                                                      "key": "statusDropdownUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "statusDropdownName"+dynamicTaskIndex, /////
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "receiptIdUUID#@",
                                                                                                                                                    //   "property": "receiptId#@",
                                                                                                                                                    "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "receiptId"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removeresetUUID#@",
                                                                                                                                                      "key": "removeresetUUID"+dynamicTaskIndex,
                                                                                                                                                      "properties": {
                                                                                                                                                          "disabled": true
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removeCompleteBtnUUID#@",
                                                                                                                                                      "key": "removeCompleteBtnUUID"+dynamicTaskIndex,
                                                                                                                                                      "properties": {
                                                                                                                                                          "visibility": false,
                                                                                                                                                          "disabled": true
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removeDummyCompleteBtnUUID#@",
                                                                                                                                                      "key": "removeDummyCompleteBtnUUID"+dynamicTaskIndex,
                                                                                                                                                      "properties": {
                                                                                                                                                          "visibility": true,
                                                                                                                                                          "disabled": true
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "dynamicPanelUUID#@",
                                                                                                                                                      "key": dynamicRemovePartUUID,
                                                                                                                                                      "properties": {
                                                                                                                                                          "expanded": false,
                                                                                                                                                          "disabled": false,
                                                                                                                                                          "header": {
                                                                                                                                                            //   "title": "Remove - #_assemblyCodeName",
                                                                                                                                                              "title": "#removeAssemblyCodeName"+dynamicTaskIndex,
                                                                                                                                                              "icon": "description",
                                                                                                                                                            //   "status": "#headerStatus#@",
                                                                                                                                                              "status": "#headerStatus"+dynamicTaskIndex,
                                                                                                                                                              "statusIcon": "check_circle",
                                                                                                                                                              "statusClass": "complete-status"
                                                                                                                                                          }
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              //1266 undo disabled
                                                                                                                                              {
                                                                                                                                                "type": "updateComponent",
                                                                                                                                                "config": {
                                                                                                                                                    "key": undoButtonUUID,
                                                                                                                                                    "properties": {
                                                                                                                                                        "disabled": true
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                              },                                                                                                                                                                                                    
                                                                                                                                            {
                                                                                                                                                "type": "updateComponent",
                                                                                                                                                "config": {
                                                                                                                                                    "key": defRtvDropdownUUID,
                                                                                                                                                    "properties": {
                                                                                                                                                        "disabled": true
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            },
                                                                                                                                              //Logic for next task expand and current task marked as complete
                                                                                                                                              {
                                                                                                                                                "type": "dynamicRemovePartTaskOrder",
                                                                                                                                                "config": {
                                                                                                                                                  "key": "RemovePartTaskSequance",
                                                                                                                                                  "mode": "completed",
                                                                                                                                                  "uuidKey": dynamicRemovePartUUID
                                                                                                                                                }
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "dynamicRemovePartTaskOrder",
                                                                                                                                                "config": {
                                                                                                                                                  "key": "RemovePartTaskSequance",
                                                                                                                                                  "nextUUIDKey": "RemovePartTaskNextUUIDValue",
                                                                                                                                                  "mode": "nextId",
                                                                                                                                                  "uuidKey": dynamicRemovePartUUID
                                                                                                                                                }
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "condition",
                                                                                                                                                "config": {
                                                                                                                                                    "operation": "isValid",
                                                                                                                                                    "lhs": "#RemovePartTaskNextUUIDValue"
                                                                                                                                                },
                                                                                                                                                "responseDependents": {
                                                                                                                                                    "onSuccess": {
                                                                                                                                                        "actions": [
                                                                                                                                                            {
                                                                                                                                                                "type": "updateComponent",
                                                                                                                                                                "config": {
                                                                                                                                                                    "key": "#RemovePartTaskNextUUIDValue",
                                                                                                                                                                    "properties": {
                                                                                                                                                                        "expanded": true,
                                                                                                                                                                        "disabled": false
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
                                                                                                                                                                    "lhs": "#isAllPartRemoved",
                                                                                                                                                                    "rhs": "Yes"
                                                                                                                                                                },
                                                                                                                                                                "eventSource": "click",
                                                                                                                                                                "responseDependents": {
                                                                                                                                                                    "onSuccess": {
                                                                                                                                                                        "actions": [
                                                                                                                                                                            {
                                                                                                                                                                                "type": "condition",
                                                                                                                                                                                "config": {
                                                                                                                                                                                    "operation": "isEqualTo",
                                                                                                                                                                                    "lhs": "#isInitialAssessmentClicked",
                                                                                                                                                                                    "rhs": true
                                                                                                                                                                                },
                                                                                                                                                                                "eventSource": "click",
                                                                                                                                                                                "responseDependents": {
                                                                                                                                                                                    "onSuccess": {
                                                                                                                                                                                        "actions": [
                                                                                                                                                                                            {
                                                                                                                                                                                                "type": "condition",
                                                                                                                                                                                                "config": {
                                                                                                                                                                                                    "operation": "isEqualTo",
                                                                                                                                                                                                    "lhs": "#taskLength",
                                                                                                                                                                                                    "rhs": "#dynamicTaskPanellength"
                                                                                                                                                                                                },
                                                                                                                                                                                                "eventSource": "click",
                                                                                                                                                                                                "responseDependents": {
                                                                                                                                                                                                    "onSuccess": {
                                                                                                                                                                                                        "actions": [
                                                                                                                                                                                                            {
                                                                                                                                                                                                                "type": "condition",
                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                    "operation": "isEqualTo",
                                                                                                                                                                                                                    "lhs": "#isRecordRamDetailsComplete",
                                                                                                                                                                                                                    "rhs": true
                                                                                                                                                                                                                },
                                                                                                                                                                                                                "responseDependents": {
                                                                                                                                                                                                                    "onSuccess": {
                                                                                                                                                                                                                        "actions": [{
                                                                                                                                                                                                                            "type": "condition",
                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                "operation": "isEqualTo",
                                                                                                                                                                                                                                "lhs": "#isRecordHHDPanelComplete",
                                                                                                                                                                                                                                "rhs": true
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            "eventSource": "click",
                                                                                                                                                                                                                            "responseDependents":{
                                                                                                                                                                                                                                "onSuccess":{
                                                                                                                                                                                                                                    "actions":[
                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                            "type": "condition",
                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                "operation": "isEqualTo",
                                                                                                                                                                                                                                                "lhs": "#isCustomerDescriptionPanelComplete",
                                                                                                                                                                                                                                                "rhs": true
                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                            "eventSource": "click",
                                                                                                                                                                                                                                            "responseDependents":{
                                                                                                                                                                                                                                                "onSuccess":{
                                                                                                                                                                                                                                                    "actions":[
                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                            "type": "condition",
                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                "operation": "isValid",
                                                                                                                                                                                                                                                                "lhs": "#printLabelSelection"
                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                            "eventSource": "click",
                                                                                                                                                                                                                                                            "responseDependents": {
                                                                                                                                                                                                                                                                "onSuccess": {
                                                                                                                                                                                                                                                                    "actions": [
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                            "type": "condition",
                                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                                "operation": "isEqualTo",
                                                                                                                                                                                                                                                                                "lhs": "#isPrintLabelCompleted",
                                                                                                                                                                                                                                                                                "rhs": "Yes"
                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                            "eventSource": "click",
                                                                                                                                                                                                                                                                            "responseDependents": {
                                                                                                                                                                                                                                                                                "onSuccess": {
                                                                                                                                                                                                                                                                                    "actions": [
                                                                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                                                                        "type": "enableComponent",
                                                                                                                                                                                                                                                                                        "config": {
                                                                                                                                                                                                                                                                                          "key": "repairReworkCodesUUID",
                                                                                                                                                                                                                                                                                          "property": "ResultCodes"
                                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                                        "eventSource": "click"
                                                                                                                                                                                                                                                                                      },
                                                                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                                                                        "type": "updateComponent",
                                                                                                                                                                                                                                                                                        "config": {
                                                                                                                                                                                                                                                                                          "key": "repairReworkCodesUUID",
                                                                                                                                                                                                                                                                                          "properties": {
                                                                                                                                                                                                                                                                                            "disabled": false
                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                                        "eventSource": "click"
                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                    ]
                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                "onFailure": {
                                                                                                                                                                                                                                                                                    "actions": [
                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                            "type": "updateComponent",
                                                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                                                "key": "printLabelUUID",
                                                                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                                                                    "expanded": true,
                                                                                                                                                                                                                                                                                                    "disabled": false,
                                                                                                                                                                                                                                                                                                    "hidden": false,
                                                                                                                                                                                                                                                                                                    "header": {
                                                                                                                                                                                                                                                                                                        "title": "Print Label",
                                                                                                                                                                                                                                                                                                        "icon": "description",
                                                                                                                                                                                                                                                                                                        "statusIcon": "hourglass_empty",
                                                                                                                                                                                                                                                                                                        "statusClass": "incomplete-status",
                                                                                                                                                                                                                                                                                                        "iconClass": "active-header"
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                            "eventSource": "click"
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
                                                                                                                                                                                                                                                                                "key": "printLabelUUID",
                                                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                                                    "expanded": false,
                                                                                                                                                                                                                                                                                    "disabled": true,
                                                                                                                                                                                                                                                                                    "hidden": true
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                            "eventSource": "click"
                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                            "type": "enableComponent",
                                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                                "key": "repairReworkCodesUUID",
                                                                                                                                                                                                                                                                                "property": "ResultCodes"
                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                            "eventSource": "click"
                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                            "type": "updateComponent",
                                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                                "key": "repairReworkCodesUUID",
                                                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                                                    "disabled": false
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                            "eventSource": "click"
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    ]
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                    ]
                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                "onFailure":{
                                                                                                                                                                                                                                                    "actions":[
                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                            "type": "updateComponent",
                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                "key": "customerDesNumberUUID",
                                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                                    "expanded": true,
                                                                                                                                                                                                                                                                    "disabled": false,
                                                                                                                                                                                                                                                                    "header": {
                                                                                                                                                                                                                                                                        "title": "Customer Description Assessment",
                                                                                                                                                                                                                                                                        "icon": "description",
                                                                                                                                                                                                                                                                        "statusIcon": "hourglass_empty",
                                                                                                                                                                                                                                                                        "statusClass": "incomplete-status",
                                                                                                                                                                                                                                                                        "iconClass": "active-header"
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
                                                                                                                                                                                                                                "onFailure":{
                                                                                                                                                                                                                                    "actions":[
                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                            "type": "updateComponent",
                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                "key": "repairhddDetailsTaskPanelUUID",
                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                    "expanded": true,
                                                                                                                                                                                                                                                    "disabled": false,
                                                                                                                                                                                                                                                    "header": {
                                                                                                                                                                                                                                                        "title": "Record HDD Details",
                                                                                                                                                                                                                                                        "icon": "description",
                                                                                                                                                                                                                                                        "statusIcon": "hourglass_empty",
                                                                                                                                                                                                                                                        "statusClass": "incomplete-status",
                                                                                                                                                                                                                                                        "iconClass": "active-header"
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
                                                                                                                                                                                                                                "type": "updateComponent",
                                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                                    "key": "reworkrecordRamDetailsUUID",
                                                                                                                                                                                                                                    "properties": {
                                                                                                                                                                                                                                        "expanded": true,
                                                                                                                                                                                                                                        "disabled": false,
                                                                                                                                                                                                                                        "header": {
                                                                                                                                                                                                                                            "title": "Record RAM Details",
                                                                                                                                                                                                                                            "icon": "description",
                                                                                                                                                                                                                                            "statusIcon": "hourglass_empty",
                                                                                                                                                                                                                                            "statusClass": "incomplete-status",
                                                                                                                                                                                                                                            "iconClass": "active-header"
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
                                                                                                                                                                                                                "type": "updateComponent",
                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                    "key": "reworkrecordRamDetailsUUID",
                                                                                                                                                                                                                    "properties": {
                                                                                                                                                                                                                        "expanded": false
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                },
                                                                                                                                                                                                                "eventSource": "click"
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                "type": "stringOperation",
                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                    "key": "reworkPartTaskPanelUUIDtasklengthref",
                                                                                                                                                                                                                    "lstr": "reworkPartTaskPanelUUI",
                                                                                                                                                                                                                    "rstr": "#taskLength",
                                                                                                                                                                                                                    "operation": "concat",
                                                                                                                                                                                                                    "concatSymbol": "D"
                                                                                                                                                                                                                }
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                "type": "updateComponent",
                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                    "key": "#reworkPartTaskPanelUUIDtasklengthref",
                                                                                                                                                                                                                    "properties": {
                                                                                                                                                                                                                        "expanded": true,
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
                                                                                                                                      "microserviceId": "performRemoveParts",
                                                                                                                                      "isLocal": false,
                                                                                                                                      "LocalService": "assets/Responses/repairMockRamResponse.json",
                                                                                                                                      "requestMethod": "post",
                                                                                                                                      "body": {
                                                                                                                                          "removePartsRequest": {
                                                                                                                                              "bcn": "#repairUnitInfo.ITEM_BCN",
                                                                                                                                              "actionCodeChange": {
                                                                                                                                                  "operation": "Add",
                                                                                                                                                  "actionCode": "#"+removePartTaskData+".actionCodeName",
                                                                                                                                                  "defectCode": {
                                                                                                                                                      "occurrence": occData["defectCodeOccurence"],
                                                                                                                                                      "value": "#"+removePartTaskData+".defectCodeName"
                                                                                                                                                  }
                                                                                                                                              },
                                                                                                                                              "nonBcnItemList": {
                                                                                                                                                  "item": [
                                                                                                                                                      {
                                                                                                                                                        //   "part": "#removePartNo#@",
                                                                                                                                                          "part": "#removePartNo"+dynamicTaskIndex,
                                                                                                                                                          "owner": "#"+removePartTaskData+".ownerName",
                                                                                                                                                          "condition": "#removeCondition.Condtion",
                                                                                                                                                        //   "serialNumber": "#ctPartNo#@",
                                                                                                                                                          "serialNumber": "#ctPartNo"+dynamicTaskIndex,
                                                                                                                                                          "quantity": "1",
                                                                                                                                                          "bin": {
                                                                                                                                                              "location": "#repairUnitInfo.GEONAME",
                                                                                                                                                              "warehouse": "HP LAPTOP WUR",
                                                                                                                                                              "zone": "#removeCondition.Zone",
                                                                                                                                                              "binName": "#removeCondition.Bin"
                                                                                                                                                          },
                                                                                                                                                          "flexFieldList": {
                                                                                                                                                              "flexField": [
                                                                                                                                                                  {
                                                                                                                                                                      "name": "PART_STATUS",
                                                                                                                                                                    //   "value": "#statusDropdown#@"
                                                                                                                                                                      "value": "#statusDropdown"+dynamicTaskIndex
                                                                                                                                                                  },
                                                                                                                                                                  {
                                                                                                                                                                      "name": "Receipt No",
                                                                                                                                                                    //   "value": "#receiptIdVal#@"
                                                                                                                                                                      "value": "#receiptIdVal"+dynamicTaskIndex
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
                                                                                                                                      "toBeStringified": true,
                                                                                                                                      "spliceIfEmptyValueObject": [
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
                                                                                                                                                "type": "context",
                                                                                                                                                "config": {
                                                                                                                                                  "requestMethod": "add",
                                                                                                                                                  "key": "isPartRemovedStatus",
                                                                                                                                                  "data": "YES"
                                                                                                                                                }
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removedPartDDUUID#@",
                                                                                                                                                    //   "property": "removedPartDD#@",
                                                                                                                                                      "key": "removedPartDDUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "removedPartDD"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removedPartTxtUUID#@",
                                                                                                                                                    //   "property": "removedPartTxt#@",
                                                                                                                                                      "key": "removedPartTxtUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "removedPartTxt"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "serailNumTxtUUID#@",
                                                                                                                                                    //   "property": "serailNumTxt#@",
                                                                                                                                                      "key": "serailNumTxtUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "serailNumTxt"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "ctGenerateBtnUUID#@",
                                                                                                                                                      "key": "ctGenerateBtnUUID"+dynamicTaskIndex,
                                                                                                                                                      "properties": {
                                                                                                                                                          "visibility": false
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                      "key": "statusDropdownUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "statusDropdownName"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "disableComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "receiptIdUUID#@",
                                                                                                                                                    //   "property": "receiptId#@",
                                                                                                                                                      "key": "receiptIdUUID"+dynamicTaskIndex,
                                                                                                                                                      "property": "receiptId"+dynamicTaskIndex,
                                                                                                                                                      "isNotReset": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removeresetUUID#@",
                                                                                                                                                      "key": "removeresetUUID"+dynamicTaskIndex,
                                                                                                                                                      "properties": {
                                                                                                                                                          "disabled": true
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removeCompleteBtnUUID#@",
                                                                                                                                                      "key": "removeCompleteBtnUUID"+dynamicTaskIndex,
                                                                                                                                                      "properties": {
                                                                                                                                                          "visibility": false,
                                                                                                                                                          "disabled": true
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "removeDummyCompleteBtnUUID#@",
                                                                                                                                                      "key": "removeDummyCompleteBtnUUID"+dynamicTaskIndex,
                                                                                                                                                      "properties": {
                                                                                                                                                          "visibility": true,
                                                                                                                                                          "disabled": true
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                    //   "key": "dynamicPanelUUID#@",
                                                                                                                                                      "key": dynamicRemovePartUUID,
                                                                                                                                                      "properties": {
                                                                                                                                                          "expanded": false,
                                                                                                                                                          "disabled": false,
                                                                                                                                                          "header": {
                                                                                                                                                            //   "title": "Remove - #_assemblyCodeName",
                                                                                                                                                              "title": "#removeAssemblyCodeName"+dynamicTaskIndex,
                                                                                                                                                              "icon": "description",
                                                                                                                                                            //   "status": "#headerStatus#@",
                                                                                                                                                              "status": "#headerStatus"+dynamicTaskIndex,
                                                                                                                                                              "statusIcon": "check_circle",
                                                                                                                                                              "statusClass": "complete-status"
                                                                                                                                                          }
                                                                                                                                                      }
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              //1266 undo disabled 
                                                                                                                                              {
                                                                                                                                                "type": "updateComponent",
                                                                                                                                                "config": {
                                                                                                                                                    "key": undoButtonUUID,
                                                                                                                                                    "properties": {
                                                                                                                                                        "disabled": true
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                              },                                                                                                                                                                                                    
                                                                                                                                              {
                                                                                                                                                  "type": "updateComponent",
                                                                                                                                                  "config": {
                                                                                                                                                      "key": defRtvDropdownUUID,
                                                                                                                                                      "properties": {
                                                                                                                                                          "disabled": true
                                                                                                                                                      }
                                                                                                                                                  }
                                                                                                                                              },
                                                                                                                                              //Logic for next task expand and current task marked as complete
                                                                                                                                              {
                                                                                                                                                "type": "dynamicRemovePartTaskOrder",
                                                                                                                                                "config": {
                                                                                                                                                  "key": "RemovePartTaskSequance",
                                                                                                                                                  "mode": "completed",
                                                                                                                                                  "uuidKey": dynamicRemovePartUUID
                                                                                                                                                }
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "dynamicRemovePartTaskOrder",
                                                                                                                                                "config": {
                                                                                                                                                  "key": "RemovePartTaskSequance",
                                                                                                                                                  "nextUUIDKey": "RemovePartTaskNextUUIDValue",
                                                                                                                                                  "mode": "nextId",
                                                                                                                                                  "uuidKey": dynamicRemovePartUUID
                                                                                                                                                }
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "condition",
                                                                                                                                                "config": {
                                                                                                                                                    "operation": "isValid",
                                                                                                                                                    "lhs": "#RemovePartTaskNextUUIDValue"
                                                                                                                                                },
                                                                                                                                                "responseDependents": {
                                                                                                                                                    "onSuccess": {
                                                                                                                                                        "actions": [
                                                                                                                                                            {
                                                                                                                                                                "type": "updateComponent",
                                                                                                                                                                "config": {
                                                                                                                                                                    "key": "#RemovePartTaskNextUUIDValue",
                                                                                                                                                                    "properties": {
                                                                                                                                                                        "expanded": true,
                                                                                                                                                                        "disabled": false,
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
                                                                                                                                                                    "lhs": "#isAllPartRemoved",
                                                                                                                                                                    "rhs": "Yes"
                                                                                                                                                                },
                                                                                                                                                                "eventSource": "click",
                                                                                                                                                                "responseDependents": {
                                                                                                                                                                    "onSuccess": {
                                                                                                                                                                        "actions": [
                                                                                                                                                                            {
                                                                                                                                                                                "type": "condition",
                                                                                                                                                                                "config": {
                                                                                                                                                                                    "operation": "isEqualTo",
                                                                                                                                                                                    "lhs": "#isInitialAssessmentClicked",
                                                                                                                                                                                    "rhs": true
                                                                                                                                                                                },
                                                                                                                                                                                "eventSource": "click",
                                                                                                                                                                                "responseDependents": {
                                                                                                                                                                                    "onSuccess": {
                                                                                                                                                                                        "actions": [
                                                                                                                                                                                            {
                                                                                                                                                                                                "type": "condition",
                                                                                                                                                                                                "config": {
                                                                                                                                                                                                    "operation": "isEqualTo",
                                                                                                                                                                                                    "lhs": "#taskLength",
                                                                                                                                                                                                    "rhs": "#dynamicTaskPanellength"
                                                                                                                                                                                                },
                                                                                                                                                                                                "eventSource": "click",
                                                                                                                                                                                                "responseDependents": {
                                                                                                                                                                                                    "onSuccess": {
                                                                                                                                                                                                        "actions": [
                                                                                                                                                                                                            {
                                                                                                                                                                                                                "type": "condition",
                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                    "operation": "isEqualTo",
                                                                                                                                                                                                                    "lhs": "#isRecordRamDetailsComplete",
                                                                                                                                                                                                                    "rhs": true
                                                                                                                                                                                                                },
                                                                                                                                                                                                                "responseDependents": {
                                                                                                                                                                                                                    "onSuccess": {
                                                                                                                                                                                                                        "actions": [{
                                                                                                                                                                                                                            "type": "condition",
                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                "operation": "isEqualTo",
                                                                                                                                                                                                                                "lhs": "#isRecordHHDPanelComplete",
                                                                                                                                                                                                                                "rhs": true
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            "eventSource": "click",
                                                                                                                                                                                                                            "responseDependents":{
                                                                                                                                                                                                                                "onSuccess":{
                                                                                                                                                                                                                                    "actions":[
                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                            "type": "condition",
                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                "operation": "isEqualTo",
                                                                                                                                                                                                                                                "lhs": "#isCustomerDescriptionPanelComplete",
                                                                                                                                                                                                                                                "rhs": true
                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                            "eventSource": "click",
                                                                                                                                                                                                                                            "responseDependents":{
                                                                                                                                                                                                                                                "onSuccess":{
                                                                                                                                                                                                                                                    "actions":[
                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                            "type": "condition",
                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                "operation": "isValid",
                                                                                                                                                                                                                                                                "lhs": "#printLabelSelection"
                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                            "eventSource": "click",
                                                                                                                                                                                                                                                            "responseDependents": {
                                                                                                                                                                                                                                                                "onSuccess": {
                                                                                                                                                                                                                                                                    "actions": [
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                            "type": "condition",
                                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                                "operation": "isEqualTo",
                                                                                                                                                                                                                                                                                "lhs": "#isPrintLabelCompleted",
                                                                                                                                                                                                                                                                                "rhs": "Yes"
                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                            "eventSource": "click",
                                                                                                                                                                                                                                                                            "responseDependents": {
                                                                                                                                                                                                                                                                                "onSuccess": {
                                                                                                                                                                                                                                                                                    "actions": [
                                                                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                                                                        "type": "enableComponent",
                                                                                                                                                                                                                                                                                        "config": {
                                                                                                                                                                                                                                                                                          "key": "repairReworkCodesUUID",
                                                                                                                                                                                                                                                                                          "property": "ResultCodes"
                                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                                        "eventSource": "click"
                                                                                                                                                                                                                                                                                      },
                                                                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                                                                        "type": "updateComponent",
                                                                                                                                                                                                                                                                                        "config": {
                                                                                                                                                                                                                                                                                          "key": "repairReworkCodesUUID",
                                                                                                                                                                                                                                                                                          "properties": {
                                                                                                                                                                                                                                                                                            "disabled": false
                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                                        "eventSource": "click"
                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                    ]
                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                "onFailure": {
                                                                                                                                                                                                                                                                                    "actions": [
                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                            "type": "updateComponent",
                                                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                                                "key": "printLabelUUID",
                                                                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                                                                    "expanded": true,
                                                                                                                                                                                                                                                                                                    "disabled": false,
                                                                                                                                                                                                                                                                                                    "hidden": false,
                                                                                                                                                                                                                                                                                                    "header": {
                                                                                                                                                                                                                                                                                                        "title": "Print Label",
                                                                                                                                                                                                                                                                                                        "icon": "description",
                                                                                                                                                                                                                                                                                                        "statusIcon": "hourglass_empty",
                                                                                                                                                                                                                                                                                                        "statusClass": "incomplete-status",
                                                                                                                                                                                                                                                                                                        "iconClass": "active-header"
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                            "eventSource": "click"
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
                                                                                                                                                                                                                                                                                "key": "printLabelUUID",
                                                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                                                    "expanded": false,
                                                                                                                                                                                                                                                                                    "disabled": true,
                                                                                                                                                                                                                                                                                    "hidden": true
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                            "eventSource": "click"
                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                            "type": "enableComponent",
                                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                                "key": "repairReworkCodesUUID",
                                                                                                                                                                                                                                                                                "property": "ResultCodes"
                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                            "eventSource": "click"
                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                            "type": "updateComponent",
                                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                                "key": "repairReworkCodesUUID",
                                                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                                                    "disabled": false
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                            "eventSource": "click"
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    ]
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                    ]
                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                "onFailure":{
                                                                                                                                                                                                                                                    "actions":[
                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                            "type": "updateComponent",
                                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                                "key": "customerDesNumberUUID",
                                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                                    "expanded": true,
                                                                                                                                                                                                                                                                    "disabled": false,
                                                                                                                                                                                                                                                                    "header": {
                                                                                                                                                                                                                                                                        "title": "Customer Description Assessment",
                                                                                                                                                                                                                                                                        "icon": "description",
                                                                                                                                                                                                                                                                        "statusIcon": "hourglass_empty",
                                                                                                                                                                                                                                                                        "statusClass": "incomplete-status",
                                                                                                                                                                                                                                                                        "iconClass": "active-header"
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
                                                                                                                                                                                                                                "onFailure":{
                                                                                                                                                                                                                                    "actions":[
                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                            "type": "updateComponent",
                                                                                                                                                                                                                                            "config": {
                                                                                                                                                                                                                                                "key": "repairhddDetailsTaskPanelUUID",
                                                                                                                                                                                                                                                "properties": {
                                                                                                                                                                                                                                                    "expanded": true,
                                                                                                                                                                                                                                                    "disabled": false,
                                                                                                                                                                                                                                                    "header": {
                                                                                                                                                                                                                                                        "title": "Record HDD Details",
                                                                                                                                                                                                                                                        "icon": "description",
                                                                                                                                                                                                                                                        "statusIcon": "hourglass_empty",
                                                                                                                                                                                                                                                        "statusClass": "incomplete-status",
                                                                                                                                                                                                                                                        "iconClass": "active-header"
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
                                                                                                                                                                                                                                "type": "updateComponent",
                                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                                    "key": "reworkrecordRamDetailsUUID",
                                                                                                                                                                                                                                    "properties": {
                                                                                                                                                                                                                                        "expanded": true,
                                                                                                                                                                                                                                        "disabled": false,
                                                                                                                                                                                                                                        "header": {
                                                                                                                                                                                                                                            "title": "Record RAM Details",
                                                                                                                                                                                                                                            "icon": "description",
                                                                                                                                                                                                                                            "statusIcon": "hourglass_empty",
                                                                                                                                                                                                                                            "statusClass": "incomplete-status",
                                                                                                                                                                                                                                            "iconClass": "active-header"
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
                                                                                                                                                                                                                "type": "updateComponent",
                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                    "key": "reworkrecordRamDetailsUUID",
                                                                                                                                                                                                                    "properties": {
                                                                                                                                                                                                                        "expanded": false
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                },
                                                                                                                                                                                                                "eventSource": "click"
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                "type": "stringOperation",
                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                    "key": "reworkPartTaskPanelUUIDtasklengthref",
                                                                                                                                                                                                                    "lstr": "reworkPartTaskPanelUUI",
                                                                                                                                                                                                                    "rstr": "#taskLength",
                                                                                                                                                                                                                    "operation": "concat",
                                                                                                                                                                                                                    "concatSymbol": "D"
                                                                                                                                                                                                                }
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                "type": "updateComponent",
                                                                                                                                                                                                                "config": {
                                                                                                                                                                                                                    "key": "#reworkPartTaskPanelUUIDtasklengthref",
                                                                                                                                                                                                                    "properties": {
                                                                                                                                                                                                                        "expanded": true,
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
                                                                                                  "eventSource": "click",
                                                                                                  "config": {
                                                                                                      "key": "errorTitleUUID",
                                                                                                      "properties": {
                                                                                                          "titleValue": "Part No Does Not Exists In SL",
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
                                                      }
                                                  ]
                                                }
                                              }
                                          },
                                          {
                                            "type": "dynamicRemovePartTaskOrder",
                                            "config": {
                                              "key": "RemovePartTaskSequance",
                                              "mode": "Add",
                                              "uuidKey": dynamicRemovePartUUID
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
                                                  "key": "errorMsg",
                                                  "data": "responseData"
                                              }
                                          },
                                          {
                                              "type": "updateComponent",
                                              "config": {
                                                  "key": "errorTitleUUID",
                                                  "properties": {
                                                      "titleValue": "#errorMsg",
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
                                  "key": "errorMsg",
                                  "data": "responseData"
                              }
                          },
                          {
                              "type": "updateComponent",
                              "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                      "titleValue": "#errorMsg",
                                      "isShown": true
                                  }
                              }
                          }
                      ]
                  }
              }
        }
    ];

    if (removePartTaskJson) {
      removePartTaskJson.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }

  specificIssuePartDetails(action, instance, actionService) {
    let issuePartDetailsData = [];
    let removePartTaskData = {};
    let issuedPartArr = {};
    let previousIssuedPartActionId = "";
    let removePartArr = {};

    if(action.config.data && action.config.data != undefined){
        if(action.config.data.startsWith('#')){
            issuePartDetailsData = this.contextService.getDataByString(action.config.data);
            //sorting based on action ID to prevent any order mismatch
            issuePartDetailsData.sort((a, b) => a.actionId.localeCompare(b.actionId));
        }
    }

    if(issuePartDetailsData.length > 0){
        issuePartDetailsData.forEach(ele => {
            if(action.config.actionId == ele.actionId && ele.partNo == action.config.partNumber && ele.transactionType == "Removed"){
                removePartArr = cloneDeep(ele);
            }
            if(action.config.actionId == ele.actionId && ele.partNo == action.config.partNumber && ele.transactionType == "Issued"){
                issuedPartArr = cloneDeep(ele);
            } else if(action.config.actionId != ele.actionId && ele.partNo == action.config.partNumber && ele.transactionType == "Issued") {
                previousIssuedPartActionId = ele.actionId;
            }
        });

        if(removePartArr && Object.keys(removePartArr).length > 0){
            removePartTaskData = cloneDeep(removePartArr);
        } else {
            removePartTaskData = cloneDeep(issuedPartArr);
        }
    }

    if(removePartTaskData && removePartTaskData != {}){
        if(action.config.key){
            this.contextService.addToContext(action.config.key, removePartTaskData);
        }
        if(action.config.removeTaskTitle){
            this.contextService.addToContext(action.config.removeTaskTitle, "Remove - " + removePartTaskData["assemblyCodeName"]);
        }

        if(action.config.previousIssuedActionIdKey && previousIssuedPartActionId){
            this.contextService.addToContext(action.config.previousIssuedActionIdKey, previousIssuedPartActionId);
        } else {
            this.contextService.addToContext(action.config.previousIssuedActionIdKey, null);
        }
    }
  }

  prefillComponentSN_PN(action, instance, actionService) {
    let compActionData = [];
    let componentPN_SNobj = {};
    let txtMode = "";
    let config = action.config;
    let prefillCompDetailAction = [];
    let issuePartRecord = [];

    if(config.txtMode && config.txtMode != undefined){
        txtMode = config.txtMode;
    }

    if(config.compActionData && config.compActionData != undefined){
        if(config.compActionData.startsWith('#')){
            compActionData = this.contextService.getDataByString(config.compActionData);
        }
    }

    if(config.issuePartRecord && config.issuePartRecord != undefined){
        if(config.issuePartRecord.startsWith('#')){
            issuePartRecord = this.contextService.getDataByString(config.issuePartRecord);
        }
    }
    //Logic to select prefill data
    if(compActionData.length > 0){
        compActionData.forEach(ele => {

            if(ele.TRX_TYPE == txtMode){
                componentPN_SNobj = cloneDeep(ele);
            }
        });
    }

    if(config.txtModeContextKey && config.txtModeContextKey != undefined){
        if(txtMode == "Removed" && componentPN_SNobj && Object.keys(componentPN_SNobj).length > 0){
            this.contextService.addToContext(config.txtModeContextKey, "Removed");
        } else {
            this.contextService.addToContext(config.txtModeContextKey, null);
        }
    }

    if(componentPN_SNobj && componentPN_SNobj != {} && Object.keys(componentPN_SNobj).length > 0){
        let partOwnerName = "";
        let temp = [];
        if(issuePartRecord && issuePartRecord.length > 0){
            temp = issuePartRecord.filter(ele => {
                return ((componentPN_SNobj["ACTIONID"] == ele.actionId) && (ele.transactionType == "Issued"));
            });

            if(temp && temp.length > 0){
                partOwnerName = temp[0].ownerName;
            }
        }
        // "issuePartRecord": "#issuedPartsDetailsRespData"
        //Check for remove part number component reference
        if(partOwnerName != "HP"){
            if(config.removePartFieldUUID && config.removePartFieldName && config.removePartContextKey){
                prefillCompDetailAction.push({
                    "type": "updateComponent",
                    "config": {
                        "key": config.removePartFieldUUID,
                        "fieldProperties": {
                            [config.removePartFieldName] : componentPN_SNobj["COMPONENT_PN"]
                        }
                    }
                });
    
                prefillCompDetailAction.push({
                    "type": "context",
                    "config": {
                        "requestMethod": "add",
                        // "key": "removePartNo#@",
                        "key": config.removePartContextKey,
                        "data": componentPN_SNobj["COMPONENT_PN"]
                    }
                });
    
                //Adding additional updateComponent to cover remove part field with Autocomplete type
                if(config.removePartDDFieldUUID && config.removePartDDFieldName){
                    prefillCompDetailAction.push({
                        "type": "updateComponent",
                        "config": {
                            "key": config.removePartDDFieldUUID,
                            "fieldProperties": {
                                [config.removePartDDFieldName] : componentPN_SNobj["COMPONENT_PN"]
                            }
                        }
                    });
                }
                
            }
        }

        //Check for new part serial number component reference
        if(config.removeNewPartSNFieldUUID && config.removeNewPartSNFieldName && config.removeNewPartSNContextKey){
            prefillCompDetailAction.push({
                "type": "updateComponent",
                "config": {
                    "key": config.removeNewPartSNFieldUUID,
                    "fieldProperties": {
                        [config.removeNewPartSNFieldName] : componentPN_SNobj["COMPONENT_SN"]
                    }
                }
            });

            prefillCompDetailAction.push({
                "type": "context",
                "config": {
                    "requestMethod": "add",
                    // "key": "removePartNo#@",
                    "key": config.removeNewPartSNContextKey,
                    "data": componentPN_SNobj["COMPONENT_SN"]
                }
            });
        }
        // console.log("------------------------------------------------------------");
        // console.log("config", config);
        // console.log("prefillCompDetailAction", prefillCompDetailAction);
        // console.log("------------------------------------------------------------");
        if(prefillCompDetailAction.length > 0){
            prefillCompDetailAction.forEach((ele) => {
                actionService.handleAction(ele, instance);
            });
        }
    }
  }

  dynamicRemovePartTaskOrder(action, instance, actionService) {
    
    let config = action.config;
    let removeTaskOrder = [];
    let index = -1;
    let nextUUIDValue;
    let tempObj = {};
    let isAllPartRemoved = "No";
    let nextIDcount = 1;
    
    if(config.key && config.key != undefined){
        removeTaskOrder = this.contextService.getDataByKey(config.key);
        removeTaskOrder = removeTaskOrder? removeTaskOrder : []; 
    }
    if(config.mode && config.mode == "Add"){
        tempObj = {
            isCompleted : false,
            uuid: config.uuidKey
        };
        // removeTaskOrder.push(config.uuidKey);
        removeTaskOrder.push(tempObj);

    } else if(config.mode && config.mode == "Remove"){
        // index = removeTaskOrder.indexOf(config.uuidKey);
        for(let i = 0; i < removeTaskOrder.length; i++){
            if(config.uuidKey == removeTaskOrder[i].uuid){
                index = i;
                break;
            } else {
                index = -1;
            }
        }

        if (index > -1) {
            removeTaskOrder.splice(index, 1);
        }
    } else if(config.mode && config.mode == "completed"){
        
        for(let i = 0; i < removeTaskOrder.length; i++){
            if(config.uuidKey == removeTaskOrder[i].uuid){
                removeTaskOrder[i].isCompleted = true;
                break;
            }
        }
        //For checking, if all task is completed
        for(let i = 0; i < removeTaskOrder.length; i++){
            if(!(removeTaskOrder[i].isCompleted)){
                isAllPartRemoved = "No";
                break;
            } else {
                isAllPartRemoved = "Yes";
            }
        }
        this.contextService.addToContext("isAllPartRemoved", isAllPartRemoved);
    } else if(config.mode && config.mode == "nextId"){
        // index = removeTaskOrder.indexOf(config.uuidKey);

        if(config.uuidKey){
            for(let i = 0; i < removeTaskOrder.length; i++){
                if(config.uuidKey == removeTaskOrder[i].uuid){
                    index = i;
                    nextIDcount = 1;
                    break;
                } else {
                    index = -1;
                }
            }
        } else {
            for(let k = 0; k < removeTaskOrder.length; k++){
                if(!(removeTaskOrder[k].isCompleted)){
                    index = k;
                    nextIDcount = 0;
                    break;
                } else {
                    index = -1;
                }
            }
        }

        if (index > -1) {
            if(removeTaskOrder.length-nextIDcount > index){
                // nextUUIDValue = removeTaskOrder[index+1];
                if(!(removeTaskOrder[index + nextIDcount].isCompleted)){
                    nextUUIDValue = removeTaskOrder[index+nextIDcount].uuid;
                } else {
                    nextUUIDValue = null;    
                }
            } else {
                nextUUIDValue = null;
            }
        }
        if(config.nextUUIDKey && config.nextUUIDKey != undefined){
            this.contextService.addToContext(config.nextUUIDKey, nextUUIDValue);
        }
    } else {}

    if(config.mode != "nextId"){
        this.contextService.addToContext(config.key, removeTaskOrder);
    }
  }

  checkforSameAssemblyCode(action, instance, actionService) {
   
    let removeTaskData = {};
    let issuePartDetails = [];
    let key = "";
    let isSameAssembly = false;
    let sameAssemblyRecord = {};

    if(action.config.key && action.config.key != undefined ){
        key = action.config.key;
    }
    
    if(action.config.removePartTaskDetails && action.config.removePartTaskDetails != undefined){
        removeTaskData = this.contextService.getDataByKey(action.config.removePartTaskDetails);
    }

    if(action.config.issuedPartsData && action.config.issuedPartsData != undefined){
        issuePartDetails = this.contextService.getDataByString(action.config.issuedPartsData);
    }

    issuePartDetails.forEach(ele => {
        if(ele.transactionType == "Issued"){
            if(ele.assemblyCodeName == removeTaskData["assemblyCodeName"] && ele.actionId != removeTaskData["actionId"]){
                isSameAssembly = true;
                sameAssemblyRecord = cloneDeep(ele);
            }
        }
    });

    if(isSameAssembly){
      
        this.contextService.addToContext(key, isSameAssembly);
        if(action.config.removePartTaskPartKey && action.config.sameAssemblyPartKey && action.config.sameAssemblyActionIDKey){
            this.contextService.addToContext(action.config.removePartTaskPartKey, removeTaskData["partNo"]);
                this.contextService.addToContext(action.config.sameAssemblyPartKey, sameAssemblyRecord["partNo"]);
                this.contextService.addToContext(action.config.sameAssemblyActionIDKey, sameAssemblyRecord["actionId"]);
            }
        }
    }

  validateIssuepart(action, instance, actionService) {
    let getPNFromLastCompReqdata = this.contextService.getDataByKey("getPNForLastCompReq");
    let currentPanelPartNo = action.config.data.part;
    let currentCompletePart = action.config.data.completePart;
    let currentPanelUUID = action.config.uuid;
    let istrueArray = [];
    if (getPNFromLastCompReqdata && getPNFromLastCompReqdata.length > 0 && getPNFromLastCompReqdata != undefined && getPNFromLastCompReqdata != null) {
      istrueArray = getPNFromLastCompReqdata.filter(item => (item.partNo == currentPanelPartNo) && item.lineStatus == "Complete");
      if (istrueArray && istrueArray.length > 0 && (istrueArray[0].partDesc == currentCompletePart)) {
        let addList = {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "isMatchreworkPartTaskPanelUUIDList",
            "sourceData": { "allMatchuuids": currentPanelUUID }
          },
          "hookType": "afterInit"
        };

        if (action.config.ownerNameKey) {
          this.contextService.addToContext(action.config.ownerNameKey, istrueArray[0].ownerName);
        }

        if (action.config.conditionNameKey) {
          this.contextService.addToContext(action.config.conditionNameKey, istrueArray[0].conditionName);
        }
        // action.config.conditionNameKey

        actionService.handleAction(addList, instance);

      } else {
        let disableUndoOperation = action.config.isTakpanel;
        if (!disableUndoOperation && disableUndoOperation != undefined) {
          let actiontobePerform = {
            "type": "updateComponent",
            "config": {
              "key": action.config.uuid,
              "properties": {
                "disabled": true
              }
            },
            "hookType": "afterInit"
          }
          actionService.handleAction(actiontobePerform, instance);
        } else {
          let actiontobePerform = {
            "type": "updateComponent",
            "config": {
              "key": currentPanelUUID,
              "properties": {
                "expanded": false,
                "disabled": true
              }
            },
            "hookType": "afterInit"
          }
          actionService.handleAction(actiontobePerform, instance);
        }
      }
    }
  }

  checkValidreworkPartoenable(action, instance, actionService) {
    let allToenableduuids = this.contextService.getDataByKey("isMatchreworkPartTaskPanelUUIDList");
    let tocheckuuid;
    let partAlreadyIssued;
    let isissuepartcompleted; 
    let partAlreadyIssuedStatus;
    let IssuepartsTotalLen = this.contextService.getDataByString("#dynamicTaskPanellength");
    let isInitialAssessmentClicked = this.contextService.getDataByString("#isInitialAssessmentClicked");
    let completedissuePartsLength = this.contextService.getDataByString("#completeTaskLength");
    let allCompletedIssuedPartslenght = this.contextService.getDataByString("#taskLength");
    let isAlldynamicdisableactions = {
      "type": "condition",
      "config": {
        "operation": "isEqualTo",
        "lhs": "#isRecordRamDetailsComplete",
        "rhs": true
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [{
            "type": "condition",
            "config": {
              "operation": "isEqualTo",
              "lhs": "#isRecordHHDPanelComplete",
              "rhs": true
            },
            "eventSource": "click",
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#isCustomerDescriptionPanelComplete",
                      "rhs": true
                    },
                    "eventSource": "click",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "condition",
                            "config": {
                              "operation": "isValid",
                              "lhs": "#printLabelSelection"
                            },
                            "eventSource": "click",
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [
                                  {
                                    "type": "countDetetection",
                                    "config": {
                                      "source": "#totalTaskLength",
                                      "key": "totalTaskLength",
                                      "type": "inc",
                                      "value": 1
                                    },
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "printLabelUUID",
                                      "properties": {
                                        "expanded": true,
                                        "disabled": false,
                                        "hidden": false,
                                        "header": {
                                          "title": "Print Label",
                                          "icon": "description",
                                          "statusIcon": "hourglass_empty",
                                          "statusClass": "incomplete-status",
                                          "iconClass": "active-header"
                                        }
                                      }
                                    },
                                    "eventSource": "click"
                                  }
                                ]
                              },
                              "onFailure": {
                                "actions": [
                                  {
                                    "type": "dynamicRemovePartTaskOrder",
                                    "config": {
                                      "key": "RemovePartTaskSequance",
                                      "nextUUIDKey": "RemovePartTaskNextUUIDValue",
                                      "mode": "nextId",
                                      "uuidKey": null
                                    }
                                  },
                                  {
                                    "type": "condition",
                                    "config": {
                                      "operation": "isValid",
                                      "lhs": "#RemovePartTaskNextUUIDValue"
                                    },
                                    "eventSource": "click",
                                    "responseDependents": {
                                      "onSuccess": {
                                        "actions": [
                                          {
                                            "type": "updateComponent",
                                            "config": {
                                              "key": "#RemovePartTaskNextUUIDValue",
                                              "properties": {
                                                "expanded": true,
                                                "disabled": false
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
                                              "lhs": "#isAllPartRemoved",
                                              "rhs": "Yes"
                                            },
                                            "eventSource": "click",
                                            "responseDependents": {
                                              "onSuccess": {
                                                "actions": [
                                                  {
                                                    "type": "enableComponent",
                                                    "config": {
                                                      "key": "repairReworkCodesUUID",
                                                      "property": "ResultCodes"
                                                    },
                                                    "eventSource": "click"
                                                  },
                                                  {
                                                    "type": "updateComponent",
                                                    "config": {
                                                      "key": "repairReworkCodesUUID",
                                                      "properties": {
                                                        "disabled": false
                                                      }
                                                    },
                                                    "eventSource": "click"
                                                  }
                                                ]
                                              },
                                              "onFailure": {
                                                "actions": [
                                                  {
                                                    "type": "condition",
                                                    "config": {
                                                      "operation": "isNotEmptyArray",
                                                      "lhs": "#RemovePartTaskSequance"
                                                    },
                                                    "responseDependents": {
                                                      "onSuccess": {
                                                        "actions": []
                                                      },
                                                      "onFailure": {
                                                        "actions": [
                                                          {
                                                            "type": "enableComponent",
                                                            "config": {
                                                              "key": "repairReworkCodesUUID",
                                                              "property": "ResultCodes"
                                                            },
                                                            "eventSource": "click"
                                                          },
                                                          {
                                                            "type": "updateComponent",
                                                            "config": {
                                                              "key": "repairReworkCodesUUID",
                                                              "properties": {
                                                                "disabled": false
                                                              }
                                                            },
                                                            "eventSource": "click"
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
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "printLabelUUID",
                                      "properties": {
                                        "expanded": false,
                                        "disabled": true,
                                        "hidden": true
                                      }
                                    },
                                    "eventSource": "click"
                                  }
                                ]
                              }
                            }
                          },
                          {
                            "type": "countDetetection",
                            "config": {
                              "source": "#completeTaskLength",
                              "key": "completeTaskLength",
                              "type": "inc"
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "condition",
                            "config": {
                              "operation": "isValid",
                              "lhs": "#printLabelSelection"
                            },
                            "eventSource": "click",
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [
                                  {
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "printLabelSelectionValue",
                                      "data": "YES"
                                    },
                                    "eventSource": "click"
                                  }
                                ]
                              },
                              "onFailure": {
                                "actions": [
                                  {
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "printLabelSelectionValue",
                                      "data": "NO"
                                    },
                                    "eventSource": "click"
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
                              "key": "customerDesNumberUUID",
                              "properties": {
                                "expanded": true,
                                "disabled": false,
                                "header": {
                                  "title": "Customer Description Assessment",
                                  "icon": "description",
                                  "statusIcon": "hourglass_empty",
                                  "statusClass": "incomplete-status",
                                  "iconClass": "active-header"
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
                    "type": "updateComponent",
                    "config": {
                      "key": "repairhddDetailsTaskPanelUUID",
                      "properties": {
                        "expanded": true,
                        "disabled": false,
                        "header": {
                          "title": "Record HDD Details",
                          "icon": "description",
                          "statusIcon": "hourglass_empty",
                          "statusClass": "incomplete-status",
                          "iconClass": "active-header"
                        }
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            "type": "countDetetection",
            "config": {
              "source": "#completeTaskLength",
              "key": "completeTaskLength",
              "type": "inc"
            },
            "eventSource": "click"
          },
          {
            "type": "condition",
            "config": {
              "operation": "isValid",
              "lhs": "#userSelectedRam"
            },
            "eventSource": "click",
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "repairRamSerialValue",
                      "data": "#userSelectedRam"
                    }
                  },
                  {
                    "type": "disableComponent",
                    "config": {
                      "key": "RAMdescriptionUUID",
                      "property": "RAMdescription",
                      "isNotReset": true
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
                      "key": "repairRamSerialValue",
                      "data": ""
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
                "key": "reworkrecordRamDetailsUUID",
                "properties": {
                  "expanded": true,
                  "disabled": false,
                  "header": {
                    "title": "Record RAM Details",
                    "icon": "description",
                    "statusIcon": "hourglass_empty",
                    "statusClass": "incomplete-status",
                    "iconClass": "active-header"
                  }
                }
              }
            }
          ]
        }
      }
    }
    if (action.config.key && action.config.key.startsWith('#')) {
      tocheckuuid = this.contextService.getDataByString("#reworkPartTaskPanelUUIDtasklengthref");
    } else {
      tocheckuuid = action.config.key;
    }
    if (allToenableduuids && allToenableduuids != undefined && allToenableduuids.length > 0) {
        isissuepartcompleted = this.contextService.getDataByKey(tocheckuuid + "ref");
      if(isissuepartcompleted && isissuepartcompleted != undefined && isissuepartcompleted.instance != undefined &&  isissuepartcompleted.instance.header != undefined &&  isissuepartcompleted.instance.header.statusClass != undefined){
        partAlreadyIssuedStatus = isissuepartcompleted.instance.header.statusClass;
        if (partAlreadyIssuedStatus && partAlreadyIssuedStatus != undefined && partAlreadyIssuedStatus == "complete-status") {
            partAlreadyIssued = partAlreadyIssuedStatus;
        }
      }
      let validIssueTaskUUID = [];
      let isreturnPart = action.config.isReturnPart || false;
      validIssueTaskUUID = cloneDeep(allToenableduuids);
      allToenableduuids.forEach(element => {
        //below code will compare current panel uuid with all valid issue part uuid   
        if (tocheckuuid == element.allMatchuuids && !isreturnPart && !partAlreadyIssued) {
          let enabletaskpanel = {
            "type": "updateComponent",
            "config": {
              "key": tocheckuuid,
              "properties": {
                "expanded": true,
                "disabled": false
              }
            }
          }
          actionService.handleAction(enabletaskpanel, instance);
        } else {
          let uuidlen = tocheckuuid.replace("reworkPartTaskPanelUUID", "");
          uuidlen = parseInt(uuidlen);
          IssuepartsTotalLen = parseInt(IssuepartsTotalLen);
          if (IssuepartsTotalLen > uuidlen) {
            let validTaskUuid = "";
            let nextValidtaskStatus;
            if (allToenableduuids.length == 1 && allCompletedIssuedPartslenght < 1) {
              // allToenableduuids[0].allMatchuuids
              validTaskUuid = allToenableduuids[0].allMatchuuids;
            } else {
              let dynamicIndex = action.config.dynamicIndex;
              let isReturnPart = action.config.isReturnPart;
              let uuidCount;
              if (dynamicIndex && dynamicIndex.startsWith('#')) {
                dynamicIndex = this.contextService.getDataByString(dynamicIndex);
              }

              for (let i = 0; i < allToenableduuids.length; i++) {
                uuidCount = allToenableduuids[i].allMatchuuids.replace("reworkPartTaskPanelUUID", "");
                uuidCount = parseInt(uuidCount);
                dynamicIndex = parseInt(dynamicIndex);
                if (uuidCount >= dynamicIndex) {
                  //allToenableduuids[i].allMatchuuids
                  let validTaskUuidref = this.contextService.getDataByKey(allToenableduuids[i].allMatchuuids + "ref");
                  if(validTaskUuidref && validTaskUuidref != undefined && validTaskUuidref.instance != undefined &&  validTaskUuidref.instance.header != undefined &&  validTaskUuidref.instance.header.statusClass != undefined){
                    nextValidtaskStatus = validTaskUuidref.instance.header.statusClass;
                    if (nextValidtaskStatus && nextValidtaskStatus != undefined && nextValidtaskStatus == "complete-status") {
                      continue;
                    }
                  }
                  else {
                    validTaskUuid = allToenableduuids[i].allMatchuuids;
                    break;
                  }
                } else {
                    // allToenableduuids[i].allMatchuuids
                    // this.contextService.getDataByKey(allToenableduuids[0].allMatchuuids + "ref")
                    let validUuidref = this.contextService.getDataByKey(allToenableduuids[i].allMatchuuids + "ref");
                    if(validUuidref && validUuidref != undefined && validUuidref.instance != undefined &&  validUuidref.instance.header != undefined){
                        nextValidtaskStatus = validUuidref.instance.header.statusClass;
                        if (nextValidtaskStatus && nextValidtaskStatus != undefined && nextValidtaskStatus == "complete-status") {
                        continue;
                        } else {
                            validTaskUuid = allToenableduuids[i].allMatchuuids;
                            break;
                        }
                    }
                }
              }
            }

            if (validTaskUuid) {
              let enabletaskpanelAction = {
                "type": "updateComponent",
                "config": {
                  "key": validTaskUuid,
                  "properties": {
                    "expanded": true,
                    "disabled": false
                  }
                }
              }
              actionService.handleAction(enabletaskpanelAction, instance);
            } else {
              actionService.handleAction(isAlldynamicdisableactions, instance);
            }
          } else {
            actionService.handleAction(isAlldynamicdisableactions, instance);
          }
        }
        //when only one valid issue part & initial Assesment is completed the below code will execute.
        if (allToenableduuids.length == 1 && completedissuePartsLength == 1) {
          let enabletaskpanel = {
            "type": "updateComponent",
            "config": {
              "key": element.allMatchuuids,
              "properties": {
                "expanded": true,
                "disabled": false
              }
            }
          }
          actionService.handleAction(enabletaskpanel, instance);
        }
        //when only one valid issue part and is completed & initial Assesment is also completed below code will execute. 
        //when only one valid issue part and is completed & initial Assesment is also completed below code will execute.
        //when only one valid issue part and it is in completed and initial Assesment is also completed with also more panels are completed. 
        else if (allToenableduuids.length == 1 && completedissuePartsLength == 2 || (allToenableduuids.length == 1 && allCompletedIssuedPartslenght == 1 && completedissuePartsLength > 2)) {
          actionService.handleAction(isAlldynamicdisableactions, instance);
        }
      });
    } else {
      actionService.handleAction(isAlldynamicdisableactions, instance);
    }
  }

  enableTMOifAllpanlesValid(action, instance, actionService) {
    let SelectedResultcodeValue = this.contextService.getDataByString("#SelectedDescripencyResultcode");
    let allIssuedPartslenght = this.contextService.getDataByString("#taskLength");
    let IssuepartsTotalLength = this.contextService.getDataByString("#dynamicTaskPanellength");
    let getPNFromLastCompReqdata = this.contextService.getDataByKey("getPNForLastCompReq");
    let isrecordramCompleted = this.contextService.getDataByString("#isRecordRamDetailsComplete");
    let isreturnhddCompleted = this.contextService.getDataByString("#isRecordHHDPanelComplete");
    let isCustomerDescriptionCompleted = this.contextService.getDataByString("#isCustomerDescriptionPanelComplete");
    let isAllpanelscompleted = {
        "type": "condition",
        "config": {
          "operation": "isEqualTo",
          "lhs": "#isRecordRamDetailsComplete",
          "rhs": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [{
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#isRecordHHDPanelComplete",
                "rhs": true
              },
              "eventSource": "click",
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#isCustomerDescriptionPanelComplete",
                        "rhs": true
                      },
                      "eventSource": "click",
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isValid",
                                "lhs": "#printLabelSelection"
                              },
                              "eventSource": "click",
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "countDetetection",
                                      "config": {
                                        "source": "#totalTaskLength",
                                        "key": "totalTaskLength",
                                        "type": "inc",
                                        "value": 1
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "printLabelUUID",
                                        "properties": {
                                          "expanded": true,
                                          "disabled": false,
                                          "hidden": false,
                                          "header": {
                                            "title": "Print Label",
                                            "icon": "description",
                                            "statusIcon": "hourglass_empty",
                                            "statusClass": "incomplete-status",
                                            "iconClass": "active-header"
                                          }
                                        }
                                      },
                                      "eventSource": "click"
                                    }
                                  ]
                                },
                                "onFailure": {
                                  "actions": [
                                    {
                                      "type": "dynamicRemovePartTaskOrder",
                                      "config": {
                                        "key": "RemovePartTaskSequance",
                                        "nextUUIDKey": "RemovePartTaskNextUUIDValue",
                                        "mode": "nextId",
                                        "uuidKey": null
                                      }
                                    },
                                    {
                                      "type": "condition",
                                      "config": {
                                        "operation": "isValid",
                                        "lhs": "#RemovePartTaskNextUUIDValue"
                                      },
                                      "eventSource": "click",
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "updateComponent",
                                              "config": {
                                                "key": "#RemovePartTaskNextUUIDValue",
                                                "properties": {
                                                  "expanded": true,
                                                  "disabled": false
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
                                                "lhs": "#isAllPartRemoved",
                                                "rhs": "Yes"
                                              },
                                              "eventSource": "click",
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
                                                    {
                                                      "type": "enableComponent",
                                                      "config": {
                                                        "key": "repairReworkCodesUUID",
                                                        "property": "ResultCodes"
                                                      },
                                                      "eventSource": "click"
                                                    },
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "repairReworkCodesUUID",
                                                        "properties": {
                                                          "disabled": false
                                                        }
                                                      },
                                                      "eventSource": "click"
                                                    }
                                                  ]
                                                },
                                                "onFailure": {
                                                  "actions": [
                                                    {
                                                      "type": "condition",
                                                      "config": {
                                                        "operation": "isNotEmptyArray",
                                                        "lhs": "#RemovePartTaskSequance"
                                                      },
                                                      "responseDependents": {
                                                        "onSuccess": {
                                                          "actions": []
                                                        },
                                                        "onFailure": {
                                                          "actions": [
                                                            {
                                                              "type": "enableComponent",
                                                              "config": {
                                                                "key": "repairReworkCodesUUID",
                                                                "property": "ResultCodes"
                                                              },
                                                              "eventSource": "click"
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "repairReworkCodesUUID",
                                                                "properties": {
                                                                  "disabled": false
                                                                }
                                                              },
                                                              "eventSource": "click"
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
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "printLabelUUID",
                                        "properties": {
                                          "expanded": false,
                                          "disabled": true,
                                          "hidden": true
                                        }
                                      },
                                      "eventSource": "click"
                                    }
                                  ]
                                }
                              }
                            },
                            {
                              "type": "countDetetection",
                              "config": {
                                "source": "#completeTaskLength",
                                "key": "completeTaskLength",
                                "type": "inc"
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isValid",
                                "lhs": "#printLabelSelection"
                              },
                              "eventSource": "click",
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "printLabelSelectionValue",
                                        "data": "YES"
                                      },
                                      "eventSource": "click"
                                    }
                                  ]
                                },
                                "onFailure": {
                                  "actions": [
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "printLabelSelectionValue",
                                        "data": "NO"
                                      },
                                      "eventSource": "click"
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
                                "key": "customerDesNumberUUID",
                                "properties": {
                                  "expanded": true,
                                  "disabled": false,
                                  "header": {
                                    "title": "Customer Description Assessment",
                                    "icon": "description",
                                    "statusIcon": "hourglass_empty",
                                    "statusClass": "incomplete-status",
                                    "iconClass": "active-header"
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
                      "type": "updateComponent",
                      "config": {
                        "key": "repairhddDetailsTaskPanelUUID",
                        "properties": {
                          "expanded": true,
                          "disabled": false,
                          "header": {
                            "title": "Record HDD Details",
                            "icon": "description",
                            "statusIcon": "hourglass_empty",
                            "statusClass": "incomplete-status",
                            "iconClass": "active-header"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "countDetetection",
              "config": {
                "source": "#completeTaskLength",
                "key": "completeTaskLength",
                "type": "inc"
              },
              "eventSource": "click"
            },
            {
              "type": "condition",
              "config": {
                "operation": "isValid",
                "lhs": "#userSelectedRam"
              },
              "eventSource": "click",
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "repairRamSerialValue",
                        "data": "#userSelectedRam"
                      }
                    },
                    {
                      "type": "disableComponent",
                      "config": {
                        "key": "RAMdescriptionUUID",
                        "property": "RAMdescription",
                        "isNotReset": true
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
                        "key": "repairRamSerialValue",
                        "data": ""
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
                  "key": "reworkrecordRamDetailsUUID",
                  "properties": {
                    "expanded": true,
                    "disabled": false,
                    "header": {
                      "title": "Record RAM Details",
                      "icon": "description",
                      "statusIcon": "hourglass_empty",
                      "statusClass": "incomplete-status",
                      "iconClass": "active-header"
                    }
                  }
                }
              }
            ]
          }
        }
    }
    let getAllCAncelledReqList = getPNFromLastCompReqdata.filter(eachitem => eachitem.lineStatus == "Cancelled");
    let getAllCAncelledReqListLength = getAllCAncelledReqList.length;
    let checkIsValidIssuepartsLength = allIssuedPartslenght + getAllCAncelledReqListLength 
    if(getPNFromLastCompReqdata && getPNFromLastCompReqdata != undefined && getPNFromLastCompReqdata != null && getPNFromLastCompReqdata != ''){
      
        
      //below if is for enabling TMO when all the panles are completed (including if there is cancelled issue task as well).   
      if (checkIsValidIssuepartsLength == IssuepartsTotalLength && (isrecordramCompleted == true && isreturnhddCompleted == true && isCustomerDescriptionCompleted == true)) {
        let enabletaskpanel = {
          "type": "updateComponent",
          "config": {
            "key": "debugTimeoutUUID",
            "properties": {
              "disabled": false
            }
          }
        }
        actionService.handleAction(enabletaskpanel, instance);
      }
      //below else will run when all the Valid issue parts are incomplete.
       else {
        actionService.handleAction(isAllpanelscompleted, instance);  
        let enabletaskpanel = {
          "type": "updateComponent",
          "config": {
            "key": "debugTimeoutUUID",
            "properties": {
              "disabled": true
            }
          }
        }
        actionService.handleAction(enabletaskpanel, instance);
      }
    }
  }

  getOwnerAndCondition(action, instance, actionService) {
    let getPNFromLastCompReqdata = this.contextService.getDataByKey("getPNForLastCompReq");
    let partNo = action.config.partNo;
    
    if(partNo && partNo.startsWith('#')){
      partNo = this.contextService.getDataByString(partNo);
    }
    
    if(getPNFromLastCompReqdata && getPNFromLastCompReqdata.length > 0){
      let temp = {};
      for(let i = 0; i < getPNFromLastCompReqdata.length; i++){
        if((getPNFromLastCompReqdata[i].lineStatus == "Complete") && (getPNFromLastCompReqdata[i].partNo == partNo)){
          temp = getPNFromLastCompReqdata[i];
          break;
        }
      }

      if(action.config.ownerNameKey){
        this.contextService.addToContext(action.config.ownerNameKey, temp["ownerName"]);
      }

      if(action.config.condtionNameKey){
        this.contextService.addToContext(action.config.condtionNameKey, temp["conditionName"]);
      }
    }

  }

  tocheckValidIssuePartsandcompletedIssuePartslenght(action, instance, actionService){
      let completedissuePartsLength = this.contextService.getDataByString("#taskLength");
      let allValidIssuePartsLength = this.contextService.getDataByKey("isMatchreworkPartTaskPanelUUIDList");
      let toenablePanelUUID = action.config.key
      if(completedissuePartsLength && allValidIssuePartsLength && (completedissuePartsLength > 0 && allValidIssuePartsLength >0)){
          if(completedissuePartsLength == allValidIssuePartsLength){
            let expandTaskPanel = {
                "type": "updateComponent",
                "config": {
                    "key": toenablePanelUUID,
                    "properties": {
                        "expanded": true,
                    }
                },
                "eventSource": "click"
            }
            actionService.handleAction(expandTaskPanel, instance);
          }else{
            let collapseTaskPanel = {
                "type": "updateComponent",
                "config": {
                    "key": toenablePanelUUID,
                    "properties": {
                        "expanded": false
                    }
                },
                "eventSource": "click"
            }
            actionService.handleAction(collapseTaskPanel, instance); 
          }
        }
  }

  checkIssuedPartStatustoUpdateRTV(action, instance, actionService) {
    let isAlreadyPartIssued;
    let issuepartcompletedref = this.contextService.getDataByKey(action.config.uuid + "ref");
    if (issuepartcompletedref && issuepartcompletedref != undefined && issuepartcompletedref.instance != undefined && issuepartcompletedref.instance.header != undefined && issuepartcompletedref.instance.header.statusClass != undefined) {
      let issuepartcompletedStatus = issuepartcompletedref.instance.header.statusClass;
      if (issuepartcompletedStatus && issuepartcompletedStatus != undefined && issuepartcompletedStatus == "complete-status") {
        isAlreadyPartIssued = true;
        this.contextService.addToContext("isAlreadyPartIssued",isAlreadyPartIssued)
      } 
    }else {
      isAlreadyPartIssued = false;
      this.contextService.addToContext("isAlreadyPartIssued",isAlreadyPartIssued)
    }
  }

  //this method is used to handle all the possible scenario to enable resultcodes 
  //when user remove the remove task by chnaging RTV status to DOA_InProcess to somthing else.
  todecreaseRemovedpanelLength(action, instance, actionService){
   let removedPanelList = action.config.data;
   if(removedPanelList && removedPanelList.startsWith("#")){
       removedPanelList = this.contextService.getDataByString(removedPanelList);
   }
   if(removedPanelList && removedPanelList.length > 0){
     let completedRemovedPanels = removedPanelList.filter(eachitem => eachitem.isCompleted == false);
     if(completedRemovedPanels && completedRemovedPanels.length > 0){
        let disabelresultcodes ={
            "type":"disableComponent",
            "config":{
               "key":"repairReworkCodesUUID",
               "property":"ResultCodes"
            },
            "eventSource":"click"
         }
         actionService.handleAction(disabelresultcodes, instance);
     }else{
        let enableresultcodes ={
            "type":"enableComponent",
            "config":{
               "key":"repairReworkCodesUUID",
               "property":"ResultCodes"
            },
            "eventSource":"click"
         }
         actionService.handleAction(enableresultcodes, instance); 
     }
   }else{
     let enableresultcodes ={
        "type":"enableComponent",
        "config":{
           "key":"repairReworkCodesUUID",
           "property":"ResultCodes"
        },
        "eventSource":"click"
     }
     actionService.handleAction(enableresultcodes, instance); 
     }
  }
}