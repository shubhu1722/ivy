import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';
import { TransactionService } from '../../commonServices/transaction/transaction.service';
import { UtilityService } from 'src/app/utilities/utility.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { resolve } from 'dns';
import { serviceUrls } from 'src/environments/serviceUrls';

@Injectable({
  providedIn: 'root'
})
export class QuoteResponseService {

  constructor(
    private contextService: ContextService,
    private transactionService: TransactionService,
    private utilityService:UtilityService,
    private http: HttpClient
  ) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  
  quoteResponseOccuranceFilter(action, instance, actionService) {
    let getHPFAHistoryData = this.contextService.getDataByKey("getHPFAHistoryQuoteResp") || [];
    let occuranceData;
    let indexValue = 0;
    getHPFAHistoryData && getHPFAHistoryData.length && getHPFAHistoryData.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID));
    getHPFAHistoryData.length && getHPFAHistoryData.map((item, i) => {
      occuranceData = [
        {
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
        }
      ]

      if (item.ACTION_CODE_NAME == "29" || item.ACTION_CODE_NAME == "77") {
        let occ = {
          "type": "addOccurenceToContext",
          "hookType": "afterInit",
          "config": {
            "target": "occurenceList",
            "taskUuid": item.ACTIONID,
            "currentDefectCode": item.DEFECT_CODE_NAME,
            "currentAssemblyCode": item.ASSEMBLY_CODE_NAME
          }
        }
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

  handleQuoteResponseControlService(action, instance, actionService) {
    let looperData = [];
    let replaceTaskActions = [];
    let filterIWData = false;

    filterIWData = action.config.filterIWData ? action.config.filterIWData : false;
    let clearDefAndAssemLists = [
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "requisitionList",
          "data": []
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "requisitionListLength",
          "data": ""
        }
      }, {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "requisitionListStatus",
          "data": ""
        }
      }];

    clearDefAndAssemLists.forEach((currentItem) => {
      actionService.handleAction(currentItem, instance);
    });
    looperData = this.contextService.getDataByKey(action.config.data);
    if (looperData !== undefined && looperData.length > 0) {
      looperData.sort((a, b) => a.ACTIONID.localeCompare(b.ACTIONID));
      looperData.forEach((item, index) => {
        let dialogBox = {};

        if ((index + 1) === looperData.length) {
          dialogBox = {
            "type": "dialog",
            "uuid": "requistionreplacetaskUUID",
            "config": {
              "title": "Requisition List",
              "minimumWidth": false,
              "disableClose": false,
              "hasBackdrop": true,
              "backdropClass": "cdk-overlay-transparent-backdrop",
              "width": "380px",
              "height": "400px",
              "footerclass": "float-right",
              "position": {
                "bottom": "0",
                "left": "70%",
                "right": "0",
                "top": "1%"
              },
              "items": [
                {
                  "ctype": "table",
                  "isDelete": true,
                  "uuid": "ReplacerequisitiontasktableUUID",
                  "tableClass": "replaceTaskTableclass",
                  "tableHeaderClass": "requisitionList-table-header subtitle1",
                  "tableContainerClass": "requisitionList-table",
                  "hooks": [],
                  "displayedColumns": [
                    "Part Details",
                    "Qty"
                  ],
                  "datasource": "#requisitionList",
                  "actions": [
                    {
                      "type": "updateComponent",
                      "eventSource": "rowDelete",
                      "config": {
                        "key": "errorTitleUUID",
                        "properties": {
                          "titleValue": "",
                          "isShown": false
                        }
                      }
                    },
                    {
                      "type": "GetValueFromArray",
                      "config": {
                        "arrayData": "#debugFlexFieldData",
                        "PullValue": "currentTaskPanelData",
                        "key": "parentUUID",
                        "property": "flexFields"
                      },
                      "eventSource": "rowDelete"
                    },
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#requisitionListStatus",
                        "rhs": "saved"
                      },
                      "eventSource": "rowDelete",
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "microservice",
                              "config": {
                                "microserviceId": "cancelReqOrder",
                                "requestMethod": "post",
                                "body": {
                                  "reqOrderId": "#qrrequisitionId",
                                  "canceledBy": "#loginUUID.username",
                                  "notes": "Cancel Requisition Order"
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
                                        "key": "cancelReqOrderResp",
                                        "data": "responseData"
                                      }
                                    },
                                    {
                                      "type": "microservice",
                                      "eventSource": "rowDelete",
                                      "config": {
                                        "microserviceId": "cancelFA",
                                        "requestMethod": "post",
                                        "isLocal": false,
                                        "LocalService": "assets/Responses/performFA.json",
                                        "body": {
                                          "updateFailureAnalysisRequest": {
                                            "bcn": "#repairUnitInfo.ITEM_BCN",
                                            "assemblyCodeChangeList": {
                                              "assemblyCodeChange": [
                                                {
                                                  "assemblyCode": "#currentTaskPanelData.userSelectedCommodityName",
                                                  "operation": "Delete"
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
                                              "type": "microservice",
                                              "eventSource": "rowDelete",
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
                                                          "defectCode": "#currentTaskPanelData.userSelectedDefect",
                                                          "operation": "Delete"
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
                                                      "type": "context",
                                                      "config": {
                                                        "requestMethod": "add",
                                                        "key": "requisitionListStatus",
                                                        "data": "Unsaved"
                                                      }
                                                    },
                                                    {
                                                      "type": "GetValueFromArray",
                                                      "config": {
                                                        "arrayData": "#debugFlexFieldData",
                                                        "PullValue": "currentTaskPanelData",
                                                        "key": "parentUUID",
                                                        "property": "flexFields",
                                                        "splice": true,
                                                        "deleteTableData": true
                                                      },
                                                      "eventSource": "rowDelete"
                                                    },
                                                    {
                                                      "type": "errorPrepareAndRender",
                                                      "config": {
                                                        "key": "requisitionListButtonUUID",
                                                        "properties": {
                                                          "titleValue": "Requisition List ({0})",
                                                          "isShown": true
                                                        },
                                                        "valueArray": [
                                                          "#requisitionListLength"
                                                        ]
                                                      }
                                                    },
                                                    {
                                                      "type": "condition",
                                                      "config": {
                                                        "operation": "isValid",
                                                        "lhs": "#requisitionListLength"
                                                      },
                                                      "eventSource": "rowDelete",
                                                      "responseDependents": {
                                                        "onSuccess": {
                                                          "actions": [
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "requisitionListButtonUUID",
                                                                "properties": {
                                                                  "textValue": "- Unsaved",
                                                                  "textValueClass": "light-red body"
                                                                }
                                                              }
                                                            },
                                                            {
                                                              "type": "condition",
                                                              "config": {
                                                                "operation": "isEqualTo",
                                                                "lhs": "#requisitionListStatus",
                                                                "rhs": "saved"
                                                              },
                                                              "eventSource": "change",
                                                              "responseDependents": {
                                                                "onSuccess": {
                                                                  "actions": [
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "requisitionSaveButtonUUID",
                                                                        "properties": {
                                                                          "disabled": true
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
                                                                        "key": "requisitionSaveButtonUUID",
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
                                                        "onFailure": {
                                                          "actions": [
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "requisitionListButtonUUID",
                                                                "properties": {
                                                                  "textValue": ""
                                                                }
                                                              }
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "softwareIconUUID",
                                                                "properties": {
                                                                  "disabled": false
                                                                }
                                                              }
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "manualIconUUID",
                                                                "properties": {
                                                                  "disabled": false
                                                                }
                                                              }
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "manualIconUUID",
                                                                "properties": {
                                                                  "disabled": false
                                                                }
                                                              }
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "requisitionSaveButtonUUID",
                                                                "properties": {
                                                                  "disabled": true
                                                                }
                                                              },
                                                              "eventSource": "click"
                                                            },
                                                            {
                                                              "type": "context",
                                                              "config": {
                                                                "requestMethod": "add",
                                                                "key": "templateName",
                                                                "data": "BYD_COM_TOWERS_3"
                                                              },
                                                              "eventSource": "change"
                                                            },
                                                            {
                                                              "type": "microservice",
                                                              "config": {
                                                                "microserviceId": "getResultCodeByValidateResult",
                                                                "requestMethod": "get",
                                                                "params": {
                                                                  "bcn": "#repairUnitInfo.ITEM_BCN",
                                                                  "validateResult": 1
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
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "quoteResponseTimeoutUUID",
                                                                        "properties": {
                                                                          "disabled": true
                                                                        }
                                                                      }
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "quoteResponseResultCodesUUID",
                                                                        "dropDownProperties": {
                                                                          "options": "#resultCodesForDiscrepancy"
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
                                                            }
                                                          ]
                                                        }
                                                      }
                                                    },
                                                    {
                                                      "type": "deleteComponent",
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
                                        "key": "cancelReqOrderResp",
                                        "data": "responseData"
                                      }
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "errorTitleUUID",
                                        "properties": {
                                          "titleValue": "#cancelReqOrderResp",
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
                                "microserviceId": "cancelFA",
                                "requestMethod": "post",
                                "isLocal": false,
                                "LocalService": "assets/Responses/performFA.json",
                                "body": {
                                  "updateFailureAnalysisRequest": {
                                    "bcn": "#repairUnitInfo.ITEM_BCN",
                                    "assemblyCodeChangeList": {
                                      "assemblyCodeChange": [
                                        {
                                          "assemblyCode": "#currentTaskPanelData.userSelectedCommodityName",
                                          "operation": "Delete"
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
                                                  "defectCode": "#currentTaskPanelData.userSelectedDefect",
                                                  "operation": "Delete"
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
                                              "type": "GetValueFromArray",
                                              "config": {
                                                "arrayData": "#debugFlexFieldData",
                                                "PullValue": "currentTaskPanelData",
                                                "key": "parentUUID",
                                                "property": "flexFields",
                                                "splice": true,
                                                "deleteTableData": true
                                              },
                                              "eventSource": "click"
                                            },
                                            {
                                              "type": "context",
                                              "config": {
                                                "requestMethod": "add",
                                                "key": "requisitionListStatus",
                                                "data": "Unsaved"
                                              }
                                            },
                                            {
                                              "type": "errorPrepareAndRender",
                                              "config": {
                                                "key": "requisitionListButtonUUID",
                                                "properties": {
                                                  "titleValue": "Requisition List ({0})",
                                                  "isShown": true
                                                },
                                                "valueArray": [
                                                  "#requisitionListLength"
                                                ]
                                              }
                                            },
                                            {
                                              "type": "condition",
                                              "config": {
                                                "operation": "isValid",
                                                "lhs": "#requisitionListLength"
                                              },
                                              "eventSource": "rowDelete",
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "requisitionListButtonUUID",
                                                        "properties": {
                                                          "textValue": "- Unsaved",
                                                          "textValueClass": "light-red body"
                                                        }
                                                      }
                                                    },
                                                    {
                                                      "type": "condition",
                                                      "config": {
                                                        "operation": "isEqualTo",
                                                        "lhs": "#requisitionListStatus",
                                                        "rhs": "saved"
                                                      },
                                                      "eventSource": "change",
                                                      "responseDependents": {
                                                        "onSuccess": {
                                                          "actions": [
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "requisitionSaveButtonUUID",
                                                                "properties": {
                                                                  "disabled": true
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
                                                                "key": "requisitionSaveButtonUUID",
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
                                                "onFailure": {
                                                  "actions": [
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "requisitionListButtonUUID",
                                                        "properties": {
                                                          "textValue": ""
                                                        }
                                                      }
                                                    },
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "softwareIconUUID",
                                                        "properties": {
                                                          "disabled": false
                                                        }
                                                      }
                                                    },
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "manualIconUUID",
                                                        "properties": {
                                                          "disabled": false
                                                        }
                                                      }
                                                    },
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "requisitionSaveButtonUUID",
                                                        "properties": {
                                                          "disabled": true
                                                        }
                                                      },
                                                      "eventSource": "click"
                                                    },
                                                    {
                                                      "type": "context",
                                                      "config": {
                                                        "requestMethod": "add",
                                                        "key": "templateName",
                                                        "data": "BYD_COM_TOWERS_3"
                                                      },
                                                      "eventSource": "change"
                                                    },
                                                    {
                                                      "type": "microservice",
                                                      "config": {
                                                        "microserviceId": "getResultCodeByValidateResult",
                                                        "requestMethod": "get",
                                                        "params": {
                                                          "bcn": "#repairUnitInfo.ITEM_BCN",
                                                          "validateResult": 1
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
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "quoteResponseTimeoutUUID",
                                                                "properties": {
                                                                  "disabled": true
                                                                }
                                                              }
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "quoteResponseResultCodesUUID",
                                                                "dropDownProperties": {
                                                                  "options": "#resultCodesForDiscrepancy"
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
                                                    }
                                                  ]
                                                }
                                              }
                                            },
                                            {
                                              "type": "deleteComponent",
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
                      }
                    }
                  ]
                }
              ],
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "name": "requisitionSaveButton",
                  "text": "Requisition Part(s)",
                  "uuid": "requisitionSaveButtonUUID",
                  "inputClass": "requis-save-btn-cls",
                  "dialogButton": true,
                  "visibility": true,
                  "type": "submit",
                  "closeType": "success",
                  "hooks": [
                    {
                      "type": "condition",
                      "hookType": "afterInit",
                      "config": {
                        "operation": "isValid",
                        "lhs": "#requisitionListLength"
                      },
                      "eventSource": "change",
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#requisitionListStatus",
                                "rhs": "saved"
                              },
                              "eventSource": "change",
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "requisitionSaveButtonUUID",
                                        "properties": {
                                          "disabled": true
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
                                        "key": "requisitionSaveButtonUUID",
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
                        "onFailure": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "requisitionSaveButtonUUID",
                                "properties": {
                                  "disabled": true
                                }
                              },
                              "eventSource": "click"
                            }
                          ]
                        }
                      }
                    }
                  ],
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
                    "type": "microservice",
                    "config": {
                      "microserviceId": "getKardexReqDebug",
                      "isLocal": false,
                      "LocalService": "assets/Responses/performFA.json",
                      "requestMethod": "post",
                      "body": {
                        "locationId": "#repairUnitInfo.LOCATION_ID",
                        "clientId": "#repairUnitInfo.CLIENT_ID",
                        "contractId": "#repairUnitInfo.CONTRACT_ID",
                        "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                        "userName": "#userAccountInfo.PersonalDetails.USERID",
                        "owner": "#discrepancyUnitInfo.CLIENTNAME",
                        "orderProcessType": "#repairUnitInfo.ROUTE",
                        "conditionName": "Workable",
                        "line": "#kardexLineListQuote"
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
                              "key": "kardexReqDebugResLooperData",
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "microservice",
                            "config": {
                              "microserviceId": "createReqOrder",
                              "isLocal": false,
                              "LocalService": "assets/Responses/performFA.json",
                              "requestMethod": "post",
                              "body": {
                                "apiUsageClientName": "#repairUnitInfo.CLIENTNAME",
                                "callSource": "FrontEnd",
                                "clientRefNo1": "#repairUnitInfo.ITEM_BCN",
                                "clientRefNo2": "#repairUnitInfo.SERIAL_NO",
                                "orderStatus": "Released",
                                "lines": "#lineListQuote",
                                "templateName": "#templateName",
                                "kardexLineList": "#kardexReqDebugResLooperData.line",
                                "usrPw": {
                                  "username": "#loginUUID.username",
                                  "password": "#loginUUID.password"
                                }
                              },
                              "toBeStringified": true
                            },
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "requisitionSaveButtonUUID",
                                      "properties": {
                                        "disabled": false
                                      }
                                    },
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "createReqResp",
                                      "data": "responseData"
                                    }
                                  },
                                  {
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "qrrequisitionId",
                                      "data": "#createReqResp.requisitionId"
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "requisitionListButtonUUID",
                                      "properties": {
                                        "textValue": "- Saved",
                                        "textValueClass": "saved-green"
                                      }
                                    }
                                  },
                                  {
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "requisitionListStatus",
                                      "data": "saved"
                                    }
                                  },
                                  {
                                    "type": "enableComponent",
                                    "config": {
                                      "key": "quoteResponseResultCodesUUID",
                                      "property": "ResultCodes"
                                    },
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "quoteResponseTimeoutUUID",
                                      "properties": {
                                        "disabled": false
                                      }
                                    },
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "defaultResultCode",
                                      "data": "PASS_REW"
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "quoteResponseResultCodesUUID",
                                      "fieldProperties": {
                                        "ResultCodes": "PASS_REW"
                                      }
                                    },
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "QuoteResponseSelectedDescripencyResultcode",
                                      "data": "PASS_REW"
                                    },
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "softwareIconUUID",
                                      "properties": {
                                        "disabled": false
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "manualIconUUID",
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
                                    "type": "context",
                                    "config": {
                                      "requestMethod": "add",
                                      "key": "errorCreateReq",
                                      "data": "responseData"
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "errorTitleUUID",
                                      "properties": {
                                        "titleValue": "#errorCreateReq",
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
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "errorhpFa",
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "errorTitleUUID",
                              "properties": {
                                "titleValue": "#errorhpFa",
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
              "onFailure": {}
            }
          };
        }

        let cabDropDownUUID = "createdCabDropDown" + index;
        let createdTaskQty = "createdTaskQty" + index;
        let averageValueForExistingTaskUUID = "averageValueForExistingTaskUUID" + index;
        let replaceDeleteButtonUUID = "replaceDeleteButtonUUID" + index;
        let createdReplaceCompleteButtonUUID = "createdReplaceCompleteButtonUUID" + index;
        let createdTaskUserSelectedMessageName = "createdTaskUserSelectedMessageName" + index;
        let createdTaskCabMessage = "createdTaskUserSelectedMessage" + index;
        let createdTaskCabMessageName = "createdTaskCabMessageName" + index;
        let partRepType = "partRepType" + index;
        let averagePartValueResp = "averagePartValueResp" + index;
        let currentTaskPanelId = "currentTaskPanelId" + index;
        let finalPartNumber = "finalPartNumber" + index;
        let userSelectedPartNumber = "userSelectedPartNumber" + index;
        let occuranceCount = index + 1;
        let userSelectedPartType = "userSelectedPartTypeResp" + index;
        let partOwnerForReq = "partOwnerForQuoteReq" + index;
        let partConditionForReq = "partConditionForQuoteReq" + index;
        let financialCodeForReq = "financialCodeForQuoteReq" + index;

        //Setting default value, if part available it will update
        this.contextService.addToContext(partOwnerForReq, "HP");
        this.contextService.addToContext(partConditionForReq, "New");
        this.contextService.addToContext(financialCodeForReq, "0020");

        if(item.REQ_PN){
          // corePart
          // kitPart
          if(Array.isArray(item.corePart)){
            if(item.corePart.indexOf(item.REQ_PN) > -1 ){  
              this.contextService.addToContext(userSelectedPartType, "CORE");
            } else if(item.REQ_PN == item.kitPart){
              this.contextService.addToContext(userSelectedPartType, "KIT");
            }
          } else if(item.REQ_PN == item.kitPart){
            this.contextService.addToContext(userSelectedPartType, "KIT");
          }
        }

        let cabMessagesResp = this.contextService.getDataByKey("cabMessagesResp");
        let defaultCab;
        if (cabMessagesResp && (item.ACTION_NOTE !== null)) {
          defaultCab = cabMessagesResp.filter((currentCab) => {
            return currentCab.cab === item.ACTION_NOTE;
          });
        } else {
          defaultCab = [{
            "message": "Select"
          }];
        }

        const completeDefectName = item.DEFECT_CODE_NAME + '-' + item.DEFECT_CODE_DESC;
        replaceTaskActions = [
          {
            "type": "condition",
            "config": {
              "operation": "isEqualTo",
              "lhs": "#userSelectedClient",
              "rhs": "1030"
            },
            "eventSource": "change",
            "responseDependents": {
              "onSuccess": {
                "actions": [
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#userSelectedContract",
                      "rhs": "14856"
                    },
                    "eventSource": "change",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "ownerId",
                              "data": "1835"
                            },
                            "eventSource": "change"
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "ownerId",
                              "data": "#repairUnitInfo.OWNER_ID"
                            },
                            "eventSource": "change"
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
                      "key": "ownerId",
                      "data": "#repairUnitInfo.OWNER_ID"
                    },
                    "eventSource": "change"
                  }
                ]
              }
            }
          },
          {
            "type": "context",
            "config": {
              "requestMethod": "add",
              "key": userSelectedPartNumber,
              "data": item.REQ_PN
            },
            "eventSource": "change"
          },
          {
            "type": "microservice",
            "eventSource": "click",
            "config": {
              "microserviceId": "getReqListByPN",
              "requestMethod": "post",
              "body": {
                "partNo": "#" + userSelectedPartNumber,
                "locationId": "#repairUnitInfo.LOCATION_ID",
                "clientId": "#repairUnitInfo.CLIENT_ID",
                "contractId": "#repairUnitInfo.CONTRACT_ID",
                "partType":"#" + userSelectedPartType,
                "username": "#loginUUID.username"
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
                      "key": "userSelectedPartDescription",
                      "data": item.PART_DESC
                    },
                    "eventSource": "change"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "userSelectedCommodityName",
                      "data": item.ASSEMBLY_CODE_NAME
                    },
                    "eventSource": "change"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "userSelectedDefect",
                      "data": item.DEFECT_CODE_NAME
                    },
                    "eventSource": "change"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "userSelectedReplaceAction",
                      "data": item.ACTION_CODE_NAME
                    },
                    "eventSource": "change"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "userSelectedDefectName",
                      "data": completeDefectName
                    },
                    "eventSource": "change"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "getReqListByPNResp",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "add",
                      "key": "getReqListByPNRespArrayData",
                      "data": "responseArray"
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isNotEmptyArray",
                      "lhs": "#getReqListByPNResp"
                    },
                    "eventSource": "input",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "userSelectedPartNumberId",
                              "data": "#getReqListByPNRespArrayData.partId"
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "finalPartStockQuantity",
                              "data": "#getReqListByPNRespArrayData.quantity"
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": finalPartNumber,
                              "data": "#getReqListByPNRespArrayData.partNo"
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": partOwnerForReq,
                              "data": "#getReqListByPNRespArrayData.ownerName"
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": partConditionForReq,
                              "data": "#getReqListByPNRespArrayData.conditionName"
                            }
                          },
                          {
                            "type": "condition",
                            "config": {
                                "operation": "isEqualTo",
                                "lhs": "#" + partOwnerForReq,
                                "rhs": "HP"
                            },
                            "eventSource": "click",
                            "responseDependents": {
                                "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": financialCodeForReq,
                                          "data": "0020"
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
                                          "key": financialCodeForReq,
                                          "data": "001"
                                        }
                                      }
                                    ]
                                }
                            }
                          },
                          {
                            "type": "getFilteredFromContext",
                            "config": {
                              "target": "#occurenceList",
                              "key": "currentOccurenceData",
                              "properties": {
                                "key": item.ACTIONID
                              }
                            }
                          },
                          {
                            "type": "condition",
                            "config": {
                              "operation": "isEqualTo",
                              "lhs": item.REQ_PN,
                              "rhs": "#getReqListByPNRespArrayData.partNo"
                            },
                            "eventSource": "change",
                            "responseDependents": {
                              "onSuccess": {
                                "actions": []
                              },
                              "onFailure": {
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
                                                "assemblyCode": {
                                                  "value": item.ASSEMBLY_CODE_NAME
                                                },
                                                "defectCode": {
                                                  "occurrence": "#currentOccurenceData.defectCodeOccurence",
                                                  "value": item.DEFECT_CODE_NAME
                                                },
                                                "notes": item.ACTION_NOTE,
                                                "actionCode": item.ACTION_CODE_NAME,
                                                "operation": "Update"
                                              }
                                            ]
                                          },
                                          "defectCodeChangeList": {
                                            "defectCodeChange": [
                                              {
                                                "defectCode": item.DEFECT_CODE_NAME,
                                                "operation": "Update",
                                                "notes": "#getReqListByPNRespArrayData.partNo",
                                                "occurrence": "#currentOccurenceData.defectCodeOccurence"
                                              }
                                            ]
                                          }
                                        },
                                        "userPwd": {
                                          "username": "#loginUUID.username",
                                          "password": "#loginUUID.password"
                                        },
                                        "operationTypes": "ProcessImmediate",
                                        "ip": "::1",
                                        "callSource": "FrontEnd",
                                        "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                        "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                      },
                                      "toBeStringified": true,
                                      "spliceIfEmptyValueObject": [
                                        {
                                          "identifier": "actionCodeChange",
                                          "valueField": "notes"
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
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "userSelectedPartNumberName",
                              "data": "#getReqListByPNRespArrayData.completePart"
                            },
                            "eventSource": "change"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "userSelectedPartDescription",
                              "data": "#getReqListByPNRespArrayData.partDesc"
                            },
                            "eventSource": "change"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "quantity",
                              "data": "Qty 1"
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "headerClass",
                              "data": "body2"
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "displayQuantity",
                              "data": ""
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
                              "key": "userSelectedPartNumberId",
                              "data": item.PART_ID
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "finalPartStockQuantity",
                              "data": 0
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": finalPartNumber,
                              "data": "#" + userSelectedPartNumber
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": partOwnerForReq,
                              "data": "HP"
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": partConditionForReq,
                              "data": "New"
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": financialCodeForReq,
                              "data": "0020"
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "templateName",
                              "data": "BYD_COM_HOLD_3"
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "financialCode",
                              "data": "001"
                            },
                            "eventSource": "change"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "quantity",
                              "data": "Out of stock"
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "headerClass",
                              "data": "light-red heading-eco-normal"
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "displayQuantity",
                              "data": "Out of stock"
                            },
                            "eventSource": "click"
                          }
                        ]
                      }
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isValid",
                      "lhs": "#qrrequisitionId"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "qrrequisitionId",
                              "data": "#getRequisitionByBCN.requisitionId"
                            }
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "requisitionListButtonUUID",
                              "properties": {
                                "textValue": "- Saved",
                                "textValueClass": "saved-green"
                              }
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "requisitionListStatus",
                              "data": "saved"
                            }
                          }
                        ]
                      },
                      "onFailure": {
                        "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "requisitionListButtonUUID",
                              "properties": {
                                "textValue": "- Unsaved",
                                "textValueClass": "light-red body"
                              }
                            }
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "requisitionListStatus",
                              "data": "Unsaved"
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
                      "lhs": item.ACTION_NOTE
                    },
                    "eventSource": "click",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "financialCode",
                              "data": "001"
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
                              "key": "financialCode",
                              "data": "001"
                            },
                            "eventSource": "click"
                          }
                        ]
                      }
                    }
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "addToExistingContext",
                      "target": "lineListQuote",
                      "sourceData": {
                        "compLocation": "#repairUnitInfo.GEONAME",
                        "partNumber": "#" + finalPartNumber,
                        "defectName": "#userSelectedDefect",
                        "itemBCN": "#repairUnitInfo.ITEM_BCN",
                        "quantity": "1",
                        "owner": "#" + partOwnerForReq,
                        "condition": "#" + partConditionForReq,
                        "financialCode": "#" + financialCodeForReq,
                        "priority": "Medium"
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "addToExistingContext",
                      "target": "kardexLineListQuote",
                      "sourceData": {
                        "partId": "#userSelectedPartNumberId",
                        "partNumber": "#" + finalPartNumber,
                        "quantity": 1,
                        "availQuantity": "#finalPartStockQuantity",
                        "srcWarehouse": "HP LAPTOP WUR",
                        "srcLocation": "TOWERS",
                        "srcOwner": "#" + partOwnerForReq,
                        "srcCondition": "#" + partConditionForReq,
                        "isSubstituted": "NO"
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isValid",
                      "lhs": item.ACTION_NOTE
                    },
                    "eventSource": "click",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "repairProcessType",
                              "data": "Quote"
                            },
                            "eventSource": "change"
                          },
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": currentTaskPanelId,
                              "data": "#createdComponentUUID"
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
                              "key": "repairProcessType",
                              "data": "Kardex"
                            },
                            "eventSource": "change"
                          }
                        ]
                      }
                    }
                  },
                  {
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#requisitionListStatus",
                      "rhs": "saved"
                    },
                    "eventSource": "click",
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "condition",
                            "config": {
                              "operation": "isValid",
                              "lhs": item.ACTION_NOTE
                            },
                            "eventSource": "click",
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugTimeoutUUID",
                                      "properties": {
                                        "visibility": false,
                                        "disabled": true
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugNextUUID",
                                      "properties": {
                                        "visibility": true,
                                        "disabled": false
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugResultCodesUUID",
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
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugTimeoutUUID",
                                      "properties": {
                                        "visibility": true,
                                        "disabled": true
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugNextUUID",
                                      "properties": {
                                        "visibility": false,
                                        "disabled": true
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugResultCodesUUID",
                                      "properties": {
                                        "visibility": true
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
                              "operation": "isValid",
                              "lhs": item.ACTION_NOTE
                            },
                            "eventSource": "click",
                            "responseDependents": {
                              "onSuccess": {
                                "actions": [
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugTimeoutUUID",
                                      "properties": {
                                        "visibility": false,
                                        "disabled": true
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugNextUUID",
                                      "properties": {
                                        "visibility": true,
                                        "disabled": true
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugResultCodesUUID",
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
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugTimeoutUUID",
                                      "properties": {
                                        "visibility": true,
                                        "disabled": true
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugNextUUID",
                                      "properties": {
                                        "visibility": false,
                                        "disabled": true
                                      }
                                    }
                                  },
                                  {
                                    "type": "updateComponent",
                                    "eventSource": "click",
                                    "config": {
                                      "key": "debugResultCodesUUID",
                                      "properties": {
                                        "visibility": true,
                                        "disabled": true
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
                    "type": "condition",
                    "config": {
                      "operation": "isEqualTo",
                      "lhs": "#requisitionListStatus",
                      "rhs": "saved"
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions":[]
                      },
                      "onFailure": {
                        "actions": [
                          dialogBox
                        ]
                      }
                    }
                  },
                 
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "addToExistingContext",
                      "target": "requisitionList",
                      "sourceData": {
                        "Part Details": [
                          {
                            "ctype": "block-text",
                            "uuid": "StockUUID",
                            "text": "Part:",
                            "textValue": "#" + finalPartNumber,
                            "class": "subtitle1 greyish-black overflow-ellipsis width-200"
                          },
                          {
                            "ctype": "block-text",
                            "uuid": "StockUUID",
                            "textValue": "#userSelectedPartDescription",
                            "class": "subtitle1 greyish-black overflow-wrap width-200"
                          }
                        ],
                        "Qty": [
                          {
                            "ctype": "block-text",
                            "uuid": "StockUUID",
                            "text": "1"
                          },
                          {
                            "ctype": "block-text",
                            "uuid": "displayQuantityUUID",
                            "class": "light-red body margin-top-10",
                            "text": "#displayQuantity"
                          }
                        ],
                        "parentUUID": "#createdComponentUUID"
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "config": {
                      "requestMethod": "addToExistingContext",
                      "target": "debugFlexFieldData",
                      "sourceData": {
                        "parentUUID": "#createdComponentUUID",
                        "flexFields": [
                          {
                            "userSelectedCommodityName": "#userSelectedCommodityName",
                            "userSelectedDefect": "#userSelectedDefect",
                            "userSelectedAction": "#userSelectedReplaceAction"
                          }
                        ]
                      }
                    },
                    "eventSource": "click"
                  },
                  {
                    "type": "context",
                    "eventSource": "click",
                    "config": {
                      "requestMethod": "add",
                      "key": "requisitionListLength",
                      "data": "contextLength",
                      "sourceContext": "requisitionList"
                    }
                  },
                  {
                    "type": "errorPrepareAndRender",
                    "eventSource": "click",
                    "config": {
                      "key": "requisitionListButtonUUID",
                      "properties": {
                        "titleValue": "Requisition List ({0})",
                        "isShown": true
                      },
                      "valueArray": [
                        "#requisitionListLength"
                      ]
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
                      "key": "errorResp",
                      "data": "responseData"
                    }
                  },
                  {
                    "type": "updateComponent",
                    "config": {
                      "key": "errorTitleUUID",
                      "properties": {
                        "titleValue": "#errorResp",
                        "isShown": true
                      }
                    }
                  }
                ]
              }
            }
          }
        ];

        if (item.ACTION_CODE_NAME == 29 || item.ACTION_CODE_NAME == 77) {
          if (filterIWData) {
            if (item.FA_FF_VALUE == "IW") {
              replaceTaskActions.forEach((ele) => {
                actionService.handleAction(ele, instance);
              });
            }
          } else {
            replaceTaskActions.forEach((ele) => {
              actionService.handleAction(ele, instance);
            });
          }
        } else {
          //do nothing
        }
      });

      //@quote response -> for fetching result codes and to update it
      this.quoteResponseResultListFetchActs().forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }
  quoteResponseResultListFetchActs() {
    return [{
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
            },
            {
              "type": "updateComponent",
              "config": {
                "key": "quoteResponseResultCodesUUID",
                "dropDownProperties": {
                  "options": "#resultCodesForDiscrepancy"
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
    }];
  }
  
  async cancelFALooperOperation(action, instance,actionService) {
    if ((action && action.type) === "cancelFALooper") {
      let looperData = [];
      let currentOccObj;
      let foundOccuranceObj = [];
      let onlyCID = false;
      let addFA = false;
      let occuranceListData = this.contextService.getDataByKey("occurenceList");

      onlyCID = action.config.onlyCID ? action.config.onlyCID : false;
      addFA = action.config.addFA ? action.config.addFA : false;

      let defaultResultCode = (action.config.defaultResultCode || null);
      looperData = this.contextService.getDataByKey(action.config.data);
      if (looperData !== undefined && looperData.length > 0) {
        for(let i=0; i< looperData.length;i++) {
          
          let item = looperData[i];

          //In order to keep occurance list updated in all iteration.
          occuranceListData = this.contextService.getDataByKey("occurenceList");

          if(!occuranceListData){
            occuranceListData = [];
          }

          //Current Occurance Data
          foundOccuranceObj = occuranceListData.filter((element) => {
            return element.taskUuid === item.ACTIONID;
          });

          if(foundOccuranceObj.length > 0){
            currentOccObj = foundOccuranceObj[0];
            //add to context
            this.contextService.addToContext('currentActionID', currentOccObj.taskUuid);
            this.contextService.addToContext('currentOccuranceObj', currentOccObj);
          }

          if (item.ACTION_CODE_NAME == 29 || item.ACTION_CODE_NAME == 77) {
            if (onlyCID) {
              if (item.FA_FF_VALUE == "CID") {

                await this.cancelFaforAssemplyCode(item,defaultResultCode, currentOccObj).then((data)=>{                  
                });

                await this.cancelFaforDefectCode(item,defaultResultCode, currentOccObj, instance, actionService).then((data)=>{
                  this.contextService.addToContext('requisitionListStatus','Unsaved');

                  let reqBtnCompRef = this.contextService.getDataByKey('requisitionListButtonUUID' + 'ref');
                  let reqLength = this.contextService.getDataByString('#requisitionListLength');
                  let properties = {};
                  properties['titleValue'] = "Requisition List ("+reqLength ? reqLength : 0 +")";
                  if(reqLength != undefined && reqLength != null && reqLength != ""){
                    properties['textValue'] = "- Unsaved";
                    properties['textValueClass'] = "light-red body";
                  }else{
                    properties['textValue'] = "";
          
                  }
          
                  properties['isShown'] = true;
                  Object.assign(reqBtnCompRef.instance, properties);
                  if(reqLength == undefined || reqLength == null || reqLength == ""){
                    this.getResultCodeInfo(defaultResultCode);
                  }

                  //delete or update occurance action calls
                  
                  let occuranceUpdateOper = [{
                    "type": "deleteAndUpdateOccurence",
                    "config": {
                      "target": "#occurenceList",
                      "key": "#currentActionID",
                      "currentTaskData": "#currentOccuranceObj"
                    }
                  }];

                  occuranceUpdateOper.forEach((element) => {
                    actionService.handleAction(element, instance);
                  });
          
                  reqBtnCompRef.instance._changeDetectionRef.detectChanges();
                });              
              }
            } else {
              await this.cancelFaforAssemplyCode(item,defaultResultCode, currentOccObj).then((data)=>{                
              });
          
              await this.cancelFaforDefectCode(item,defaultResultCode, currentOccObj, instance, actionService).then((data)=>{                
                this.contextService.addToContext('requisitionListStatus','Unsaved');
          
                let reqBtnCompRef = this.contextService.getDataByKey('requisitionListButtonUUID' + 'ref');
                let reqLength = this.contextService.getDataByString('#requisitionListLength');
                let properties = {};
                properties['titleValue'] = "Requisition List ("+reqLength ? reqLength : 0 +")";
                if(reqLength != undefined && reqLength != null && reqLength != ""){
                  properties['textValue'] = "- Unsaved";
                  properties['textValueClass'] = "light-red body";
                }else{
                  properties['textValue'] = "";
          
                }
          
                properties['isShown'] = true;
                Object.assign(reqBtnCompRef.instance, properties);
                if(reqLength == undefined || reqLength == null || reqLength == ""){
                  this.getResultCodeInfo(defaultResultCode);
                }

                //delete or update occurance action calls
                
                let occuranceUpdateOper = [{
                  "type": "deleteAndUpdateOccurence",
                  "config": {
                    "target": "#occurenceList",
                    "key": "#currentActionID",
                    "currentTaskData": "#currentOccuranceObj"
                  }
                }];

                occuranceUpdateOper.forEach((element) => {
                  actionService.handleAction(element, instance);
                });
          
                reqBtnCompRef.instance._changeDetectionRef.detectChanges();
              });
            }
          }
        }

        if (addFA) {
          this.addFailureAnalysis(defaultResultCode);
        }
      }
    }
  }

  async cancelFaforAssemplyCode(item,defaultResultCode, currentOccObj) {
    let reqBody = {
      "updateFailureAnalysisRequest": {
        "bcn": "#repairUnitInfo.ITEM_BCN",
        "assemblyCodeChangeList": {
          "assemblyCodeChange": [
            {
              "assemblyCode": item.ASSEMBLY_CODE_NAME,
              "operation": "Delete",
              "occurrence": currentOccObj.assemblycodeOccurence
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
    }

    let bodyObj = this.contextService.getParsedObject(reqBody, this.utilityService);
    bodyObj = JSON.stringify(bodyObj);

    let promise = new Promise((resolve, reject) => {
      this.http.post(serviceUrls['cancelFA'], bodyObj,{headers: this.headers,observe: 'response'})
        .toPromise()
        .then( (response : HttpResponse<any>) => {
          if(response.body && response.body['status']){
            resolve(response);
          }else{
            let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
            let properties = {};
            properties['titleValue'] = response.body['message'];
            properties['isShown'] = true;
            Object.assign(compRef.instance, properties);
            compRef.instance._changeDetectionRef.detectChanges();
            reject(response);
          }
        }, msg => {
          let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
          let properties = {};
          properties['titleValue'] = "The server encountered an error processing the request. Please try again.";
          properties['isShown'] = true;
          Object.assign(compRef.instance, properties);
          compRef.instance._changeDetectionRef.detectChanges();
          reject(msg);
        });
    });

    return promise;
  }

  async cancelFaforDefectCode(item,defaultResultCode, currentOccObj, instance, actionService){
    let reqBody = {
      "updateFailureAnalysisRequest": {
        "bcn": "#repairUnitInfo.ITEM_BCN",

        "defectCodeChangeList": {
          "defectCodeChange": [
            {
              "defectCode": item.DEFECT_CODE_NAME,
              "operation": "Delete",
              "occurrence": currentOccObj.defectCodeOccurence
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
    }
    let bodyObj = this.contextService.getParsedObject(reqBody, this.utilityService);
    bodyObj = JSON.stringify(bodyObj);

    let promise = new Promise((resolve, reject) => {
      this.http.post(serviceUrls['cancelFA'], bodyObj,{headers: this.headers,observe: 'response'})
      .toPromise()
        .then((response : HttpResponse<any>) => {
          if(response.body && response.body['status']){
            resolve(response);
          }else{
            let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
            let properties = {};
            properties['titleValue'] = response.body['message'];
            properties['isShown'] = true;
            Object.assign(compRef.instance, properties);
            compRef.instance._changeDetectionRef.detectChanges();
            reject(response);
          }
        }, msg => {
          let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
          let properties = {};
          properties['titleValue'] = "The server encountered an error processing the request. Please try again.";
          properties['isShown'] = true;
          Object.assign(compRef.instance, properties);
          compRef.instance._changeDetectionRef.detectChanges();
          reject(msg);
        });
    });

    return promise;
  }

  async addFailureAnalysis(defaultResultCode) {
    let body = {
      "updateFailureAnalysisRequest": {
        "bcn": "#repairUnitInfo.ITEM_BCN",
        "actionCodeChangeList": {
          "actionCodeChange": [
            {
              "assemblyCode": {
                "value": "WK"
              },
              "defectCode": {
                "value": "NTF"
              },
              "actionCode": "34",
              "operation": "Add",
              "flexFieldList": {
                "flexField": [
                  {
                    "name": "Part rep. reason",
                    "value": "Operator"
                  },
                  {
                    "name": "Part rep. Type",
                    "value": "IW"
                  }
                ]
              }
            }
          ]
        },
        "assemblyCodeChangeList": {
          "assemblyCodeChange": [
            {
              "assemblyCode": "WK",
              "operation": "Add"
            }
          ]
        },
        "defectCodeChangeList": {
          "defectCodeChange": [
            {
              "defectCode": "NTF",
              "operation": "Add",
            }
          ]
        }
      },
      "userPwd": {
        "username": "#loginUUID.username",
        "password": "#loginUUID.password"
      },
      "operationTypes": "ProcessImmediate",
      "ip": "::1",
      "callSource": "FrontEnd",
      "apiUsage_LocationName": "#UnitInfo.GEONAME",
      "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
    };
    let bodyObj = this.contextService.getParsedObject(body, this.utilityService);
    bodyObj = JSON.stringify(bodyObj);
    let response = this.http.post(serviceUrls['performFA'], bodyObj,{headers: this.headers,observe: 'response'})
      .subscribe((resp: HttpResponse<any>) => {        
        if(resp.body['status']){
          this.getResultCodeInfo(defaultResultCode);
        }else{
          let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
          let properties = {};
          properties['titleValue'] = resp.body['message'];
          properties['isShown'] = true;
          Object.assign(compRef.instance, properties);
          compRef.instance._changeDetectionRef.detectChanges();
        }
      },
      (error) => {
        let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
        let properties = {};
        properties['titleValue'] = "The server encountered an error processing the request. Please try again.";
        properties['isShown'] = true;
        Object.assign(compRef.instance, properties);
        compRef.instance._changeDetectionRef.detectChanges();
      });
    return await response;
  }

  async getResultCodeInfo(defaultResultCode){
    let itemBcn = this.contextService.getDataByString('#repairUnitInfo.ITEM_BCN')
    let params = {
      "bcn": itemBcn,
      "validateResult": 0
    };

    let responseResult = await this.transactionService
      .get('getResultCodeByValidateResult', params, false)
      .subscribe((response) => {        
        if(response && response.status){
          this.contextService.addToContext('resultCodesForDiscrepancy',response.data);
          
          if(defaultResultCode != undefined && defaultResultCode !== null && defaultResultCode != ""){
            let timeoutBtn = this.contextService.getDataByKey('quoteResponseTimeoutUUID' + 'ref');
            let properties = {};
            properties['disabled'] = (defaultResultCode ? false : true);
            Object.assign(timeoutBtn.instance, properties);
            timeoutBtn.instance._changeDetectionRef.detectChanges();
          }

          let resultCode = this.contextService.getDataByKey('quoteResponseResultCodesUUID' + 'ref');
          resultCode.instance.group.controls['ResultCodes'].enable();
          resultCode.instance.disabled = false;
          

          let fieldValue = response.data.map((resultCodesList) => ({
            code: resultCodesList[resultCode.instance.code],
            displayValue: resultCodesList[resultCode.instance.displayValue],
          }));

          fieldValue.sort((a, b) =>
            a.displayValue.localeCompare(b.displayValue)
          );

          resultCode.instance.options = fieldValue;
          // let defaultValue = this.contextService.getDataByString(resultCode.instance.defaultValue);
          // if(defaultValue != null && defaultValue !)
          resultCode.instance.group.controls[resultCode.instance.name].setValue(defaultResultCode);

          resultCode.instance._changeDetectionRef.detectChanges();

          this.contextService.addToContext('QuoteResponseSelectedDescripencyResultcode',defaultResultCode);
        }else{
          let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
          let properties = {};
          properties['titleValue'] = response.message;
          properties['isShown'] = true;
          Object.assign(compRef.instance, properties);
          compRef.instance._changeDetectionRef.detectChanges();
        }
      },
      (error) => {
        let compRef = this.contextService.getDataByKey('errorTitleUUID' + 'ref');
        let properties = {};
        properties['titleValue'] = "The server encountered an error processing the request. Please try again.";
        properties['isShown'] = true;
        Object.assign(compRef.instance, properties);
        compRef.instance._changeDetectionRef.detectChanges();
      });
    return responseResult;
  }
}