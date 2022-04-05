import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';


@Injectable({
  providedIn: 'root'
})
export class DellCarPackoutshippingService {

  constructor(private contextService: ContextService, ) { }

  handleDellCarShippingActions(action: any, instance: any, actionService: any) {
    switch (action.methodType) {
      case 'dellCarRoutingToShippingPage':
        this.dellCarRoutingToShippingPage(instance, actionService);
        break;
      case 'destinationPalletLogic':
        this.destinationPalletLogic(instance, actionService);
        break;
      case 'enableExit':
        this.enableExit(instance, actionService);
        break;
      case 'clearErrorAndDisableExit':
        this.clearErrorAndDisableExit(instance, actionService);
        break;
      case 'getRoOoDataIntoContext':
        this.getRoOoDataIntoContext(instance, actionService);
        break;
      case 'updatePlaceHolderAndValidation':
        this.updatePlaceHolderAndValidation(instance, actionService);
        break;
      case 'displayDestinationPalletDialog':
        this.displayDestinationPalletDialog(instance, actionService);
        break;
      case 'destinationPalletFromTrackingNumber':
        this.destinationPalletFromTrackingNumber(instance, actionService);
        break;
      case 'displayBoxShippingPage':
        this.displayBoxShippingPage(instance, actionService);
        break;
      case 'getRoOoDataIntoContextBoxShipping':
        this.getRoOoDataIntoContextBoxShipping(instance, actionService);
        break;
    }
  }

