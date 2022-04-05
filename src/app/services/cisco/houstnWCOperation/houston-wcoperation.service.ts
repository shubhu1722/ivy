import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class HoustonWCOperationService {

  constructor(private contextService: ContextService) { }

  handleCiscoTimeInActions(actionData, instance, actionService, responseData?: any) {
    const action = cloneDeep(actionData);
    this.firsttimeInMicroServices(action, instance, actionService);
  }

  firsttimeInMicroServices(action, instance, actionService) {
    this.contextService.deleteDataByKey("isTimeOutFromCiscoWC");
    let timeInCiscoMicroServices = {
      "type": "microservice",
      "config": {
        "microserviceId": "performTimeIn",
        "requestMethod": "post",
        "body": {
          "timeInRequest": {
            "workCenter": "#UnitInfo.DESTINATIONWC",
            "location": "#UnitInfo.GEONAME",
            "part": "#UnitInfo.PART_NO",
            "bcn": "#UnitInfo.ITEM_BCN",
            "serialNumber": "#UnitInfo.SERIAL_NO",
            "password": "#loginUUID.password"
          },
          "SesCustomer": 1,
          "userName": "#loginUUID.username",
          "userPass": "#loginUUID.password",
          "ip": "::1",
          "callSource": "FrontEnd",
          "apiUsage_LocationName": "#UnitInfo.GEONAME",
          "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
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
                  "unitIdentificationValue": "#userSearchCriteriaCisco.unitIdentificationValue",
                  "identificatorType": "#userSearchCriteriaCisco.identificatorType",
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
                        "key": "UnitInfo",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isValidList",
                        "validList": [
                          "#UnitInfo.DESTINATIONWC",
                          "#UnitInfo.WORKCENTER_ID"
                        ]
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "microservice",
                              "config": {
                                "microserviceId": "getBomCount",
                                "requestMethod": "post",
                                "body": {
                                  "locationId": "#userSelectedLocation",
                                  "mainPartNo": "#UnitInfo.PART_NO"
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
                                        "key": "BomCount",
                                        "data": "responseData"
                                      }
                                    },
                                    {
                                      "type": "microservice",
                                      "config": {
                                        "microserviceId": "getResultCodes",
                                        "requestMethod": "get",
                                        "params": {
                                          "bcn": "#UnitInfo.ITEM_BCN",
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
                                                "key": "ResultCodes",
                                                "data": "responseData"
                                              }
                                            },
                                            {
                                              "type": "microservice",
                                              "config": {
                                                "microserviceId": "getBomsByMainPartNo",
                                                "requestMethod": "post",
                                                "body": {
                                                  "locationId": "#userSelectedLocation",
                                                  "mainPartNo": "#UnitInfo.PART_NO"
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
                                                        "key": "BomsByMainPartNo",
                                                        "data": "responseData"
                                                      }
                                                    },
                                                    {
                                                      "type": "microservice",
                                                      "config": {
                                                        "microserviceId": "getConditionFlexFields",
                                                        "requestMethod": "get",
                                                        "params": {
                                                          "locationId": "#userSelectedLocation",
                                                          "clientId": "#userSelectedClient",
                                                          "contractId": "#userSelectedContract"
                                                        }
                                                      },
                                                      "responseDependents": {
                                                        "onSuccess": {
                                                          "actions": [
                                                            {
                                                              "type": "context",
                                                              "config": {
                                                                "requestMethod": "add",
                                                                "key": "conditionOptions",
                                                                "data": "responseData"
                                                              }
                                                            },
                                                            {
                                                              "type": "hou-commonCiscoWCOperations",
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
                                                      "type": "hou-commonCiscoWCOperations",
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
                              "type": "updateComponent",
                              "config": {
                                "key": "searchCriteriaErrorTitleUUID",
                                "properties": {
                                  "titleValue": "This unit is in Perform Exit Routing",
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

    // timeInCiscoMicroServices.forEach((element) => {
    actionService.handleAction(timeInCiscoMicroServices, instance);
    // });
  }
  secondtimeInMicroServices(action, instance, actionService) {
    this.contextService.deleteDataByKey("isTimeOutFromCiscoWC");
    let reducetimeInMicroServices = {
      "type": "microservice",
      "config": {
        "microserviceId": "performTimeIn",
        "requestMethod": "post",
        "body": {
          "timeInRequest": {
            "workCenter": "#UnitInfo.DESTINATIONWC",
            "location": "#UnitInfo.GEONAME",
            "part": "#UnitInfo.PART_NO",
            "bcn": "#UnitInfo.ITEM_BCN",
            "serialNumber": "#UnitInfo.SERIAL_NO",
            "password": "#loginUUID.password"
          },
          "SesCustomer": 1,
          "userName": "#loginUUID.username",
          "userPass": "#loginUUID.password",
          "ip": "::1",
          "callSource": "FrontEnd",
          "apiUsage_LocationName": "#UnitInfo.GEONAME",
          "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
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
                  "unitIdentificationValue": "#userSearchCriteriaCisco.unitIdentificationValue",
                  "identificatorType": "#userSearchCriteriaCisco.identificatorType",
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
                        "key": "UnitInfo",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isValidList",
                        "validList": [
                          "#UnitInfo.DESTINATIONWC",
                          "#UnitInfo.WORKCENTER_ID"
                        ]
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "microservice",
                              "config": {
                                "microserviceId": "getBomCount",
                                "requestMethod": "post",
                                "body": {
                                  "locationId": "#userSelectedLocation",
                                  "mainPartNo": "#UnitInfo.PART_NO"
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
                                        "key": "BomCount",
                                        "data": "responseData"
                                      }
                                    },
                                    {
                                      "type": "microservice",
                                      "config": {
                                        "microserviceId": "getResultCodes",
                                        "requestMethod": "get",
                                        "params": {
                                          "bcn": "#UnitInfo.ITEM_BCN",
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
                                                "key": "ResultCodes",
                                                "data": "responseData"
                                              }
                                            },
                                            {
                                              "type": "microservice",
                                              "config": {
                                                "microserviceId": "getBomsByMainPartNo",
                                                "requestMethod": "post",
                                                "body": {
                                                  "locationId": "#userSelectedLocation",
                                                  "mainPartNo": "#UnitInfo.PART_NO"
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
                                                        "key": "BomsByMainPartNo",
                                                        "data": "responseData"
                                                      }
                                                    },
                                                    {
                                                      "type": "microservice",
                                                      "config": {
                                                        "microserviceId": "getConditionFlexFields",
                                                        "requestMethod": "get",
                                                        "params": {
                                                          "locationId": "#userSelectedLocation",
                                                          "clientId": "#userSelectedClient",
                                                          "contractId": "#userSelectedContract"
                                                        }
                                                      },
                                                      "responseDependents": {
                                                        "onSuccess": {
                                                          "actions": [
                                                            {
                                                              "type": "context",
                                                              "config": {
                                                                "requestMethod": "add",
                                                                "key": "conditionOptions",
                                                                "data": "responseData"
                                                              }
                                                            },
                                                            {
                                                              "type": "hou-commonCiscoWCOperations",
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
                                  "titleValue": "This unit is in Perform Exit Routing",
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
                        "key": "searchCriteriaErrorTitleUUID",
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
                "key": "searchCriteriaErrorTitleUUID",
                "properties": {
                  "titleValue": "#errorMsg",
                  "isShown": true
                }
              }
            }
          ]
        }
      }
    };

    // timeInCiscoMicroServices.forEach((element) => {
    actionService.handleAction(reducetimeInMicroServices, instance);
    // });
  }
  CommonCiscoActions(action, instance, actionService) {
    this.contextService.deleteDataByKey("isTimeOutFromCiscoWC");
    let replaceTask = [
      {
        "type": "condition",
        "config": {
          "operation": "isValid",
          "lhs": "#UnitInfo.ROUTE_ID"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "condition",
                "config": {
                  "operation": "isValid",
                  "lhs": "#UnitInfo.WORKCENTER_ID"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "microservice",
                        "hookType": "afterInit",
                        "config": {
                          "microserviceId": "getprocessFlexFields",
                          "isLocal": false,
                          "LocalService": "assets/Responses/mockBGA.json",
                          "requestMethod": "get",
                          "params": {
                            "bcn": "#UnitInfo.ITEM_BCN",
                            "serialNo": "#UnitInfo.SERIAL_NO",
                            "flexFieldId": "110820,110840,110821"
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "houstonFF",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "handleArray",
                                "config": {
                                  "action": "filterByProperty",
                                  "arrayName": "#houstonFF",
                                  "objectKeys": "flexFieldName",
                                  "objectValues": "Classification",
                                  "contextKey": "houClassification"
                                }
                              },
                              {
                                "type": "handleArray",
                                "config": {
                                  "action": "filterByProperty",
                                  "arrayName": "#houstonFF",
                                  "objectKeys": "flexFieldName",
                                  "objectValues": "MasterGrade",
                                  "contextKey": "houMasterGrade"
                                }
                              },
                              {
                                "type": "handleArray",
                                "config": {
                                  "action": "filterByProperty",
                                  "arrayName": "#houstonFF",
                                  "objectKeys": "flexFieldName",
                                  "objectValues": "InboundSource",
                                  "contextKey": "houInboundSource"
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
                      },
                      {
                        "type": "microservice",
                        "config": {
                          "microserviceId": "getSubProcessMenu",
                          "requestMethod": "get",
                          "isLocal": false,
                          "LocalService": "assets/Responses/getSubprocessTest.json",
                          "params": {
                            "userId": "#loginUUID.username",
                            "locationId": "#userSelectedLocation",
                            "clientId": "#userSelectedClient",
                            "contractId": "#userSelectedContract",
                            "wcId": "#UnitInfo.WORKCENTER_ID",
                            "optId": "#UnitInfo.ROUTE_ID",
                            "btt": "",
                            "whId": "#UnitInfo.WAREHOUSE_ID",
                            "operationType": "#userSelectedSubProcessType",
                            "workCenterName": "#UnitInfo.WORKCENTER"
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
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualToIgnoreCase",
                                  "lhs": "#UnitInfo.WORKCENTER",
                                  "rhs": "IQA"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "renderTemplate",
                                        "config": {
                                          "templateId": "houston/houston-IQAStartup.json",
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
                                          "lhs": "#UnitInfo.WORKCENTER",
                                          "rhs": "CONFIG"
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "microservice",
                                                "config": {
                                                  "microserviceId": "getPCBByMainPart",
                                                  "requestMethod": "post",
                                                  "body": {
                                                    "mainPartNo": "#UnitInfo.PART_NO",
                                                    "locationId": "#userSelectedLocation",
                                                    "itemId": "#UnitInfo.ITEM_ID",
                                                    "clientId": "#userSelectedClient",
                                                    "contractId": "#userSelectedContract"
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
                                                          "key": "getPCBByMainPart",
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "microservice",
                                                        "config": {
                                                          "microserviceId": "getCustomInstruction",
                                                          "requestMethod": "post",
                                                          "body": {
                                                            "customInstructionType": "ECO",
                                                            "sourceType": "PID",
                                                            "firstSource": "#UnitInfo.PART_NO",
                                                            "secondSource": "#UnitInfo.SERIAL_NO",
                                                            "username": "#loginUUID.username",
                                                            "locationId": "#userSelectedLocation",
                                                            "mainPartNo": "#UnitInfo.PART_NO",
                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                            "clientId": "#userSelectedClient",
                                                            "contractId": "#userSelectedContract"

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
                                                                  "key": "flexFieldsFormGroup",
                                                                  "data": []
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "ecoBookingData",
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "renderTemplate",
                                                                "config": {
                                                                  "templateId": "houston/houston-ECO_booking.json",
                                                                  "mode": "local"
                                                                }
                                                              },
                                                              {
                                                                "type": "updateStage",
                                                                "config": {
                                                                  "currentStage": "PRE-SCREEN",
                                                                  "currentSubProcess": "IQA",
                                                                  "nextStage": "ECO BOOKING",
                                                                  "targetId": "menuTreeUUID",
                                                                  "processId": "#SubprocessMenu"
                                                                }
                                                              },
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "subProcessMenuType",
                                                                  "data": "IQA-ECOBooking"
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
                                                                  "key": "flexFieldsFormGroup",
                                                                  "data": []
                                                                },
                                                                "eventSource": "click"
                                                              },
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "ecoBookingData",
                                                                  "data": "Error while getting the data from stored proc"
                                                                }
                                                              },
                                                              {
                                                                "type": "renderTemplate",
                                                                "config": {
                                                                  "templateId": "houston/houston-ECO_booking.json",
                                                                  "mode": "local"
                                                                }
                                                              },
                                                              {
                                                                "type": "updateStage",
                                                                "config": {
                                                                  "currentStage": "PRE-SCREEN",
                                                                  "currentSubProcess": "IQA",
                                                                  "nextStage": "ECO BOOKING",
                                                                  "targetId": "menuTreeUUID",
                                                                  "processId": "#SubprocessMenu"
                                                                }
                                                              },
                                                              {
                                                                "type": "context",
                                                                "config": {
                                                                  "requestMethod": "add",
                                                                  "key": "subProcessMenuType",
                                                                  "data": "IQA-ECOBooking"
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
                                                          "key": "getPCBByMainPart",
                                                          "data": "responseData"
                                                        }
                                                      },
                                                      {
                                                        "type": "updateComponent",
                                                        "config": {
                                                          "key": "errorTitleUUID",
                                                          "properties": {
                                                            "titleValue": "#getPCBByMainPart",
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
                                                  "operation": "isEqualToIgnoreCase",
                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                  "rhs": "Stop"
                                                },
                                                "responseDependents": {
                                                  "onSuccess": {
                                                    "actions": [
                                                      {
                                                        "type": "renderTemplate",
                                                        "config": {
                                                          "templateId": "houston/houston-Stop.json",
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
                                                          "operation": "isEqualToIgnoreCase",
                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                          "rhs": "FQA"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "microservice",
                                                                "config": {
                                                                  "microserviceId": "getFlexFieldsWithValues",
                                                                  "requestMethod": "get",
                                                                  "isLocal": false,
                                                                  "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                  "params": {
                                                                    "itemId": "#UnitInfo.ITEM_ID",
                                                                    "ffId": "110882,110881,110880,110879,110883,110884"
                                                                  }
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "context",
                                                                        "config": {
                                                                          "requestMethod": "add",
                                                                          "key": "resultCodesForFQA",
                                                                          "data": "responseData"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "handleArray",
                                                                        "config": {
                                                                          "action": "filterByProperty",
                                                                          "arrayName": "#resultCodesForFQA",
                                                                          "objectKeys": "flexFieldName",
                                                                          "objectValues": "Cosmetic Damage",
                                                                          "contextKey": "cosmeticDamage"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "handleArray",
                                                                        "config": {
                                                                          "action": "filterByProperty",
                                                                          "arrayName": "#resultCodesForFQA",
                                                                          "objectKeys": "flexFieldName",
                                                                          "objectValues": "Cosmetic Damage Part",
                                                                          "contextKey": "cosmeticDamagePart"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "handleArray",
                                                                        "config": {
                                                                          "action": "filterByProperty",
                                                                          "arrayName": "#resultCodesForFQA",
                                                                          "objectKeys": "flexFieldName",
                                                                          "objectValues": "Boot Test",
                                                                          "contextKey": "bootTestToggleValues"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "handleArray",
                                                                        "config": {
                                                                          "action": "filterByProperty",
                                                                          "arrayName": "#resultCodesForFQA",
                                                                          "objectKeys": "flexFieldName",
                                                                          "objectValues": "LED Test",
                                                                          "contextKey": "ledTestToggleValues"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "handleArray",
                                                                        "config": {
                                                                          "action": "filterByProperty",
                                                                          "arrayName": "#resultCodesForFQA",
                                                                          "objectKeys": "flexFieldName",
                                                                          "objectValues": "SVT Test",
                                                                          "contextKey": "svtTestToggleValues"
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "ledTestToggleUUID",
                                                                          "properties": {
                                                                            "options": "#ledTestToggleValues"
                                                                          }
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "cosmeticDamageUUID",
                                                                          "dropDownProperties": {
                                                                            "options": "#cosmeticDamage"
                                                                          }
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "updateComponent",
                                                                        "config": {
                                                                          "key": "cosmeticDamagePartUUID",
                                                                          "dropDownProperties": {
                                                                            "options": "#cosmeticDamagePart"
                                                                          }
                                                                        }
                                                                      },
                                                                      {
                                                                        "type": "microservice",
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "microserviceId": "getLoopingFlexFieldValues",
                                                                          "requestMethod": "get",
                                                                          "isLocal": false,
                                                                          "LocalService": "assets/Responses/ciso_FQA_Dummyreponse.json",
                                                                          "params": {
                                                                            "itemId": "#UnitInfo.ITEM_ID"
                                                                          }
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "getLoopingFlexFieldValuesData",
                                                                                  "data": "responseData"
                                                                                },
                                                                                "eventSource": "click"
                                                                              },
                                                                              {
                                                                                "type": "renderTemplate",
                                                                                "config": {
                                                                                  "templateId": "houston/houston-FQA.json",
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
                                                                                  "key": "errorResp",
                                                                                  "data": "responseData"
                                                                                },
                                                                                "eventSource": "click"
                                                                              },
                                                                              {
                                                                                "type": "updateComponent",
                                                                                "config": {
                                                                                  "key": "errorTitleUUID",
                                                                                  "properties": {
                                                                                    "titleValue": "#errorResp",
                                                                                    "isShown": true
                                                                                  },
                                                                                  "eventSource": "click"
                                                                                }
                                                                              },
                                                                              {
                                                                                "type": "renderTemplate",
                                                                                "config": {
                                                                                  "templateId": "houston/houston-FQA.json",
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
                                                                      },
                                                                      {
                                                                        "type": "renderTemplate",
                                                                        "config": {
                                                                          "templateId": "houston/houston-FQA.json",
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
                                                                "type": "condition",
                                                                "config": {
                                                                  "operation": "isEqualToIgnoreCase",
                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                  "rhs": "PACK-OUT"
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "microservice",
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "microserviceId": "getPackOutDetailsByPid",
                                                                          "requestMethod": "get",
                                                                          "isLocal": false,
                                                                          "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                          "params": {
                                                                            "locationId": "#userSelectedLocation",
                                                                            "pidNo": "#UnitInfo.PART_NO"
                                                                          }
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "getPackOutDetails",
                                                                                  "data": "responseData"
                                                                                },
                                                                                "eventSource": "click"
                                                                              },
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "getConfirmAccessoryData",
                                                                                  "data": "#getPackOutDetails.accessories"
                                                                                },
                                                                                "eventSource": "click"
                                                                              },
                                                                              {
                                                                                "type": "context",
                                                                                "config": {
                                                                                  "requestMethod": "add",
                                                                                  "key": "getPackSealData",
                                                                                  "data": "#getPackOutDetails.packages"
                                                                                },
                                                                                "eventSource": "click"
                                                                              },
                                                                              {
                                                                                "type": "renderTemplate",
                                                                                "config": {
                                                                                  "templateId": "houston/houston-Packout.json",
                                                                                  "mode": "local"
                                                                                }
                                                                              }
                                                                            ]
                                                                          },
                                                                          "onFailure": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "renderTemplate",
                                                                                "config": {
                                                                                  "templateId": "houston/houston-Packout.json",
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
                                                                        "type": "condition",
                                                                        "config": {
                                                                          "operation": "isEqualTo",
                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                          "rhs": "TOUCHandCLEAN"
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "renderTemplate",
                                                                                "config": {
                                                                                  "templateId": "houston/houston-T&C.json",
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
                                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                                  "rhs": "TnC_RW"
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "microservice",
                                                                                        "hookType": "afterInit",
                                                                                        "config": {
                                                                                          "microserviceId": "getReadOnlyTasks",
                                                                                          "requestMethod": "get",
                                                                                          "isLocal": false,
                                                                                          "LocalService": "assets/Responses/tcrework.json",
                                                                                          "params": {
                                                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                                                            "workCenterId": "#UnitInfo.WORKCENTER_ID"
                                                                                          }
                                                                                        },
                                                                                        "responseDependents": {
                                                                                          "onSuccess": {
                                                                                            "actions": [
                                                                                              {
                                                                                                "type": "context",
                                                                                                "config": {
                                                                                                  "requestMethod": "add",
                                                                                                  "key": "getT&CReworkDetails",
                                                                                                  "data": "responseData"
                                                                                                },
                                                                                                "eventSource": "click"
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
                                                                                        "hookType": "afterInit",
                                                                                        "config": {
                                                                                          "microserviceId": "getTCReworkWishlistItems",
                                                                                          "requestMethod": "get",
                                                                                          "isLocal": false,
                                                                                          "LocalService": "assets/Responses/tcrework.json",
                                                                                          "params": {
                                                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                                                            "workCenterId": "#UnitInfo.WORKCENTER_ID"
                                                                                          }
                                                                                        },
                                                                                        "responseDependents": {
                                                                                          "onSuccess": {
                                                                                            "actions": [
                                                                                              {
                                                                                                "type": "context",
                                                                                                "config": {
                                                                                                  "requestMethod": "add",
                                                                                                  "key": "getT&COpenReworkDetails",
                                                                                                  "data": "responseData"
                                                                                                },
                                                                                                "eventSource": "click"
                                                                                              },
                                                                                              {
                                                                                                "type": "splitEcoAndFru",
                                                                                                "config": {
                                                                                                  "ecoKey": "getTnCEco",
                                                                                                  "fruKey": "getTnCFru",
                                                                                                  "dataArray": "#getT&COpenReworkDetails"
                                                                                                }
                                                                                              },
                                                                                              {
                                                                                                "type": "renderTemplate",
                                                                                                "config": {
                                                                                                  "templateId": "houston/houston-T&CRework.json",
                                                                                                  "mode": "local"
                                                                                                }
                                                                                              }
                                                                                            ]
                                                                                          },
                                                                                          "onFailure": {
                                                                                            "actions": [
                                                                                              {
                                                                                                "type": "renderTemplate",
                                                                                                "config": {
                                                                                                  "templateId": "houston/houston-T&CRework.json",
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
                                                                                        "type": "condition",
                                                                                        "config": {
                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                                          "rhs": "REP_SCRAP_CHK"
                                                                                        },
                                                                                        "responseDependents": {
                                                                                          "onSuccess": {
                                                                                            "actions": [
                                                                                              {
                                                                                                "type":"qrCodeApicallforAllCiscoTestScreen"
                                                                                              },
                                                                                              {
                                                                                                "type": "renderTemplate",
                                                                                                "config": {
                                                                                                  "templateId": "houston/houston-REP_SCRP_CHK.json",
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
                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                                                  "rhs": "WPCBASIC2"
                                                                                                },
                                                                                                "responseDependents": {
                                                                                                  "onSuccess": {
                                                                                                    "actions": [
                                                                                                      {
                                                                                                        "type":"qrCodeApicallforAllCiscoTestScreen"
                                                                                                      },
                                                                                                      {
                                                                                                        "type": "microservice",
                                                                                                        "hookType": "afterInit",
                                                                                                        "config": {
                                                                                                          "microserviceId": "getCiscoTestStations",
                                                                                                          "isLocal": false,
                                                                                                          "LocalService": "assets/Responses/mockTestTasks.json",
                                                                                                          "requestMethod": "get",
                                                                                                          "params": {
                                                                                                            "serialNo": "#UnitInfo.SERIAL_NO",
                                                                                                            "slStationName": "#UnitInfo.WORKCENTER",
                                                                                                            "locationId": "#UnitInfo.LOCATION_ID",
                                                                                                            "ownerId": "#UnitInfo.OWNER_ID"
                                                                                                          }
                                                                                                        },
                                                                                                        "responseDependents": {
                                                                                                          "onSuccess": {
                                                                                                            "actions": [
                                                                                                              {
                                                                                                                "type": "context",
                                                                                                                "config": {
                                                                                                                  "requestMethod": "add",
                                                                                                                  "key": "testTasksData",
                                                                                                                  "data": "responseData"
                                                                                                                }
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "renderTemplate",
                                                                                                                "config": {
                                                                                                                  "templateId": "houston/houston-WPCBASIC2.json",
                                                                                                                  "mode": "local"
                                                                                                                }
                                                                                                              }
                                                                                                            ]
                                                                                                          },
                                                                                                          "onFailure": {
                                                                                                            "actions": [
                                                                                                              {
                                                                                                                "type": "renderTemplate",
                                                                                                                "config": {
                                                                                                                  "templateId": "houston/houston-WPCBASIC2.json",
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
                                                                                                        "type": "condition",
                                                                                                        "config": {
                                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                                                          "rhs": "WPCBASIC3"
                                                                                                        },
                                                                                                        "responseDependents": {
                                                                                                          "onSuccess": {
                                                                                                            "actions": [
                                                                                                              {
                                                                                                                "type":"qrCodeApicallforAllCiscoTestScreen"
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "microservice",
                                                                                                                "hookType": "afterInit",
                                                                                                                "config": {
                                                                                                                  "microserviceId": "getCiscoTestStations",
                                                                                                                  "isLocal": false,
                                                                                                                  "LocalService": "assets/Responses/mockTestTasks.json",
                                                                                                                  "requestMethod": "get",
                                                                                                                  "params": {
                                                                                                                    "serialNo": "#UnitInfo.SERIAL_NO",
                                                                                                                    "slStationName": "#UnitInfo.WORKCENTER",
                                                                                                                    "locationId": "#UnitInfo.LOCATION_ID",
                                                                                                                    "ownerId": "#UnitInfo.OWNER_ID"
                                                                                                                  }
                                                                                                                },
                                                                                                                "responseDependents": {
                                                                                                                  "onSuccess": {
                                                                                                                    "actions": [
                                                                                                                      {
                                                                                                                        "type": "context",
                                                                                                                        "config": {
                                                                                                                          "requestMethod": "add",
                                                                                                                          "key": "testTasksData",
                                                                                                                          "data": "responseData"
                                                                                                                        }
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "renderTemplate",
                                                                                                                        "config": {
                                                                                                                          "templateId": "houston/houston-WPCBASIC3.json",
                                                                                                                          "mode": "local"
                                                                                                                        }
                                                                                                                      }
                                                                                                                    ]
                                                                                                                  },
                                                                                                                  "onFailure": {
                                                                                                                    "actions": [
                                                                                                                      {
                                                                                                                        "type": "renderTemplate",
                                                                                                                        "config": {
                                                                                                                          "templateId": "houston/houston-WPCBASIC3.json",
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
                                                                                                                "type": "condition",
                                                                                                                "config": {
                                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                                                                  "rhs": "HI-POT"
                                                                                                                },
                                                                                                                "responseDependents": {
                                                                                                                  "onSuccess": {
                                                                                                                    "actions": [
                                                                                                                      {
                                                                                                                        "type":"qrCodeApicallforAllCiscoTestScreen"
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "microservice",
                                                                                                                        "hookType": "afterInit",
                                                                                                                        "config": {
                                                                                                                          "microserviceId": "getCiscoTestStations",
                                                                                                                          "isLocal": false,
                                                                                                                          "LocalService": "assets/Responses/mockTestTasks.json",
                                                                                                                          "requestMethod": "get",
                                                                                                                          "params": {
                                                                                                                            "serialNo": "#UnitInfo.SERIAL_NO",
                                                                                                                            "slStationName": "#UnitInfo.WORKCENTER",
                                                                                                                            "locationId": "#UnitInfo.LOCATION_ID",
                                                                                                                            "ownerId": "#UnitInfo.OWNER_ID"
                                                                                                                          }
                                                                                                                        },
                                                                                                                        "responseDependents": {
                                                                                                                          "onSuccess": {
                                                                                                                            "actions": [
                                                                                                                              {
                                                                                                                                "type": "context",
                                                                                                                                "config": {
                                                                                                                                  "requestMethod": "add",
                                                                                                                                  "key": "testTasksData",
                                                                                                                                  "data": "responseData"
                                                                                                                                }
                                                                                                                              },
                                                                                                                              {
                                                                                                                                "type": "renderTemplate",
                                                                                                                                "config": {
                                                                                                                                  "templateId": "houston/houston-Hi_POT.json",
                                                                                                                                  "mode": "local"
                                                                                                                                }
                                                                                                                              }
                                                                                                                            ]
                                                                                                                          },
                                                                                                                          "onFailure": {
                                                                                                                            "actions": [
                                                                                                                              {
                                                                                                                                "type": "renderTemplate",
                                                                                                                                "config": {
                                                                                                                                  "templateId": "houston/houston-Hi_POT.json",
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
                                                                                                                        "type": "condition",
                                                                                                                        "config": {
                                                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                                                                          "rhs": "FA-HOLD"
                                                                                                                        },
                                                                                                                        "responseDependents": {
                                                                                                                          "onSuccess": {
                                                                                                                            "actions": [
                                                                                                                              {
                                                                                                                                "type":"qrCodeApicallforAllCiscoTestScreen"
                                                                                                                              },
                                                                                                                              {
                                                                                                                                "type": "microservice",
                                                                                                                                "hookType": "afterInit",
                                                                                                                                "config": {
                                                                                                                                  "microserviceId": "getCiscoTestStations",
                                                                                                                                  "isLocal": false,
                                                                                                                                  "LocalService": "assets/Responses/mockTestTasks.json",
                                                                                                                                  "requestMethod": "get",
                                                                                                                                  "params": {
                                                                                                                                    "serialNo": "#UnitInfo.SERIAL_NO",
                                                                                                                                    "slStationName": "#UnitInfo.WORKCENTER",
                                                                                                                                    "locationId": "#UnitInfo.LOCATION_ID",
                                                                                                                                    "ownerId": "#UnitInfo.OWNER_ID"
                                                                                                                                  }
                                                                                                                                },
                                                                                                                                "responseDependents": {
                                                                                                                                  "onSuccess": {
                                                                                                                                    "actions": [
                                                                                                                                      {
                                                                                                                                        "type": "context",
                                                                                                                                        "config": {
                                                                                                                                          "requestMethod": "add",
                                                                                                                                          "key": "testTasksData",
                                                                                                                                          "data": "responseData"
                                                                                                                                        }
                                                                                                                                      },
                                                                                                                                      {
                                                                                                                                        "type": "renderTemplate",
                                                                                                                                        "config": {
                                                                                                                                          "templateId": "houston/houston-FA_HOLD.json",
                                                                                                                                          "mode": "local"
                                                                                                                                        }
                                                                                                                                      }
                                                                                                                                    ]
                                                                                                                                  },
                                                                                                                                  "onFailure": {
                                                                                                                                    "actions": [
                                                                                                                                      {
                                                                                                                                        "type": "renderTemplate",
                                                                                                                                        "config": {
                                                                                                                                          "templateId": "houston/houston-FA_HOLD.json",
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
                                                                                                                                "type": "condition",
                                                                                                                                "config": {
                                                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                                                                                  "rhs": "RMA_TEST"
                                                                                                                                },
                                                                                                                                "responseDependents": {
                                                                                                                                  "onSuccess": {
                                                                                                                                    "actions": [
                                                                                                                                      {
                                                                                                                                        "type":"qrCodeApicallforAllCiscoTestScreen"
                                                                                                                                      },
                                                                                                                                      {
                                                                                                                                        "type": "renderTemplate",
                                                                                                                                        "config": {
                                                                                                                                          "templateId": "houston/hou_RMAStartup.json",
                                                                                                                                          "mode": "local"
                                                                                                                                        }
                                                                                                                                      } 
                                                                                                                                    ]
                                                                                                                                  }
                                                                                                                                },
                                                                                                                                "onFailure":{
                                                                                                                                  "actions":[]
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
                                  "key": "subProcessMenuType",
                                  "data": "IQA-Pre-screen"
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
                                  "key": "subMenuFailed",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "searchCriteriaErrorTitleUUID",
                                  "properties": {
                                    "titleValue": "#subMenuFailed",
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
      }];
    replaceTask && replaceTask.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }
}
