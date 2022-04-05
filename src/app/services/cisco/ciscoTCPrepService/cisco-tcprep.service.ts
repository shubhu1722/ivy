import { Injectable } from '@angular/core';
import { ContextService } from '../../commonServices/contextService/context.service';

@Injectable({
  providedIn: 'root'
})
export class CiscoTCPrepService {
  ecocurrenttaskdata: any;
  daignosiscurrenttaskdata: any;
  frucurrenttaskdata: any;
  constructor(
    private contextService: ContextService
  ) { }

  actions: any;
  eco: any;
  fru: any
  daig: any
  AvailableQty: any
  createECOpanels(action: any, instance: any, actionService: any) {
    let buttontxt = "Complete";
    let ecopanelsdata = this.contextService.getDataByString(action.config.key);
    for (this.eco = 0; this.eco < ecopanelsdata.length; this.eco++) {
      let ecoCount = this.eco + 1;
      if (ecopanelsdata[this.eco] && ecopanelsdata[this.eco].activityType == "ECO") {
        this.ecocurrenttaskdata = ecopanelsdata[this.eco]
        actionService.handleAction({
          "type": "deleteComponent",
          "config": {
            "key": "ecoTaskUUID" + ecoCount
          }
        }, instance);

        this.actions = {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectionone",
            "data": {
              "ctype": "taskPanel",
              "splitView": true,
              "header": {
                "title": "Add Part - " + this.ecocurrenttaskdata.part,
                "svgIcon": "replace",
                "css": "color:black",
                "status": "ECO",
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
              },
              "expanded": "false",
              "hideToggle": "true",
              "bodyclass": "splitView",
              "panelClass": "",
              "leftDivclass": "width:50%;",
              "rightDivclass": "width:50%",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "uuid": "ecoTaskUUID" + ecoCount,
              "visibility": false,
              "hooks": [
                {
                  "type": "microservice",
                  "hookType": "afterInit",
                  "config": {
                    "microserviceId": "getAvailableQuantities",
                    "isLocal": false,
                    "LocalService": "assets/Responses/tcprepdummydata.json",
                    "requestMethod": "get",
                    "params": {
                      "componentPartNo": this.ecocurrenttaskdata.componentPartNo,
                      "wareHouseId": "#UnitInfo.WAREHOUSE_ID",
                      "conditionId": "1,3",
                      "locationId": "#userSelectedLocation"
                    }
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "getAvaliablequantitiesdataECO" + ecoCount,
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "stringOperation",
                          "config": {
                            "key": "ciscoDebugAvailQtyResECO" + ecoCount,
                            "lstr": "#getAvaliablequantitiesdataECO" + ecoCount,
                            "rstr": "Available",
                            "operation": "concat",
                            "concatSymbol": " "
                          }
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "ciscoDebugStockQty" + ecoCount,
                            "updateParent": true,
                            "properties": {
                              "text": "#ciscoDebugAvailQtyResECO" + ecoCount,
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
                }
              ],
              "validations": [],
              "actions": [
                {
                  "type": "deleteComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "#currentTaskUUID"
                  }
                },
                {
                  "type": "context",
                  "eventSource": "click",
                  "config": {
                    "requestMethod": "add",
                    "key": "currentTaskUUID",
                    "data": ""
                  }
                },
                {
                  "type": "updateComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "replaceIconUUID",
                    "properties": {
                      "disabled": false
                    }
                  }
                },
                {
                  "type": "updateComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "manualIconUUID",
                    "properties": {
                      "disabled": false
                    }
                  }
                }
              ],
              "items": this._returnLeftSideItemsEcopanels(action, instance, actionService),
              "rightItems": this._returnRightSideItemsEcopanels(action, instance, actionService, ecoCount),
              "footer": [
                {
                  "ctype": "checkbox",
                  "uuid": "ecoTaskNoReplaceUUID" + ecoCount,
                  "name": "ecoTaskUUIDCloseEco",
                  "hooks": [],
                  "validations": [],
                  "submitable": true,
                  "label": "Not required to Close ECO",
                  "labelPosition": "after",
                  "checkboxContainer": "mac-checkbox",
                  "actions": [
                    {
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "ecoTaskUUIDCloseEcodata" + ecoCount,
                        "data": "formData"
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#ecoTaskUUIDCloseEcodata" + ecoCount + ".ecoTaskUUIDCloseEco",
                        "rhs": true
                      },
                      "eventSource": "click",
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ECOsoftwareCompleteUUID" + ecoCount,
                                "properties": {
                                  "text": buttontxt
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ECOsoftwareCompleteUUID" + ecoCount,
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
                                "key": "ECOsoftwareCompleteUUID" + ecoCount,
                                "properties": {
                                  "text": "Keep in Wishlist"
                                }
                              },
                              "eventSource": "click"
                            },
                          ]
                        }
                      }
                    }
                  ]
                },
                {
                  "ctype": "spacer",
                  "uuid": "emptySpaceUUID",
                  "class": "empty-space"
                },
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Keep in Wishlist",
                  "uuid": "ECOsoftwareCompleteUUID" + ecoCount,
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": this.checkbtntext(action, instance, actionService, ecoCount)
                }
              ]
            }
          },
          "eventSource": "click"
        }
        //console.log("ecotasks = ",actions);
        actionService.handleAction(this.actions, instance);

      }

    }
  }


  checkbtntext(action: any, instance: any, actionService: any, ecoCount: any) {
    action.config.action;
    console.log(ecoCount);
    let pid = this.contextService.getDataByString("#UnitInfo.PART_NO");
    let onCompleteECOtaskActions = [];
    onCompleteECOtaskActions.push(
      {
        "type": "condition",
        "eventSource": "click",
        "config": {
          "operation": "isEqualTo",
          "lhs": "#ecoTaskUUIDCloseEcodata" + ecoCount + ".ecoTaskUUIDCloseEco",
          "rhs": true
        },
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
                "type": "executetcDefectOperation",
                "config": {
                  "defectCurrentCode": this.ecocurrenttaskdata.defect,
                  "defectRecords": "#getCiscoTCDefectRecords",
                  "configDebugWLData": "#getwhishlistItemsdata",
                  "currentActionCode": "OPEN-FIT",
                  "defectList": "getCiscoTCDefectRecords",
                  "key": "defectOperation"
                },
                "eventSource": "click"
              },
              {
                "type": "getSerialNoFromAssemblyCode",
                "config": {
                  "key": "tncSerialNumber",
                  "pcbList": "#tncPCBRes",
                  "assemblyCode": this.ecocurrenttaskdata.assemblyCode
                },
                "eventSource": "click"
              },
              {
                "type": "ciscoUnissueAndUndoFAForEcoTask",
                "eventSource": "click",
                "config": {
                  "defectCurrentCode": this.ecocurrenttaskdata.defect,
                  "currentActionCode": "OPEN-FIT",
                  "wishlist": "#getwhishlistItemsdata",
                  "afterAction": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "performFA",
                        "requestMethod": "post",
                        "body": {
                          "updateFailureAnalysisRequest": {
                            "actionCodeChangeList": {
                              "actionCodeChange": [{
                                "actionCode": "CLOSE",
                                "operation": "Add",
                                "ecoCode": {
                                  "value": pid + "--" + this.ecocurrenttaskdata.defect
                                }
                              }]
                            },
                            "assemblyCodeChangeList": {
                              "assemblyCodeChange": [
                                {
                                  "assemblyCode": this.ecocurrenttaskdata.assemblyCode,
                                  "operation": "Update",
                                  "serialNumber": "#tncSerialNumber"
                                }
                              ]
                            },
                            "ecoCodeChangeList": {
                              "ecoCodeChange": [{
                                "ecoCode": pid + "--" + this.ecocurrenttaskdata.defect,
                                "operation": "Update"
                              }]
                            },
                            "bcn": "#UnitInfo.ITEM_BCN"
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
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ecoTaskUUID" + ecoCount,
                                "properties": {
                                  "expanded": false,
                                  "disabled": false,
                                  "header": {
                                    "title": "Add Part - " + this.ecocurrenttaskdata.part,
                                    "svgIcon": "replace",
                                    "css": "color:black",
                                    "status": "ECO",
                                    "statusIcon": "check_circle",
                                    "statusClass": "complete-status",
                                    "class": "mat-expansion-panel-header-title heading2"
                                  }
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ecoTaskNoReplaceUUID" + ecoCount,
                                "properties": {
                                  "disabled": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ECOsoftwareCompleteUUID" + ecoCount,
                                "properties": {
                                  "disabled": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "microservice",
                              "config": {
                                "microserviceId": "getRecordedDefects",
                                "isLocal": false,
                                "LocalService": "assets/Responses/mockBGA.json",
                                "requestMethod": "get",
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
                                        "key": "getCiscoTCDefectRecords",
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
                              "type": "condition",
                              "eventSource": "click",
                              "config": {
                                "operation": "isEqualTo",
                                "lhs": "#isHouLocation",
                                "rhs": true
                              },
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "deleteComponent",
                                      "eventSource": "click",
                                      "config": {
                                        "key": "ecoTaskUUID" + ecoCount,
                                      }
                                    }
                                  ]
                                },
                                "onFailure":{
                                  "actions": []
                                }
                              }
                            },                            
                            {
                              "type": "microservice",
                              "eventSource": "click",
                              "config": {
                                "microserviceId": "getWhistlistItems",
                                "isLocal": false,
                                "LocalService": "assets/Responses/tcprepdummydata.json",
                                "requestMethod": "get",
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
                                        "key": "getwhishlistItemsdata",
                                        "data": "responseData"
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "whislistItemUpdateTC",
                                      "config": {
                                        "key": "#getwhishlistItemsdata"
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
                                      "type": "whislistItemUpdateTC",
                                      "config": {
                                        "key": "#errorDisp"
                                      },
                                      "eventSource": "click"
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
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "wishListButtonUUID",
                                        "properties": {
                                          "text": "Wish List (0)"
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
                                "key": "ecoTaskUUID" + ecoCount,
                                "properties": {
                                  "expanded": false,
                                  "disabled": false,
                                  "header": {
                                    "title": "Add Part - " + this.ecocurrenttaskdata.part,
                                    "svgIcon": "replace",
                                    "css": "color:black",
                                    "status": "ECO",
                                    "statusIcon": "check_circle",
                                    "statusClass": "complete-status",
                                    "class": "mat-expansion-panel-header-title heading2"
                                  }
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ecoTaskNoReplaceUUID" + ecoCount,
                                "properties": {
                                  "disabled": true,
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ECOsoftwareCompleteUUID" + ecoCount,
                                "properties": {
                                  "disabled": true
                                }
                              },
                              "eventSource": "click"
                            },
                          ]
                        }
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
                "type": "updateComponent",
                "config": {
                  "key": "ecoTaskUUID" + ecoCount,
                  "properties": {
                    "expanded": false,
                    "disabled": false,
                    "header": {
                      "title": "Add Part - " + this.ecocurrenttaskdata.part,
                      "svgIcon": "replace",
                      "css": "color:black",
                      "status": "ECO",
                      "statusIcon": "check_circle",
                      "statusClass": "complete-status",
                      "class": "mat-expansion-panel-header-title heading2"
                    }
                  }
                },
                "eventSource": "click"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "ecoTaskNoReplaceUUID" + ecoCount,
                  "properties": {
                    "disabled": true
                  }
                },
                "eventSource": "click"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "ECOsoftwareCompleteUUID" + ecoCount,
                  "properties": {
                    "disabled": true
                  }
                },
                "eventSource": "click"
              },
            ]
          }
        }
      }
    );
    return onCompleteECOtaskActions;
  }
  // For Accessories Task panel
  createDaignosispanels(action: any, instance: any, actionService: any) {
    let daignosispanelsdata = this.contextService.getDataByString(action.config.key);
    for (this.daig = 0; this.daig < daignosispanelsdata.length; this.daig++) {
      let count = this.daig + 1;
      if (daignosispanelsdata[this.daig]) {
        this.daignosiscurrenttaskdata = daignosispanelsdata[this.daig]
        actionService.handleAction({
          "type": "deleteComponent",
          "config": {
            "key": "daignosisTaskUUID" + count
          }
        }, instance);

        let data = {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data": {
              "ctype": "taskPanel",
              "splitView": true,
              "header": {
                "title": "Add Part - " + this.daignosiscurrenttaskdata.part,
                "svgIcon": "replace",
                "css": "color:black",
                "status": "Daignosis",
                "statusIcon": "info_outline",
                "statusClass": "eco-icon"
              },
              "panelClass": "",
              "leftDivclass": "width:50%;",
              "rightDivclass": "width:50%",
              "expanded": "false",
              "hideToggle": "true",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "uuid": "daignosisTaskUUID" + count,
              "visibility": false,
              "hooks": [
                {
                  "type": "microservice",
                  "hookType": "afterInit",
                  "config": {
                    "microserviceId": "getAvailableQuantities",
                    "isLocal": false,
                    "LocalService": "assets/Responses/tcprepdummydata.json",
                    "requestMethod": "get",
                    "params": {
                      "componentPartNo": this.daignosiscurrenttaskdata.compPartNo,
                      "wareHouseId": "#UnitInfo.WAREHOUSE_ID",
                      "conditionId": "1,3",
                      "locationId": "#userSelectedLocation"
                    }
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "getAvaliablequantitiesdataDaig" + count,
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "stringOperation",
                          "config": {
                            "key": "ciscoDebugAvailQtyResDaig" + count,
                            "lstr": "#getAvaliablequantitiesdataDaig" + count,
                            "rstr": "Available",
                            "operation": "concat",
                            "concatSymbol": " "
                          }
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "ciscoDebugStockQty" + count,
                            "updateParent": true,
                            "properties": {
                              "text": "#ciscoDebugAvailQtyResDaig" + count,
                            }
                          },
                          "hookType": "afterInit"
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
                }
              ],
              "validations": [],
              "actions": [
                {
                  "type": "deleteComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "#currentTaskUUID"
                  }
                },
                {
                  "type": "context",
                  "eventSource": "click",
                  "config": {
                    "requestMethod": "add",
                    "key": "currentTaskUUID",
                    "data": ""
                  }
                },
                {
                  "type": "updateComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "replaceIconUUID",
                    "properties": {
                      "disabled": false
                    }
                  }
                },
                {
                  "type": "updateComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "manualIconUUID",
                    "properties": {
                      "disabled": false
                    }
                  }
                }
              ],
              "items": this._returnLeftSideItemsDaignosispanels(action, instance, actionService),
              "rightItems": this._returnRightSideItemsDaignosispanels(action, instance, actionService, count),
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Complete",
                  "uuid": "DaignosissoftwareCompleteUUID" + count,
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
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
                      "type": "executeTnCDefectOperations",
                      "config": {
                        "defectCurrentCode": "COSMETIC_DAMAGE",
                        "defectRecords": "#getCiscoTCDefectRecords",
                        "defectList": "getCiscoTCDefectRecords",
                        "configDebugWLData": "#getwhishlistItemsdata",
                        "currentActionCode": "OPEN-FIT",
                        "key": "defectOperation",
                        "taskType": "ACC"
                      },
                      "eventSource": "click"
                    },
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "performFA",
                        "requestMethod": "post",
                        "body": {
                          "updateFailureAnalysisRequest": {
                            "actionCodeChangeList": {
                              "actionCodeChange": [{
                                "actionCode": "OPEN-FIT",
                                "operation": "#defectOperation.actionCode",
                                "defectCode": {
                                  "value": "COSMETIC_DAMAGE"
                                  //this.daignosiscurrenttaskdata.defect
                                },
                                "occurrence": 1
                              }]
                            },
                            "defectCodeChangeList": {
                              "defectCodeChange": [{
                                "defectCode": "COSMETIC_DAMAGE",
                                // this.daignosiscurrenttaskdata.defect,
                                "operation": "#defectOperation.defectCode"
                              }]
                            },
                            "bcn": "#UnitInfo.ITEM_BCN"
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
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "microservice",
                              "config": {
                                "microserviceId": "performIssueParts",
                                "requestMethod": "post",
                                "isLocal": false,
                                "LocalService": "assets/Responses/getHPFAHistory.json",
                                "body": {
                                  "issuePartsRequest": {
                                    "bcn": "#UnitInfo.ITEM_BCN",
                                    "actionCodeChange": {
                                      "operation": "Add",
                                      "actionCode": "OPEN-FIT",
                                      "defectCode": {
                                        "value": "COSMETIC_DAMAGE",
                                      },
                                      "occurrence": 1
                                    },
                                    "nonInventoryPartList": {
                                      "nonInventoryPart": [{
                                        "part": this.daignosiscurrenttaskdata.compPartNo,
                                        "quantity": this.daignosiscurrenttaskdata.compQuantity,
                                        "componentLocationDescription": "#getCompPartsdata.location",
                                        "flexFieldList": {
                                          "flexField": [
                                            {
                                              "name": "ANALYSIS",
                                              "value": "SN NOT_APPLICABLE COMPONENT _ DAMAGED"
                                            },
                                            {
                                              "name": "PCB_SN",
                                              "value": "#UnitInfo.SERIAL_NO"
                                            }
                                          ]
                                        }
                                      }
                                      ]
                                    }
                                  },
                                  "userPwd": {
                                    "username": "#userAccountInfo.PersonalDetails.USERID",
                                    "password": "#loginUUID.password"
                                  },
                                  "ip": "::1",
                                  "callSource": "FrontEnd",
                                  "apiUsage_LocationName": "#UnitInfo.GEONAME",
                                  "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                                },
                                "toBeStringified": true
                              },
                              "eventSource": "click",
                              "responseDependents": {
                                "onSuccess": {
                                  "actions": [
                                    {
                                      "type": "microservice",
                                      "eventSource": "click",
                                      "config": {
                                        "microserviceId": "getWhistlistItems",
                                        "isLocal": false,
                                        "LocalService": "assets/Responses/tcprepdummydata.json",
                                        "requestMethod": "get",
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
                                                "key": "getwhishlistItemsdata",
                                                "data": "responseData"
                                              },
                                              "eventSource": "click"
                                            },
                                            {
                                              "type": "whislistItemUpdateTC",
                                              "config": {
                                                "key": "#getwhishlistItemsdata"
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
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "daignosisTaskUUID" + count,
                                        "properties": {
                                          "expanded": false,
                                          "disabled": false,
                                          "header": {
                                            "title": "Add Part - " + this.daignosiscurrenttaskdata.part,
                                            "svgIcon": "replace",
                                            "css": "color:black",
                                            "status": "Daignosis",
                                            "statusIcon": "check_circle",
                                            "statusClass": "complete-status",
                                            "class": "mat-expansion-panel-header-title heading2"
                                          }
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "DaignosissoftwareCompleteUUID" + count,
                                        "properties": {
                                          "disabled": true
                                        }
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "microservice",
                                      "config": {
                                        "microserviceId": "getRecordedDefects",
                                        "isLocal": false,
                                        "LocalService": "assets/Responses/mockBGA.json",
                                        "requestMethod": "get",
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
                                                "key": "getCiscoTCDefectRecords",
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
                            }]
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
                    }
                  ]
                }
              ]
            }
          },
          "eventSource": "click"
        }
        actionService.handleAction(data, instance);
      }

    }
  }

  createFRUpanels(action: any, instance: any, actionService: any) {
    var FRUpanelsdata = this.contextService.getDataByString(action.config.key);
    for (this.fru = 0; this.fru < FRUpanelsdata.length; this.fru++) {
      // let this.fru = this.fru + 1;
      if (FRUpanelsdata[this.fru] && FRUpanelsdata[this.fru].activityType == "FRU" || FRUpanelsdata[this.fru].activityType == "ACC") {
        this.frucurrenttaskdata = FRUpanelsdata[this.fru]
        actionService.handleAction({
          "type": "deleteComponent",
          "config": {
            "key": "FRUTaskUUID" + this.fru
          }
        }, instance);

        let frudata = {
          "type": "createComponent",
          "config": {
            "targetId": "pageUUID",
            "containerId": "prebodysectiontwo",
            "data": {
              "ctype": "taskPanel",
              "splitView": true,
              "header": {
                "title": "Add Part - " + this.frucurrenttaskdata.part,
                "svgIcon": "replace",
                "css": "color:black",
                "status": "Daignosis",
                "statusIcon": "check_circle",
                "statusClass": "complete-status",
              },
              "panelClass": "",
              "leftDivclass": "width:50%;",
              "rightDivclass": "width:50%",
              "expanded": "false",
              "hideToggle": "true",
              "taskPanelHeaderClass": "task-panel-header-color-light-grey",
              "uuid": "FRUTaskUUID" + this.fru,
              "visibility": false,
              "hooks": [
                {
                  "type": "microservice",
                  "hookType": "afterInit",
                  "config": {
                    "microserviceId": "getAvailableQuantities",
                    "isLocal": false,
                    "LocalService": "assets/Responses/tcprepdummydata.json",
                    "requestMethod": "get",
                    "params": {
                      "componentPartNo": this.frucurrenttaskdata.componentPartNo,
                      "wareHouseId": "#UnitInfo.WAREHOUSE_ID",
                      "conditionId": "1,3",
                      "locationId": "#userSelectedLocation"
                    }
                  },
                  "responseDependents": {
                    "onSuccess": {
                      "actions": [
                        {
                          "type": "context",
                          "config": {
                            "requestMethod": "add",
                            "key": "getAvaliablequantitiesdataFRU" + this.fru,
                            "data": "responseData"
                          }
                        },
                        {
                          "type": "stringOperation",
                          "config": {
                            "key": "ciscoDebugAvailQtyResFRU" + this.fru,
                            "lstr": "#getAvaliablequantitiesdataFRU" + this.fru,
                            "rstr": "Available",
                            "operation": "concat",
                            "concatSymbol": " "
                          },
                          "hookType": "afterInit"
                        },
                        {
                          "type": "updateComponent",
                          "config": {
                            "key": "ciscoDebugStockQty" + this.fru,
                            "updateParent": true,
                            "properties": {
                              "text": "#ciscoDebugAvailQtyResFRU" + this.fru
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
                }
              ],
              "validations": [],
              "actions": [
                {
                  "type": "deleteComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "#currentTaskUUID"
                  }
                },
                {
                  "type": "context",
                  "eventSource": "click",
                  "config": {
                    "requestMethod": "add",
                    "key": "currentTaskUUID",
                    "data": ""
                  }
                },
                {
                  "type": "updateComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "replaceIconUUID",
                    "properties": {
                      "disabled": false
                    }
                  }
                },
                {
                  "type": "updateComponent",
                  "eventSource": "click",
                  "config": {
                    "key": "manualIconUUID",
                    "properties": {
                      "disabled": false
                    }
                  }
                }
              ],
              "items": this._returnLeftSideItemsFRUpanels(action, instance, actionService),
              "rightItems": this._returnRightSideItemsFRUpanels(action, instance, actionService, this.fru),
              "footer": [
                {
                  "ctype": "button",
                  "color": "primary",
                  "text": "Keep in Wishlist",
                  "uuid": "frusoftwareCompleteUUID" + this.fru,
                  "parentuuid": "softwareTaskUUID",
                  "visibility": true,
                  "disabled": false,
                  "type": "submit",
                  "tooltip": "",
                  "hooks": [],
                  "validations": [],
                  "actions": this.onCompleteFRUTask(this.fru)
                }
              ]
            }
          },
          "eventSource": "click"
        }
        actionService.handleAction(frudata, instance);
      }

    }
  }

  executeActions(actions, instance, actionService) {
    actions && actions.forEach((currentAction) => {
      actionService.handleAction(currentAction, instance);
    });
  }

  //add quantity add and subtract methods
  addQuantitybyValue() {
    let updatedqtyvalue;
    let qtyvalue = this.contextService.getDataByString("#userSelectedPartDescription.qty");
    updatedqtyvalue = this.contextService.getDataByString("#ciscoTCaddaprtqtyincriment");
    if (updatedqtyvalue != "1" && updatedqtyvalue != "") {
      ++updatedqtyvalue;
      this.contextService.addToContext("ciscoTCaddaprtqtyincriment", updatedqtyvalue);
    }
    else {
      ++qtyvalue;
      this.contextService.addToContext("ciscoTCaddaprtqtyincriment", qtyvalue);
    }
  }
  subQuantityVlaue() {
    let updatedqtyvalue;
    //let qtyvalue = this.contextService.getDataByString("#userSelectedPartDescription.qty");
    updatedqtyvalue = this.contextService.getDataByString("#ciscoTCaddaprtqtyincriment");
    if (updatedqtyvalue >= 2) {
      --updatedqtyvalue;
      this.contextService.addToContext("ciscoTCaddaprtqtyincriment", updatedqtyvalue);
    } else {
      updatedqtyvalue = 1;
      this.contextService.addToContext("ciscoTCaddaprtqtyincriment", updatedqtyvalue);
    }
  }
  //left and right items for Eco dynamic panels 
  //start
  _returnRightSideItemsEcopanels(action: any, instance: any, actionService: any, ecoCount: any) {
    let rightSideItems = [];
    let AvailableQuantity = this.contextService.getDataByString("#ciscoDebugAvailQtyResECO" + ecoCount)
    let qty = this.ecocurrenttaskdata.qty;
    // if (!isNewPanel) {
    //   qty = action.config.taskPanelData.qty;
    // }
    rightSideItems = [
      {
        "ctype": "flexFields",
        "uuid": "ciscoAPDescriptiontextFlexUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Description",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "uuid": "ciscoT&CDescriptionLabelValueUUID",
            "text": this.ecocurrenttaskdata.description,
            "labelClass": "greyish-black",
            "labelPosition": "left"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "ciscoAPDescriptiontextFlexUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "REW_INSTR",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "uuid": "ciscoTCrenewInstrUUID",
            "text": this.ecocurrenttaskdata.rewInstr,
            "labelClass": "greyish-black",
            "labelPosition": "left"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "containerId": "expansionPanelContentFirstHalf",
        "uuid": "ciscoFailCodeTitleUUID",
        "flexClass": "label-container-radio-group-parent",
        "items": this._getDataForTable(action, actionService, qty, AvailableQuantity, ecoCount)
      }
    ];
    //}
    return rightSideItems;
  }

  _returnLeftSideItemsEcopanels(action: any, instance: any, actionService: any) {
    let leftSideItems = [];
    // if (action.config.processType !== undefined &&
    //   (action.config.processType == "replace" ||
    //     action.config.processType == "fit")) {
    leftSideItems = [
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Sub Assm",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": this.ecocurrenttaskdata.subAssm,
            "labelClass": "greyish-black"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Part",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": this.ecocurrenttaskdata.part,
            "labelClass": "greyish-black"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Reason",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": "Remanufacturing",
            "labelClass": "greyish-black"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Defect",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": this.ecocurrenttaskdata.defect,
            "labelClass": "greyish-black"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "FA",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": "SN NOT_APPLICABLE COMPONENT _DAMAGED",
            "labelClass": "greyish-black"
          }
        ]
      }
    ];
    //}
    return leftSideItems;
  }
  //end

  //left and right items for Daignosis dynamic panels 
  //start
  _returnRightSideItemsDaignosispanels(action: any, instance: any, actionService: any, uniqID: any) {
    let rightSideItems = [];
    let AvailableQuantity = this.contextService.getDataByString("#ciscoDebugAvailQtyResDaig" + uniqID);
    let qty;
    qty = this.daignosiscurrenttaskdata.compQuantity;
    rightSideItems = [
      {
        "ctype": "flexFields",
        "containerId": "expansionPanelContentFirstHalf",
        "uuid": "ciscoFailCodeTitleUUID",
        "flexClass": "label-container-radio-group-parent",
        "items": this._getDataForTable(action, actionService, qty, AvailableQuantity, uniqID)
      }
    ];
    //}
    return rightSideItems;
  }

  _returnLeftSideItemsDaignosispanels(action: any, instance: any, actionService: any) {
    let leftSideItems = [];
    // if (action.config.processType !== undefined &&
    //   (action.config.processType == "replace" ||
    //     action.config.processType == "fit")) {
    leftSideItems = [
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Sub Assm",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": this.daignosiscurrenttaskdata.subAssm,
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Part",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": this.daignosiscurrenttaskdata.part,
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Reason",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": "Remanufacturing",
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Defect",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": "COSMETIC_DAMAGE",
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "FA",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": "SN NOT_APPLICABLE COMPONENT _DAMAGED",
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      }
    ];
    //}
    return leftSideItems;
  }
  //end  

  //left and right items for FRU dynamic panels 
  //start
  _returnRightSideItemsFRUpanels(action: any, instance: any, actionService: any, fru: any) {
    let rightSideItems = [];
    let AvailableQuantity = this.contextService.getDataByString("#ciscoDebugAvailQtyResFRU" + this.fru);
    let qty;
    qty = this.frucurrenttaskdata.qty;
    rightSideItems = [
      {
        "ctype": "flexFields",
        "uuid": "ciscoAPDescriptiontextFlexUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Description",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "uuid": "ciscoT&CDescriptionLabelValueUUID",
            "text": this.frucurrenttaskdata.description,
            "labelClass": "greyish-black",
            "labelPosition": "left"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "ciscoAPDescriptiontextFlexUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "REW_INSTR",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "uuid": "ciscoTCrenewInstrUUID",
            "text": this.frucurrenttaskdata.rewInstr,
            "labelClass": "greyish-black",
            "labelPosition": "left"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "containerId": "expansionPanelContentFirstHalf",
        "uuid": "ciscoFailCodeTitleUUID",
        "flexClass": "label-container-radio-group-parent",
        "items": this._getDataForTable(action, actionService, qty, AvailableQuantity, this.fru)
      }
    ];
    //}
    return rightSideItems;
  }

  _returnLeftSideItemsFRUpanels(action: any, instance: any, actionService: any) {
    let leftSideItems = [];
    // if (action.config.processType !== undefined &&
    //   (action.config.processType == "replace" ||
    //     action.config.processType == "fit")) {
    leftSideItems = [
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Sub Assm",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": this.frucurrenttaskdata.subAssm,
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Part",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": this.frucurrenttaskdata.part,
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Reason",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": "Remanufacturing",
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Defect",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": this.frucurrenttaskdata.defect,
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "FA",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "text": this.frucurrenttaskdata.analysis,
            "labelClass": "greyish-black",
            "labelPosition": "left",
          }
        ]
      }
    ];
    //}
    return leftSideItems;
  }
  //end  
  _getDataForTable(action, actionService, qty, AvailableQuantity, uniqID) {
    let tableSourceList = [];
    let items = [
      {
        "value": "Desk",
        "icon": "shopping_cart",
        "text": "Warehouse",
        "stock": "3"
      }
    ];

    items && items.forEach((item) => {
      tableSourceList.push({
        "ctype": "flexFields",
        "uuid": "ciscoQtyTableUUID" + uniqID,
        "flexClass": "label-container-radio-group-grid-3",
        "items": [
          {
            "ctype": "label",
            "text": "Source",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "label",
            "text": "Qty",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "label",
            "text": "Stock",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "iconText",
            "uuid": "sourceIconUUID" + uniqID,
            "icon": item.icon,
            "text": item.text,
            "iconPosition": "after",
            "textClass": "body greyish-black",
            "inLine": true,
            "iconClass": "incomplete-status margin-bottom-5 header-icon"
          },
          {
            "ctype": "label",
            "uuid": "ciscoQtyUUID" + uniqID,
            "text": qty != null ? qty.toString() : "0",
            "labelClass": "greyish-black"
          },
          {
            "ctype": "label",
            "uuid": "ciscoDebugStockQty" + uniqID,
            "parentUUID": "ciscoQtyTableUUID" + uniqID,
            "text": AvailableQuantity && AvailableQuantity != "" && AvailableQuantity != null ? AvailableQuantity : "0 Available",
            "labelClass": "cisco-stock"
          }
        ]
      });
    });

    return tableSourceList;
  }
  //data concatination for add part task 
  dataConcatination(action: any, instance: any, actionService: any) {
    let concatArray = [];
    let concatStringValue = {}
    let OriginalSubAssmdata = this.contextService.getDataByString('#getSubAssmblydata');
    OriginalSubAssmdata && OriginalSubAssmdata.forEach(element => {
      concatStringValue = element;
      concatStringValue["SubAsmmblyConcatString"] = element.assemblyCode + " - " + element.compPartNumber;
      concatArray.push(concatStringValue);
    });
    this.contextService.addToContext("concatSubAsmblyValue", concatArray);
    actionService.handleAction(concatArray, instance);
  }
  //get FA flex images based on api response and render it 
  getFAFlexfieldimages(action: any, instance: any, actionService: any) {
    let faimages;
    let faFlexvalue;
    let flexarr = [];
    let faimagesdata = this.contextService.getDataByString('#getCompCategoriesdata');
    faimagesdata && faimagesdata.forEach(element => {
      faimages = element.compCategories

      if (faimages == "BEZEL") {
        faFlexvalue = {
          "type": "updateComponent",
          "config": {
            "key": "bezelImgUUID",
            "properties": {
              "iconTextClass": "ciscoTCFlexImg col-lg-10 show"
            }
          }
        }
      }
      if (faimages == "BUMPER") {
        faFlexvalue = {
          "type": "updateComponent",
          "config": {
            "key": "bumperImgUUID",
            "properties": {
              "iconTextClass": "ciscoTCFlexImg col-lg-10 show"
            }
          }
        }
      }
      if (faimages == "COVER") {
        faFlexvalue = {
          "type": "updateComponent",
          "config": {
            "key": "coverImgUUID",
            "properties": {
              "iconTextClass": "ciscoTCFlexImg col-lg-10 show"
            }
          }
        }
      }
      if (faimages == "LABEL") {
        faFlexvalue = {
          "type": "updateComponent",
          "config": {
            "key": "labelImgUUID",
            "properties": {
              "iconTextClass": "ciscoTCFlexImg col-lg-10 show"
            }
          }
        }
      }
      if (faimages == "SCREW") {
        faFlexvalue = {
          "type": "updateComponent",
          "config": {
            "key": "screwImgUUID",
            "properties": {
              "iconTextClass": "ciscoTCFlexImg col-lg-10 show"
            }
          }
        }
      }

      flexarr.push(faFlexvalue);
    });
    flexarr.forEach(element => {
      actionService.handleAction(element, instance);
    });

  }
  //whishlist update on complete task
  getCiscoTCWishList(action: any, instance: any, actionService, responseData?: any) {
    this.contextService.addToContext("ciscoReworkWLTasksRes1", [])
    let reworkWishList
    var wishListData = this.contextService.getDataByString(action.config.key);
    wishListData = wishListData && wishListData instanceof Array ? wishListData : [];
    this.contextService.addToContext(action.config.key, [])
    wishListData && wishListData.forEach(element => {
      let str
      if (element.location == null) {
        str = element.part
      } else {
        str = element.part + ', ' + element.location;
      }
      reworkWishList = [
        {
          "type": "context",
          "config": {
            "requestMethod": "addToExistingContext",
            "target": "ciscoReworkWLTasksRes1",
            "sourceData": {
              "Part Details": [
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "text": "Part:",
                  "textValue": str,
                  "class": "greyish-black overflow-wrap width-273"
                },
                {
                  "ctype": "block-text",
                  "uuid": "StockUUID",
                  "textValue": element.defect,
                  "class": "greyish-black overflow-wrap width-273"
                }
              ],
              "Qty": [
                {
                  "ctype": "block-text",
                  "uuid": "ciscoDebugWishlistQtyUUID",
                  "text": element.qty
                }
              ],
              "parentUUID": "#createdComponentUUID"
            }
          }
        },
        {
          "type": "context",
          "hookType": "afterInit",
          "config": {
            "requestMethod": "add",
            "key": "ciscoDebugWishListLength",
            "data": "contextLength",
            "sourceContext": "ciscoReworkWLTasksRes1"
          }
        },
        {
          "type": "errorPrepareAndRender",
          "hookType": "afterInit",
          "config": {
            "key": "wishListButtonUUID",
            "properties": {
              "titleValue": "WishList ({0})",
              "isShown": true
            },
            "valueArray": [
              "#ciscoDebugWishListLength"
            ]
          }
        }
      ]
      reworkWishList && reworkWishList.forEach(item => {
        actionService.handleAction(item, instance);
      })
    });
  }
  //FRU complete task
  onCompleteFRUTask(fru: any) {
    // let actionsring ="click";
    //action.config.action;
    let frucompleteactions = [
      {
        "type": "microservice",
        "eventSource": "click",
        "config": {
          "microserviceId": "getWhistlistItems",
          "isLocal": false,
          "LocalService": "assets/Responses/tcprepdummydata.json",
          "requestMethod": "get",
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
                  "key": "getwhishlistItemsdata",
                  "data": "responseData"
                },
                "eventSource": "click"
              },
              {
                "type": "whislistItemUpdateTC",
                "config": {
                  "key": "#getwhishlistItemsdata"
                },
                "eventSource": "click"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "FRUTaskUUID" + this.fru,
                  "properties": {
                    "expanded": false,
                    "disabled": false,
                    "header": {
                      "title": "Add Part - " + this.frucurrenttaskdata.description,
                      "svgIcon": "replace",
                      "css": "color:black",
                      "status": "Daignosis",
                      "statusIcon": "check_circle",
                      "statusClass": "complete-status",
                      "class": "mat-expansion-panel-header-title heading2"
                    }
                  }
                },
                "eventSource": "click"
              },
              {
                "type": "updateComponent",
                "config": {
                  "key": "frusoftwareCompleteUUID" + this.fru,
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
        "type": "whislistItemUpdateTC",
        "eventSource": "click",
        "config": {
          "key": "#getwhishlistItemsdata"
        }
      },
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
      }
    ]
    return frucompleteactions;
    //this.executeActions(frucompleteactions, instance, actionService);
  }

  TnCcreateECOpanels(action: any, instance: any, actionService: any) {    
    let ecopanelsdata    
    if (action.config.data && action.config.data.startsWith("#")) {
      ecopanelsdata = this.contextService.getDataByString(action.config.data);      
    }else {
      ecopanelsdata = action.config.data;
    }     
    if (ecopanelsdata && ecopanelsdata !== null) {
      for (this.eco = 0; this.eco < ecopanelsdata.length; this.eco++) {
        let ecoCount = this.eco + 1;
        if (ecopanelsdata[this.eco] && ecopanelsdata[this.eco].taskType == "ECO") {
          this.ecocurrenttaskdata = ecopanelsdata[this.eco]
          actionService.handleAction({
            "type": "deleteComponent",
            "config": {
              "key": "ecoUnBookTaskUUID" + ecoCount
            }
          }, instance);

          this.actions = {
            "type": "createComponent",
            "config": {
              "targetId": "pageUUID",
              "containerId": "prebodysectionone",
              "data": {
                "ctype": "taskPanel",
                "splitView": true,
                "header": {
                  "title": "Add Part - " + this.ecocurrenttaskdata.part,
                  "svgIcon": "replace",
                  "css": "color:black",
                  "status": "ECO",
                  "statusIcon": "info_outline",
                  "statusClass": "eco-icon"
                },
                "expanded": "false",
                "hideToggle": "true",
                "bodyclass": "splitView",
                "panelClass": "",
                "leftDivclass": "width:50%;",
                "rightDivclass": "width:50%",
                "taskPanelHeaderClass": "task-panel-header-color-light-grey",
                "uuid": "ecoUnBookTaskUUID" + ecoCount,
                "visibility": false,
                "hooks": [
                  {
                    "type": "microservice",
                    "hookType": "afterInit",
                    "config": {
                      "microserviceId": "getAvailableQuantities",
                      "isLocal": false,
                      "LocalService": "assets/Responses/tcprepdummydata.json",
                      "requestMethod": "get",
                      "params": {
                        "componentPartNo": this.ecocurrenttaskdata.componentPartNo,
                        "wareHouseId": "#UnitInfo.WAREHOUSE_ID",
                        "conditionId": "1,3",
                        "locationId": "#userSelectedLocation"
                      }
                    },
                    "responseDependents": {
                      "onSuccess": {
                        "actions": [
                          {
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "getAvaliablequantitiesdataECO" + ecoCount,
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "stringOperation",
                            "config": {
                              "key": "ciscoDebugAvailQtyResECO" + ecoCount,
                              "lstr": "#getAvaliablequantitiesdataECO" + ecoCount,
                              "rstr": "Available",
                              "operation": "concat",
                              "concatSymbol": " "
                            }
                          },
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "ciscoDebugStockQty" + ecoCount,
                              "updateParent": true,
                              "properties": {
                                "text": "#ciscoDebugAvailQtyResECO" + ecoCount,
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
                  }
                ],
                "validations": [],
                "actions": [
                  {
                    "type": "deleteComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "#currentTaskUUID"
                    }
                  },
                  {
                    "type": "context",
                    "eventSource": "click",
                    "config": {
                      "requestMethod": "add",
                      "key": "currentTaskUUID",
                      "data": ""
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "replaceIconUUID",
                      "properties": {
                        "disabled": false
                      }
                    }
                  },
                  {
                    "type": "updateComponent",
                    "eventSource": "click",
                    "config": {
                      "key": "manualIconUUID",
                      "properties": {
                        "disabled": false
                      }
                    }
                  }
                ],
                "items": this._returnLeftSideItemsEcoUnbookpanels(action, instance, actionService),
                "rightItems": this._returnRightSideItemsEcoUnbookpanels(action, instance, actionService, ecoCount),
                "footer": [
                  {
                    "ctype": "checkbox",
                    "uuid": "ecoTaskUnbookNoReplaceUUID" + ecoCount,
                    "name": "ecoTaskUUIDCloseEco",
                    "hooks": [],
                    "validations": [],
                    "submitable": true,
                    "label": "Not required to Close ECO",
                    "labelPosition": "after",
                    "checkboxContainer": "mac-checkbox",
                    "actions": [
                      {
                        "type": "context",
                        "config": {
                          "requestMethod": "add",
                          "key": "ecoUnbookTaskUUIDCloseEcodata" + ecoCount,
                          "data": "formData"
                        },
                        "eventSource": "click"
                      },
                      {
                        "type": "condition",
                        "config": {
                          "operation": "isEqualTo",
                          "lhs": "#ecoUnbookTaskUUIDCloseEcodata" + ecoCount + ".ecoTaskUUIDCloseEco",
                          "rhs": true
                        },
                        "eventSource": "click",
                        "responseDependents": {
                          "onSuccess": {
                            "actions": [
                              {
                                "type": "updateComponent",
                                "config": {
                                  "key": "ECOsoftwareCompleteUUID" + ecoCount,
                                  "properties": {
                                    "disabled": false
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
                  },
                  {
                    "ctype": "spacer",
                    "uuid": "emptySpaceUUID",
                    "class": "empty-space"
                  },
                  {
                    "ctype": "button",
                    "color": "primary",
                    "text": "Complete",
                    "uuid": "ECOsoftwareCompleteUUID" + ecoCount,
                    "parentuuid": "softwareTaskUUID",
                    "visibility": true,
                    "disabled": false,
                    "type": "submit",
                    "tooltip": "",
                    "hooks": [],
                    "validations": [],
                    "actions": this.checkUnbookbtntext(action, instance, actionService, ecoCount)
                  }
                ]
              }
            },
            "eventSource": "click"
          }
          //console.log("ecotasks = ",actions);
          actionService.handleAction(this.actions, instance);

        }

      }
    }
  }

  _returnLeftSideItemsEcoUnbookpanels(action: any, instance: any, actionService: any) {
    let leftSideItems = [];
    // if (action.config.processType !== undefined &&
    //   (action.config.processType == "replace" ||
    //     action.config.processType == "fit")) {
    leftSideItems = [
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Sub Assm",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": this.ecocurrenttaskdata.subAssm,
            "labelClass": "greyish-black"
          }
        ]
      },
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Location",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": this.ecocurrenttaskdata.location,
            "labelClass": "greyish-black"
          }
        ]
      },      
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Part",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": this.ecocurrenttaskdata.part,
            "labelClass": "greyish-black"
          }
        ]
      },     
      {
        "ctype": "flexFields",
        "uuid": "listTitleUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Defect",
            "labelClass": "greyish-black subtitle1"
          },
          {
            "ctype": "label",
            "text": this.ecocurrenttaskdata.defect,
            "labelClass": "greyish-black"
          }
        ]
      },      
    ];
    //}
    return leftSideItems;
  }

  _returnRightSideItemsEcoUnbookpanels(action: any, instance: any, actionService: any, ecoCount: any) {
    let rightSideItems = [];
    let AvailableQuantity = this.contextService.getDataByString("#ciscoDebugAvailQtyResECO" + ecoCount)
    let qty = this.ecocurrenttaskdata.qty;
    // if (!isNewPanel) {
    //   qty = action.config.taskPanelData.qty;
    // }
    rightSideItems = [
      {
        "ctype": "flexFields",
        "uuid": "ciscoAPDescriptiontextFlexUUID",
        "flexClass": "cisco-debug-label-container-30-50",
        "items": [
          {
            "ctype": "label",
            "text": "Description",
            "labelClass": "subtitle1"
          },
          {
            "ctype": "label",
            "uuid": "ciscoT&CDescriptionLabelValueUUID",
            "text": this.ecocurrenttaskdata.description,
            "labelClass": "greyish-black",
            "labelPosition": "left"
          }
        ]
      },     
      {
        "ctype": "flexFields",
        "containerId": "expansionPanelContentFirstHalf",
        "uuid": "ciscoFailCodeTitleUUID",
        "flexClass": "label-container-radio-group-parent",
        "items": this._getDataForTable(action, actionService, qty, AvailableQuantity, ecoCount)
      }
    ];
    //}
    return rightSideItems;
  }

  
  checkUnbookbtntext(action: any, instance: any, actionService: any, ecoCount: any) {
    action.config.action;
    console.log(ecoCount);
    let pid = this.contextService.getDataByString("#UnitInfo.PART_NO");
    let onCompleteECOtaskActions = [];
    onCompleteECOtaskActions.push(
      {
        "type": "condition",
        "eventSource": "click",
        "config": {
          "operation": "isEqualTo",
          "lhs": "#ecoUnbookTaskUUIDCloseEcodata" + ecoCount + ".ecoTaskUUIDCloseEco",
          "rhs": true
        },
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
                "type": "executetcDefectOperation",
                "config": {
                  "defectCurrentCode": this.ecocurrenttaskdata.defect,
                  "defectRecords": "#getCiscoTCDefectRecords",
                  "configDebugWLData": "#getwhishlistItemsdata",
                  "currentActionCode": "OPEN-FIT",
                  "defectList": "getCiscoTCDefectRecords",
                  "key": "defectOperation"
                },
                "eventSource": "click"
              },
              {
                "type": "getSerialNoFromAssemblyCode",
                "config": {
                  "key": "tncSerialNumber",
                  "pcbList": "#tncPCBRes",
                  "assemblyCode": this.ecocurrenttaskdata.assemblyCode
                },
                "eventSource": "click"
              },
              {
                "type": "ciscoUnissueAndUndoFAForEcoTask",
                "eventSource": "click",
                "config": {
                  "defectCurrentCode": this.ecocurrenttaskdata.defect,
                  "currentActionCode": "OPEN-FIT",
                  "wishlist": "#getwhishlistItemsdata",
                  "afterAction": [
                    {
                      "type": "microservice",
                      "eventSource": "click",
                      "config": {
                        "microserviceId": "performFA",
                        "requestMethod": "post",
                        "body": {
                          "updateFailureAnalysisRequest": {
                            "actionCodeChangeList": {
                              "actionCodeChange": [{
                                "actionCode": "CLOSE",
                                "operation": "Add",
                                "ecoCode": {
                                  "value": pid + "--" + this.ecocurrenttaskdata.defect
                                }
                              }]
                            },
                            "assemblyCodeChangeList": {
                              "assemblyCodeChange": [
                                {
                                  "assemblyCode": this.ecocurrenttaskdata.assemblyCode,
                                  "operation": "Update",
                                  "serialNumber": "#tncSerialNumber"
                                }
                              ]
                            },
                            "ecoCodeChangeList": {
                              "ecoCodeChange": [{
                                "ecoCode": pid + "--" + this.ecocurrenttaskdata.defect,
                                "operation": "Update"
                              }]
                            },
                            "bcn": "#UnitInfo.ITEM_BCN"
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
                        "toBeStringified": true
                      },
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ecoUnBookTaskUUID" + ecoCount,
                                "properties": {
                                  "expanded": false,
                                  "disabled": false,
                                  "header": {
                                    "title": "Add Part - " + this.ecocurrenttaskdata.part,
                                    "svgIcon": "replace",
                                    "css": "color:black",
                                    "status": "ECO",
                                    "statusIcon": "check_circle",
                                    "statusClass": "complete-status",
                                    "class": "mat-expansion-panel-header-title heading2"
                                  }
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ecoTaskUnbookNoReplaceUUID" + ecoCount,
                                "properties": {
                                  "disabled": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ECOsoftwareCompleteUUID" + ecoCount,
                                "properties": {
                                  "disabled": true
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "deleteComponent",
                              "eventSource": "click",
                              "config": {
                                "key": "ecoUnBookTaskUUID" + ecoCount,
                              }
                            },                           
                            {
                              "type": "microservice",
                              "eventSource": "click",
                              "config": {
                                "microserviceId": "getWhistlistItems",
                                "isLocal": false,
                                "LocalService": "assets/Responses/tcprepdummydata.json",
                                "requestMethod": "get",
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
                                        "key": "getwhishlistItemsdata",
                                        "data": "responseData"
                                      },
                                      "eventSource": "click"
                                    },
                                    {
                                      "type": "whislistItemUpdateTC",
                                      "config": {
                                        "key": "#getwhishlistItemsdata"
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
                                      "type": "whislistItemUpdateTC",
                                      "config": {
                                        "key": "#errorDisp"
                                      },
                                      "eventSource": "click"
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
                                    },
                                    {
                                      "type": "updateComponent",
                                      "config": {
                                        "key": "wishListButtonUUID",
                                        "properties": {
                                          "text": "Wish List (0)"
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
                                "key": "ecoUnBookTaskUUID" + ecoCount,
                                "properties": {
                                  "expanded": false,
                                  "disabled": false,
                                  "header": {
                                    "title": "Add Part - " + this.ecocurrenttaskdata.part,
                                    "svgIcon": "replace",
                                    "css": "color:black",
                                    "status": "ECO",
                                    "statusIcon": "check_circle",
                                    "statusClass": "complete-status",
                                    "class": "mat-expansion-panel-header-title heading2"
                                  }
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ecoTaskUnbookNoReplaceUUID" + ecoCount,
                                "properties": {
                                  "disabled": true,
                                }
                              },
                              "eventSource": "click"
                            },
                            {
                              "type": "updateComponent",
                              "config": {
                                "key": "ECOsoftwareCompleteUUID" + ecoCount,
                                "properties": {
                                  "disabled": true
                                }
                              },
                              "eventSource": "click"
                            },
                          ]
                        }
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
                "type": "microservice",
                "eventSource": "click",
                "config": {
                  "microserviceId": "performFA",
                  "requestMethod": "post",
                  "body": {
                    "updateFailureAnalysisRequest": {
                      "actionCodeChangeList": {
                        "actionCodeChange": [{
                          "actionCode": "OPEN-FIT",
                          "operation": "Add",
                          "assemblyCode": {
                            "value": this.ecocurrenttaskdata.assemblyCode
                          },
                          "ecoCode": {
                            "value": pid + "--" + this.ecocurrenttaskdata.defect
                          }
                        }]
                      },
                      "assemblyCodeChangeList": {
                        "assemblyCodeChange": [{
                          "assemblyCode": this.ecocurrenttaskdata.assemblyCode,
                          "operation": "Update",
                          "serialNumber": this.getSerialNuberByAssemblyCode(this.ecocurrenttaskdata.assemblyCode)
                        }]
                      },
                      "ecoCodeChangeList": {
                        "ecoCodeChange": [{
                          "ecoCode": pid + "--" + this.ecocurrenttaskdata.defect,
                          "operation": "Update"
                        }]
                      },
                      "bcn": "#UnitInfo.ITEM_BCN"
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
                  "toBeStringified": true
                },
                "responseDependents": {
                  "onSuccess": {
                    "actions": [{
                      "type": "microservice",
                      "config": {
                        "microserviceId": "performIssueParts",
                        "requestMethod": "post",
                        "isLocal": false,
                        "LocalService": "assets/Responses/getHPFAHistory.json",
                        "body": {
                          "issuePartsRequest": {
                            "bcn": "#UnitInfo.ITEM_BCN",
                            "actionCodeChange": {
                              "operation": "Add",
                              "actionCode": "OPEN-FIT",
                              "ecoCode": {
                                "value": pid + "--" + this.ecocurrenttaskdata.defect
                              }
                            },
                            "nonInventoryPartList": {
                              "nonInventoryPart": this.tncEcoflexfielddata(action)
                            }
                          },
                          "userPwd": {
                            "username": "#userAccountInfo.PersonalDetails.USERID",
                            "password": "#loginUUID.password"
                          },
                          "ip": "::1",
                          "callSource": "FrontEnd",
                          "apiUsage_LocationName": "#UnitInfo.GEONAME",
                          "apiUsage_ClientName": "#UnitInfo.CLIENTNAME"
                        },
                        "toBeStringified": true
                      },
                      "eventSource": "click",
                      "responseDependents": {
                        "onSuccess": {
                          "actions": [
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "ecoUnBookTaskUUID" + ecoCount,
                              "properties": {
                                "expanded": false,
                                "disabled": false,
                                "header": {
                                  "title": "Add Part - " + this.ecocurrenttaskdata.part,
                                  "svgIcon": "replace",
                                  "css": "color:black",
                                  "status": "ECO",
                                  "statusIcon": "check_circle",
                                  "statusClass": "complete-status",
                                  "class": "mat-expansion-panel-header-title heading2"
                                }
                              }
                            },
                            "eventSource": "click"
                          },                          
                          {
                            "type": "updateComponent",
                            "config": {
                              "key": "ECOsoftwareCompleteUUID" + ecoCount,
                              "properties": {
                                "disabled": true
                              }
                            },
                            "eventSource": "click"
                          },
                          {
                            "type": "microservice",
                            "eventSource": "click",
                            "config": {
                              "microserviceId": "getWhistlistItems",
                              "isLocal": false,
                              "LocalService": "assets/Responses/tcprepdummydata.json",
                              "requestMethod": "get",
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
                                      "key": "getwhishlistItemsdata",
                                      "data": "responseData"
                                    },
                                    "eventSource": "click"
                                  },
                                  {
                                    "type": "whislistItemUpdateTC",
                                    "config": {
                                      "key": "#getwhishlistItemsdata"
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
                                    "type": "whislistItemUpdateTC",
                                    "config": {
                                      "key": "#errorDisp"
                                    },
                                    "eventSource": "click"
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
                                  },
                                  {
                                    "type": "updateComponent",
                                    "config": {
                                      "key": "wishListButtonUUID",
                                      "properties": {
                                        "text": "Wish List (0)"
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
                          "actions": [{
                            "type": "context",
                            "config": {
                              "requestMethod": "add",
                              "key": "errorissuePart",
                              "data": "responseData"
                            }
                          },
                          {
                            "type": "condition",
                            "config": {
                              "operation": "isEqualTo",
                              "lhs": "#errorissuePart",
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
                                        "titleValue": "#errorissuePart",
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
                                        "titleValue": "#errorissuePart",
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
                    }]
                  },
                  "onFailure": {
                    "actions": [{
                      "type": "context",
                      "config": {
                        "requestMethod": "add",
                        "key": "performFAError",
                        "data": "responseData"
                      }
                    },
                    {
                      "type": "condition",
                      "config": {
                        "operation": "isEqualTo",
                        "lhs": "#performFAError",
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
                                  "titleValue": "#performFAError",
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
        }
      }
    );
    return onCompleteECOtaskActions;
  }
  
  tncEcoflexfielddata(action : any) {
    let nonInventoryList = []
    nonInventoryList.push({
      "part": this.ecocurrenttaskdata.compPartno,
      "quantity": this.ecocurrenttaskdata.qty,
      "componentLocationDescription": this.ecocurrenttaskdata.location,
      "flexFieldList": {
        "flexField": [
          {
            "name": "PCB_PN",
            "value": this.ecocurrenttaskdata.subAssm
          },
          {
            "name": "PCB_SN",
            "value": "#UnitInfo.SERIAL_NO",
          }
        ]
      }
    });
    return nonInventoryList;
  }

  getSerialNuberByAssemblyCode(assemblyCode) {
    let TncPCBs = this.contextService.getDataByString("#tncPCBRes");
    let index = TncPCBs.filter(e => e.assemblyCode == assemblyCode);
    console.log(index[0].serialNumber);
    return index[0].serialNumber;
  }
}