  dellCarRoutingToShippingPage(instance, actionService) {
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
                "type": "microservice",
                "config": {
                  "microserviceId": "getRoffByRo",
                  "isLocal": false,
                  "LocalService": "assets/Responses/dellROLeftNavData.json",
                  "requestMethod": "get",
                  "params": {
                    "userName": "#loginUUID.username",
                    "refernceOrderById": "#shippingReferenceOrderId"
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
                        "type": "renderTemplate",
                        "config": {
                          "templateId": "dellCarPackoutShipping.json",
                          "mode": "local"
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
                          "updateKey": "shippingErrorTitleUUID"
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
                  "key": "boxShipping",
                  "data": false
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
                                  "microserviceId": "getRoffByRo",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/dellROLeftNavData.json",
                                  "requestMethod": "get",
                                  "params": {
                                    "userName": "#loginUUID.username",
                                    "refernceOrderById": "#shippingReferenceOrderId"
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
                                        "hookType": "afterInit",
                                        "config": {
                                          "microserviceId": "getCurrPrevRODetailsBySN",
                                          "isLocal": false,
                                          "LocalService": "assets/Responses/destinationPallet.json",
                                          "requestMethod": "get",
                                          "params": {
                                            "serialNo": "#shippingSerialNo",
                                            "locationId": "#userSelectedLocation",
                                            "clientId": "#userSelectedClient",
                                            "contractId": "#userSelectedContract",
                                            "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                                                  "key": "getCurrPrevRODetailsBySNData",
                                                  "data": "responseData"
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
                                                        "type": "renderTemplate",
                                                        "config": {
                                                          "templateId": "dellCarPackoutShipping.json",
                                                          "mode": "local"
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
                                                          "updateKey": "shippingErrorTitleUUID"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              }
                                            ]
                                          }
                                        },
                                        "onFailure": {
                                          "actions": [
                                            {
                                              "type": "handleCommonServices",
                                              "config": {
                                                "type": "errorRenderTemplate",
                                                "contextKey": "errorMsg",
                                                "updateKey": "shippingErrorTitleUUID"
                                              }
                                            }
                                          ]
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
                                          "updateKey": "shippingErrorTitleUUID"
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
                                  "updateKey": "shippingErrorTitleUUID"
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
                          "updateKey": "shippingErrorTitleUUID"
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

  destinationPalletLogic(instance, actionService) {
    let destinationPalletLogicAction = {
      "type": "microservice",
      "config": {
        "microserviceId": "getStAbbrevCode",
        "requestMethod": "get",
        "params": {
          "outBoundOrderId": "#shippingOutBoundOrderId",
          "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                "key": "shippingAbbrevCodeData",
                "data": "responseData"
              }
            },
            {
              "type": "microservice",
              "config": {
                "microserviceId": "getShippingTermsDetails",
                "requestMethod": "get",
                "params": {
                  "outBoundOrderId": "#shippingOutBoundOrderId",
                  "tradingPartnerId": "#shippingTradingPartnerId",
                  "abbrevCode": "#shippingAbbrevCodeData.abbrevCode",
                  "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                        "key": "shippingTermsDetails",
                        "data": "responseArray"
                      }
                    },
                    {
                      "type": "microservice",
                      "config": {
                        "microserviceId": "getDestinationPallet",
                        "isLocal": false,
                        "LocalService": "assets/Responses/destinationPallet.json",
                        "requestMethod": "get",
                        "params": {
                          "outBoundOrderId": "#shippingOutBoundOrderId",
                          "abbrevCode": "#shippingAbbrevCodeData.abbrevCode",
                          "tradingPartnerId": "#shippingTradingPartnerId",
                          "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                                "key": "palletData",
                                "data": "responseData"
                              }
                            },
                            {
                              "type": "microservice",
                              "config": {
                                "microserviceId": "getPalletDispositionAndColourCode",
                                "isLocal": false,
                                "LocalService": "assets/Responses/destinationPallet.json",
                                "requestMethod": "get",
                                "params": {
                                  "referanceOrderId": "#shippingReferenceOrderId",
                                  "businessTransactionType": "#shippingbussinessTrxTypeId",
                                  "contractId": "#userSelectedContract",
                                  "clientId": "#userSelectedClient",
                                  "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                                        "key": "shippingDestinationPalletData",
                                        "data": "responseData"
                                      }
                                    },
                                    {
                                      "type": "context",
                                      "hookType": "afterInit",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "palletBgColor",
                                        "data": "#shippingDestinationPalletData.colourCode"
                                      }
                                    },
                                    {
                                      "type": "context",
                                      "hookType": "afterInit",
                                      "config": {
                                        "requestMethod": "add",
                                        "key": "palletText",
                                        "data": "#shippingDestinationPalletData.palletDisposition"
                                      }
                                    },
                                    {
                                      "type": "condition",
                                      "config": {
                                        "operation": "isValid",
                                        "lhs": "#shippingShipManifestStatus.shipmentId"
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": [
                                            {
                                              "type": "updateComponent",
                                              "config": {
                                                "key": "dellCarShippingPanelUUID",
                                                "properties": {
                                                  "expanded": false,
                                                  "disabled": false,
                                                  "header": {
                                                    "title": "Ship",
                                                    "svgIcon": "description_icon",
                                                    "statusIcon": "check_circle",
                                                    "statusClass": "complete-status",
                                                    "class": "greyish-black subtitle1 font-weight-700",
                                                    "iconClass": "complete-task"
                                                  }
                                                }
                                              },
                                              "eventSource": "click"
                                            },
                                            {
                                              "type": "updateComponent",
                                              "config": {
                                                "key": "dellCarshipCompleteUUID",
                                                "properties": {
                                                  "disabled": true
                                                }
                                              },
                                              "eventSource": "click"
                                            },
                                            {
                                              "type": "condition",
                                              "config": {
                                                "operation": "isEqualToIgnoreCase",
                                                "lhs": "#shippingDestinationPalletData.palletDisposition",
                                                "rhs": "X-KOM"
                                              },
                                              "eventSource": "click",
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
                                                    {
                                                      "type": "microservice",
                                                      "hookType": "afterInit",
                                                      "config": {
                                                        "microserviceId": "getShippingFfValueByFfName",
                                                        "isLocal": false,
                                                        "LocalService": "assets/Responses/x-komMockdata.json",
                                                        "requestMethod": "get",
                                                        "params": {
                                                          "ffName": "X-KOM_FLAG",
                                                          "shipmentBoxId": "#shippingShipManifestStatus.shipmentBoxId",
                                                          "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                                                                "key": "getShippingFlexFieldData",
                                                                "data": "responseArray"
                                                              }
                                                            },
                                                            {
                                                              "type": "condition",
                                                              "config": {
                                                                "operation": "isEqualToIgnoreCase",
                                                                "lhs": "#getShippingFlexFieldData.flexFieldValue",
                                                                "rhs": "Y"
                                                              },
                                                              "eventSource": "change",
                                                              "responseDependents": {
                                                                "onSuccess": {
                                                                  "actions": [
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "dellCarManifestTrackingNumberUUID",
                                                                        "properties": {
                                                                          "hidden": false,
                                                                          "required": true
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "dellCarManifestPrinterUUID",
                                                                        "properties": {
                                                                          "hidden": true,
                                                                          "required": false
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "dellCarTrackingNumberUUID",
                                                                        "properties": {
                                                                          "hidden": true
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
                                                                        "key": "dellCarManifestTrackingNumberUUID",
                                                                        "properties": {
                                                                          "hidden": true,
                                                                          "required": false
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "dellCarManifestPrinterUUID",
                                                                        "properties": {
                                                                          "hidden": false,
                                                                          "required": true
                                                                        }
                                                                      },
                                                                      "eventSource": "click"
                                                                    }
                                                                  ]
                                                                }
                                                              }
                                                            },
                                                            {
                                                              "type": "updateComponent",
                                                              "config": {
                                                                "key": "dellCarManifestTaskUUID",
                                                                "properties": {
                                                                  "expanded": true,
                                                                  "disabled": false,
                                                                  "header": {
                                                                    "title": "Manifest",
                                                                    "icon": "description",
                                                                    "svgIcon": "description_icon",
                                                                    "iconClass": "active-header",
                                                                    "statusIcon": "hourglass_empty",
                                                                    "statusClass": "incomplete-status",
                                                                    "class": "greyish-black subtitle1 font-weight-700"
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
                                                              "type": "handleCommonServices",
                                                              "config": {
                                                                "type": "errorRenderTemplate"
                                                              }
                                                            },
                                                            {
                                                              "type": "handleDellCarShippingActions",
                                                              "methodType": "enableExit"
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
                                                        "key": "dellCarManifestTaskUUID",
                                                        "properties": {
                                                          "expanded": true,
                                                          "disabled": false,
                                                          "header": {
                                                            "title": "Manifest",
                                                            "icon": "description",
                                                            "svgIcon": "description_icon",
                                                            "iconClass": "active-header",
                                                            "statusIcon": "hourglass_empty",
                                                            "statusClass": "incomplete-status",
                                                            "class": "greyish-black subtitle1 font-weight-700"
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
                                              "type": "condition",
                                              "config": {
                                                "operation": "isEqualToIgnoreCase",
                                                "lhs": "#shippingDestinationPalletData.palletDisposition",
                                                "rhs": "X-KOM"
                                              },
                                              "eventSource": "click",
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "dellCarManifestTaskUUID",
                                                        "properties": {
                                                          "hidden": true
                                                        }
                                                      },
                                                      "eventSource": "click"
                                                    },
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "dellCarTrackingNumberUUID",
                                                        "properties": {
                                                          "hidden": true
                                                        }
                                                      },
                                                      "eventSource": "click"
                                                    },
                                                    {
                                                      "type": "context",
                                                      "config": {
                                                        "requestMethod": "add",
                                                        "key": "XKOMFLAGFlexField",
                                                        "data": "Y"
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
                                              "type": "condition",
                                              "config": {
                                                "operation": "isEqualTo",
                                                "lhs": "#shippingDestinationPalletData.palletDisposition",
                                                "rhs": "Switzerland"
                                              },
                                              "eventSource": "click",
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": [
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "dellCarManifestTaskUUID",
                                                        "properties": {
                                                          "hidden": true
                                                        }
                                                      },
                                                      "eventSource": "click"
                                                    },
                                                    {
                                                      "type": "updateComponent",
                                                      "config": {
                                                        "key": "dellCarTrackingNumberUUID",
                                                        "properties": {
                                                          "hidden": true
                                                        }
                                                      },
                                                      "eventSource": "click"
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
                                        "type": "errorRenderTemplate"
                                      }
                                    },
                                    {
                                      "type": "handleDellCarShippingActions",
                                      "methodType": "enableExit"
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
                                "type": "errorRenderTemplate"
                              }
                            },
                            {
                              "type": "handleDellCarShippingActions",
                              "methodType": "enableExit"
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
                        "type": "errorRenderTemplate"
                      }
                    },
                    {
                      "type": "handleDellCarShippingActions",
                      "methodType": "enableExit"
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
                "type": "errorRenderTemplate"
              }
            },
            {
              "type": "handleDellCarShippingActions",
              "methodType": "enableExit"
            }
          ]
        }
      }
    }

    actionService.handleAction(destinationPalletLogicAction, instance);
  }

  enableExit(instance, actionService) {
    let actions = [
      {
        "type": "updateComponent",
        "config": {
          "key": "dellCarShippingExitUUID",
          "properties": {
            "disabled": false,
            "iconButtonClass": "body footer-save"
          }
        }
      }
    ]
    actions.forEach((ele) => {
      actionService.handleAction(ele, instance);
    });
  }

  clearErrorAndDisableExit(instance, actionService) {
    let actions = [
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
        "type": "updateComponent",
        "config": {
          "key": "dellCarShippingExitUUID",
          "properties": {
            "disabled": true,
            "iconButtonClass": "body primary-btn"
          }
        }
      },
    ]
    actions.forEach((ele) => {
      actionService.handleAction(ele, instance);
    });
  }

  getRoOoDataIntoContext(instance, actionService) {
    let actions = [
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingItemBcn",
          "data": "#shippingRoOoResponse.itemBcn"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingSerialNo",
          "data": "#shippingRoOoResponse.serialNumber"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingPartDesc",
          "data": "#shippingRoOoResponse.partDesc"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingReferenceOrderId",
          "data": "#shippingRoOoResponse.referenceOrderId"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingTradingPartnerId",
          "data": "#shippingRoOoResponse.tradingPartnerId"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingOutBoundOrderId",
          "data": "#shippingRoOoResponse.outboundOrderId"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingPartNo",
          "data": "#shippingRoOoResponse.partNo"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingSerialNo",
          "data": "#shippingRoOoResponse.serialNumber"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingCondition",
          "data": "#shippingRoOoResponse.condition"
        }
      }
    ]
    actions.forEach((ele) => {
      actionService.handleAction(ele, instance);
    });
  }

  updatePlaceHolderAndValidation(instance, actionService) {
    let actions = [
      {
        "type": "condition",
        "hookType": "afterInit",
        "eventSource": "change",
        "config": {
          "operation": "isValid",
          "lhs": "#userSelectedShippingType"
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "setDefaultValue",
                "hookType": "afterInit",
                "config": {
                  "key": "shippingTypeUUID",
                  "defaultValue": "#userSelectedShippingType"
                }
              },
              {
                "type": "updateComponent",
                "hookType": "afterInit",
                "config": {
                  "key": "shippingTypeUUID",
                  "fieldProperties": {
                    "identificatorTypeForShipping": "#userSelectedShippingType"
                  }
                }
              },
              {
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#userSelectedShippingType",
                  "rhs": "SerialNumber"
                },
                "eventSource": "change",
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "dellCarShippingUUID",
                          "setRequiredValidators": {
                            "shippingOrderIdValue": ""
                          },
                          "setPatternValidators": {
                            "shippingOrderIdValue": "^[a-zA-Z0-9]{7}$"
                          }
                        },
                        "eventSource": "change"
                      }
                    ]
                  },
                  "onFailure": {
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
                              "lhs": "#userSelectedShippingType",
                              "rhs": "OutboundOrderID"
                            },
                            {
                              "operation": "isEqualTo",
                              "lhs": "#userSelectedShippingType",
                              "rhs": "ReferenceOrderID"
                            }
                          ]
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "dellCarShippingUUID",
                                  "setRequiredValidators": {
                                    "shippingOrderIdValue": ""
                                  },
                                  "setPatternValidators": {
                                    "shippingOrderIdValue": "^[0-9]{10}$"
                                  }
                                },
                                "eventSource": "change"
                              }
                            ]
                          },
                          "onFailure": {
                            "actions": [
                              {
                                "type": "condition",
                                "config": {
                                  "operation": "isEqualTo",
                                  "lhs": "#userSelectedShippingType",
                                  "rhs": "BCN"
                                },
                                "eventSource": "change",
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "updateComponent",
                                        "config": {
                                          "key": "dellCarShippingUUID",
                                          "setRequiredValidators": {
                                            "shippingOrderIdValue": ""
                                          },
                                          "setPatternValidators": {
                                            "shippingOrderIdValue": "^[a-zA-Z0-9]{1,12}$"
                                          }
                                        },
                                        "eventSource": "change"
                                      }
                                    ]
                                  },
                                  "onFailure": {
                                    "actions": [
                                      {
                                        "type": "condition",
                                        "config": {
                                          "operation": "isEqualTo",
                                          "lhs": "#userSelectedShippingType",
                                          "rhs": "ClientReferenceNo1"
                                        },
                                        "eventSource": "change",
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "dellCarShippingUUID",
                                                  "setRequiredValidators": {
                                                    "shippingOrderIdValue": ""
                                                  },
                                                  "setPatternValidators": {
                                                    "shippingOrderIdValue": "^[a-zA-Z0-9]{1,12}$"
                                                  }
                                                },
                                                "eventSource": "change"
                                              }
                                            ]
                                          },
                                          "onFailure": {
                                            "actions": [
                                              {
                                                "type": "updateComponent",
                                                "config": {
                                                  "key": "dellCarShippingUUID",
                                                  "setRequiredValidators": {
                                                    "shippingOrderIdValue": ""
                                                  }
                                                },
                                                "eventSource": "change"
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
                "type": "stringOperation",
                "config": {
                  "key": "placeHolderData",
                  "lstr": "Scan",
                  "rstr": "#userSelectedShippingTypeName",
                  "operation": "concat",
                  "concatSymbol": " "
                }
              },
              {
                "type": "updateComponent",
                "hookType": "afterInit",
                "config": {
                  "key": "shippingOrderIdUUID",
                  "properties": {
                    "placeholder": "#placeHolderData"
                  }
                }
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "setDefaultValue",
                "hookType": "afterInit",
                "config": {
                  "key": "shippingTypeUUID",
                  "defaultValue": "SerialNumber"
                }
              }
            ]
          }
        }
      }
    ];
    actions.forEach((ele) => {
      actionService.handleAction(ele, instance);
    });
  }

  displayDestinationPalletDialog(instance, actionService) {
    let actions = [
      {
        "type": "dialog",
        "uuid": "destinationPalletDialogUUID",
        "config": {
          "title": "Destination Pallet",
          "footerclass": "float-right",
          "disableClose": true,
          "closeIcon": true,
          "items": [
            {
              "ctype": "title",
              "uuid": "dellcarTextUUID",
              "titleClass": "greyish-black body-italic assessment-alert",
              "title": "Place the box on the following pallet"
            },
            {
              "ctype": "label",
              "text": "Destination",
              "labelClass": "greyish-black subtitle1-align-self"
            },
            {
              "ctype": "button",
              "bgColor": "#palletBgColor",
              "inputClass": "pallet-dotted shadow-none",
              "color": "black",
              "text": "#palletText",
              "uuid": "dellCardestinationPalletUUID",
              "visibility": true,
              "dialogButton": true,
              "disabled": true,
              "hooks": [
                {
                  "type": "condition",
                  "hookType": "afterInit",
                  "config": {
                    "operation": "isEqualTo",
                    "lhs": "#palletText",
                    "rhs": "UPS GERMANY"
                  },
                  "eventSource": "click",
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "dellCardestinationPalletUUID",
                            "properties": {
                              //  "inputStyles": "color:black;",
                              "inputClass": "pallet-dotted shadow-none text-color-ups",
  
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
              ],
              "validations": [],
              "actions": []
            }
          ],
          "footer": [
            {
              "ctype": "spacer",
              "uuid": "emptySpaceUUID",
              "class": "empty-space"
            },
            {
              "ctype": "button",
              "color": "primary",
              "text": "Done",
              "uuid": "doneButtonUUID",
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
        "eventSource": "click",
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "clearScreenData",
                "eventSource": "click"
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
            "actions": []
          }
        }
      }
    ]
    actions.forEach((ele) => {
      actionService.handleAction(ele, instance);
    });
  }

  destinationPalletFromTrackingNumber(instance, actionService) {
    let actions = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "getPalletDispositionAndColourCode",
          "isLocal": false,
          "LocalService": "assets/Responses/destinationPallet.json",
          "requestMethod": "get",
          "params": {
            "referanceOrderId": "#shippingReferenceOrderId",
            "trackingNo": "#dellCarTrackingNumberFormData.TrackingNumber",
            "businessTransactionType": "#shippingbussinessTrxTypeId",
            "contractId": "#userSelectedContract",
            "clientId": "#userSelectedClient",
            "userName": "#userAccountInfo.PersonalDetails.USERID"
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
                  "key": "shippingDestinationPalletData",
                  "data": "responseData"
                }
              },
              {
                "type": "context",
                "hookType": "afterInit",
                "config": {
                  "requestMethod": "add",
                  "key": "palletBgColor",
                  "data": "#shippingDestinationPalletData.colourCode"
                }
              },
              {
                "type": "context",
                "hookType": "afterInit",
                "config": {
                  "requestMethod": "add",
                  "key": "palletText",
                  "data": "#shippingDestinationPalletData.palletDisposition"
                }
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarTrackingNumberUUID",
                  "properties": {
                    "expanded": false,
                    "disabled": false,
                    "header": {
                      "title": "Tracking Number",
                      "svgIcon": "description_icon",
                      "statusIcon": "check_circle",
                      "statusClass": "complete-status",
                      "class": "greyish-black subtitle1 font-weight-700",
                      "iconClass": "complete-task"
                    }
                  }
                },
                "eventSource": "click"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "dellCarTrackingNumberUUID",
                  "properties": {
                    "disabled": true
                  }
                },
                "eventSource": "click"
              },
              {
                "type": "handleDellCarShippingActions",
                "methodType": "displayDestinationPalletDialog"
              }
            ]
          },
          "onFailure": {
            "actions": [
              {
                "type": "handleCommonServices",
                "config": {
                  "type": "errorRenderTemplate"
                }
              },
              {
                "type": "handleDellCarShippingActions",
                "methodType": "enableExit"
              }
            ]
          }
        }
      }
    ]
    actions.forEach((ele) => {
      actionService.handleAction(ele, instance);
    });
  }

  displayBoxShippingPage(instance, actionService) {
    let data = this.contextService.getDataByKey('HomeMenu');
    let selectedHomeMenuId = this.contextService.getDataByKey('selectedHomeMenuId');
    data && data.map((item) => {
      if (selectedHomeMenuId && item.id && item.id === selectedHomeMenuId) {
        let processJsonString = item.processJsonString;
        this.contextService.addToContext("boxShipOnlyProcessJson", processJsonString);
        actionService.handleAction({
          "type": "renderTemplate",
          "config": {
            "mode": "remote",
            "targetId": "mainPageContentBody",
            "templateId": "boxShipOnlyProcessJson"
          }
        }, instance);
      }
    })
  }

  getRoOoDataIntoContextBoxShipping(instance, actionService) {
    let actions = [
      {
        "type": "context",
        "eventSource": "rowClick",
        "config": {
          "requestMethod": "add",
          "key": "shippingReferenceOrderId",
          "data": "#shippingRoOoResponse.referenceOrderId"
        }
      },
      {
        "type": "context",
        "eventSource": "rowClick",
        "config": {
          "requestMethod": "add",
          "key": "shippingTradingPartnerId",
          "data": "#shippingRoOoResponse.tradingPartnerId"
        }
      },
      {
        "type": "context",
        "eventSource": "rowClick",
        "config": {
          "requestMethod": "add",
          "key": "shippingOutBoundOrderId",
          "data": "#shippingRoOoResponse.outBoundOrderId"
        }
      },
      {
        "type": "context",
        "eventSource": "rowClick",
        "config": {
          "requestMethod": "add",
          "key": "shippingPartNo",
          "data": "#shippingRoOoResponse.partNo"
        }
      },
      {
        "type": "context",
        "config": {
          "requestMethod": "add",
          "key": "shippingbussinessTrxTypeId",
          "data": "#shippingRoOoResponse.businessTrxTypeId",
        }
      },
    ]
    actions.forEach((ele) => {
      actionService.handleAction(ele, instance);
    });
  }
}

