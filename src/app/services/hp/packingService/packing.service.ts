import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class PackingService {

  constructor(private contextService: ContextService, ) { }
  handlePackingTimoutWithAccessories(instance, action, actionService) {
    let packingAccessoriesTimeout = [{
      "type": "microservice",
      "eventSource": "click",
      "config": {
        "microserviceId": "getStopShipProcess",
        "requestMethod": "get",
        "params": {
          "locationId": "#repairUnitInfo.LOCATION_ID",
          "clientId": "#repairUnitInfo.CLIENT_ID",
          "contract": "#repairUnitInfo.CONTRACT_ID",
          "bcn": "#repairUnitInfo.ITEM_BCN",
          "serial": "#repairUnitInfo.SERIAL_NO",
          "fat": "#repairUnitInfo.FAT",
          "partNo": "#repairUnitInfo.PART_NO",
          "opt": "#repairUnitInfo.ROUTE",
          "wcid": "#repairUnitInfo.WORKCENTER_ID",
          "userName": "#userAccountInfo.PersonalDetails.USERID"
        }
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "microservice",
              "eventSource": "click",
              "config": {
                "microserviceId": "packoutTimeOut",
                "requestMethod": "get",
                "params": {
                  "userName": "#userAccountInfo.PersonalDetails.USERID",
                  "itemId": "#repairUnitInfo.ITEM_ID",
                  "resultCode": "#SelectedDescripencyResultcode"
                }
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "getHPAccessory",
                        "requestMethod": "post",
                        "body": {
                          "userName": "#userAccountInfo.PersonalDetails.USERID",
                          "processType": "",
                          "workCenterId": "#repairUnitInfo.WORKCENTER_ID",
                          "clientId": "#repairUnitInfo.CLIENT_ID",
                          "contractId": "#repairUnitInfo.CONTRACT_ID",
                          "locationId": "#repairUnitInfo.LOCATION_ID",
                          "resultCode": "#SelectedDescripencyResultcode",
                          "initialResultCode": "",
                          "itemId": "#repairUnitInfo.ITEM_ID",
                          "workCenterName": "#repairUnitInfo.WORKCENTER",
                          "flexFields": {
                            "flexFieldsList": "#confirmAccessoriesFlexFieldsData"
                          }
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
                                "microserviceId": "performTimeOut",
                                "requestMethod": "post",
                                "body": {
                                  "timeOutRequest": {
                                    "location": "#repairUnitInfo.GEONAME",
                                    "bcn": "#repairUnitInfo.ITEM_BCN",
                                    "workCenter": "#repairUnitInfo.WORKCENTER",
                                    "password": "#loginUUID.password",
                                    "warrantyInd": "false",
                                    "notes": "#timeoutNotes.addNote",
                                    "resultCode": "#SelectedDescripencyResultcode",
                                    "flexFields": {
                                      "flexFieldsList": "#confirmAccessoriesFlexFieldsData"
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
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "confirmAccessoriesFlexFieldsData",
                                        "data": []
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "missingAccessoriesList",
                                        "data": ""
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "context",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "mb_pnFieldValue",
                                        "data": ""
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "deleteComponent",
                                      "eventSource": "click",
                                      "config": {
                                        "key": "#currentTaskUUID"
                                      }
                                    },
                                    {
                                      "type": "reRoutingthePacking"
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
                "key": "getStopShipProcessData",
                "data": "responseData"
              }
            },
            {
              "type": "updateComponent",
              "config": {
                "key": "errorTitleUUID",
                "properties": {
                  "titleValue": "#getStopShipProcessData",
                  "isShown": true
                }
              }
            }
          ]
        }
      }
    }
    ];

    if (packingAccessoriesTimeout) {
      packingAccessoriesTimeout.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }
  handlePackingTimoutWithOutAccessories(instance, action, actionService) {
    let packingWithoutAccessoriesTimeout = [
      {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "getStopShipProcess",
          "requestMethod": "get",
          "params": {
            "locationId": "#repairUnitInfo.LOCATION_ID",
            "clientId": "#repairUnitInfo.CLIENT_ID",
            "contract": "#repairUnitInfo.CONTRACT_ID",
            "bcn": "#repairUnitInfo.ITEM_BCN",
            "serial": "#repairUnitInfo.SERIAL_NO",
            "fat": "#repairUnitInfo.FAT",
            "partNo": "#repairUnitInfo.PART_NO",
            "opt": "#repairUnitInfo.ROUTE",
            "wcid": "#repairUnitInfo.WORKCENTER_ID",
            "userName": "#userAccountInfo.PersonalDetails.USERID"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "microservice",
                "eventSource": "click",
                "config": {
                  "microserviceId": "packoutTimeOut",
                  "requestMethod": "get",
                  "params": {
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                    "itemId": "#repairUnitInfo.ITEM_ID",
                    "resultCode": "#SelectedDescripencyResultcode"
                  }
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "microservice",
                        "eventSource": "click",
                        "config": {
                          "microserviceId": "performTimeOut",
                          "requestMethod": "post",
                          "isLocal": false,
                          "body": {
                            "timeOutRequest": {
                              "location": "#repairUnitInfo.GEONAME",
                              "bcn": "#repairUnitInfo.ITEM_BCN",
                              "workCenter": "#repairUnitInfo.WORKCENTER",
                              "password": "#loginUUID.password",
                              "warrantyInd": "false",
                              "notes": "#timeoutNotes.addNote",
                              "resultCode": "#SelectedDescripencyResultcode",
                              "flexFields": {
                                "flexFieldsList": "#confirmAccessoriesFlexFieldsData"
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
                                "type": "deleteComponent",
                                "eventSource": "click",
                                "config": {
                                  "key": "#currentTaskUUID"
                                }
                              },
                              {
                                "type": "reRoutingthePacking"
                              },
                              
                        
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
                  "key": "getStopShipProcessData",
                  "data": "responseData"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "errorTitleUUID",
                  "properties": {
                    "titleValue": "#getStopShipProcessData",
                    "isShown": true
                  }
                }
              }
            ]
          }
        }
      }
    ];
    if (packingWithoutAccessoriesTimeout) {
      packingWithoutAccessoriesTimeout.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }

  //reRouting the packaging
  reRoutingthePacking(instance, action, actionService) {
    let routingPacking = [
      {
        "type": "multipleCondition",
        "config": {
          "multi": true,
          "operator": "OR",
          "conditions": [{
            "operation": "isEqualTo",
            "lhs": "#SelectedDescripencyResultcode",
            "rhs": "REPAIRED"
          }, {
            "operation": "isEqualTo",
            "lhs": "#SelectedDescripencyResultcode",
            "rhs": "RETURN"
          }, {
            "operation": "isEqualTo",
            "lhs": "#SelectedDescripencyResultcode",
            "rhs": "RWR"
          }]
        },
        "eventSource": "click",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "clearScreenData"
            },
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "packoutShipping.json",
                  "mode": "local"
                },
                "eventSource": "click"
              },
              {
                "type": "updateStage",
                "eventSource": "click",
                "config": {
                  "currentStage": "PACKING",
                  "currentSubProcess": "PACKOUT",
                  "nextStage": "SHIPPING",
                  "targetId": "menuTreeUUID",
                  "processId": "#SubprocessMenu"
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
                },
                "eventSource": "click"
              }, {
                "type": "microservice",
                "config": {
                  "microserviceId": "getSearchCriteria",
                  "isLocal": false,
                  "LocalService": "assets/Responses/getSearchCriteria.json", "requestMethod": "get", "params": { "locationId": "#userSelectedLocation", "clientId": "#userSelectedClient", "contractId": "#userSelectedContract", "searchType": "#userSelectedSubProcessType", "userName": "#userAccountInfo.PersonalDetails.USERID" }
                },
                "eventSource": "click",
                "responseDependents": {
                  "onSuccess": {
                    "actions": [{
                      "type": "context",
                      "config":
                      {
                        "requestMethod": "add",
                        "key": "getSearchCriteriaData",
                        "data": "responseData"
                      }
                    }, {
                      "type": "renderTemplate",
                      "config":
                      {
                        "mode": "remote",
                        "targetId": "mainPageContentBody",
                        "templateId": "getSearchCriteriaData"
                      }
                    }]
                  },
                  "onFailure": {
                    "actions":
                      [{
                        "type": "updateComponent",
                        "config": {
                          "key": "errorTitleUUID",
                          "properties": {
                            "titleValue": "Search Criteria is not Configured",
                            "isShown": true
                          }
                        }
                      }]
                  }
                }
              }]
          }
        }
      }
    ];
    if (routingPacking) {
      routingPacking.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }

  routingToShippingPage(instance, action, actionService) {
    let routingShipping = [
      {
        "type": "condition",
        "config": {
          "operation": "isEqualToIgnoreCase",
          "lhs": "#shippingRoOoResponse.orderProcessTypeCode",
          "rhs": "OSTK"
        },
        "eventSource": "input",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "boxShipping",
                  "data": true
                }
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "shippingFromDashboard",
                  "data": true
                }
              },
              {
                "type": "renderTemplate",
                "config": {
                  "templateId": "packoutShipping.json",
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
                  "key": "boxShipping",
                  "data": false
                }
              },
              {
                "type": "microservice",
                "config": {
                  "microserviceId": "getROByBCN",
                  "requestMethod": "get",
                  "params": {
                    "userName": "#userAccountInfo.PersonalDetails.USERID",
                    "itemBCN": "#shippingItemBcn"
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
                        "config": {
                          "microserviceId": "receiptDate",
                          "requestMethod": "get",
                          "params": {
                            "locationId": "#userSelectedLocation",
                            "itemId": "#shippingRoOoResponse.itemId",
                            "userName": "#userAccountInfo.PersonalDetails.USERID",
                            "bcn": "#shippingItemBcn",
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
                                    "locationId": "#userSelectedLocation",
                                    "clientId": "#userSelectedClient",
                                    "contractId": "#userSelectedContract",
                                    "reforderId": "#ROByBCNForDiscrepancy",
                                    "partNumber": "#shippingPartNo",
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
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "shippingFromDashboard",
                                          "data": true
                                        }
                                      },
                                      {
                                        "type": "renderTemplate",
                                        "config": {
                                          "templateId": "packoutShipping.json",
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
                                          "key": "errorDisp",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "shippingErrorTitleUUID",
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
                                  "key": "shippingErrorTitleUUID",
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
                          "key": "shippingErrorTitleUUID",
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
    ];
    if (routingShipping) {
      routingShipping.forEach((ele) => {
        actionService.handleAction(ele, instance);
      });
    }
  }

  updateShippingTermDetailsContext(instance, action, actionService) {
    const shippingHpgnTriggerData = this.contextService.getDataByKey('shippingHpgnTriggerData');
    const shippingTermsDetailsData = this.contextService.getDataByKey('shippingTermsDetails');
    
    // Copy matching non null properties from hpgntrigger data to shippingtermdetails context
    Object.keys(shippingTermsDetailsData).forEach(key => key in shippingHpgnTriggerData && shippingHpgnTriggerData[key] && shippingHpgnTriggerData[key] !== undefined &&
      shippingHpgnTriggerData[key] !== null ? shippingTermsDetailsData[key] = shippingHpgnTriggerData[key] : null)
    this.contextService.addToContext("shippingTermsDetails", shippingTermsDetailsData);
  }
}
