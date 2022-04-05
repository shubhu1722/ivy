import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class VerifoneSeachServiceService {

  constructor(
    private contextService: ContextService
  ) { }

  handleVerifoneSearchPageRendering(action: any, instance: any, actionService: any) {
    let searchJson;
    if (action.menu && action.menu == "LOAD STATION") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-batchProcess.json",
          "mode": "local"
        },
        "eventSource": "change"
      }];
    } else if (action.menu && action.menu == "CA_KEYING") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-CAKeying.json",
          "mode": "local"
        }
      }];
    } else if (action.menu && action.menu == "COBRA_KEYING") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-COBRAKeying.json",
          "mode": "local"
        }
      }];
    } else if (action.menu && action.menu == "ITALY_KEYING") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-ITALYKeying.json",
          "mode": "local"
        }
      }];
    } else if (action.menu && action.menu == "L2_RKL_KEYING") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-L2RKLKeying.json",
          "mode": "local"
        }
      }];
    } else if (action.menu && action.menu == "P2PE_RKL_KEYING") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-P2PEKeying.json",
          "mode": "local"
        }
      }];
    } else if (action.menu && action.menu == "TMS") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-TMSKeying.json",
          "mode": "local"
        }
      }];
    } else if (action.menu && action.menu == "TOTAL_KEYING") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-TOTALKeying.json",
          "mode": "local"
        }
      }];
    } else if (action.menu && action.menu == "VERIINIT") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-veriinist.json",
          "mode": "local"
        }
      }];
    }else if (action.menu && action.menu == "HERD") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-HERDKeying.json",
          "mode": "local"
        }
      }];
    }else if (action.menu && action.menu == "IDS") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-IDSKeying.json",
          "mode": "local"
        }
      }];
    }else if (action.menu && action.menu == "ITALY_PARA") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-ITALYPARAKeying.json",
          "mode": "local"
        }
      }];
    }else if (action.menu && action.menu == "OS_LOADING") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-OSLOADINGKeying.json",
          "mode": "local"
        }
      }];
    }else if (action.menu && action.menu == "PARA") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-PARAKeying.json",
          "mode": "local"
        }
      }];
    }else if (action.menu && action.menu == "PERSO") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-PERSOKeying.json",
          "mode": "local"
        }
      }];
    }else if (action.menu && action.menu == "UX_PARA") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifone-UXPARAKeying.json",
          "mode": "local"
        }
      }];
    }else if (action.menu && action.menu == "VHQ") {
      searchJson = [{
        "type": "renderTemplate",
        "config": {
          "templateId": "verifone/verifoneVHQKeying.json",
          "mode": "local"
        }
      }];
    }


    searchJson.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });

  }

  resetVerifoneSearchPageRendering(action: any, instance: any, actionService: any) {
    let blankJson = [{
      "type": "microservice",
      "config": {
        "microserviceId": "getSearchCriteria",
        "isLocal": true,
        "LocalService": "assets/verifoneBlankPage.json",
        "requestMethod": "get",
        "params": {
          "locationId": "#userSelectedLocation",
          "clientId": "#userSelectedClient",
          "contractId": "#userSelectedContract",
          "searchType": "#userSelectedSubProcessType",
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
                "key": "getSearchCriteriaData",
                "data": "responseData"
              }
            },
            {
              "type": "renderTemplate",
              "config": {
                "mode": "remote",
                "targetId": "mainPageContentBody",
                "templateId": "getSearchCriteriaData"
              }
            }
          ]
        },
        "onFailure": {
          "actions": [
            {
              "type": "updateComponent",
              "config": {
                "key": "dashboardErrorTitleUUID",
                "properties": {
                  "titleValue": "Search Criteria is not configured",
                  "isShown": true
                }
              }
            }
          ]
        }
      }
    }
    ];
    blankJson.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  verifonRenderSubprocess(action, instance, actionService) {
    let afterhandsOncallfunctiomality = [{
      "type": "condition",
      "config": {
        "operation": "isValidList",
        "validList": [
          "#UnitInfo.WORKCENTER_ID"
        ]
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "condition", //condition to check unit is on timein or timeout.
              "config": {
                "operation": "isEqualTo",
                "lhs": "#UnitInfo.STATUS",
                "rhs": "Time Out"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "errorPrepareAndRender",
                      "config": {
                        "key": "searchCriteriaErrorTitleUUID",
                        "properties": {
                          "titleValue": " Item- {0} Reached to it's Destination Workcenter: {1}",
                          "isShown": true
                        },
                        "valueArray": [
                          "#UnitInfo.ITEM_BCN",
                          "#UnitInfo.WORKCENTER"
                        ]
                      }
                    }
                  ]
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "condition", //condition to check the unit is on hold or not.
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#UnitInfo.ONHOLD",
                        "rhs": "1"
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "errorPrepareAndRender",
                              "config": {
                                "key": "searchCriteriaErrorTitleUUID",
                                "properties": {
                                  "titleValue": " Item- {0} is On HOLD.",
                                  "isShown": true
                                },
                                "valueArray": [
                                  "#UnitInfo.ITEM_BCN",
                                  "#UnitInfo.WORKCENTER"
                                ]
                              }
                            }
                          ]
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "commonVerifoneActions",
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
    }]
    afterhandsOncallfunctiomality.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  commonVerifoneActions(action, instance, actionService) {
    // CommonCiscoActions(action, instance, actionService) {
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
                          "microserviceId": "getOrder4WC",
                          "requestMethod": "get",
                          "params": {
                            "orderIdentificatorValue": "#UnitInfo.SERIAL_NO",
                            "identificatorType": "ClientReferenceNo2",
                            "userName": "#loginUUID.username"
                          }
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "context",
                                "config": {
                                  "requestMethod": "add",
                                  "key": "verifoneOrderDetails",
                                  "data": "responseData"
                                }
                              },
                              {
                                "type": "getVerifoneRmaNumber"
                              },
                              {
                                "type": "microservice",
                                "config": {
                                  "microserviceId": "getReceivingLPanelDetails",
                                  "requestMethod": "get",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/mockHoldSubCode.json",
                                  "params": {
                                    "locationId": "#userSelectedLocation",
                                    "clientId": "#userSelectedClient",
                                    "contractId": "#userSelectedContract",
                                    "bttId": "1",
                                    "referenceOrderId": "#verifoneOrderDetails.0.refrenceOrderId",
                                    "identificatorType": "SN",
                                    "identificatorValue": "#UnitInfo.SERIAL_NO",
                                    "serialNo": "#verifoneOrderDetails.0.clientRefrenceNo2",
                                    "pr": "#verifoneOrderDetails.0.clientRefrenceNo1",
                                    "rma": "#orderRMANumber",
                                    "login": "#loginUUID.username"

                                  }
                                },
                                "responseDependents": {
                                  "onSuccess": {
                                    "actions": [
                                      {
                                        "type": "context",
                                        "config": {
                                          "requestMethod": "add",
                                          "key": "verifoneLeftHeaderData",
                                          "data": "responseData"
                                        }
                                      },
                                      {
                                        "type": "getRecievingPanelDetail"
                                      },
                                      {
                                        "type": "microservice",
                                        "config": {
                                          "microserviceId": "getDueDate",
                                          "requestMethod": "get",
                                          "params": {
                                            "headerNumber": "#orderRMANumber",
                                            "prNumber": "#verifoneOrderDetails.0.clientRefrenceNo1",
                                            "incomingUnitSerialNumber": "#UnitInfo.SERIAL_NO"
                                          }
                                        },
                                        "responseDependents": {
                                          "onSuccess": {
                                            "actions": [
                                              {
                                                "type": "context",
                                                "config": {
                                                  "requestMethod": "add",
                                                  "key": "wcDueDateData",
                                                  "data": "responseData"
                                                }
                                              },
                                              {
                                                "type":"renderVerifoneWCHeaderData"
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
                                                    "titleValue": "Due Date Data Not Found",
                                                    "isShown": false
                                                  }
                                                }
                                              },
                                              {
                                                "type":"renderVerifoneWCHeaderData"
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
                                            "titleValue": "No Header Details Found",
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
                                    "titleValue": "No Record Found",
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

  olehandsOnapiprocess(action: any, instance: any, actionService) {
    let itemId = this.contextService.getDataByString(action.config.itemId);
    let selectedHomeMenuId = this.contextService.getDataByKey("selectedHomeMenuId");
    console.log("selectedHomeMenuId-->", this.contextService.getDataByKey("selectedHomeMenuId"));
    let getUnitHandsOnDetailsAPI;
    let wcId = this.contextService.getDataByString("#UnitInfo.WORKCENTER_ID");
    if(wcId == null) {
      wcId = 0;
    }
    let renderPage = [
      {
        "type": "verifonRenderSubprocess",
        "config": {
          "itemId": "#UnitInfo.ITEM_ID"
        }
      }
    ]
    getUnitHandsOnDetailsAPI = {
      "type": "microservice",
      "hookType": "afterInit",
      "config": {
        "microserviceId": "getUnitHandsOnDetails",
        "isLocal": false,
        "LocalService": "assets/Responses/mockHoldSubCode.json",
        "requestMethod": "get",
        "params": {
          "itemId": itemId,
          "locationId": "#userSelectedLocation",
          "clientId": "#userSelectedClient",
          "contractId": "#userSelectedContract",
          "processId": selectedHomeMenuId,
          "workCenterId": wcId,
          "appId": selectedHomeMenuId,
          "userName": "#loginUUID.username"
        }
      },
      "responseDependents": {
        "onSuccess": {
          "actions": [
            {
              "type": "context",
              "config": {
                "requestMethod": "add",
                "key": "getUnitHandsOnDetails",
                "data": "responseData"
              }
            },
            {
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#getUnitHandsOnDetails.0.action",
                "rhs": "takeover"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": this.getAddInfoCodeApiJson("", renderPage, selectedHomeMenuId)
                },
                "onFailure": {
                  "actions": [
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#getUnitHandsOnDetails.0.action",
                        "rhs": "release"
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": this.getReleaseApiJson("", this.getUnitINfo())
                        },
                        "onFailure": {
                          "actions": [
                            {
                              "type": "condition",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#getUnitHandsOnDetails.0.action",
                                "rhs": "time-in"
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": this.getTimeinApiJson("", this.getUnitINfo())
                                },
                                "onFailure": {
                                  "actions": [
                                    {
                                      "type": "condition",
                                      "config": {
                                        "operation": "isEqualTo",
                                        "lhs": "#getUnitHandsOnDetails.0.action",
                                        "rhs": "release + time-in"
                                      },
                                      "responseDependents": {
                                        "onSuccess": {
                                          "actions": this.getReleaseApiJson("", this.getTimeinApiJson("", this.getUnitINfo()))
                                        },
                                        "onFailure": {
                                          "actions": [
                                            {
                                              "type": "condition",
                                              "config": {
                                                "operation": "isEqualTo",
                                                "lhs": "#getUnitHandsOnDetails.0.action",
                                                "rhs": "none"
                                              },
                                              "responseDependents": {
                                                "onSuccess": {
                                                  "actions": renderPage
                                                },
                                                "onFailure": {
                                                  "actions": [
                                                    {
                                                      "type": "condition",
                                                      "config": {
                                                        "operation": "isEqualTo",
                                                        "lhs": "#getUnitHandsOnDetails.0.action",
                                                        "rhs": "storage-release"
                                                      },
                                                      "responseDependents": {
                                                        "onSuccess": {
                                                          "actions": this.getStroageRelease("", this.getUnitINfo()),
                                                        },
                                                        "onFailure": {
                                                          "actions": [
                                                            {
                                                              "type": "condition",
                                                              "config": {
                                                                "operation": "isEqualTo",
                                                                "lhs": "#getUnitHandsOnDetails.0.action",
                                                                "rhs": "storage-release+ time-in"
                                                              },
                                                              "responseDependents": {
                                                                "onSuccess": {
                                                                  "actions": this.getStroageRelease("", this.getTimeinApiJson("", this.getUnitINfo()))
                                                                },
                                                                "onFailure": {
                                                                  "actions": [
                                                                    {
                                                                      "type": "context",
                                                                      "config": {
                                                                        "requestMethod": "add",
                                                                        "key": "errorNoHandsonaction",
                                                                        "data": "Unknown Hand on Action Found"
                                                                      }
                                                                    },
                                                                    {
                                                                      "type": "updateComponent",
                                                                      "config": {
                                                                        "key": "errorTitleUUID",
                                                                        "properties": {
                                                                          "titleValue": "#errorNoHandsonaction",
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
              "type": "condition",
              "config": {
                "operation": "isEqualTo",
                "lhs": "#errorMsg",
                "rhs": "No Record Found"
              },
              "responseDependents": {
                "onSuccess": {
                  "actions": [
                    {
                      "type": "updateComponent",
                      "config": {
                        "key": "searchCriteriaErrorTitleUUID",
                        "properties": {
                          "titleValue": "#errorMsg",
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
        }
      }
    }
    actionService.handleAction(getUnitHandsOnDetailsAPI);
  }

  loadVerifoneWCScreen(action: any, instance: any, actionService) {
    let unitInfo = this.contextService.getDataByKey("UnitInfo");
    if (unitInfo && unitInfo["WORKCENTER"]) {
      let workcenter = unitInfo["WORKCENTER"].toLowerCase();
      let templateId = "";
      switch (workcenter) {
        case 'vmi':
          templateId = "verifone/verifone-VMI.json";
          this.renderWCScreen(templateId, action, instance, actionService);
          break;
        case 'reassy':
          templateId = "verifone/verifone-reassembly.json";
          this.renderWCScreen(templateId, action, instance, actionService);
          break;
        case 'soldering':
          templateId = "verifone/verifone-soldering.json";
          this.renderWCScreen(templateId, action, instance, actionService);
          break;
        case 'sw loading':
          templateId = "verifone/verifone-sw-loading.json";
          this.renderWCScreen(templateId, action, instance, actionService);
          break;
        case 'accessory test':
          templateId = "verifone/verifone-accessory-test.json";
          this.renderWCScreen(templateId, action, instance, actionService);
          break;
        case 'hold':
          templateId = "verifone/verifone-hold.json";
          this.renderWCScreen(templateId, action, instance, actionService);
          break;
        case 'veri_scrap':
          templateId = "verifone/verifone-veri-scrap.json";
          this.renderWCScreen(templateId, action, instance, actionService);
          break;
        case 'obe':
          templateId = "verifone/verifone-obe.json";
          this.renderWCScreen(templateId, action, instance, actionService);
          break;
      
      }
    }
  }

  renderWCScreen(templateId, action, instance, actionService) {
    let renderJson = {
      "type": "renderTemplate",
      "config": {
        "templateId": templateId,
        "mode": "local"
      }
    };
    actionService.handleAction(renderJson);
  }

  getVerifoneRmaNumber(action, instance, actionService) {
    let orderDetail = this.contextService.getDataByKey("verifoneOrderDetails");
    let receivingorderDetail = this.contextService.getDataByKey("verifoneReceivingOrderDetails");
    if (orderDetail && orderDetail[0]["clientRefrenceNo1"]) {
      let rmaNumberData = orderDetail[0]["clientRefrenceNo1"].split("-");
      let rmaNumber = rmaNumberData[0] + "-" + rmaNumberData[1];
      this.contextService.addToContext("orderRMANumber", rmaNumber);
    }

    if (receivingorderDetail && receivingorderDetail["CLIENT_REFERENCE_NO1"]) {
      let rmaNumberData = receivingorderDetail["CLIENT_REFERENCE_NO1"].split("-");
      let rmaNumber = rmaNumberData[0] + "-" + rmaNumberData[1];
      this.contextService.addToContext("orderRMANumber", rmaNumber);
    }
  }

  //Done
  getReleaseApiJson(unitInfo, onSuccess) {
    let release = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "releaseBCN",
          "isLocal": false,
          "LocalService": "assets/Responses/mockHoldSubCode.json",
          "requestMethod": "post",
          "body": {
            "location": "#UnitInfo.GEONAME",
            "workcenter": "#UnitInfo.WORKCENTER",
            "bcn": "#UnitInfo.ITEM_BCN",
            "userName": "#loginUUID.username",
            "password": "#loginUUID.password"
          },
          "toBeStringified": true
        },
        "responseDependents": {
          "onSuccess": {
            "actions": onSuccess
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
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#errorMsg",
                  "rhs": "No Record Found"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "searchCriteriaErrorTitleUUID",
                          "properties": {
                            "titleValue": "#errorMsg",
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
          }
        }
      }
    ]

    return release;
  }

  //Done
  getTimeinApiJson(unitInfo, onSuccess) {
    let timeIn = [
      {
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
            "actions": onSuccess
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
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#errorMsg",
                  "rhs": "No Record Found"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "searchCriteriaErrorTitleUUID",
                          "properties": {
                            "titleValue": "#errorMsg",
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
          }
        }
      }
    ]
    return timeIn
  }

  //Done
  getAddInfoCodeApiJson(unitInfo, onSuccess, selectedHomeMenuId) {
    let addInfoCode = [
      {
        "type": "microservice",
        "hookType": "afterInit",
        "config": {
          "microserviceId": "getHandsOnTakeOverCode",
          "isLocal": false,
          "LocalService": "assets/Responses/mockHoldSubCode.json",
          "requestMethod": "get",
          "params": {
            "locationId": "#userSelectedLocation",
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "processId": selectedHomeMenuId,
            "workCenterId": "#UnitInfo.WORKCENTER_ID",
            "appId": selectedHomeMenuId,
            "userName": "#loginUUID.username"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "getHandsOnTakeOverCodedata",
                  "data": "responseData"
                }
              },
              {
                "type": "addinfoCodesFF"
              },
              {
                "type": "microservice",
                "hookType": "afterInit",
                "config": {
                  "microserviceId": "addInfoCodes",
                  "isLocal": false,
                  "LocalService": "assets/Responses/mockHoldSubCode.json",
                  "requestMethod": "post",
                  "body": {
                    "workCenter": "#UnitInfo.WORKCENTER",
                    "geography": "#UnitInfo.GEONAME",
                    "bcn": "#UnitInfo.ITEM_BCN",
                    "part": "#UnitInfo.PART_NO",
                    "notes": "FE",
                    "infoCodes": "#infoCodesFFData",
                    "userName": "#loginUUID.username",
                    "password": "#loginUUID.password"
                  },
                  "toBeStringified": true
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": onSuccess
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
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#errorMsg",
                          "rhs": "No Record Found"
                        },
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "searchCriteriaErrorTitleUUID",
                                  "properties": {
                                    "titleValue": "#errorMsg",
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
                "type": "condition",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#errorMsg",
                  "rhs": "No Record Found"
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "updateComponent",
                        "config": {
                          "key": "searchCriteriaErrorTitleUUID",
                          "properties": {
                            "titleValue": "#errorMsg",
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
          }
        }
      }
    ]
    return addInfoCode;
  }

  getStroageRelease(unitInfo, onSuccess) {
    let timeIn = [
      {
        "eventSource": "click",
        "type": "closeAllDialogs"
      },
      {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "getHoldReleaseDetailService",
          "requestMethod": "get",
          "params": {
            "itemId": "#UnitInfo.ITEM_ID",
            "operationType": "RELEASE",
            "userName": "#loginUUID.username"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "holdReleaseApiData",
                  "data": "responseData"
                }                            
              },
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "isReleased",
                  "data": true
                }                            
              },
              {
                "type": "condition",
                "eventSource": "click",
                "config": {
                  "operation": "isEqualTo",
                  "lhs": 1,
                  "rhs": 1
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": onSuccess
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
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "errorDisp",
                  "data": "responseData"
                }
              },
              {
                "type": "condition",
                "eventSource": "click",
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
                        "eventSource": "click",
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
    return timeIn
  }

  getUnitINfo() {
    let unitinfo = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "getUnitInfo",
          "requestMethod": "get",
          "params": {
            "unitIdentificationValue": "#getUnitHandsOnDetails.0.itemBcn",
            "identificatorType": "BCN",
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
                "type": "condition", //condition to check if unit released
                "config": {
                  "operation": "isEqualTo",
                  "lhs": "#isReleased",
                  "rhs": true
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [
                      {
                        "type": "microservice",
                        "config": {
                          "microserviceId": "moveinventory",
                          "requestMethod": "post",
                          "isLocal": false,
                          "LocalService": "assets/Responses/mockBGA.json",
                          "body": {
                            "apiUsageClientName": "#UnitInfo.CLIENTNAME",
                            "apiUsageLocationName": "#UnitInfo.GEONAME",
                            "callSource": "FrontEnd",
                            "ip": "::1",
                            "items": {
                              "addtionalDetails": {
                                "storageHoldCode": "#holdReleaseApiData.storateHoldCode",
                                "storageHoldSubCode": "#holdReleaseApiData.storateHoldSubCode"
                              },
                              "destinationLocation": {
                                "bin": "Default",
                                "geography": "#UnitInfo.GEONAME",
                                "stockingLocation": "#holdReleaseApiData.destStkLocationName",
                                "warehouse": "#holdReleaseApiData.wareHouseName"
                              },
                              "item": [
                                {
                                  "bcn": "#UnitInfo.ITEM_BCN",
                                  "owner": "#UnitInfo.CLIENTNAME",
                                  "partNo": "#UnitInfo.PART_NO",
                                  "quantity": "1",
                                  "serialNo": "#UnitInfo.SERIAL_NO",
                                  "condition": "Defective"
                                }
                              ],
                              "sourceLocation": {
                                "bin": "#holdReleaseApiData.bin",
                                "geography": "#UnitInfo.GEONAME",
                                "stockingLocation": "#holdReleaseApiData.srcStkLocationName",
                                "warehouse": "#holdReleaseApiData.wareHouseName"
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
                                "type": "microservice",
                                "config": {
                                  "microserviceId": "releasefromhold",
                                  "requestMethod": "post",
                                  "isLocal": false,
                                  "LocalService": "assets/Responses/mockBGA.json",
                                  "body": {
                                    "unitBCN": "#UnitInfo.ITEM_BCN",
                                    "releaseNotes": "RELEASE",
                                    "userPwd": {
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
                                        "type": "commonVerifoneActions",
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

                      }
                    ]
                  },
                  "onFailure": {
                    "actions": [
                      {
                        "type": "verifonRenderSubprocess",
                        "config": {
                          "itemId": "#UnitInfo.ITEM_ID"
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
    return unitinfo
  }

  renderVerifoneWCHeaderData(action, instance, actionService) { 
    let processJson = [
      {
        "type": "microservice",
        "config": {
          "microserviceId": "getROFF",
          "requestMethod": "get",
          "isLocal": false,
          "LocalService": "assets/Responses/getSubprocessTest.json",
          "params": {
            "clientId": "#userSelectedClient",
            "contractId": "#userSelectedContract",
            "locationId": "#userSelectedLocation",
            "referenceOrderId": "#verifoneOrderDetails.0.refrenceOrderId",
            "roHeaderFfIdes": "#getReferenceDataKeys.subProcess.VERIFONE.roffID",
            "pUserName": "#loginUUID.username"
          }
        },
        "responseDependents": {
          "onSuccess": {
            "actions": [
              {
                "type": "context",
                "config": {
                  "requestMethod": "add",
                  "key": "ROFFData",
                  "data": "responseData"
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
              },
              {
                "type": "loadVerifoneWCScreen"
              }
            ]
          },
          "onFailure": {
            "actions": [

            ]
          }
        }
      }
    ];
    processJson && processJson.forEach((element) => {
      actionService.handleAction(element, instance)
    })
  }


}
