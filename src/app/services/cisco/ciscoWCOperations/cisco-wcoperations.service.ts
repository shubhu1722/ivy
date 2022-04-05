import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class CiscoWcoperationsService {

  constructor(private contextService: ContextService) { }

  handleCiscoTimeInActions(actionData, instance, actionService, responseData?: any) {
    const action = cloneDeep(actionData);
    this.firsttimeInMicroServices(action, instance, actionService);
  }

  firsttimeInMicroServices(action, instance, actionService) {
    this.contextService.deleteDataByKey("isTimeOutFromCiscoWC");
    let timeInCiscoMicroServices =  {
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
                                                      "type": "commonCiscoWCOperations",
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
                                              "type": "commonCiscoWCOperations",
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
                                                      "type": "commonCiscoWCOperations",
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
                                          "templateId": "cisco-iqaPreScreen.json",
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
                                                                  "templateId": "cisco_ECO_booking.json",
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
                                                                  "data": "responseData"
                                                                }
                                                              },
                                                              {
                                                                "type": "renderTemplate",
                                                                "config": {
                                                                  "templateId": "cisco_ECO_booking.json",
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
                                                          "templateId": "cisco-Hu2-Stop.json",
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
                                                          "rhs": "TC STOP"
                                                        },
                                                        "responseDependents": {
                                                          "onSuccess": {
                                                            "actions": [
                                                              {
                                                                "type": "renderTemplate",
                                                                "config": {
                                                                  "templateId": "cisco-T&CStop.json",
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
                                                                  "rhs": "BGA_STOP"
                                                                },
                                                                "responseDependents": {
                                                                  "onSuccess": {
                                                                    "actions": [
                                                                      {
                                                                        "type": "renderTemplate",
                                                                        "config": {
                                                                          "templateId": "cisco-BGAStop.json",
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
                                                                          "rhs": "BGA_REP_STOP"
                                                                        },
                                                                        "responseDependents": {
                                                                          "onSuccess": {
                                                                            "actions": [
                                                                              {
                                                                                "type": "renderTemplate",
                                                                                "config": {
                                                                                  "templateId": "cisco-Hu2-BGARepStop.json",
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
                                                                                  "rhs": "REP_STOP"
                                                                                },
                                                                                "responseDependents": {
                                                                                  "onSuccess": {
                                                                                    "actions": [
                                                                                      {
                                                                                        "type": "renderTemplate",
                                                                                        "config": {
                                                                                          "templateId": "cisco-RepStop.json",
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
                                                                                                          "templateId": "cisco-Hi-POT.json",
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
                                                                                                          "templateId": "cisco-Hi-POT.json",
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
                                                                                                  "rhs": "2CORNER"
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
                                                                                                                  "templateId": "cisco-2Corner.json",
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
                                                                                                                  "templateId": "cisco-2Corner.json",
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
                                                                                                          "rhs": "PRE_TEST"
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
                                                                                                                          "templateId": "cisco-PreTest.json",
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
                                                                                                                          "templateId": "cisco-PreTest.json",
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
                                                                                                                  "rhs": "FINAL TEST"
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
                                                                                                                                  "templateId": "cisco-FinalTest.json",
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
                                                                                                                                  "templateId": "cisco-FinalTest.json",
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
                                                                                                                          "rhs": "FPCBBI"
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
                                                                                                                                          "templateId": "cisco-FPCBBI.json",
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
                                                                                                                                          "templateId": "cisco-FPCBBI.json",
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
                                                                                                                                  "rhs": "BFA"
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
                                                                                                                                                  "templateId": "cisco-BFA.json",
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
                                                                                                                                                  "templateId": "cisco-BFA.json",
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
                                                                                                                                          "rhs": "PARAMETRIC"
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
                                                                                                                                                          "templateId": "cisco-PARAMETRIC.json",
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
                                                                                                                                                          "templateId": "cisco-PARAMETRIC.json",
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
                                                                                                                                                  "rhs": "PCBST"
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
                                                                                                                                                                  "templateId": "cisco-PCBST.json",
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
                                                                                                                                                                  "templateId": "cisco-PCBST.json",
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
                                                                                                                                                        "type": "reduceCiscoWCOperations",
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
  reduceCiscoCode(action, instance, actionService) {
    this.contextService.deleteDataByKey("isTimeOutFromCiscoWC");
    let reduce = [
      {
        "type": "condition",
        "config": {
          "operation": "isEqualToIgnoreCase",
          "lhs": "#UnitInfo.WORKCENTER",
          "rhs": "4CORNER"
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
                          "templateId": "cisco-4Corner.json",
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
                          "templateId": "cisco-4Corner.json",
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
                  "rhs": "LED_TEST"
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
                                  "templateId": "cisco-LED_TEST.json",
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
                                  "templateId": "cisco-LED_TEST.json",
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
                          "rhs": "DHASS"
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
                                          "templateId": "cisco-DHASS.json",
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
                                          "templateId": "cisco-DHASS.json",
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
                                  "rhs": "QUACK"
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
                                                  "templateId": "cisco-QUACK.json",
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
                                                  "templateId": "cisco-QUACK.json",
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
                                          "rhs": "FPCBINT"
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
                                                          "templateId": "cisco-FPCBINT.json",
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
                                                          "templateId": "cisco-FPCBINT.json",
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
                                                  "rhs": "FPCBPB"
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
                                                                  "templateId": "cisco-FPCBPB.json",
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
                                                                  "templateId": "cisco-FPCBPB.json",
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
                                                          "rhs": "FPCBDL"
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
                                                                          "templateId": "cisco-FPCBDL.json",
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
                                                                          "templateId": "cisco-FPCBDL.json",
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
                                                                  "rhs": "FPCBFT"
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
                                                                                  "templateId": "cisco-FPCBFT.json",
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
                                                                                  "templateId": "cisco-FPCBFT.json",
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
                                                                          "rhs": "FSYSDL"
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
                                                                                          "templateId": "cisco-FSYSDL.json",
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
                                                                                          "templateId": "cisco-FSYSDL.json",
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
                                                                                  "rhs": "FASSY"
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
                                                                                                  "templateId": "cisco-FASSY.json",
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
                                                                                                  "templateId": "cisco-FASSY.json",
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
                                                                                          "rhs": "FPCBDG"
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
                                                                                                          "templateId": "cisco-FPCBDG.json",
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
                                                                                                          "templateId": "cisco-FPCBDG.json",
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
                                                                                                  "rhs": "FSYSINT"
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
                                                                                                                  "templateId": "cisco-FSYSINT.json",
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
                                                                                                                  "templateId": "cisco-FSYSINT.json",
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
                                                                                                          "rhs": "FCHASS"
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
                                                                                                                          "templateId": "cisco-FCHASS.json",
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
                                                                                                                          "templateId": "cisco-FCHASS.json",
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
                                                                                                                  "rhs": "FDBGHTHV"
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
                                                                                                                                  "templateId": "cisco-FDBGHTHV.json",
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
                                                                                                                                  "templateId": "cisco-FDBGHTHV.json",
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
                                                                                                                          "rhs": "FPCBPEP"
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
                                                                                                                                          "templateId": "cisco-FPCBPEP.json",
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
                                                                                                                                          "templateId": "cisco-FPCBPEP.json",
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
                                                                                                                                  "rhs": "FPCBASIC1"
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
                                                                                                                                                  "templateId": "cisco-FPCBASIC1.json",
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
                                                                                                                                                  "templateId": "cisco-FPCBASIC1.json",
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
                                                                                                                                          "rhs": "FPTXCAL"
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
                                                                                                                                                          "templateId": "cisco-FPTXCAL.json",
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
                                                                                                                                                          "templateId": "cisco-FPTXCAL.json",
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
                                                                                                                                                  "rhs": "FSTXCAL"
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
                                                                                                                                                                  "templateId": "cisco-FSTXCAL.json",
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
                                                                                                                                                                  "templateId": "cisco-FSTXCAL.json",
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
                                                                                                                                                          "rhs": "FPCBABT"
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
                                                                                                                                                                          "templateId": "cisco-FPCBABT.json",
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
                                                                                                                                                                          "templateId": "cisco-FPCBABT.json",
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
                                                                                                                                                                  "rhs": "BURN-IN"
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
                                                                                                                                                                                  "templateId": "cisco-Burn-In.json",
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
                                                                                                                                                                                  "templateId": "cisco-Burn-In.json",
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
                                                                                                                                                                          "rhs": "SYSFA"
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
                                                                                                                                                                                          "templateId": "cisco-SYSFA.json",
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
                                                                                                                                                                                          "templateId": "cisco-SYSFA.json",
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
                                                                                                                                                                                  "rhs": "FQA"
                                                                                                                                                                                },
                                                                                                                                                                                "responseDependents": {
                                                                                                                                                                                  "onSuccess": {
                                                                                                                                                                                    "actions": [
                                                                                                                                                                                      {
                                                                                                                                                                                        "type": "renderTemplate",
                                                                                                                                                                                        "config": {
                                                                                                                                                                                          "templateId": "cisco_FQA.json",
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
                                                                                                                                                                                                          "templateId": "cisco-Packout.json",
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
                                                                                                                                                                                                          "templateId": "cisco-Packout.json",
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
                                                                                                                                                                                                "type": "secondReduceCiscoWCOperations",
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
    ];
    reduce && reduce.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }
  secondReduceCiscoCode(action, instance, actionService) {
    this.contextService.deleteDataByKey("isTimeOutFromCiscoWC");
    let reduce = [
      {
        "type": "condition",
        "config": {
          "operation": "isEqualTo",
          "lhs": "#UnitInfo.WORKCENTER",
          "rhs": "CISCO_REWORK"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "getReworkTaskDetails",
                  "requestMethod": "get",
                  "isLocal": false,
                  "LocalService": "assets/Responses/getHPFAHistory.json",
                  "params": {
                    "itemId": "#UnitInfo.ITEM_ID",
                    "locationId": "#userSelectedLocation",
                    "clientId": "#userSelectedClient",
                    "contractId": "#userSelectedContract",
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
                          "key": "getReworkDetails",
                          "data": "responseData"
                        },
                        "eventSource": "click"
                      },
                      {
                        "type": "renderTemplate",
                        "config": {
                          "templateId": "cisco-Rework.json",
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
                          "key": "errorCiscoReworkResp",
                          "data": "responseData"
                        },
                        "eventSource": "click"
                      },
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "#errorCiscoReworkResp",
                            "isShown": true
                          },
                          "eventSource": "click"
                        }
                      },
                      {
                        "type": "renderTemplate",
                        "config": {
                          "templateId": "cisco-Rework.json",
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
                  "rhs": "BGA_REWORK"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "microservice",
                        "hookType": "afterInit",
                        "config": {
                          "microserviceId": "getBGAReworkTaskDetails",
                          "requestMethod": "get",
                          "isLocal": false,
                          "LocalService": "assets/Responses/getHPFAHistory.json",
                          "params": {
                            "itemId": "#UnitInfo.ITEM_ID",
                            "locationId": "#userSelectedLocation",
                            "clientId": "#userSelectedClient",
                            "contractId": "#userSelectedContract",
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
                                  "key": "getBGAReworkDetails",
                                  "data": "responseData"
                                },
                                "eventSource": "click"
                              },                     
                              {
                                "type": "renderTemplate",
                                "config": {
                                  "templateId": "cisco-BGARework.json",
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
                                  "key": "errorBGAReworkResp",
                                  "data": "responseData"
                                },
                                "eventSource": "click"
                              },
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "errorTitleUUID",
                                  "properties": {
                                    "titleValue": "#errorBGAReworkResp",
                                    "isShown": true
                                  },
                                  "eventSource": "click"
                                }
                              },
                              {
                                "type": "renderTemplate",
                                "config": {
                                  "templateId": "cisco-BGARework.json",
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
                          "rhs": "CISCO_DEBUG"
                        },
                        "eventSource": "click",
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "renderTemplate",
                                "config": {
                                  "templateId": "cisco_debug.json",
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
                                  "rhs": "TOUCHandCLEAN"
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "renderTemplate",
                                        "config": {
                                          "templateId": "cisco_T&C_Prep.json",
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
                                                          "ecoKey":"getTnCEco",
                                                          "fruKey":"getTnCFru",                                          
                                                          "dataArray": "#getT&COpenReworkDetails"
                                                        }                                        
                                                      },
                                                      {
                                                        "type": "renderTemplate",
                                                        "config": {
                                                          "templateId": "cisco-T&CRework.json",
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
                                                          "templateId": "cisco-T&CRework.json",
                                                          "mode": "local"
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
                                                "type": "condition",
                                                "hookType": "afterInit",
                                                "config": {
                                                  "operation": "isEqualToIgnoreCase",
                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                  "rhs": "FSYSPB"
                                                },
                                                "eventSource": "click",
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
                                                                  "templateId": "cisco-FSYSPB.json",
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
                                                                  "templateId": "cisco-FSYSPB.json",
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
                                                        "hookType": "afterInit",
                                                        "config": {
                                                          "operation": "isEqualToIgnoreCase",
                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                          "rhs": "FPCBPM3"
                                                        },
                                                        "eventSource": "click",
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
                                                                          "templateId": "cisco-FPCBPM3.json",
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
                                                                          "templateId": "cisco-FPCBPM3.json",
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
                                                                "hookType": "afterInit",
                                                                "config": {
                                                                  "operation": "isEqualToIgnoreCase",
                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                  "rhs": "FPCBPM4"
                                                                },
                                                                "eventSource": "click",
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
                                                                                  "templateId": "cisco-FPCBPM4.json",
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
                                                                                  "templateId": "cisco-FPCBPM4.json",
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
                                                                        "hookType": "afterInit",
                                                                        "config": {
                                                                          "operation": "isEqualToIgnoreCase",
                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                          "rhs": "FSYSVF"
                                                                        },
                                                                        "eventSource": "click",
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
                                                                                          "templateId": "cisco-FSYSVF.json",
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
                                                                                          "templateId": "cisco-FSYSVF.json",
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
                                                                                "hookType": "afterInit",
                                                                                "config": {
                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                                  "rhs": "FPMST"
                                                                                },
                                                                                "eventSource": "click",
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
                                                                                                  "templateId": "cisco-FPMST.json",
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
                                                                                                  "templateId": "cisco-FPMST.json",
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
                                                                                        "hookType": "afterInit",
                                                                                        "config": {
                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                                          "rhs": "CISCO_DEBUG_REWORK"
                                                                                        },
                                                                                        "eventSource": "click",
                                                                                        "responseDependents": {
                                                                                          "onSuccess": {
                                                                                            "actions": [
                                                                                              {
                                                                                                "type": "condition",
                                                                                                "hookType": "afterInit",
                                                                                                "config": {
                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                  "lhs": "#UnitInfo.GEONAME",
                                                                                                  "rhs": "Szombathely"
                                                                                                },
                                                                                                "eventSource": "click",
                                                                                                "responseDependents": {
                                                                                                  "onSuccess": {
                                                                                                    "actions": [
                                                                                                      {
                                                                                                        "type": "microservice",
                                                                                                        "hookType": "afterInit",
                                                                                                        "config": {
                                                                                                          "microserviceId": "getReworkTaskDetails",
                                                                                                          "requestMethod": "get",
                                                                                                          "isLocal": false,
                                                                                                          "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                          "params": {
                                                                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                                                                            "locationId": "#userSelectedLocation",
                                                                                                            "clientId": "#userSelectedClient",
                                                                                                            "contractId": "#userSelectedContract",
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
                                                                                                                  "key": "getDebugReworkDetails",
                                                                                                                  "data": "responseData"
                                                                                                                },
                                                                                                                "eventSource": "click"
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "renderTemplate",
                                                                                                                "config": {
                                                                                                                  "templateId": "cisco-szo/szo-Cisco_Debug_Rework.json",
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
                                                                                                                  "key": "errorCiscoReworkResp",
                                                                                                                  "data": "responseData"
                                                                                                                },
                                                                                                                "eventSource": "click"
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "updateComponent",
                                                                                                                "config": {
                                                                                                                  "key": "errorTitleUUID",
                                                                                                                  "properties": {
                                                                                                                    "titleValue": "#errorCiscoReworkResp",
                                                                                                                    "isShown": true
                                                                                                                  },
                                                                                                                  "eventSource": "click"
                                                                                                                }
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "renderTemplate",
                                                                                                                "config": {
                                                                                                                  "templateId": "cisco-szo/szo-Cisco_Debug_Rework.json",
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
                                                                                                        "type": "microservice",
                                                                                                        "hookType": "afterInit",
                                                                                                        "config": {
                                                                                                          "microserviceId": "getReworkTaskDetails",
                                                                                                          "requestMethod": "get",
                                                                                                          "isLocal": false,
                                                                                                          "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                          "params": {
                                                                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                                                                            "locationId": "#userSelectedLocation",
                                                                                                            "clientId": "#userSelectedClient",
                                                                                                            "contractId": "#userSelectedContract",
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
                                                                                                                  "key": "getDebugReworkDetails",
                                                                                                                  "data": "responseData"
                                                                                                                },
                                                                                                                "eventSource": "click"
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "renderTemplate",
                                                                                                                "config": {
                                                                                                                  "templateId": "cisco-lou/lou-Cisco_Debug_Rework.json",
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
                                                                                                                  "key": "errorCiscoReworkResp",
                                                                                                                  "data": "responseData"
                                                                                                                },
                                                                                                                "eventSource": "click"
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "updateComponent",
                                                                                                                "config": {
                                                                                                                  "key": "errorTitleUUID",
                                                                                                                  "properties": {
                                                                                                                    "titleValue": "#errorCiscoReworkResp",
                                                                                                                    "isShown": true
                                                                                                                  },
                                                                                                                  "eventSource": "click"
                                                                                                                }
                                                                                                              },
                                                                                                              {
                                                                                                                "type": "renderTemplate",
                                                                                                                "config": {
                                                                                                                  "templateId": "cisco-szo/szo-Cisco_Debug_Rework.json",
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
                                                                                                "type": "condition",
                                                                                                "hookType": "afterInit",
                                                                                                "config": {
                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                                                  "rhs": "CISCO_MINIWAVE"
                                                                                                },
                                                                                                "eventSource": "click",
                                                                                                "responseDependents": {
                                                                                                  "onSuccess": {
                                                                                                    "actions": [
                                                                                                      {
                                                                                                        "type": "condition",
                                                                                                        "hookType": "afterInit",
                                                                                                        "config": {
                                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                                          "lhs": "#UnitInfo.GEONAME",
                                                                                                          "rhs": "Szombathely"
                                                                                                        },
                                                                                                        "eventSource": "click",
                                                                                                        "responseDependents": {
                                                                                                          "onSuccess": {
                                                                                                            "actions": [
                                                                                                              {
                                                                                                                "type": "microservice",
                                                                                                                "hookType": "afterInit",
                                                                                                                "config": {
                                                                                                                  "microserviceId": "getReworkTaskDetails",
                                                                                                                  "requestMethod": "get",
                                                                                                                  "isLocal": false,
                                                                                                                  "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                                  "params": {
                                                                                                                    "itemId": "#UnitInfo.ITEM_ID",
                                                                                                                    "locationId": "#userSelectedLocation",
                                                                                                                    "clientId": "#userSelectedClient",
                                                                                                                    "contractId": "#userSelectedContract",
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
                                                                                                                          "key": "getMiniwaveDetails",
                                                                                                                          "data": "responseData"
                                                                                                                        },
                                                                                                                        "eventSource": "click"
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "renderTemplate",
                                                                                                                        "config": {
                                                                                                                          "templateId": "cisco-szo/szo-Cisco_Miniwave.json",
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
                                                                                                                          "key": "errorCiscoReworkResp",
                                                                                                                          "data": "responseData"
                                                                                                                        },
                                                                                                                        "eventSource": "click"
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "updateComponent",
                                                                                                                        "config": {
                                                                                                                          "key": "errorTitleUUID",
                                                                                                                          "properties": {
                                                                                                                            "titleValue": "#errorCiscoReworkResp",
                                                                                                                            "isShown": true
                                                                                                                          },
                                                                                                                          "eventSource": "click"
                                                                                                                        }
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "renderTemplate",
                                                                                                                        "config": {
                                                                                                                          "templateId": "cisco-szo/szo-Cisco_Miniwave.json",
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
                                                                                                                "type": "microservice",
                                                                                                                "hookType": "afterInit",
                                                                                                                "config": {
                                                                                                                  "microserviceId": "getReworkTaskDetails",
                                                                                                                  "requestMethod": "get",
                                                                                                                  "isLocal": false,
                                                                                                                  "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                                  "params": {
                                                                                                                    "itemId": "#UnitInfo.ITEM_ID",
                                                                                                                    "locationId": "#userSelectedLocation",
                                                                                                                    "clientId": "#userSelectedClient",
                                                                                                                    "contractId": "#userSelectedContract",
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
                                                                                                                          "key": "getMiniwaveDetails",
                                                                                                                          "data": "responseData"
                                                                                                                        },
                                                                                                                        "eventSource": "click"
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "renderTemplate",
                                                                                                                        "config": {
                                                                                                                          "templateId": "cisco-lou/lou-Cisco_Miniwave.json",
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
                                                                                                                          "key": "errorCiscoReworkResp",
                                                                                                                          "data": "responseData"
                                                                                                                        },
                                                                                                                        "eventSource": "click"
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "updateComponent",
                                                                                                                        "config": {
                                                                                                                          "key": "errorTitleUUID",
                                                                                                                          "properties": {
                                                                                                                            "titleValue": "#errorCiscoReworkResp",
                                                                                                                            "isShown": true
                                                                                                                          },
                                                                                                                          "eventSource": "click"
                                                                                                                        }
                                                                                                                      },
                                                                                                                      {
                                                                                                                        "type": "renderTemplate",
                                                                                                                        "config": {
                                                                                                                          "templateId": "cisco-szo/szo-Cisco_Miniwave.json",
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
                                                                                                        "type": "condition",
                                                                                                        "hookType": "afterInit",
                                                                                                        "config": {
                                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                                                          "rhs": "CISCO_X-RAY"
                                                                                                        },
                                                                                                        "eventSource": "click",
                                                                                                        "responseDependents": {
                                                                                                          "onSuccess": {
                                                                                                            "actions": [
                                                                                                              {
                                                                                                                "type": "condition",
                                                                                                                "hookType": "afterInit",
                                                                                                                "config": {
                                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                                  "lhs": "#UnitInfo.GEONAME",
                                                                                                                  "rhs": "Szombathely"
                                                                                                                },
                                                                                                                "eventSource": "click",
                                                                                                                "responseDependents": {
                                                                                                                  "onSuccess": {
                                                                                                                    "actions": [
                                                                                                                      {
                                                                                                                        "type": "microservice",
                                                                                                                        "hookType": "afterInit",
                                                                                                                        "config": {
                                                                                                                          "microserviceId": "getReworkTaskDetails",
                                                                                                                          "requestMethod": "get",
                                                                                                                          "isLocal": false,
                                                                                                                          "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                                          "params": {
                                                                                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                                                                                            "locationId": "#userSelectedLocation",
                                                                                                                            "clientId": "#userSelectedClient",
                                                                                                                            "contractId": "#userSelectedContract",
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
                                                                                                                                  "key": "getXRayDetails",
                                                                                                                                  "data": "responseData"
                                                                                                                                },
                                                                                                                                "eventSource": "click"
                                                                                                                              },
                                                                                                                              {
                                                                                                                                "type": "renderTemplate",
                                                                                                                                "config": {
                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_X-Ray.json",
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
                                                                                                                                  "key": "errorCiscoReworkResp",
                                                                                                                                  "data": "responseData"
                                                                                                                                },
                                                                                                                                "eventSource": "click"
                                                                                                                              },
                                                                                                                              {
                                                                                                                                "type": "updateComponent",
                                                                                                                                "config": {
                                                                                                                                  "key": "errorTitleUUID",
                                                                                                                                  "properties": {
                                                                                                                                    "titleValue": "#errorCiscoReworkResp",
                                                                                                                                    "isShown": true
                                                                                                                                  },
                                                                                                                                  "eventSource": "click"
                                                                                                                                }
                                                                                                                              },
                                                                                                                              {
                                                                                                                                "type": "renderTemplate",
                                                                                                                                "config": {
                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_X-Ray.json",
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
                                                                                                                        "type": "microservice",
                                                                                                                        "hookType": "afterInit",
                                                                                                                        "config": {
                                                                                                                          "microserviceId": "getReworkTaskDetails",
                                                                                                                          "requestMethod": "get",
                                                                                                                          "isLocal": false,
                                                                                                                          "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                                          "params": {
                                                                                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                                                                                            "locationId": "#userSelectedLocation",
                                                                                                                            "clientId": "#userSelectedClient",
                                                                                                                            "contractId": "#userSelectedContract",
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
                                                                                                                                  "key": "getXRayDetails",
                                                                                                                                  "data": "responseData"
                                                                                                                                },
                                                                                                                                "eventSource": "click"
                                                                                                                              },
                                                                                                                              {
                                                                                                                                "type": "renderTemplate",
                                                                                                                                "config": {
                                                                                                                                  "templateId": "cisco-lou/lou-Cisco_X-Ray.json",
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
                                                                                                                                  "key": "errorCiscoReworkResp",
                                                                                                                                  "data": "responseData"
                                                                                                                                },
                                                                                                                                "eventSource": "click"
                                                                                                                              },
                                                                                                                              {
                                                                                                                                "type": "updateComponent",
                                                                                                                                "config": {
                                                                                                                                  "key": "errorTitleUUID",
                                                                                                                                  "properties": {
                                                                                                                                    "titleValue": "#errorCiscoReworkResp",
                                                                                                                                    "isShown": true
                                                                                                                                  },
                                                                                                                                  "eventSource": "click"
                                                                                                                                }
                                                                                                                              },
                                                                                                                              {
                                                                                                                                "type": "renderTemplate",
                                                                                                                                "config": {
                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_X-Ray.json",
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
                                                                                                                "type": "condition",
                                                                                                                "hookType": "afterInit",
                                                                                                                "config": {
                                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                                                                  "rhs": "CORE_DEBUG"
                                                                                                                },
                                                                                                                "eventSource": "click",
                                                                                                                "responseDependents": {
                                                                                                                  "onSuccess": {
                                                                                                                    "actions": [
                                                                                                                      {
                                                                                                                        "type": "condition",
                                                                                                                        "hookType": "afterInit",
                                                                                                                        "config": {
                                                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                                                          "lhs": "#UnitInfo.GEONAME",
                                                                                                                          "rhs": "Szombathely"
                                                                                                                        },
                                                                                                                        "eventSource": "click",
                                                                                                                        "responseDependents": {
                                                                                                                          "onSuccess": {
                                                                                                                            "actions": [
                                                                                                                              {
                                                                                                                                "type": "microservice",
                                                                                                                                "hookType": "afterInit",
                                                                                                                                "config": {
                                                                                                                                  "microserviceId": "getReworkTaskDetails",
                                                                                                                                  "requestMethod": "get",
                                                                                                                                  "isLocal": false,
                                                                                                                                  "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                                                  "params": {
                                                                                                                                    "itemId": "#UnitInfo.ITEM_ID",
                                                                                                                                    "locationId": "#userSelectedLocation",
                                                                                                                                    "clientId": "#userSelectedClient",
                                                                                                                                    "contractId": "#userSelectedContract",
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
                                                                                                                                          "key": "getReworkDetails",
                                                                                                                                          "data": "responseData"
                                                                                                                                        },
                                                                                                                                        "eventSource": "click"
                                                                                                                                      },
                                                                                                                                      {
                                                                                                                                        "type": "renderTemplate",
                                                                                                                                        "config": {
                                                                                                                                          "templateId": "cisco-szo/szo-Cisco_Core_Debug.json",
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
                                                                                                                                          "key": "errorCiscoReworkResp",
                                                                                                                                          "data": "responseData"
                                                                                                                                        },
                                                                                                                                        "eventSource": "click"
                                                                                                                                      },
                                                                                                                                      {
                                                                                                                                        "type": "updateComponent",
                                                                                                                                        "config": {
                                                                                                                                          "key": "errorTitleUUID",
                                                                                                                                          "properties": {
                                                                                                                                            "titleValue": "#errorCiscoReworkResp",
                                                                                                                                            "isShown": true
                                                                                                                                          },
                                                                                                                                          "eventSource": "click"
                                                                                                                                        }
                                                                                                                                      },
                                                                                                                                      {
                                                                                                                                        "type": "renderTemplate",
                                                                                                                                        "config": {
                                                                                                                                          "templateId": "cisco-szo/szo-Cisco_Core_Debug.json",
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
                                                                                                                                "type": "microservice",
                                                                                                                                "hookType": "afterInit",
                                                                                                                                "config": {
                                                                                                                                  "microserviceId": "getReworkTaskDetails",
                                                                                                                                  "requestMethod": "get",
                                                                                                                                  "isLocal": false,
                                                                                                                                  "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                                                  "params": {
                                                                                                                                    "itemId": "#UnitInfo.ITEM_ID",
                                                                                                                                    "locationId": "#userSelectedLocation",
                                                                                                                                    "clientId": "#userSelectedClient",
                                                                                                                                    "contractId": "#userSelectedContract",
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
                                                                                                                                          "key": "getReworkDetails",
                                                                                                                                          "data": "responseData"
                                                                                                                                        },
                                                                                                                                        "eventSource": "click"
                                                                                                                                      },
                                                                                                                                      {
                                                                                                                                        "type": "renderTemplate",
                                                                                                                                        "config": {
                                                                                                                                          "templateId": "cisco-lou/lou-Cisco_Core_Debug.json",
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
                                                                                                                                          "key": "errorCiscoReworkResp",
                                                                                                                                          "data": "responseData"
                                                                                                                                        },
                                                                                                                                        "eventSource": "click"
                                                                                                                                      },
                                                                                                                                      {
                                                                                                                                        "type": "updateComponent",
                                                                                                                                        "config": {
                                                                                                                                          "key": "errorTitleUUID",
                                                                                                                                          "properties": {
                                                                                                                                            "titleValue": "#errorCiscoReworkResp",
                                                                                                                                            "isShown": true
                                                                                                                                          },
                                                                                                                                          "eventSource": "click"
                                                                                                                                        }
                                                                                                                                      },
                                                                                                                                      {
                                                                                                                                        "type": "renderTemplate",
                                                                                                                                        "config": {
                                                                                                                                          "templateId": "cisco-szo/szo-Cisco_Core_Debug.json",
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
                                                                                                                        "type": "condition",
                                                                                                                        "hookType": "afterInit",
                                                                                                                        "config": {
                                                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                                                                          "rhs": "REWORK_CHECK"
                                                                                                                        },
                                                                                                                        "eventSource": "click",
                                                                                                                        "responseDependents": {
                                                                                                                          "onSuccess": {
                                                                                                                            "actions": [
                                                                                                                              {
                                                                                                                                "type": "condition",
                                                                                                                                "hookType": "afterInit",
                                                                                                                                "config": {
                                                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                                                  "lhs": "#UnitInfo.GEONAME",
                                                                                                                                  "rhs": "Szombathely"
                                                                                                                                },
                                                                                                                                "eventSource": "click",
                                                                                                                                "responseDependents": {
                                                                                                                                  "onSuccess": {
                                                                                                                                    "actions": [
                                                                                                                                      {
                                                                                                                                        "type": "microservice",
                                                                                                                                        "hookType": "afterInit",
                                                                                                                                        "config": {
                                                                                                                                          "microserviceId": "getReworkTaskDetails",
                                                                                                                                          "requestMethod": "get",
                                                                                                                                          "isLocal": false,
                                                                                                                                          "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                                                          "params": {
                                                                                                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                                                                                                            "locationId": "#userSelectedLocation",
                                                                                                                                            "clientId": "#userSelectedClient",
                                                                                                                                            "contractId": "#userSelectedContract",
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
                                                                                                                                                  "key": "getReworkDetails",
                                                                                                                                                  "data": "responseData"
                                                                                                                                                },
                                                                                                                                                "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "renderTemplate",
                                                                                                                                                "config": {
                                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_Rework_Check.json",
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
                                                                                                                                                  "key": "errorCiscoReworkResp",
                                                                                                                                                  "data": "responseData"
                                                                                                                                                },
                                                                                                                                                "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "updateComponent",
                                                                                                                                                "config": {
                                                                                                                                                  "key": "errorTitleUUID",
                                                                                                                                                  "properties": {
                                                                                                                                                    "titleValue": "#errorCiscoReworkResp",
                                                                                                                                                    "isShown": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                                }
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "renderTemplate",
                                                                                                                                                "config": {
                                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_Rework_Check.json",
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
                                                                                                                                        "type": "microservice",
                                                                                                                                        "hookType": "afterInit",
                                                                                                                                        "config": {
                                                                                                                                          "microserviceId": "getReworkTaskDetails",
                                                                                                                                          "requestMethod": "get",
                                                                                                                                          "isLocal": false,
                                                                                                                                          "LocalService": "assets/Responses/getHPFAHistory.json",
                                                                                                                                          "params": {
                                                                                                                                            "itemId": "#UnitInfo.ITEM_ID",
                                                                                                                                            "locationId": "#userSelectedLocation",
                                                                                                                                            "clientId": "#userSelectedClient",
                                                                                                                                            "contractId": "#userSelectedContract",
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
                                                                                                                                                  "key": "getReworkDetails",
                                                                                                                                                  "data": "responseData"
                                                                                                                                                },
                                                                                                                                                "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "renderTemplate",
                                                                                                                                                "config": {
                                                                                                                                                  "templateId": "cisco-lou/lou-Cisco_Rework_Check.json",
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
                                                                                                                                                  "key": "errorCiscoReworkResp",
                                                                                                                                                  "data": "responseData"
                                                                                                                                                },
                                                                                                                                                "eventSource": "click"
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "updateComponent",
                                                                                                                                                "config": {
                                                                                                                                                  "key": "errorTitleUUID",
                                                                                                                                                  "properties": {
                                                                                                                                                    "titleValue": "#errorCiscoReworkResp",
                                                                                                                                                    "isShown": true
                                                                                                                                                  },
                                                                                                                                                  "eventSource": "click"
                                                                                                                                                }
                                                                                                                                              },
                                                                                                                                              {
                                                                                                                                                "type": "renderTemplate",
                                                                                                                                                "config": {
                                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_Rework_Check.json",
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
                                                                                                                                "type": "condition",
                                                                                                                                "hookType": "afterInit",
                                                                                                                                "config": {
                                                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                                                  "lhs": "#UnitInfo.WORKCENTER",
                                                                                                                                  "rhs": "PAINT"
                                                                                                                                },
                                                                                                                                "eventSource": "click",
                                                                                                                                "responseDependents": {
                                                                                                                                  "onSuccess": {
                                                                                                                                    "actions": [
                                                                                                                                      {
                                                                                                                                        "type": "condition",
                                                                                                                                        "hookType": "afterInit",
                                                                                                                                        "config": {
                                                                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                                                                          "lhs": "#UnitInfo.GEONAME",
                                                                                                                                          "rhs": "Szombathely"
                                                                                                                                        },
                                                                                                                                        "eventSource": "click",
                                                                                                                                        "responseDependents": {
                                                                                                                                          "onSuccess": {
                                                                                                                                            "actions": [
                                                                                                                                              {
                                                                                                                                                "type": "renderTemplate",
                                                                                                                                                "config": {
                                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_Paint.json",
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
                                                                                                                                                  "templateId": "cisco-lou/lou-Cisco_Paint.json",
                                                                                                                                                  "mode": "local"
                                                                                                                                                }
                                                                                                                                              }
                                                                                                                                            ]
                                                                                                                                          }
                                                                                                                                        }
                                                                                                                                      }
                                                                                                                                    ],
                                                                                                                                    "onFailure": {
                                                                                                                                      "actions": [

                                                                                                                                      ]
                                                                                                                                    }
                                                                                                                                  },
                                                                                                                                  "onFailure": {
                                                                                                                                    "actions": [
                                                                                                                                      {
                                                                                                                                        "type": "condition",
                                                                                                                                        "hookType": "afterInit",
                                                                                                                                        "config": {
                                                                                                                                          "operation": "isEqualToIgnoreCase",
                                                                                                                                          "lhs": "#UnitInfo.WORKCENTER",
                                                                                                                                          "rhs": "FSYSASSY"
                                                                                                                                        },
                                                                                                                                        "eventSource": "click",
                                                                                                                                        "responseDependents": {
                                                                                                                                          "onSuccess": {
                                                                                                                                            "actions": [
                                                                                                                                              {
                                                                                                                                                "type": "condition",
                                                                                                                                                "hookType": "afterInit",
                                                                                                                                                "config": {
                                                                                                                                                  "operation": "isEqualToIgnoreCase",
                                                                                                                                                  "lhs": "#UnitInfo.GEONAME",
                                                                                                                                                  "rhs": "Szombathely"
                                                                                                                                                },
                                                                                                                                                "eventSource": "click",
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
                                                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_FSYSASSY.json",
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
                                                                                                                                                                  "templateId": "cisco-szo/szo-Cisco_FSYSASSY.json",
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
                                                                                                                                                                  "templateId": "cisco-lou/lou-Cisco_FSYSASSY.json",
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
                                                                                                                                                                  "templateId": "cisco-lou/lou-Cisco_FSYSASSY.json",
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
    ];
    reduce && reduce.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }
  afterhandsOncallfunctiomality(action, instance, actionService){
   this.contextService.deleteDataByKey("isTimeOutFromCiscoWC");
   let afterhandsOncallfunctiomality = {
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
             "type": "condition",
             "config": {
               "operation": "isEqualTo",
               "lhs": "#UnitInfo.STATUS",
               "rhs": "Time Out"
             },
             "responseDependents": {
               "onSuccess": {
                 "actions": [
                   {
                     "type": "condition",
                     "config": {
                       "operation": "isValid",
                       "lhs": "#UnitInfo.DESTINATIONWC"
                     },
                     "responseDependents": {
                       "onSuccess": {
                         "actions": [
                           {
                             "type": "timeInCiscoMicroServices",
                             "eventSource": "click"
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
                                 "#UnitInfo.ITEM_BCN",
                                 "#UnitInfo.WORKCENTER"
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
                     "type": "condition",
                     "config": {
                       "operation": "isValid",
                       "lhs": "#UnitInfo.STATUS"
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
                                                             "type": "commonCiscoWCOperations",
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
                                                     "type": "commonCiscoWCOperations",
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
                             "type": "condition",
                             "config": {
                               "operation": "isValid",
                               "lhs": "#UnitInfo.DESTINATIONWC"
                             },
                             "responseDependents": {
                               "onSuccess": {
                                 "actions": [
                                   {
                                     "type": "secondtimeInCiscoMicroServices",
                                     "eventSource": "click"
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
                                         "#UnitInfo.ITEM_BCN",
                                         "#UnitInfo.WORKCENTER"
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
   actionService.handleAction(afterhandsOncallfunctiomality, instance)
  }
}
