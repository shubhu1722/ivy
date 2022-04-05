import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class DellShippingService {

  constructor(private contextService: ContextService) { 
    
  }

  routingToDellShippingPage(instance, action, actionService) {
    let routingShipping = [
      {
        "type": "condition",
        "hookType": "afterInit",
        "config": {
          "operation": "isValid",
          "lhs": "#shippingItemBcn"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
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
                                          "templateId": "dell_shipping.json",
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
          },
          "onFailure": {
            "actions": [
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
                          "templateId": "dell_shipping.json",
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

  getidBasedOnName(instance, action, actionService){
    let reqData = this.contextService.getDataByKey(instance.config.reqData);
    let x
    // console.log(reqData);
    let selectedValue = this.contextService.getDataByKey(instance.config.selectedValue);
    if(instance.config.carrierTypeName){
      if(selectedValue.carrierTypeCode){
        selectedValue = selectedValue.carrierTypeCode
      }
      reqData.map((item)=>{
        if(item.carrierTypeCode == selectedValue){
          x = item.carrierTypeId
        }
      })
    }
    else{
      if(selectedValue.carrierName){
        selectedValue = selectedValue.carrierName
      }
      reqData.map((item)=>{
        if(item.carrierCodeName == selectedValue){
          x = item.carrierCodeId
        }
      })
    }
    this.contextService.addToContext(instance.config.key,x);
    // console.log(x);
  }
}